import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { PromptCard } from '../components/PromptCard';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Library() {
    const { prompts, deletePrompt } = useStore();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredPrompts = prompts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.content.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || p.platform === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main mb-2">Library</h1>
                    <p className="text-text-secondary">Manage and organize your prompt collection.</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    );
}
