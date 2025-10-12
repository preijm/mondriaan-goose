import React from "react";
import MenuBar from "@/components/MenuBar";
import MobileFooter from "@/components/MobileFooter";
import { Bell } from "lucide-react";
import BackgroundPattern from "@/components/BackgroundPattern";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationList } from "@/components/notifications/NotificationList";
import { useIsMobile } from "@/hooks/use-mobile";

const Notifications = () => {
  const { notifications, markAllAsRead } = useNotifications();
  const isMobile = useIsMobile();
  
  // Check if device is mobile or tablet (up to 1024px)
  const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Mobile/Tablet full-screen layout
  if (isMobileOrTablet) {
    return (
      <div className="min-h-screen bg-white">
        <MenuBar />
        <div className="pt-16 pb-20 min-h-screen">
          <div className="bg-white">
            <div className="flex items-center justify-between p-4 border-b sticky top-16 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00bf63' }}>
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-800">Notifications</h1>
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-gray-600"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="px-0">
              <NotificationList />
            </div>
          </div>
        </div>
        <MobileFooter />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen">
      <MenuBar />
      <BackgroundPattern>
        <div className="flex items-center justify-center min-h-screen pt-16 pb-20 sm:pb-8">
          <div className="container max-w-4xl mx-auto px-4 py-4 sm:py-8 relative z-10">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00bf63' }}>
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-gray-600 md:hover:text-gray-900 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <NotificationList />
            </div>
          </div>
        </div>
      </BackgroundPattern>
      <MobileFooter />
    </div>
  );
};

export default Notifications;
