import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { KEYBOARD_SHORTCUTS } from '../hooks/useKeyboardShortcuts';

export function KeyboardShortcutsHelp({ isOpen, onClose }) {
    if (!isOpen) return null;

    const groupedShortcuts = KEYBOARD_SHORTCUTS.reduce((acc, shortcut) => {
        if (!acc[shortcut.category]) {
            acc[shortcut.category] = [];
        }
        acc[shortcut.category].push(shortcut);
        return acc;
    }, {});

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
        >
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />
            <div className="relative bg-surface border border-border rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 fade-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Keyboard size={20} />
                        </div>
                        <h2 id="shortcuts-title" className="text-lg font-bold text-text-main">
                            Keyboard Shortcuts
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-surface-highlight text-text-secondary hover:text-text-main transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
                        <div key={category} className="mb-4 last:mb-0">
                            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                                {category}
                            </h3>
                            <div className="space-y-2">
                                {shortcuts.map((shortcut, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface-highlight transition-colors"
                                    >
                                        <span className="text-sm text-text-main">
                                            {shortcut.description}
                                        </span>
                                        <div className="flex gap-1">
                                            {shortcut.keys.map((key, keyIdx) => (
                                                <kbd
                                                    key={keyIdx}
                                                    className="px-2 py-1 bg-surface-highlight border border-border rounded text-xs font-mono text-text-secondary"
                                                >
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-border text-center">
                    <p className="text-xs text-text-secondary">
                        Press <kbd className="px-1 py-0.5 bg-surface-highlight border border-border rounded text-xs">⌘</kbd> + <kbd className="px-1 py-0.5 bg-surface-highlight border border-border rounded text-xs">/</kbd> to toggle this dialog
                    </p>
                </div>
            </div>
        </div>
    );
}
