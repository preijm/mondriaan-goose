import { useEffect, useState } from "react";
import { AddMilkTest } from "@/components/AddMilkTest";
import MenuBar from "@/components/MenuBar";
import MobileFooter from "@/components/MobileFooter";
import BackgroundPattern from "@/components/BackgroundPattern";
import { useNavigate } from "react-router-dom";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

// Note: This page is now protected by ProtectedRoute in App.tsx
const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const showCustomHeader = isMobile || isTablet;

  return (
    <div className="min-h-screen">
      <MenuBar />
      <BackgroundPattern>
        <div className="flex items-center justify-center min-h-screen pt-16 pb-20 px-4">
          <div className="container max-w-3xl mx-auto relative z-10 w-full">
            {/* Custom header for mobile/tablet */}
            {showCustomHeader && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#00bf63' }}>
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-900">Add Test</h1>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleClose}
                  className="h-12 w-12 rounded-full"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            )}
            
            {/* Desktop title */}
            {!showCustomHeader && (
              <h1 className="text-2xl font-bold mb-6 md:mb-8 text-center text-[#00bf63] md:text-5xl">Moo-ment of Truth</h1>
            )}
            
            <AddMilkTest />
          </div>
        </div>
      </BackgroundPattern>
      <MobileFooter />
    </div>
  );
};
export default Index;