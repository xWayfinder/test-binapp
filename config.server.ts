import { z } from 'zod';
import { config } from 'dotenv';

// Define the schema for our configuration
const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Database
  DATABASE_URL: z.string().regex(/^postgres(ql)?:\/\/[^\s]*$/, 'Invalid database URL'),
  
  // Auth
  // SESSION_SECRET: z.string().min(32),

  // Google Maps
  GOOGLE_MAPS_API_KEY: z.string().min(32),
  // GOOGLE_MAPS_API_URL: z.string().url(),
  // GOOGLE_MAPS_API_VERSION: z.string(),
  // GOOGLE_MAPS_API_KEY_SECRET: z.string().min(32),

  // Auth0
  APP_BASE_URL: z.string().url().default('http://localhost:3000'),
  AUTH0_SECRET: z.string().min(32),
  AUTH0_DOMAIN: z.string().url(),
  AUTH0_CLIENT_ID: z.string().min(32),
  AUTH0_CLIENT_SECRET: z.string().min(32),
});

function loadConfig() {

  const nodeEnv = process.env.NODE_ENV || 'development';
  console.log('NODE_ENV', nodeEnv);
  // Load from .env files
  const envFile = {
    production: '.env',
    test: '.env.test',
    development: '.env.local'
  }[nodeEnv];

  // Actually use the parsed config object
  const parsedEnv = config({ path: envFile }).parsed || {};

  // Try process.env first, then parsedEnv 
  return envSchema.parse({ ...process.env, ...parsedEnv });
}

// Export validated config
export const env = loadConfig();

// Export type for TypeScript users
export type Env = z.infer<typeof envSchema>;
