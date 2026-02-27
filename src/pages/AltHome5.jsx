import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    CheckCircle2,
    ClipboardList,
    Gauge,
    Layers3,
    ShieldCheck,
    Swords,
    TimerReset,
    WandSparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const USE_CASES = [
    {
        id: 'launches',
        label: 'GTM Launches',
        challenge: 'Launch prompts are rewritten from scratch every cycle.',
        today: [
            'Different teams use incompatible prompt styles.',
            'Review feedback arrives late and conflicts.',
            'Final copy quality varies between launches.',
        ],
        future: [
            'A launch template kit is shared across product and marketing.',
            'Arena compares two launch angles before publish.',
            'Version history captures why each winning prompt won.',
        ],
        artifacts: [
            { name: 'launch-brief-template.md', note: 'Reusable template with role and tone variables.' },
            { name: 'arena-launch-rubric.md', note: 'Standard criteria for clarity, conversion, and compliance.' },
            { name: 'release-prompt-checklist.md', note: 'Final pass checklist before go-live.' },
        ],
        headline: 'Turn launch chaos into a repeatable prompt production line.',
    },
    {
        id: 'support',
        label: 'Support Operations',
        challenge: 'Support agents improvise responses with uneven quality.',
        today: [
            'Agents copy old replies with no quality benchmark.',
            'Escalation prompts are inconsistent by person.',
            'New agents take too long to become reliable.',
        ],
        future: [
            'Templates map to issue type, urgency, and customer segment.',
            'Arena stress-tests responses on hard edge-case tickets.',
            'History tracks what reduced back-and-forth fastest.',
        ],
        artifacts: [
            { name: 'support-response-template.md', note: 'Tiered variables for urgency and customer type.' },
            { name: 'ticket-arena-set.json', note: 'Benchmark scenarios for side-by-side evaluation.' },
            { name: 'agent-onboarding-pack.md', note: 'Ready-to-use prompt playbook for new agents.' },
        ],
        headline: 'Make support quality predictable, even under pressure.',
    },
    {
        id: 'docs',
        label: 'Product Documentation',
        challenge: 'Docs prompts are brittle and difficult to scale.',
        today: [
            'Authors use personal prompt styles with no shared baseline.',
            'Edits are scattered across tools and hard to trace.',
            'Content voice drifts between sections.',
        ],
        future: [
            'Shared doc-generation templates enforce style and structure.',
            'Arena compares readability and factual precision.',
            'History preserves reliable prompt versions per doc type.',
        ],
        artifacts: [
            { name: 'doc-style-template.md', note: 'Structure-first template for tutorials and references.' },
            { name: 'readability-arena.csv', note: 'Output comparisons scored across comprehension metrics.' },
            { name: 'docs-governance-guide.md', note: 'Prompt ownership and change management model.' },
        ],
        headline: 'Scale documentation quality without adding editorial drag.',
    },
];

const TEAM_PROFILES = [
    { id: 'seed', label: 'Small Team', people: '4-8', rhythm: 'Fast loops, low ceremony.' },
    { id: 'growth', label: 'Growing Team', people: '9-20', rhythm: 'Needs standards and shared rituals.' },
    { id: 'scale', label: 'Scaled Team', people: '21+', rhythm: 'Needs governance and ownership clarity.' },
];

const RISK_MODES = [
    { id: 'safe', label: 'Conservative', cadence: 'Stability first rollout', confidenceBoost: 12, speedBoost: 8 },
    { id: 'balanced', label: 'Balanced', cadence: 'Mixed speed + safeguards', confidenceBoost: 18, speedBoost: 14 },
    { id: 'bold', label: 'Aggressive', cadence: 'Rapid experimentation rollout', confidenceBoost: 22, speedBoost: 21 },
];

function useTokens() {
    const { theme } = useTheme();
    const dk = theme === 'dark';

    return {
        dk,
        pageBg: dk
            ? 'linear-gradient(160deg, #12140f 0%, #1a1f15 45%, #2a2215 100%)'
            : 'linear-gradient(160deg, #fffdee 0%, #f7f8ef 42%, #fff4e8 100%)',
        text: dk ? '#f2f0e6' : '#1f2937',
        muted: dk ? 'rgba(242,240,230,0.67)' : 'rgba(31,41,55,0.62)',
        faint: dk ? 'rgba(242,240,230,0.42)' : 'rgba(31,41,55,0.37)',
        panel: dk ? 'rgba(24, 29, 20, 0.72)' : 'rgba(255, 255, 255, 0.85)',
        panelStrong: dk ? 'rgba(20, 24, 17, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        border: dk ? 'rgba(190, 242, 100, 0.2)' : 'rgba(77, 124, 15, 0.2)',
        borderSoft: dk ? 'rgba(163, 163, 140, 0.24)' : 'rgba(120, 113, 108, 0.18)',
        olive: dk ? '#bef264' : '#4d7c0f',
        amber: dk ? '#fdba74' : '#b45309',
        success: dk ? '#86efac' : '#15803d',
        warning: dk ? '#fcd34d' : '#a16207',
        red: dk ? '#fca5a5' : '#b91c1c',
        chipBg: dk ? 'rgba(190,242,100,0.1)' : 'rgba(132,204,22,0.12)',
        primaryBtn: dk ? '#65a30d' : '#4d7c0f',
        orbA: dk ? 'rgba(190, 242, 100, 0.12)' : 'rgba(132, 204, 22, 0.1)',
        orbB: dk ? 'rgba(251, 191, 36, 0.1)' : 'rgba(245, 158, 11, 0.09)',
    };
}

