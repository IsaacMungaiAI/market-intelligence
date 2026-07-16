import { getSession } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/app/components/dashboard-shell";
import { OnboardingProvider } from "@/app/components/onboarding/onboarding-provider";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/auth/signin");
    }

    return (
        <DashboardShell userEmail={session.user?.email}>
            <OnboardingProvider>{children}</OnboardingProvider>
        </DashboardShell>
    );
}
