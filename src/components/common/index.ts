/**
 * Common/Reusable Components
 *
 * This directory contains generic, application-agnostic UI components.
 * These components should be small, focused, and easily reusable across the application.
 *
 * Examples:
 * - Button: Accessible button component with variants
 * - Card: Container component for content grouping
 * - Modal: Dialog/modal component
 * - Input: Controlled input field with validation
 * - Badge: Small label component
 *
 * Component Structure (co-location - simple components):
 * Button/
 *   ├── Button.tsx
 *   ├── Button.module.scss
 *   └── Button.test.tsx
 *
 * For components with sub-components or complex structure:
 * ComplexComponent/
 *   ├── ComplexComponent.tsx
 *   ├── ComplexComponent.module.scss
 *   ├── ComplexComponent.test.tsx
 *   ├── SubComponent.tsx
 *   └── index.ts (export only when needed)
 *
 * Principles:
 * - Each component should have a single responsibility
 * - Import directly from component folder (no index.ts needed for simple components)
 * - Use TypeScript interfaces for prop types
 * - Include proper documentation and examples
 * - Be generic and not tightly coupled to specific features
 */

// For components with sub-components, export from their index.ts
// export * from './ComplexComponent';
// For single components, import directly from their folder
// import Button from './Button/Button';
