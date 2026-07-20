export type DatePreset = "today" | "yesterday" | "last_7d" | "maximum"

export type PeriodSelection =
  | { preset: DatePreset }
  | { preset: "custom"; since: string; until: string }
