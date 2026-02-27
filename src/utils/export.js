/**
 * Export prompts to various formats
 */

export function exportToJSON(prompts, folders) {
    const data = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        prompts: prompts.map(p => ({
            title: p.title,
            content: p.content,
            platform: p.platform,
            tags: p.tags,
            folder: folders.find(f => f.id === p.folderId)?.name || null,
            color: p.color || null,
            createdAt: p.createdAt
        })),
        folders: folders.map(f => ({
            name: f.name,
            createdAt: f.createdAt
        }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `promptfolio-export-${formatDate(new Date())}.json`);
}

export function exportToMarkdown(prompts, folders) {
    let markdown = `# PromptFolio Export\n\n`;
    markdown += `> Exported on ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}\n\n`;
    markdown += `---\n\n`;

    // Group prompts by folder
    const groupedPrompts = {};
    const uncategorized = [];

    prompts.forEach(prompt => {
        if (prompt.folderId) {
            const folder = folders.find(f => f.id === prompt.folderId);
            const folderName = folder?.name || 'Unknown';
            if (!groupedPrompts[folderName]) {
                groupedPrompts[folderName] = [];
            }
            groupedPrompts[folderName].push(prompt);
        } else {
            uncategorized.push(prompt);
        }
    });

    // Write grouped prompts
    Object.entries(groupedPrompts).sort((a, b) => a[0].localeCompare(b[0])).forEach(([folderName, folderPrompts]) => {
        markdown += `## ${folderName}\n\n`;
        folderPrompts.forEach(prompt => {
            markdown += formatPromptMarkdown(prompt);
        });
    });

    // Write uncategorized prompts
    if (uncategorized.length > 0) {
        markdown += `## Uncategorized\n\n`;
        uncategorized.forEach(prompt => {
            markdown += formatPromptMarkdown(prompt);
        });
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });
    downloadBlob(blob, `promptfolio-export-${formatDate(new Date())}.md`);
}

export function exportSinglePrompt(prompt, format = 'markdown') {
    if (format === 'json') {
        const data = {
            exportDate: new Date().toISOString(),
            prompt: {
                title: prompt.title,
                content: prompt.content,
                platform: prompt.platform,
                tags: prompt.tags,
                createdAt: prompt.createdAt
            }
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadBlob(blob, `${slugify(prompt.title)}.json`);
    } else {
        const markdown = formatPromptMarkdown(prompt);
        const blob = new Blob([markdown], { type: 'text/markdown' });
        downloadBlob(blob, `${slugify(prompt.title)}.md`);
    }
}

function formatPromptMarkdown(prompt) {
    let md = `### ${prompt.title}\n\n`;
    md += `**Platform:** ${prompt.platform}`;
    if (prompt.tags?.length > 0) {
        md += ` | **Tags:** ${prompt.tags.join(', ')}`;
    }
    md += `\n\n`;
    md += `\`\`\`\n${prompt.content}\n\`\`\`\n\n`;
    md += `---\n\n`;
    return md;
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
