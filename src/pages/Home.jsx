import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Layers, BarChart3, Code, Share2, Sparkles } from 'lucide-react';
import { HeroHighlight, Highlight } from '../components/ui/hero-highlight';
import { BentoGrid, BentoGridItem } from '../components/ui/bento-grid';
import { InfiniteMovingCards } from '../components/ui/infinite-moving-cards';
import { Spotlight } from '../components/ui/spotlight';

export function Home() {
    return (
        <div className="bg-background min-h-screen w-full overflow-hidden relative">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />

            {/* Hero Section */}
            <HeroHighlight containerClassName="h-[40rem] md:h-[50rem]">
                <div className="text-center max-w-4xl mx-auto px-4 relative z-20">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 backdrop-blur-sm">
                        The Ultimate Tool for Prompt Engineers
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-text-main mb-6 tracking-tight leading-tight">
                        Master Your <Highlight className="text-white">Prompts</Highlight>.
                        <br />
                        Maximize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Impact</span>.
                    </h1>
                    <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
                        Organize, template, and compare your AI prompts in one beautiful workspace.
                        Stop juggling notepads and start engineering results.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/app"
                            className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/25"
                        >
                            Get Started Free <ArrowRight size={20} />
                        </Link>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="glass-button text-lg px-8 py-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                        >
                            View on GitHub
                        </a>
                    </div>
                </div>
            </HeroHighlight>

            {/* Features Section */}
            <div className="py-20 px-4 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-text-main">
                    Everything you need to <span className="text-primary">excel</span>
                </h2>
                <BentoGrid className="max-w-6xl mx-auto">
                    {features.map((feature, i) => (
                        <BentoGridItem
                            key={i}
                            title={feature.title}
                            description={feature.description}
                            header={feature.header}
                            icon={feature.icon}
                            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                        />
                    ))}
                </BentoGrid>
            </div>

            {/* Supported Models Section */}
            <div className="py-20 relative z-10 bg-surface/30 backdrop-blur-sm border-y border-white/5">
                <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-text-secondary">
                    Powering your workflows with top models
                </h3>
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                />
            </div>

            {/* CTA Section */}
            <div className="py-32 text-center relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
                <h2 className="text-4xl md:text-6xl font-bold text-text-main mb-8">
                    Ready to level up?
                </h2>
                <Link
                    to="/app"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl shadow-white/10"
                >
                    Start Building Now <Sparkles size={20} className="text-yellow-500" />
                </Link>
            </div>
        </div>
    );
}

const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/10"></div>
);

const features = [
    {
        title: "Smart Library",
        description: "Organize prompts with tags and platforms. Never lose a winning prompt again.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 items-center justify-center"><Layers className="w-10 h-10 text-blue-400" /></div>,
        icon: <Layers className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Dynamic Templates",
        description: "Create reusable templates with {{variables}}. Fill them out instantly for any use case.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/10 items-center justify-center"><Zap className="w-10 h-10 text-emerald-400" /></div>,
        icon: <Zap className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "The Arena",
        description: "Run prompts against ChatGPT, Claude, and Gemini side-by-side. Rate and log the winner.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10 items-center justify-center"><BarChart3 className="w-10 h-10 text-orange-400" /></div>,
        icon: <BarChart3 className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "API Integration",
        description: "Connect your own API keys to run prompts directly within the platform. Secure and local.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-white/10 items-center justify-center"><Code className="w-10 h-10 text-pink-400" /></div>,
        icon: <Code className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Share & Collaborate",
        description: "Export your prompts to JSON or Markdown. Share with your team easily.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-white/10 items-center justify-center"><Share2 className="w-10 h-10 text-violet-400" /></div>,
        icon: <Share2 className="h-4 w-4 text-neutral-500" />,
    },
];

const testimonials = [
    {
        quote: "The reasoning capabilities are unmatched for complex tasks.",
        name: "OpenAI",
        title: "GPT-4o",
    },
    {
        quote: "Large context window allows for processing entire books.",
        name: "Anthropic",
        title: "Claude 3.5 Sonnet",
    },
    {
        quote: "Multimodal capabilities integrated natively from the start.",
        name: "Google",
        title: "Gemini 1.5 Pro",
    },
    {
        quote: "Open weights model that rivals proprietary performance.",
        name: "Meta",
        title: "Llama 3",
    },
    {
        quote: "Fast and efficient for coding and reasoning tasks.",
        name: "Mistral",
        title: "Mistral Large",
    },
];
