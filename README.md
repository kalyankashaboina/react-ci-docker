# Vite + React + TypeScript: Professional Starter Template

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Code Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

A production-ready, enterprise-grade starter template for building scalable and maintainable web applications. This repository provides a robust foundation with a focus on developer experience, code quality, and performance.

---

## Core Philosophy

This template is built upon a component-based architecture and adheres to industry best practices. Our guiding principles are:

- **Scalability:** A clear and logical structure that can grow to support complex applications.
- **Maintainability:** Enforcing code consistency and readability through strict linting, formatting, and clear architectural patterns.
- **Developer Experience:** A streamlined setup with pre-configured tools to maximize productivity and minimize configuration overhead.

For a detailed explanation of our technical choices and structure, please see our **[Architecture Guide](./ARCHITECTURE.md)**.

---

## Features

| Category             | Feature                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| **Core Framework**   | Vite 5, React 18, TypeScript 5                                             |
| **State Management** | Redux Toolkit (RTK) with pre-typed `useAppSelector`/`useAppDispatch` hooks |
| **Styling**          | SCSS with CSS Modules & BEM-style nesting for scoped styles                |
| **Routing**          | React Router v6                                                            |
| **Testing**          | Jest & React Testing Library for unit and integration tests                |
| **Code Quality**     | ESLint & Prettier configured to work together                              |
| **Git Hooks**        | Husky & lint-staged for pre-commit linting and formatting                  |
| **Imports**          | Absolute path aliases (`@components`, `@store`, etc.)                      |

---

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url> your-project-name
    cd your-project-name
    ```

2.  **Install project dependencies:**
    ```bash
    npm install
    ```

---

## Available Scripts

| Script           | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `npm run dev`    | Starts the development server with Hot Module Replacement (HMR). |
| `npm run build`  | Compiles and bundles the application for production.             |
| `npm run test`   | Runs the unit and integration test suite via Jest.               |
| `npm run lint`   | Analyzes code for linting errors and warnings.                   |
| `npm run format` | Formats the entire codebase using Prettier.                      |

---

## Contribution

We welcome contributions! Please read our **[Contributing Guide](./CONTRIBUTING.md)** to learn about our development process, commit message conventions, and pull request workflow.
