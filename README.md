# 🚀 Nashwan's Portfolio v2

This is the second iteration of my personal portfolio and project showcase web application, rebuilt specifically for performance, simplicity, and ease of content management.

Initially built dynamically with Next.js 14, **Prisma ORM**, and **MySQL**, this project has been heavily refactored (v2) to a **100% Statically Generated (SSG)** architecture powered by pure Markdown files (`.md`).

## ✨ Features

- **Blazing Fast (SSG)**: Entire site generates static HTML at build time (`output: "export"`). No database queries, no server-side rendering latency.
- **Markdown Driven Content**: Project write-ups and CTF walkthroughs are simply written in `.md` files under the `content/projects/` directory.
- **Beautiful Typography**: Uses `@tailwindcss/typography`, `react-markdown`, `remark-gfm`, and `rehype-highlight` for beautiful rendering of code blocks and prose.
- **Project Showcase**: Filtering by category, tech stack pills, responsive layouts.
- **Interactive Terminal**: A fun `NashwanOS` interactive terminal simulation built in React.
- **CTF Writeups**: Easy reading interface for cyber security writeups.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Framer Motion
- **Content Parsing**: `gray-matter`, `react-markdown`

## 🚀 Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Writing Content

To add a new project or CTF write-up, simply create a new `.md` file inside `content/projects/`. 
Use the following frontmatter template at the top of your markdown file:

```markdown
---
title: "Your Project Title"
description: "A short description of the project."
year: 2026
category: "WEB" # Valid categories: WEB, MOBILE, AI, GAME, CTF, OTHER
techStack: "React, Tailwind, etc"
githubUrl: "https://github.com/your-username/repo"
demoUrl: "https://your-demo.com"
coverUrl: "/uploads/cover.png"
createdAt: "2026-03-10T10:00:00Z"
updatedAt: "2026-03-10T10:00:00Z"
---

# Your Project Details
Write your markdown content here...
```

## 📦 Deployment (Static Export)

This project is configured for static export. 
To generate the static HTML files:

```bash
npm run build
```

This will create an `out/` directory containing the static assets, which can be deployed to any static hosting provider like Netlify, GitHub Pages, or Vercel.

**Note:** Since the project uses `output: "export"`, features requiring a Node.js server (like Next.js API Routes or Image Optimization with default loaders) are not supported out-of-the-box.
