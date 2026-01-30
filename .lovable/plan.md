
# Fix Password Reset Link Always Invalid

## Problem Summary

When you click a password reset link from your email, the app always shows "Invalid Reset Link" even for valid links. This happens because the current implementation relies on a browser-specific security feature that breaks when you open the email link in a different browser window or email app.

## What's Happening

The password reset uses a security system called PKCE:
1. When you request a reset, your browser stores a secret code
2. The email link contains a matching code
3. Both codes must match to work
4. If you open the link in a different browser/tab/email app, the secret code isn't there

## The Fix

Change how the app handles password reset links:
- Use Supabase's built-in event system (`PASSWORD_RECOVERY` event)
- Let Supabase automatically detect and handle the reset link
- Store a "password recovery mode" flag that persists across browser sessions

## Implementation Steps

### Step 1: Update AuthContext to detect PASSWORD_RECOVERY event
Modify `src/contexts/AuthContext.tsx` to:
- Listen for `PASSWORD_RECOVERY` event in `onAuthStateChange`
- Store the recovery state in sessionStorage (survives page reloads)
- Export a `isPasswordRecoveryMode` flag

### Step 2: Update useAuthFlow hook
Modify `src/hooks/useAuthFlow.ts` to:
- Check for the recovery mode flag from AuthContext
- Remove the manual `exchangeCodeForSession` logic for password reset
- Keep the email confirmation and error handling

### Step 3: Update ResetPassword page
Modify `src/pages/ResetPassword.tsx` to:
- Use the new recovery mode detection
- Show password form when in recovery mode
- Clear recovery mode after successful password update

---

## Technical Details

### Changes to `src/contexts/AuthContext.tsx`

```tsx
// Add PASSWORD_RECOVERY event handling
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (event, session) => {
    console.log('Auth state changed:', event);
    
    if (event === 'PASSWORD_RECOVERY') {
      // Store in sessionStorage so it survives the redirect
      sessionStorage.setItem('passwordRecoveryMode', 'true');
    }
    
    setSession(session);
    setUser(session?.user ?? null);
  }
);
```

### Changes to `src/hooks/useAuthFlow.ts`

- Add check for `sessionStorage.getItem('passwordRecoveryMode')`
- Simplify the password reset detection
- Remove complex PKCE code exchange logic
- Keep validation and error handling

### Changes to `src/pages/ResetPassword.tsx`

- Clear the recovery mode flag after successful password update
- Redirect to login page after completion

---

## Expected Outcome

After this fix:
- Password reset links will work regardless of which browser/tab they're opened in
- The user will see the password reset form instead of "Invalid Reset Link"
- After updating the password, the user will be redirected to login

## Files to Modify

| File | Changes |
|------|---------|
| `src/contexts/AuthContext.tsx` | Add PASSWORD_RECOVERY event handling, export recovery mode state |
| `src/hooks/useAuthFlow.ts` | Simplify to use recovery mode flag from AuthContext |
| `src/pages/ResetPassword.tsx` | Use new recovery detection, clear flag after success |

