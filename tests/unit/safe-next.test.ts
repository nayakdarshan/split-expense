import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/safe-next";

// Protects the post-login redirect from becoming an open redirect.
describe("safeNext", () => {
  it.each([
    ["/groups/abc", "/groups/abc"],
    ["/groups?tab=balances", "/groups?tab=balances"],
    ["/join/tok_123", "/join/tok_123"],
  ])("keeps same-origin path %s", (input, expected) => {
    expect(safeNext(input)).toBe(expected);
  });

  it.each([
    "//evil.com",
    "//evil.com/groups",
    "https://evil.com",
    "/\\evil.com",
    "\\\\evil.com",
    "javascript:alert(1)",
    "groups",
    "/%2F%2Fevil.com",
    "",
  ])("falls back to /groups for %j", (input) => {
    expect(safeNext(input)).toBe("/groups");
  });

  it("falls back for null and undefined", () => {
    expect(safeNext(null)).toBe("/groups");
    expect(safeNext(undefined)).toBe("/groups");
  });
});
