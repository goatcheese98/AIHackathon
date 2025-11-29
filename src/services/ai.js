export const AIService = {
    async run(provider, apiKey, prompt) {
        if (!apiKey) {
            throw new Error(`API Key for ${provider} is missing. Please add it in Settings.`);
        }

        try {
            switch (provider.toLowerCase()) {
                case 'chatgpt':
                case 'openai':
                    return await this.callOpenAI(apiKey, prompt);
                case 'claude':
                case 'anthropic':
                    return await this.callAnthropic(apiKey, prompt);
                case 'gemini':
                case 'google':
                    return await this.callGemini(apiKey, prompt);
                default:
                    throw new Error(`Provider ${provider} not supported via API yet.`);
            }
        } catch (error) {
            console.error("AI API Error:", error);
            return `Error: ${error.message}`;
        }
    },

    async callOpenAI(apiKey, prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'OpenAI API failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    },

    async callAnthropic(apiKey, prompt) {
        // Note: Anthropic usually requires a proxy for browser usage due to CORS, 
        // but we'll implement the direct call structure. 
        // In a real hackathon, users might need a CORS extension or a simple proxy.
        // For this demo, we'll try direct and handle the likely CORS error with a helpful message.

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                    'dangerously-allow-browser': 'true' // Required for client-side calls
                },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20240620",
                    max_tokens: 1024,
                    messages: [{ role: "user", content: prompt }]
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || 'Anthropic API failed');
            }

            const data = await response.json();
            return data.content[0].text;
        } catch (e) {
            if (e.message.includes('Failed to fetch')) {
                throw new Error('CORS Error: Anthropic API blocks browser calls. Use a CORS extension or proxy.');
            }
            throw e;
        }
    },

    async callGemini(apiKey, prompt) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
            const err = await response.json();
            throw new Error(err.error?.message || 'Gemini API failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
};
