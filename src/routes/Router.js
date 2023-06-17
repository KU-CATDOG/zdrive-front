import React, { Suspense, lazy, cloneElement } from "react";
import { useRoutes, Navigate } from "react-router-dom";

const LoginPage = lazy(() => import("page/LoginPage"));
const MainPage = lazy(() => import("page/MainPage"));
const ProjectAddPage = lazy(() => import("page/ProjectAddPage"));
const ProjectDetailPage = lazy(() => import("page/ProjectDetailPage"));
const ProjectListPage = lazy(() => import("page/ProjectListPage"));
const Page404 = lazy(() => import("page/Page404"));

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
            { path: "add", element: <ProjectAddPage /> },
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

  return <Suspense fallback={<div>Loading...</div>}>{clone}</Suspense>;
}

export default Router;
