import type { RouteObject } from "react-router";
import RootLayout from "@/pages/RootLayout";
import Dashboard from "@/pages/Dashboard";
import Apps from "@/pages/Apps";
import AppDetails from "@/pages/AppDetails";
import AppLogs from "@/pages/AppLogs";
import Processes from "@/pages/Processes";
import Environment from "@/pages/Environment";
import Logs from "@/pages/Logs";
import Domains from "@/pages/Domains";
import Databases from "@/pages/Databases";

export const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "apps",
        element: <Apps />,
      },
      {
        path: "apps/:id",
        element: <AppDetails />,
      },
      {
        path: "apps/:id/logs",
        element: <AppLogs />,
      },
      {
        path: "processes",
        element: <Processes />,
      },
      {
        path: "domains",
        element: <Domains />,
      },
      {
        path: "databases",
        element: <Databases />,
      },
      {
        path: "environment",
        element: <Environment />,
      },
      {
        path: "logs",
        element: <Logs />,
      },
    ],
  },
];
