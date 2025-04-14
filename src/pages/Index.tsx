import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddMilkTest } from "@/components/AddMilkTest";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MenuBar from "@/components/MenuBar";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add milk tests",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen">
      <MenuBar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-blue-50/80 to-emerald-50/80">
        <div className="container max-w-3xl mx-auto px-4 py-8 pt-20 relative z-10">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Add New Milk Test
          </h1>
          <AddMilkTest />
        </div>
      </div>
    </div>
  );
};

export default Index;
