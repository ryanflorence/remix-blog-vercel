import React from "react";
import { useRouteData, Link } from "@remix-run/react";

export function headers() {
  return {
    "cache-control": "public, max-age=10",
  };
}

export function meta() {
  return {
    title: "Blog Template",
    description: "This is a blog template, enjoy!",
  };
}

export default function Index() {
  let posts = useRouteData();
  return (
    <div>
      <header>
        <h1>My Neglected Blog</h1>
      </header>
      <main>
        <ul>
          {posts.map((post) => (
            <li key={post.name}>
              <Link to={post.name}>{post.attributes.title}</Link>
              <br />
              <small>{post.attributes.description}</small>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
