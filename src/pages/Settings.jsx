import React, { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { AIService } from '../services/ai';
import { Save, Key, ShieldCheck } from 'lucide-react';


export function Settings() {
    const { apiKeys, setApiKeys, resetData } = useStore();
    const [keys, setKeys] = useState(apiKeys);
    const [saved, setSaved] = useState(false);

    const [testing, setTesting] = useState(null);

    useEffect(() => {
        setKeys(apiKeys);
    }, [apiKeys]);

    const handleSave = (e) => {
        e.preventDefault();
        setApiKeys(keys);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleTest = async (provider, key) => {
        if (!key) return;
        setTesting(provider);
        try {
            // Simple test prompt
            await AIService.run(provider, key, "Hello");
            alert(`${provider} key is working!`);
        } catch (error) {
            alert(`Error testing ${provider}: ${error.message}`);
        } finally {
            setTesting(null);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">Settings</h1>
                <p className="text-text-secondary">Manage your API keys for direct model execution.</p>
            </header>

            <div className="glass-panel p-8">
                <div className="flex items-center gap-3 mb-6 text-primary">
                    <ShieldCheck size={24} />
                    <h2 className="text-xl font-semibold">API Configuration</h2>
                </div>

                <p className="text-sm text-text-secondary mb-6 bg-surface-highlight p-4 rounded-lg border border-border">
                    Your keys are stored locally in your browser's Local Storage. They are never sent to our servers, only directly to the AI providers.
                </p>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-main flex items-center gap-2">
                            <Key size={14} /> OpenAI API Key
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={keys.openai}
                                onChange={e => setKeys({ ...keys, openai: e.target.value })}
                                className="glass-input"
                                placeholder="sk-..."
                            />
                            <button
                                type="button"
                                onClick={() => handleTest('OpenAI', keys.openai)}
                                disabled={!keys.openai || testing === 'OpenAI'}
                                className="glass-button whitespace-nowrap"
                            >
                                {testing === 'OpenAI' ? 'Testing...' : 'Test Key'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-main flex items-center gap-2">
                            <Key size={14} /> Anthropic API Key
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={keys.anthropic}
                                onChange={e => setKeys({ ...keys, anthropic: e.target.value })}
                                className="glass-input"
                                placeholder="sk-ant-..."
                            />
                            <button
                                type="button"
                                onClick={() => handleTest('Claude', keys.anthropic)}
                                disabled={!keys.anthropic || testing === 'Claude'}
                                className="glass-button whitespace-nowrap"
                            >
                                {testing === 'Claude' ? 'Testing...' : 'Test Key'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-main flex items-center gap-2">
                            <Key size={14} /> Gemini API Key
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={keys.gemini}
                                onChange={e => setKeys({ ...keys, gemini: e.target.value })}
                                className="glass-input"
                                placeholder="AIza..."
                            />
                            <button
                                type="button"
                                onClick={() => handleTest('Gemini', keys.gemini)}
                                disabled={!keys.gemini || testing === 'Gemini'}
                                className="glass-button whitespace-nowrap"
                            >
                                {testing === 'Gemini' ? 'Testing...' : 'Test Key'}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="submit"
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save size={18} />
                            Save Settings
                        </button>
                        {saved && (
                            <span className="text-green-500 font-medium animate-fade-in">
                                Settings saved successfully!
                            </span>
                        )}
                    </div>
                </form>
            </div>

            <div className="glass-panel p-8 mt-8 border-red-500/20">
                <div className="flex items-center gap-3 mb-6 text-red-500">
                    <ShieldCheck size={24} />
                    <h2 className="text-xl font-semibold">Danger Zone</h2>
                </div>

                <p className="text-sm text-text-secondary mb-6">
                    Resetting your data will remove all your custom prompts, folders, and runs. This action cannot be undone.
                </p>

                <button
                    onClick={() => {
                        if (window.confirm('Are you sure you want to reset all data to the default mock data? This cannot be undone.')) {
                            resetData();
                            alert('Data reset to defaults!');
                        }
                    }}
                    className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium border border-red-500/20"
                >
                    Reset to Mock Data
                </button>
            </div>
        </div>
    );
}
