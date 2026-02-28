import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Play, Copy, Check, Download, MoreHorizontal, Trash2 } from 'lucide-react';
import { exportSinglePrompt } from '../utils/export';

export function PromptCard({ prompt, onDelete }) {
    const [copied, setCopied] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const handleExport = (format) => {
        exportSinglePrompt(prompt, format);
        setMenuOpen(false);
    };

    return (
        <article className="glass-panel flex h-full flex-col p-3.5">
            <div className="mb-2.5 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-text-main">{prompt.title}</h3>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary">{prompt.platform}</p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="glass-button !px-2 !py-2"
                        aria-label="Prompt options"
                    >
                        <MoreHorizontal size={14} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-full z-40 mt-2 min-w-[180px] rounded-xl border border-border bg-surface p-2 shadow-xl">
                            <button
                                onClick={handleCopy}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-text-main hover:bg-surface-highlight"
                            >
                                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                {copied ? 'Copied' : 'Copy Prompt'}
                            </button>
                            <button
                                onClick={() => handleExport('markdown')}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-text-main hover:bg-surface-highlight"
                            >
                                <Download size={14} /> Export Markdown
                            </button>
                            <button
                                onClick={() => handleExport('json')}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-text-main hover:bg-surface-highlight"
                            >
                                <Download size={14} /> Export JSON
                            </button>
                            <button
                                onClick={() => {
                                    onDelete(prompt.id);
                                    setMenuOpen(false);
                                }}
                                className="mt-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-red-500 hover:bg-red-500/10"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <p className="rounded-xl border border-border bg-surface-highlight/80 p-3 font-mono text-sm leading-relaxed text-text-secondary line-clamp-5 min-h-[7rem]">
                {prompt.content}
            </p>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
                {prompt.tags?.slice(0, 4).map((tag) => (
                    <span key={tag} className="inline-flex max-w-[105px] truncate rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                        #{tag}
                    </span>
                ))}
                {prompt.tags?.length > 4 && (
                    <span className="inline-flex rounded-full border border-border px-2 py-1 text-[11px] font-semibold text-text-secondary">
                        +{prompt.tags.length - 4}
                    </span>
                )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                <Link to={`/edit/${prompt.id}`} className="glass-button w-full justify-center">
                    <Edit2 size={14} />
                    Edit
                </Link>
                <Link to={`/arena?prompt=${prompt.id}`} className="btn-primary w-full justify-center !px-3 !py-2">
                    <Play size={14} />
                    Run
                </Link>
            </div>
        </article>
    );
}
