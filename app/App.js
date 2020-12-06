import React from "react";
import { Meta, Styles, Routes } from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />

        <link
          rel="alternate"
          href="/feed.xml"
          title="Feed"
          type="application/atom+xml"
        ></link>
        <link rel="feed" href="/feed.xml" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://unpkg.com/@exampledev/new.css@1.1.3/new.css"
        />

        <Styles />
      </head>
      <body>
        <Routes />
        {/* there's little reason to include JS on a markdown blog */}
        {/* <Scripts /> */}
      </body>
    </html>
  );
}
