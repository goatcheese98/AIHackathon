import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Play, Trash2, Copy, FileText } from 'lucide-react';
import { clsx } from 'clsx';

export function PromptCard({ prompt, onDelete }) {
    const handleCopy = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(prompt.content);
    };

    return (
        <div className="glass-panel p-6 group hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary">
                        <FileText size={18} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-main mb-1">{prompt.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium text-text-secondary">
                                {prompt.platform}
                            </span>
                            {prompt.tags.map(tag => (
                                <span key={tag} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface-highlight p-4 rounded-lg border border-border mb-6 flex-1">
                <p className="text-text-secondary text-sm line-clamp-4 font-mono leading-relaxed">
                    {prompt.content}
                </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <Link
                    to={`/edit/${prompt.id}`}
                    className="p-2 rounded-lg hover:bg-surface-highlight text-text-secondary hover:text-text-main transition-colors"
                    title="Edit"
                >
                    <Edit2 size={16} />
                </Link>
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-surface-highlight text-text-secondary hover:text-text-main transition-colors"
                    title="Copy raw prompt"
                >
                    <Copy size={16} />
                </button>
                <button
                    onClick={() => onDelete(prompt.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-colors ml-auto"
                    title="Delete"
                >
                    <Trash2 size={16} />
                </button>
                <Link
                    to={`/arena?prompt=${prompt.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors text-sm font-medium ml-2 shadow-md shadow-primary/20"
                >
                    <Play size={14} />
                    Run
                </Link>
            </div>
        </div>
    );
}
