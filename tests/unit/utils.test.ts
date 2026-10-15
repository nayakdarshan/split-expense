import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

// Protects the Vitest "@/..." alias wiring that every later unit test relies on,
// and the class-merge contract UI components depend on (later class wins).
describe("cn", () => {
  it("resolves through the @/ alias and lets the later Tailwind class win", () => {
    expect(cn("px-2 text-sm", "px-4")).toBe("text-sm px-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});
