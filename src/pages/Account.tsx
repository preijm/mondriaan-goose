
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Lock } from "lucide-react";
import MenuBar from "@/components/MenuBar";

const Account = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully.",
      });
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen">
      <MenuBar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-blue-50/80 to-emerald-50/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCAxNDQwIDUwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTM0OS42NzkgMjQxLjQzN0MtMjI5LjU1MSA5Ny4zNzYgMTA1LjY0OSAtODEuNjk5NyAzOTcuNzEgNjUuNzk5N0M2ODkuNzcxIDIxMy4yOTkgOTE2LjQ4OCA0MjguODE0IDEwNjEuMDEgNTE5LjIzQzEyMDUuNTMgNjA5LjY0NiAxNTMyLjI1IDU0My40ODQgMTY5NS42MSA0NzQuODIyIiBzdHJva2U9InVybCgjcGFpbnQwX2xpbmVhcikiIHN0cm9rZS13aWR0aD0iMiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9IjY3MyIgeTE9IjAiIHgyPSI2NzMiIHkyPSI1NzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMDBCRjYzIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDZCNkQ0Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+')] opacity-40 animate-[wave_10s_ease-in-out_infinite] will-change-transform" />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

        <div className="flex items-center justify-center min-h-screen">
          <div className="container max-w-md mx-auto px-4 relative z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 animate-fade-up">
              <h1 className="text-3xl font-bold text-center mb-8 text-[#00BF63]">
                Account Settings
              </h1>
              
              <form onSubmit={handleUpdateUsername} className="space-y-6 mb-8">
                <div>
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    maxLength={30}
                    pattern="^[a-zA-Z0-9_-]+$"
                    title="Username can only contain letters, numbers, underscores, and hyphens"
                    className="bg-white/80 border-black/20 backdrop-blur-sm rounded-sm"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  style={{
                    backgroundColor: '#2144FF',
                    color: 'white'
                  }} 
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save Username"}
                </Button>
              </form>

              <div className="h-px bg-gray-200 my-8" />

              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/80 border-black/20 backdrop-blur-sm rounded-sm"
                />
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/80 border-black/20 backdrop-blur-sm rounded-sm"
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  style={{
                    backgroundColor: '#2144FF',
                    color: 'white'
                  }} 
                  disabled={isChangingPassword}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
