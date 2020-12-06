const { getPost } = require("../post");
const { json } = require("@remix-run/data");

exports.loader = async ({ params }) => {
  let post = await getPost(params.post);

  let oneDay = 86400;
  let secondsSincePublished = (new Date() - post.attributes.published) / 1000;
  let barelyPublished = secondsSincePublished < oneDay;

  // If this was barely published then only cache it for one minute, giving you
  // a chance to make edits and have them show up within a minute for visitors.
  // But after the first day, then cache for a week, then if you make edits
  // they'll show up eventually, but you don't have to rebuild and redeploy to
  // get them there.
  let maxAge = barelyPublished ? 60 : oneDay * 7;

  // If the max-age has expired, we'll still send the current cached version of
  // the post to visitors until the CDN has cached the new one. If it's been
  // expired for more than one month though (meaning nobody has visited this
  // page for a month) we'll make them wait to see the newest version.
  let swr = oneDay * 30;

  return json(post, {
    headers: {
      "cache-control": `public, max-age=${maxAge}, stale-while-revalidate=${swr}`,
    },
  });
};
