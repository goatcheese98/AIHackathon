import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layers3, RefreshCw, Sparkles, Target } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AUDIENCES = [
    {
        id: 'builders',
        label: 'Practitioners',
        detail: 'Prompt engineers and makers who care about speed + control.',
    },
    {
        id: 'managers',
        label: 'Team Leads',
        detail: 'People focused on repeatability, adoption, and clear workflow.',
    },
    {
        id: 'buyers',
        label: 'Decision Makers',
        detail: 'Stakeholders who want confidence and measurable quality.',
    },
];

const PROMISE_OPTIONS = [
    {
        id: 'speed',
        name: 'Speed First',
        detail: 'Lead with velocity from first draft to final prompt.',
        hero: 'Ship stronger prompts without slowing your team down.',
        sub: 'One workspace for drafting, templating, and evaluation so teams move from idea to reliable output quickly.',
        fit: { builders: 3, managers: 2, buyers: 1 },
        angle: 'Highlights the 5-minute time-to-value story.',
    },
    {
        id: 'quality',
        name: 'Quality First',
        detail: 'Lead with side-by-side evaluation and version confidence.',
        hero: 'Make prompt quality decisions you can defend.',
        sub: 'Compare variants, keep version history, and choose the best output with less subjective debate.',
        fit: { builders: 2, managers: 2, buyers: 3 },
        angle: 'Emphasizes trustworthy outcomes and decision rigor.',
    },
    {
        id: 'team',
        name: 'Team First',
        detail: 'Lead with shared templates and onboarding clarity.',
        hero: 'Give every teammate the same high-quality starting point.',
        sub: 'Turn proven prompts into reusable templates so new contributors can execute without guesswork.',
        fit: { builders: 1, managers: 3, buyers: 2 },
        angle: 'Frames PromptFolio as an enablement system, not just a tool.',
    },
];

const PROOF_OPTIONS = [
    {
        id: 'interactive',
        name: 'Interactive Proof',
        detail: 'Use micro-demos that show template filling and comparison flow.',
        sections: ['Live editor glimpse', 'Template variable interaction', 'Arena side-by-side preview'],
        fit: { builders: 3, managers: 2, buyers: 1 },
        angle: 'Best when your audience wants to feel the product quickly.',
    },
    {
        id: 'outcomes',
        name: 'Outcome Proof',
        detail: 'Use success metrics and before/after examples.',
        sections: ['Before vs after prompt quality', 'Cycle-time improvement stat', 'Decision speed improvement'],
        fit: { builders: 2, managers: 2, buyers: 3 },
        angle: 'Best when you need business confidence signals.',
    },
    {
        id: 'workflow',
        name: 'Workflow Proof',
        detail: 'Use a clear 3-step process and role clarity.',
        sections: ['Write in focused editor', 'Reuse with templates', 'Validate in Arena'],
        fit: { builders: 2, managers: 3, buyers: 1 },
        angle: 'Best when onboarding and consistency are key concerns.',
    },
];

const CTA_OPTIONS = [
    {
        id: 'direct',
        name: 'Direct CTA',
        detail: 'Push immediate entry into the app experience.',
        primary: 'Open PromptFolio',
        secondary: 'Create First Prompt',
        fit: { builders: 3, managers: 1, buyers: 1 },
        angle: 'Strong for self-serve exploration.',
    },
    {
        id: 'guided',
        name: 'Guided CTA',
        detail: 'Offer structured onboarding as the first action.',
        primary: 'Start Guided Setup',
        secondary: 'See 5 Minute Tour',
        fit: { builders: 1, managers: 3, buyers: 2 },
        angle: 'Reduces friction for teams adopting a new process.',
    },
    {
        id: 'compare',
        name: 'Evaluation CTA',
        detail: 'Invite visitors to test quality decisions immediately.',
        primary: 'Run an Arena Test',
        secondary: 'View Prompt Examples',
        fit: { builders: 2, managers: 2, buyers: 3 },
        angle: 'Positions your product around confidence, not only speed.',
    },
];

