import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-3 px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">split-expense</h1>
      <p className="text-muted-foreground">
        Split shared expenses with your flatmates, trips and friends.
      </p>
      <Link
        href="/login"
        className="mt-4 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-4 text-base font-medium text-primary-foreground"
      >
        Sign in
      </Link>
    </main>
  );
}
