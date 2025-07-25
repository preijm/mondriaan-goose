import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CountrySelect } from "@/components/milk-test/CountrySelect";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

interface ProfileFormData {
  username: string;
  email: string;
  defaultCountry: string | null;
}

export const ProfileSection = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    defaultValues: {
      username: "",
      email: "",
      defaultCountry: null,
    },
  });

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserId(user.id);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, default_country_code')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        form.reset({
          username: profile.username || "",
          email: user.email || "",
          defaultCountry: profile.default_country_code,
        });
      } else {
        form.setValue('email', user.email || "");
      }
    };

    getProfile();
  }, [form]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!userId) return;

    setLoading(true);
    try {
      // Check if username is taken
      if (data.username) {
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', data.username)
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
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: data.username,
          default_country_code: data.defaultCountry 
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Profile Information</h2>
        <p className="text-muted-foreground">Update your personal information and account details</p>
      </div>

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Username" 
                      {...field}
                      pattern="^[a-zA-Z0-9_-]+$"
                      title="Username can only contain letters, numbers, underscores, and hyphens"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Country</FormLabel>
                  <FormControl>
                    <CountrySelect
                      country={field.value}
                      setCountry={field.onChange}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    This will be pre-selected when adding new milk tests
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};