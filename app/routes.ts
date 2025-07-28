import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("dashboard", "routes/dashboard.tsx", {}, [
    index("routes/dashboard/index.tsx"),
    route("profile", "routes/dashboard/profile.tsx"),
    route("settings", "routes/dashboard/settings.tsx"),
    route("buy", "routes/dashboard/buy.tsx"),
    route("sell", "routes/dashboard/sell.tsx"),
    route("withdraw-requests", "routes/dashboard/withdrawalRequests.tsx"),
    route("wallet", "routes/dashboard/wallet.tsx"),
    route("banks", "routes/dashboard/bankAccounts.tsx"),
    route("transactions", "routes/dashboard/transactions.tsx"),
    route("pending-requests", "routes/dashboard/admin/pendingRequests.tsx"),
    route("tickets", "routes/dashboard/tickets.tsx"),
    route("tickets/:ticketId", "routes/dashboard/tickets/$ticketId.tsx"),
    
    route("support/tickets", "routes/dashboard/admin/support-tickets/index.tsx"),
    route("support/tickets/:ticketId", "routes/dashboard/admin/support-tickets/$ticketId.tsx"),

  ]),
] satisfies RouteConfig;
