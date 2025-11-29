import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'prompt-folio-data';

const INITIAL_DATA = {
    prompts: [
        // UX Designer Templates
        {
            id: '1',
            title: 'UX Wireframe Generator',
            content: 'Create a detailed wireframe concept for a {{feature_description}} inside a {{platform_type}} product. Include user goals, UX rationale, UI layout hierarchy, and variations for {{device_type}}. Keep the tone action-oriented and concise.',
            tags: ['ux', 'wireframe', 'design'],
            platform: 'ChatGPT',
            folderId: 'ux',
            createdAt: new Date().toISOString(),
        },
        {
            id: '2',
            title: 'User Research Summarizer',
            content: 'Summarize user interview notes about {{user_segment}} using themes, pain points, motivations, opportunities, and workflow diagrams. Output in a structured UX report.',
            tags: ['research', 'ux', 'synthesis'],
            platform: 'Claude',
            folderId: 'ux',
            createdAt: new Date().toISOString(),
        },

        // Data Analyst Templates
        {
            id: '3',
            title: 'SQL Query Generator',
            content: 'Generate an optimized SQL query for {{data_question}} using table {{table_name}} and fields {{field_list}}. Return the query plus an explanation and edge-case considerations.',
            tags: ['sql', 'analytics'],
            platform: 'ChatGPT',
            folderId: 'data-analytics',
            createdAt: new Date().toISOString(),
        },
        {
            id: '4',
            title: 'Insights Summary Writer',
            content: 'Given an analysis about {{topic}}, write a clear business-facing insights summary including key findings, implications, risks, and actionable recommendations.',
            tags: ['summary', 'analytics', 'storytelling'],
            platform: 'Claude',
            folderId: 'data-analytics',
            createdAt: new Date().toISOString(),
        },

        // Data Engineer Templates
        {
            id: '5',
            title: 'Pipeline Design Adviser',
            content: 'Propose a robust data pipeline architecture for {{data_source_type}} → {{destination_system}} including transformations, storage layers, orchestration, error handling, and scaling approach.',
            tags: ['data engineering', 'pipelines'],
            platform: 'ChatGPT',
            folderId: 'data-engineering',
            createdAt: new Date().toISOString(),
        },
        {
            id: '6',
            title: 'ETL Code Stub Generator',
            content: 'Generate a code template for an ETL workflow that extracts {{data_source}}, transforms {{transformation_description}}, and loads into {{target_system}}.',
            tags: ['etl', 'automation'],
            platform: 'Gemini',
            folderId: 'data-engineering',
            createdAt: new Date().toISOString(),
        },

        // Business Analyst Templates
        {
            id: '7',
            title: 'Requirement Breakdown',
            content: 'Break down the business requirement \'{{requirement_statement}}\' into user stories, acceptance criteria, process flows, KPIs, and data considerations.',
            tags: ['requirements', 'ba', 'documentation'],
            platform: 'Claude',
            folderId: 'business-analysis',
            createdAt: new Date().toISOString(),
        },
        {
            id: '8',
            title: 'Gap Analysis Template',
            content: 'Perform a gap analysis for current state {{current_state}} versus desired state {{desired_state}}, including blockers, root causes, and recommended solutions.',
            tags: ['ba', 'strategy'],
            platform: 'ChatGPT',
            folderId: 'business-analysis',
            createdAt: new Date().toISOString(),
        },

        // Product Manager Templates
        {
            id: '9',
            title: 'PRD Draft Builder',
            content: 'Write a PRD for {{feature_name}} including overview, goals, non-goals, functional requirements, user flows, UX expectations, KPIs, rollout plan, and risks.',
            tags: ['prd', 'product management'],
            platform: 'Claude',
            folderId: 'product-management',
            createdAt: new Date().toISOString(),
        },
        {
            id: '10',
            title: 'Strategy Brief Generator',
            content: 'Draft a strategy brief for {{business_goal}} including market context, user needs, competitive landscape, success metrics, and roadmap phases.',
            tags: ['strategy', 'pm'],
            platform: 'ChatGPT',
            folderId: 'product-management',
            createdAt: new Date().toISOString(),
        },

        // Sales Templates
        {
            id: '11',
            title: 'Outbound Email Personalizer',
            content: 'Write a personalized outreach email to a prospect in the {{industry}} industry highlighting how our product solves {{pain_point}}. Keep tone friendly and concise.',
            tags: ['sales', 'outreach'],
            platform: 'ChatGPT',
            folderId: 'sales',
            createdAt: new Date().toISOString(),
        },
        {
            id: '12',
            title: 'Objection Handling Script',
            content: 'Generate a list of objection-handling responses for the common concern \'{{objection}}\' tailored to persona {{persona_type}}.',
            tags: ['sales', 'scripts'],
            platform: 'Claude',
            folderId: 'sales',
            createdAt: new Date().toISOString(),
        },

        // Marketing Templates
        {
            id: '13',
            title: 'Campaign Proposal Writer',
            content: 'Create a comprehensive multi-channel marketing campaign proposal for the product {{product_name}} targeting {{target_audience_description}} in the {{industry_vertical}} industry.\\nInclude the following sections:\\nCampaign Objective — describe the primary goal, such as {{campaign_goal}}.\\nAudience Insights — summarize demographics, psychographics, pain points, motivations, and behavior patterns for {{audience_segment}}.\\nMessaging Strategy — craft 3–5 messaging pillars that highlight key value propositions around {{unique_selling_point}}, {{competitive_advantage}}, and {{brand_voice_style}}.\\nChannel Plan — recommend channels including {{preferred_channels}} and justify why each channel fits the audience.\\nCreative Concepts — propose 3 creative ideas using themes {{creative_themes}}, with example headlines, social captions, visuals, and tone guidelines.\\nCampaign Timeline — provide a high-level timeline with phases {{campaign_phases}}.\\nBudget Allocation — suggest a budget breakdown for channels, creative production, paid placements, and tools based on a total budget of {{total_budget}}.\\nKPIs & Measurement Plan — list KPIs including {{primary_kpis}} and describe the analytics framework.\\nRisks & Mitigation — identify potential risks such as {{potential_risks}} and mitigation steps.\\nFinalize with a one-page executive summary.',
            tags: ['marketing', 'campaigns', 'planning'],
            platform: 'ChatGPT',
            folderId: 'marketing',
            createdAt: new Date().toISOString(),
        },
        {
            id: '14',
            title: 'Content Calendar Generator',
            content: 'Generate a detailed 30-day content calendar for the brand {{brand_name}}, which is focused on {{brand_mission}} and targets {{audience_demographic}} who are motivated by {{audience_values}}.\\nThe calendar should include:\\nDaily Content Themes — vary formats like videos, carousels, blogs, live sessions, and community prompts based on the content pillars {{content_pillars}}.\\nPost-by-Post Breakdown — for each of the 30 days, specify:\\nTheme: {{daily_theme}}\\nFormat: {{content_format}}\\nHook/headline suggestion using the style of {{tone_style}}\\nValue/Insight based on {{topic_focus}}\\nCTA customized for {{desired_action}}\\nSuggested supporting visual (e.g., infographics, product shots, lifestyle content)\\nChannel Distribution Strategy — include recommendations on how to split content across {{marketing_channels}}.\\nHashtag Strategy — propose hashtags tailored to {{niche_category}}.\\nEngagement Plan — outline community management tasks like responding to comments, engaging with related accounts, and posting user-generated content on {{ugc_plan_days}}.\\nAmplification Ideas — optional paid boosts or collaborations with {{potential_partners}} or influencers with {{influencer_audience_size}}.\\nMonthly KPI Targets — specify goals aligned with {{growth_metrics}}.\\nOutput the calendar in a structured, scannable table format.',
            tags: ['marketing', 'social media', 'content calendar'],
            platform: 'Gemini',
            folderId: 'marketing',
            createdAt: new Date().toISOString(),
        },

        // Recruiter Templates
        {
            id: '15',
            title: 'Candidate Screening Script',
            content: 'Create a structured screening template for the role {{role_name}} including key questions, skill checks, scoring rubric, and red flags.',
            tags: ['recruiting', 'screening'],
            platform: 'Claude',
            folderId: 'recruiting',
            createdAt: new Date().toISOString(),
        },
        {
            id: '16',
            title: 'Job Description Optimizer',
            content: 'Rewrite the job description for {{role_name}} to improve clarity, inclusivity, and candidate appeal. Include role impact, responsibilities, and qualification tiers.',
            tags: ['hiring', 'jd'],
            platform: 'ChatGPT',
            folderId: 'recruiting',
            createdAt: new Date().toISOString(),
        },

        // CEO Templates
        {
            id: '17',
            title: 'Company Vision Refinement',
            content: 'Refine the company vision for {{company_name}} focusing on long-term impact, market position, and cultural values. Output 3 alternative versions.',
            tags: ['leadership', 'strategy'],
            platform: 'Claude',
            folderId: 'executive',
            createdAt: new Date().toISOString(),
        },
        {
            id: '18',
            title: 'Board Update Generator',
            content: 'Draft a quarterly board update with metrics about {{business_area}}, wins, risks, financial highlights, and next-quarter priorities.',
            tags: ['ceo', 'reports'],
            platform: 'ChatGPT',
            folderId: 'executive',
            createdAt: new Date().toISOString(),
        }
    ],
    runs: [],
    folders: [
        { id: 'ux', name: 'UX Design', createdAt: new Date().toISOString() },
        { id: 'data-analytics', name: 'Data Analysis', createdAt: new Date().toISOString() },
        { id: 'data-engineering', name: 'Data Engineering', createdAt: new Date().toISOString() },
        { id: 'business-analysis', name: 'Business Analysis', createdAt: new Date().toISOString() },
        { id: 'product-management', name: 'Product Management', createdAt: new Date().toISOString() },
        { id: 'sales', name: 'Sales', createdAt: new Date().toISOString() },
        { id: 'marketing', name: 'Marketing', createdAt: new Date().toISOString() },
        { id: 'recruiting', name: 'Recruiting', createdAt: new Date().toISOString() },
        { id: 'executive', name: 'Executive', createdAt: new Date().toISOString() }
    ],
    apiKeys: {
        openai: '',
        anthropic: '',
        gemini: ''
    }
};

export function useStore() {
    const [data, setData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : INITIAL_DATA;
        } catch (error) {
            console.error('Failed to parse local storage data:', error);
            return INITIAL_DATA;
        }
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

    const createFolder = (name) => {
        const newFolder = { id: uuidv4(), name, createdAt: new Date().toISOString() };
        setData(prev => ({ ...prev, folders: [...prev.folders, newFolder] }));
    };

    const deleteFolder = (id) => {
        setData(prev => ({
            ...prev,
            folders: prev.folders.filter(f => f.id !== id),
            prompts: prev.prompts.map(p => p.folderId === id ? { ...p, folderId: undefined } : p)
        }));
    };

    return {
        prompts: data.prompts,
        runs: data.runs,
        folders: data.folders,
        apiKeys: data.apiKeys,
        addPrompt,
        updatePrompt,
        deletePrompt,
        addRun,
        setApiKeys,
        createFolder,
        deleteFolder,
        resetData: () => setData(INITIAL_DATA)
    };
}
