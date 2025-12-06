# Project Architecture Guide

This document provides a comprehensive overview of the architectural decisions, patterns, folder structure, and coding conventions that govern this project. Its purpose is to ensure consistency and maintain a high standard of quality as the application evolves.

**Related Documentation:**

- **[SDLC-STANDARDS.md](./SDLC-STANDARDS.md)** - SDLC principles, testing, security, deployment
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development workflow, PR process
- **[GETTING-STARTED.md](./GETTING-STARTED.md)** - Setup and onboarding
- **[DOCKER.md](./DOCKER.md)** - Containerization and orchestration

---

## 🎯 Guiding Principles

Our architecture is founded on principles that promote a clean, scalable, and maintainable codebase built for growth.

### Scalability First

This template is designed to scale from single-developer projects to enterprise-level applications with 50+ developers:

- **Modular Structure:** Domain-based organization that prevents code entanglement
- **Clear Boundaries:** Feature slices with independent state management
- **Team-Friendly:** Clear naming conventions and patterns enable rapid onboarding
- **Monorepo-Ready:** Can be extended to monorepo setups (Nx, Turborepo)
- **Microservices-Compatible:** Service layer abstraction enables backend migration

### DRY (Don't Repeat Yourself)

This is a cornerstone of our development philosophy. We actively avoid code duplication by:

- **Abstracting UI Logic:** Creating reusable, generic components in `src/components/common/`
- **Abstracting Business Logic:** Encapsulating shared stateful logic within custom React hooks in `src/hooks/`
- **Abstracting State Logic:** Using pre-typed Redux hooks (`useAppSelector`/`useAppDispatch`) to avoid repetitive type definitions
- **Abstracting Utility Logic:** Centralizing pure, reusable functions (validators, formatters, transformers) in `src/utils/`
- **Abstracting API Logic:** Organizing domain-specific API services in `src/services/`

### KISS (Keep It Simple, Stupid)

We prioritize simplicity and clarity over complex abstractions:

- **Focused Components:** Each component should have a single, well-defined responsibility
- **Minimal Abstraction:** Introduce abstractions only when a clear pattern of repetition emerges
- **Clear Naming:** Use descriptive, self-documenting names for files, functions, and variables
- **Avoid Over-Engineering:** Don't anticipate future needs; solve problems as they arise

---

## 📁 Complete Directory Structure

```
src/
├── components/
│   ├── common/                      # Generic, reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx           # Component implementation
│   │   │   ├── Button.module.scss   # Scoped styles
│   │   │   ├── Button.test.tsx      # Unit tests
│   │   │   └── index.ts             # Named export
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── index.ts                 # Export all common components
│   │
│   └── layout/                      # Structural layout components
│       ├── Header/
│       │   ├── Header.tsx
│       │   ├── Header.module.scss
│       │   └── Header.test.tsx
│       ├── Footer/
│       ├── Sidebar/
│       └── index.ts
│
├── pages/                           # Full page / route components
│   ├── Home/
│   │   ├── Home.tsx
│   │   ├── Home.module.scss
│   │   └── Home.test.tsx
│   ├── About/
│   └── NotFound/
│
├── router/                          # Route definitions
│   └── AppRouter.tsx                # React Router configuration
│
├── store/                           # Redux Toolkit state management
│   ├── store.ts                     # Store configuration
│   ├── hooks.ts                     # Pre-typed Redux hooks (ALWAYS USE THESE)
│   └── slices/                      # Feature-based Redux slices
│       ├── counterSlice.ts
│       ├── userSlice.ts
│       └── [feature]Slice.ts
│
├── hooks/                           # Custom React hooks
│   ├── useUserData.ts
│   ├── usePaginatedList.ts
│   └── index.ts                     # Hook exports
│
├── services/                        # API communication layer
│   ├── authService.ts               # Authentication API calls
│   ├── userService.ts               # User-related API calls
│   ├── productService.ts            # Product-related API calls
│   └── index.ts                     # Service exports
│
├── constants/                       # Application-wide constants
│   └── index.ts                     # API endpoints, status values, feature flags
│
├── styles/                          # Global styles & design tokens
│   ├── global.scss                  # Global styles, resets, base styles
│   ├── _variables.scss              # Design tokens: colors, typography, spacing
│   └── _mixins.scss                 # Reusable SCSS mixins
│
├── utils/                           # Pure utility functions
│   ├── axiosInstance.ts             # Pre-configured axios instance
│   ├── validators.ts                # Form/data validators
│   ├── formatters.ts                # Date, number, string formatters
│   └── [utility].ts
│
├── types/                           # Shared TypeScript interfaces/types
│   ├── index.ts                     # Main type exports
│   ├── api.ts                       # API response types
│   ├── domain.ts                    # Domain-specific types
│   └── global.d.ts                  # Global type declarations
│
├── assets/                          # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── App.tsx                          # Root component
├── index.css                        # Root CSS (minimal, import global.scss here)
├── main.tsx                         # Application entry point
└── vite-env.d.ts                    # Vite environment types
```

