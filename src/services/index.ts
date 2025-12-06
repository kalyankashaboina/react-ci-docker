/**
 * API Services
 *
 * This directory contains service modules responsible for all external API communication.
 * Services should be organized by domain (e.g., authService, userService, productService).
 *
 * Principles:
 * - Each service should handle a single domain of business logic
 * - Use axiosInstance for all HTTP requests (configured in utils/axiosInstance.ts)
 * - Return strongly-typed responses using TypeScript interfaces
 * - Handle errors gracefully and throw meaningful error messages
 * - Keep services pure - no side effects or component logic
 *
 * Examples:
 * - authService: Login, logout, token refresh
 * - userService: Fetch user profile, update user data
 * - productService: Fetch products, filter, search
 */

// Export services here
// export * from './authService';
// export * from './userService';
