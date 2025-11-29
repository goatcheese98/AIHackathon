import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'prompt-folio-data';

const INITIAL_DATA = {
    prompts: [
        {
            id: '1',
            title: 'SQL Query Generator',
            content: 'Write a SQL query to {{action}} from the {{table}} table where {{condition}}.',
            tags: ['Data', 'Coding'],
            platform: 'ChatGPT',
            createdAt: new Date().toISOString(),
        },
        {
            id: '2',
            title: 'Product Strategy Brief',
            content: 'Act as a Product Manager. Create a strategy for {{product_name}} targeting {{target_audience}}.',
            tags: ['Strategy', 'Product'],
            platform: 'Claude',
            createdAt: new Date().toISOString(),
        }
    ],
    runs: [],
    apiKeys: {
        openai: '',
        anthropic: '',
        gemini: ''
    }
};

export function useStore() {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : INITIAL_DATA;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const addPrompt = (prompt) => {
        const newPrompt = { ...prompt, id: uuidv4(), createdAt: new Date().toISOString() };
        setData(prev => ({ ...prev, prompts: [newPrompt, ...prev.prompts] }));
    };

    const updatePrompt = (id, updates) => {
        setData(prev => ({
            ...prev,
            prompts: prev.prompts.map(p => p.id === id ? { ...p, ...updates } : p)
        }));
    };

    const deletePrompt = (id) => {
        setData(prev => ({
            ...prev,
            prompts: prev.prompts.filter(p => p.id !== id)
        }));
    };

    const addRun = (run) => {
        const newRun = { ...run, id: uuidv4(), createdAt: new Date().toISOString() };
        setData(prev => ({ ...prev, runs: [newRun, ...prev.runs] }));
    };

    const setApiKeys = (keys) => {
        setData(prev => ({ ...prev, apiKeys: { ...prev.apiKeys, ...keys } }));
    };

    return {
        prompts: data.prompts,
        runs: data.runs,
        apiKeys: data.apiKeys,
        addPrompt,
        updatePrompt,
        deletePrompt,
        addRun,
        setApiKeys
    };
}
