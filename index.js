const express = require("express");
const { createRequestHandler } = require("@remix-run/express");
const sortBy = require("sort-by");
const { getPosts } = require("./data/post");
const config = require("./blog.config.json");

const app = express();

app.get("/feed.xml", async (req, res) => {
  let posts = await getPosts();

  let entries = posts
    .sort(sortBy("-attributes.published"))
    .map((post) => {
      let href = `${config.url}/${post.name}`;
      return `
        <entry>
          <title>${post.attributes.title}</title>
          <link href="${href}"/>
          <id>${href}</id>
          <updated>${
            post.attributes.updated || post.attributes.published
          }</updated>
          <summary>${post.attributes.description}</summary>
        </entry>
    `;
    })
    .join("\n");

  let text = `<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>${config.name}</title>
      <link href="${config.url}"/>
      <id>${config.url}</id>
      ${entries}
    </feed>
  `;

  res.set("content-type", "application/xml");
  res.send(text);
});

app.all(
  "*",
  createRequestHandler({
    getLoadContext: () => config,
    enableSessions: false,
  })
);

module.exports = app;
