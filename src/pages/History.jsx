import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { useConfirm } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { Link } from 'react-router-dom';
import {
    Star, Trash2, Play, ChevronDown, ChevronUp,
    Sparkles, Search, Filter,
} from 'lucide-react';
import { clsx } from 'clsx';

export function History() {
    const { runs, deleteRun } = useStore();
    const confirm = useConfirm();
    const toast = useToast();
    const [expandedRun, setExpandedRun] = useState(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const filteredRuns = runs
        .filter((run) => {
            return (
                run.promptTitle?.toLowerCase().includes(search.toLowerCase()) ||
                Object.values(run.variables || {}).some((v) => v?.toLowerCase().includes(search.toLowerCase()))
            );
        })
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'highest-rated') {
                const avgA = a.outputs?.reduce((s, o) => s + (o.rating || 0), 0) / (a.outputs?.length || 1);
                const avgB = b.outputs?.reduce((s, o) => s + (o.rating || 0), 0) / (b.outputs?.length || 1);
                return avgB - avgA;
            }
            return 0;
        });

    const handleDeleteRun = async (runId) => {
        const confirmed = await confirm({
            title: 'Delete Run',
            message: 'Delete this comparison run? This action cannot be undone.',
            confirmText: 'Delete',
            variant: 'danger',
        });
        if (confirmed) {
            deleteRun(runId);
            toast.success('Run deleted');
            if (expandedRun === runId) setExpandedRun(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getAverageRating = (outputs) => {
        if (!outputs?.length) return 0;
        return (outputs.reduce((acc, o) => acc + (o.rating || 0), 0) / outputs.length).toFixed(1);
    };

    return (
        <div className="space-y-5 pt-4 pb-8">
            {/* Page header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Runs</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {runs.length === 0
                            ? 'Your saved comparisons will appear here'
                            : `${runs.length} saved run${runs.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <Link to="/arena" className="btn-primary !py-2 !text-xs shrink-0">
                    <Play size={13} />
                    New Run
                </Link>
            </div>

            {/* Search + sort */}
            {runs.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                            size={15}
                        />
                        <input
                            type="text"
                            placeholder="Search runs…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="glass-input !pl-9 !py-2 !text-sm"
                        />
                    </div>
                    <div className="relative shrink-0">
                        <Filter
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                            size={14}
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="glass-input !pl-9 !py-2 !text-sm cursor-pointer sm:w-44"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest-rated">Highest Rated</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Content */}
            {filteredRuns.length === 0 ? (
                <div className="glass-panel py-16 text-center border-dashed">
                    <div className="w-12 h-12 rounded-2xl bg-surface-highlight flex items-center justify-center mx-auto mb-4">
                        <Sparkles size={20} className="text-text-secondary" />
                    </div>
                    <h3 className="text-base font-semibold mb-2">
                        {runs.length === 0 ? 'No runs yet' : 'No matching runs'}
                    </h3>
                    <p className="text-sm text-text-secondary mb-5 max-w-xs mx-auto">
                        {runs.length === 0
                            ? 'Head to the Playground to compare model outputs, then save your runs here.'
                            : 'Try adjusting your search terms.'}
                    </p>
                    {runs.length === 0 && (
                        <Link to="/arena" className="btn-primary inline-flex items-center gap-2">
                            <Play size={14} />
                            Go to Playground
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredRuns.map((run) => (
                        <div key={run.id} className="glass-panel overflow-hidden">
                            {/* Row */}
                            <button
                                onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                                className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-surface-highlight/30 transition-colors text-left"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-text-main truncate">
                                            {run.promptTitle || 'Untitled Run'}
                                        </p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="text-xs text-text-secondary">
                                                {formatDate(run.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-text-secondary">
                                                <Star size={11} className="text-yellow-400" />
                                                {getAverageRating(run.outputs)}
                                            </span>
                                            <span className="text-xs text-text-secondary">
                                                {run.outputs?.length || 0} model{(run.outputs?.length || 0) !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteRun(run.id); }}
                                        className="p-1.5 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    {expandedRun === run.id
                                        ? <ChevronUp size={16} className="text-text-secondary" />
                                        : <ChevronDown size={16} className="text-text-secondary" />
                                    }
                                </div>
                            </button>

                            {/* Expanded content */}
                            {expandedRun === run.id && (
                                <div className="border-t border-border bg-surface-highlight/20 p-5 animate-fade-in">
                                    {Object.keys(run.variables || {}).length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                                                Variables
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {Object.entries(run.variables).map(([key, value]) => (
                                                    <span
                                                        key={key}
                                                        className="text-xs bg-primary/8 text-primary px-2.5 py-1 rounded-full"
                                                    >
                                                        <strong>{key}:</strong> {value}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {run.outputs?.map((output, idx) => (
                                            <div key={idx} className="glass-panel p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-medium text-text-main truncate mr-2">
                                                        {output.name}
                                                    </span>
                                                    <div className="flex gap-0.5 shrink-0">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                size={11}
                                                                className={clsx(
                                                                    output.rating >= star ? 'text-yellow-400' : 'text-border'
                                                                )}
                                                                fill={output.rating >= star ? 'currentColor' : 'none'}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-surface-highlight rounded-lg p-3 max-h-48 overflow-y-auto custom-scrollbar">
                                                    <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono leading-relaxed">
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
