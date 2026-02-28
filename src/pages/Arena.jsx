import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { AIService } from '../services/ai';
import { useToast } from '../components/Toast';
import { Copy, Star, Save, Check, Play, Settings, Loader2, Plus, X, ExternalLink, Zap, Route } from 'lucide-react';
import { clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_MODELS, DIRECT_PROVIDER_MODELS, OPENROUTER_MODELS, PROVIDER_LABELS } from '../data/models';

const PROVIDER_OPTIONS = [
    { id: 'openrouter', label: PROVIDER_LABELS.openrouter },
    { id: 'openai', label: PROVIDER_LABELS.openai },
    { id: 'anthropic', label: PROVIDER_LABELS.anthropic },
    { id: 'gemini', label: PROVIDER_LABELS.gemini },
];

function createOutput(provider = 'openrouter', model = DEFAULT_MODELS.openrouter) {
    return { id: uuidv4(), provider, model, customModel: '', content: '', rating: 0, loading: false, error: null };
}

function getActiveModel(output) {
    return output.customModel?.trim() || output.model;
}

function getOutputLabel(output) {
    return `${PROVIDER_LABELS[output.provider]} · ${getActiveModel(output)}`;
}

function toHistoryOutput(output) {
    const h = { ...output, name: getOutputLabel(output) };
    delete h.loading;
    delete h.error;
    return h;
}

function getExternalUrl(provider) {
    if (provider === 'openrouter') return 'https://openrouter.ai/chat';
    if (provider === 'anthropic') return 'https://claude.ai';
    if (provider === 'gemini') return 'https://gemini.google.com';
    return 'https://chat.openai.com';
}

function StarRating({ rating, onChange }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => onChange(star)}
                    className={clsx(
                        'transition-colors',
                        rating >= star ? 'text-yellow-400' : 'text-border hover:text-yellow-400/60'
                    )}
                >
                    <Star size={13} fill={rating >= star ? 'currentColor' : 'none'} />
                </button>
            ))}
        </div>
    );
}

