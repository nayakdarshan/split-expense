import type { Metadata } from "next";
import { Suspense } from "react";
import { safeNext } from "@/lib/safe-next";
import { GoogleButton } from "./google-button";

export const metadata: Metadata = { title: "Sign in · split-expense" };

const ERROR_COPY: Record<string, string> = {
  access_denied: "Sign-in was cancelled. Try again when you're ready.",
  exchange_failed: "Sign-in didn't complete. Please try again.",
};

export default function LoginPage(props: PageProps<"/login">) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">split-expense</h1>
        <p className="text-muted-foreground">Sign in to see your groups and balances.</p>
      </div>
      <Suspense fallback={<GoogleButton next="/groups" />}>
        <LoginForm searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function LoginForm({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const next = safeNext(typeof params.next === "string" ? params.next : undefined);

  return (
    <div className="space-y-4">
      {error ? (
        <p role="alert" className="rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive">
          {ERROR_COPY[error] ?? "Sign-in failed. Please try again."}
        </p>
      ) : null}
      <GoogleButton next={next} />
    </div>
  );
}
