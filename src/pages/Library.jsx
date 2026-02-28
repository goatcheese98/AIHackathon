import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Copy,
    Edit2,
    FilterX,
    FolderOpen,
    Layers3,
    Play,
    Plus,
    Search,
    Sparkles,
    Trash2,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { useConfirm } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

const ITEMS_PER_PAGE = 9;
const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;

function formatDateLabel(dateValue) {
    const date = new Date(dateValue || 0);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
    }).format(date);
}

function FilterSelect({ value, onChange, children }) {
    return (
        <select
            value={value}
            onChange={onChange}
            className="rounded-xl border border-border bg-surface/85 px-2.5 py-1.5 text-xs text-text-secondary cursor-pointer transition-all hover:border-primary/30 hover:text-text-main focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
            {children}
        </select>
    );
}

function PromptRow({ prompt, folderName, onDelete, onCopy }) {
    return (
        <article className="glass-panel flex flex-col p-4 transition-all duration-200 hover:border-primary/20">
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-text-main leading-snug truncate">{prompt.title}</h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                        {[prompt.platform, folderName].filter(Boolean).join(' · ')}
                    </p>
                </div>
                <span className="shrink-0 text-[11px] text-text-secondary/60 mt-0.5 tabular-nums">
                    {formatDateLabel(prompt.createdAt)}
                </span>
            </div>

            <p className="font-mono text-xs leading-relaxed text-text-secondary/80 bg-surface-highlight/60 rounded-lg px-3 py-2.5 line-clamp-3 flex-1 mb-3">
                {prompt.content || 'No content yet.'}
            </p>

            {(prompt.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {(prompt.tags || []).slice(0, 5).map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary"
                        >
                            #{tag}
                        </span>
                    ))}
                    {(prompt.tags || []).length > 5 && (
                        <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-text-secondary">
                            +{(prompt.tags || []).length - 5}
                        </span>
                    )}
                </div>
            )}

            <div className="flex gap-1.5 pt-3 border-t border-border/60">
                <Link
                    to={`/arena?prompt=${prompt.id}`}
                    className="btn-primary flex-1 justify-center !py-1.5 !text-xs !px-3 !rounded-lg"
                >
                    <Play size={12} />
                    Run
                </Link>
                <Link
                    to={`/edit/${prompt.id}`}
                    className="glass-button !py-1.5 !text-xs !px-3 !rounded-lg"
                >
                    <Edit2 size={12} />
                    Edit
                </Link>
                <button
                    onClick={() => onCopy(prompt)}
                    className="glass-button !py-1.5 !px-2.5 !rounded-lg"
                    title="Copy to clipboard"
                >
                    <Copy size={12} />
                </button>
                <button
                    onClick={() => onDelete(prompt.id)}
                    className="glass-button !py-1.5 !px-2.5 !rounded-lg hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5"
                    title="Delete"
                >
                    <Trash2 size={12} />
                </button>
            </div>
        </article>
    );
}