---

## 🏛️ Key Architectural Patterns

### 1. Component Organization & Co-location

**Principle:** Related files (component, styles, tests) are stored together in the same directory.

#### Simple Components (Single Component)

```
Button/
├── Button.tsx           # Component logic
├── Button.module.scss   # Component-scoped styles
└── Button.test.tsx      # Component tests
```

⚠️ **NO index.ts needed** - Import directly: `import Button from './Button/Button'`

#### Complex Components (With Sub-components)

```
ComplexComponent/
├── ComplexComponent.tsx       # Main component
├── ComplexComponent.module.scss
├── ComplexComponent.test.tsx
├── SubComponent.tsx           # Sub-component
├── AnotherSubComponent.tsx    # Sub-component
└── index.ts                   # Only export when multiple pieces
```

**Component Types:**

- **`common/` Components:** Generic, reusable UI components (Button, Card, Modal, Input)
  - Application-agnostic
  - Highly configurable via props
  - Include TypeScript interfaces for props
  - Should have comprehensive unit tests
  - **Simple components:** NO index.ts needed
  - **Complex components:** Use index.ts for multiple related pieces

- **`layout/` Components:** Structural components that define application structure (Header, Footer, Sidebar)
  - Application-specific
  - Composed from common components and pages
  - May have state management integration
  - **Usually simple:** Direct imports recommended

- **`pages/` Components:** Full-page components tied directly to routes
  - Represent complete views
  - Compose layout and feature components
  - Handle page-level state and routing

### 2. State Management with Redux Toolkit

**Store Configuration (`src/store/store.ts`):**

```typescript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';

export const store = configureStore({
  reducer: {
```

    counter: counterReducer,
    // Add feature slices here

},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

````

**Feature Slices (`src/store/slices/[feature]Slice.ts`):**

Feature-based Redux slices organize state by domain:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = { value: 0 };

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Selectors
export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
````

**Pre-typed Hooks (`src/store/hooks.ts`):**

**IMPORTANT:** Always use these pre-typed hooks instead of importing directly from Redux:

```typescript
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { increment, selectCount } from '@store/slices/counterSlice';

const MyComponent = () => {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(increment())}>
      Count: {count}
    </button>
  );
};
```

### 3. Custom Hooks (Stateful Logic Abstraction)

Custom hooks abstract common stateful logic following the DRY principle:

**When to Create a Custom Hook:**

- Logic appears in 2+ components
- Component logic is complex and hard to understand
- Need to share behavior between components

**Example: `useUserData` Hook**

```typescript
// src/hooks/useUserData.ts
import { useState, useEffect } from 'react';
import { userService } from '@services';

export const useUserData = (userId: string) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    userService
      .getUserById(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
};
```

**Usage:**

```typescript
const MyComponent = ({ userId }: { userId: string }) => {
  const { user, loading, error } = useUserData(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{user?.name}</div>;
};
```

