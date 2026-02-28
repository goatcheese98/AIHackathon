import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Feather,
    Layers,
    GitCompare,
    History,
    Sparkles,
    Zap,
    Copy,
    Check,
    ChevronRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ── Philosophy-driven content ─────────────────────────────────────────────────

const PILLARS = [
    {
        id: 'clarity',
        icon: Feather,
        title: 'Clarity First',
        desc: 'Every prompt lives in a clean, focused space. No tabs fighting for attention. No overwhelming options. Just you and your words.',
        color: 'blue',
    },
    {
        id: 'reuse',
        icon: Layers,
        title: 'Build Once, Use Forever',
        desc: 'Turn any prompt into a reusable template with {{variables}}. Share with your team. Stop rewriting the same prompts.',
        color: 'violet',
    },
    {
        id: 'compare',
        icon: GitCompare,
        title: 'Compare to Improve',
        desc: 'Unsure which version works better? Run them side-by-side in the Arena. Let the results speak for themselves.',
        color: 'amber',
    },
    {
        id: 'remember',
        icon: History,
        title: 'Never Lose a Good Idea',
        desc: 'Every change is saved automatically. Browse your history. Restore any version. Your best prompts are always one click away.',
        color: 'emerald',
    },
];

const QUICK_ACTIONS = [
    { label: 'Write a prompt', path: '/new', desc: 'Start from scratch' },
    { label: 'Browse templates', path: '/templates', desc: 'Jumpstart with examples' },
    { label: 'Open library', path: '/app', desc: 'See all your prompts' },
];

// ── Theme tokens ──────────────────────────────────────────────────────────────

function useTokens() {
    const { theme } = useTheme();
    const dk = theme === 'dark';

    return {
        dk,

        // Page
        pageBg: dk ? '#0c0c0d' : '#fafaf9',
        pageColor: dk ? '#fafaf9' : '#1c1917',

        // Muted text
        textMuted: dk ? 'rgba(250,250,249,0.55)' : 'rgba(28,25,23,0.55)',
        textFaint: dk ? 'rgba(250,250,249,0.35)' : 'rgba(28,25,23,0.35)',

        // Surfaces
        surface: dk ? '#18181b' : '#ffffff',
        surfaceElevated: dk ? '#27272a' : '#f5f5f4',
        surfaceSubtle: dk ? '#232326' : '#f5f5f4',

        // Borders
        border: dk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        borderStrong: dk ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)',

        // Accent (warm stone/terracotta feel)
        accent: dk ? '#fb923c' : '#ea580c',
        accentSoft: dk ? 'rgba(251,146,60,0.12)' : 'rgba(234,88,12,0.08)',
        accentGlow: dk ? 'rgba(251,146,60,0.25)' : 'rgba(234,88,12,0.2)',

        // Pillar colors
        pillarBlue: dk ? '#60a5fa' : '#2563eb',
        pillarViolet: dk ? '#a78bfa' : '#7c3aed',
        pillarAmber: dk ? '#fbbf24' : '#d97706',
        pillarEmerald: dk ? '#34d399' : '#059669',

        // CTA
        ctaBg: dk ? '#fb923c' : '#ea580c',
        ctaColor: '#ffffff',
        ctaHover: dk ? '#fdba74' : '#c2410c',

        // Demo
        demoBg: dk ? '#0f0f10' : '#ffffff',
        demoBorder: dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        demoVar: dk ? '#fb923c' : '#ea580c',
        demoVarBg: dk ? 'rgba(251,146,60,0.15)' : 'rgba(234,88,12,0.1)',
    };
}

// ── Interactive demo component ────────────────────────────────────────────────

