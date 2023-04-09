import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'projectDeMol',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['phone', 'google.com', 'facebook.com'],
    },
  }};
  
  export default config;
