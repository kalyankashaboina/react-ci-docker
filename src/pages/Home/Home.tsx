import React from 'react';
import Button from '@components/common/Button/Button';
import styles from './Home.module.scss';
import { FaRocket, FaShieldAlt, FaCode, FaCogs, FaPaintBrush, FaGithub } from 'react-icons/fa';

const Home: React.FC = () => {
  const test = "double quotes should be single yup"; 

  return (
    <main className={styles.home}>
      {/* Hero Section */}
      <section className={`${styles.home__hero} ${styles.fadeIn}`} data-testid="hero-section">
        <h1 className={styles.home__heroTitle}>React + TypeScript Starter Kit</h1>
        <p className={styles.home__heroSubtitle}>
          Build production-ready apps fast with Vite, Redux Toolkit, SCSS, ESLint, Prettier, and
          professional architecture.
        </p>
        <div className={styles.home__heroCta}>
          <Button>Get Started</Button>
          <Button variant="secondary">Learn More</Button>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`${styles.home__features} ${styles.fadeIn}`}
        data-testid="features-section"
      >
        <h2 className={styles.home__featuresTitle}>Why Choose This Template</h2>
        <div className={styles.home__featuresCards}>
          {[
            {
              icon: <FaRocket />,
              title: 'Fast Setup',
              desc: 'Preconfigured Vite, Redux Toolkit, SCSS for scalable apps.',
            },
            {
              icon: <FaShieldAlt />,
              title: 'Secure & Reliable',
              desc: 'ESLint, Prettier, Husky enforce best practices.',
            },
            {
              icon: <FaCogs />,
              title: 'Reusable Components',
              desc: 'Modular UI components following DRY/KISS principles.',
            },
            {
              icon: <FaCode />,
              title: 'Modern Tech Stack',
              desc: 'React, TypeScript, Redux Toolkit, Vite & SCSS.',
            },
            {
              icon: <FaPaintBrush />,
              title: 'Professional UI',
              desc: 'Clean, responsive design with SCSS variables.',
            },
          ].map((f, idx) => (
            <div key={idx} className={`${styles.home__featuresCard} ${styles.fadeInUp}`}>
              {f.icon && <div className={styles.home__featuresCardIcon}>{f.icon}</div>}
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools & Best Practices Section */}
      <section className={`${styles.home__tools} ${styles.fadeIn}`} data-testid="tools-section">
        <h2 className={styles.home__toolsTitle}>Included Tools & Best Practices</h2>
        <div className={styles.home__toolsCards}>
          {[
            { label: 'ESLint & Prettier' },
            { label: 'Husky & Lint-Staged' },
            { label: 'Redux Toolkit' },
            { label: 'SCSS & Variables' },
            { label: 'DRY / KISS Principles' },
            {
              label: 'Architecture.md',
              link: 'https://github.com/kalyankashaboina/create-react-vite-starter-template/blob/master/ARCHITECTURE.md',
            },
            {
              label: 'CodeStyle.md',
              link: 'https://github.com/kalyankashaboina/create-react-vite-starter-template/blob/master/CODE_STYLE.md',
            },
          ].map((tool, idx) => (
            <div key={idx} className={styles.home__toolsCard}>
              {tool.link ? (
                <a href={tool.link} target="_blank" rel="noopener noreferrer">
                  {tool.label} <FaGithub className={styles.home__githubIcon} aria-label="GitHub" />
                </a>
              ) : (
                tool.label
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
