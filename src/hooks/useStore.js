import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RECOMMENDED_TEMPLATE_CATEGORIES, RECOMMENDED_TEMPLATES } from '../data/templates';

const STORAGE_KEY = 'prompt-folio-data';

const LEGACY_CATEGORY_IDS = new Set(RECOMMENDED_TEMPLATE_CATEGORIES.map((category) => category.id));
const RECOMMENDED_TEMPLATE_TITLES = new Set(RECOMMENDED_TEMPLATES.map((template) => template.title));

function createInitialData() {
    const now = new Date().toISOString();
    return {
        prompts: [],
        templates: RECOMMENDED_TEMPLATES.map((template) => ({ ...template, createdAt: now })),
        runs: [],
        folders: [],
        apiKeys: {
            openai: '',
            anthropic: '',
            gemini: '',
            openrouter: ''
        }
    };
}

function isLegacyTemplate(prompt = {}) {
    if (!prompt || typeof prompt !== 'object') return false;
    return RECOMMENDED_TEMPLATE_TITLES.has(prompt.title);
}

function normalizePrompt(prompt = {}) {
    return {
        id: prompt.id || uuidv4(),
        title: prompt.title || 'Untitled Prompt',
        content: prompt.content || '',
        tags: Array.isArray(prompt.tags) ? prompt.tags : [],
        platform: prompt.platform || 'OpenRouter',
        folderId: prompt.folderId || undefined,
        color: prompt.color,
        createdAt: prompt.createdAt || new Date().toISOString()
    };
}

function normalizeTemplate(template = {}) {
    return {
        id: template.id || `tpl-${uuidv4()}`,
        title: template.title || 'Untitled Template',
        content: template.content || '',
        tags: Array.isArray(template.tags) ? template.tags : [],
        platform: template.platform || 'OpenRouter',
        categoryId: template.categoryId || template.folderId || 'general',
        color: template.color,
        createdAt: template.createdAt || new Date().toISOString()
    };
}

function migrateData(raw) {
    const initialData = createInitialData();

    if (!raw || typeof raw !== 'object') {
        return initialData;
    }

    const hasTemplatesSchema = Array.isArray(raw.templates);

    let prompts = [];
    let templates = [];

    if (hasTemplatesSchema) {
        prompts = Array.isArray(raw.prompts) ? raw.prompts.map(normalizePrompt) : [];
        templates = raw.templates.length > 0
            ? raw.templates.map(normalizeTemplate)
            : initialData.templates;
    } else {
        const legacyPrompts = Array.isArray(raw.prompts) ? raw.prompts : [];

        const split = legacyPrompts.reduce((acc, prompt) => {
            if (isLegacyTemplate(prompt)) {
                acc.templates.push(prompt);
            } else {
                acc.prompts.push(prompt);
            }
            return acc;
        }, { prompts: [], templates: [] });

        prompts = split.prompts.map(normalizePrompt);
        templates = split.templates.length > 0
            ? split.templates.map(normalizeTemplate)
            : initialData.templates;
    }

    const promptFolderIds = new Set(prompts.map((prompt) => prompt.folderId).filter(Boolean));

    const folders = Array.isArray(raw.folders)
        ? raw.folders
            .filter((folder) => {
                if (hasTemplatesSchema) return true;
                return promptFolderIds.has(folder.id) || !LEGACY_CATEGORY_IDS.has(folder.id);
            })
            .map((folder) => ({
                id: folder.id || uuidv4(),
                name: folder.name || 'Untitled Folder',
                createdAt: folder.createdAt || new Date().toISOString()
            }))
        : [];

    const runs = Array.isArray(raw.runs) ? raw.runs : [];

    return {
        prompts,
        templates,
        runs,
        folders,
        apiKeys: {
            ...initialData.apiKeys,
            ...(raw.apiKeys || {})
        }
    };
}

export function useStore() {
    const [data, setData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return createInitialData();
            return migrateData(JSON.parse(saved));
        } catch (error) {
            console.error('Failed to parse local storage data:', error);
            return createInitialData();
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const addPrompt = (prompt) => {
        const newPrompt = normalizePrompt({ ...prompt, id: uuidv4(), createdAt: new Date().toISOString() });
        setData((prev) => ({ ...prev, prompts: [newPrompt, ...prev.prompts] }));
        return newPrompt;
    };

    const addPromptFromTemplate = (templateId, overrides = {}) => {
        const template = data.templates.find((item) => item.id === templateId);
        if (!template) return null;

        const newPrompt = normalizePrompt({
            title: template.title,
            content: template.content,
            tags: template.tags,
            platform: template.platform,
            color: template.color,
            ...overrides,
            id: uuidv4(),
            createdAt: new Date().toISOString()
        });

        setData((prev) => ({ ...prev, prompts: [newPrompt, ...prev.prompts] }));
        return newPrompt;
    };

    const updatePrompt = (id, updates) => {
        setData((prev) => ({
            ...prev,
            prompts: prev.prompts.map((prompt) => prompt.id === id ? { ...prompt, ...updates } : prompt)
        }));
    };

    const deletePrompt = (id) => {
        setData((prev) => ({
            ...prev,
            prompts: prev.prompts.filter((prompt) => prompt.id !== id)
        }));
    };

    const addRun = (run) => {
        const newRun = { ...run, id: uuidv4(), createdAt: new Date().toISOString() };
        setData((prev) => ({ ...prev, runs: [newRun, ...prev.runs] }));
    };

    const deleteRun = (id) => {
        setData((prev) => ({
            ...prev,
            runs: prev.runs.filter((run) => run.id !== id)
        }));
    };

    const setApiKeys = (keys) => {
        setData((prev) => ({ ...prev, apiKeys: { ...prev.apiKeys, ...keys } }));
    };

    const createFolder = (name) => {
        const newFolder = {
            id: uuidv4(),
            name,
            createdAt: new Date().toISOString()
        };
        setData((prev) => ({ ...prev, folders: [...prev.folders, newFolder] }));
        return newFolder;
    };

    const deleteFolder = (id) => {
        setData((prev) => ({
            ...prev,
            folders: prev.folders.filter((folder) => folder.id !== id),
            prompts: prev.prompts.map((prompt) => prompt.folderId === id ? { ...prompt, folderId: undefined } : prompt)
        }));
    };

    return {
        prompts: data.prompts,
        templates: data.templates,
        templateCategories: RECOMMENDED_TEMPLATE_CATEGORIES,
        runs: data.runs,
        folders: data.folders,
        apiKeys: data.apiKeys,
        addPrompt,
        addPromptFromTemplate,
        updatePrompt,
        deletePrompt,
        addRun,
        deleteRun,
        setApiKeys,
        createFolder,
        deleteFolder,
        resetData: () => setData(createInitialData())
    };
}
