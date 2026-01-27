"use server";

import fs from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "../../packages/content/posts");

export interface SavePostOptions {
  title: string;
  content: string;
  draft?: boolean;
  existingSlug?: string; // For preserving slug when editing
}

export async function savePost(options: SavePostOptions) {
  const { title, content, draft = true, existingSlug } = options;

  // Use existing slug if editing, otherwise create from title
  const slug =
    existingSlug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  if (!slug) {
    return { success: false, error: "Invalid title" };
  }

  // Get existing date if editing, otherwise use today
  let date = new Date().toISOString().split("T")[0];
  if (existingSlug) {
    const existingPost = await getPost(existingSlug);
    if (existingPost?.date) {
      date = existingPost.date;
    }
  }

  // Create frontmatter with draft status
  const fileContent = `---
title: "${title}"
date: "${date}"
draft: ${draft}
---

${content}`;

  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  try {
    fs.writeFileSync(filePath, fileContent, "utf8");
    return { success: true, slug, draft };
  } catch (error) {
    return { success: false, error: "Failed to save post" };
  }
}

export async function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Simple frontmatter parsing
      const titleMatch = fileContents.match(/title:\s*"([^"]+)"/);
      const dateMatch = fileContents.match(/date:\s*"([^"]+)"/);
      const draftMatch = fileContents.match(/draft:\s*(true|false)/);

      return {
        slug,
        title: titleMatch ? titleMatch[1] : slug,
        date: dateMatch ? dateMatch[1] : "",
        draft: draftMatch ? draftMatch[1] === "true" : false,
      };
    })
    .sort((a, b) => ((a.date || "") > (b.date || "") ? -1 : 1));
}

export async function getPost(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Simple frontmatter parsing
  const titleMatch = fileContents.match(/title:\s*"([^"]+)"/);
  const dateMatch = fileContents.match(/date:\s*"([^"]+)"/);
  const draftMatch = fileContents.match(/draft:\s*(true|false)/);

  // Get content after frontmatter
  const contentMatch = fileContents.match(/---[\s\S]*?---\s*([\s\S]*)/);
  const content = contentMatch?.[1]?.trim() ?? "";

  return {
    slug,
    title: titleMatch ? titleMatch[1] : slug,
    date: dateMatch ? dateMatch[1] : "",
    draft: draftMatch ? draftMatch[1] === "true" : false,
    content,
  };
}

export async function deletePost(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return { success: false, error: "Post not found" };
  }

  try {
    fs.unlinkSync(fullPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete post" };
  }
}
