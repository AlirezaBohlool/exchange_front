import type { Route } from "./+types/home";
import { Home as HomeComponent } from "../components/home/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "صرافی آلتربیت" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <HomeComponent />;
}
