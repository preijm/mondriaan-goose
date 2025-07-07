
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthFormInputs from "./AuthFormInputs";
import AuthFormButtons from "./AuthFormButtons";
import { useAuthForm } from "@/hooks/useAuthForm";

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    if (!isLogin && password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError("");
    setPasswordError("");
    
    // Validate inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    if (emailValidation) {
      setEmailError(emailValidation);
    }
    if (passwordValidation) {
      setPasswordError(passwordValidation);
    }
    
    // Show validation errors as toast
    if (emailValidation || passwordValidation) {
      toast({
        title: "Please check your input",
        description: emailValidation || passwordValidation,
        variant: "destructive"
      });
      return;
    }
    
    console.log("Form submitted:", isLogin ? "login" : "signup");
    
    if (isLogin) {
      await handleLogin(email, password);
    } else {
      console.log("Calling handleSignUp with:", { email, password, username });
      await handleSignUp({ email, password, username });
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
