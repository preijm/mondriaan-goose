import MenuBar from "@/components/MenuBar";
import MobileFooter from "@/components/MobileFooter";
import ProfileSettings from "@/components/settings/ProfileSettings";

const AccountProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      <MenuBar />
      
      <div className="px-4 py-6 pb-24 pt-20">
        <ProfileSettings />
      </div>
      
      <MobileFooter />
    </div>
  );
};

export default AccountProfile;
