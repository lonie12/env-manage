import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import { mainRoutes } from "@/lib/routes/main.routes";
import { ThemeProvider } from "@/context";

const router = createBrowserRouter(mainRoutes);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);
