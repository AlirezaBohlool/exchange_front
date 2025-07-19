import React, { createContext, useContext, useState, useCallback } from "react";

interface SnackbarContextType {
  showSnackbar: (message: string, type?: "success" | "error" | "info") => void;
}

const SnackbarContext = createContext<SnackbarContextType>({ showSnackbar: () => {} });

export function useSnackbar() {
  return useContext(SnackbarContext);
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "info">("info");

  const showSnackbar = useCallback((msg: string, t: "success" | "error" | "info" = "info") => {
    setMessage(msg);
    setType(t);
    setOpen(true);
    setTimeout(() => setOpen(false), 3000);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {open && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300
            ${type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"}
          `}
        >
          {message}
        </div>
      )}
    </SnackbarContext.Provider>
  );
}
