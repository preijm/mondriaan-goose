
import React from "react";
import { useParams, Link } from "react-router-dom";
import MenuBar from "@/components/MenuBar";
import MobileFooter from "@/components/MobileFooter";
import BackgroundPattern from "@/components/BackgroundPattern";
import { SortConfig, useProductTests } from "@/hooks/useProductTests";
import { TestDetailsTable } from "@/components/milk-test/TestDetailsTable";
import { ImageModal } from "@/components/milk-test/ImageModal";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductPropertyBadges } from "@/components/milk-test/ProductPropertyBadges";
import { useAuth } from "@/contexts/AuthContext";
import { getScoreBadgeVariant } from "@/lib/scoreUtils";
import { formatScore } from "@/lib/scoreFormatter";
import { Badge } from "@/components/ui/badge";

type ProductDetails = {
  product_id: string;
  brand_name: string;
  product_name: string;
  property_names: string[] | null;
  is_barista: boolean;
  flavor_names: string[] | null;
  avg_rating: number;
  count: number;
}

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  // Set default sort to created_at in descending order to show latest tests first
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: 'created_at', direction: 'desc' });

  // Show login prompt if user is not authenticated
  React.useEffect(() => {
    if (!user) {
      setShowLoginPrompt(true);
    }
  }, [user]);
  
  // Fetch product details using milk_tests_view to aggregate the data
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product-details', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      // Get all tests for this product
      const { data: testData, error: testError } = await supabase
        .from('milk_tests_view')
        .select('product_id, brand_name, product_name, property_names, is_barista, flavor_names, rating')
        .eq('product_id', productId);
      
      if (testError) throw testError;
      if (!testData || testData.length === 0) return null;
      
      // Aggregate the data
      const aggregatedData: ProductDetails = {
        product_id: productId,
        brand_name: testData[0].brand_name || '',
        product_name: testData[0].product_name || '',
        property_names: testData[0].property_names || null,
        is_barista: testData[0].is_barista || false,
        flavor_names: testData[0].flavor_names || null,
        avg_rating: 0,
        count: testData.length
      };
      
      // Calculate average rating
      const totalRating = testData.reduce((sum, test) => sum + (test.rating || 0), 0);
      aggregatedData.avg_rating = totalRating / testData.length;
      
      return aggregatedData;
    },
    enabled: !!productId
  });

  // Fetch individual tests for the product (only if user is authenticated)
  const { data: productTests = [], isLoading: isLoadingTests } = useProductTests(user ? productId : null, sortConfig);

  const handleSort = (column: string) => {
    setSortConfig(current => {
      // If clicking on the same column, toggle direction
      if (current.column === column) {
        return {
          column,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      
      // If clicking on a different column, default to desc direction
      return {
        column,
        direction: 'desc'
      };
    });
  };

  // Handle opening the image modal
  const handleImageClick = (picturePath: string) => {
    if (!picturePath) return;
    
    const imageUrl = supabase.storage.from('milk-pictures').getPublicUrl(picturePath).data.publicUrl;
    setSelectedImage(imageUrl);
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen">
        <MenuBar />
        <BackgroundPattern>
          <div className="container max-w-5xl mx-auto px-4 py-8 pt-32 relative z-10">
            <div className="flex items-center mb-6">
              <Link to="/results">
                <Button variant="outline" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back to results
                </Button>
              </Link>
            </div>
            <div className="text-center py-12">Loading product details...</div>
          </div>
        </BackgroundPattern>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <MenuBar />
        <BackgroundPattern>
          <div className="container max-w-5xl mx-auto px-4 py-8 pt-32 relative z-10">
            <div className="flex items-center mb-6">
              <Link to="/results">
                <Button variant="outline" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back to results
                </Button>
              </Link>
            </div>
            <div className="text-center py-12">Product not found</div>
          </div>
        </BackgroundPattern>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
      <MenuBar />
      <LoginPrompt 
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        productName={product?.product_name}
      />
      <BackgroundPattern>
        <div className="container max-w-4xl mx-auto px-4 py-8 pt-32 relative z-10">
          {/* Desktop: Show back button */}
          <div className="hidden lg:flex items-center mb-6">
            <Link to="/results">
              <Button variant="outline" size="sm" className="gap-1 bg-background/80 hover:bg-background">
                <ArrowLeft className="h-4 w-4" /> Back to results
              </Button>
            </Link>
          </div>

          {/* Unified Product Details Card */}
          <div className="bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in">
            {/* Product Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    <span translate="no">{product.brand_name}</span> - {product.product_name}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(product.is_barista || (product.property_names && product.property_names.length > 0) || (product.flavor_names && product.flavor_names.length > 0)) && (
                      <ProductPropertyBadges 
                        isBarista={product.is_barista}
                        propertyNames={product.property_names}
                        flavorNames={product.flavor_names}
                        compact={true}
                        displayType="all"
                        inline={true}
                      />
                    )}
                  </div>
                </div>
                
                {/* Score and Tests */}
                <div className="flex sm:flex-col gap-6 sm:gap-2 sm:items-end">
                  <div className="flex flex-col items-center sm:items-end">
                    <span className="text-sm text-slate-300 mb-1">Score</span>
                    <Badge 
                      variant={getScoreBadgeVariant(Number(product.avg_rating))} 
                      className="text-2xl font-bold px-4 py-2 min-w-[4rem] flex items-center justify-center"
                    >
                      {formatScore(Number(product.avg_rating))}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-center sm:items-end">
                    <span className="text-sm text-slate-300 mb-1">Tests</span>
                    <div className="text-2xl font-bold text-white">
                      {product.count}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Results Section */}
            <div className="bg-slate-800/40 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Test Results</h2>
              {isLoadingTests ? (
                <div className="text-center py-12 text-slate-300">Loading test results...</div>
              ) : (
                <TestDetailsTable 
                  productTests={productTests} 
                  handleImageClick={handleImageClick}
                  sortConfig={sortConfig}
                  handleSort={handleSort}
                />
              )}
            </div>
          </div>
        </div>
      </BackgroundPattern>

      <MobileFooter />

      {/* Image modal */}
      {selectedImage && (
        <ImageModal 
          imageUrl={selectedImage} 
          isOpen={!!selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

export default ProductDetails;
