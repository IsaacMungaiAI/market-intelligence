import { getSession } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/app/components/dashboard-shell";

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
            {children}
        </DashboardShell>
    );
}
