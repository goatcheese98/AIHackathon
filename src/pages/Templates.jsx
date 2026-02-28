import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { useToast } from '../components/Toast';
import { CopyPlus, Hash, Search, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export function Templates() {
    const navigate = useNavigate();
    const toast = useToast();
    const { templates, templateCategories, addPromptFromTemplate } = useStore();

    const [search, setSearch] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');

    const filteredTemplates = useMemo(() => {
        return templates.filter((template) => {
            const matchesSearch =
                template.title.toLowerCase().includes(search.toLowerCase()) ||
                template.content.toLowerCase().includes(search.toLowerCase()) ||
                (template.tags || []).some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
            const matchesCategory = selectedCategoryId === 'all' || template.categoryId === selectedCategoryId;
            return matchesSearch && matchesCategory;
        });
    }, [templates, search, selectedCategoryId]);

    const handleUseTemplate = (templateId) => {
        const createdPrompt = addPromptFromTemplate(templateId);
        if (!createdPrompt) {
            toast.error('Template not found');
            return;
        }
        toast.success('Template added to library');
        navigate(`/edit/${createdPrompt.id}`);
    };

    return (
        <div className="space-y-5 pt-4 pb-8">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
                <p className="text-sm text-text-secondary mt-1">
                    Ready-to-use prompts to get you started quickly
                </p>
            </div>

            {/* Search + category filter */}
            <div className="space-y-2.5">
                <div className="relative">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                        size={15}
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search templates…"
                        className="glass-input !pl-9 !py-2 !text-sm"
                    />
                </div>

                <div className="flex flex-wrap gap-1.5">
                    <button
                        onClick={() => setSelectedCategoryId('all')}
                        className={clsx(
                            'rounded-xl border px-3 py-1.5 text-xs font-medium transition-all',
                            selectedCategoryId === 'all'
                                ? 'border-primary/30 bg-primary/8 text-primary'
                                : 'border-border text-text-secondary hover:text-text-main hover:border-primary/20'
                        )}
                    >
                        All ({templates.length})
                    </button>
                    {templateCategories.map((cat) => {
                        const count = templates.filter((t) => t.categoryId === cat.id).length;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategoryId(cat.id)}
                                className={clsx(
                                    'rounded-xl border px-3 py-1.5 text-xs font-medium transition-all',
                                    selectedCategoryId === cat.id
                                        ? 'border-primary/30 bg-primary/8 text-primary'
                                        : 'border-border text-text-secondary hover:text-text-main hover:border-primary/20'
                                )}
                            >
                                {cat.name} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Template grid */}
            {filteredTemplates.length === 0 ? (
                <div className="glass-panel py-14 text-center border-dashed">
                    <Sparkles size={24} className="mx-auto text-text-secondary mb-3" />
                    <p className="text-sm font-medium text-text-main mb-1">No templates found</p>
                    <p className="text-xs text-text-secondary">Try a different search or category</p>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredTemplates.map((template) => (
                        <article key={template.id} className="glass-panel flex flex-col p-4 transition-all hover:border-primary/20">
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <h3 className="font-semibold text-text-main leading-snug">{template.title}</h3>
                                <span className="shrink-0 rounded-lg border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-secondary">
                                    {template.platform}
                                </span>
                            </div>

                            <p className="font-mono text-xs text-text-secondary/80 bg-surface-highlight/60 rounded-lg px-3 py-2.5 line-clamp-4 flex-1 leading-relaxed mb-3">
                                {template.content}
                            </p>

                            {(template.tags || []).length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {(template.tags || []).slice(0, 5).map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-0.5 rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary"
                                        >
                                            <Hash size={9} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => handleUseTemplate(template.id)}
                                className="btn-primary w-full justify-center !py-2 !text-xs !rounded-lg"
                            >
                                <CopyPlus size={12} />
                                Use Template
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
