const { getPosts } = require("../post");
const { json } = require("@remix-run/data");

exports.loader = async () => {
  return json(await getPosts(), {
    headers: {
      "cache-control": "max-age=10",
    },
  });
};
