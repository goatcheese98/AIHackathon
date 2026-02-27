import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Swords, Clock, Layers3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ── Theme tokens ──────────────────────────────────────────────────────────────

function useTokens() {
    const { theme } = useTheme();
    const dk = theme === 'dark';

    return {
        dk,

        // Page base
        pageBg:    dk ? '#140c0b' : '#fdf7f6',
        pageColor: dk ? '#faf4f3' : '#1c0a08',

        // Card surfaces
        cardBg:       dk ? '#1f1211' : '#ffffff',
        cardBgWarm:   dk ? '#1a0f0e' : '#fff5f3',
        cardBgSubtle: dk ? '#191010' : '#fef2f1',

        // Borders
        cardBorder:   dk ? 'rgba(251,113,133,0.14)' : 'rgba(225,29,72,0.1)',
        divider:      dk ? 'rgba(251,113,133,0.1)'  : 'rgba(225,29,72,0.08)',

        // Rose accent (primary)
        accent:       dk ? '#fb7185' : '#e11d48',
        accentSoft:   dk ? 'rgba(251,113,133,0.14)' : 'rgba(225,29,72,0.08)',
        accentSofter: dk ? 'rgba(251,113,133,0.07)' : 'rgba(225,29,72,0.04)',
        accentText:   dk ? '#fb7185' : '#be123c',

        // Amber (secondary accent — for variables)
        varColor: dk ? '#fbbf24' : '#b45309',
        varBg:    dk ? 'rgba(251,191,36,0.14)' : 'rgba(180,83,9,0.08)',

        // Text
        textMuted: dk ? 'rgba(250,244,243,0.55)' : 'rgba(28,10,8,0.52)',
        textFaint: dk ? 'rgba(250,244,243,0.32)' : 'rgba(28,10,8,0.3)',

        // Primary CTA button
        btnBg:     dk ? '#fb7185' : '#e11d48',
        btnColor:  '#ffffff',
        btnShadow: dk
            ? '0 8px 28px rgba(251,113,133,0.32)'
            : '0 8px 28px rgba(225,29,72,0.24)',

        // Secondary button
        btnSecBorder: dk ? 'rgba(250,244,243,0.16)' : 'rgba(28,10,8,0.14)',
        btnSecColor:  dk ? 'rgba(250,244,243,0.78)' : 'rgba(28,10,8,0.72)',
        btnSecHover:  dk ? 'hover:bg-white/5'        : 'hover:bg-black/5',

        // Arena mockup boxes
        arenaBoxBg:     dk ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        arenaBoxBorder: dk ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)',

        // Library card items
        libItemBg:     dk ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        libItemBorder: dk ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',

        // History timeline
        timelineDot:      dk ? '#fb7185' : '#e11d48',
        timelineDotDim:   dk ? 'rgba(250,244,243,0.2)' : 'rgba(28,10,8,0.18)',
        timelineLine:     dk ? 'rgba(251,113,133,0.18)' : 'rgba(225,29,72,0.15)',
    };
}

// ── Template card — interactive variable fill ─────────────────────────────────

const TEMPLATE_PARTS_EMPTY = [
    { text: 'Write a ',               isVar: false },
    { text: '{{tone}}',               isVar: true,  filled: 'friendly'          },
    { text: ' email about ',          isVar: false },
    { text: '{{topic}}',              isVar: true,  filled: 'our Q4 launch'     },
    { text: ' for ',                  isVar: false },
    { text: '{{audience}}',           isVar: true,  filled: 'enterprise clients' },
];

