import SettingsLayout from "@/components/settings/SettingsLayout";
import SecuritySettings from "@/components/settings/SecuritySettings";

const AccountSecurity = () => {
  return (
    <SettingsLayout title="Security Settings">
      <SecuritySettings />
    </SettingsLayout>
  );
};

export default AccountSecurity;