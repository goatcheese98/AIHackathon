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
                "absolute inset-0 flex items-center justify-center pointer-events-none",
                className
            )}
        >
            {Array.from({ length: numCircles }).map((_, i) => (
                <div
                    key={i}
                    className="absolute animate-ripple rounded-full bg-primary/30 shadow-xl border border-primary/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                        width: mainCircleSize + i * 70,
                        height: mainCircleSize + i * 70,
                        opacity: mainCircleOpacity - i * 0.03,
                        animationDelay: `${i * 0.06}s`,
                        borderStyle: i === numCircles - 1 ? "dashed" : "solid",
                        "--i": i,
                    }}
                />
            ))}
        </div>
    );
});
