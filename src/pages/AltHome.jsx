import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ── Shared static data ────────────────────────────────────────────────────────

const PROMPTS = [
    { text: 'Summarize this article for a {{audience}} audience', vars: 1 },
    { text: 'Write a {{tone}} email about {{topic}} for {{recipient}}', vars: 3 },
    { text: 'Act as a {{role}} and review my {{artifact}}', vars: 2 },
    { text: 'Generate 5 {{format}} ideas for {{project}}', vars: 2 },
];

const FEATURES = [
    {
        num: '01',
        title: 'Write without clutter',
        desc: 'A distraction-free editor keeps every word in focus. No noise, no bloat — just you and your prompt.',
        tag: 'Editor',
    },
    {
        num: '02',
        title: 'Reuse with variables',
        desc: 'Wrap any dynamic phrase in {{double braces}}. Share templates your whole team can fill in instantly.',
        tag: 'Templates',
    },
    {
        num: '03',
        title: 'Win with comparison',
        desc: 'Send two variants into the Arena. See both outputs side-by-side and keep the one that actually works.',
        tag: 'Arena',
    },
];

// ── Theme tokens ──────────────────────────────────────────────────────────────

function useTokens() {
    const { theme } = useTheme();
    const dk = theme === 'dark';

    return {
        dk,

        // Page
        pageBg: dk
            ? 'linear-gradient(150deg, #0c0a1e 0%, #110d2e 40%, #0d1117 100%)'
            : 'linear-gradient(150deg, #f5f3ff 0%, #faf9ff 45%, #f8fafc 100%)',
        pageColor: dk ? '#ffffff' : '#1e1b4b',

        // Floating orbs
        orbA: dk ? 'rgba(139,92,246,0.22)' : 'rgba(139,92,246,0.14)',
        orbB: dk ? 'rgba(234,179,8,0.14)'  : 'rgba(217,119,6,0.10)',

        // Badge
        badgeBorder: dk ? 'rgba(139,92,246,0.38)' : 'rgba(124,58,237,0.3)',
        badgeBg:     dk ? 'rgba(139,92,246,0.1)'  : 'rgba(139,92,246,0.07)',
        badgeColor:  dk ? '#c4b5fd' : '#6d28d9',
        dotColor:    dk ? '#fde047' : '#d97706',
        dotShadow:   dk ? '0 0 6px #fde047' : '0 0 6px rgba(217,119,6,0.55)',

        // Headline
        strokeColor: '#7c3aed',

        // Body text
        subtext: dk ? 'rgba(148,163,184,0.85)' : 'rgba(51,65,85,0.72)',

        // Terminal card
        termBg:         dk ? 'rgba(10,8,25,0.93)'       : 'rgba(248,246,255,0.97)',
        termBorder:     dk ? 'rgba(139,92,246,0.35)'     : 'rgba(124,58,237,0.22)',
        termShadow:     dk
            ? '0 0 60px rgba(139,92,246,0.15), 0 25px 50px rgba(0,0,0,0.5)'
            : '0 0 40px rgba(124,58,237,0.09), 0 20px 40px rgba(0,0,0,0.09)',
        termChromeDivider: dk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        termFilename:   dk ? 'rgba(148,163,184,0.45)'    : 'rgba(100,116,139,0.55)',
        termText:       dk ? '#cbd5e1'                   : '#334155',
        termVarColor:   dk ? '#fde047'                   : '#92400e',
        termVarBg:      dk ? 'rgba(253,224,71,0.12)'     : 'rgba(146,64,14,0.08)',
        termCursor:     '#8b5cf6',
        termStatusDivider: dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        termStatusBg:   dk ? 'rgba(0,0,0,0.28)'          : 'rgba(0,0,0,0.03)',
        termStatusMeta: dk ? 'rgba(148,163,184,0.38)'    : 'rgba(100,116,139,0.5)',
        termStatusTag:  dk ? 'rgba(139,92,246,0.5)'      : 'rgba(109,40,217,0.5)',

        // Secondary CTA button
        secBorder: dk ? 'rgba(255,255,255,0.15)' : 'rgba(30,27,75,0.15)',
        secColor:  dk ? 'rgba(255,255,255,0.78)' : 'rgba(30,27,75,0.75)',
        secHover:  dk ? 'hover:bg-white/5'       : 'hover:bg-black/5',

        // Stats strip
        stripDivider: dk ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
        statFigure:   dk ? '#fde047'                : '#d97706',
        statLabel:    dk ? 'rgba(148,163,184,0.5)'  : 'rgba(100,116,139,0.6)',

        // Feature rows
        featureSectionLabel: '#7c3aed',
        featureRowDivider:   dk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        featureNum:          dk ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.13)',
        featureTitle:        dk ? '#ffffff'                : '#1e1b4b',
        featureDesc:         dk ? 'rgba(148,163,184,0.7)'  : 'rgba(51,65,85,0.68)',
        featureTagBorder:    dk ? 'rgba(139,92,246,0.3)'   : 'rgba(124,58,237,0.22)',
        featureTagColor:     dk ? '#c4b5fd'                : '#6d28d9',
        featureTagBg:        dk ? 'rgba(139,92,246,0.08)'  : 'rgba(139,92,246,0.06)',

        // Bottom CTA block
        ctaBg:          dk
            ? 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(91,33,182,0.08) 100%)'
            : 'linear-gradient(135deg, rgba(139,92,246,0.09) 0%, rgba(167,139,250,0.04) 100%)',
        ctaBorder:      dk ? 'rgba(139,92,246,0.28)'    : 'rgba(124,58,237,0.18)',
        ctaTitle:       dk ? '#ffffff'                  : '#1e1b4b',
        ctaSubtext:     dk ? 'rgba(148,163,184,0.65)'   : 'rgba(71,85,105,0.68)',
        ctaBtnBg:       dk ? '#ffffff'                  : '#1e1b4b',
        ctaBtnColor:    dk ? '#000000'                  : '#ffffff',
    };
}

