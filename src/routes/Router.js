import LoginPage from "page/LoginPage";
import MainPage from "page/MainPage";
import Page404 from "page/Page404";
import ProjectDetailPage from "page/ProjectDetailPage";
import ProjectListPage from "page/ProjectListPage";
import React, { cloneElement } from "react";
import { useRoutes, Navigate } from "react-router-dom";

function Router() {
  const routes = useRoutes([
    {
      path: "zdrive",
      children: [
        { element: <Navigate to="/zdrive/main" replace />, index: true },
        { path: "login", element: <LoginPage /> },
        { path: "main", element: <MainPage /> },
        {
          path: "project",
          children: [
            { path: "list", element: <ProjectListPage /> },
            { path: "detail", element: <ProjectDetailPage /> },
          ],
        },
      ],
    },
    { path: "*", element: <Page404 /> },
  ]);
  if (!routes) return null;

  const clone = cloneElement(routes, { key: routes.props.children.key });

  return clone;
}

export default Router;
