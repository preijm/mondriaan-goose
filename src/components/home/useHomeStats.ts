import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalTests: number;
  brandsCovered: number;
  uniqueProducts: number;
  recentReviews: number;
}

export const useHomeStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalTests: 0,
    brandsCovered: 0,
    uniqueProducts: 0,
    recentReviews: 0,
  });

  useEffect(() => {
    const fetchTrustIndicators = async () => {
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [statsResult, recentResult] = await Promise.all([
          supabase.rpc("get_public_stats"),
          supabase
            .from("milk_tests")
            .select("id", { count: "exact", head: true })
            .gte("created_at", sevenDaysAgo.toISOString()),
        ]);

        const stat = statsResult.data?.[0];
        setStats({
          totalTests: Number(stat?.total_tests) || 0,
          brandsCovered: Number(stat?.total_brands) || 0,
          uniqueProducts: Number(stat?.total_products) || 0,
          recentReviews: recentResult.count ?? 0,
        });
      } catch (error) {
        console.error("Error fetching trust indicators:", error);
      }
    };
    fetchTrustIndicators();
  }, []);

  return stats;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};
