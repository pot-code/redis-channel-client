import React from "react"
import { createRoot } from "react-dom/client"
import { createTheme, MantineProvider } from "@mantine/core"
import App from "./app"
import setup from "./setup"
import "./styles/main.scss"

const root = createRoot(document.getElementById("root") as Element)
const theme = createTheme({})

setup().then(() =>
  root.render(
    <React.StrictMode>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </React.StrictMode>,
  ),
)
