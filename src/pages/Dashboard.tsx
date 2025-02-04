import React from "react";
import { StatsOverview } from "@/components/StatsOverview";
import { MilkCharts } from "@/components/MilkCharts";
import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { data: results = [], isLoading, error } = useQuery({
    queryKey: ['milk-tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('milk_tests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-milk-100 py-8 px-4">
        <div className="container max-w-5xl mx-auto">
          <Navigation />
          <div className="text-center mt-8">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-milk-100 py-8 px-4">
        <div className="container max-w-5xl mx-auto">
          <Navigation />
          <div className="text-center mt-8 text-red-500">Error loading data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-milk-100 py-8 px-4">
      <div className="container max-w-5xl mx-auto">
        <Navigation />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <StatsOverview results={results} />
        <MilkCharts results={results} />
      </div>
    </div>
  );
};

export default Dashboard;