function PromptDemo() {
    const tk = useTokens();
    const [copied, setCopied] = useState(false);
    const [hoveredVar, setHoveredVar] = useState(null);

    const promptText = 'Write a {{tone}} email to {{recipient}} about {{topic}}';
    const variables = [
        { key: 'tone', value: 'friendly', desc: 'professional, casual, excited...' },
        { key: 'recipient', value: 'the team', desc: 'customer, manager, client...' },
        { key: 'topic', value: 'our launch', desc: 'product update, meeting, feedback...' },
    ];

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderPrompt = () => {
        const parts = promptText.split(/({{[^}]+}})/g);
        return parts.map((part, i) => {
            const match = part.match(/{{([^}]+)}}/);
            if (match) {
                const varName = match[1];
                const isHovered = hoveredVar === varName;
                return (
                    <span
                        key={i}
                        className="cursor-pointer transition-all duration-200 rounded px-1.5 py-0.5"
                        style={{
                            color: tk.demoVar,
                            background: isHovered ? tk.demoVarBg : 'transparent',
                        }}
                        onMouseEnter={() => setHoveredVar(varName)}
                        onMouseLeave={() => setHoveredVar(null)}
                    >
                        {part}
                    </span>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div
            className="rounded-2xl overflow-hidden border shadow-2xl"
            style={{
                background: tk.demoBg,
                borderColor: tk.demoBorder,
                boxShadow: tk.dk
                    ? '0 25px 50px -12px rgba(0,0,0,0.7)'
                    : '0 25px 50px -12px rgba(0,0,0,0.15)',
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: `1px solid ${tk.demoBorder}` }}
            >
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                </div>
                <span style={{ color: tk.textFaint }} className="text-xs font-medium">
                    template.md
                </span>
            </div>

            {/* Prompt display */}
            <div className="p-6">
                <div
                    className="text-lg leading-relaxed font-medium mb-6"
                    style={{ color: tk.pageColor, fontFamily: 'system-ui, sans-serif' }}
                >
                    {renderPrompt()}
                </div>

                {/* Variable inputs */}
                <div className="space-y-3">
                    {variables.map((v) => (
                        <div
                            key={v.key}
                            className="flex items-center gap-3 transition-opacity duration-200"
                            style={{
                                opacity: hoveredVar && hoveredVar !== v.key ? 0.4 : 1,
                            }}
                            onMouseEnter={() => setHoveredVar(v.key)}
                            onMouseLeave={() => setHoveredVar(null)}
                        >
                            <span
                                className="text-xs font-mono uppercase w-24 shrink-0"
                                style={{ color: tk.textFaint }}
                            >
                                {v.key}
                            </span>
                            <div
                                className="flex-1 px-3 py-2 rounded-lg text-sm border transition-all duration-200"
                                style={{
                                    background: tk.surfaceElevated,
                                    borderColor: hoveredVar === v.key ? tk.accent : tk.border,
                                    color: tk.pageColor,
                                }}
                            >
                                {v.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action bar */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles size={14} style={{ color: tk.accent }} />
                        <span className="text-xs" style={{ color: tk.textMuted }}>
                            3 variables · reusable
                        </span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                        style={{
                            background: copied ? '#22c55e' : tk.accent,
                            color: '#ffffff',
                        }}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Use Template'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Pillar card component ─────────────────────────────────────────────────────

function PillarCard({ pillar, index }) {
    const tk = useTokens();
    const Icon = pillar.icon;

    const colors = {
        blue: { bg: tk.dk ? 'rgba(96,165,250,0.1)' : 'rgba(37,99,235,0.08)', icon: tk.pillarBlue },
        violet: { bg: tk.dk ? 'rgba(167,139,250,0.1)' : 'rgba(124,58,237,0.08)', icon: tk.pillarViolet },
        amber: { bg: tk.dk ? 'rgba(251,191,36,0.1)' : 'rgba(217,119,6,0.08)', icon: tk.pillarAmber },
        emerald: { bg: tk.dk ? 'rgba(52,211,153,0.1)' : 'rgba(5,150,105,0.08)', icon: tk.pillarEmerald },
    };

    const color = colors[pillar.color];

    return (
        <div
            className="group relative p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
            style={{
                background: tk.surface,
                borderColor: tk.border,
            }}
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: color.bg }}
            >
                <Icon size={22} style={{ color: color.icon }} />
            </div>

            <h3
                className="text-lg font-semibold mb-2"
                style={{ color: tk.pageColor }}
            >
                {pillar.title}
            </h3>

            <p
                className="text-sm leading-relaxed"
                style={{ color: tk.textMuted }}
            >
                {pillar.desc}
            </p>

            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `linear-gradient(135deg, ${color.bg} 0%, transparent 60%)`,
                }}
            />
        </div>
    );
}

// ── Main page component ───────────────────────────────────────────────────────

export function AltHome7() {
    const tk = useTokens();

    return (
        <div
            className="min-h-screen"
            style={{
                background: tk.pageBg,
                color: tk.pageColor,
            }}
        >
            {/* ── Navigation ───────────────────────────────────────── */}
            <header className="mx-auto max-w-6xl px-6 py-6">
                <nav className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity"
                    >
                        <Zap size={20} style={{ color: tk.accent }} />
                        PromptFolio
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            to="/templates"
                            className="text-sm font-medium hover:opacity-70 transition-opacity hidden sm:block"
                            style={{ color: tk.textMuted }}
                        >
                            Templates
                        </Link>
                        <Link
                            to="/arena"
                            className="text-sm font-medium hover:opacity-70 transition-opacity hidden sm:block"
                            style={{ color: tk.textMuted }}
                        >
                            Arena
                        </Link>
                        <Link
                            to="/app"
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                            style={{
                                background: tk.accent,
                                color: tk.ctaColor,
                            }}
                        >
                            Open App
                        </Link>
                    </div>
                </nav>
            </header>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="mx-auto max-w-6xl px-6 pt-12 pb-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Copy */}
                    <div>
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                            style={{
                                background: tk.accentSoft,
                                color: tk.accent,
                            }}
                        >
                            <Sparkles size={12} />
                            Simple prompt management
                        </div>

                        <h1
                            className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6"
                            style={{ color: tk.pageColor }}
                        >
                            Your prompts,
                            <br />
                            <span style={{ color: tk.textMuted }}>organized.</span>
                        </h1>

                        <p
                            className="text-lg leading-relaxed mb-8 max-w-md"
                            style={{ color: tk.textMuted }}
                        >
                            A calm, focused space to write, save, and reuse your AI prompts. 
                            No clutter. No complexity. Just the tools you need.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/new"
                                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                                style={{
                                    background: tk.ctaBg,
                                    color: tk.ctaColor,
                                }}
                            >
                                Create a Prompt
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                to="/templates"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:opacity-80"
                                style={{
                                    border: `1px solid ${tk.borderStrong}`,
                                    color: tk.pageColor,
                                }}
                            >
                                Browse Templates
                            </Link>
                        </div>

                        {/* Quick actions */}
                        <div className="mt-10 pt-8" style={{ borderTop: `1px solid ${tk.border}` }}>
                            <p
                                className="text-xs uppercase tracking-wider mb-4 font-medium"
                                style={{ color: tk.textFaint }}
                            >
                                Quick start
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {QUICK_ACTIONS.map((action) => (
                                    <Link
                                        key={action.path}
                                        to={action.path}
                                        className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
                                        style={{
                                            background: tk.surfaceElevated,
                                            color: tk.pageColor,
                                        }}
                                    >
                                        {action.label}
                                        <ChevronRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" style={{ color: tk.accent }} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Demo */}
                    <div className="relative">
                        {/* Decorative elements */}
                        <div
                            className="absolute -top-8 -right-8 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
                            style={{ background: tk.accent }}
                        />
                        <div
                            className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                            style={{ background: tk.pillarViolet }}
                        />

                        <div className="relative">
                            <PromptDemo />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Philosophy Pillars ───────────────────────────────── */}
            <section
                className="py-20"
                style={{ background: tk.dk ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
            >
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-12">
                        <h2
                            className="text-2xl sm:text-3xl font-semibold mb-3"
                            style={{ color: tk.pageColor }}
                        >
                            Built for focus
                        </h2>
                        <p
                            className="text-base max-w-lg mx-auto"
                            style={{ color: tk.textMuted }}
                        >
                            Four principles that guide every decision we make
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {PILLARS.map((pillar, i) => (
                            <PillarCard key={pillar.id} pillar={pillar} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Simplicity Statement ─────────────────────────────── */}
            <section className="mx-auto max-w-6xl px-6 py-20">
                <div
                    className="rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden"
                    style={{
                        background: tk.surface,
                        border: `1px solid ${tk.border}`,
                    }}
                >
                    {/* Background decoration */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse at top, ${tk.accentSoft} 0%, transparent 60%)`,
                        }}
                    />

                    <div className="relative">
                        <h2
                            className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 tracking-tight"
                            style={{ color: tk.pageColor }}
                        >
                            Less noise.
                            <br />
                            More clarity.
                        </h2>

                        <p
                            className="text-lg max-w-xl mx-auto mb-8"
                            style={{ color: tk.textMuted }}
                        >
                            We believe the best tools get out of your way. PromptFolio is designed 
                            to be invisible when you need focus and helpful when you need guidance.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/app"
                                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
                                style={{
                                    background: tk.ctaBg,
                                    color: tk.ctaColor,
                                }}
                            >
                                Start Writing
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <p
                            className="mt-6 text-xs"
                            style={{ color: tk.textFaint }}
                        >
                            Free to use. No account required.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────── */}
            <footer
                className="mx-auto max-w-6xl px-6 py-8"
                style={{ borderTop: `1px solid ${tk.border}` }}
            >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Zap size={16} style={{ color: tk.accent }} />
                        <span className="text-sm font-medium" style={{ color: tk.pageColor }}>
                            PromptFolio
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            to="/templates"
                            className="text-sm hover:opacity-70 transition-opacity"
                            style={{ color: tk.textMuted }}
                        >
                            Templates
                        </Link>
                        <Link
                            to="/arena"
                            className="text-sm hover:opacity-70 transition-opacity"
                            style={{ color: tk.textMuted }}
                        >
                            Arena
                        </Link>
                        <Link
                            to="/settings"
                            className="text-sm hover:opacity-70 transition-opacity"
                            style={{ color: tk.textMuted }}
                        >
                            Settings
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
