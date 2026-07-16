import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30 backdrop-blur">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">
                        Access denied
                    </p>
                    <h1 className="mt-4 text-3xl font-semibold text-white">
                        401 — Unauthorized
                    </h1>
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                        You don&apos;t have permission to access this page. If you believe this is a mistake, please contact your administrator.
                    </p>
                    <Link
                        href="/auth/signin"
                        className="mt-8 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </main>
    );
}