// ── Typing demo component ─────────────────────────────────────────────────────

function TypingDemo() {
    const tk = useTokens();

    const [promptIdx, setPromptIdx] = useState(0);
    const [charIdx,   setCharIdx]   = useState(0);
    const [phase,     setPhase]     = useState('typing');

    useEffect(() => {
        const target = PROMPTS[promptIdx].text;

        if (phase === 'typing') {
            if (charIdx < target.length) {
                const t = setTimeout(() => setCharIdx(c => c + 1), 42);
                return () => clearTimeout(t);
            }
            const t = setTimeout(() => setPhase('pause'), 2000);
            return () => clearTimeout(t);
        }

        if (phase === 'pause') {
            const t = setTimeout(() => setPhase('erasing'), 400);
            return () => clearTimeout(t);
        }

        if (phase === 'erasing') {
            if (charIdx > 0) {
                const t = setTimeout(() => setCharIdx(c => c - 1), 16);
                return () => clearTimeout(t);
            }
            setPromptIdx(i => (i + 1) % PROMPTS.length);
            setPhase('typing');
        }
    }, [phase, charIdx, promptIdx]);

    const currentText = PROMPTS[promptIdx].text.slice(0, charIdx);

    const renderHighlighted = (text) =>
        text.split(/({{[^}]*}}?)/g).map((part, i) =>
            part.match(/^{{.*}}$/) ? (
                <span
                    key={i}
                    style={{
                        color:        tk.termVarColor,
                        background:   tk.termVarBg,
                        borderRadius: '3px',
                        padding:      '0 3px',
                    }}
                >
                    {part}
                </span>
            ) : (
                <span key={i}>{part}</span>
            )
        );

    return (
        <div
            className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden"
            style={{
                border:     `1px solid ${tk.termBorder}`,
                background: tk.termBg,
                boxShadow:  tk.termShadow,
                transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
            }}
        >
            {/* Window chrome */}
            <div
                className="flex items-center gap-2 px-5 py-3"
                style={{ borderBottom: `1px solid ${tk.termChromeDivider}` }}
            >
                <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                <span
                    className="ml-3 text-xs"
                    style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.termFilename }}
                >
                    untitled-prompt.md
                </span>
            </div>

            {/* Text area */}
            <div className="px-6 py-6" style={{ minHeight: '5.5rem' }}>
                <p
                    className="text-base leading-relaxed"
                    style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.termText }}
                >
                    {renderHighlighted(currentText)}
                    <span
                        style={{
                            display:        'inline-block',
                            width:          '2px',
                            height:         '1.1em',
                            background:     tk.termCursor,
                            marginLeft:     '1px',
                            verticalAlign:  'text-bottom',
                            animation:      'altCursorBlink 1s step-end infinite',
                        }}
                    />
                </p>
            </div>

            {/* Status bar */}
            <div
                className="flex items-center justify-between px-5 py-2.5"
                style={{
                    borderTop:  `1px solid ${tk.termStatusDivider}`,
                    background: tk.termStatusBg,
                }}
            >
                <span
                    className="text-xs"
                    style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.termStatusMeta }}
                >
                    {charIdx} chars &middot; {PROMPTS[promptIdx].vars} variable{PROMPTS[promptIdx].vars !== 1 ? 's' : ''}
                </span>
                <span
                    className="text-xs"
                    style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.termStatusTag }}
                >
                    live demo
                </span>
            </div>
        </div>
    );
}

