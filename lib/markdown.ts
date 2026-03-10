import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type ProjectData = {
    slug: string;
    title: string;
    description: string;
    year: number | null;
    category: "WEB" | "CTF" | "AI" | "GAME" | "TOOLS" | "OTHER";
    techStack: string;
    githubUrl: string | null;
    demoUrl: string | null;
    coverUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    content: string; // The markdown content
};

const projectsDirectory = path.join(process.cwd(), 'content', 'projects');

export function getProjectSlugs() {
    if (!fs.existsSync(projectsDirectory)) {
        return [];
    }
    return fs.readdirSync(projectsDirectory).filter((file) => file.endsWith('.md'));
}

export function getProjectBySlug(slug: string): ProjectData | null {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(projectsDirectory, `${realSlug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug: realSlug,
        title: data.title || '',
        description: data.description || '',
        year: data.year || null,
        category: data.category || 'OTHER',
        techStack: data.techStack || '',
        githubUrl: data.githubUrl || null,
        demoUrl: data.demoUrl || null,
        coverUrl: data.coverUrl || null,
        createdAt: new Date(data.createdAt || Date.now()),
        updatedAt: new Date(data.updatedAt || Date.now()),
        content,
    };
}

export function getAllProjects(): ProjectData[] {
    const slugs = getProjectSlugs();
    const projects = slugs
        .map((slug) => getProjectBySlug(slug))
        .filter((project): project is ProjectData => project !== null)
        .sort((a, b) => (b.createdAt.getTime() - a.createdAt.getTime()));

    return projects;
}
