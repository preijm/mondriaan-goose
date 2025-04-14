import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, UserPlus } from "lucide-react";
import MenuBar from "@/components/MenuBar";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Attempting authentication...");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        console.log("Login successful");
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
        navigate("/dashboard");
      } else {
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
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              username: username,
            },
          },
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <MenuBar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-blue-50/80 to-emerald-50/80 relative overflow-hidden">
        {/* Background animations */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCAxNDQwIDUwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTM0OS42NzkgMjQxLjQzN0MtMjI5LjU1MSA5Ny4zNzYgMTA1LjY0OSAtODEuNjk5NyAzOTcuNzEgNjUuNzk5N0M2ODkuNzcxIDIxMy4yOTkgOTE2LjQ4OCA0MjguODE0IDEwNjEuMDEgNTE5LjIzQzEyMDUuNTMgNjA5LjY0NiAxNTMyLjI1IDU0My40ODQgMTY5NS42MSA0NzQuODIyIiBzdHJva2U9InVybCgjcGFpbnQwX2xpbmVhcikiIHN0cm9rZS13aWR0aD0iMiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9IjY3MyIgeTE9IjAiIHgyPSI2NzMiIHkyPSI1NzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMEVCNUI1Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMzREMzk5Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+')] opacity-40 animate-[wave_10s_ease-in-out_infinite] will-change-transform" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCAxNDQwIDUwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTM0OS42NzkgMjQxLjQzN0MtMjI5LjU1MSA5Ny4zNzYgMTA1LjY0OSAtODEuNjk5NyAzOTcuNzEgNjUuNzk5N0M2ODkuNzcxIDIxMy4yOTkgOTE2LjQ4OCA0MjguODE0IDEwNjEuMDEgNTE5LjIzQzEyMDUuNTMgNjA5LjY0NiAxNTMyLjI1IDU0My40ODQgMTY5NS42MSA0NzQuODIyIiBzdHJva2U9InVybCgjcGFpbnQwX2xpbmVhcikiIHN0cm9rZS13aWR0aD0iMiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9IjY3MyIgeTE9IjAiIHgyPSI2NzMiIHkyPSI1NzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMzREMzk5Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMEVCNUI1Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+')] opacity-30 animate-[wave_15s_ease-in-out_infinite_reverse] will-change-transform scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 backdrop-blur-[1px] animate-pulse" />

        <div className="container max-w-5xl mx-auto px-4 py-8 relative z-10">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLogin}
                  minLength={3}
                  maxLength={30}
                  pattern="^[a-zA-Z0-9_-]+$"
                  title="Username can only contain letters, numbers, underscores, and hyphens"
                />
              </div>
            )}
            
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-cream-300 hover:bg-cream-200"
              disabled={loading}
            >
              {loading ? (
                "Loading..."
              ) : isLogin ? (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </div>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setUsername("");
              }}
              className="text-milk-500 hover:text-milk-600"
            >
              {isLogin
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