export function Arena() {
    const [searchParams] = useSearchParams();
    const { prompts, addRun, apiKeys } = useStore();
    const toast = useToast();

    const [selectedPromptId, setSelectedPromptId] = useState(searchParams.get('prompt') || '');
    const [variables, setVariables] = useState({});
    const [outputs, setOutputs] = useState(() => ([
        createOutput('openrouter', 'openai/gpt-4o-mini'),
        createOutput('openrouter', 'anthropic/claude-3.5-sonnet'),
    ]));
    const [copied, setCopied] = useState(false);

    const selectedPrompt = prompts.find((p) => p.id === selectedPromptId);

    const detectedVariables = selectedPrompt
        ? (selectedPrompt.content.match(/\{\{([^}]+)\}\}/g) || []).map((v) => v.replace(/\{\{|\}\}/g, '').trim())
        : [];

    const handlePromptChange = (nextId) => {
        setSelectedPromptId(nextId);
        setVariables({});
        setOutputs((prev) => prev.map((o) => ({ ...o, content: '', rating: 0, loading: false, error: null })));
    };

    const getRawCompiledPrompt = () => {
        if (!selectedPrompt) return '';
        let content = selectedPrompt.content;
        Object.entries(variables).forEach(([key, value]) => {
            content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `{{${key}}}`);
        });
        return content;
    };

    const renderCompiledPrompt = () => {
        if (!selectedPrompt) return null;
        const parts = selectedPrompt.content.split(/(\{\{[^}]+\}\})/g);
        return (
            <div className="whitespace-pre-wrap font-mono text-sm text-text-main leading-relaxed">
                {parts.map((part, index) => {
                    const match = part.match(/\{\{([^}]+)\}\}/);
                    if (!match) return <span key={index}>{part}</span>;
                    const variable = match[1].trim();
                    const value = variables[variable];
                    const hasValue = value && value.trim().length > 0;
                    return (
                        <span
                            key={index}
                            className={clsx(
                                'rounded px-1 py-0.5 mx-0.5 font-bold transition-all duration-300',
                                hasValue
                                    ? 'text-primary bg-primary/10 border border-primary/20'
                                    : 'text-text-secondary bg-surface-highlight border border-dashed border-border'
                            )}
                        >
                            {hasValue ? value : variable}
                        </span>
                    );
                })}
            </div>
        );
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getRawCompiledPrompt());
        setCopied(true);
        toast.success('Prompt copied');
        setTimeout(() => setCopied(false), 2000);
    };

    const updateOutput = (id, updates) => {
        setOutputs((prev) => prev.map((o) => o.id === id ? { ...o, ...updates } : o));
    };

    const handleProviderChange = (id, provider) => {
        updateOutput(id, { provider, model: DEFAULT_MODELS[provider], customModel: '', content: '', error: null });
    };

    const handleRunAPI = async (id) => {
        const output = outputs.find((o) => o.id === id);
        if (!output) return;
        const prompt = getRawCompiledPrompt();
        if (!prompt) return;
        updateOutput(id, { loading: true, error: null });
        try {
            const result = await AIService.run({
                provider: output.provider,
                apiKey: apiKeys[output.provider],
                model: getActiveModel(output),
                prompt,
            });
            updateOutput(id, { content: result, loading: false });
        } catch (error) {
            updateOutput(id, { error: error.message, loading: false });
        }
    };

    const addModelColumn = () => setOutputs((prev) => [...prev, createOutput()]);

    const removeModelColumn = (id) => {
        if (outputs.length <= 1) return;
        setOutputs((prev) => prev.filter((o) => o.id !== id));
    };

    const handleSave = () => {
        if (!selectedPrompt) return;
        addRun({
            promptId: selectedPromptId,
            promptTitle: selectedPrompt.title,
            variables,
            outputs: outputs.map(toHistoryOutput),
            timestamp: new Date().toISOString(),
        });
        toast.success('Run saved to history');
    };

    const handleRunAll = async () => {
        if (!getRawCompiledPrompt()) {
            toast.warning('Please select a prompt first');
            return;
        }
        toast.info('Running all models…');
        outputs.forEach((o) => handleRunAPI(o.id));
    };

    return (
        <div className="space-y-5 pt-4 pb-8">
            {/* Page header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Playground</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        Test your prompt across multiple models side by side
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Link to="/settings" className="glass-button !py-2 !text-xs">
                        <Settings size={13} />
                        API Keys
                    </Link>
                    {selectedPrompt && (
                        <button onClick={handleRunAll} className="btn-primary !py-2 !text-xs">
                            <Zap size={13} />
                            Run All
                        </button>
                    )}
                </div>
            </div>

            {/* Prompt setup */}
            <div className="glass-panel p-5 space-y-4">
                {/* Prompt selector */}
                <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                            Prompt
                        </label>
                        <select
                            value={selectedPromptId}
                            onChange={(e) => handlePromptChange(e.target.value)}
                            className="glass-input cursor-pointer"
                        >
                            <option value="">Select a prompt…</option>
                            {prompts.map((p) => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                        {prompts.length === 0 && (
                            <p className="text-xs text-text-secondary mt-1">
                                <Link to="/templates" className="text-primary hover:underline">Browse templates</Link>
                                {' '}or{' '}
                                <Link to="/new" className="text-primary hover:underline">create a prompt</Link>
                                {' '}to get started.
                            </p>
                        )}
                    </div>
                    <button onClick={addModelColumn} className="glass-button !py-2.5 !text-xs whitespace-nowrap">
                        <Plus size={13} />
                        Add Model
                    </button>
                </div>

                {/* Variables */}
                {selectedPrompt && detectedVariables.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Variables</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {detectedVariables.map((variable) => (
                                <div key={variable}>
                                    <label className="text-xs text-primary font-medium mb-1 block">{variable}</label>
                                    <input
                                        type="text"
                                        value={variables[variable] || ''}
                                        onChange={(e) => setVariables((prev) => ({ ...prev, [variable]: e.target.value }))}
                                        className="glass-input !text-sm"
                                        placeholder={`Value for ${variable}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Compiled prompt preview */}
                {selectedPrompt && (
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Preview</p>
                            <button
                                onClick={handleCopy}
                                className="glass-button !px-2.5 !py-1 !text-xs"
                            >
                                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        <div className="min-h-[80px] rounded-xl border border-border bg-surface-highlight/50 p-4">
                            {renderCompiledPrompt()}
                        </div>
                    </div>
                )}
            </div>

            {/* Model columns */}
            {selectedPrompt && (
                <>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {outputs.map((output) => {
                            const modelOptions = output.provider === 'openrouter'
                                ? OPENROUTER_MODELS
                                : DIRECT_PROVIDER_MODELS[output.provider] || [];

                            return (
                                <div key={output.id} className="glass-panel flex flex-col p-4 gap-3">
                                    {/* Column header */}
                                    <div className="flex items-center justify-between gap-2">
                                        <select
                                            value={output.provider}
                                            onChange={(e) => handleProviderChange(output.id, e.target.value)}
                                            className="glass-input !py-1.5 !text-xs cursor-pointer flex-1"
                                        >
                                            {PROVIDER_OPTIONS.map((p) => (
                                                <option key={p.id} value={p.id}>{p.label}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => removeModelColumn(output.id)}
                                            className="p-1.5 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                            title="Remove"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    {/* Model select */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1 text-[11px] text-text-secondary">
                                            <Route size={11} />
                                            Model
                                        </label>
                                        <select
                                            value={output.model}
                                            onChange={(e) => updateOutput(output.id, { model: e.target.value, content: '', error: null })}
                                            className="glass-input !py-1.5 !text-xs cursor-pointer"
                                        >
                                            {modelOptions.map((m) => (
                                                <option key={m.id} value={m.id}>{m.label}</option>
                                            ))}
                                        </select>
                                        <input
                                            value={output.customModel}
                                            onChange={(e) => updateOutput(output.id, { customModel: e.target.value, content: '', error: null })}
                                            placeholder="Or enter a custom model ID"
                                            className="glass-input !py-1.5 !text-xs font-mono"
                                        />
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-text-secondary truncate mr-2">
                                            {getOutputLabel(output)}
                                        </span>
                                        <StarRating
                                            rating={output.rating}
                                            onChange={(r) => updateOutput(output.id, { rating: r })}
                                        />
                                    </div>

                                    {/* Output area */}
                                    <div className="relative flex-1">
                                        <textarea
                                            value={output.content}
                                            onChange={(e) => updateOutput(output.id, { content: e.target.value })}
                                            className="glass-input min-h-[200px] font-mono text-xs resize-none leading-relaxed"
                                            placeholder="Output will appear here…"
                                        />
                                        {output.loading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-sm rounded-xl border border-border">
                                                <div className="flex flex-col items-center gap-2 text-primary">
                                                    <Loader2 size={24} className="animate-spin" />
                                                    <span className="text-xs font-medium">Generating…</span>
                                                </div>
                                            </div>
                                        )}
                                        {output.error && (
                                            <div className="mt-2 rounded-lg bg-red-500/8 border border-red-500/20 p-2.5 text-xs text-red-500">
                                                {output.error}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => handleRunAPI(output.id)}
                                            disabled={output.loading}
                                            className="btn-primary flex-1 justify-center !py-2 !text-xs disabled:opacity-50"
                                        >
                                            <Play size={12} />
                                            Run
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleCopy();
                                                window.open(getExternalUrl(output.provider), '_blank');
                                            }}
                                            className="glass-button !py-2 !px-2.5"
                                            title="Open in provider (copies prompt)"
                                        >
                                            <ExternalLink size={12} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add column card */}
                        <button
                            onClick={addModelColumn}
                            className="glass-panel min-h-[280px] border-dashed text-text-secondary hover:text-primary hover:border-primary/30 transition-all"
                        >
                            <div className="flex flex-col items-center justify-center h-full gap-2">
                                <Plus size={28} className="opacity-50" />
                                <span className="text-sm font-medium">Add Model</span>
                            </div>
                        </button>
                    </div>

                    {/* Save run */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            className="btn-primary !py-2.5 !px-6"
                        >
                            <Save size={15} />
                            Save Run to History
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
