import { useEffect, useState } from "react";
import { AddMilkTest } from "@/components/AddMilkTest";
import MenuBar from "@/components/MenuBar";
import MobileFooter from "@/components/MobileFooter";
import BackgroundPattern from "@/components/BackgroundPattern";

// Note: This page is now protected by ProtectedRoute in App.tsx
const Index = () => {
  return (
    <div className="h-screen overflow-hidden">
      <MenuBar />
      <BackgroundPattern>
        <div className="h-screen flex items-center justify-center pt-16 pb-16">
          <div className="container max-w-3xl mx-auto px-4 relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Moo-ment of Truth</h1>
            <AddMilkTest />
          </div>
        </div>
      </BackgroundPattern>
      
      <MobileFooter />
    </div>
  );
};

export default Index;