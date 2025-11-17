
// This helper file defines the Cross-Origin Resource Sharing (CORS) headers.
// It tells the browser that it's safe for your web app to make requests to this server function.
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allows any origin, adjust for production for better security
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};