function useTokens() {
    const { theme } = useTheme();
    const dk = theme === 'dark';

    return {
        dk,
        pageBg: dk
            ? 'linear-gradient(160deg, #06101a 0%, #0b1520 45%, #111827 100%)'
            : 'linear-gradient(160deg, #f6fbff 0%, #edf4ff 45%, #fff7ed 100%)',
        overlayA: dk ? 'rgba(14, 165, 233, 0.16)' : 'rgba(2, 132, 199, 0.13)',
        overlayB: dk ? 'rgba(245, 158, 11, 0.1)' : 'rgba(217, 119, 6, 0.09)',
        text: dk ? '#e2e8f0' : '#0f172a',
        muted: dk ? 'rgba(226,232,240,0.63)' : 'rgba(15,23,42,0.58)',
        faint: dk ? 'rgba(226,232,240,0.35)' : 'rgba(15,23,42,0.34)',
        panel: dk ? 'rgba(6, 14, 24, 0.68)' : 'rgba(255, 255, 255, 0.82)',
        panelStrong: dk ? 'rgba(7, 16, 28, 0.88)' : 'rgba(255, 255, 255, 0.92)',
        panelBorder: dk ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.2)',
        panelBorderSoft: dk ? 'rgba(148, 163, 184, 0.24)' : 'rgba(100, 116, 139, 0.22)',
        accent: dk ? '#38bdf8' : '#0369a1',
        accentSoft: dk ? 'rgba(56, 189, 248, 0.18)' : 'rgba(2, 132, 199, 0.12)',
        warm: dk ? '#f59e0b' : '#b45309',
        success: dk ? '#34d399' : '#059669',
        scoreTrack: dk ? 'rgba(148,163,184,0.22)' : 'rgba(100,116,139,0.24)',
        badgeBg: dk ? 'rgba(56,189,248,0.13)' : 'rgba(2,132,199,0.09)',
        actionBg: dk ? '#0284c7' : '#0369a1',
        actionText: '#ffffff',
    };
}

function scoreLabel(score) {
    if (score >= 80) return 'Strong fit';
    if (score >= 60) return 'Good fit';
    return 'Exploratory fit';
}

function pickRandomId(options) {
    return options[Math.floor(Math.random() * options.length)].id;
}

