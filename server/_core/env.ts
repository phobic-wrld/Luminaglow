export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  localAdminUsername: process.env.ADMIN_USERNAME ?? "",
  localAdminPassword: process.env.ADMIN_PASSWORD ?? "",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  adminGoogleEmails: process.env.ADMIN_GOOGLE_EMAILS ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

export const isOAuthConfigured =
  ENV.oAuthServerUrl.length > 0 && ENV.appId.length > 0;

export const isLocalAdminConfigured =
  ENV.localAdminUsername.length > 0 && ENV.localAdminPassword.length > 0;

export const adminGoogleEmails = ENV.adminGoogleEmails
  .split(",")
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);

export const isGoogleAuthConfigured =
  ENV.googleClientId.length > 0 && ENV.googleClientSecret.length > 0;

export const localAdminOpenId = ENV.localAdminUsername
  ? `local-admin:${ENV.localAdminUsername}`
  : "local-admin";
