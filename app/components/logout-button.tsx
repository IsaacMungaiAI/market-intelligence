"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="text-sm text-red-400 hover:text-red-300"
        >
            Sign out
        </button>
    );
}