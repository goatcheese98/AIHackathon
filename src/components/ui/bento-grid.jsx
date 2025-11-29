import { cn } from "../../utils/cn";

export const BentoGrid = ({
    className,
    children
}) => {
    return (
        (<div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}>
            {children}
        </div>)
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon
}) => {
    return (
        (<div
            className={cn(
                "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-white dark:bg-slate-900 dark:border-white/[0.1] border border-transparent justify-between flex flex-col space-y-4 relative overflow-hidden",
                className
            )}>
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-white dark:from-neutral-900 dark:to-neutral-800 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 transition duration-200 group-hover/bento:translate-x-2">
                {header}
                <div className="mt-4">
                    {icon}
                    <div
                        className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                        {title}
                    </div>
                    <div
                        className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
                        {description}
                    </div>
                </div>
            </div>
        </div>)
    );
};
