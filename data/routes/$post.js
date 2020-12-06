const { getPost } = require("../post");
const { json } = require("@remix-run/data");

exports.loader = async ({ params }) => {
  return json(await getPost(params.post), {
    headers: {
      "cache-control": "max-age=10",
    },
  });
};
