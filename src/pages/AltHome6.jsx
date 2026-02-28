import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowRight, 
    CheckCircle2, 
    Sparkles, 
    FileText, 
    Layers3,
    Zap,
    ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const STEPS = [
    {
        id: 'create',
        label: 'Create',
        headline: 'Start with a blank slate or a template.',
        description: 'Choose a pre-built template or write from scratch. Either way, you are seconds away from your first draft.',
        icon: FileText,
    },
    {
        id: 'fill',
        label: 'Fill',
        headline: 'Plug in your variables.',
        description: 'Replace {{placeholders}} with your content. No coding, no syntax to learn—just type and go.',
        icon: Layers3,
    },
    {
        id: 'run',
        label: 'Run',
        headline: 'Get your result instantly.',
        description: 'Run the prompt and see the output. Copy, iterate, or move on to the next task.',
        icon: Zap,
    },
];

const TEMPLATE_PREVIEWS = [
    { name: 'Email Writer', vars: '{{tone}}, {{subject}}, {{audience}}' },
    { name: 'Blog Post', vars: '{{title}}, {{keywords}}, {{length}}' },
    { name: 'Code Review', vars: '{{language}}, {{code}}, {{focus}}' },
];

function useTokens() {
    const { theme } = useTheme();
    const dk = theme === 'dark';

    return {
        dk,
        pageBg: dk ? '#0a0a0b' : '#f8f7f4',
        pageColor: dk ? '#f0f0f0' : '#18181b',
        
        brand: dk ? '#ff8a65' : '#e64a19',
        brandBg: dk ? 'rgba(255,138,101,0.12)' : 'rgba(230,74,25,0.08)',
        brandSoft: dk ? 'rgba(255,138,101,0.06)' : 'rgba(230,74,25,0.04)',
        
        surface: dk ? '#141416' : '#ffffff',
        surfaceSubtle: dk ? '#1c1c1f' : '#fafaf9',
        surfaceElevated: dk ? '#242428' : '#f5f5f4',
        
        textMuted: dk ? 'rgba(240,240,240,0.6)' : 'rgba(24,24,27,0.6)',
        textFaint: dk ? 'rgba(240,240,240,0.35)' : 'rgba(24,24,27,0.35)',
        
        accent: dk ? '#22d3ee' : '#0891b2',
        accentBg: dk ? 'rgba(34,211,238,0.1)' : 'rgba(8,145,178,0.08)',
        
        border: dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        borderStrong: dk ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)',
        
        btnBg: dk ? '#ff8a65' : '#e64a19',
        btnColor: '#ffffff',
        btnShadow: dk ? '0 4px 20px rgba(255,138,101,0.3)' : '0 4px 20px rgba(230,74,25,0.25)',
        
        success: dk ? '#4ade80' : '#16a34a',
    };
}

