import LoginPage from "page/LoginPage";
import MainPage from "page/MainPage";
import Page404 from "page/Page404";
import React, { cloneElement } from "react";
import { useRoutes, Navigate } from "react-router-dom"

function Router() {
  const routes = useRoutes([
    {
      path: 'zdrive',
      children: [
        { element: <Navigate to="/zdrive/login" replace />, index: true },
        { path: 'login', element: <LoginPage />},
        { path: 'main', element: <MainPage />},
        { path: '*', element: <Page404 />}
      ]
    }
  ])
  if(!routes) return null;

  const clone = cloneElement(routes, {key: routes.props.children.key})

  return (clone)
}

export default Router;