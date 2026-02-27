import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { useConfirm } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { Link } from 'react-router-dom';
import {
    Clock, Star, Trash2, Play, ChevronDown, ChevronUp,
    Calendar, FileText, Sparkles, Search, Filter
} from 'lucide-react';
import { clsx } from 'clsx';

export function History() {
    const { runs, prompts, deleteRun } = useStore();
    const confirm = useConfirm();
    const toast = useToast();
    const [expandedRun, setExpandedRun] = useState(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const filteredRuns = runs
        .filter(run => {
            const matchesSearch = run.promptTitle?.toLowerCase().includes(search.toLowerCase()) ||
                Object.values(run.variables || {}).some(v => v?.toLowerCase().includes(search.toLowerCase()));
            return matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortBy === 'highest-rated') {
                const avgA = a.outputs?.reduce((sum, o) => sum + (o.rating || 0), 0) / (a.outputs?.length || 1);
                const avgB = b.outputs?.reduce((sum, o) => sum + (o.rating || 0), 0) / (b.outputs?.length || 1);
                return avgB - avgA;
            }
            return 0;
        });

    const handleDeleteRun = async (runId) => {
        const confirmed = await confirm({
            title: 'Delete Run',
            message: 'Are you sure you want to delete this comparison run? This action cannot be undone.',
            confirmText: 'Delete',
            variant: 'danger'
        });

        if (confirmed) {
            deleteRun(runId);
            toast.success('Run deleted successfully');
            if (expandedRun === runId) setExpandedRun(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAverageRating = (outputs) => {
        if (!outputs?.length) return 0;
        const sum = outputs.reduce((acc, o) => acc + (o.rating || 0), 0);
        return (sum / outputs.length).toFixed(1);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main mb-2 flex items-center gap-3">
                        <Clock className="text-primary" size={28} />
                        Run History
                    </h1>
                    <p className="text-text-secondary">
                        View and analyze your past model comparison runs.
                    </p>
                </div>
                <Link
                    to="/arena"
                    className="btn-primary flex items-center gap-2"
                >
                    <Play size={18} />
                    New Run
                </Link>
            </header>

            {runs.length > 0 && (
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none z-10" size={18} />
                        <input
                            type="text"
                            placeholder="Search runs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="glass-input-with-icon"
                        />
                    </div>
                    <div className="relative flex-shrink-0">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none z-10" size={18} />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="glass-input-with-icon appearance-none cursor-pointer"
                            style={{ paddingRight: '2rem' }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest-rated">Highest Rated</option>
                        </select>
                    </div>
                </div>
            )}

            {filteredRuns.length === 0 ? (
                <div className="glass-panel p-12 text-center">
                    <div className="w-16 h-16 bg-surface-highlight rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles size={28} className="text-text-secondary" />
                    </div>
                    <h3 className="text-lg font-medium text-text-main mb-2">
                        {runs.length === 0 ? 'No runs yet' : 'No matching runs'}
                    </h3>
                    <p className="text-text-secondary mb-6">
                        {runs.length === 0
                            ? 'Head to the Arena to compare model outputs and save your runs.'
                            : 'Try adjusting your search terms.'
                        }
                    </p>
                    {runs.length === 0 && (
                        <Link to="/arena" className="btn-primary inline-flex items-center gap-2">
                            <Play size={18} />
                            Go to Arena
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRuns.map(run => (
                        <div key={run.id} className="glass-panel overflow-hidden">
                            <button
                                onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                                className="w-full p-4 flex items-center justify-between hover:bg-surface-highlight/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <FileText size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-text-main">
                                            {run.promptTitle || 'Untitled Run'}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDate(run.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star size={14} className="text-yellow-400" />
                                                {getAverageRating(run.outputs)} avg
                                            </span>
                                            <span>
                                                {run.outputs?.length || 0} model{(run.outputs?.length || 0) !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteRun(run.id); }}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-colors"
                                        title="Delete run"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    {expandedRun === run.id ? (
                                        <ChevronUp size={20} className="text-text-secondary" />
                                    ) : (
                                        <ChevronDown size={20} className="text-text-secondary" />
                                    )}
                                </div>
                            </button>

                            {expandedRun === run.id && (
                                <div className="border-t border-border p-4 bg-surface-highlight/30 animate-in slide-in-from-top-2 duration-200">
                                    {Object.keys(run.variables || {}).length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-text-secondary mb-2">Variables Used</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(run.variables).map(([key, value]) => (
                                                    <span
                                                        key={key}
                                                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                                                    >
                                                        <strong>{key}:</strong> {value}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {run.outputs?.map((output, idx) => (
                                            <div key={idx} className="bg-surface rounded-lg border border-border p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-medium text-text-main">{output.name}</span>
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                size={12}
                                                                className={clsx(
                                                                    output.rating >= star ? "text-yellow-400" : "text-gray-300"
                                                                )}
                                                                fill={output.rating >= star ? "currentColor" : "none"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-surface-highlight rounded p-3 max-h-48 overflow-y-auto custom-scrollbar">
                                                    <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono">
                                                        {output.content || 'No output recorded'}
                                                    </pre>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
