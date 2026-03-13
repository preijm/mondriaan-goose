import { supabase } from "@/integrations/supabase/client";

interface RateLimitResult {
  allowed: boolean;
  attempts_remaining: number;
  retry_after_seconds: number;
}

/**
 * Server-side rate limit check via Edge Function.
 * Falls back to allowing the request if the check fails (fail-open).
 */
export const checkServerRateLimit = async (
  action: "login" | "signup" | "password_reset",
  identifier: string
): Promise<RateLimitResult> => {
  try {
    const { data, error } = await supabase.functions.invoke("check-rate-limit", {
      body: { action, identifier },
    });

    if (error) {
      console.warn("Server rate limit check failed, allowing request:", error.message);
      return { allowed: true, attempts_remaining: 0, retry_after_seconds: 0 };
    }

    return data as RateLimitResult;
  } catch {
    // Fail open - don't block users if rate limiting is unavailable
    return { allowed: true, attempts_remaining: 0, retry_after_seconds: 0 };
  }
};
