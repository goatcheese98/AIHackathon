export const PROVIDER_LABELS = {
    openrouter: 'OpenRouter',
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    gemini: 'Gemini'
};

export const DEFAULT_MODELS = {
    openrouter: 'openai/gpt-4o-mini',
    openai: 'gpt-4o-mini',
    anthropic: 'claude-3-5-sonnet-latest',
    gemini: 'gemini-1.5-flash'
};

export const OPENROUTER_MODELS = [
    { id: 'openai/gpt-4o-mini', label: 'GPT-4o mini' },
    { id: 'openai/gpt-4.1', label: 'GPT-4.1' },
    { id: 'openai/o3-mini', label: 'o3-mini' },
    { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
    { id: 'anthropic/claude-3.7-sonnet', label: 'Claude 3.7 Sonnet' },
    { id: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash' },
    { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B' },
    { id: 'mistralai/mistral-large', label: 'Mistral Large' },
    { id: 'qwen/qwen-2.5-72b-instruct', label: 'Qwen 2.5 72B' }
];

export const DIRECT_PROVIDER_MODELS = {
    openai: [
        { id: 'gpt-4o-mini', label: 'GPT-4o mini' },
        { id: 'gpt-4o', label: 'GPT-4o' },
        { id: 'gpt-4.1-mini', label: 'GPT-4.1 mini' }
    ],
    anthropic: [
        { id: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet' },
        { id: 'claude-3-7-sonnet-latest', label: 'Claude 3.7 Sonnet' },
        { id: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku' }
    ],
    gemini: [
        { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
        { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
        { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' }
    ]
};
