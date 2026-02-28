import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    CheckCircle2,
    FolderKanban,
    Sparkles,
    Swords,
    WandSparkles,
} from 'lucide-react';

export function Home() {
    const containerRef = React.useRef(null);

    const handlePointerMove = (event) => {
        const el = containerRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const nx = (x / rect.width - 0.5) * 2;
        const ny = (y / rect.height - 0.5) * 2;

        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
        el.style.setProperty('--grid-shift-x', `${-nx * 8}px`);
        el.style.setProperty('--grid-shift-y', `${-ny * 8}px`);
        el.style.setProperty('--grid-scale', '1.01');
        el.style.setProperty('--grid-opacity', '0.68');
    };

    const handlePointerLeave = () => {
        const el = containerRef.current;
        if (!el) return;

        el.style.setProperty('--mx', '50%');
        el.style.setProperty('--my', '20%');
        el.style.setProperty('--grid-shift-x', '0px');
        el.style.setProperty('--grid-shift-y', '0px');
        el.style.setProperty('--grid-scale', '1');
        el.style.setProperty('--grid-opacity', '0.56');
    };

    return (
        <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative overflow-hidden bg-background text-text-main"
            style={{
                '--mx': '50%',
                '--my': '20%',
                '--grid-shift-x': '0px',
                '--grid-shift-y': '0px',
                '--grid-scale': '1',
                '--grid-opacity': '0.56',
            }}
        >
            <div className="pointer-events-none absolute inset-0 landing-grid-bg" />
            <div className="pointer-events-none absolute inset-0 landing-grid-reactive" />
            <div className="pointer-events-none absolute left-[-10rem] top-[-10rem] h-[25rem] w-[25rem] rounded-full bg-primary/20 blur-[120px]" />
            <div className="pointer-events-none absolute right-[-8rem] top-[6rem] h-[20rem] w-[20rem] rounded-full bg-accent/20 blur-[110px]" />

            <section className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-6 pb-12 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div className="space-y-7">
                    <p className="landing-mono inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-text-secondary backdrop-blur">
                        <Sparkles size={14} className="text-primary" />
                        Simple Prompt Workspace
                    </p>

                    <div className="space-y-5">
                        <h1 className="landing-display max-w-2xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
                            Prompt engineering that feels easy from day one.
                        </h1>
                        <p className="max-w-xl text-lg leading-relaxed text-text-secondary">
                            Write, organize, and test prompts in one place with a clear workflow that anyone on your team can follow.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link
                            to="/app"
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-7 py-3.5 font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/45"
                        >
                            Open PromptFolio
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            to="/new"
                            className="btn-secondary"
                        >
                            Create First Prompt
                        </Link>
                    </div>

                    <p className="landing-mono text-xs text-text-secondary">
                        No complicated setup. You can start creating immediately.
                    </p>
                </div>

                <div className="rounded-3xl border border-border bg-surface/90 p-6 shadow-xl shadow-primary/10 backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <h2 className="landing-display text-xl">Your First 5 Minutes</h2>
                        <span className="landing-mono rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            Quick Start
                        </span>
                    </div>

                    <ol className="mt-4 space-y-3.5">
                        {quickStart.map((item, idx) => (
                            <li key={item.title} className="rounded-xl border border-border bg-background/70 p-4">
                                <p className="landing-mono text-xs uppercase tracking-[0.16em] text-primary">
                                    Step {idx + 1}
                                </p>
                                <p className="landing-display mt-1.5 text-lg">{item.title}</p>
                                <p className="mt-1.5 text-sm text-text-secondary">{item.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-8">
                <div className="mb-7">
                    <p className="landing-mono text-xs uppercase tracking-[0.2em] text-text-secondary">Core Workflow</p>
                    <h2 className="landing-display mt-2 text-4xl md:text-[2.7rem]">Everything important, nothing overwhelming.</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {workflowCards.map((item) => (
                        <article key={item.title} className="rounded-2xl border border-border bg-surface/75 p-6 backdrop-blur">
                            <div className="mb-4 inline-flex rounded-xl bg-primary/15 p-2 text-primary">
                                <item.icon size={20} />
                            </div>
                            <h3 className="landing-display text-2xl">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-14 pt-10">
                <div className="rounded-3xl border border-border bg-gradient-to-br from-surface to-background p-8 md:p-10">
                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                            <p className="landing-mono text-xs uppercase tracking-[0.2em] text-text-secondary">Why Teams Like It</p>
                            <h2 className="landing-display mt-2 text-4xl leading-tight md:text-[2.7rem]">
                                Onboarding is smooth because the product flow is obvious.
                            </h2>
                            <ul className="mt-6 space-y-3">
                                {approachabilityPoints.map((point) => (
                                    <li key={point} className="flex items-start gap-2.5 text-sm text-text-secondary">
                                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-border bg-background/80 p-5 md:min-w-[17rem]">
                            <p className="landing-mono text-xs uppercase tracking-[0.16em] text-text-secondary">Looks Familiar</p>
                            <div className="mt-3 space-y-2.5">
                                {uiPreview.map((row) => (
                                    <div key={row} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary">
                                        {row}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-border pt-6">
                        <Link
                            to="/app"
                            className="group inline-flex items-center gap-2 rounded-xl bg-text-main px-6 py-3 font-semibold text-background transition-opacity hover:opacity-90"
                        >
                            Start with one prompt
                            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

const quickStart = [
    {
        title: 'Create a prompt in plain text',
        description: 'Use a clean editor to write your prompt without distractions.',
    },
    {
        title: 'Turn repeated parts into a template',
        description: 'Add variables once so your team can reuse the prompt confidently.',
    },
    {
        title: 'Compare outputs in Arena',
        description: 'Run side-by-side tests and keep the version that reads best.',
    },
];

const workflowCards = [
    {
        icon: FolderKanban,
        title: 'Organize',
        description: 'Folders and tags keep prompts easy to find, even as your library grows.',
    },
    {
        icon: WandSparkles,
        title: 'Template',
        description: 'Reusable variables help new teammates start quickly with less guesswork.',
    },
    {
        icon: Swords,
        title: 'Compare',
        description: 'Simple side-by-side evaluation makes quality decisions faster.',
    },
];

const approachabilityPoints = [
    'Clear labels and predictable navigation make the app easy to learn.',
    'Each page focuses on one job, so new users do not feel overloaded.',
    'Reusable templates reduce copy-paste mistakes during onboarding.',
    'Prompt comparisons are visual and straightforward, not technical.',
];

const uiPreview = [
    'Library: all prompts in one place',
    'Editor: write or edit with zero clutter',
    'Arena: compare two prompt responses',
    'History: revisit what worked before',
];
