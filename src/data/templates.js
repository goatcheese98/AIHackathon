export const RECOMMENDED_TEMPLATE_CATEGORIES = [
    { id: 'ux', name: 'UX Design' },
    { id: 'data-analytics', name: 'Data Analysis' },
    { id: 'data-engineering', name: 'Data Engineering' },
    { id: 'business-analysis', name: 'Business Analysis' },
    { id: 'product-management', name: 'Product Management' },
    { id: 'sales', name: 'Sales' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'recruiting', name: 'Recruiting' },
    { id: 'executive', name: 'Executive' }
];

export const RECOMMENDED_TEMPLATES = [
    {
        id: 'tpl-ux-wireframe-generator',
        title: 'UX Wireframe Generator',
        content: 'Create a detailed wireframe concept for a {{feature_description}} inside a {{platform_type}} product. Include user goals, UX rationale, UI layout hierarchy, and variations for {{device_type}}. Keep the tone action-oriented and concise.',
        tags: ['ux', 'wireframe', 'design'],
        platform: 'ChatGPT',
        categoryId: 'ux',
        color: 'purple'
    },
    {
        id: 'tpl-user-research-summarizer',
        title: 'User Research Summarizer',
        content: 'Summarize user interview notes about {{user_segment}} using themes, pain points, motivations, opportunities, and workflow diagrams. Output in a structured UX report.',
        tags: ['research', 'ux', 'synthesis'],
        platform: 'Claude',
        categoryId: 'ux'
    },
    {
        id: 'tpl-sql-query-generator',
        title: 'SQL Query Generator',
        content: 'Generate an optimized SQL query for {{data_question}} using table {{table_name}} and fields {{field_list}}. Return the query plus an explanation and edge-case considerations.',
        tags: ['sql', 'analytics'],
        platform: 'ChatGPT',
        categoryId: 'data-analytics',
        color: 'blue'
    },
    {
        id: 'tpl-insights-summary-writer',
        title: 'Insights Summary Writer',
        content: 'Given an analysis about {{topic}}, write a clear business-facing insights summary including key findings, implications, risks, and actionable recommendations.',
        tags: ['summary', 'analytics', 'storytelling'],
        platform: 'Claude',
        categoryId: 'data-analytics'
    },
    {
        id: 'tpl-pipeline-design-adviser',
        title: 'Pipeline Design Adviser',
        content: 'Propose a robust data pipeline architecture for {{data_source_type}} -> {{destination_system}} including transformations, storage layers, orchestration, error handling, and scaling approach.',
        tags: ['data engineering', 'pipelines'],
        platform: 'ChatGPT',
        categoryId: 'data-engineering'
    },
    {
        id: 'tpl-etl-code-stub-generator',
        title: 'ETL Code Stub Generator',
        content: 'Generate a code template for an ETL workflow that extracts {{data_source}}, transforms {{transformation_description}}, and loads into {{target_system}}.',
        tags: ['etl', 'automation'],
        platform: 'Gemini',
        categoryId: 'data-engineering'
    },
    {
        id: 'tpl-requirement-breakdown',
        title: 'Requirement Breakdown',
        content: 'Break down the business requirement \'{{requirement_statement}}\' into user stories, acceptance criteria, process flows, KPIs, and data considerations.',
        tags: ['requirements', 'ba', 'documentation'],
        platform: 'Claude',
        categoryId: 'business-analysis'
    },
    {
        id: 'tpl-gap-analysis-template',
        title: 'Gap Analysis Template',
        content: 'Perform a gap analysis for current state {{current_state}} versus desired state {{desired_state}}, including blockers, root causes, and recommended solutions.',
        tags: ['ba', 'strategy'],
        platform: 'ChatGPT',
        categoryId: 'business-analysis'
    },
    {
        id: 'tpl-prd-draft-builder',
        title: 'PRD Draft Builder',
        content: 'Write a PRD for {{feature_name}} including overview, goals, non-goals, functional requirements, user flows, UX expectations, KPIs, rollout plan, and risks.',
        tags: ['prd', 'product management'],
        platform: 'Claude',
        categoryId: 'product-management'
    },
    {
        id: 'tpl-strategy-brief-generator',
        title: 'Strategy Brief Generator',
        content: 'Draft a strategy brief for {{business_goal}} including market context, user needs, competitive landscape, success metrics, and roadmap phases.',
        tags: ['strategy', 'pm'],
        platform: 'ChatGPT',
        categoryId: 'product-management'
    },
    {
        id: 'tpl-outbound-email-personalizer',
        title: 'Outbound Email Personalizer',
        content: 'Write a personalized outreach email to a prospect in the {{industry}} industry highlighting how our product solves {{pain_point}}. Keep tone friendly and concise.',
        tags: ['sales', 'outreach'],
        platform: 'ChatGPT',
        categoryId: 'sales'
    },
    {
        id: 'tpl-objection-handling-script',
        title: 'Objection Handling Script',
        content: 'Generate a list of objection-handling responses for the common concern \'{{objection}}\' tailored to persona {{persona_type}}.',
        tags: ['sales', 'scripts'],
        platform: 'Claude',
        categoryId: 'sales'
    },
    {
        id: 'tpl-campaign-proposal-writer',
        title: 'Campaign Proposal Writer',
        content: 'Create a comprehensive multi-channel marketing campaign proposal for the product {{product_name}} targeting {{target_audience_description}} in the {{industry_vertical}} industry.\\nInclude the following sections:\\nCampaign Objective - describe the primary goal, such as {{campaign_goal}}.\\nAudience Insights - summarize demographics, psychographics, pain points, motivations, and behavior patterns for {{audience_segment}}.\\nMessaging Strategy - craft 3-5 messaging pillars that highlight key value propositions around {{unique_selling_point}}, {{competitive_advantage}}, and {{brand_voice_style}}.\\nChannel Plan - recommend channels including {{preferred_channels}} and justify why each channel fits the audience.\\nCreative Concepts - propose 3 creative ideas using themes {{creative_themes}}, with example headlines, social captions, visuals, and tone guidelines.\\nCampaign Timeline - provide a high-level timeline with phases {{campaign_phases}}.\\nBudget Allocation - suggest a budget breakdown for channels, creative production, paid placements, and tools based on a total budget of {{total_budget}}.\\nKPIs & Measurement Plan - list KPIs including {{primary_kpis}} and describe the analytics framework.\\nRisks & Mitigation - identify potential risks such as {{potential_risks}} and mitigation steps.\\nFinalize with a one-page executive summary.',
        tags: ['marketing', 'campaigns', 'planning'],
        platform: 'ChatGPT',
        categoryId: 'marketing',
        color: 'pink'
    },
    {
        id: 'tpl-content-calendar-generator',
        title: 'Content Calendar Generator',
        content: 'Generate a detailed 30-day content calendar for the brand {{brand_name}}, which is focused on {{brand_mission}} and targets {{audience_demographic}} who are motivated by {{audience_values}}.\\nThe calendar should include:\\nDaily Content Themes - vary formats like videos, carousels, blogs, live sessions, and community prompts based on the content pillars {{content_pillars}}.\\nPost-by-Post Breakdown - for each of the 30 days, specify:\\nTheme: {{daily_theme}}\\nFormat: {{content_format}}\\nHook/headline suggestion using the style of {{tone_style}}\\nValue/Insight based on {{topic_focus}}\\nCTA customized for {{desired_action}}\\nSuggested supporting visual (e.g., infographics, product shots, lifestyle content)\\nChannel Distribution Strategy - include recommendations on how to split content across {{marketing_channels}}.\\nHashtag Strategy - propose hashtags tailored to {{niche_category}}.\\nEngagement Plan - outline community management tasks like responding to comments, engaging with related accounts, and posting user-generated content on {{ugc_plan_days}}.\\nAmplification Ideas - optional paid boosts or collaborations with {{potential_partners}} or influencers with {{influencer_audience_size}}.\\nMonthly KPI Targets - specify goals aligned with {{growth_metrics}}.\\nOutput the calendar in a structured, scannable table format.',
        tags: ['marketing', 'social media', 'content calendar'],
        platform: 'Gemini',
        categoryId: 'marketing'
    },
    {
        id: 'tpl-candidate-screening-script',
        title: 'Candidate Screening Script',
        content: 'Create a structured screening template for the role {{role_name}} including key questions, skill checks, scoring rubric, and red flags.',
        tags: ['recruiting', 'screening'],
        platform: 'Claude',
        categoryId: 'recruiting'
    },
    {
        id: 'tpl-job-description-optimizer',
        title: 'Job Description Optimizer',
        content: 'Rewrite the job description for {{role_name}} to improve clarity, inclusivity, and candidate appeal. Include role impact, responsibilities, and qualification tiers.',
        tags: ['hiring', 'jd'],
        platform: 'ChatGPT',
        categoryId: 'recruiting'
    },
    {
        id: 'tpl-company-vision-refinement',
        title: 'Company Vision Refinement',
        content: 'Refine the company vision for {{company_name}} focusing on long-term impact, market position, and cultural values. Output 3 alternative versions.',
        tags: ['leadership', 'strategy'],
        platform: 'Claude',
        categoryId: 'executive'
    },
    {
        id: 'tpl-board-update-generator',
        title: 'Board Update Generator',
        content: 'Draft a quarterly board update with metrics about {{business_area}}, wins, risks, financial highlights, and next-quarter priorities.',
        tags: ['ceo', 'reports'],
        platform: 'ChatGPT',
        categoryId: 'executive'
    }
];