function TemplateCard({ tk }) {
    const [filled, setFilled] = useState(false);

    return (
        <div
            className="md:col-span-2 rounded-3xl p-6 flex flex-col"
            style={{
                background: tk.cardBg,
                border: `1px solid ${tk.cardBorder}`,
                cursor: 'default',
                transition: 'background 0.3s, border-color 0.3s',
            }}
            onMouseEnter={() => setFilled(true)}
            onMouseLeave={() => setFilled(false)}
            onClick={() => setFilled(f => !f)}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <Layers3 size={14} style={{ color: tk.accentText }} />
                    <span
                        className="text-xs uppercase tracking-widest"
                        style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accentText }}
                    >
                        Templates
                    </span>
                </div>
                <span
                    className="text-xs rounded-full px-2.5 py-1"
                    style={{
                        background: tk.accentSoft,
                        color: tk.accentText,
                        fontFamily: 'IBM Plex Mono, monospace',
                    }}
                >
                    {filled ? 'filled ✓' : 'hover to fill'}
                </span>
            </div>

            {/* Prompt preview */}
            <div
                className="rounded-2xl p-4 flex-1"
                style={{
                    background: tk.accentSofter,
                    border: `1px solid ${tk.divider}`,
                }}
            >
                <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.pageColor }}
                >
                    {TEMPLATE_PARTS_EMPTY.map((part, i) =>
                        part.isVar ? (
                            <span
                                key={i}
                                style={{
                                    color:        tk.varColor,
                                    background:   tk.varBg,
                                    borderRadius: '4px',
                                    padding:      '1px 5px',
                                    transition:   'all 0.2s',
                                    display:      'inline-block',
                                }}
                            >
                                {filled ? part.filled : part.text}
                            </span>
                        ) : (
                            <span key={i}>{part.text}</span>
                        )
                    )}
                </p>
            </div>

            {/* Variable legend */}
            <div className="mt-4 space-y-2">
                {TEMPLATE_PARTS_EMPTY.filter(p => p.isVar).map((v, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                        <span
                            className="text-xs w-28 shrink-0"
                            style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.varColor }}
                        >
                            {v.text}
                        </span>
                        <span className="text-xs" style={{ color: tk.textFaint }}>→</span>
                        <span
                            className="text-xs truncate"
                            style={{
                                fontFamily: 'IBM Plex Mono, monospace',
                                color:      filled ? tk.pageColor : tk.textFaint,
                                transition: 'color 0.25s',
                            }}
                        >
                            {v.filled}
                        </span>
                    </div>
                ))}
            </div>

            <p
                className="mt-5 text-sm font-semibold"
                style={{ fontFamily: 'Space Grotesk, sans-serif', color: tk.pageColor }}
            >
                Write once, reuse everywhere.
            </p>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function AltHome2() {
    const tk = useTokens();

    return (
        <div
            className="min-h-screen"
            style={{
                background: tk.pageBg,
                color:      tk.pageColor,
                transition: 'background 0.3s, color 0.3s',
            }}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
                <div
                    className="grid grid-cols-1 md:grid-cols-6 gap-4"
                    style={{ gridAutoRows: 'auto' }}
                >

                    {/* ── Card 1: Hero ──────────────────────────────── */}
                    <div
                        className="md:col-span-4 rounded-3xl p-8 md:p-10 flex flex-col justify-between"
                        style={{
                            background:  tk.cardBgWarm,
                            border:      `1px solid ${tk.cardBorder}`,
                            minHeight:   '320px',
                            transition:  'background 0.3s, border-color 0.3s',
                        }}
                    >
                        <div>
                            {/* Rose accent bar */}
                            <div
                                className="w-12 h-1 rounded-full mb-7"
                                style={{ background: tk.accent }}
                            />
                            <h1
                                className="text-4xl md:text-[2.8rem] font-black tracking-tight leading-[1.08] max-w-lg"
                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                            >
                                Great outputs start with great prompts.
                            </h1>
                            <p
                                className="mt-4 text-base leading-relaxed max-w-md"
                                style={{ color: tk.textMuted }}
                            >
                                Write, template, version, and compare your AI prompts — all in one workspace built for teams that care about quality.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-8">
                            <Link
                                to="/app"
                                className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold transition-all duration-200 hover:-translate-y-0.5"
                                style={{
                                    background: tk.btnBg,
                                    color:      tk.btnColor,
                                    boxShadow:  tk.btnShadow,
                                    transition: 'background 0.3s, box-shadow 0.3s, transform 0.2s',
                                }}
                            >
                                Open App
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                to="/new"
                                className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-colors ${tk.btnSecHover}`}
                                style={{
                                    border:     `1px solid ${tk.btnSecBorder}`,
                                    color:      tk.btnSecColor,
                                    transition: 'color 0.3s, border-color 0.3s',
                                }}
                            >
                                New Prompt
                            </Link>
                        </div>
                    </div>

                    {/* ── Card 2: Template (interactive) ───────────── */}
                    <TemplateCard tk={tk} />

                    {/* ── Card 3: Arena ─────────────────────────────── */}
                    <div
                        className="md:col-span-4 rounded-3xl p-7 md:p-8"
                        style={{
                            background: tk.cardBg,
                            border:     `1px solid ${tk.cardBorder}`,
                            transition: 'background 0.3s, border-color 0.3s',
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Swords size={14} style={{ color: tk.accentText }} />
                            <span
                                className="text-xs uppercase tracking-widest"
                                style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accentText }}
                            >
                                The Arena
                            </span>
                        </div>
                        <p
                            className="text-xl font-bold mb-5"
                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                            Compare two versions. Keep the best.
                        </p>

                        {/* Prompt being compared */}
                        <div
                            className="rounded-xl px-4 py-3 mb-4 text-sm"
                            style={{
                                background:   tk.accentSofter,
                                border:       `1px solid ${tk.divider}`,
                                fontFamily:   'IBM Plex Mono, monospace',
                                color:        tk.textMuted,
                            }}
                        >
                            Prompt: "Write a product intro for a B2B SaaS tool..."
                        </div>

                        {/* Two output boxes */}
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                className="rounded-xl p-4"
                                style={{
                                    background: tk.arenaBoxBg,
                                    border:     `1px solid ${tk.arenaBoxBorder}`,
                                }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className="text-xs font-bold rounded px-2 py-0.5"
                                        style={{ background: tk.accentSoft, color: tk.accentText }}
                                    >
                                        A
                                    </span>
                                    <span
                                        className="text-xs"
                                        style={{ color: tk.textFaint, fontFamily: 'IBM Plex Mono, monospace' }}
                                    >
                                        v1 — original
                                    </span>
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: tk.textMuted }}>
                                    Our product helps teams collaborate more effectively on projects by providing real-time updates and notifications...
                                </p>
                            </div>

                            <div
                                className="rounded-xl p-4"
                                style={{
                                    background: tk.arenaBoxBg,
                                    border:     `1px solid ${tk.arenaBoxBorder}`,
                                }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className="text-xs font-bold rounded px-2 py-0.5"
                                        style={{
                                            background: 'rgba(34,197,94,0.12)',
                                            color:      '#22c55e',
                                        }}
                                    >
                                        B
                                    </span>
                                    <span
                                        className="text-xs"
                                        style={{ color: tk.textFaint, fontFamily: 'IBM Plex Mono, monospace' }}
                                    >
                                        v2 — revised
                                    </span>
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: tk.textMuted }}>
                                    Ship faster with a workspace built for speed. Your team stays in sync from first commit to launch day...
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/arena"
                            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-75"
                            style={{ color: tk.accentText }}
                        >
                            Try the Arena <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* ── Card 4: History ───────────────────────────── */}
                    <div
                        className="md:col-span-2 rounded-3xl p-6"
                        style={{
                            background: tk.cardBgSubtle,
                            border:     `1px solid ${tk.cardBorder}`,
                            transition: 'background 0.3s, border-color 0.3s',
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={14} style={{ color: tk.accentText }} />
                            <span
                                className="text-xs uppercase tracking-widest"
                                style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accentText }}
                            >
                                History
                            </span>
                        </div>
                        <p
                            className="text-xl font-bold mb-6"
                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                            Never lose a version.
                        </p>

                        {/* Timeline */}
                        <div className="relative pl-5">
                            {/* Vertical line */}
                            <div
                                className="absolute left-[7px] top-2 bottom-2 w-px"
                                style={{ background: tk.timelineLine }}
                            />

                            <div className="space-y-5">
                                {[
                                    { version: 'v3', change: 'Added tone variable',  time: '2h ago',  active: true  },
                                    { version: 'v2', change: 'Shortened opening',    time: '1d ago',  active: false },
                                    { version: 'v1', change: 'Initial draft',        time: '3d ago',  active: false },
                                ].map((entry) => (
                                    <div key={entry.version} className="relative flex items-start gap-3">
                                        {/* Dot */}
                                        <div
                                            className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2"
                                            style={{
                                                background:   entry.active ? tk.timelineDot    : tk.cardBgSubtle,
                                                borderColor:  entry.active ? tk.timelineDot    : tk.timelineDotDim,
                                                transition:   'background 0.3s, border-color 0.3s',
                                            }}
                                        />
                                        <div>
                                            <p
                                                className="text-xs font-semibold"
                                                style={{ color: entry.active ? tk.pageColor : tk.textMuted }}
                                            >
                                                {entry.change}
                                            </p>
                                            <p
                                                className="text-xs mt-0.5"
                                                style={{
                                                    fontFamily: 'IBM Plex Mono, monospace',
                                                    color:      tk.textFaint,
                                                }}
                                            >
                                                {entry.version} · {entry.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p
                            className="mt-6 text-xs leading-relaxed"
                            style={{ color: tk.textMuted }}
                        >
                            Every edit is saved. Roll back any time.
                        </p>
                    </div>

                    {/* ── Card 5: Library preview ───────────────────── */}
                    <div
                        className="md:col-span-3 rounded-3xl p-7"
                        style={{
                            background: tk.cardBgWarm,
                            border:     `1px solid ${tk.cardBorder}`,
                            transition: 'background 0.3s, border-color 0.3s',
                        }}
                    >
                        <p
                            className="text-xs uppercase tracking-widest mb-5"
                            style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accentText }}
                        >
                            Your Library
                        </p>

                        <div className="space-y-2.5">
                            {[
                                { title: 'Product launch email', tag: 'Marketing', vars: 3 },
                                { title: 'Code review checklist', tag: 'Engineering', vars: 2 },
                                { title: 'Customer support reply', tag: 'Support', vars: 4 },
                                { title: 'Blog post outline', tag: 'Content', vars: 2 },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-center justify-between rounded-xl px-4 py-3"
                                    style={{
                                        background: tk.libItemBg,
                                        border:     `1px solid ${tk.libItemBorder}`,
                                    }}
                                >
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: tk.pageColor }}>
                                            {item.title}
                                        </p>
                                        <p
                                            className="text-xs mt-0.5"
                                            style={{ color: tk.textFaint, fontFamily: 'IBM Plex Mono, monospace' }}
                                        >
                                            {item.tag} · {item.vars} vars
                                        </p>
                                    </div>
                                    <div
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ background: tk.accentSoft, border: `1px solid ${tk.accentText}` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Card 6: CTA ────────────────────────────────── */}
                    <div
                        className="md:col-span-3 rounded-3xl p-8 flex flex-col justify-between"
                        style={{
                            background: tk.cardBg,
                            border:     `1px solid ${tk.cardBorder}`,
                            transition: 'background 0.3s, border-color 0.3s',
                        }}
                    >
                        {/* Big accent number */}
                        <div
                            className="text-8xl font-black leading-none select-none"
                            style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                color:      tk.accentSoft,
                                WebkitTextFillColor: 'transparent',
                                WebkitTextStroke:    `2px ${tk.accent}`,
                                opacity: 0.35,
                            }}
                        >
                            01
                        </div>

                        <div>
                            <h2
                                className="text-2xl md:text-3xl font-black leading-tight"
                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                            >
                                Your first prompt
                                <br />
                                is one click away.
                            </h2>
                            <p
                                className="mt-3 text-sm"
                                style={{ color: tk.textMuted }}
                            >
                                No setup. No account required. Open the app and start writing immediately.
                            </p>
                            <Link
                                to="/app"
                                className="group mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold transition-all duration-200 hover:-translate-y-0.5"
                                style={{
                                    background: tk.btnBg,
                                    color:      tk.btnColor,
                                    boxShadow:  tk.btnShadow,
                                    transition: 'background 0.3s, box-shadow 0.3s, transform 0.2s',
                                }}
                            >
                                Start for Free
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
