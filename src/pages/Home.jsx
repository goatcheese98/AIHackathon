import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Layers, BarChart3 } from 'lucide-react';

export function Home() {
    return (
        <div className="text-center py-12">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto mb-20">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                    The Ultimate Tool for Prompt Engineers
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-text-main mb-6 tracking-tight">
                    Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Prompts</span>.
                    <br />
                    Maximize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Impact</span>.
                </h1>
                <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
                    Organize, template, and compare your AI prompts in one beautiful workspace.
                    Stop juggling notepads and start engineering results.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/app"
                        className="btn-primary text-lg px-8 py-4 flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        Get Started Free <ArrowRight size={20} />
                    </Link>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="glass-button text-lg px-8 py-4 flex items-center gap-2"
                    >
                        View on GitHub
                    </a>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                <FeatureCard
                    icon={Layers}
                    title="Smart Library"
                    description="Organize prompts with tags and platforms. Never lose a winning prompt again."
                />
                <FeatureCard
                    icon={Zap}
                    title="Dynamic Templates"
                    description="Create reusable templates with {{variables}}. Fill them out instantly for any use case."
                />
                <FeatureCard
                    icon={BarChart3}
                    title="The Arena"
                    description="Run prompts against ChatGPT, Claude, and Gemini side-by-side. Rate and log the winner."
                />
            </div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <div className="glass-panel p-8 text-left hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-3">{title}</h3>
            <p className="text-text-secondary leading-relaxed">{description}</p>
        </div>
    );
}
