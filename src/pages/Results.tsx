import React from "react";
import { Navigation } from "@/components/Navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Results = () => {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Results</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{new Date(result.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{result.brand}</TableCell>
                  <TableCell>{result.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < result.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{result.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Results;