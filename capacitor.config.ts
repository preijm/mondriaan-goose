import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.534a6b8e95044d1c9f7fe02ff5b37b5b',
  appName: 'mondriaan-goose',
  webDir: 'dist',
  server: {
    url: 'https://534a6b8e-9504-4d1c-9f7f-e02ff5b37b5b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    }
  }
};

export default config;