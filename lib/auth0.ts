import { Auth0Client } from "@auth0/nextjs-auth0/server";

/*
  /auth/login: The route to perform login with Auth0
  /auth/logout: The route to log the user out
  /auth/callback: The route Auth0 will redirect the user to after a successful login
  /auth/profile: The route to fetch the user profile
  /auth/access-token: The route to verify the user's session and return an access token (which automatically refreshes if a refresh token is available)
  /auth/backchannel-logout: The route to receive a logout_token when a configured Back-Channel Logout initiator occurs
*/


// Initialize the Auth0 client 
export const auth0 = new Auth0Client({
  // Options are loaded from environment variables by default
  // Ensure necessary environment variables are properly set
  // domain: process.env.AUTH0_DOMAIN,
  // clientId: process.env.AUTH0_CLIENT_ID,
  // clientSecret: process.env.AUTH0_CLIENT_SECRET,
  // appBaseUrl: process.env.APP_BASE_URL,
  // secret: process.env.AUTH0_SECRET,

  authorizationParameters: {
    // In v4, the AUTH0_SCOPE and AUTH0_AUDIENCE environment variables for API authorized applications are no longer automatically picked up by the SDK.
    // Instead, we need to provide the values explicitly.
    scope: process.env.AUTH0_SCOPE,
    audience: process.env.AUTH0_AUDIENCE,
  }
});