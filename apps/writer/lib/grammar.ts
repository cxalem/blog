export interface GrammarMatch {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: string[];
  ruleId: string;
  ruleDescription: string;
  category: string;
}

export interface GrammarCheckResult {
  matches: GrammarMatch[];
  language: {
    code: string;
    name: string;
    detectedLanguage?: string;
  };
}

// Configure the API endpoint - switch to self-hosted by changing this URL
// Self-hosted: http://localhost:8010/v2/check
// Public API: https://api.languagetool.org/v2/check
const LANGUAGETOOL_API =
  process.env.NEXT_PUBLIC_LANGUAGETOOL_API ||
  "https://api.languagetool.org/v2/check";

export async function checkGrammar(
  text: string,
  language: "auto" | "en-US" | "es" = "auto",
): Promise<GrammarCheckResult> {
  if (!text.trim()) {
    return {
      matches: [],
      language: {
        code: language,
        name: language === "es" ? "Spanish" : "English",
      },
    };
  }

  const params = new URLSearchParams({
    text,
    language,
    enabledOnly: "false",
  });

  const response = await fetch(LANGUAGETOOL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Grammar check failed: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    matches: data.matches.map((match: any) => ({
      message: match.message,
      shortMessage: match.shortMessage || match.message,
      offset: match.offset,
      length: match.length,
      replacements:
        match.replacements?.slice(0, 5).map((r: any) => r.value) || [],
      ruleId: match.rule?.id || "",
      ruleDescription: match.rule?.description || "",
      category: match.rule?.category?.name || "Grammar",
    })),
    language: {
      code: data.language?.code || language,
      name: data.language?.name || "",
      detectedLanguage: data.language?.detectedLanguage?.name,
    },
  };
}
