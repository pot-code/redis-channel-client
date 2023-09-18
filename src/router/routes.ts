import React from "react"
import { RouteObject } from "react-router-dom"
import HomeView from "../views/home"

export const routes: RouteObject[] = [
  {
    path: "/",
    element: React.createElement(HomeView),
  },
]
