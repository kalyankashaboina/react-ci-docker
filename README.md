# Vite + React + TypeScript: Professional Starter Template

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Code Coverage](https://codecov.io/gh/kalyankashaboina/create-react-vite-starter-template/branch/master/graph/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)
![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

A **production-ready, enterprise-grade starter template** for building scalable and maintainable web applications. Built with Vite, React, and TypeScript, this template provides a robust foundation with focus on SDLC principles, developer experience, code quality, and performance.

**Perfect for:**

✅ Scalable applications (not just small projects)  
✅ Teams following SDLC standards (DRY, KISS, SOLID)  
✅ Enterprise-grade requirements  
✅ Microservice-ready architecture  
✅ Monorepo integration  
✅ Multi-environment deployments

---

## 🎯 Core Philosophy

This template is built upon a component-based architecture and adheres to **SDLC best practices**. Our guiding principles are:

- **Scalability:** Domain-driven, feature-based structure that grows with complexity
- **Maintainability:** Enforcing code consistency through linting, formatting, and clear architectural patterns
- **Developer Experience:** Pre-configured tools, comprehensive documentation, and onboarding guides
- **DRY (Don't Repeat Yourself):** Abstracting common logic into reusable utilities, hooks, components, and services
- **KISS (Keep It Simple, Stupid):** Prioritizing simplicity and clarity over unnecessary complexity
- **SOLID Principles:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion

**Learn more:** See [SDLC-STANDARDS.md](./SDLC-STANDARDS.md) for detailed principles and implementation patterns.

---

## 📚 Documentation

| Guide                                    | Purpose                                           | Audience           | Status        |
| ---------------------------------------- | ------------------------------------------------- | ------------------ | ------------- |
| **[README.md](./README.md)**             | Project overview, quick setup, and features       | All developers     | ✅ Core guide |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Project structure, patterns, and conventions      | All developers     | ✅ Essential  |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | Development workflow, PR process, standards       | Contributors       | ✅ Essential  |
| **[DOCKER.md](./DOCKER.md)**             | Docker development, Docker Compose, orchestration | Developers, DevOps | ✅ Essential  |
| **[DOCKER-PROD.md](./DOCKER-PROD.md)**   | Production Docker builds, deployment, scaling     | DevOps, Platform   | ✅ Essential  |

---

## ✨ Features

| Category             | Feature                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| **Core Framework**   | Vite 5, React 19, TypeScript 5                                             |
| **State Management** | Redux Toolkit (RTK) with pre-typed `useAppSelector`/`useAppDispatch` hooks |
| **Styling**          | SCSS with CSS Modules, BEM nesting & centralized design tokens             |
| **Routing**          | React Router v7                                                            |
| **Testing**          | Jest & React Testing Library for unit and integration tests                |
| **Code Quality**     | ESLint & Prettier configured to work together                              |
| **Git Hooks**        | Husky & lint-staged for pre-commit linting and formatting                  |
| **Imports**          | Absolute path aliases (`@components`, `@store`, `@hooks`, etc.)            |
| **Docker Support**   | Multi-stage Dockerfiles for dev, prod, and orchestration                   |
| **SDLC Ready**       | Built for scalable applications following industry standards               |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+ LTS** (recommended 20+) - [Download](https://nodejs.org/)
- **npm 9+** or **yarn 3+**
- **Git**
- **Docker** (for containerized development) - [Download](https://www.docker.com/)

### Quick Setup (Local Development)

```bash
# 1. Clone repository
git clone <repository-url> your-project-name
cd your-project-name

# 2. Install dependencies
npm install

# 3. Set up environment (copy .env.example or create .env.local)
cp .env.example .env.local
# Edit .env.local with your configuration
# VITE_API_BASE_URL=http://localhost:3000/api

# 4. Start development server with HMR
npm run dev
# Access at http://localhost:5173
```

### Setup with Docker

```bash
# Build development image
docker build -f Dockerfile -t my-app-dev:latest .

# Run with hot reload
docker run -it -p 5173:5173 \
  --volume $(pwd):/app \
  --volume /app/node_modules \
  my-app-dev:latest

# Access at http://localhost:5173
```

### Detailed Setup

For comprehensive setup instructions with environment configuration, database setup, and troubleshooting, refer to the project documentation:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Project structure and patterns
- **[DOCKER.md](./DOCKER.md)** - Docker development & orchestration
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Team workflows and standards

---

## 📜 Available Scripts

| Script                  | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| `npm run dev`           | Starts the development server with Hot Module Replacement (HMR). |
| `npm run build`         | Compiles and bundles the application for production.             |
| `npm run preview`       | Preview the production build locally before deployment.          |
| `npm run test`          | Runs the unit and integration test suite via Jest.               |
| `npm run test:coverage` | Runs tests and generates coverage report.                        |
| `npm run lint`          | Analyzes code for linting errors and warnings.                   |
| `npm run lint:fix`      | Automatically fixes linting errors where possible.               |
| `npm run format`        | Formats the entire codebase using Prettier.                      |

---

## 📁 Project Structure

The project follows a domain-based, feature-oriented architecture with co-located components and styles:

```
src/
├── components/              # Reusable React components
│   ├── common/             # Generic UI components (Button, Card, etc.)
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.module.scss
│   │       └── Button.test.tsx
│   └── layout/             # Layout components (Header, Footer, Sidebar)
│
├── pages/                  # Page/route components
│   └── Home/
│       ├── Home.tsx
│       ├── Home.module.scss
│       └── Home.test.tsx
│
├── store/                  # Redux state management
│   ├── store.ts           # Store configuration
│   ├── hooks.ts           # Pre-typed Redux hooks
│   └── slices/            # Redux slices (features)
│       └── counterSlice.ts
│
├── hooks/                  # Custom React hooks
│   └── index.ts           # Hook exports
│
├── services/              # API communication layer
│   └── index.ts           # Service exports
│
├── constants/             # Application-wide constants
│   └── index.ts           # Constant definitions
│
├── styles/                # Global styles
│   ├── global.scss        # Global styles & resets
│   ├── _variables.scss    # Design tokens & variables
│   └── _mixins.scss       # Reusable SCSS mixins
│
├── utils/                 # Utility functions
│   └── axiosInstance.ts   # Configured axios instance
│
├── types/                 # Shared TypeScript types
│   └── index.ts
│
├── router/                # Route definitions
│   └── AppRouter.tsx
│
├── assets/                # Static assets
│   └── images/
│
├── App.tsx                # Root component
├── index.css              # Root CSS
└── main.tsx               # Application entry point
```

---

## 🏗️ Architecture Highlights

### Component Organization

Components are organized by their scope and purpose:

- **`common/`:** Small, reusable UI components that are application-agnostic
- **`layout/`:** Structural components that define the application's layout and appearance
- **`pages/`:** Full-page components tied directly to routes

Each component follows the **co-location principle**:

#### Simple Components (No index.ts needed)

```
Button/
├── Button.tsx          # Component implementation
├── Button.module.scss  # Scoped styles (CSS Modules)
└── Button.test.tsx     # Unit tests
```

Import directly: `import Button from '@components/common/Button/Button'`

#### Complex Components (Multiple pieces)

```
ComplexComponent/
├── ComplexComponent.tsx
├── ComplexComponent.module.scss
├── ComplexComponent.test.tsx
├── SubComponent.tsx
└── index.ts            # Optional - only for exports
```

### State Management

Redux Toolkit manages global state with a feature-based approach:

- Store is configured in `src/store/store.ts`
- Feature slices are organized in `src/store/slices/`
- Pre-typed hooks are provided in `src/store/hooks.ts` for DRY principle compliance

**Always use pre-typed hooks** in your components:

```typescript
import { useAppSelector, useAppDispatch } from '@store/hooks';
```

### Styling Strategy

- **Global styles:** Centralized in `src/styles/global.scss`
- **Design tokens:** All colors, typography, spacing, shadows defined in `src/styles/_variables.scss`
- **Reusable patterns:** SCSS mixins in `src/styles/_mixins.scss`
- **Component styles:** CSS Modules co-located with components (e.g., `Button.module.scss`)
- **Naming convention:** BEM-style nesting within SCSS Modules

```scss
// Button.module.scss
.button {
  &__text {
    /* nested */
  }
  &--primary {
    /* modifier */
  }
  &:hover {
    /* state */
  }
}
```

### Custom Hooks

Custom hooks abstract common stateful logic:

- Fetch data from APIs
- Manage pagination or filtering
- Handle browser storage (localStorage, sessionStorage)
- Subscribe to external events

**Principle:** If you see the same logic repeated in 2+ components, create a custom hook.

### Services & API Communication

API communication is centralized in `src/services/`:

- Each service handles a single domain (e.g., `authService`, `userService`)
- Services use the pre-configured axios instance from `src/utils/axiosInstance.ts`
- All services return strongly-typed responses
- Handle errors gracefully and throw meaningful messages

---

## 🎨 Styling & Design Tokens

All design tokens are centralized for consistency and easy maintenance:

**Colors:**

```scss
@use '@styles/variables' as *;

.card {
  background-color: $color-white;
  border: 1px solid $border-color;
  color: $color-gray-900;
}
```

**Typography:**

```scss
h1 {
  @include text-style($font-size-4xl, $font-weight-bold, $line-height-tight);
}
```

**Responsive Design:**

```scss
.container {
  padding: $spacing-4;

  @include md {
    padding: $spacing-8;
  }

  @include lg {
    padding: $spacing-12;
  }
}
```

---

## 📝 Code Conventions

### TypeScript

- Use `interface` for object shapes and component props
- Use `type` for primitives, unions, and intersections
- All imports of types must use `import type` syntax
- Names: `PascalCase` for types/interfaces/components, `camelCase` for functions/variables

### React Components

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, onClick }) => {
  return (
    <button onClick={onClick} className={`button button--${variant}`}>
      {children}
    </button>
  );
};

export default Button;
```

### Redux & State

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

---

## 🧪 Testing

Tests are co-located with components using the `*.test.tsx` suffix:

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button onClick={jest.fn()}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

Run tests with:

```bash
npm run test              # Run tests
npm run test:coverage     # Generate coverage report
```

---

## 🐳 Docker Support

### Development Environment

```bash
docker build -f Dockerfile -t react-app-dev .
docker run -p 5173:5173 react-app-dev
```

### Production Build

```bash
docker build -f Dockerfile.prod -t react-app-prod .
docker run -p 80:80 react-app-prod
```

For detailed Docker instructions, see [README-DOCKER.md](./README-DOCKER.md) and [README-DOCKER-PROD.md](./README-DOCKER-PROD.md).

---

## 🤝 Contributing

We welcome contributions! Please read our **[Contributing Guide](./CONTRIBUTING.md)** to learn about:

- **Development workflow:** Feature branches, commit conventions
- **Code standards:** TypeScript, React patterns, SCSS organization
- **Pull request process:** Testing, linting, review requirements
- **Git workflow:** Branch naming, merge strategies, deployment

---

## 📊 Project Status

| Component      | Coverage    | Health     | Notes                          |
| -------------- | ----------- | ---------- | ------------------------------ |
| **Tests**      | TBD         | 📊 Monitor | Set coverage target: 80%+      |
| **Build**      | ✅ 0 errors | ✅ Passing | Vite optimized builds          |
| **Lint**       | ✅ 0 errors | ✅ Passing | ESLint enforced via pre-commit |
| **Docker**     | ✅ 2 stages | ✅ Tested  | Dev & Production ready         |
| **Deployment** | ✅ Ready    | ✅ CI/CD   | GitHub Actions / GitLab CI     |

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 🔗 Resources & Documentation

**Core Guides:**

- [Architecture Guide](./ARCHITECTURE.md) - Patterns, structure, and best practices
- [Contributing Guide](./CONTRIBUTING.md) - Development workflow and standards
- [Docker Guide](./DOCKER.md) - Development, orchestration, and deployment
- [Production Docker](./DOCKER-PROD.md) - Scaling, performance, and security

**External Resources:**

- [Vite Documentation](https://vitejs.dev/) - Build tool reference
- [React 19 Documentation](https://react.dev/) - React API and patterns
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [React Router v7](https://reactrouter.com/) - Client-side routing
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type system
- [Jest Testing](https://jestjs.io/) - Test framework
- [React Testing Library](https://testing-library.com/react) - Testing utilities

**Performance & Monitoring:**

- [Web Vitals](https://web.dev/vitals/) - Core Web Vitals metrics
- [Google PageSpeed Insights](https://pagespeed.web.dev/) - Performance analysis
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Auditing tool

---

## 💡 Tips for Scaling

1. **Code Organization:** Follow the domain-based feature structure in `ARCHITECTURE.md`
2. **State Management:** Use Redux slices per feature to keep state manageable
3. **API Communication:** Centralize in services layer for consistency
4. **Performance:** Implement code splitting and lazy loading early
5. **Testing:** Aim for 80%+ test coverage from the start
6. **Monitoring:** Set up error tracking and performance monitoring in staging
7. **Documentation:** Keep this documentation and code comments up-to-date
8. **Team Size:** Add detailed onboarding when scaling the team

See [ARCHITECTURE.md - Best Practices](./ARCHITECTURE.md#-best-practices-summary) for more details.
