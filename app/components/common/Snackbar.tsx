import React from "react";
import { SnackbarProvider as NotistackProvider, useSnackbar as useNotistack } from "notistack";

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotistackProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={3000}
      preventDuplicate
      style={{ fontFamily: 'var(--font-morabba, sans-serif)' }}
    >
      {children}
    </NotistackProvider>
  );
}

export function useSnackbar() {
  const { enqueueSnackbar } = useNotistack();
  return {
    showSnackbar: (message: string, type: "success" | "error" | "info" = "info") =>
      enqueueSnackbar(message, { variant: type }),
  };
}
