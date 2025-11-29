import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { AIService } from '../services/ai';
import { Copy, Star, Save, Check, Play, Settings, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export function Arena() {
    const [searchParams] = useSearchParams();
    const { prompts, addRun, apiKeys } = useStore();

    const [selectedPromptId, setSelectedPromptId] = useState(searchParams.get('prompt') || '');
    const [variables, setVariables] = useState({});
    const [outputs, setOutputs] = useState({
        modelA: { name: 'ChatGPT', content: '', rating: 0, loading: false, error: null },
        modelB: { name: 'Claude', content: '', rating: 0, loading: false, error: null }
    });
    const [copied, setCopied] = useState(false);

    const selectedPrompt = prompts.find(p => p.id === selectedPromptId);
    const detectedVariables = selectedPrompt
        ? (selectedPrompt.content.match(/\{\{([^}]+)\}\}/g) || []).map(v => v.replace(/\{\{|\}\}/g, '').trim())
        : [];

    useEffect(() => {
        if (selectedPromptId) {
            setVariables({});
            setOutputs({
                modelA: { name: 'ChatGPT', content: '', rating: 0, loading: false, error: null },
                modelB: { name: 'Claude', content: '', rating: 0, loading: false, error: null }
            });
        }
    }, [selectedPromptId]);

    const renderCompiledPrompt = () => {
        if (!selectedPrompt) return null;

        // Split by variables {{var}}
        const parts = selectedPrompt.content.split(/(\{\{[^}]+\}\})/g);

        return (
            <div className="whitespace-pre-wrap font-mono text-sm text-text-main leading-relaxed">
                {parts.map((part, index) => {
                    const match = part.match(/\{\{([^}]+)\}\}/);
                    if (match) {
                        const variable = match[1].trim();
                        const value = variables[variable];
                        const hasValue = value && value.trim().length > 0;

                        return (
                            <span
                                key={index}
                                className={clsx(
                                    "transition-all duration-300 rounded px-1 py-0.5 mx-0.5 font-bold",
                                    hasValue
                                        ? "text-primary bg-primary/10 shadow-[0_0_10px_rgba(99,102,241,0.3)] border border-primary/20"
                                        : "text-text-secondary bg-surface-highlight border border-border border-dashed"
                                )}
                            >
                                {hasValue ? value : variable}
                            </span>
                        );
                    }
                    return <span key={index}>{part}</span>;
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
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRunAPI = async (modelKey) => {
        const modelName = outputs[modelKey].name;
        const prompt = getRawCompiledPrompt();

        if (!prompt) return;

        setOutputs(prev => ({
            ...prev,
            [modelKey]: { ...prev[modelKey], loading: true, error: null }
        }));

        try {
            let apiKey = '';
            if (modelName.toLowerCase().includes('chatgpt') || modelName.toLowerCase().includes('openai')) apiKey = apiKeys.openai;
            else if (modelName.toLowerCase().includes('claude')) apiKey = apiKeys.anthropic;
            else if (modelName.toLowerCase().includes('gemini')) apiKey = apiKeys.gemini;

            const result = await AIService.run(modelName, apiKey, prompt);

            setOutputs(prev => ({
                ...prev,
                [modelKey]: { ...prev[modelKey], content: result, loading: false }
            }));
        } catch (error) {
            setOutputs(prev => ({
                ...prev,
                [modelKey]: { ...prev[modelKey], error: error.message, loading: false }
            }));
        }
    };

    const handleSave = () => {
        addRun({
            promptId: selectedPromptId,
            promptTitle: selectedPrompt.title,
            variables,
            outputs: {
                modelA: { ...outputs.modelA, loading: undefined, error: undefined },
                modelB: { ...outputs.modelB, loading: undefined, error: undefined }
            },
            timestamp: new Date().toISOString()
        });
        alert('Run saved to history!');
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-main mb-2">The Arena</h1>
                    <p className="text-text-secondary">Test, compare, and rate model performance.</p>
                </div>
                <Link to="/settings" className="glass-button flex items-center gap-2 text-sm">
                    <Settings size={16} /> Configure Keys
                </Link>
            </header>

            {/* Configuration Panel */}
            <div className="glass-panel p-6">
                <div className="mb-6">
                    <label className="text-sm font-medium text-text-secondary mb-2 block">Select Prompt Template</label>
                    <select
                        value={selectedPromptId}
                        onChange={(e) => setSelectedPromptId(e.target.value)}
                        className="glass-input appearance-none"
                    >
                        <option value="">Select a prompt...</option>
                        {prompts.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>
                </div>

                {selectedPrompt && (
                    <div className="space-y-6">
                        {detectedVariables.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {detectedVariables.map(variable => (
                                    <div key={variable}>
                                        <label className="text-xs font-medium text-primary mb-1 block uppercase tracking-wider">{variable}</label>
                                        <input
                                            type="text"
                                            value={variables[variable] || ''}
                                            onChange={(e) => setVariables(prev => ({ ...prev, [variable]: e.target.value }))}
                                            className="glass-input focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-shadow duration-300"
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
                    </div>
                )}
            </div>

            {/* Comparison Panel */}
            {selectedPrompt && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['modelA', 'modelB'].map((modelKey) => (
                        <div key={modelKey} className="glass-panel p-6 flex flex-col h-full relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <select
                                    value={outputs[modelKey].name}
                                    onChange={(e) => setOutputs(prev => ({
                                        ...prev,
                                        [modelKey]: { ...prev[modelKey], name: e.target.value }
                                    }))}
                                    className="bg-transparent text-lg font-bold text-text-main focus:outline-none cursor-pointer hover:text-primary transition-colors"
                                >
                                    <option value="ChatGPT">ChatGPT</option>
                                    <option value="Claude">Claude</option>
                                    <option value="Gemini">Gemini</option>
                                </select>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setOutputs(prev => ({
                                                ...prev,
                                                [modelKey]: { ...prev[modelKey], rating: star }
                                            }))}
                                            className={clsx(
                                                "transition-colors",
                                                outputs[modelKey].rating >= star ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400/50"
                                            )}
                                        >
                                            <Star size={16} fill={outputs[modelKey].rating >= star ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative flex-1">
                                <textarea
                                    value={outputs[modelKey].content}
                                    onChange={(e) => setOutputs(prev => ({
                                        ...prev,
                                        [modelKey]: { ...prev[modelKey], content: e.target.value }
                                    }))}
                                    className="glass-input h-full min-h-[300px] font-mono text-sm resize-none p-4"
                                    placeholder={`Paste ${outputs[modelKey].name} output here or click Run...`}
                                />

                                {outputs[modelKey].loading && (
                                    <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center rounded-lg border border-border">
                                        <div className="flex flex-col items-center gap-2 text-primary">
                                            <Loader2 size={32} className="animate-spin" />
                                            <span className="text-sm font-medium">Generating...</span>
                                        </div>
                                    </div>
                                )}

                                {outputs[modelKey].error && (
                                    <div className="absolute inset-x-0 bottom-0 bg-red-500/10 border-t border-red-500/20 p-3 text-xs text-red-500">
                                        {outputs[modelKey].error}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => handleRunAPI(modelKey)}
                                    disabled={outputs[modelKey].loading}
                                    className="glass-button flex items-center gap-2 text-sm hover:text-primary hover:border-primary/30"
                                >
                                    <Play size={14} />
                                    Run {outputs[modelKey].name}
                                </button>
                            </div>
                        </div>
                    ))}
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