export function Library() {
    const { prompts, folders, deletePrompt, createFolder } = useStore();
    const confirm = useConfirm();
    const toast = useToast();

    const [search, setSearch] = useState('');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [focusFilter, setFocusFilter] = useState('all');
    const [selectedFolderId, setSelectedFolderId] = useState('all');
    const [selectedTag, setSelectedTag] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [newFolderName, setNewFolderName] = useState('');
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [mountTime] = useState(() => Date.now());

    const sevenDaysAgo = mountTime - SEVEN_DAYS_MS;

    const allTags = useMemo(
        () => [...new Set(prompts.flatMap((p) => p.tags || []))].sort((a, b) => a.localeCompare(b)),
        [prompts]
    );
    const allPlatforms = useMemo(
        () => [...new Set(prompts.map((p) => p.platform).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
        [prompts]
    );

    const folderNameById = useMemo(
        () => folders.reduce((acc, f) => { acc[f.id] = f.name; return acc; }, {}),
        [folders]
    );

    const recentCount = useMemo(
        () => prompts.filter((p) => new Date(p.createdAt || 0).getTime() >= sevenDaysAgo).length,
        [prompts, sevenDaysAgo]
    );
    const untaggedCount = useMemo(
        () => prompts.filter((p) => !p.tags || p.tags.length === 0).length,
        [prompts]
    );

    const hasActiveFilters =
        search.trim() ||
        platformFilter !== 'all' ||
        focusFilter !== 'all' ||
        selectedFolderId !== 'all' ||
        selectedTag !== 'all' ||
        sortBy !== 'newest';

    const filteredPrompts = useMemo(() => {
        const query = search.trim().toLowerCase();
        const visible = prompts.filter((p) => {
            const matchesSearch =
                !query ||
                p.title.toLowerCase().includes(query) ||
                p.content.toLowerCase().includes(query) ||
                (p.tags || []).some((t) => t.toLowerCase().includes(query));
            const matchesPlatform = platformFilter === 'all' || p.platform === platformFilter;
            const matchesFolder =
                selectedFolderId === 'all' ||
                (selectedFolderId === 'uncategorized' ? !p.folderId : p.folderId === selectedFolderId);
            const matchesTag = selectedTag === 'all' || (p.tags || []).includes(selectedTag);
            const matchesFocus =
                focusFilter === 'all' ||
                (focusFilter === 'recent' && new Date(p.createdAt || 0).getTime() >= sevenDaysAgo) ||
                (focusFilter === 'untagged' && (!p.tags || p.tags.length === 0));
            return matchesSearch && matchesPlatform && matchesFolder && matchesTag && matchesFocus;
        });

        return visible.sort((a, b) => {
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            if (sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            if (sortBy === 'most-tags') return (b.tags?.length || 0) - (a.tags?.length || 0);
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
    }, [prompts, search, platformFilter, selectedFolderId, selectedTag, focusFilter, sortBy, sevenDaysAgo]);

    const totalPages = Math.max(1, Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);

    const paginatedPrompts = useMemo(() => {
        const start = (safePage - 1) * ITEMS_PER_PAGE;
        return filteredPrompts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredPrompts, safePage]);

    const resetFilters = () => {
        setSearch('');
        setPlatformFilter('all');
        setFocusFilter('all');
        setSelectedFolderId('all');
        setSelectedTag('all');
        setSortBy('newest');
        setCurrentPage(1);
    };

    const handleCreateFolder = (event) => {
        event.preventDefault();
        const name = newFolderName.trim();
        if (!name) return;
        createFolder(name);
        setNewFolderName('');
        setShowCreateFolder(false);
        toast.success(`Folder "${name}" created`);
    };

    const handleDeletePrompt = async (id) => {
        const prompt = prompts.find((p) => p.id === id);
        const confirmed = await confirm({
            title: 'Delete Prompt',
            message: `Delete "${prompt?.title}"? This action cannot be undone.`,
            confirmText: 'Delete',
            variant: 'danger',
        });
        if (!confirmed) return;
        deletePrompt(id);
        toast.success('Prompt deleted');
    };

    const handleCopyPrompt = async (prompt) => {
        try {
            await navigator.clipboard.writeText(prompt.content || '');
            toast.success(`Copied "${prompt.title}"`);
        } catch {
            toast.error('Failed to copy');
        }
    };

    const focusFilters = [
        { id: 'all', label: 'All', count: prompts.length, icon: FolderOpen },
        { id: 'recent', label: 'Recent', count: recentCount, icon: Clock3 },
        { id: 'untagged', label: 'Untagged', count: untaggedCount, icon: AlertCircle },
    ];

    return (
        <div className="space-y-6 pt-4 pb-8">
            {/* Page header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Library</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {prompts.length === 0
                            ? 'Your prompt collection lives here'
                            : `${prompts.length} prompt${prompts.length !== 1 ? 's' : ''}${recentCount > 0 ? ` · ${recentCount} added this week` : ''}`}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Link to="/templates" className="btn-secondary !py-2 !text-xs">
                        <Layers3 size={13} />
                        Templates
                    </Link>
                    <Link to="/new" className="btn-primary !py-2 !text-xs">
                        <Plus size={13} />
                        New Prompt
                    </Link>
                </div>
            </div>

            {/* Search + filters */}
            <div className="space-y-2.5">
                {/* Search row */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                            size={15}
                        />
                        <input
                            data-global-search="library"
                            type="text"
                            placeholder="Search by title, content, or tag…"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            className="glass-input pl-9 !py-2 !text-sm"
                        />
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="glass-button !py-2 !text-xs whitespace-nowrap"
                        >
                            <FilterX size={13} />
                            Clear
                        </button>
                    )}
                </div>

                {/* Focus pills + filter selects */}
                <div className="flex flex-wrap items-center gap-2">
                    {focusFilters.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => { setFocusFilter(f.id); setCurrentPage(1); }}
                            className={clsx(
                                'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all',
                                focusFilter === f.id
                                    ? 'border-primary/30 bg-primary/8 text-primary'
                                    : 'border-border text-text-secondary hover:text-text-main hover:border-primary/20'
                            )}
                        >
                            <f.icon size={11} />
                            {f.label}
                            <span className={clsx(
                                'rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                                focusFilter === f.id ? 'bg-primary/15' : 'bg-surface-highlight'
                            )}>
                                {f.count}
                            </span>
                        </button>
                    ))}

                    <div className="ml-auto flex flex-wrap gap-1.5">
                        {allPlatforms.length > 0 && (
                            <FilterSelect
                                value={platformFilter}
                                onChange={(e) => { setPlatformFilter(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="all">Platform</option>
                                {allPlatforms.map((p) => <option key={p} value={p}>{p}</option>)}
                            </FilterSelect>
                        )}
                        <FilterSelect
                            value={selectedFolderId}
                            onChange={(e) => { setSelectedFolderId(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="all">Folder</option>
                            <option value="uncategorized">Uncategorized</option>
                            {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </FilterSelect>
                        {allTags.length > 0 && (
                            <FilterSelect
                                value={selectedTag}
                                onChange={(e) => { setSelectedTag(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="all">Tag</option>
                                {allTags.map((t) => <option key={t} value={t}>#{t}</option>)}
                            </FilterSelect>
                        )}
                        <FilterSelect
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="title">A–Z</option>
                            <option value="most-tags">Most Tags</option>
                        </FilterSelect>
                    </div>
                </div>

                {/* Folder creation */}
                <div>
                    {!showCreateFolder ? (
                        <button
                            onClick={() => setShowCreateFolder(true)}
                            className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-main transition-colors"
                        >
                            <Plus size={11} />
                            New folder
                        </button>
                    ) : (
                        <form onSubmit={handleCreateFolder} className="flex items-center gap-2">
                            <input
                                type="text"
                                autoFocus
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="Folder name"
                                className="glass-input !py-1 !px-2.5 !text-xs !w-36"
                            />
                            <button type="submit" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowCreateFolder(false); setNewFolderName(''); }}
                                className="text-xs text-text-secondary hover:text-text-main transition-colors"
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Content area */}
            {prompts.length === 0 ? (
                <div className="glass-panel py-16 text-center border-dashed">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Sparkles size={22} className="text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Start with your first prompt</h2>
                    <p className="text-sm text-text-secondary mb-6 max-w-xs mx-auto">
                        Write a prompt, add variables, and test it across multiple models.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <Link to="/new" className="btn-primary">
                            <Plus size={14} />
                            New Prompt
                        </Link>
                        <Link to="/templates" className="btn-secondary">
                            <Layers3 size={14} />
                            Browse Templates
                        </Link>
                    </div>
                </div>
            ) : filteredPrompts.length === 0 ? (
                <div className="glass-panel py-14 text-center border-dashed">
                    <p className="text-sm text-text-secondary mb-3">No prompts match these filters</p>
                    <button onClick={resetFilters} className="btn-secondary !py-2 !text-xs">
                        <FilterX size={13} />
                        Reset filters
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-xs text-text-secondary">
                        {filteredPrompts.length} result{filteredPrompts.length !== 1 ? 's' : ''}
                        {totalPages > 1 && ` · page ${safePage} of ${totalPages}`}
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {paginatedPrompts.map((prompt) => (
                            <PromptRow
                                key={prompt.id}
                                prompt={prompt}
                                folderName={prompt.folderId ? folderNameById[prompt.folderId] : null}
                                onDelete={handleDeletePrompt}
                                onCopy={handleCopyPrompt}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                                className="glass-button !px-3 !py-2 !text-xs disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={14} />
                                Prev
                            </button>
                            <span className="text-xs text-text-secondary tabular-nums px-2">
                                {safePage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={safePage === totalPages}
                                className="glass-button !px-3 !py-2 !text-xs disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
