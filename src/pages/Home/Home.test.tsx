// src/pages/Home/Home.test.tsx

import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home Component', () => {
  beforeEach(() => {
    render(<Home />);
  });

  describe('Hero Section', () => {
    test('renders hero section with correct content', () => {
      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toBeInTheDocument();

      expect(screen.getByText(/React \+ TypeScript Starter Kit/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /Build production-ready apps with Vite, Redux Toolkit, SCSS, ESLint, Prettier, Docker, CI\/CD pipelines, and professional architecture./i,
        ),
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Learn More/i })).toBeInTheDocument();
    });
  });

  describe('Features Section', () => {
    test('renders features section with all feature cards', () => {
      const featuresSection = screen.getByTestId('features-section');
      expect(featuresSection).toBeInTheDocument();

      const featureTitles = [
        'Fast Setup',
        'Secure & Reliable',
        'Reusable Components',
        'Modern Tech Stack',
        'Professional UI',
        'Docker Support',
      ];

      featureTitles.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    test('renders feature descriptions', () => {
      expect(
        screen.getByText(/Preconfigured Vite, Redux Toolkit, SCSS for scalable apps./i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Pre-configured Dockerfiles for dev and production environments./i),
      ).toBeInTheDocument();
    });
  });

  describe('DevOps & CI/CD Section', () => {
    test('renders DevOps section with all cards', () => {
      const devopsSection = screen.getByTestId('devops-section');
      expect(devopsSection).toBeInTheDocument();

      const devopsTitles = [
        'Docker Containerization',
        'Automated CI/CD',
        'Code Quality',
        'Test Coverage',
      ];

      devopsTitles.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    test('renders DevOps descriptions', () => {
      expect(
        screen.getByText(/Isolated, reproducible environments with Docker & Docker Compose./i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/GitHub Actions for continuous integration and deployment./i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Jest & React Testing Library with 100% code coverage./i),
      ).toBeInTheDocument();
    });
  });

  describe('Tools Section', () => {
    test('renders tools section', () => {
      const toolsSection = screen.getByTestId('tools-section');
      expect(toolsSection).toBeInTheDocument();

      const toolLabels = [
        'ESLint & Prettier',
        'Husky & Lint-Staged',
        'Redux Toolkit',
        'SCSS & Variables',
        'Docker & Compose',
        'GitHub Actions',
        'Jest & RTL',
        'DRY / KISS Principles',
      ];

      toolLabels.forEach((label) => {
        const elements = screen.getAllByText(label, { exact: false });
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    test('renders GitHub links in tools section', () => {
      const githubLinks = screen.getAllByRole('link', { name: /GitHub/i });
      expect(githubLinks.length).toBeGreaterThanOrEqual(1);

      githubLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    test('renders tool cards', () => {
      // We have 8 regular tools + 2 GitHub links = 10 total items, but only 10 testids
      const toolCardsToCheck = 8; // Only check for 8 tool cards (without GitHub links)
      for (let i = 0; i < toolCardsToCheck; i++) {
        const toolCard = screen.getByTestId(`tool-card-${i}`);
        expect(toolCard).toBeInTheDocument();
      }
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();

      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s.length).toBeGreaterThanOrEqual(3);
    });

    test('GitHub icon has aria-label', () => {
      const githubIcons = screen.getAllByLabelText('GitHub');
      expect(githubIcons.length).toBeGreaterThan(0);
    });

    test('buttons have proper roles', () => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });
});
