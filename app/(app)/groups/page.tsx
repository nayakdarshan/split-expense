import type { Metadata } from "next";

export const metadata: Metadata = { title: "Groups · split-expense" };

// Placeholder until T16. proxy.ts already redirects signed-out visitors to /login.
export default function GroupsPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Groups</h1>
      <p className="mt-2 text-muted-foreground">Your groups will appear here.</p>
    </main>
  );
}
