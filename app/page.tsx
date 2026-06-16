import { getSession } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  redirect("/auth/signin");
}
