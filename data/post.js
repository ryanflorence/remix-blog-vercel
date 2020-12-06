const fs = require("fs").promises;
const path = require("path");
const parseFrontMatter = require("front-matter");
const remark = require("remark");
const html = require("remark-html");
const config = require("../blog.config.json");

exports.getPost = async (name) => {
  let contents =
    process.env.NODE_ENV === "production"
      ? await getPostFromGitHub(name)
      : await getPostFromFS(name);

  let { body, attributes } = parseFrontMatter(contents);
  let result = await remark().use(html).process(body);

  return { name, html: result.contents, attributes };
};

exports.getPosts = async () => {
  let files =
    process.env.NODE_ENV === "production"
      ? await getPostsFromGitHub()
      : await getPostsFromFS();

  return files.map(({ name, contents }) => {
    let { _, attributes } = parseFrontMatter(contents);
    return { name: name.replace(/\.md$/, ""), attributes };
  });
};

////////////////////////////////////////////////////////////////////////////////
async function getPostsFromFS() {
  let dir = path.join(__dirname, "..", "app", "posts");
  let files = (await fs.readdir(dir)).filter((file) => !file.startsWith("."));
  return Promise.all(
    files.map(async (name) => {
      let contents = await fs.readFile(path.join(dir, name));
      return { name, contents: contents.toString() };
    })
  );
}

async function getPostsFromGitHub() {
  let url = `https://api.github.com/repos/${config.repo}/contents/app/posts?ref=${config.branch}`;
  let res = await fetch(url, {
    headers: {
      authorization: `token ${process.env.GH_TOKEN}`,
    },
  });
  let files = await res.json();
  return Promise.all(
    files.map(async ({ name, download_url }) => {
      let contentsRes = await fetch(download_url);
      let contents = await contentsRes.text();
      return { name, contents };
    })
  );
}

async function getPostFromFS(param) {
  let dir = path.join(__dirname, "..", "app", "posts");
  let file = await fs.readFile(path.join(dir, `${param}.md`));
  return file.toString();
}

async function getPostFromGitHub(name) {
  let url = `https://raw.githubusercontent.com/${config.repo}/${config.branch}/app/posts/${name}.md`;
  let res = await fetch(url);
  return res.text();
}
