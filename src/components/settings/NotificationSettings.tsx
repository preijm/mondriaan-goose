import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, MessageSquare } from "lucide-react";

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // Here you would save to your backend/database
      // For now, we'll just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Notification preferences updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification preferences.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Notification Settings</h2>
      
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Bell className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h3 className="font-semibold text-yellow-800">Stay Updated</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Choose how you'd like to receive notifications about your milk tests and community updates.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-start space-x-3">
              <MessageSquare className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-500">Get notified in your browser</p>
              </div>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <h3 className="font-medium">Product Updates</h3>
                <p className="text-sm text-gray-500">New features and improvements</p>
              </div>
            </div>
            <Switch
              checked={productUpdates}
              onCheckedChange={setProductUpdates}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <h3 className="font-medium">Weekly Digest</h3>
                <p className="text-sm text-gray-500">Summary of your milk testing activity</p>
              </div>
            </div>
            <Switch
              checked={weeklyDigest}
              onCheckedChange={setWeeklyDigest}
            />
          </div>
        </div>

        <Button 
          onClick={handleSaveNotifications}
          variant="brand"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}