function RoadmapCard({ title, weekRange, actions, icon, tk }) {
    const IconComponent = icon;

    return (
        <article className="rounded-2xl p-4" style={{ background: tk.panel, border: `1px solid ${tk.borderSoft}` }}>
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                    {IconComponent ? <IconComponent size={14} style={{ color: tk.olive }} /> : null}
                    <p className="text-xs uppercase tracking-[0.13em]" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.olive }}>
                        {title}
                    </p>
                </div>
                <span className="text-xs" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.faint }}>
                    {weekRange}
                </span>
            </div>
            <div className="space-y-2">
                {actions.map(action => (
                    <p key={action} className="text-sm leading-relaxed" style={{ color: tk.muted }}>
                        {action}
                    </p>
                ))}
            </div>
        </article>
    );
}

export function AltHome5() {
    const tk = useTokens();
    const [useCaseId, setUseCaseId] = useState(USE_CASES[0].id);
    const [teamId, setTeamId] = useState(TEAM_PROFILES[1].id);
    const [riskId, setRiskId] = useState(RISK_MODES[1].id);

    const useCase = useMemo(
        () => USE_CASES.find(item => item.id === useCaseId) ?? USE_CASES[0],
        [useCaseId]
    );
    const team = useMemo(
        () => TEAM_PROFILES.find(item => item.id === teamId) ?? TEAM_PROFILES[0],
        [teamId]
    );
    const risk = useMemo(
        () => RISK_MODES.find(item => item.id === riskId) ?? RISK_MODES[0],
        [riskId]
    );

    const scores = useMemo(() => {
        const baseSpeed = team.id === 'seed' ? 62 : team.id === 'growth' ? 56 : 48;
        const baseConfidence = team.id === 'seed' ? 58 : team.id === 'growth' ? 64 : 72;
        const speed = Math.min(95, baseSpeed + risk.speedBoost);
        const confidence = Math.min(96, baseConfidence + risk.confidenceBoost);
        const reuse = Math.min(92, 50 + (team.id === 'seed' ? 22 : team.id === 'growth' ? 30 : 36));
        return { speed, confidence, reuse };
    }, [risk.confidenceBoost, risk.speedBoost, team.id]);

    const roadmap = useMemo(() => {
        const firstWindow = risk.id === 'bold' ? 'Week 1' : 'Week 1-2';
        const secondWindow = risk.id === 'bold' ? 'Week 2-3' : 'Week 3-5';
        const thirdWindow = risk.id === 'bold' ? 'Week 4-6' : 'Week 6-9';

        return [
            {
                title: 'Foundation',
                weekRange: firstWindow,
                icon: Layers3,
                actions: [
                    `Map ${useCase.label.toLowerCase()} prompt types and owners.`,
                    'Create a starter template stack with mandatory variables.',
                    `Set collaboration rhythm: ${team.rhythm}`,
                ],
            },
            {
                title: 'Validation',
                weekRange: secondWindow,
                icon: Swords,
                actions: [
                    'Run Arena comparisons on live prompt candidates.',
                    'Add a shared scoring rubric for quality decisions.',
                    `Execute rollout mode: ${risk.cadence}.`,
                ],
            },
            {
                title: 'Scale',
                weekRange: thirdWindow,
                icon: ShieldCheck,
                actions: [
                    'Publish governance rules for template ownership.',
                    'Track outcomes in history and prune weak variants.',
                    'Operationalize onboarding with prompt playbooks.',
                ],
            },
        ];
    }, [risk.cadence, risk.id, team.rhythm, useCase.label]);

    return (
        <div className="relative min-h-screen overflow-hidden" style={{ background: tk.pageBg, color: tk.text }}>
            <style>{`
                @keyframes alt5Enter {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes alt5Pulse {
                    0%, 100% { opacity: 0.55; transform: scale(1); }
                    50% { opacity: 0.95; transform: scale(1.06); }
                }
            `}</style>

            <div className="pointer-events-none absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(125deg, rgba(120,113,108,0.08) 0 1px, transparent 1px 32px)',
                opacity: tk.dk ? 0.4 : 0.35,
            }} />
            <div className="pointer-events-none absolute -left-20 top-14 h-72 w-72 rounded-full blur-3xl" style={{ background: tk.orbA, animation: 'alt5Pulse 9s ease-in-out infinite' }} />
            <div className="pointer-events-none absolute -right-20 bottom-16 h-72 w-72 rounded-full blur-3xl" style={{ background: tk.orbB, animation: 'alt5Pulse 12s ease-in-out infinite reverse' }} />

            <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-6" style={{ animation: 'alt5Enter 380ms ease both' }}>
                <div className="max-w-4xl">
                    <p
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]"
                        style={{
                            fontFamily: 'IBM Plex Mono, monospace',
                            border: `1px solid ${tk.border}`,
                            background: tk.chipBg,
                            color: tk.olive,
                        }}
                    >
                        <WandSparkles size={12} />
                        Alt5: Scenario Simulator
                    </p>
                    <h1
                        className="mt-4 text-4xl md:text-6xl leading-[1.01]"
                        style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
                    >
                        Design your prompt operating model before you build the homepage around it.
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed max-w-3xl" style={{ color: tk.muted }}>
                        This concept reframes the landing page as an interactive strategy simulation. Instead of only
                        showing UI, it demonstrates how PromptFolio changes real team behavior across workflow stages.
                    </p>
                </div>
            </section>

            <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-6" style={{ animation: 'alt5Enter 520ms ease both' }}>
                <div className="rounded-2xl p-5 md:p-6" style={{ background: tk.panelStrong, border: `1px solid ${tk.border}` }}>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.faint }}>
                                Use Case
                            </p>
                            <div className="space-y-2">
                                {USE_CASES.map(item => {
                                    const active = item.id === useCaseId;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setUseCaseId(item.id)}
                                            className="w-full text-left rounded-lg px-3 py-2.5 text-sm"
                                            style={{
                                                border: active ? `1px solid ${tk.olive}` : `1px solid ${tk.borderSoft}`,
                                                background: active ? tk.chipBg : tk.panel,
                                                color: active ? tk.olive : tk.muted,
                                            }}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.faint }}>
                                Team Profile
                            </p>
                            <div className="space-y-2">
                                {TEAM_PROFILES.map(item => {
                                    const active = item.id === teamId;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setTeamId(item.id)}
                                            className="w-full text-left rounded-lg px-3 py-2.5"
                                            style={{
                                                border: active ? `1px solid ${tk.olive}` : `1px solid ${tk.borderSoft}`,
                                                background: active ? tk.chipBg : tk.panel,
                                            }}
                                        >
                                            <p className="text-sm" style={{ color: tk.text }}>{item.label}</p>
                                            <p className="text-xs mt-1" style={{ color: tk.faint }}>{item.people} people</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.faint }}>
                                Rollout Mode
                            </p>
                            <div className="space-y-2">
                                {RISK_MODES.map(item => {
                                    const active = item.id === riskId;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setRiskId(item.id)}
                                            className="w-full text-left rounded-lg px-3 py-2.5"
                                            style={{
                                                border: active ? `1px solid ${tk.amber}` : `1px solid ${tk.borderSoft}`,
                                                background: active ? (tk.dk ? 'rgba(251,191,36,0.1)' : 'rgba(245,158,11,0.12)') : tk.panel,
                                            }}
                                        >
                                            <p className="text-sm" style={{ color: tk.text }}>{item.label}</p>
                                            <p className="text-xs mt-1" style={{ color: tk.faint }}>{item.cadence}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-6 grid gap-4 lg:grid-cols-[1fr_1fr]" style={{ animation: 'alt5Enter 640ms ease both' }}>
                <article className="rounded-2xl p-5" style={{ background: tk.panel, border: `1px solid ${tk.borderSoft}` }}>
                    <p className="text-xs uppercase tracking-[0.13em] mb-3" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.red }}>
                        Current Pain Snapshot
                    </p>
                    <h2 className="text-2xl leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {useCase.challenge}
                    </h2>
                    <ul className="mt-4 space-y-2">
                        {useCase.today.map(item => (
                            <li key={item} className="text-sm leading-relaxed" style={{ color: tk.muted }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="rounded-2xl p-5" style={{ background: tk.panel, border: `1px solid ${tk.borderSoft}` }}>
                    <p className="text-xs uppercase tracking-[0.13em] mb-3" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.success }}>
                        Future Operating Model
                    </p>
                    <h2 className="text-2xl leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {useCase.headline}
                    </h2>
                    <ul className="mt-4 space-y-2">
                        {useCase.future.map(item => (
                            <li key={item} className="text-sm leading-relaxed" style={{ color: tk.muted }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </article>
            </section>

            <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-6" style={{ animation: 'alt5Enter 740ms ease both' }}>
                <div className="rounded-2xl p-5 md:p-6" style={{ background: tk.panelStrong, border: `1px solid ${tk.border}` }}>
                    <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                        <div className="flex items-center gap-2">
                            <TimerReset size={14} style={{ color: tk.olive }} />
                            <p className="text-xs uppercase tracking-[0.13em]" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.olive }}>
                                90-Day Flight Plan
                            </p>
                        </div>
                        <p className="text-xs" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.faint }}>
                            team: {team.label} · mode: {risk.label}
                        </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                        {roadmap.map(item => (
                            <RoadmapCard key={item.title} {...item} tk={tk} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-6 grid gap-4 md:grid-cols-3" style={{ animation: 'alt5Enter 820ms ease both' }}>
                <article className="rounded-2xl p-5" style={{ background: tk.panel, border: `1px solid ${tk.borderSoft}` }}>
                    <div className="flex items-center gap-2 mb-3">
                        <Gauge size={14} style={{ color: tk.amber }} />
                        <p className="text-xs uppercase tracking-[0.12em]" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.amber }}>
                            Execution Speed
                        </p>
                    </div>
                    <p className="text-3xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{scores.speed}%</p>
                    <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: tk.borderSoft }}>
                        <div style={{ width: `${scores.speed}%`, height: '100%', background: tk.amber }} />
                    </div>
                </article>

                <article className="rounded-2xl p-5" style={{ background: tk.panel, border: `1px solid ${tk.borderSoft}` }}>
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck size={14} style={{ color: tk.success }} />
                        <p className="text-xs uppercase tracking-[0.12em]" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.success }}>
                            Decision Confidence
                        </p>
                    </div>
                    <p className="text-3xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{scores.confidence}%</p>
                    <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: tk.borderSoft }}>
                        <div style={{ width: `${scores.confidence}%`, height: '100%', background: tk.success }} />
                    </div>
                </article>

                <article className="rounded-2xl p-5" style={{ background: tk.panel, border: `1px solid ${tk.borderSoft}` }}>
                    <div className="flex items-center gap-2 mb-3">
                        <Layers3 size={14} style={{ color: tk.olive }} />
                        <p className="text-xs uppercase tracking-[0.12em]" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.olive }}>
                            Template Reuse
                        </p>
                    </div>
                    <p className="text-3xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{scores.reuse}%</p>
                    <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: tk.borderSoft }}>
                        <div style={{ width: `${scores.reuse}%`, height: '100%', background: tk.olive }} />
                    </div>
                </article>
            </section>

            <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-6" style={{ animation: 'alt5Enter 900ms ease both' }}>
                <div className="rounded-2xl p-5 md:p-6" style={{ background: tk.panelStrong, border: `1px solid ${tk.border}` }}>
                    <div className="flex items-center gap-2 mb-4">
                        <ClipboardList size={14} style={{ color: tk.olive }} />
                        <p className="text-xs uppercase tracking-[0.13em]" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.olive }}>
                            Deliverable Stack
                        </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                        {useCase.artifacts.map(artifact => (
                            <article key={artifact.name} className="rounded-xl p-4" style={{ border: `1px solid ${tk.borderSoft}`, background: tk.panel }}>
                                <p className="text-sm" style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.amber }}>
                                    {artifact.name}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed" style={{ color: tk.muted }}>
                                    {artifact.note}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-16" style={{ animation: 'alt5Enter 980ms ease both' }}>
                <div className="rounded-3xl p-6 md:p-8" style={{ background: tk.panelStrong, border: `1px solid ${tk.borderSoft}` }}>
                    <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                        <div>
                            <h2 className="text-3xl leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                Ready to pressure-test your own scenario?
                            </h2>
                            <div className="mt-4 space-y-2">
                                <p className="text-sm leading-relaxed" style={{ color: tk.muted }}>
                                    Use this same simulation structure on your final landing page: let visitors pick
                                    context, expose operational outcomes, and end with a concrete action.
                                </p>
                                <div className="flex items-start gap-2 text-sm" style={{ color: tk.muted }}>
                                    <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: tk.success }} />
                                    Scenario story beats static feature lists for complex products.
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <Link
                                to="/app"
                                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold"
                                style={{ fontFamily: 'Space Grotesk, sans-serif', background: tk.primaryBtn, color: '#fff' }}
                            >
                                Open PromptFolio
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/arena"
                                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium"
                                style={{ border: `1px solid ${tk.borderSoft}`, color: tk.text }}
                            >
                                <Swords size={15} />
                                Run an Arena Test
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
