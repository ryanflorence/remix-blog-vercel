import React from "react";
import { useRouteData } from "@remix-run/react";

export function headers({ loaderHeaders }) {
  return {
    "cache-control": loaderHeaders.get("cache-control"),
  };
}

export function meta({ data: post }) {
  return {
    title: post.attributes.title,
  };
}

export default function Post() {
  let post = useRouteData();
  return (
    <>
      <header>
        <h1>{post.attributes.title}</h1>
        <p>{post.attributes.description}</p>
      </header>
      <main dangerouslySetInnerHTML={{ __html: post.html }} />
    </>
  );
}
