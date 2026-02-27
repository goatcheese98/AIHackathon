import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { clsx } from 'clsx';

const ConfirmContext = createContext(null);

function ConfirmDialog({ config, onConfirm, onCancel }) {
    if (!config) return null;

    const {
        title = 'Confirm Action',
        message = 'Are you sure you want to proceed?',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        variant = 'danger',
        icon: CustomIcon
    } = config;

    const Icon = CustomIcon || (variant === 'danger' ? Trash2 : AlertTriangle);

    const variantStyles = {
        danger: {
            icon: 'bg-red-500/10 text-red-500',
            button: 'bg-red-500 hover:bg-red-600 text-white'
        },
        warning: {
            icon: 'bg-amber-500/10 text-amber-500',
            button: 'bg-amber-500 hover:bg-amber-600 text-white'
        },
        info: {
            icon: 'bg-blue-500/10 text-blue-500',
            button: 'bg-blue-500 hover:bg-blue-600 text-white'
        }
    };

    const styles = variantStyles[variant] || variantStyles.danger;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
        >
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onCancel}
            />
            <div className="relative bg-surface border border-border rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 fade-in duration-200">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1 rounded-lg hover:bg-surface-highlight text-text-secondary hover:text-text-main transition-colors"
                    aria-label="Close dialog"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center mb-4", styles.icon)}>
                        <Icon size={24} />
                    </div>

                    <h2 id="confirm-title" className="text-xl font-bold text-text-main mb-2">
                        {title}
                    </h2>
                    <p className="text-text-secondary mb-6">
                        {message}
                    </p>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onCancel}
                            className="glass-button px-4 py-2"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={clsx("px-4 py-2 rounded-lg font-medium transition-colors", styles.button)}
                            autoFocus
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ConfirmProvider({ children }) {
    const [config, setConfig] = useState(null);
    const [resolveRef, setResolveRef] = useState(null);

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setConfig(options);
            setResolveRef(() => resolve);
        });
    }, []);

    const handleConfirm = () => {
        resolveRef?.(true);
        setConfig(null);
        setResolveRef(null);
    };

    const handleCancel = () => {
        resolveRef?.(false);
        setConfig(null);
        setResolveRef(null);
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            {config && (
                <ConfirmDialog
                    config={config}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
}
