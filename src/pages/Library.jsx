import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { useStore } from '../hooks/useStore';
import { PromptCard } from '../components/PromptCard';
import { useConfirm } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import {
    Search,
    Filter,
    Plus,
    Folder,
    Trash2,
    Tag,
    Hash,
    ChevronLeft,
    ChevronRight,
    Layers3,
    Sparkles
} from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export function Library() {
    const { prompts, folders, deletePrompt, createFolder, deleteFolder, updatePrompt } = useStore();
    const confirm = useConfirm();
    const toast = useToast();

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [selectedFolderId, setSelectedFolderId] = useState('all');
    const [selectedTag, setSelectedTag] = useState('all');
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const allTags = [...new Set(prompts.flatMap((prompt) => prompt.tags || []))].sort();
    const allPlatforms = ['All', ...new Set(prompts.map((prompt) => prompt.platform).filter(Boolean))];

    const filteredPrompts = useMemo(() => {
        return prompts.filter((prompt) => {
            const matchesSearch = prompt.title.toLowerCase().includes(search.toLowerCase()) ||
                prompt.content.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = filter === 'All' || prompt.platform === filter;
            const matchesFolder = selectedFolderId === 'all' ||
                (selectedFolderId === 'uncategorized' ? !prompt.folderId : prompt.folderId === selectedFolderId);
            const matchesTag = selectedTag === 'all' || (prompt.tags && prompt.tags.includes(selectedTag));

            return matchesSearch && matchesFilter && matchesFolder && matchesTag;
        });
    }, [prompts, search, filter, selectedFolderId, selectedTag]);

    const totalPages = Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE);

    const paginatedPrompts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPrompts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredPrompts, currentPage]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [search, filter, selectedFolderId, selectedTag]);

    const handleCreateFolder = (event) => {
        event.preventDefault();
        if (!newFolderName.trim()) return;

        createFolder(newFolderName.trim());
        setNewFolderName('');
        setIsCreatingFolder(false);
        toast.success(`Folder "${newFolderName.trim()}" created`);
    };

    const handleDeletePrompt = async (id) => {
        const prompt = prompts.find((item) => item.id === id);
        const confirmed = await confirm({
            title: 'Delete Prompt',
            message: `Are you sure you want to delete "${prompt?.title}"? This action cannot be undone.`,
            confirmText: 'Delete',
            variant: 'danger'
        });

        if (confirmed) {
            deletePrompt(id);
            toast.success('Prompt deleted');
        }
    };

    const handleDeleteFolder = async (folderId) => {
        const folder = folders.find((item) => item.id === folderId);
        const promptCount = prompts.filter((prompt) => prompt.folderId === folderId).length;

        const confirmed = await confirm({
            title: 'Delete Folder',
            message: `Are you sure you want to delete "${folder?.name}"? ${promptCount > 0 ? `${promptCount} prompt(s) will be moved to Uncategorized.` : ''} This action cannot be undone.`,
            confirmText: 'Delete',
            variant: 'danger'
        });

        if (confirmed) {
            deleteFolder(folderId);
            if (selectedFolderId === folderId) {
                setSelectedFolderId('all');
            }
            toast.success('Folder deleted');
        }
    };

    return (
        <div className="space-y-8">
            <section className="glass-panel p-6 md:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main">My Prompt Library</h1>
                        <p className="mt-2 text-text-secondary max-w-3xl">
                            Library is personal. Keep your working prompts here, organized by your folders and tags. Use Templates for recommended starters.
                        </p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <Link to="/templates" className="glass-button inline-flex items-center gap-2">
                            <Layers3 size={16} />
                            Browse Templates
                        </Link>
                        <Link to="/new" className="btn-primary inline-flex items-center gap-2">
                            <Plus size={16} />
                            New Prompt
                        </Link>
                    </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-surface-highlight p-4">
                        <p className="text-sm text-text-secondary">Personal prompts</p>
                        <p className="mt-1 text-2xl font-bold text-text-main">{prompts.length}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-highlight p-4">
                        <p className="text-sm text-text-secondary">Folders</p>
                        <p className="mt-1 text-2xl font-bold text-text-main">{folders.length}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-highlight p-4">
                        <p className="text-sm text-text-secondary">Active tags</p>
                        <p className="mt-1 text-2xl font-bold text-text-main">{allTags.length}</p>
                    </div>
                </div>
            </section>

            <div className="flex flex-col gap-8 md:flex-row">
                <div className="flex-1">
                    <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative lg:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none z-10" size={18} />
                            <input
                                type="text"
                                placeholder="Search prompts..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="glass-input-with-icon"
                            />
                        </div>

                        <div className="relative w-full lg:w-auto lg:min-w-52">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none z-10" size={18} />
                            <select
                                value={filter}
                                onChange={(event) => setFilter(event.target.value)}
                                className="glass-input-with-icon appearance-none cursor-pointer"
                                style={{ paddingRight: '2rem' }}
                            >
                                {allPlatforms.map((platform) => (
                                    <option key={platform} value={platform}>
                                        {platform === 'All' ? 'All Platforms' : platform}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        {paginatedPrompts.map((prompt) => (
                            <PromptCard
                                key={prompt.id}
                                prompt={prompt}
                                onDelete={handleDeletePrompt}
                                onUpdate={updatePrompt}
                            />
                        ))}

                        {filteredPrompts.length === 0 && (
                            <div className="col-span-full py-20 text-center glass-panel border-dashed">
                                <Sparkles size={28} className="mx-auto text-text-secondary" />
                                <h3 className="mt-4 text-lg font-medium text-text-main">No prompts in this view</h3>
                                <p className="mt-2 text-text-secondary">Start from scratch or pull in a recommended template.</p>
                                <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
                                    <Link to="/new" className="btn-primary inline-flex items-center gap-2">
                                        <Plus size={16} />
                                        New Prompt
                                    </Link>
                                    <Link to="/templates" className="glass-button inline-flex items-center gap-2">
                                        <Layers3 size={16} />
                                        Use Templates
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <button
                                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                disabled={currentPage === 1}
                                className="glass-button p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Previous page"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={clsx(
                                            'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                                            currentPage === page ? 'bg-primary text-white' : 'glass-button'
                                        )}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                                disabled={currentPage === totalPages}
                                className="glass-button p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Next page"
                            >
                                <ChevronRight size={18} />
                            </button>

                            <span className="ml-2 text-sm text-text-secondary">
                                {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>

                <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                    <div className="glass-panel p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                                <Folder size={18} className="text-primary" />
                                Folders
                            </h2>
                            <button
                                onClick={() => setIsCreatingFolder(!isCreatingFolder)}
                                className="p-1 hover:bg-surface-highlight rounded text-text-secondary hover:text-primary transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        {isCreatingFolder && (
                            <form onSubmit={handleCreateFolder} className="mb-4">
                                <input
                                    type="text"
                                    autoFocus
                                    value={newFolderName}
                                    onChange={(event) => setNewFolderName(event.target.value)}
                                    placeholder="Folder name..."
                                    className="glass-input text-sm py-1 px-2 mb-2"
                                />
                                <div className="flex gap-2">
                                    <button type="submit" className="text-xs bg-primary text-white px-2 py-1 rounded">Add</button>
                                    <button type="button" onClick={() => setIsCreatingFolder(false)} className="text-xs text-text-secondary px-2 py-1">Cancel</button>
                                </div>
                            </form>
                        )}

                        <nav className="space-y-1 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            <button
                                onClick={() => {
                                    setSelectedFolderId('all');
                                    setSelectedTag('all');
                                }}
                                className={clsx(
                                    'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between',
                                    selectedFolderId === 'all'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:text-text-main hover:bg-surface-highlight'
                                )}
                            >
                                All Prompts
                                <span className="text-xs opacity-60">{prompts.length}</span>
                            </button>

                            <button
                                onClick={() => setSelectedFolderId('uncategorized')}
                                className={clsx(
                                    'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between',
                                    selectedFolderId === 'uncategorized'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:text-text-main hover:bg-surface-highlight'
                                )}
                            >
                                Uncategorized
                                <span className="text-xs opacity-60">{prompts.filter((prompt) => !prompt.folderId).length}</span>
                            </button>

                            {folders?.map((folder) => (
                                <div key={folder.id} className="group relative">
                                    <button
                                        onClick={() => setSelectedFolderId(folder.id)}
                                        className={clsx(
                                            'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between',
                                            selectedFolderId === folder.id
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-text-secondary hover:text-text-main hover:bg-surface-highlight'
                                        )}
                                    >
                                        <span className="truncate">{folder.name}</span>
                                        <span className="text-xs opacity-60">{prompts.filter((prompt) => prompt.folderId === folder.id).length}</span>
                                    </button>
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleDeleteFolder(folder.id);
                                        }}
                                        className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete folder"
                                        aria-label={`Delete folder ${folder.name}`}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </nav>
                    </div>

                    <div className="glass-panel p-4">
                        <h2 className="text-lg font-bold text-text-main flex items-center gap-2 mb-4">
                            <Tag size={18} className="text-primary" />
                            Tags
                        </h2>

                        <div className="space-y-1 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                            <button
                                onClick={() => setSelectedTag('all')}
                                className={clsx(
                                    'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                                    selectedTag === 'all'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:text-text-main hover:bg-surface-highlight'
                                )}
                            >
                                <Hash size={14} />
                                All Tags
                            </button>

                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={clsx(
                                        'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group',
                                        selectedTag === tag
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-text-secondary hover:text-text-main hover:bg-surface-highlight'
                                    )}
                                >
                                    <span className="truncate">#{tag}</span>
                                    <span className="text-xs opacity-0 group-hover:opacity-60 transition-opacity">
                                        {prompts.filter((prompt) => prompt.tags?.includes(tag)).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
