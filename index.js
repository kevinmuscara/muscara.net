// List of markdown files — can be automated later if you set up a JSON or index file
const postFiles = [
  "posts/first-post.md",
  "posts/second-post.md"
];

const postsContainer = document.getElementById("posts");

postFiles.forEach(async (filePath) => {
  try {
    const response = await fetch(filePath);
    const markdown = await response.text();
    const html = marked.parse(markdown);

    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.innerHTML = html;

    postsContainer.appendChild(postDiv);
  } catch (err) {
    console.error(`Error loading ${filePath}`, err);
  }
});
