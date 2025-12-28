import type { RouteObject } from "react-router";
import RootLayout from "@/pages/RootLayout";
import Apps from "@/pages/Apps";
import AppDetails from "@/pages/AppDetails";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";

export const mainRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Apps />,
      },
      {
        path: "apps/:id",
        element: <AppDetails />,
      },
    ],
  },
];