export function AltHome4() {
    const tk = useTokens();
    const [audienceId, setAudienceId] = useState(AUDIENCES[0].id);
    const [promiseId, setPromiseId] = useState(PROMISE_OPTIONS[1].id);
    const [proofId, setProofId] = useState(PROOF_OPTIONS[2].id);
    const [ctaId, setCtaId] = useState(CTA_OPTIONS[2].id);

    const audience = useMemo(
        () => AUDIENCES.find(item => item.id === audienceId) ?? AUDIENCES[0],
        [audienceId]
    );
    const promise = useMemo(
        () => PROMISE_OPTIONS.find(item => item.id === promiseId) ?? PROMISE_OPTIONS[0],
        [promiseId]
    );
    const proof = useMemo(
        () => PROOF_OPTIONS.find(item => item.id === proofId) ?? PROOF_OPTIONS[0],
        [proofId]
    );
    const cta = useMemo(
        () => CTA_OPTIONS.find(item => item.id === ctaId) ?? CTA_OPTIONS[0],
        [ctaId]
    );

    const score = useMemo(() => {
        const total = promise.fit[audience.id] + proof.fit[audience.id] + cta.fit[audience.id];
        return Math.round((total / 9) * 100);
    }, [audience.id, cta, proof, promise]);

    const blueprint = useMemo(
        () => [
            `Hero angle: ${promise.name}`,
            `Proof focus: ${proof.name}`,
            `Section order: ${proof.sections.join(' -> ')}`,
            `CTA style: ${cta.name}`,
        ],
        [cta.name, proof.name, proof.sections, promise.name]
    );

    const rationale = useMemo(
        () => [
            promise.angle,
            proof.angle,
            cta.angle,
            `${audience.label} alignment score is ${score} out of 100.`,
        ],
        [audience.label, cta.angle, proof.angle, promise.angle, score]
    );

    const onShuffle = () => {
        setPromiseId(pickRandomId(PROMISE_OPTIONS));
        setProofId(pickRandomId(PROOF_OPTIONS));
        setCtaId(pickRandomId(CTA_OPTIONS));
    };

    return (
        <div
            className="relative min-h-screen overflow-hidden"
            style={{ background: tk.pageBg, color: tk.text, transition: 'background 0.3s, color 0.3s' }}
        >
            <style>{`
                @keyframes alt4Rise {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes alt4Shimmer {
                    0% { transform: translateX(-120%); }
                    100% { transform: translateX(160%); }
                }
            `}</style>

            <div
                className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full blur-3xl"
                style={{ background: tk.overlayA }}
            />
            <div
                className="pointer-events-none absolute -right-24 bottom-16 h-72 w-72 rounded-full blur-3xl"
                style={{ background: tk.overlayB }}
            />

            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-14">
                <header className="pt-2 pb-8">
                    <div
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs tracking-[0.16em] uppercase"
                        style={{
                            fontFamily: 'IBM Plex Mono, monospace',
                            background: tk.badgeBg,
                            border: `1px solid ${tk.panelBorder}`,
                            color: tk.accent,
                        }}
                    >
                        <Layers3 size={13} />
                        Alt 4: Direction Lab
                    </div>
                    <div className="mt-4">
                        <h1
                            className="text-4xl md:text-5xl leading-[1.02]"
                            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
                        >
                            Plan your final landing page with a concrete message blueprint.
                        </h1>
                        <p className="mt-4 max-w-3xl text-base leading-relaxed" style={{ color: tk.muted }}>
                            This variation is intentionally built as a planning surface. Choose audience, value
                            promise, proof format, and CTA style to pressure-test different directions before you
                            lock your final homepage design.
                        </p>
                    </div>
                </header>

                <section className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
                    <div className="space-y-5">
                        <article
                            className="rounded-2xl p-5"
                            style={{
                                background: tk.panel,
                                border: `1px solid ${tk.panelBorder}`,
                                backdropFilter: 'blur(6px)',
                                animation: 'alt4Rise 360ms ease both',
                            }}
                        >
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                    <Target size={14} style={{ color: tk.accent }} />
                                    <h2
                                        className="text-sm uppercase tracking-[0.14em]"
                                        style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accent }}
                                    >
                                        Audience Priority
                                    </h2>
                                </div>
                                <button
                                    onClick={onShuffle}
                                    className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs"
                                    style={{
                                        fontFamily: 'IBM Plex Mono, monospace',
                                        border: `1px solid ${tk.panelBorderSoft}`,
                                        color: tk.muted,
                                        background: tk.panelStrong,
                                    }}
                                >
                                    <RefreshCw size={12} />
                                    shuffle direction
                                </button>
                            </div>
                            <div className="grid gap-3 md:grid-cols-3">
                                {AUDIENCES.map(item => {
                                    const active = audienceId === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setAudienceId(item.id)}
                                            className="rounded-xl p-3 text-left transition-all"
                                            style={{
                                                border: active
                                                    ? `1px solid ${tk.accent}`
                                                    : `1px solid ${tk.panelBorderSoft}`,
                                                background: active ? tk.accentSoft : tk.panelStrong,
                                            }}
                                        >
                                            <p
                                                className="text-sm font-semibold"
                                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                            >
                                                {item.label}
                                            </p>
                                            <p className="mt-1 text-xs leading-relaxed" style={{ color: tk.muted }}>
                                                {item.detail}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </article>

                        <article
                            className="rounded-2xl p-5"
                            style={{
                                background: tk.panel,
                                border: `1px solid ${tk.panelBorderSoft}`,
                                backdropFilter: 'blur(6px)',
                                animation: 'alt4Rise 460ms ease both',
                            }}
                        >
                            <h2
                                className="text-sm uppercase tracking-[0.14em] mb-3"
                                style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accent }}
                            >
                                1) Value Promise
                            </h2>
                            <div className="space-y-2.5">
                                {PROMISE_OPTIONS.map(item => {
                                    const active = promiseId === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setPromiseId(item.id)}
                                            className="w-full rounded-xl p-3 text-left"
                                            style={{
                                                border: active
                                                    ? `1px solid ${tk.accent}`
                                                    : `1px solid ${tk.panelBorderSoft}`,
                                                background: active ? tk.accentSoft : tk.panelStrong,
                                            }}
                                        >
                                            <p
                                                className="text-base font-semibold"
                                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                            >
                                                {item.name}
                                            </p>
                                            <p className="text-sm mt-1" style={{ color: tk.muted }}>
                                                {item.detail}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </article>

                        <article
                            className="rounded-2xl p-5"
                            style={{
                                background: tk.panel,
                                border: `1px solid ${tk.panelBorderSoft}`,
                                backdropFilter: 'blur(6px)',
                                animation: 'alt4Rise 560ms ease both',
                            }}
                        >
                            <h2
                                className="text-sm uppercase tracking-[0.14em] mb-3"
                                style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accent }}
                            >
                                2) Proof Strategy
                            </h2>
                            <div className="space-y-2.5">
                                {PROOF_OPTIONS.map(item => {
                                    const active = proofId === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setProofId(item.id)}
                                            className="w-full rounded-xl p-3 text-left"
                                            style={{
                                                border: active
                                                    ? `1px solid ${tk.accent}`
                                                    : `1px solid ${tk.panelBorderSoft}`,
                                                background: active ? tk.accentSoft : tk.panelStrong,
                                            }}
                                        >
                                            <p
                                                className="text-base font-semibold"
                                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                            >
                                                {item.name}
                                            </p>
                                            <p className="text-sm mt-1" style={{ color: tk.muted }}>
                                                {item.detail}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </article>

                        <article
                            className="rounded-2xl p-5"
                            style={{
                                background: tk.panel,
                                border: `1px solid ${tk.panelBorderSoft}`,
                                backdropFilter: 'blur(6px)',
                                animation: 'alt4Rise 660ms ease both',
                            }}
                        >
                            <h2
                                className="text-sm uppercase tracking-[0.14em] mb-3"
                                style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accent }}
                            >
                                3) CTA Style
                            </h2>
                            <div className="space-y-2.5">
                                {CTA_OPTIONS.map(item => {
                                    const active = ctaId === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setCtaId(item.id)}
                                            className="w-full rounded-xl p-3 text-left"
                                            style={{
                                                border: active
                                                    ? `1px solid ${tk.accent}`
                                                    : `1px solid ${tk.panelBorderSoft}`,
                                                background: active ? tk.accentSoft : tk.panelStrong,
                                            }}
                                        >
                                            <p
                                                className="text-base font-semibold"
                                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                            >
                                                {item.name}
                                            </p>
                                            <p className="text-sm mt-1" style={{ color: tk.muted }}>
                                                {item.detail}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </article>
                    </div>

                    <aside className="lg:sticky lg:top-6 h-fit">
                        <article
                            className="rounded-2xl p-5 md:p-6 overflow-hidden relative"
                            style={{
                                background: tk.panelStrong,
                                border: `1px solid ${tk.panelBorder}`,
                                boxShadow: tk.dk
                                    ? '0 24px 56px rgba(2, 6, 23, 0.55)'
                                    : '0 24px 56px rgba(15, 23, 42, 0.15)',
                                animation: 'alt4Rise 420ms ease both',
                            }}
                        >
                            <div
                                className="pointer-events-none absolute top-0 left-0 h-[2px] w-full overflow-hidden"
                                style={{ background: tk.scoreTrack }}
                            >
                                <span
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        width: `${score}%`,
                                        height: '100%',
                                        background: `linear-gradient(90deg, ${tk.accent}, ${tk.warm})`,
                                        transition: 'width 280ms ease',
                                    }}
                                />
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        width: '25%',
                                        height: '100%',
                                        background: 'rgba(255,255,255,0.28)',
                                        filter: 'blur(2px)',
                                        animation: 'alt4Shimmer 1800ms linear infinite',
                                    }}
                                />
                            </div>

                            <div className="flex items-start justify-between gap-3 mb-5">
                                <div>
                                    <p
                                        className="text-xs uppercase tracking-[0.16em]"
                                        style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accent }}
                                    >
                                        Recommended Draft Direction
                                    </p>
                                    <p className="text-sm mt-1" style={{ color: tk.muted }}>
                                        {scoreLabel(score)} for {audience.label.toLowerCase()}
                                    </p>
                                </div>
                                <div
                                    className="rounded-xl px-3 py-2 text-right"
                                    style={{
                                        border: `1px solid ${tk.panelBorder}`,
                                        background: tk.badgeBg,
                                    }}
                                >
                                    <p className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                        {score}
                                    </p>
                                    <p
                                        className="text-[11px] uppercase tracking-[0.12em]"
                                        style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.faint }}
                                    >
                                        direction score
                                    </p>
                                </div>
                            </div>

                            <div
                                className="rounded-xl p-4"
                                style={{ border: `1px solid ${tk.panelBorderSoft}`, background: tk.panel }}
                            >
                                <p
                                    className="text-xs uppercase tracking-[0.13em]"
                                    style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.warm }}
                                >
                                    Hero Preview
                                </p>
                                <h2
                                    className="mt-2 text-3xl leading-[1.08]"
                                    style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
                                >
                                    {promise.hero}
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed" style={{ color: tk.muted }}>
                                    {promise.sub}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2.5">
                                    <Link
                                        to="/app"
                                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
                                        style={{
                                            fontFamily: 'Space Grotesk, sans-serif',
                                            background: tk.actionBg,
                                            color: tk.actionText,
                                        }}
                                    >
                                        {cta.primary}
                                        <ArrowRight size={15} />
                                    </Link>
                                    <Link
                                        to="/new"
                                        className="inline-flex items-center rounded-lg px-4 py-2 text-sm"
                                        style={{
                                            fontFamily: 'Space Grotesk, sans-serif',
                                            border: `1px solid ${tk.panelBorderSoft}`,
                                            color: tk.text,
                                        }}
                                    >
                                        {cta.secondary}
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <div
                                    className="rounded-xl p-4"
                                    style={{ border: `1px solid ${tk.panelBorderSoft}`, background: tk.panel }}
                                >
                                    <p
                                        className="text-xs uppercase tracking-[0.12em] mb-2"
                                        style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accent }}
                                    >
                                        Section Blueprint
                                    </p>
                                    {blueprint.map(item => (
                                        <p key={item} className="text-sm leading-relaxed" style={{ color: tk.muted }}>
                                            {item}
                                        </p>
                                    ))}
                                </div>

                                <div
                                    className="rounded-xl p-4"
                                    style={{ border: `1px solid ${tk.panelBorderSoft}`, background: tk.panel }}
                                >
                                    <p
                                        className="text-xs uppercase tracking-[0.12em] mb-2"
                                        style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accent }}
                                    >
                                        Why This Direction
                                    </p>
                                    {rationale.map(item => (
                                        <div key={item} className="flex items-start gap-2 mb-2">
                                            <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: tk.success }} />
                                            <p className="text-sm leading-relaxed" style={{ color: tk.muted }}>
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-5 rounded-xl p-4" style={{ border: `1px solid ${tk.panelBorderSoft}` }}>
                                <p
                                    className="text-xs uppercase tracking-[0.14em]"
                                    style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accent }}
                                >
                                    Final build recommendation
                                </p>
                                <p className="mt-2 text-sm leading-relaxed" style={{ color: tk.muted }}>
                                    Use this output as your page brief: keep the selected hero promise, mirror the
                                    section order, and keep only one primary CTA style. This avoids mixed messaging in
                                    the final landing page.
                                </p>
                                <div className="mt-3 inline-flex items-center gap-2 text-sm" style={{ color: tk.warm }}>
                                    <Sparkles size={14} />
                                    current mode: {promise.name} + {proof.name} + {cta.name}
                                </div>
                            </div>
                        </article>
                    </aside>
                </section>
            </div>
        </div>
    );
}
