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
    Shuffle,
    Route
} from 'lucide-react';

const PROVIDERS = [
    {
        id: 'openrouter',
        label: 'OpenRouter API Key',
        placeholder: 'sk-or-...'
    },
    {
        id: 'openai',
        label: 'OpenAI API Key',
        placeholder: 'sk-...'
    },
    {
        id: 'anthropic',
        label: 'Anthropic API Key',
        placeholder: 'sk-ant-...'
    },
    {
        id: 'gemini',
        label: 'Gemini API Key',
        placeholder: 'AIza...'
    }
];

export function Settings() {
    const { apiKeys, setApiKeys, resetData, prompts, folders } = useStore();
    const toast = useToast();
    const confirm = useConfirm();

    const [keys, setKeys] = useState(apiKeys);
    const [showKeys, setShowKeys] = useState({
        openrouter: false,
        openai: false,
        anthropic: false,
        gemini: false
    });
    const [testing, setTesting] = useState(null);

    useEffect(() => {
        setKeys(apiKeys);
    }, [apiKeys]);

    const handleSave = (event) => {
        event.preventDefault();
        setApiKeys(keys);
        toast.success('Settings saved successfully');
    };

    const handleTest = async (providerId, key) => {
        if (!key) return;

        setTesting(providerId);
        try {
            await AIService.run({
                provider: providerId,
                apiKey: key,
                model: DEFAULT_MODELS[providerId],
                prompt: 'Reply with: API connection successful.'
            });
            toast.success(`${PROVIDER_LABELS[providerId]} key is working!`, 'API Test');
        } catch (error) {
            toast.error(error.message, `${PROVIDER_LABELS[providerId]} Error`);
        } finally {
            setTesting(null);
        }
    };

    const handleExportJSON = () => {
        exportToJSON(prompts, folders);
        toast.success('Exported to JSON file');
    };

    const handleExportMarkdown = () => {
        exportToMarkdown(prompts, folders);
        toast.success('Exported to Markdown file');
    };

    const handleReset = async () => {
        const confirmed = await confirm({
            title: 'Reset All Data',
            message: 'This will remove all your custom prompts, folders, and runs. The app will be restored to its initial state with recommended templates. This action cannot be undone.',
            confirmText: 'Reset Everything',
            variant: 'danger'
        });

        if (confirmed) {
            resetData();
            toast.success('Data reset to defaults');
        }
    };

    const toggleShowKey = (providerId) => {
        setShowKeys((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-text-main mb-2">Settings</h1>
                <p className="text-text-secondary">Manage provider keys and exports. OpenRouter is the fastest way to compare multiple model families.</p>
            </header>

            <div className="glass-panel p-8 space-y-6">
                <div className="flex items-center gap-3 text-primary">
                    <ShieldCheck size={24} />
                    <h2 className="text-xl font-semibold">API Configuration</h2>
                </div>

                <div className="rounded-lg border border-border bg-surface-highlight p-4 text-sm text-text-secondary space-y-2">
                    <p>Your keys are stored locally in your browser and sent directly to provider endpoints.</p>
                    <p className="inline-flex items-center gap-2 text-text-main font-medium">
                        <Route size={14} />
                        OpenRouter enables model routing by model ID in Arena.
                    </p>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    {PROVIDERS.map((provider) => (
                        <div key={provider.id} className="space-y-2">
                            <label className="text-sm font-medium text-text-main flex items-center gap-2">
                                <Key size={14} /> {provider.label}
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type={showKeys[provider.id] ? 'text' : 'password'}
                                        value={keys[provider.id] || ''}
                                        onChange={(event) => setKeys({ ...keys, [provider.id]: event.target.value })}
                                        className="glass-input pr-10"
                                        placeholder={provider.placeholder}
                                        aria-label={provider.label}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleShowKey(provider.id)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors"
                                        aria-label={showKeys[provider.id] ? 'Hide key' : 'Show key'}
                                    >
                                        {showKeys[provider.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleTest(provider.id, keys[provider.id])}
                                    disabled={!keys[provider.id] || testing === provider.id}
                                    className="glass-button whitespace-nowrap disabled:opacity-50"
                                >
                                    {testing === provider.id ? <RefreshCw size={16} className="animate-spin" /> : 'Test'}
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save size={18} />
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass-panel p-8">
                <div className="flex items-center gap-3 mb-6 text-primary">
                    <Download size={24} />
                    <h2 className="text-xl font-semibold">Export Data</h2>
                </div>

                <p className="text-sm text-text-secondary mb-6">
                    Export your personal library prompts and folder setup.
                </p>

                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={handleExportJSON}
                        className="glass-button flex items-center gap-2"
                    >
                        <FileJson size={18} />
                        Export as JSON
                    </button>
                    <button
                        onClick={handleExportMarkdown}
                        className="glass-button flex items-center gap-2"
                    >
                        <FileText size={18} />
                        Export as Markdown
                    </button>
                </div>
            </div>

            <div className="glass-panel p-8 border-red-500/20">
                <div className="flex items-center gap-3 mb-6 text-red-500">
                    <Shuffle size={24} />
                    <h2 className="text-xl font-semibold">Danger Zone</h2>
                </div>

                <p className="text-sm text-text-secondary mb-6">
                    Resetting removes all custom prompts, folders, runs, and local keys. Recommended templates will still be available.
                </p>

                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium border border-red-500/20"
                >
                    Reset Local Data
                </button>
            </div>
        </div>
    );
}