### 4. API Communication & Services

Services encapsulate all API communication in a reusable, testable layer:

**Principles:**

- Organize services by domain (authService, userService, productService)
- All services use the pre-configured axios instance
- Return strongly-typed responses
- Handle errors gracefully
- Keep services pure (no component logic)

**Example: `userService`**

```typescript
// src/services/userService.ts
import type { User, UserCreateRequest } from '@types';
import { axiosInstance } from '@utils/axiosInstance';

export const userService = {
  async getUser(id: string): Promise<User> {
    const { data } = await axiosInstance.get(`/users/${id}`);
    return data;
  },

  async createUser(payload: UserCreateRequest): Promise<User> {
    const { data } = await axiosInstance.post('/users', payload);
    return data;
  },

  async updateUser(id: string, payload: Partial<User>): Promise<User> {
    const { data } = await axiosInstance.put(`/users/${id}`, payload);
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    await axiosInstance.delete(`/users/${id}`);
  },
};
```

### 5. Styling Strategy

**Global Styles (`src/styles/global.scss`):**

- Global resets and base styles
- Never scoped to specific components

**Design Tokens (`src/styles/_variables.scss`):**

- All colors, typography, spacing, shadows
- Single source of truth for design decisions
- Enables easy theme changes

**Reusable Mixins (`src/styles/_mixins.scss`):**

- Common patterns (flexbox layouts, media queries, truncation)
- Eliminates repetitive CSS

**Component Styles (`Component.module.scss`):**

- CSS Modules for scoped styling
- BEM-style nesting for clarity
- Never use global class names

**BEM Nesting Convention:**

```scss
// Button.module.scss
.button {
  // Base button styles
  padding: $spacing-3 $spacing-4;
  background-color: $color-primary;

  // Nested child elements
  &__icon {
    margin-right: $spacing-2;
  }

  &__text {
    font-weight: $font-weight-semibold;
  }

  // Modifier variants
  &--secondary {
    background-color: $color-secondary;
  }

  &--large {
    padding: $spacing-4 $spacing-6;
    font-size: $font-size-lg;
  }

  // States
  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

**Usage:**

```typescript
import styles from './Button.module.scss';

const Button = ({ variant = 'primary', size = 'medium', children }) => (
  <button
    className={`${styles.button} ${styles[`--${variant}`]} ${styles[`--${size}`]}`}
  >
    {children}
  </button>
);
```

---

## 💻 Code Style & Conventions

### TypeScript Conventions

**`interface` vs. `type`:**

- Use `interface` for object shapes and contract definitions:

  ```typescript
  interface ButtonProps {
    variant: 'primary' | 'secondary';
    onClick: () => void;
    children: React.ReactNode;
  }
  ```

- Use `type` for primitives, unions, and intersections:
  ```typescript
  type Status = 'idle' | 'loading' | 'success' | 'error';
  type Nullable<T> = T | null;
  ```

**Type-Only Imports:**

The `verbatimModuleSyntax` rule is enabled. All type imports must use the `import type` syntax:

```typescript
import type { User, ApiResponse } from '@types';
import { userService } from '@services'; // Regular import for values
```

**Naming Conventions:**

- `PascalCase`: Types, interfaces, components, enums

  ```typescript
  interface ButtonProps {}
  type UserStatus = 'active' | 'inactive';
  const MyComponent = () => {};
  ```

- `camelCase`: Functions, variables, hooks, properties

  ```typescript
  const getUserData = () => {};
  const isLoading = true;
  const useUserData = () => {};
  ```

- `UPPER_SNAKE_CASE`: Constants
  ```typescript
  const API_BASE_URL = 'https://api.example.com';
  const MAX_RETRIES = 3;
  ```

### React Component Conventions

**Functional Components with `const`:**

```typescript
interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.card__title}>{title}</h2>
      <div className={styles.card__body}>{children}</div>
    </div>
  );
};

