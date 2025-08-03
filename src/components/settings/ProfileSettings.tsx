import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";
import { CountrySelect } from "@/components/milk-test/CountrySelect";

export default function ProfileSettings() {
  const [username, setUsername] = useState("");
  const [defaultCountry, setDefaultCountry] = useState<string | null>(null);
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
        .select('username, default_country_code')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        setUsername(profile.username);
        setDefaultCountry(profile.default_country_code);
      }
    };

    getProfile();
  }, [navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
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
        .update({ 
          username,
          default_country_code: defaultCountry 
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully.",
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Profile Settings</h2>
      
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Country (optional)
          </label>
          <CountrySelect
            country={defaultCountry}
            setCountry={setDefaultCountry}
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be pre-selected when adding new milk tests
          </p>
        </div>

        <Button 
          type="submit" 
          variant="brand"
          className="w-full" 
          disabled={loading}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}