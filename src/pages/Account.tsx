
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MenuBar from "@/components/MenuBar";
import MobileFooter from "@/components/MobileFooter";
import BackgroundPatternWithOverlay from "@/components/BackgroundPatternWithOverlay";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { ProfileSection } from "@/components/account/ProfileSection";
import { SecuritySection } from "@/components/account/SecuritySection";
import { PreferencesSection } from "@/components/account/PreferencesSection";
import { NotificationsSection } from "@/components/account/NotificationsSection";

const Account = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'security':
        return <SecuritySection />;
      case 'preferences':
        return <PreferencesSection />;
      case 'notifications':
        return <NotificationsSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen">
      <MenuBar />
      <BackgroundPatternWithOverlay>
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary-variant text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Account Settings</h1>
            <p className="text-xl opacity-90">Manage your account preferences and security</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex gap-8 max-w-6xl mx-auto">
            <AccountSidebar 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />
            
            <main className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
              {renderActiveSection()}
            </main>
          </div>
        </div>
      </BackgroundPatternWithOverlay>
      <MobileFooter />
    </div>
  );
};

export default Account;

