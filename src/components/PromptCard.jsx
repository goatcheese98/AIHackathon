import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Play, Trash2, Copy, FileText } from 'lucide-react';
import { clsx } from 'clsx';

const COLORS = [
    {
        name: 'default',
        cardBorder: 'border-border',
        cardBg: 'bg-surface',
        pickerBg: 'bg-slate-200 dark:bg-slate-700',
        pickerBorder: 'border-slate-300 dark:border-slate-600',
        accentBg: 'bg-primary/10',
        accentText: 'text-primary'
    },
    {
        name: 'blue',
        cardBorder: 'border-blue-500',
        cardBg: 'bg-blue-500/5',
        pickerBg: 'bg-blue-500',
        pickerBorder: 'border-blue-600',
        accentBg: 'bg-blue-500/10',
        accentText: 'text-blue-500'
    },
    {
        name: 'green',
        cardBorder: 'border-emerald-500',
        cardBg: 'bg-emerald-500/5',
        pickerBg: 'bg-emerald-500',
        pickerBorder: 'border-emerald-600',
        accentBg: 'bg-emerald-500/10',
        accentText: 'text-emerald-500'
    },
    {
        name: 'orange',
        cardBorder: 'border-orange-500',
        cardBg: 'bg-orange-500/5',
        pickerBg: 'bg-orange-500',
        pickerBorder: 'border-orange-600',
        accentBg: 'bg-orange-500/10',
        accentText: 'text-orange-500'
    },
    {
        name: 'red',
        cardBorder: 'border-red-500',
        cardBg: 'bg-red-500/5',
        pickerBg: 'bg-red-500',
        pickerBorder: 'border-red-600',
        accentBg: 'bg-red-500/10',
        accentText: 'text-red-500'
    },
    {
        name: 'cyan',
        cardBorder: 'border-cyan-500',
        cardBg: 'bg-cyan-500/5',
        pickerBg: 'bg-cyan-500',
        pickerBorder: 'border-cyan-600',
        accentBg: 'bg-cyan-500/10',
        accentText: 'text-cyan-500'
    },
    {
        name: 'purple',
        cardBorder: 'border-purple-500',
        cardBg: 'bg-purple-500/5',
        pickerBg: 'bg-purple-500',
        pickerBorder: 'border-purple-600',
        accentBg: 'bg-purple-500/10',
        accentText: 'text-purple-500'
    },
    {
        name: 'pink',
        cardBorder: 'border-pink-500',
        cardBg: 'bg-pink-500/5',
        pickerBg: 'bg-pink-500',
        pickerBorder: 'border-pink-600',
        accentBg: 'bg-pink-500/10',
        accentText: 'text-pink-500'
    },
    {
        name: 'yellow',
        cardBorder: 'border-yellow-500',
        cardBg: 'bg-yellow-500/5',
        pickerBg: 'bg-yellow-500',
        pickerBorder: 'border-yellow-600',
        accentBg: 'bg-yellow-500/10',
        accentText: 'text-yellow-500'
    },
    {
        name: 'teal',
        cardBorder: 'border-teal-500',
        cardBg: 'bg-teal-500/5',
        pickerBg: 'bg-teal-500',
        pickerBorder: 'border-teal-600',
        accentBg: 'bg-teal-500/10',
        accentText: 'text-teal-500'
    },
    {
        name: 'indigo',
        cardBorder: 'border-indigo-500',
        cardBg: 'bg-indigo-500/5',
        pickerBg: 'bg-indigo-500',
        pickerBorder: 'border-indigo-600',
        accentBg: 'bg-indigo-500/10',
        accentText: 'text-indigo-500'
    },
];

export function PromptCard({ prompt, onDelete, onUpdate }) {
    const [showColors, setShowColors] = useState(false);

    const handleCopy = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(prompt.content);
    };

    const activeColor = COLORS.find(c => c.name === prompt.color) || COLORS[0];

    return (
        <div className={clsx(
            "glass-panel p-6 group hover:shadow-lg transition-all duration-300 flex flex-col h-full relative",
            activeColor.name !== 'default' ? activeColor.cardBorder : "hover:shadow-primary/5 hover:border-primary/30",
            activeColor.name !== 'default' && activeColor.cardBg
        )}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowColors(!showColors)}
                            className={clsx(
                                "mt-1 p-2 rounded-lg transition-transform hover:scale-105",
                                activeColor.accentBg,
                                activeColor.accentText
                            )}
                        >
                            <FileText size={18} />
                        </button>
                        {showColors && (
                            <div className="absolute top-full left-0 mt-2 p-2 bg-surface border border-border rounded-xl shadow-xl grid grid-cols-4 gap-2 z-50 animate-in fade-in slide-in-from-top-2 w-48">
                                {COLORS.map(color => (
                                    <button
                                        key={color.name}
                                        onClick={() => {
                                            onUpdate(prompt.id, { color: color.name });
                                            setShowColors(false);
                                        }}
                                        className={clsx(
                                            "w-6 h-6 rounded-full border transition-transform hover:scale-110",
                                            color.pickerBg,
                                            color.pickerBorder,
                                            prompt.color === color.name && "ring-2 ring-offset-2 ring-text-main"
                                        )}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-main mb-1">{prompt.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium text-text-secondary">
                                {prompt.platform}
                            </span>
                            {prompt.tags.map(tag => (
                                <span key={tag} className={clsx(
                                    "text-xs px-2 py-0.5 rounded-full font-medium",
                                    activeColor.accentBg,
                                    activeColor.accentText
                                )}>
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

            <div className="flex items-center gap-2 pt-2 border-t border-border/50 relative">
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
