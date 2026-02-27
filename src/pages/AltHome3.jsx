import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ── Theme tokens ──────────────────────────────────────────────────────────────

function useTokens() {
    const { theme } = useTheme();
    const dk = theme === 'dark';

    return {
        dk,

        // Page
        pageBg:    dk ? '#141210' : '#faf9f5',
        pageColor: dk ? '#f5f0eb' : '#1a1208',

        // Surfaces
        surface:       dk ? '#1e1c19' : '#ffffff',
        surfaceSubtle: dk ? '#191713' : '#fef7f3',

        // Orange accent
        accent:       dk ? '#fb923c' : '#c2410c',
        accentVivid:  dk ? '#f97316' : '#ea580c',
        accentBg:     dk ? 'rgba(249,115,22,0.12)' : 'rgba(194,65,12,0.08)',
        accentBgSoft: dk ? 'rgba(249,115,22,0.06)' : 'rgba(194,65,12,0.04)',

        // Rules and dividers
        rule:       dk ? 'rgba(245,240,235,0.14)' : 'rgba(26,18,8,0.1)',
        ruleStrong: dk ? 'rgba(245,240,235,0.22)' : 'rgba(26,18,8,0.18)',

        // Text
        textMuted: dk ? 'rgba(245,240,235,0.56)' : 'rgba(26,18,8,0.54)',
        textFaint: dk ? 'rgba(245,240,235,0.3)'  : 'rgba(26,18,8,0.28)',

        // Buttons
        btnBg:        dk ? '#fb923c' : '#c2410c',
        btnColor:     '#ffffff',
        btnShadow:    dk ? '0 8px 28px rgba(249,115,22,0.28)' : '0 8px 28px rgba(194,65,12,0.2)',
        btnSecBorder: dk ? 'rgba(245,240,235,0.18)' : 'rgba(26,18,8,0.16)',
        btnSecColor:  dk ? 'rgba(245,240,235,0.76)' : 'rgba(26,18,8,0.7)',
        btnSecHover:  dk ? 'hover:bg-white/5' : 'hover:bg-black/5',
    };
}

// ── Static content ────────────────────────────────────────────────────────────

