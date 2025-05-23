
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AuthFormData {
  email: string;
  password: string;
  username: string;
}

export const useAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const fromAdd = location.state?.from === '/add';

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      // First, check if the email exists in the system
      const { data: userData } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', (await supabase.auth.getUser({ email })).data.user?.id || '')
        .maybeSingle();
      
      // Try to sign in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // If the email doesn't exist in our system, it's likely an email issue
        if (!userData && error.message.includes('Invalid login credentials')) {
          toast({
            title: "Email not found",
            description: "No account exists with this email address. Please check your email or sign up.",
            variant: "destructive",
          });
          return;
        }
        
        // If email exists but login failed, it's likely a password issue
        if (userData && error.message.includes('Invalid login credentials')) {
          toast({
            title: "Incorrect password",
            description: "The password you entered is incorrect. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        // For other errors, show the generic message
        const errorMessage = error.message || 'Something went wrong. Please try again.';
        
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });

      navigate(fromAdd ? "/add" : "/my-results");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async ({ email, password, username }: AuthFormData) => {
    setLoading(true);
    try {
      // Check if username is available before signup
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Username taken",
          description: "Please choose a different username.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log("Starting sign up process with:", { email, username });
      
      // With email confirmation disabled, this should create an account and sign in immediately
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { 
            username 
          }
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      console.log("Signup response:", data);
      
      // Check if user was immediately signed in (no email confirmation needed)
      if (data && data.session) {
        console.log("User signed in successfully with session");
        toast({
          title: "Account created!",
          description: "You're now logged in. Welcome to the community!",
        });
        
        navigate(fromAdd ? "/add" : "/my-results");
      } else if (data && data.user && !data.session) {
        // This can happen if email confirmation is required despite settings
        console.log("User created but no session - email confirmation may be required");
        toast({
          title: "Account created",
          description: "Please check your email to complete registration.",
        });
      } else {
        // Fallback for unexpected scenarios
        console.log("Unexpected signup response:", data);
        toast({
          title: "Something went wrong",
          description: "Please try again or contact support.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Caught error during signup:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin,
    handleSignUp,
  };
};
