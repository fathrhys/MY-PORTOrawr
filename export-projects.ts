import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const projects = await prisma.project.findMany();

    const contentDir = path.join(process.cwd(), 'content', 'projects');

    // Create dir if not exists
    await fs.mkdir(contentDir, { recursive: true });

    for (const project of projects) {
        const filePath = path.join(contentDir, `${project.slug}.md`);

        // Frontmatter
        const frontmatter = `---
title: "${project.title.replace(/"/g, '\\"')}"
description: "${project.description.replace(/"/g, '\\"').replace(/\n/g, ' ')}"
year: ${project.year || 'null'}
category: "${project.category}"
techStack: "${project.techStack}"
githubUrl: "${project.githubUrl || ''}"
demoUrl: "${project.demoUrl || ''}"
coverUrl: "${project.coverUrl || ''}"
createdAt: "${project.createdAt.toISOString()}"
updatedAt: "${project.updatedAt.toISOString()}"
---

[Tulis konten writeup/project Anda di sini]

${project.description}
`;

        await fs.writeFile(filePath, frontmatter, 'utf-8');
        console.log(`Exported: ${filePath}`);
    }

    console.log('Export complete!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
