import { DEFAULT_MODELS, PROVIDER_LABELS } from '../data/models';

function normalizeProvider(input = '') {
    const value = String(input).toLowerCase();

    if (value.includes('openrouter')) return 'openrouter';
    if (value.includes('chatgpt') || value.includes('openai') || value === 'gpt') return 'openai';
    if (value.includes('claude') || value.includes('anthropic')) return 'anthropic';
    if (value.includes('gemini') || value.includes('google')) return 'gemini';

    return value;
}

async function parseError(response, fallbackMessage) {
    try {
        const err = await response.json();
        return err.error?.message || err.message || fallbackMessage;
    } catch {
        return fallbackMessage;
    }
}

export const AIService = {
    async run(providerOrConfig, apiKeyArg, promptArg) {
        const config = typeof providerOrConfig === 'object'
            ? providerOrConfig
            : {
                provider: providerOrConfig,
                apiKey: apiKeyArg,
                prompt: promptArg
            };

        const provider = normalizeProvider(config.provider);
        const model = config.model || DEFAULT_MODELS[provider];
        const apiKey = config.apiKey;
        const prompt = config.prompt;

        if (!provider) {
            throw new Error('Provider is required.');
        }

        if (!apiKey) {
            throw new Error(`API key for ${PROVIDER_LABELS[provider] || provider} is missing. Please add it in Settings.`);
        }

        if (!prompt) {
            throw new Error('Prompt is empty.');
        }

        switch (provider) {
            case 'openrouter':
                return this.callOpenRouter(apiKey, prompt, model || DEFAULT_MODELS.openrouter);
            case 'openai':
                return this.callOpenAI(apiKey, prompt, model || DEFAULT_MODELS.openai);
            case 'anthropic':
                return this.callAnthropic(apiKey, prompt, model || DEFAULT_MODELS.anthropic);
            case 'gemini':
                return this.callGemini(apiKey, prompt, model || DEFAULT_MODELS.gemini);
            default:
                throw new Error(`Provider ${provider} is not supported.`);
        }
    },

    async callOpenAI(apiKey, prompt, model) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(await parseError(response, 'OpenAI API failed'));
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    },

    async callAnthropic(apiKey, prompt, model) {
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                    'dangerously-allow-browser': 'true'
                },
                body: JSON.stringify({
                    model,
                    max_tokens: 1024,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (!response.ok) {
                throw new Error(await parseError(response, 'Anthropic API failed'));
            }

            const data = await response.json();
            return data.content?.[0]?.text || '';
        } catch (error) {
            if (String(error?.message || '').includes('Failed to fetch')) {
                throw new Error('CORS error: Anthropic blocks most direct browser calls. Use OpenRouter or a backend proxy.');
            }
            throw error;
        }
    },

    async callGemini(apiKey, prompt, model) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(await parseError(response, 'Gemini API failed'));
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    },

    async callOpenRouter(apiKey, prompt, model) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'PromptFolio'
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(await parseError(response, 'OpenRouter API failed'));
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }
};
