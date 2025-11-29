import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { PromptCard } from '../components/PromptCard';
import { Search, Filter, Plus, Folder, FolderPlus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export function Library() {
    const { prompts, folders, deletePrompt, createFolder, deleteFolder } = useStore();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [selectedFolderId, setSelectedFolderId] = useState('all');
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

    const filteredPrompts = prompts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.content.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || p.platform === filter;
        const matchesFolder = selectedFolderId === 'all' ||
            (selectedFolderId === 'uncategorized' ? !p.folderId : p.folderId === selectedFolderId);
        return matchesSearch && matchesFilter && matchesFolder;
    });

    const handleCreateFolder = (e) => {
        e.preventDefault();
        if (newFolderName.trim()) {
            createFolder(newFolderName.trim());
            setNewFolderName('');
            setIsCreatingFolder(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Folders Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="glass-panel p-4 sticky top-4">
                    <div className="flex justify-between items-center mb-4">
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
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="Folder name..."
                                className="glass-input text-sm py-1 px-2 mb-2"
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="text-xs bg-primary text-white px-2 py-1 rounded">Add</button>
                                <button type="button" onClick={() => setIsCreatingFolder(false)} className="text-xs text-text-secondary px-2 py-1">Cancel</button>
                            </div>
                        </form>
                    )}

                    <nav className="space-y-1">
                        <button
                            onClick={() => setSelectedFolderId('all')}
                            className={clsx(
                                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                                selectedFolderId === 'all' ? "bg-primary/10 text-primary" : "text-text-secondary hover:text-text-main hover:bg-surface-highlight"
                            )}
                        >
                            All Prompts
                            <span className="text-xs opacity-60">{prompts.length}</span>
                        </button>
                        <button
                            onClick={() => setSelectedFolderId('uncategorized')}
                            className={clsx(
                                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                                selectedFolderId === 'uncategorized' ? "bg-primary/10 text-primary" : "text-text-secondary hover:text-text-main hover:bg-surface-highlight"
                            )}
                        >
                            Uncategorized
                            <span className="text-xs opacity-60">{prompts.filter(p => !p.folderId).length}</span>
                        </button>
                        {folders?.map(folder => (
                            <div key={folder.id} className="group relative">
                                <button
                                    onClick={() => setSelectedFolderId(folder.id)}
                                    className={clsx(
                                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                                        selectedFolderId === folder.id ? "bg-primary/10 text-primary" : "text-text-secondary hover:text-text-main hover:bg-surface-highlight"
                                    )}
                                >
                                    <span className="truncate">{folder.name}</span>
                                    <span className="text-xs opacity-60">{prompts.filter(p => p.folderId === folder.id).length}</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete folder"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main mb-2">Library</h1>
                        <p className="text-text-secondary">
                            {selectedFolderId === 'all' ? 'All Prompts' :
                                selectedFolderId === 'uncategorized' ? 'Uncategorized Prompts' :
                                    folders.find(f => f.id === selectedFolderId)?.name || 'Folder'}
                        </p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <input
                                type="text"
                                placeholder="Search prompts..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="glass-input pl-10 w-full md:w-64"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="glass-input pl-10 appearance-none cursor-pointer"
                            >
                                <option value="All">All Platforms</option>
                                <option value="ChatGPT">ChatGPT</option>
                                <option value="Claude">Claude</option>
                                <option value="Gemini">Gemini</option>
                            </select>
                        </div>
                        <Link to="/new" className="btn-primary flex items-center gap-2 whitespace-nowrap">
                            <Plus size={18} /> New
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPrompts.map(prompt => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            onDelete={deletePrompt}
                        />
                    ))}

                    {filteredPrompts.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-16 h-16 bg-surface-highlight rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary">
                                <Search size={24} />
                            </div>
                            <h3 className="text-lg font-medium text-text-main mb-1">No prompts found</h3>
                            <p className="text-text-secondary">Try adjusting your search or create a new prompt.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
