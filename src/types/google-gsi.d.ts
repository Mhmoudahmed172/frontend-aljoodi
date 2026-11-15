/** Minimal typings for the Google Identity Services OAuth2 token client (https://accounts.google.com/gsi/client). */
interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleTokenClient {
  requestAccessToken: (overrides?: { prompt?: string }) => void;
}

interface Window {
  google?: {
    accounts: {
      oauth2: {
        initTokenClient: (config: { client_id: string; scope: string; callback: (response: GoogleTokenResponse) => void; error_callback?: (error: { type: string }) => void }) => GoogleTokenClient;
      };
    };
  };
}
