import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { useToast } from '../components/Toast';
import { ArrowRight, CopyPlus, Hash, Search, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export function Templates() {
    const navigate = useNavigate();
    const toast = useToast();
    const { templates, templateCategories, addPromptFromTemplate } = useStore();

    const [search, setSearch] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');

    const filteredTemplates = useMemo(() => {
        return templates.filter((template) => {
            const matchesSearch = template.title.toLowerCase().includes(search.toLowerCase()) ||
                template.content.toLowerCase().includes(search.toLowerCase()) ||
                (template.tags || []).some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

            const matchesCategory = selectedCategoryId === 'all' || template.categoryId === selectedCategoryId;

            return matchesSearch && matchesCategory;
        });
    }, [templates, search, selectedCategoryId]);

    const groupedTemplates = useMemo(() => {
        return filteredTemplates.reduce((acc, template) => {
            const category = template.categoryId || 'uncategorized';
            if (!acc[category]) acc[category] = [];
            acc[category].push(template);
            return acc;
        }, {});
    }, [filteredTemplates]);

    const handleUseTemplate = (templateId) => {
        const createdPrompt = addPromptFromTemplate(templateId);
        if (!createdPrompt) {
            toast.error('Template not found');
            return;
        }

        toast.success('Template added to your library');
        navigate(`/edit/${createdPrompt.id}`);
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-main">Recommended Templates</h1>
                    <p className="mt-2 max-w-3xl text-text-secondary">
                        Templates are starter patterns. Add any template to your personal Library, then customize it for your own workflows.
                    </p>
                </div>

                <Link to="/app" className="glass-button inline-flex items-center gap-2 w-fit">
                    Go to My Library
                    <ArrowRight size={16} />
                </Link>
            </header>

            <section className="glass-panel p-5 md:p-6 space-y-4">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search templates by title, tags, or content..."
                            className="glass-input-with-icon"
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedCategoryId('all')}
                            className={clsx(
                                'px-3 py-1.5 rounded-lg text-sm border transition-colors',
                                selectedCategoryId === 'all'
                                    ? 'bg-primary text-white border-primary'
                                    : 'border-border text-text-secondary hover:text-text-main hover:bg-surface-highlight'
                            )}
                        >
                            All
                        </button>
                        {templateCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategoryId(category.id)}
                                className={clsx(
                                    'px-3 py-1.5 rounded-lg text-sm border transition-colors',
                                    selectedCategoryId === category.id
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-border text-text-secondary hover:text-text-main hover:bg-surface-highlight'
                                )}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {filteredTemplates.length === 0 ? (
                <div className="glass-panel p-10 text-center">
                    <Sparkles size={30} className="mx-auto text-text-secondary" />
                    <h3 className="mt-4 text-lg font-semibold text-text-main">No templates match your filters</h3>
                    <p className="mt-2 text-text-secondary">Try a different search or category.</p>
                </div>
            ) : (
                <div className="space-y-6 pb-8">
                    {Object.entries(groupedTemplates).map(([categoryId, categoryTemplates]) => {
                        const categoryName = templateCategories.find((category) => category.id === categoryId)?.name || 'Uncategorized';

                        return (
                            <section key={categoryId} className="space-y-3">
                                <h2 className="text-lg font-semibold text-text-main">{categoryName}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {categoryTemplates.map((template) => (
                                        <article key={template.id} className="glass-panel p-5 flex flex-col">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="text-lg font-semibold text-text-main">{template.title}</h3>
                                                <span className="text-xs text-text-secondary rounded-full border border-border px-2 py-1 whitespace-nowrap">
                                                    {template.platform}
                                                </span>
                                            </div>

                                            <p className="mt-3 text-sm text-text-secondary line-clamp-4 font-mono leading-relaxed">
                                                {template.content}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {(template.tags || []).slice(0, 4).map((tag) => (
                                                    <span key={tag} className="text-xs rounded-full bg-primary/10 text-primary px-2 py-1 inline-flex items-center gap-1">
                                                        <Hash size={11} /> {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => handleUseTemplate(template.id)}
                                                className="mt-5 btn-primary inline-flex items-center justify-center gap-2"
                                            >
                                                <CopyPlus size={16} />
                                                Add to Library
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
