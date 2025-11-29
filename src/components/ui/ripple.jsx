import React from "react";
import { cn } from "../../utils/cn";

export const Ripple = React.memo(function Ripple({
    mainCircleSize = 210,
    mainCircleOpacity = 0.24,
    numCircles = 8,
    className,
}) {
    return (
        <div
            className={cn(
                "absolute inset-0 flex items-center justify-center bg-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]",
                className
            )}
        >
            {Array.from({ length: numCircles }).map((_, i) => (
                <div
                    key={i}
                    className="absolute animate-ripple rounded-full bg-foreground/25 shadow-xl border top-1/2 left-1/2 translate-x-1/2 translate-y-1/2"
                    style={{
                        width: mainCircleSize + i * 70,
                        height: mainCircleSize + i * 70,
                        opacity: mainCircleOpacity - i * 0.03,
                        animationDelay: `${i * 0.06}s`,
                        borderStyle: i === numCircles - 1 ? "dashed" : "solid",
                        borderWidth: "1px",
                        borderColor: `rgba(156, 163, 175, ${0.1 + (i * 5) / 100})`, // Slate-400 equivalent with varying opacity
                        backgroundColor: `rgba(59, 130, 246, ${0.05 - i * 0.005})`, // Primary blue with very low opacity
                        "--i": i,
                    }}
                />
            ))}
        </div>
    );
});