export default Card;
```

**Props & Destructuring:**

```typescript
// ✅ Good: Props destructured at the beginning
const Button: React.FC<ButtonProps> = ({ variant = 'primary', onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

// ❌ Avoid: Props not destructured
const Button: React.FC<ButtonProps> = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};
```

**Custom Hooks:**

```typescript
// Hook names must start with 'use'
export const useUserData = (userId: string) => {
  const [data, setData] = useState(null);
  // Hook logic...
  return { data };
};

// Usage
const user = useUserData('123');
```

**Component Props Organization:**

```typescript
interface MyComponentProps {
  // Required props first
  id: string;
  title: string;

  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  disabled?: boolean;

  // Event handlers last
  onClick?: () => void;
  onChange?: (value: string) => void;
}
```

### Import Order

Organize imports to reduce merge conflicts and improve readability:

```typescript
// 1. External dependencies
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal aliases
import { Button } from '@components/common';
import { useAppSelector } from '@store/hooks';
import { userService } from '@services';
import type { User } from '@types';

// 3. Relative imports
import { formatDate } from '../utils/formatters';

// 4. Styles (last)
import styles from './MyComponent.module.scss';
```

### Redux & State Management

**Always use pre-typed hooks:**

```typescript
// ✅ Good
import { useAppSelector, useAppDispatch } from '@store/hooks';

// ❌ Avoid
import { useDispatch, useSelector } from 'react-redux';
```

**Organize state by feature:**

```typescript
// ✅ Good: Separate, focused slices
store.ts
├── slices/
│   ├── authSlice.ts
│   ├── userSlice.ts
│   └── productsSlice.ts

// ❌ Avoid: Monolithic reducer
store.ts
└── slices/
    └── appSlice.ts  // Everything in one slice
```

**Define and use selectors:**

```typescript
// ✅ Good
export const selectUserEmail = (state: RootState) => state.user.email;

const email = useAppSelector(selectUserEmail);

// ❌ Avoid
const email = useAppSelector((state) => state.user.email); // In component
```

### SCSS & Styling

**Use design tokens from `_variables.scss`:**

```scss
// ✅ Good
.button {
  background-color: $color-primary;
  padding: $spacing-4;
  font-size: $font-size-base;
}

// ❌ Avoid: Hardcoded values
.button {
  background-color: #007bff;
  padding: 1rem;
  font-size: 16px;
}
```

**Use mixins for common patterns:**

```scss
// ✅ Good
.container {
  @include flex-center;
  gap: $spacing-4;
}

// ❌ Avoid: Repetitive code
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
```

**Use responsive mixins:**

```scss
.card {
  padding: $spacing-4;

  @include md {
    padding: $spacing-6;
  }

  @include lg {
    padding: $spacing-8;
  }
}
```

---

## ✅ Testing Strategy

**Co-location:** Test files are stored alongside the files they test:

```
Button/
├── Button.tsx
├── Button.test.tsx          # Tests for Button component
└── Button.module.scss
```

**Testing Best Practices:**

1. **Focus on user behavior**, not implementation details
2. **Test what users see and do**, not how components work internally
3. **Avoid testing implementation details** (state, props drilling, etc.)
4. **Use descriptive test names** that explain what is being tested

**Example Test:**

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button onClick={jest.fn()}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🚀 Best Practices Summary

| Principle           | Implementation                                              | Benefit                                       |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------- |
| **DRY**             | Extract reusable hooks, components, services, utilities     | Reduced code duplication, easier maintenance  |
| **KISS**            | Simple, focused components with single responsibility       | Easier to understand, test, and maintain      |
| **Co-location**     | Store component, styles, tests together                     | Easier navigation, better organization        |
| **Type Safety**     | Use TypeScript, pre-typed hooks, type-only imports          | Catch errors early, better IDE support        |
| **Design Tokens**   | Centralize colors, typography, spacing in `_variables.scss` | Consistency, easy theming, reduced hardcoding |
| **Service Layer**   | Centralize API communication in `services/`                 | Reusable, testable, easier error handling     |
| **Pre-typed Hooks** | Use Redux hooks from `@store/hooks`                         | Consistent typing, reduced boilerplate        |
| **BEM Nesting**     | Use BEM convention in SCSS Modules                          | Clear, maintainable styles, no conflicts      |
| **Testing Focus**   | Test user behavior, not implementation                      | More robust, less brittle tests               |

---

## 📖 Further Reading

- [Component Patterns in React](https://react.dev/reference/react)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Testing Library](https://testing-library.com/react)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [BEM Methodology](http://getbem.com/)

---

## 🚀 Scaling Your Application

### Phase 1: Team Growth (5-10 developers)

**Focus:** Consistency and clear communication

- ✅ Enforce ESLint and Prettier via pre-commit hooks
- ✅ Require tests for all new features (80%+ coverage)
- ✅ Establish code review process (1+ approval)
- ✅ Document architectural decisions in ADRs (Architecture Decision Records)
- ✅ Setup CI/CD pipeline for automated testing

### Phase 2: Feature Scaling (10-30 developers)

**Focus:** Modular architecture and state management

- ✅ Split Redux slices by feature domains
- ✅ Implement API versioning (`/api/v1/`, `/api/v2/`)
- ✅ Add feature flags for A/B testing
- ✅ Implement code splitting and lazy loading
- ✅ Setup performance monitoring (Sentry, DataDog)
- ✅ Create shared component library (`@components/`)

### Phase 3: Enterprise Scale (30+ developers)

**Focus:** Monorepo and microfrontends

- ✅ Migrate to monorepo (Nx, Turborepo, pnpm workspaces)
- ✅ Separate concerns: UI, business logic, API
- ✅ Implement microfrontend architecture
- ✅ Setup advanced CI/CD (parallel builds, caching)
- ✅ Implement design system versioning
- ✅ Multi-region deployment strategy

### Performance Optimization Checklist

| Item                | Impact         | Priority | Status |
| ------------------- | -------------- | -------- | ------ |
| Code splitting      | ⬇️ 40% bundle  | High     | - [ ]  |
| Image optimization  | ⬇️ 30% assets  | High     | - [ ]  |
| Lazy loading routes | ⬇️ 50% LCP     | High     | - [ ]  |
| Service worker      | ⬆️ 2x faster   | Medium   | - [ ]  |
| CDN caching         | ⬇️ 60% latency | Medium   | - [ ]  |
| HTTP/2 push         | ⬆️ 15% perf    | Medium   | - [ ]  |
| Compression (gzip)  | ⬇️ 70% size    | High     | - [ ]  |

### Deployment at Scale

**Development:**

```
Local Dev → Docker Container → Vite HMR → Browser
```

**Production:**

```
Source Code → Git → CI/CD Pipeline → Docker Build → Registry
  ↓
Docker Compose → Kubernetes → Load Balancer → CDN → Users
```

See [DOCKER.md](./DOCKER.md) and [DOCKER-PROD.md](./DOCKER-PROD.md) for detailed deployment strategies.

---

## 📈 Monitoring & Observability

As your application scales, implement:

1. **Error Tracking:** Sentry, Rollbar
2. **Performance Monitoring:** DataDog, New Relic, Grafana
3. **Analytics:** Mixpanel, Amplitude, Google Analytics
4. **Logging:** ELK Stack, CloudWatch, Splunk
5. **Health Checks:** Uptime monitoring, synthetic tests
6. **Alerting:** PagerDuty, OpsGenie for on-call rotation

**Recommended metrics to track:**

- Page Load Time (LCP, FCP, CLS)
- Error Rate (exceptions per second)
- API Response Time (p50, p95, p99)
- User Count (daily, monthly)
- Deployment Frequency
- Lead Time for Changes
- Mean Time to Recovery (MTTR)
