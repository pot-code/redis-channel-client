import React from "react"

async function installWdyr() {
  if (import.meta.env.VITE_WDYR_ENABLED === "true") {
    const { default: wdyr } = await import("@welldone-software/why-did-you-render")
    wdyr(React, {
      exclude: [/^BrowserRouter/, /^Link/, /^Route/],
      trackHooks: true,
      trackAllPureComponents: true,
    })
  }
}

export default async function setup() {
  await installWdyr()
}
