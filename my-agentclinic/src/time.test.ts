import { describe, expect, it } from "vitest";
import { parseLocalDateTime, resolveTimeZone } from "./time";

describe("timezone handling", () => {
  it("converts valid local wall time with an explicit offset", () => {
    expect(parseLocalDateTime("2030-01-01T10:00", "Asia/Kolkata")).toEqual({
      ok: true,
      epochMs: Date.parse("2030-01-01T04:30:00.000Z"),
      iso: "2030-01-01T10:00:00+05:30",
    });
  });

  it("rejects daylight-saving gaps and repeated times", () => {
    expect(parseLocalDateTime("2030-03-10T02:30", "America/New_York")).toEqual({ ok: false, reason: "nonexistent" });
    expect(parseLocalDateTime("2030-11-03T01:30", "America/New_York")).toEqual({ ok: false, reason: "ambiguous" });
  });

  it("rejects unsupported zones", () => {
    expect(() => resolveTimeZone("Not/A_Zone")).toThrow(/cannot use/);
  });
});
