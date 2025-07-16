import Login from "~/components/auth/login";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ورود" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function LoginPage() {
  return <Login />;
}
