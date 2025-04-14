import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Save } from "lucide-react";
import MenuBar from "@/components/MenuBar";

const Account = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        setUsername(profile.username);
      }
    };

    getProfile();
  }, [navigate]);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    try {
      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', userId)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Username taken",
          description: "Please choose a different username.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Username updated successfully.",
      });
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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    } else {
      navigate('/');
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
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
            
            <form onSubmit={handleUpdateUsername} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={30}
                  pattern="^[a-zA-Z0-9_-]+$"
                  title="Username can only contain letters, numbers, underscores, and hyphens"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-cream-300 hover:bg-cream-200"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t">
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
