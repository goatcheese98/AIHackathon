import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout as LayoutIcon, PlusCircle, Swords, BookOpen, Settings, Sun, Moon, Home } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../context/ThemeContext';

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
            active
                ? "bg-primary/10 text-primary border border-primary/20 font-semibold"
                : "text-text-secondary hover:text-text-main hover:bg-surface-highlight"
        )}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

export function Layout({ children }) {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const isLanding = location.pathname === '/';

    if (isLanding) {
        return (
            <div className="min-h-screen bg-background text-text-main">
                <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg shadow-primary/20">
                            <LayoutIcon size={20} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-main to-text-secondary">
                            PromptFolio
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-surface-highlight text-text-secondary transition-colors"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <Link to="/app" className="btn-primary">
                            Launch App
                        </Link>
                    </div>
                </nav>
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-background text-text-main selection:bg-primary/30 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border p-6 flex flex-col gap-8 fixed h-full glass-panel m-4 rounded-2xl z-10">
                <Link to="/" className="flex items-center gap-3 px-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-md shadow-primary/20">
                        <LayoutIcon size={18} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-text-main">
                        PromptFolio
                    </h1>
                </Link>

                <nav className="flex flex-col gap-2">
                    <NavItem
                        to="/app"
                        icon={BookOpen}
                        label="Library"
                        active={location.pathname === '/app'}
                    />
                    <NavItem
                        to="/new"
                        icon={PlusCircle}
                        label="New Prompt"
                        active={location.pathname === '/new'}
                    />
                    <NavItem
                        to="/arena"
                        icon={Swords}
                        label="The Arena"
                        active={location.pathname === '/arena'}
                    />
                    <NavItem
                        to="/settings"
                        icon={Settings}
                        label="Settings"
                        active={location.pathname === '/settings'}
                    />
                </nav>

                <div className="mt-auto pt-6 border-t border-border flex flex-col gap-4">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-text-secondary hover:text-text-main hover:bg-surface-highlight transition-colors w-full"
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>

                    <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-primary/5 to-cyan-500/5 border border-primary/10">
                        <p className="text-xs text-text-secondary mb-1">Pro Plan</p>
                        <p className="text-sm font-medium text-text-main">Hackathon Team</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-[calc(16rem+2rem)] p-8">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
