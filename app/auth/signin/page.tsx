import { getSession } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import SignInButtons from "../signin/signin-buttons";

export default async function SignInPage() {
    const session = await getSession();

    if (session) {
        redirect("/(dashboard)");
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
                <section className="relative hidden overflow-hidden border-r border-white/10 bg-slate-900 lg:block">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(16,185,129,0.22),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))]" />
                    <div className="relative flex h-full flex-col justify-between p-12">
                        <div className="inline-flex w-fit items-center gap-3 rounded-full border border-emerald-300/20 bg-white/5 px-4 py-2 text-sm font-medium text-emerald-100">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            KMIP Market Intelligence
                        </div>

                        <div className="max-w-xl">
                            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                                Portfolio command center
                            </p>
                            <h1 className="text-5xl font-semibold leading-tight text-white">
                                Track market signals with a dashboard built for action.
                            </h1>
                            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
                                Access your portfolio, watchlists, company data, and investment intelligence in one focused workspace.
                            </p>
                        </div>

                        <div className="grid max-w-2xl grid-cols-3 gap-3">
                            {["Portfolio", "Signals", "Watchlists"].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                                >
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                                        KMIP
                                    </p>
                                    <p className="mt-3 text-sm font-semibold text-white">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center px-6 py-10 sm:px-8">
                    <div className="w-full max-w-md">
                        <div className="mb-10 lg:hidden">
                            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-100">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                KMIP Market Intelligence
                            </div>
                            <h1 className="text-3xl font-semibold leading-tight">
                                Sign in to your investment workspace.
                            </h1>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30 backdrop-blur">
                            <div className="mb-8">
                                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                                    Welcome back
                                </p>
                                <h2 className="mt-3 text-2xl font-semibold text-white">
                                    Sign in to KMIP
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-400">
                                    Continue with your connected account to access your portfolio and market intelligence dashboard.
                                </p>
                            </div>

                            <SignInButtons />

                            <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                                Protected authentication powered by your configured OAuth providers.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
