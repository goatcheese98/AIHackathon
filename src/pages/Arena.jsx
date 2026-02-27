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
    { id: 'gemini', label: PROVIDER_LABELS.gemini }
];

function createOutput(provider = 'openrouter', model = DEFAULT_MODELS.openrouter) {
    return {
        id: uuidv4(),
        provider,
        model,
        customModel: '',
        content: '',
        rating: 0,
        loading: false,
        error: null
    };
}

function getActiveModel(output) {
    return output.customModel?.trim() || output.model;
}

function getOutputLabel(output) {
    return `${PROVIDER_LABELS[output.provider]} · ${getActiveModel(output)}`;
}

function toHistoryOutput(output) {
    const historyOutput = {
        ...output,
        name: getOutputLabel(output)
    };
    delete historyOutput.loading;
    delete historyOutput.error;
    return historyOutput;
}

function getExternalUrl(provider) {
    if (provider === 'openrouter') return 'https://openrouter.ai/chat';
    if (provider === 'anthropic') return 'https://claude.ai';
    if (provider === 'gemini') return 'https://gemini.google.com';
    return 'https://chat.openai.com';
}

export function Arena() {
    const [searchParams] = useSearchParams();
    const { prompts, addRun, apiKeys } = useStore();
    const toast = useToast();

    const [selectedPromptId, setSelectedPromptId] = useState(searchParams.get('prompt') || '');
    const [variables, setVariables] = useState({});
    const [outputs, setOutputs] = useState(() => ([
        createOutput('openrouter', 'openai/gpt-4o-mini'),
        createOutput('openrouter', 'anthropic/claude-3.5-sonnet')
    ]));
    const [copied, setCopied] = useState(false);

    const selectedPrompt = prompts.find((prompt) => prompt.id === selectedPromptId);

    const detectedVariables = selectedPrompt
        ? (selectedPrompt.content.match(/\{\{([^}]+)\}\}/g) || []).map((value) => value.replace(/\{\{|\}\}/g, '').trim())
        : [];

    const handlePromptChange = (nextPromptId) => {
        setSelectedPromptId(nextPromptId);
        setVariables({});
        setOutputs((prev) => prev.map((output) => ({
            ...output,
            content: '',
            rating: 0,
            loading: false,
            error: null
        })));
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
                                'transition-all duration-300 rounded px-1 py-0.5 mx-0.5 font-bold',
                                hasValue
                                    ? 'text-primary bg-primary/10 shadow-[0_0_10px_rgba(99,102,241,0.3)] border border-primary/20'
                                    : 'text-text-secondary bg-surface-highlight border border-border border-dashed'
                            )}
                        >
                            {hasValue ? value : variable}
                        </span>
                    );
                })}
            </div>
        );
    };

    const getRawCompiledPrompt = () => {
        if (!selectedPrompt) return '';

        let content = selectedPrompt.content;
        Object.entries(variables).forEach(([key, value]) => {
            content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `{{${key}}}`);
        });

        return content;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getRawCompiledPrompt());
        setCopied(true);
        toast.success('Prompt copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const updateOutput = (id, updates) => {
        setOutputs((prev) => prev.map((output) => output.id === id ? { ...output, ...updates } : output));
    };

    const handleProviderChange = (id, provider) => {
        updateOutput(id, {
            provider,
            model: DEFAULT_MODELS[provider],
            customModel: '',
            content: '',
            error: null
        });
    };

    const handleRunAPI = async (id) => {
        const output = outputs.find((item) => item.id === id);
        if (!output) return;

        const prompt = getRawCompiledPrompt();
        if (!prompt) return;

        const model = getActiveModel(output);
        const apiKey = apiKeys[output.provider];

        updateOutput(id, { loading: true, error: null });

        try {
            const result = await AIService.run({
                provider: output.provider,
                apiKey,
                model,
                prompt
            });

            updateOutput(id, { content: result, loading: false });
        } catch (error) {
            updateOutput(id, { error: error.message, loading: false });
        }
    };

    const handleOpenExternal = (id) => {
        const output = outputs.find((item) => item.id === id);
        if (!output) return;

        handleCopy();
        window.open(getExternalUrl(output.provider), '_blank');
    };

    const addModelColumn = () => {
        setOutputs((prev) => [...prev, createOutput()]);
    };

    const removeModelColumn = (id) => {
        if (outputs.length <= 1) return;
        setOutputs((prev) => prev.filter((output) => output.id !== id));
    };

    const handleSave = () => {
        if (!selectedPrompt) return;

        addRun({
            promptId: selectedPromptId,
            promptTitle: selectedPrompt.title,
            variables,
            outputs: outputs.map(toHistoryOutput),
            timestamp: new Date().toISOString()
        });

        toast.success('Run saved to history!', 'Comparison Saved');
    };

    const handleRunAll = async () => {
        if (!getRawCompiledPrompt()) {
            toast.warning('Please select a prompt first');
            return;
        }

        toast.info('Running all configured routes...');
        outputs.forEach((output) => {
            handleRunAPI(output.id);
        });
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-main mb-2">Arena</h1>
                    <p className="text-text-secondary">Compare outputs across providers and OpenRouter model routes.</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    {selectedPrompt && (
                        <button
                            onClick={handleRunAll}
                            className="btn-primary flex items-center gap-2 text-sm"
                        >
                            <Zap size={16} /> Run All
                        </button>
                    )}
                    <button onClick={addModelColumn} className="glass-button flex items-center gap-2 text-sm text-primary border-primary/20 bg-primary/5">
                        <Plus size={16} /> Add Route
                    </button>
                    <Link to="/settings" className="glass-button flex items-center gap-2 text-sm">
                        <Settings size={16} /> Configure Keys
                    </Link>
                </div>
            </header>

            <div className="glass-panel p-6 space-y-6">
                <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">Select Prompt</label>
                    <select
                        value={selectedPromptId}
                        onChange={(event) => handlePromptChange(event.target.value)}
                        className="glass-input appearance-none"
                    >
                        <option value="">Select a prompt...</option>
                        {prompts.map((prompt) => (
                            <option key={prompt.id} value={prompt.id}>{prompt.title}</option>
                        ))}
                    </select>
                    {prompts.length === 0 && (
                        <p className="mt-2 text-sm text-text-secondary">
                            Your library is empty. <Link to="/templates" className="text-primary hover:underline">Add a template</Link> or <Link to="/new" className="text-primary hover:underline">create a prompt</Link>.
                        </p>
                    )}
                </div>

                {selectedPrompt && (
                    <>
                        {detectedVariables.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {detectedVariables.map((variable) => (
                                    <div key={variable}>
                                        <label className="text-xs font-medium text-primary mb-1 block uppercase tracking-wider">{variable}</label>
                                        <input
                                            type="text"
                                            value={variables[variable] || ''}
                                            onChange={(event) => setVariables((prev) => ({ ...prev, [variable]: event.target.value }))}
                                            className="glass-input"
                                            placeholder={`Value for ${variable}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-surface-highlight rounded-lg p-4 border border-border relative group min-h-[100px]">
                            {renderCompiledPrompt()}
                            <button
                                onClick={handleCopy}
                                className="absolute top-2 right-2 p-2 rounded-lg bg-surface hover:bg-white text-text-secondary hover:text-primary transition-colors flex items-center gap-2 text-xs font-medium border border-border shadow-sm z-10"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {selectedPrompt && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
                    {outputs.map((output) => {
                        const modelOptions = output.provider === 'openrouter'
                            ? OPENROUTER_MODELS
                            : DIRECT_PROVIDER_MODELS[output.provider] || [];

                        return (
                            <div key={output.id} className="glass-panel p-6 flex flex-col h-full relative overflow-hidden min-w-[320px]">
                                <div className="mb-4 space-y-3">
                                    <div className="flex justify-between items-center gap-2">
                                        <select
                                            value={output.provider}
                                            onChange={(event) => handleProviderChange(output.id, event.target.value)}
                                            className="glass-input py-2 text-sm"
                                        >
                                            {PROVIDER_OPTIONS.map((provider) => (
                                                <option key={provider.id} value={provider.id}>{provider.label}</option>
                                            ))}
                                        </select>

                                        <button
                                            onClick={() => removeModelColumn(output.id)}
                                            className="text-text-secondary hover:text-red-500 transition-colors"
                                            title="Remove route"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-text-secondary inline-flex items-center gap-1">
                                            <Route size={12} />
                                            Model route
                                        </label>
                                        <select
                                            value={output.model}
                                            onChange={(event) => updateOutput(output.id, { model: event.target.value, content: '', error: null })}
                                            className="glass-input py-2 text-sm"
                                        >
                                            {modelOptions.map((model) => (
                                                <option key={model.id} value={model.id}>{model.label}</option>
                                            ))}
                                        </select>
                                        <input
                                            value={output.customModel}
                                            onChange={(event) => updateOutput(output.id, { customModel: event.target.value, content: '', error: null })}
                                            placeholder="Optional custom model ID"
                                            className="glass-input py-2 text-xs font-mono"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs text-text-secondary truncate">{getOutputLabel(output)}</p>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => updateOutput(output.id, { rating: star })}
                                                    className={clsx(
                                                        'transition-colors',
                                                        output.rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400/50'
                                                    )}
                                                >
                                                    <Star size={14} fill={output.rating >= star ? 'currentColor' : 'none'} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative flex-1">
                                    <textarea
                                        value={output.content}
                                        onChange={(event) => updateOutput(output.id, { content: event.target.value })}
                                        className="glass-input h-full min-h-[280px] font-mono text-sm resize-none p-4"
                                        placeholder="Output will appear here after Run API..."
                                    />

                                    {output.loading && (
                                        <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center rounded-lg border border-border">
                                            <div className="flex flex-col items-center gap-2 text-primary">
                                                <Loader2 size={30} className="animate-spin" />
                                                <span className="text-sm font-medium">Generating...</span>
                                            </div>
                                        </div>
                                    )}

                                    {output.error && (
                                        <div className="absolute inset-x-0 bottom-0 bg-red-500/10 border-t border-red-500/20 p-3 text-xs text-red-500">
                                            {output.error}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => handleRunAPI(output.id)}
                                        disabled={output.loading}
                                        className="glass-button flex-1 flex items-center justify-center gap-2 text-sm hover:text-primary hover:border-primary/30"
                                    >
                                        <Play size={14} />
                                        Run API
                                    </button>
                                    <button
                                        onClick={() => handleOpenExternal(output.id)}
                                        className="glass-button flex items-center justify-center gap-2 text-sm hover:text-primary hover:border-primary/30 px-3"
                                        title="Open provider workspace (prompt copied)"
                                    >
                                        <ExternalLink size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={addModelColumn}
                        className="glass-panel min-h-[420px] flex flex-col items-center justify-center text-text-secondary hover:text-primary hover:bg-surface-highlight transition-all cursor-pointer border-dashed min-w-[320px]"
                    >
                        <Plus size={44} className="mb-4 opacity-50" />
                        <span className="font-medium">Add Another Route</span>
                    </button>
                </div>
            )}

            {selectedPrompt && (
                <div className="flex justify-end pb-12">
                    <button
                        onClick={handleSave}
                        className="btn-primary px-8 py-3 flex items-center gap-2"
                    >
                        <Save size={20} />
                        Save Comparison Run
                    </button>
                </div>
            )}
        </div>
    );
}