function WizardDemo() {
    const [step, setStep] = useState(0);
    const [filledVars, setFilledVars] = useState({});
    const [showOutput, setShowOutput] = useState(false);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    
    const tk = useTokens();
    const dk = tk.dk;
    
    // Auto-play demo only when coming from "Use Template" button, not on manual step click
    useEffect(() => {
        const timers = [];
        if (step === 1 && isAutoPlay) {
            timers.push(setTimeout(() => {
                setFilledVars({ tone: 'friendly', subject: 'New Feature', audience: 'developers' });
            }, 400));
            timers.push(setTimeout(() => setStep(2), 1200));
        }
        if (step === 2) {
            timers.push(setTimeout(() => setShowOutput(true), 600));
        }
        return () => timers.forEach(clearTimeout);
    }, [step, isAutoPlay]);
    
    const currentTemplate = TEMPLATE_PREVIEWS[0];
    const vars = currentTemplate.vars.split(', ').map(v => v.replace(/[{}]/g, ''));
    
    return (
        <div 
            className="rounded-2xl overflow-hidden border"
            style={{ 
                background: tk.surface, 
                borderColor: tk.border,
                boxShadow: dk ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.1)',
            }}
        >
            <div className="h-1 flex" style={{ background: tk.surfaceSubtle }}>
                {STEPS.map((s, i) => (
                    <div 
                        key={s.id}
                        className="flex-1 transition-all duration-500"
                        style={{ background: i <= step ? tk.brand : 'transparent' }}
                    />
                ))}
            </div>
            
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <button
                                onClick={() => { setStep(i); setShowOutput(false); setFilledVars({}); setIsAutoPlay(false); }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                                style={{ 
                                    background: i === step ? tk.brandBg : 'transparent',
                                    color: i === step ? tk.brand : tk.textFaint,
                                }}
                            >
                                <s.icon size={14} />
                                {s.label}
                            </button>
                            {i < 2 && <ChevronRight size={14} style={{ color: tk.textFaint }} />}
                        </React.Fragment>
                    ))}
                </div>
                
                <div className="min-h-[200px]">
                    {step === 0 && (
                        <div className="space-y-4">
                            <div 
                                className="p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01]"
                                style={{ 
                                    background: tk.surfaceSubtle, 
                                    borderColor: tk.brand,
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold" style={{ color: tk.pageColor }}>
                                            {currentTemplate.name}
                                        </h4>
                                        <p className="text-sm mt-1" style={{ color: tk.textMuted }}>
                                            {currentTemplate.vars}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => { setStep(1); setIsAutoPlay(true); }}
                                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                                        style={{ 
                                            background: tk.brand, 
                                            color: tk.btnColor,
                                            boxShadow: tk.btnShadow,
                                        }}
                                    >
                                        Use Template
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {step === 1 && (
                        <div className="space-y-4">
                            <div 
                                className="p-4 rounded-xl space-y-3"
                                style={{ background: tk.surfaceSubtle }}
                            >
                                {vars.map((v) => (
                                    <div key={v} className="flex items-center gap-3">
                                        <span 
                                            className="text-xs uppercase tracking-wide w-20"
                                            style={{ color: tk.textFaint }}
                                        >
                                            {v}
                                        </span>
                                        <input
                                            type="text"
                                            value={filledVars[v] || ''}
                                            placeholder={`Enter ${v}...`}
                                            readOnly
                                            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all"
                                            style={{ 
                                                background: tk.surface,
                                                border: `1px solid ${tk.border}`,
                                                color: tk.pageColor,
                                            }}
                                        />
                                        {filledVars[v] && (
                                            <CheckCircle2 size={16} style={{ color: tk.success }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                className="w-full py-3 rounded-xl font-medium text-sm transition-all"
                                style={{ 
                                    background: tk.brand, 
                                    color: tk.btnColor,
                                }}
                            >
                                Run Prompt
                            </button>
                        </div>
                    )}
                    
                    {step === 2 && (
                        <div className="space-y-4">
                            <div 
                                className="p-4 rounded-xl"
                                style={{ background: tk.surfaceSubtle }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles size={14} style={{ color: tk.brand }} />
                                    <span className="text-xs font-medium" style={{ color: tk.brand }}>
                                        Output
                                    </span>
                                </div>
                                {showOutput ? (
                                    <div 
                                        className="p-4 rounded-lg text-sm leading-relaxed"
                                        style={{ 
                                            background: tk.surface,
                                            border: `1px solid ${tk.border}`,
                                            color: tk.textMuted,
                                        }}
                                    >
                                        Hi developers!<br/><br/>
                                        We are excited to announce our latest feature: <strong>{filledVars.subject}</strong>.<br/><br/>
                                        This {filledVars.tone} update brings new capabilities that will help your workflow...
                                    </div>
                                ) : (
                                    <div 
                                        className="h-24 rounded-lg animate-pulse"
                                        style={{ background: tk.surface }}
                                    />
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setStep(0); setShowOutput(false); setFilledVars({}); setIsAutoPlay(false); }}
                                    className="flex-1 py-3 rounded-xl font-medium text-sm"
                                    style={{ 
                                        background: tk.surfaceSubtle,
                                        color: tk.textMuted,
                                    }}
                                >
                                    Back
                                </button>
                                <button
                                    className="flex-1 py-3 rounded-xl font-medium text-sm"
                                    style={{ 
                                        background: tk.brand, 
                                        color: tk.btnColor,
                                    }}
                                >
                                    Copy Result
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ value, label, sub }) {
    const tk = useTokens();
    return (
        <div className="text-center">
            <div 
                className="text-4xl md:text-5xl font-black"
                style={{ 
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: tk.brand,
                }}
            >
                {value}
            </div>
            <div className="mt-2 text-sm font-semibold" style={{ color: tk.pageColor }}>
                {label}
            </div>
            <div className="mt-1 text-xs" style={{ color: tk.textMuted }}>
                {sub}
            </div>
        </div>
    );
}

function StepCard({ step, index, active }) {
    const tk = useTokens();
    const Icon = step.icon;
    
    return (
        <div 
            className={`relative p-6 rounded-2xl border transition-all duration-500 ${active ? 'scale-105' : 'opacity-60 hover:opacity-80'}`}
            style={{ 
                background: active ? tk.surface : tk.surfaceSubtle,
                borderColor: active ? tk.brand : tk.border,
            }}
        >
            <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: tk.brandBg }}
            >
                <Icon size={20} style={{ color: tk.brand }} />
            </div>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: tk.brand }}>
                    Step {index + 1}
                </span>
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: tk.pageColor }}>
                {step.label}
            </h3>
            <p className="text-sm mb-3" style={{ color: tk.textMuted }}>
                {step.headline}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: tk.textFaint }}>
                {step.description}
            </p>
        </div>
    );
}

export function AltHome6() {
    const tk = useTokens();
    const dk = tk.dk;
    
    return (
        <div 
            className="min-h-screen"
            style={{ 
                background: tk.pageBg, 
                color: tk.pageColor,
            }}
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div 
                    className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
                    style={{ background: tk.brand }}
                />
                <div 
                    className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
                    style={{ background: tk.accent }}
                />
            </div>
            
            <div className="relative mx-auto max-w-6xl px-6 py-12">
                <header className="flex items-center justify-between mb-16">
                    <Link to="/app" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
                        PromptFolio
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link to="/templates" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: tk.textMuted }}>
                            Templates
                        </Link>
                        <Link to="/arena" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: tk.textMuted }}>
                            Arena
                        </Link>
                        <Link
                            to="/app"
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                            style={{ 
                                background: tk.brand, 
                                color: tk.btnColor,
                                boxShadow: tk.btnShadow,
                            }}
                        >
                            Open App
                        </Link>
                    </nav>
                </header>
                
                <section className="text-center mb-20">
                    <div 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
                        style={{ background: tk.brandBg, color: tk.brand }}
                    >
                        <Sparkles size={12} />
                        No setup. No learning curve. Just prompts.
                    </div>
                    
                    <h1 
                        className="text-5xl md:text-7xl font-black leading-tight mb-6"
                        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    >
                        Your first prompt<br/>
                        <span style={{ color: tk.brand }}>in 3 clicks.</span>
                    </h1>
                    
                    <p 
                        className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
                        style={{ color: tk.textMuted }}
                    >
                        Most prompt tools feel like work. PromptFolio feels like magic. 
                        Choose a template, fill in blanks, get results.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/new"
                            className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105"
                            style={{ 
                                background: tk.brand, 
                                color: tk.btnColor,
                                boxShadow: tk.btnShadow,
                            }}
                        >
                            Create Your First Prompt
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            to="/templates"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
                            style={{ 
                                border: `1px solid ${tk.borderStrong}`,
                                color: tk.textMuted,
                            }}
                        >
                            Browse Templates
                        </Link>
                    </div>
                </section>
                
                <section className="mb-24">
                    <div className="max-w-xl mx-auto">
                        <WizardDemo />
                    </div>
                </section>
                
                <section className="mb-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: tk.pageColor }}>
                        Three steps. That is it.
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {STEPS.map((step, i) => (
                            <StepCard key={step.id} step={step} index={i} active={true} />
                        ))}
                    </div>
                </section>
                
                <section 
                    className="py-16 rounded-3xl mb-16"
                    style={{ background: tk.surfaceSubtle }}
                >
                    <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <StatCard value="< 30s" label="Time to first prompt" sub="from signup to output" />
                        <StatCard value="0" label="Config needed" sub="no API keys, no setup" />
                        <StatCard value="∞" label="Templates" sub="free, reusable, shareable" />
                    </div>
                </section>
                
                <section className="text-center pb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: tk.pageColor }}>
                        Ready to try?
                    </h2>
                    <p className="text-lg mb-8" style={{ color: tk.textMuted }}>
                        No account required. No credit card. No kidding.
                    </p>
                    <Link
                        to="/new"
                        className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105"
                        style={{ 
                            background: tk.brand, 
                            color: tk.btnColor,
                            boxShadow: tk.btnShadow,
                        }}
                    >
                        Start Now — It is Free
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </section>
            </div>
        </div>
    );
}
