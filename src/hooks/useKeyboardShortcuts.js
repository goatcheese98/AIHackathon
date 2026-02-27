import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Global keyboard shortcuts hook
 *
 * Shortcuts:
 * - Cmd/Ctrl + K: Focus search (on Library page)
 * - Cmd/Ctrl + N: New prompt
 * - Cmd/Ctrl + /: Open keyboard shortcuts help
 * - Escape: Close modals/dropdowns
 */
export function useKeyboardShortcuts({ onSearch, onToggleHelp }) {
    const navigate = useNavigate();

    const handleKeyDown = useCallback((e) => {
        // Check for modifier key (Cmd on Mac, Ctrl on others)
        const isMod = e.metaKey || e.ctrlKey;

        // Don't trigger shortcuts when typing in inputs
        const isInput = e.target.tagName === 'INPUT' ||
                       e.target.tagName === 'TEXTAREA' ||
                       e.target.isContentEditable;

        // Cmd/Ctrl + K: Focus search
        if (isMod && e.key === 'k') {
            e.preventDefault();
            onSearch?.();
        }

        // Cmd/Ctrl + N: New prompt
        if (isMod && e.key === 'n' && !isInput) {
            e.preventDefault();
            navigate('/new');
        }

        // Cmd/Ctrl + /: Toggle shortcuts help
        if (isMod && e.key === '/') {
            e.preventDefault();
            onToggleHelp?.();
        }

        // G then L: Go to Library (vim-style)
        // G then A: Go to Arena
        // G then S: Go to Settings
        // G then H: Go to Home
    }, [navigate, onSearch, onToggleHelp]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

// Keyboard shortcuts data for help display
export const KEYBOARD_SHORTCUTS = [
    { keys: ['⌘', 'K'], description: 'Focus search', category: 'Navigation' },
    { keys: ['⌘', 'N'], description: 'New prompt', category: 'Navigation' },
    { keys: ['⌘', '/'], description: 'Toggle shortcuts help', category: 'Help' },
    { keys: ['Esc'], description: 'Close modals', category: 'General' },
];
