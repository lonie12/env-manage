import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import { mainRoutes } from "@/lib/routes/main.routes";
import { ThemeProvider, AuthProvider } from "@/context";
import { Toaster } from "@/lib/toast";

const router = createBrowserRouter(mainRoutes, {
  basename: "/emanage",
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthProvider>
  </ThemeProvider>
);
