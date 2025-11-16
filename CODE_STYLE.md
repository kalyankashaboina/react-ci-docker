# Code Style & Conventions

This document defines the official coding standards for the project. Adherence to these guidelines is mandatory to ensure a high-quality, consistent, and maintainable codebase. Automated tools (ESLint, Prettier) are in place to enforce most of these rules.

## Core Mandates

- **Clarity Over Cleverness:** Code should be immediately understandable. If a piece of logic is inherently complex, it must be accompanied by comments explaining the _why_, not the _what_.
- **Embrace Immutability:** Never mutate props, state, or Redux state directly. Utilize functional patterns and the tools provided by React and Redux Toolkit to ensure predictable state transitions.

## TypeScript Conventions

- **`interface` vs. `type`**:
  - Use `interface` when defining the shape of an object or a class. This includes component props and API response objects.
  - Use `type` for all other cases, including primitive aliases, unions, and intersections.
- **Type-Only Imports**: The `verbatimModuleSyntax` rule is enabled. All imports of types or interfaces **must** use the `import type` syntax.
  - `import type { MyInterface } from './types';`
- **Naming**:
  - All types, interfaces, and components must be `PascalCase`.
  - All functions, variables, and hooks must be `camelCase`.

## React & JSX Conventions

- **Component Definition**: Use function declarations with the `const` keyword for components.
  - `const MyComponent: React.FC<Props> = () => { ... };`
- **Props**:
  - Props must be destructured at the beginning of the component.
  - Props interfaces should be defined directly above the component.
- **Hooks**:
  - Custom hooks must be prefixed with `use` (e.g., `useUserData`).
  - Hook logic should be self-contained and not rely on the component's internal logic.

## SCSS & Styling

- **BEM Nesting**: A strict BEM-style nesting convention within SCSS Modules is required. This is our primary mechanism for avoiding style collisions and maintaining a readable style structure.
  ```scss
  .card {
    &__title { ... }
    &__body { ... }
    &--is-disabled { ... }
  }
  ```
- **Use Design Tokens**: Never hard-code colors, font sizes, or spacing. Always use the SCSS variables defined in `src/assets/styles/_variables.scss`.

## Import Order

Our linting configuration automatically enforces a consistent import order to reduce merge conflicts and improve readability. The standard grouping is:

1.  External dependencies (`react`, `react-router-dom`).
2.  Internal aliases (`@components`, `@store`).
3.  Relative imports (`../`, `./`).
4.  Style imports (`.scss`).
