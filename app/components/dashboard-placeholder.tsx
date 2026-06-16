import { Card, CardContent } from "@/components/ui/card";

type DashboardPlaceholderProps = {
    title: string;
    description: string;
    label: string;
};

export function DashboardPlaceholder({
    title,
    description,
    label,
}: DashboardPlaceholderProps) {
    return (
        <Card>
            <CardContent className="p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-300">
                    {label}
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                    {title}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
