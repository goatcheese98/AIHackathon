import React, { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { AIService } from '../services/ai';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmDialog';
import { exportToJSON, exportToMarkdown } from '../utils/export';
import { DEFAULT_MODELS, PROVIDER_LABELS } from '../data/models';
import {
    Save,
    Key,
    ShieldCheck,
    Download,
    FileJson,
    FileText,
    Eye,
    EyeOff,
    RefreshCw,
    AlertTriangle,
    Route,
} from 'lucide-react';

const PROVIDERS = [
    { id: 'openrouter', label: 'OpenRouter', placeholder: 'sk-or-…' },
    { id: 'openai', label: 'OpenAI', placeholder: 'sk-…' },
    { id: 'anthropic', label: 'Anthropic', placeholder: 'sk-ant-…' },
    { id: 'gemini', label: 'Gemini', placeholder: 'AIza…' },
];

export function Settings() {
    const { apiKeys, setApiKeys, resetData, prompts, folders } = useStore();
    const toast = useToast();
    const confirm = useConfirm();

    const [keys, setKeys] = useState(apiKeys);
    const [showKeys, setShowKeys] = useState({
        openrouter: false, openai: false, anthropic: false, gemini: false,
    });
    const [testing, setTesting] = useState(null);

    useEffect(() => { setKeys(apiKeys); }, [apiKeys]);

    const handleSave = (event) => {
        event.preventDefault();
        setApiKeys(keys);
        toast.success('Settings saved');
    };

    const handleTest = async (providerId, key) => {
        if (!key) return;
        setTesting(providerId);
        try {
            await AIService.run({
                provider: providerId,
                apiKey: key,
                model: DEFAULT_MODELS[providerId],
                prompt: 'Reply with: API connection successful.',
            });
            toast.success(`${PROVIDER_LABELS[providerId]} key is working`);
        } catch (error) {
            toast.error(error.message, `${PROVIDER_LABELS[providerId]} Error`);
        } finally {
            setTesting(null);
        }
    };

    const handleReset = async () => {
        const confirmed = await confirm({
            title: 'Reset All Data',
            message: 'This will remove all your custom prompts, folders, and runs. The app will be restored to its default state. This action cannot be undone.',
            confirmText: 'Reset Everything',
            variant: 'danger',
        });
        if (confirmed) {
            resetData();
            toast.success('Data reset to defaults');
        }
    };

    return (
        <div className="space-y-5 pt-4 pb-8 max-w-2xl">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-sm text-text-secondary mt-1">
                    API keys, data export, and account options
                </p>
            </div>

            {/* API Keys */}
            <section className="glass-panel p-5 space-y-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <ShieldCheck size={15} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-text-main">API Keys</h2>
                        <p className="text-xs text-text-secondary">Stored locally in your browser, never sent to our servers</p>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-surface-highlight/50 px-4 py-3 text-xs text-text-secondary flex items-start gap-2">
                    <Route size={13} className="text-primary mt-0.5 shrink-0" />
                    <span>OpenRouter lets you route to any model by ID in the Playground. Add at least one key to run prompts via API.</span>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    {PROVIDERS.map((provider) => (
                        <div key={provider.id} className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                                <Key size={11} />
                                {provider.label}
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type={showKeys[provider.id] ? 'text' : 'password'}
                                        value={keys[provider.id] || ''}
                                        onChange={(e) => setKeys({ ...keys, [provider.id]: e.target.value })}
                                        className="glass-input pr-10"
                                        placeholder={provider.placeholder}
                                        aria-label={`${provider.label} API Key`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowKeys((prev) => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors"
                                        aria-label={showKeys[provider.id] ? 'Hide key' : 'Show key'}
                                    >
                                        {showKeys[provider.id] ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleTest(provider.id, keys[provider.id])}
                                    disabled={!keys[provider.id] || testing === provider.id}
                                    className="glass-button !py-2 !text-xs whitespace-nowrap disabled:opacity-50"
                                >
                                    {testing === provider.id
                                        ? <RefreshCw size={13} className="animate-spin" />
                                        : 'Test'
                                    }
                                </button>
                            </div>
                        </div>
                    ))}

                    <button type="submit" className="btn-primary !py-2 !text-xs">
                        <Save size={13} />
                        Save Keys
                    </button>
                </form>
            </section>

            {/* Export */}
            <section className="glass-panel p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-surface-highlight flex items-center justify-center">
                        <Download size={15} className="text-text-secondary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-text-main">Export Data</h2>
                        <p className="text-xs text-text-secondary">Download your library prompts and folder structure</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => { exportToJSON(prompts, folders); toast.success('Exported as JSON'); }}
                        className="glass-button !py-2 !text-xs"
                    >
                        <FileJson size={13} />
                        Export JSON
                    </button>
                    <button
                        onClick={() => { exportToMarkdown(prompts, folders); toast.success('Exported as Markdown'); }}
                        className="glass-button !py-2 !text-xs"
                    >
                        <FileText size={13} />
                        Export Markdown
                    </button>
                </div>
            </section>

            {/* Danger zone */}
            <section className="glass-panel border-red-500/15 p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle size={15} className="text-red-500" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-red-500">Danger Zone</h2>
                        <p className="text-xs text-text-secondary">Irreversible actions — proceed with care</p>
                    </div>
                </div>

                <p className="text-xs text-text-secondary">
                    Resetting removes all custom prompts, folders, runs, and saved API keys. Built-in templates remain available.
                </p>

                <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl bg-red-500/8 text-red-500 hover:bg-red-500/15 border border-red-500/20 text-xs font-medium transition-colors"
                >
                    Reset All Data
                </button>
            </section>
        </div>
    );
}
