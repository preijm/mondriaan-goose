import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import MenuBar from "@/components/MenuBar";
import MobileFooter from "@/components/MobileFooter";
import BackgroundPattern from "@/components/BackgroundPattern";
import { FeedItem } from "@/components/feed/FeedItem";
import { MilkTestResult } from "@/types/milk-test";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, LogIn, UserPlus } from "lucide-react";
const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    data: feedItems = [],
    isLoading
  } = useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('milk_tests_view').select('*').order('created_at', {
        ascending: false
      }).limit(50);
      if (error) throw error;
      return data as MilkTestResult[];
    },
    enabled: !!user // Only fetch if user is authenticated
  });

  return (
    <div className="min-h-screen relative">
      <MenuBar />
      <BackgroundPattern>
        {/* Main Content - Always rendered but blurred when not authenticated */}
        <div className={`container max-w-2xl mx-auto px-4 py-6 md:py-8 pt-24 md:pt-32 pb-20 sm:pb-6 md:pb-8 relative z-10 transition-all duration-300 ${!user ? 'pointer-events-none' : ''}`}>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8 text-center">Moo'd Board</h1>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {feedItems.map(item => <FeedItem key={item.id} item={item} />)}
              {feedItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {user 
                    ? "No milk tests to show yet. Be the first to share your tasting!"
                    : "Sign in to see milk tests and reviews from the community. Join to discover new alternatives and share your tastings!"
                  }
                </div>
              )}
            </div>
          )}
        </div>

      </BackgroundPattern>
      <MobileFooter />
    </div>
  );
};
export default Feed;