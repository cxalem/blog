"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { checkGrammar, GrammarMatch, GrammarCheckResult } from "@/lib/grammar";

interface UseGrammarOptions {
  debounceMs?: number;
  language?: "auto" | "en-US" | "es";
}

export function useGrammar(options: UseGrammarOptions = {}) {
  const { debounceMs = 1000, language = "auto" } = options;

  const [matches, setMatches] = useState<GrammarMatch[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const check = useCallback(
    async (text: string) => {
      // Clear any pending check
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (!text.trim()) {
        setMatches([]);
        setError(null);
        return;
      }

      // Debounce the check
      timeoutRef.current = setTimeout(async () => {
        setIsChecking(true);
        setError(null);

        try {
          const result = await checkGrammar(text, language);
          setMatches(result.matches);
          setDetectedLanguage(
            result.language.detectedLanguage || result.language.name,
          );
        } catch (err) {
          if (err instanceof Error && err.name !== "AbortError") {
            setError(err.message);
            setMatches([]);
          }
        } finally {
          setIsChecking(false);
        }
      }, debounceMs);
    },
    [debounceMs, language],
  );

  const clearMatches = useCallback(() => {
    setMatches([]);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    matches,
    isChecking,
    error,
    detectedLanguage,
    check,
    clearMatches,
  };
}
