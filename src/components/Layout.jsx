import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout as LayoutIcon, Swords, BookOpen, Settings, Sun, Moon, History, Keyboard, Layers3 } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../context/ThemeContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

const NavItem = ({ to, icon, label, active }) => {
    const IconComponent = icon;

    return (
        <Link
            to={to}
            className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                active
                    ? "bg-primary/10 text-primary border border-primary/20 font-semibold"
                    : "text-text-secondary hover:text-text-main hover:bg-surface-highlight"
            )}
        >
            {IconComponent ? <IconComponent size={20} /> : null}
            <span className="font-medium">{label}</span>
        </Link>
    );
};

export function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [showShortcuts, setShowShortcuts] = useState(false);

    const isLanding = ['/', '/alt1', '/alt2', '/alt3', '/alt4', '/alt5'].includes(location.pathname);
    const altLinks = [
        { to: '/alt1', label: 'Alt1' },
        { to: '/alt2', label: 'Alt2' },
        { to: '/alt3', label: 'Alt3' },
        { to: '/alt4', label: 'Alt4' },
        { to: '/alt5', label: 'Alt5' },
    ];

    useKeyboardShortcuts({
        onToggleHelp: () => setShowShortcuts(prev => !prev),
        onSearch: () => {
            if (location.pathname === '/app') {
                document.querySelector('input[placeholder*="Search"]')?.focus();
            } else {
                navigate('/app');
            }
        }
    });

    if (isLanding) {
        return (
            <div className="min-h-screen bg-background text-text-main">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link to="/" className="flex items-center gap-3 shrink-0 hover:opacity-90 transition-opacity">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg shadow-primary/20">
                                <LayoutIcon size={20} className="text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-main to-text-secondary">
                                PromptFolio
                            </span>
                        </Link>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar whitespace-nowrap pb-1">
                                {altLinks.map(link => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={clsx(
                                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                                            location.pathname === link.to
                                                ? "bg-primary/12 text-primary border-primary/30"
                                                : "bg-surface/80 text-text-secondary border-border hover:text-text-main hover:bg-surface-highlight"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
                        label="My Library"
                        active={location.pathname === '/app'}
                    />
                    <NavItem
                        to="/templates"
                        icon={Layers3}
                        label="Templates"
                        active={location.pathname === '/templates'}
                    />
                    <NavItem
                        to="/arena"
                        icon={Swords}
                        label="The Arena"
                        active={location.pathname === '/arena'}
                    />
                    <NavItem
                        to="/history"
                        icon={History}
                        label="History"
                        active={location.pathname === '/history'}
                    />
                    <NavItem
                        to="/settings"
                        icon={Settings}
                        label="Settings"
                        active={location.pathname === '/settings'}
                    />
                </nav>

                <div className="mt-auto pt-6 border-t border-border flex flex-col gap-3">
                    <button
                        onClick={() => setShowShortcuts(true)}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-text-secondary hover:text-text-main hover:bg-surface-highlight transition-colors w-full"
                        aria-label="View keyboard shortcuts"
                    >
                        <Keyboard size={18} />
                        <span className="font-medium">Shortcuts</span>
                        <kbd className="ml-auto text-xs bg-surface-highlight px-1.5 py-0.5 rounded border border-border">⌘/</kbd>
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-text-secondary hover:text-text-main hover:bg-surface-highlight transition-colors w-full"
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
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
            <main className="flex-1 ml-[calc(16rem+2rem)] p-8" role="main">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Keyboard Shortcuts Help Modal */}
            <KeyboardShortcutsHelp
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
            />
        </div>
    );
}
