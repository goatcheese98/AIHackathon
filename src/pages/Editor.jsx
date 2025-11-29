import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Save, ArrowLeft, Plus, X, Type } from 'lucide-react';

export function Editor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { prompts, addPrompt, updatePrompt } = useStore();

    const [formData, setFormData] = useState({
        title: '',
        platform: 'ChatGPT',
        content: '',
        tags: []
    });
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (id) {
            const prompt = prompts.find(p => p.id === id);
            if (prompt) setFormData(prompt);
        }
    }, [id, prompts]);

    const detectedVariables = (formData.content.match(/\{\{([^}]+)\}\}/g) || [])
        .map(v => v.replace(/\{\{|\}\}/g, '').trim());

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            updatePrompt(id, formData);
        } else {
            addPrompt(formData);
        }
        navigate('/app');
    };

    const addTag = (e) => {
        e.preventDefault();
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/app')}
                className="flex items-center gap-2 text-text-secondary hover:text-text-main mb-6 transition-colors"
            >
                <ArrowLeft size={18} />
                Back to Library
            </button>

            <div className="glass-panel p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Type size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-text-main">
                        {id ? 'Edit Prompt Template' : 'Create New Template'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Template Name</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="glass-input"
                                placeholder="e.g., SQL Query Generator"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Primary Platform</label>
                            <select
                                value={formData.platform}
                                onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                className="glass-input appearance-none"
                            >
                                <option value="ChatGPT">ChatGPT</option>
                                <option value="Claude">Claude</option>
                                <option value="Gemini">Gemini</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-text-secondary">Prompt Content</label>
                            <span className="text-xs text-text-secondary bg-surface-highlight px-2 py-1 rounded border border-border">
                                Use <code className="text-primary font-bold">{'{{variable}}'}</code> for dynamic inputs
                            </span>
                        </div>
                        <textarea
                            required
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            className="glass-input min-h-[300px] font-mono text-sm leading-relaxed resize-y"
                            placeholder="Write your prompt here..."
                        />
                    </div>

                    {detectedVariables.length > 0 && (
                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                Detected Variables
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                                {detectedVariables.map((v, i) => (
                                    <span key={i} className="text-xs bg-white dark:bg-white/10 text-primary border border-primary/20 px-2 py-1 rounded font-mono shadow-sm">
                                        {v}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Tags</label>
                        <div className="flex gap-2 mb-3 flex-wrap min-h-[32px]">
                            {formData.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 text-xs bg-surface-highlight text-text-main border border-border px-3 py-1 rounded-full">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addTag(e)}
                                className="glass-input"
                                placeholder="Add a tag and press Enter..."
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="glass-button px-3"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border">
                        <button
                            type="submit"
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save size={18} />
                            Save Template
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
