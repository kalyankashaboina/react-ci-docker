// src/pages/Home/Home.test.tsx

import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home Component', () => {
  beforeEach(() => {
    render(<Home />);
  });

  test('renders hero section', () => {
    const heroSection = screen.getByTestId('hero-section');
    expect(heroSection).toBeInTheDocument();

    expect(screen.getByText(/React \+ TypeScript Starter Kit/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Build production-ready apps fast with Vite, Redux Toolkit, SCSS, ESLint, Prettier, and professional architecture./i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Learn More/i })).toBeInTheDocument();
  });

  test('renders features section', () => {
    const featuresSection = screen.getByTestId('features-section');
    expect(featuresSection).toBeInTheDocument();

    const featureTitles = [
      'Fast Setup',
      'Secure & Reliable',
      'Reusable Components',
      'Modern Tech Stack',
      'Professional UI',
    ];

    featureTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test('renders tools section', () => {
    const toolsSection = screen.getByTestId('tools-section');
    expect(toolsSection).toBeInTheDocument();

    const toolLabels = [
      'ESLint & Prettier',
      'Husky & Lint-Staged',
      'Redux Toolkit',
      'SCSS & Variables',
      'DRY / KISS Principles',
      'Architecture.md',
      'CodeStyle.md',
    ];

    toolLabels.forEach((label) => {
      // Use getAllByText to avoid errors if text appears multiple times
      const elements = screen.getAllByText(label, { exact: false });
      expect(elements.length).toBeGreaterThan(0);
    });

    const githubLinks = screen.getAllByRole('link', { name: /GitHub/i });
    expect(githubLinks.length).toBeGreaterThan(0);
  });
});
