
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthFormInputs from "./AuthFormInputs";
import AuthFormButtons from "./AuthFormButtons";
import { useAuthForm } from "@/hooks/useAuthForm";
import { sanitizeInput, validateEmail, validatePassword, validateUsername, loginRateLimit, signupRateLimit } from "@/lib/security";

interface AuthFormProps {
  onForgotPassword: () => void;
  isEmailConfirmed?: boolean;
  onEmailConfirmedDismiss?: () => void;
}

const AuthForm = ({ onForgotPassword, isEmailConfirmed, onEmailConfirmedDismiss }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { loading, handleLogin, handleSignUp } = useAuthForm();
  const { toast } = useToast();

  const validateEmailInput = (email: string) => {
    if (!email) {
      return "Email is required";
    }
    if (!validateEmail(email) || email.length > 254) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePasswordInput = (password: string) => {
    const validation = validatePassword(password, !isLogin);
    return validation.isValid ? "" : validation.message;
  };

  const validateUsernameInput = (username: string) => {
    if (isLogin) return ""; // No username validation for login
    const validation = validateUsername(username);
    return validation.isValid ? "" : validation.message;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    const rateLimitKey = `auth_${sanitizeInput(email)}`;
    const rateLimit = isLogin ? loginRateLimit : signupRateLimit;
    
    if (!rateLimit.canAttempt(rateLimitKey)) {
      const remainingTime = Math.ceil(rateLimit.getRemainingTime(rateLimitKey) / 60000);
      toast({
        title: "Too many attempts",
        description: `Please wait ${remainingTime} minutes before trying again.`,
        variant: "destructive"
      });
      return;
    }
    
    // Clear previous errors
    setEmailError("");
    setPasswordError("");
    
    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedUsername = sanitizeInput(username);
    
    // Validate inputs
    const emailValidation = validateEmailInput(sanitizedEmail);
    const passwordValidation = validatePasswordInput(password);
    const usernameValidation = validateUsernameInput(sanitizedUsername);
    
    if (emailValidation) {
      setEmailError(emailValidation);
    }
    if (passwordValidation) {
      setPasswordError(passwordValidation);
    }
    
    // Show validation errors as toast
    if (emailValidation || passwordValidation || usernameValidation) {
      toast({
        title: "Please check your input",
        description: emailValidation || passwordValidation || usernameValidation,
        variant: "destructive"
      });
      return;
    }
    
    // Record the attempt
    rateLimit.recordAttempt(rateLimitKey);
    
    console.log("Form submitted:", isLogin ? "login" : "signup");
    
    if (isLogin) {
      await handleLogin(sanitizedEmail, password);
    } else {
      console.log("Calling handleSignUp with:", { email: sanitizedEmail, password, username: sanitizedUsername });
      await handleSignUp({ email: sanitizedEmail, password, username: sanitizedUsername });
    }
  };

  return (
    <>
      {isEmailConfirmed && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-emerald-800 font-medium">Email verified successfully!</p>
              <p className="text-emerald-700 text-sm">You can now log in with your credentials.</p>
            </div>
            <button
              type="button"
              onClick={onEmailConfirmedDismiss}
              className="text-emerald-500 hover:text-emerald-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-center mb-8 text-[#00BF63]">
        {isLogin ? "Welcome Back" : "Join Our Community"}
      </h1>
      <form onSubmit={handleAuth} className="space-y-6">
      <AuthFormInputs
        isLogin={isLogin}
        email={email}
        setEmail={(value) => {
          setEmail(value);
          if (emailError) setEmailError("");
        }}
        password={password}
        setPassword={(value) => {
          setPassword(value);
          if (passwordError) setPasswordError("");
        }}
        username={username}
        setUsername={setUsername}
        emailError={emailError}
        passwordError={passwordError}
      />

      <AuthFormButtons
        isLogin={isLogin}
        loading={loading}
        onForgotPassword={onForgotPassword}
        onToggleMode={() => {
          setIsLogin(!isLogin);
          setUsername("");
          setEmailError("");
          setPasswordError("");
        }}
      />
      </form>
    </>
  );
};

export default AuthForm;
