/**
 * Application Constants
 *
 * This directory stores all application-wide, immutable values.
 * Constants should not be exported as default; use named exports instead.
 *
 * Organization:
 * - API endpoints and base URLs
 * - Feature flags and configuration keys
 * - Enum-like constants (status values, roles, etc.)
 * - Message templates and error codes
 *
 * Principles:
 * - Use UPPER_SNAKE_CASE for constant names
 * - Group related constants in objects for better organization
 * - Avoid hardcoding values throughout the app - always define them here
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_MODE: import.meta.env.MODE === 'development',
};

// Common Status Values
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Example: Add more constants as needed
// export const USER_ROLES = { ... };
// export const ERROR_MESSAGES = { ... };
