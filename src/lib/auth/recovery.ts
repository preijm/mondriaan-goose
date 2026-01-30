import { supabase } from "@/integrations/supabase/client";

const RECOVERY_MODE_KEY = "passwordRecoveryMode";
const RECOVERY_ACCESS_TOKEN_KEY = "passwordRecoveryAccessToken";

export function getRecoveryFromUrlHash(): {
  type: string | null;
  accessToken: string | null;
  refreshToken: string | null;
} {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  return {
    type: hashParams.get("type"),
    accessToken: hashParams.get("access_token"),
    refreshToken: hashParams.get("refresh_token"),
  };
}

export function setRecoveryMode(accessToken?: string | null) {
  sessionStorage.setItem(RECOVERY_MODE_KEY, "true");
  if (accessToken) sessionStorage.setItem(RECOVERY_ACCESS_TOKEN_KEY, accessToken);
}

export function clearRecoveryMode() {
  sessionStorage.removeItem(RECOVERY_MODE_KEY);
  sessionStorage.removeItem(RECOVERY_ACCESS_TOKEN_KEY);
}

export function isRecoveryMode(): boolean {
  return sessionStorage.getItem(RECOVERY_MODE_KEY) === "true";
}

export function getStoredRecoveryAccessToken(): string | null {
  return sessionStorage.getItem(RECOVERY_ACCESS_TOKEN_KEY);
}

/**
 * Use verifyOtp to establish a session from the recovery token,
 * then update the password.
 */
export async function updatePasswordWithRecoveryToken(params: {
  accessToken: string;
  password: string;
}) {
  // First, try to verify the OTP token to establish a session
  const { data, error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: params.accessToken,
    type: "recovery",
  });

  if (verifyError) {
    console.error("OTP verification failed:", verifyError);
    // If verifyOtp fails, the token may already be used or expired
    throw new Error(
      "This password reset link has expired or already been used. Please request a new one."
    );
  }

  if (!data.session) {
    throw new Error(
      "Could not establish a session. Please request a new password reset link."
    );
  }

  // Now we have a valid session, update the password
  const { error: updateError } = await supabase.auth.updateUser({
    password: params.password,
  });

  if (updateError) {
    throw updateError;
  }
}