// ── Page component ────────────────────────────────────────────────────────────

export function AltHome() {
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
            <style>{`
                @keyframes altCursorBlink {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0; }
                }
                @keyframes altFloat {
                    0%, 100% { transform: translateY(0px);   }
                    50%       { transform: translateY(-12px); }
                }
            `}</style>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative flex flex-col items-center justify-center text-center px-6 pt-16 pb-20 overflow-hidden">

                {/* Floating orbs */}
                <div
                    className="pointer-events-none absolute"
                    style={{
                        width: '500px', height: '500px', borderRadius: '50%',
                        background: `radial-gradient(circle, ${tk.orbA} 0%, transparent 70%)`,
                        top: '-8rem', left: '-8rem',
                        animation: 'altFloat 14s ease-in-out infinite',
                    }}
                />
                <div
                    className="pointer-events-none absolute"
                    style={{
                        width: '380px', height: '380px', borderRadius: '50%',
                        background: `radial-gradient(circle, ${tk.orbB} 0%, transparent 70%)`,
                        bottom: '4rem', right: '-6rem',
                        animation: 'altFloat 18s ease-in-out infinite reverse',
                    }}
                />

                {/* Badge */}
                <div
                    className="relative z-10 mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest"
                    style={{
                        fontFamily: 'IBM Plex Mono, monospace',
                        border:     `1px solid ${tk.badgeBorder}`,
                        background: tk.badgeBg,
                        color:      tk.badgeColor,
                        transition: 'background 0.3s, border-color 0.3s, color 0.3s',
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: tk.dotColor, boxShadow: tk.dotShadow, transition: 'background 0.3s' }}
                    />
                    Prompt engineering workspace
                </div>

                {/* Headline */}
                <h1
                    className="relative z-10 font-black leading-none tracking-tighter max-w-4xl"
                    style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}
                >
                    Build better
                    <br />
                    <span
                        style={{
                            WebkitTextFillColor: 'transparent',
                            WebkitTextStroke:    `2px ${tk.strokeColor}`,
                            display:             'inline-block',
                            transition:          'WebkitTextStroke 0.3s',
                        }}
                    >
                        prompts
                    </span>
                    ,
                    <br />
                    faster.
                </h1>

                {/* Subheading */}
                <p
                    className="relative z-10 mt-7 max-w-lg text-lg leading-relaxed"
                    style={{ color: tk.subtext, transition: 'color 0.3s' }}
                >
                    Write, template, and compare AI prompts — all in one focused workspace with variables, version history, and head-to-head Arena testing.
                </p>

                {/* Typing demo */}
                <div className="relative z-10 mt-12 w-full">
                    <TypingDemo />
                </div>

                {/* CTAs */}
                <div className="relative z-10 mt-10 flex flex-col sm:flex-row items-center gap-4">
                    <Link
                        to="/app"
                        className="group inline-flex items-center gap-2.5 rounded-xl px-8 py-4 font-bold text-black shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                            background: 'linear-gradient(135deg, #fde047 0%, #f59e0b 100%)',
                            boxShadow:  '0 8px 24px rgba(234,179,8,0.3)',
                        }}
                    >
                        Start Building
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        to="/new"
                        className={`inline-flex items-center gap-2 rounded-xl px-8 py-4 font-medium transition-colors ${tk.secHover}`}
                        style={{
                            border: `1px solid ${tk.secBorder}`,
                            color:  tk.secColor,
                            transition: 'color 0.3s, border-color 0.3s, background 0.2s',
                        }}
                    >
                        New Prompt
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </section>

            {/* ── Stats strip ──────────────────────────────────────── */}
            <div
                style={{
                    borderTop:    `1px solid ${tk.stripDivider}`,
                    borderBottom: `1px solid ${tk.stripDivider}`,
                    transition:   'border-color 0.3s',
                }}
            >
                <div className="mx-auto max-w-4xl grid grid-cols-3 py-10 px-6">
                    {[
                        { figure: '∞',     label: 'Prompts stored'    },
                        { figure: '{{}}',  label: 'Template variables' },
                        { figure: '1v1',   label: 'Arena comparisons'  },
                    ].map((stat, i) => (
                        <div
                            key={stat.label}
                            className="flex flex-col items-center justify-center gap-1.5 px-4 text-center"
                            style={i > 0 ? { borderLeft: `1px solid ${tk.stripDivider}` } : {}}
                        >
                            <span
                                className="font-black leading-none"
                                style={{
                                    fontFamily: 'IBM Plex Mono, monospace',
                                    fontSize:   'clamp(1.5rem, 4vw, 2.25rem)',
                                    color:      tk.statFigure,
                                    transition: 'color 0.3s',
                                }}
                            >
                                {stat.figure}
                            </span>
                            <span
                                className="text-xs uppercase tracking-widest"
                                style={{ color: tk.statLabel, transition: 'color 0.3s' }}
                            >
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Features ─────────────────────────────────────────── */}
            <section className="mx-auto max-w-5xl px-6 py-24">
                <p
                    className="mb-14 text-xs uppercase tracking-[0.3em]"
                    style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.featureSectionLabel }}
                >
                    The workflow
                </p>

                <div>
                    {FEATURES.map((item, i) => (
                        <div
                            key={item.num}
                            className="group grid items-center gap-6 py-8"
                            style={{
                                gridTemplateColumns: '4.5rem 1fr auto',
                                borderBottom: i < FEATURES.length - 1
                                    ? `1px solid ${tk.featureRowDivider}`
                                    : 'none',
                                transition: 'border-color 0.3s',
                            }}
                        >
                            <span
                                className="font-black transition-colors duration-200 group-hover:!text-violet-500"
                                style={{
                                    fontFamily: 'IBM Plex Mono, monospace',
                                    fontSize:   '2rem',
                                    color:      tk.featureNum,
                                    transition: 'color 0.3s',
                                }}
                            >
                                {item.num}
                            </span>
                            <div>
                                <h3
                                    className="text-2xl font-bold"
                                    style={{ color: tk.featureTitle, transition: 'color 0.3s' }}
                                >
                                    {item.title}
                                </h3>
                                <p
                                    className="mt-2 max-w-md text-sm leading-relaxed"
                                    style={{ color: tk.featureDesc, transition: 'color 0.3s' }}
                                >
                                    {item.desc}
                                </p>
                            </div>
                            <span
                                className="self-center rounded-full px-3.5 py-1.5 text-xs font-medium"
                                style={{
                                    fontFamily: 'IBM Plex Mono, monospace',
                                    border:     `1px solid ${tk.featureTagBorder}`,
                                    color:      tk.featureTagColor,
                                    background: tk.featureTagBg,
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.3s',
                                }}
                            >
                                {item.tag}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Final CTA ────────────────────────────────────────── */}
            <section className="px-6 pb-28 pt-4">
                <div
                    className="mx-auto max-w-5xl rounded-3xl p-12 md:p-16 text-center"
                    style={{
                        background: tk.ctaBg,
                        border:     `1px solid ${tk.ctaBorder}`,
                        transition: 'background 0.3s, border-color 0.3s',
                    }}
                >
                    <h2
                        className="font-black leading-tight"
                        style={{
                            fontSize:   'clamp(2rem, 5vw, 3.5rem)',
                            color:      tk.ctaTitle,
                            transition: 'color 0.3s',
                        }}
                    >
                        Your first prompt
                        <br />
                        is one click away.
                    </h2>
                    <p
                        className="mt-4 text-sm"
                        style={{ color: tk.ctaSubtext, transition: 'color 0.3s' }}
                    >
                        No setup. No account required. Just open it and start writing.
                    </p>
                    <Link
                        to="/app"
                        className="mt-9 inline-flex items-center gap-2.5 rounded-xl px-8 py-4 font-bold transition-opacity hover:opacity-90"
                        style={{
                            background: tk.ctaBtnBg,
                            color:      tk.ctaBtnColor,
                            transition: 'background 0.3s, color 0.3s',
                        }}
                    >
                        Open PromptFolio
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