const FEATURES = [
    {
        label:    'Editor',
        headline: 'Write without distraction.',
        body:     'A clean, focused editor that keeps your full attention on the words. No clutter, no friction — just a blank canvas and your thinking.',
        pull:     '"Zero to first draft in seconds."',
        link:     '/new',
        linkText: 'Open Editor',
    },
    {
        label:    'Templates',
        headline: 'Wrap anything in a variable.',
        body:     'Turn any repeated phrase into a {{variable}}. Share templates your whole team can fill in and run without guesswork or copy-paste errors.',
        pull:     '"Your team\'s shared starting point."',
        link:     '/templates',
        linkText: 'Browse Templates',
    },
    {
        label:    'Arena',
        headline: 'Compare. Decide. Move on.',
        body:     'Run two prompt variants side by side, read both outputs together, and keep the version that actually delivers the result you need.',
        pull:     '"Clarity over iteration fatigue."',
        link:     '/arena',
        linkText: 'Try the Arena',
    },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export function AltHome3() {
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
            <div className="mx-auto max-w-6xl px-5 sm:px-8">

                {/* ── Masthead ──────────────────────────────────── */}
                <header className="pt-8 pb-0">

                    {/* Top orange rule */}
                    <div
                        className="w-full rounded-full mb-7"
                        style={{ height: '3px', background: tk.accentVivid }}
                    />

                    <div className="flex items-baseline justify-between gap-4 flex-wrap">
                        <h1
                            className="text-4xl md:text-5xl font-black uppercase"
                            style={{
                                fontFamily:    'Space Grotesk, sans-serif',
                                letterSpacing: '0.06em',
                            }}
                        >
                            PromptFolio
                        </h1>
                        <div className="flex items-center gap-3 pb-1">
                            <span
                                className="text-xs uppercase tracking-widest"
                                style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.textFaint }}
                            >
                                Prompt Engineering Workspace
                            </span>
                            <span
                                className="text-xs rounded-full px-2.5 py-1"
                                style={{
                                    background: tk.accentBg,
                                    color:      tk.accent,
                                    fontFamily: 'IBM Plex Mono, monospace',
                                }}
                            >
                                v1.0
                            </span>
                        </div>
                    </div>

                    {/* Bottom rule */}
                    <div
                        className="w-full mt-5"
                        style={{ height: '1px', background: tk.ruleStrong }}
                    />
                </header>

                {/* ── Hero ──────────────────────────────────────── */}
                <section
                    className="grid md:grid-cols-[1.6fr_1fr] gap-10 md:gap-20 items-end py-14 md:py-20"
                    style={{ borderBottom: `1px solid ${tk.rule}` }}
                >
                    <div>
                        <h2
                            className="font-black leading-[1.02] tracking-tight"
                            style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                fontSize:   'clamp(2.6rem, 6.5vw, 5.2rem)',
                            }}
                        >
                            The workspace for{' '}
                            <span style={{ color: tk.accentVivid }}>
                                prompt engineers.
                            </span>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-5">
                        <p
                            className="text-base leading-relaxed"
                            style={{ color: tk.textMuted }}
                        >
                            Write, version, and compare your AI prompts with a clear workflow that any team can follow from day one.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link
                                to="/app"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold transition-all hover:-translate-y-0.5"
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
                                className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-medium transition-colors ${tk.btnSecHover}`}
                                style={{
                                    border:     `1px solid ${tk.btnSecBorder}`,
                                    color:      tk.btnSecColor,
                                    transition: 'color 0.3s, border-color 0.3s',
                                }}
                            >
                                Write a Prompt
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Section divider ───────────────────────────── */}
                <div className="flex items-center gap-5 py-8">
                    <div className="h-px flex-1" style={{ background: tk.rule }} />
                    <span
                        className="text-xs uppercase tracking-[0.25em] shrink-0"
                        style={{ fontFamily: 'IBM Plex Mono, monospace', color: tk.accent }}
                    >
                        Core Features
                    </span>
                    <div className="h-px flex-1" style={{ background: tk.rule }} />
                </div>

                {/* ── Feature columns ───────────────────────────── */}
                <section className="grid grid-cols-1 md:grid-cols-3 mb-0">
                    {FEATURES.map((f, i) => (
                        <article
                            key={f.label}
                            className="py-8 md:py-10"
                            style={{
                                borderTop:  `2px solid ${tk.accentVivid}`,
                                borderLeft: i > 0 ? `1px solid ${tk.rule}` : 'none',
                                paddingLeft:  i > 0 ? '2rem'  : '0',
                                paddingRight: i < 2 ? '2rem'  : '0',
                            }}
                        >
                            {/* Label */}
                            <span
                                className="text-xs uppercase tracking-[0.22em] block mb-5"
                                style={{
                                    fontFamily: 'IBM Plex Mono, monospace',
                                    color:      tk.accent,
                                }}
                            >
                                {f.label}
                            </span>

                            {/* Headline */}
                            <h3
                                className="text-[1.6rem] font-black leading-tight mb-4"
                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                            >
                                {f.headline}
                            </h3>

                            {/* Body */}
                            <p
                                className="text-sm leading-[1.75] mb-6"
                                style={{ color: tk.textMuted }}
                            >
                                {f.body}
                            </p>

                            {/* Pull quote */}
                            <p
                                className="text-sm italic pl-4 mb-6"
                                style={{
                                    borderLeft: `2px solid ${tk.accentVivid}`,
                                    color:      tk.textFaint,
                                    fontFamily: 'Space Grotesk, sans-serif',
                                }}
                            >
                                {f.pull}
                            </p>

                            {/* Feature link */}
                            <Link
                                to={f.link}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
                                style={{ color: tk.accent }}
                            >
                                {f.linkText}
                                <ArrowRight size={14} />
                            </Link>
                        </article>
                    ))}
                </section>

                {/* ── Pull quote ────────────────────────────────── */}
                <div
                    className="py-14 md:py-20 text-center"
                    style={{
                        borderTop:    `1px solid ${tk.rule}`,
                        borderBottom: `1px solid ${tk.rule}`,
                    }}
                >
                    <p
                        className="font-black leading-[1.05] mx-auto max-w-3xl"
                        style={{
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontSize:   'clamp(2rem, 5vw, 3.8rem)',
                        }}
                    >
                        One workspace.{' '}
                        <span style={{ color: tk.accentVivid }}>
                            Every prompt.
                        </span>
                    </p>
                    <p
                        className="mt-5 text-base max-w-md mx-auto"
                        style={{ color: tk.textMuted }}
                    >
                        From first draft to final test — without switching tools.
                    </p>
                </div>

                {/* ── Footer CTA ────────────────────────────────── */}
                <footer className="py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <p
                            className="text-xl font-bold"
                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                            Ready to start?
                        </p>
                        <p
                            className="text-sm mt-1"
                            style={{ color: tk.textMuted }}
                        >
                            No setup required. Open and write immediately.
                        </p>
                    </div>
                    <Link
                        to="/app"
                        className="group shrink-0 inline-flex items-center gap-2 rounded-xl px-8 py-4 font-bold transition-all hover:-translate-y-0.5"
                        style={{
                            background: tk.btnBg,
                            color:      tk.btnColor,
                            boxShadow:  tk.btnShadow,
                            transition: 'background 0.3s, box-shadow 0.3s, transform 0.2s',
                        }}
                    >
                        Start Writing
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </footer>

                {/* Bottom orange rule */}
                <div
                    className="w-full rounded-full mb-8"
                    style={{ height: '3px', background: tk.accentVivid }}
                />

            </div>
        </div>
    );
}
