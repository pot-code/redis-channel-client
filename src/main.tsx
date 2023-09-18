import { MantineProvider } from "@mantine/core"
import React from "react"
import { createRoot } from "react-dom/client"

import App from "./app"
import setup from "./setup"

import "./styles/main.scss"

const root = createRoot(document.getElementById("root") as Element)

setup().then(() =>
  root.render(
    <React.StrictMode>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <App />
      </MantineProvider>
    </React.StrictMode>,
  ),
)
