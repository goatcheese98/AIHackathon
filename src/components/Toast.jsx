import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

const ToastContext = createContext(null);

const TOAST_TYPES = {
    success: {
        icon: CheckCircle,
        className: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
        iconClassName: 'text-emerald-500'
    },
    error: {
        icon: AlertCircle,
        className: 'bg-red-500/10 border-red-500/30 text-red-500',
        iconClassName: 'text-red-500'
    },
    warning: {
        icon: AlertTriangle,
        className: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
        iconClassName: 'text-amber-500'
    },
    info: {
        icon: Info,
        className: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
        iconClassName: 'text-blue-500'
    }
};

function Toast({ toast, onDismiss }) {
    const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
    const Icon = config.icon;

    return (
        <div
            className={clsx(
                "flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm",
                "animate-in slide-in-from-top-2 fade-in duration-300",
                config.className
            )}
            role="alert"
            aria-live="polite"
        >
            <Icon size={20} className={clsx("flex-shrink-0 mt-0.5", config.iconClassName)} />
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <p className="font-semibold text-text-main text-sm">{toast.title}</p>
                )}
                <p className="text-sm text-text-secondary">{toast.message}</p>
            </div>
            <button
                onClick={() => onDismiss(toast.id)}
                className="flex-shrink-0 p-1 rounded hover:bg-surface-highlight transition-colors"
                aria-label="Dismiss notification"
            >
                <X size={16} />
            </button>
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', title = null, duration = 4000) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type, title };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (message, title) => addToast(message, 'success', title),
        error: (message, title) => addToast(message, 'error', title, 6000),
        warning: (message, title) => addToast(message, 'warning', title),
        info: (message, title) => addToast(message, 'info', title),
        dismiss: dismissToast
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div
                className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
                aria-label="Notifications"
            >
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto">
                        <Toast toast={t} onDismiss={dismissToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
