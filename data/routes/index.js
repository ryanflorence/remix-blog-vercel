const { getPosts } = require("../post");
const { json } = require("@remix-run/data");

exports.loader = async () => {
  return json(await getPosts(), {
    headers: {
      "cache-control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
};
