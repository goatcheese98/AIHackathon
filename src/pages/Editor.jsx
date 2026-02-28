import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { useToast } from '../components/Toast';
import {
    Save,
    ArrowLeft,
    Plus,
    X,
    Route,
    FolderTree,
    Tags,
    Play,
    Braces,
} from 'lucide-react';

export function Editor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { prompts, folders, addPrompt, updatePrompt } = useStore();
    const toast = useToast();
    const existingPrompt = id ? prompts.find((p) => p.id === id) : null;

    const [formData, setFormData] = useState(() => existingPrompt || {
        title: '',
        platform: 'OpenRouter',
        content: '',
        tags: [],
    });
    const [tagInput, setTagInput] = useState('');

    const detectedVariables = useMemo(
        () => (formData.content.match(/\{\{([^}]+)\}\}/g) || []).map((v) => v.replace(/\{\{|\}\}/g, '').trim()),
        [formData.content]
    );

    const savePrompt = (goToArena = false) => {
        if (!formData.title.trim()) {
            toast.error('Please add a prompt name');
            return;
        }
        if (!formData.content.trim()) {
            toast.error('Please add prompt content');
            return;
        }
        if (id && !existingPrompt) {
            toast.error('Prompt not found');
            navigate('/app');
            return;
        }
        if (id && existingPrompt) {
            updatePrompt(id, formData);
            toast.success('Prompt updated');
            navigate(goToArena ? `/arena?prompt=${id}` : '/app');
            return;
        }
        const created = addPrompt(formData);
        toast.success('Prompt created');
        navigate(goToArena ? `/arena?prompt=${created.id}` : '/app');
    };

    const addTag = (e) => {
        e.preventDefault();
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tagToRemove),
        }));
    };

    return (
        <div className="space-y-5 pt-4 pb-8">
            {/* Page header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/app')}
                        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-main transition-colors"
                    >
                        <ArrowLeft size={15} />
                        Library
                    </button>
                    <span className="text-border">·</span>
                    <h1 className="text-lg font-semibold">
                        {id ? 'Edit Prompt' : 'New Prompt'}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => savePrompt(false)}
                        className="btn-secondary !py-2 !text-xs"
                    >
                        <Save size={13} />
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => savePrompt(true)}
                        className="btn-primary !py-2 !text-xs"
                    >
                        <Play size={13} />
                        Save &amp; Test
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="grid gap-4 xl:grid-cols-[1fr_240px]">
                {/* Main form */}
                <div className="glass-panel p-5">
                    <form
                        onSubmit={(e) => { e.preventDefault(); savePrompt(false); }}
                        className="space-y-5"
                    >
                        {/* Name + Platform + Folder */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="glass-input"
                                    placeholder="Customer onboarding assistant"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                                    Platform
                                </label>
                                <select
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    className="glass-input cursor-pointer"
                                >
                                    <option value="OpenRouter">OpenRouter</option>
                                    <option value="ChatGPT">ChatGPT</option>
                                    <option value="Claude">Claude</option>
                                    <option value="Gemini">Gemini</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
                                    <FolderTree size={12} />
                                    Folder
                                </label>
                                <select
                                    value={formData.folderId || ''}
                                    onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                                    className="glass-input cursor-pointer"
                                >
                                    <option value="">Uncategorized</option>
                                    {folders?.map((folder) => (
                                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Prompt body */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                                    Prompt Body
                                </label>
                                <span className="flex items-center gap-1 rounded-lg border border-border bg-surface-highlight px-2 py-0.5 text-[11px] text-text-secondary">
                                    <Route size={10} />
                                    <code>{'{{variable}}'}</code>
                                </span>
                            </div>
                            <textarea
                                required
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="glass-input min-h-[340px] resize-y font-mono text-sm leading-relaxed"
                                placeholder="Write your prompt here. Use {{variable}} for dynamic values."
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
                                <Tags size={12} />
                                Tags
                            </label>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-highlight px-2.5 py-1 text-xs font-medium text-text-main"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="text-text-secondary hover:text-red-500 transition-colors"
                                            >
                                                <X size={11} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTag(e)}
                                    className="glass-input"
                                    placeholder="Add a tag…"
                                />
                                <button type="button" onClick={addTag} className="glass-button !px-3">
                                    <Plus size={15} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Variables sidebar */}
                <aside className="space-y-3">
                    <div className="glass-panel p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Braces size={14} className="text-primary" />
                            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                                Variables
                            </p>
                        </div>
                        {detectedVariables.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {detectedVariables.map((variable, index) => (
                                    <span
                                        key={`${variable}-${index}`}
                                        className="rounded-lg border border-primary/20 bg-primary/8 px-2.5 py-1 text-xs font-mono font-medium text-primary"
                                    >
                                        {variable}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Use <code className="font-mono text-primary bg-primary/8 px-1 rounded">{'{{name}}'}</code> in your prompt to create reusable placeholders.
                            </p>
                        )}
                    </div>

                    <div className="glass-panel p-4 space-y-2.5">
                        <button
                            type="button"
                            onClick={() => savePrompt(false)}
                            className="btn-secondary w-full justify-center !py-2 !text-xs"
                        >
                            <Save size={13} />
                            Save to Library
                        </button>
                        <button
                            type="button"
                            onClick={() => savePrompt(true)}
                            className="btn-primary w-full justify-center !py-2 !text-xs"
                        >
                            <Play size={13} />
                            Save &amp; Test
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
