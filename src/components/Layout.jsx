import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Layout as LayoutIcon,
    Swords,
    BookOpen,
    Settings,
    Sun,
    Moon,
    History,
    Keyboard,
    Layers3,
    Plus,
    PencilRuler,
    Menu,
    X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../context/ThemeContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

const APP_NAV_ITEMS = [
    { to: '/app', icon: BookOpen, label: 'Library' },
    { to: '/templates', icon: Layers3, label: 'Templates' },
    { to: '/new', icon: PencilRuler, label: 'Compose' },
    { to: '/arena', icon: Swords, label: 'Playground' },
    { to: '/history', icon: History, label: 'Runs' },
    { to: '/settings', icon: Settings, label: 'Settings' },
];

const ALT_LINKS = [
    { to: '/alt1', label: '1' },
    { to: '/alt2', label: '2' },
    { to: '/alt3', label: '3' },
    { to: '/alt4', label: '4' },
    { to: '/alt5', label: '5' },
    { to: '/alt6', label: '6' },
    { to: '/alt7', label: '7' },
];

function isNavActive(item, pathname) {
    if (item.to === '/new') return pathname === '/new' || pathname.startsWith('/edit/');
    return pathname === item.to;
}

// Minimal transparent header for landing pages
function LandingHeader({ location, theme, toggleTheme, onShowShortcuts }) {
    const isLight = theme === 'light';

    const allVariants = [{ to: '/', label: '↩' }, ...ALT_LINKS];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4">
            <nav
                className="mx-auto max-w-6xl flex items-center justify-between px-4 py-2.5 rounded-2xl backdrop-blur-md border transition-colors duration-300"
                style={{
                    background: isLight
                        ? 'rgba(255, 255, 255, 0.6)'
                        : 'rgba(0, 0, 0, 0.3)',
                    borderColor: isLight
                        ? 'rgba(0, 0, 0, 0.08)'
                        : 'rgba(255, 255, 255, 0.1)',
                }}
            >
                <Link
                    to="/"
                    className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
                    style={{ color: isLight ? '#1c1917' : '#fafaf9' }}
                >
                    <LayoutIcon size={16} />
                    <span>PromptFolio</span>
                </Link>

                {/* Variant buttons — inline, no dropdown */}
                <div className="flex items-center gap-1">
                    {allVariants.map((link) => {
                        const active = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={clsx(
                                    'flex items-center justify-center w-7 h-7 rounded-lg text-xs font-medium transition-all',
                                    active
                                        ? 'bg-black/12 dark:bg-white/20 text-black dark:text-white'
                                        : 'text-stone-500 dark:text-stone-400 hover:bg-black/6 dark:hover:bg-white/10 hover:text-stone-700 dark:hover:text-stone-200'
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={onShowShortcuts}
                        className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                        style={{ color: isLight ? '#57534e' : '#a8a29e' }}
                        aria-label="Keyboard shortcuts"
                    >
                        <Keyboard size={14} />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                        style={{ color: isLight ? '#57534e' : '#a8a29e' }}
                        aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
                    >
                        {isLight ? <Moon size={14} /> : <Sun size={14} />}
                    </button>
                    <Link
                        to="/app"
                        className="ml-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                        style={{
                            background: isLight ? '#1c1917' : '#fafaf9',
                            color: isLight ? '#fafaf9' : '#1c1917',
                        }}
                    >
                        Open App
                    </Link>
                </div>
            </nav>
        </header>
    );
}

// App header — same floating style as landing, with inline navigation
function AppHeader({ location, theme, toggleTheme, onShowShortcuts }) {
    const isLight = theme === 'light';
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3">
            <nav
                className="mx-auto max-w-6xl flex items-center justify-between px-4 py-2 rounded-2xl backdrop-blur-md border transition-colors duration-300"
                style={{
                    background: isLight
                        ? 'rgba(242, 245, 251, 0.90)'
                        : 'rgba(10, 19, 36, 0.86)',
                    borderColor: isLight
                        ? 'rgba(0, 0, 0, 0.08)'
                        : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isLight
                        ? '0 4px 24px rgba(0,0,0,0.06)'
                        : '0 4px 24px rgba(0,0,0,0.35)',
                }}
            >
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-sm font-semibold shrink-0 transition-opacity hover:opacity-70"
                    style={{ color: isLight ? '#111f35' : '#e8f0ff' }}
                >
                    <LayoutIcon size={16} />
                    <span>PromptFolio</span>
                </Link>

                {/* Center nav — desktop */}
                <div className="hidden md:flex items-center gap-0.5">
                    {APP_NAV_ITEMS.map((item) => {
                        const active = isNavActive(item, location.pathname);
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={clsx(
                                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150',
                                    active
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:text-text-main hover:bg-black/5 dark:hover:bg-white/8'
                                )}
                            >
                                <item.icon size={13} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onShowShortcuts}
                        className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                        style={{ color: isLight ? '#5f6f8a' : '#9cb0cf' }}
                        aria-label="Keyboard shortcuts"
                    >
                        <Keyboard size={14} />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                        style={{ color: isLight ? '#5f6f8a' : '#9cb0cf' }}
                        aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
                    >
                        {isLight ? <Moon size={14} /> : <Sun size={14} />}
                    </button>
                    <Link
                        to="/new"
                        className="ml-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all hover:opacity-85"
                        style={{
                            background: isLight ? '#111f35' : '#e8f0ff',
                            color: isLight ? '#e8f0ff' : '#111f35',
                        }}
                    >
                        <Plus size={13} />
                        New
                    </Link>
                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileOpen((prev) => !prev)}
                        className="md:hidden ml-1 p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                        style={{ color: isLight ? '#5f6f8a' : '#9cb0cf' }}
                        aria-label="Navigation menu"
                    >
                        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>
            </nav>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setMobileOpen(false)} />
                    <div
                        className="absolute top-full left-4 right-4 mt-2 rounded-2xl border backdrop-blur-md p-2 z-50 animate-slide-in-top"
                        style={{
                            background: isLight
                                ? 'rgba(255, 255, 255, 0.97)'
                                : 'rgba(10, 19, 36, 0.97)',
                            borderColor: isLight
                                ? 'rgba(0, 0, 0, 0.08)'
                                : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: isLight
                                ? '0 8px 32px rgba(0,0,0,0.12)'
                                : '0 8px 32px rgba(0,0,0,0.5)',
                        }}
                    >
                        {APP_NAV_ITEMS.map((item) => {
                            const active = isNavActive(item, location.pathname);
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={clsx(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                                        active
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-text-secondary hover:bg-surface-highlight hover:text-text-main'
                                    )}
                                >
                                    <item.icon size={16} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}
        </header>
    );
}

export function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [showShortcuts, setShowShortcuts] = useState(false);

    const isLanding = ['/', '/alt1', '/alt2', '/alt3', '/alt4', '/alt5', '/alt6', '/alt7'].includes(location.pathname);

    useKeyboardShortcuts({
        onToggleHelp: () => setShowShortcuts((prev) => !prev),
        onSearch: () => {
            if (location.pathname === '/app') {
                document.querySelector('input[data-global-search="library"]')?.focus();
            } else {
                navigate('/app');
            }
        },
    });

    return (
        <div className="min-h-screen bg-background text-text-main transition-colors duration-300">
            {isLanding ? (
                <>
                    <LandingHeader
                        location={location}
                        theme={theme}
                        toggleTheme={toggleTheme}
                        onShowShortcuts={() => setShowShortcuts(true)}
                    />
                    <div className="pt-20">{children}</div>
                </>
            ) : (
                <>
                    <AppHeader
                        location={location}
                        theme={theme}
                        toggleTheme={toggleTheme}
                        onShowShortcuts={() => setShowShortcuts(true)}
                    />
                    <main role="main" className="mx-auto max-w-5xl px-4 sm:px-6 pb-16 pt-20">
                        {children}
                    </main>
                </>
            )}

            <KeyboardShortcutsHelp
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
            />
        </div>
    );
}
