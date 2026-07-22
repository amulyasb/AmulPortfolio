import { useEffect, useRef, useState } from 'react';

const headerMessages = ['A React Native Developer', 'Welcome to My Portfolio'];

const projects = [
  {
    title: 'Room Rental',
    subtitle: '(Academic Task)',
    image: '/images/roomrental.webp',
    alt: 'Room Rental web App Using Django, HTML, CSS, JS, Bootstrap',
    tech: ['Django', 'HTML5', 'CSS3', 'Bootstrap', 'PostgreSQL'],
    summary:
      'A full-featured platform for renting rooms, connecting sellers and customers with real-time communication and booking.',
    description:
      'The Room Rental WebApp is a full-featured web platform designed to streamline the process of renting rooms by connecting Sellers(brokers) and Customers(Room Sekeers) in a user-friendly and secure environment. This system simplifies Renting Room discovery, Real Time Communication, appointment booking, and Subscription Wise payments.',
    link: 'https://github.com/amulyasb/RoomRental',
  },
  {
    title: 'Django Todo List',
    image: '/images/todo.webp',
    alt: 'Django Todo App - Task management with Python/Django',
    tech: ['HTML5', 'CSS3', 'Bootstrap', 'PostgreSQL', 'Django'],
    summary: 'Todo app with user authentication, task management, and completion tracking.',
    description:
      'A full-featured Todo application with user authentication, task management, and completion tracking.',
    link: 'https://github.com/amulyasb/todo_Project',
  },
  {
    title: 'Trip Manager',
    image: '/images/TripManager.webp',
    alt: 'Trip Manager mobile app built with React Native',
    tech: ['React Native', 'JavaScript', 'Mobile App'],
    summary: 'React Native app for trip planning: itinerary organization, activity planning, and expense tracking.',
    description:
      'A React Native mobile app for managing trips with itinerary organization, activity planning, and expense tracking.',
    link: 'https://github.com/amulyasb/TripManagerMobile',
  },
  {
    title: 'Basic Calculator',
    image: '/images/calculator.webp',
    alt: 'Basic Calculator using python djnago. html, css, js, bootstrap',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    summary: 'A functional calculator supporting basic arithmetic with an intuitive interface.',
    description:
      'A functional calculator supporting basic arithmetic operations with intuitive interface.',
    link: 'https://github.com/amulyasb/SimpleCalculator',
  },
];

const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const heroTech = ['React Native', 'Expo', 'NativeWind', 'React', 'JavaScript', 'Bootstrap', 'Django', 'PostgreSQL'];

const heroFloats = ['React Native', 'Expo', 'NativeWind'];

const socialLinks = [
  { href: 'https://github.com/amulyasb', icon: 'fa-github', label: 'GitHub', rel: 'noopener' },
  { href: 'https://www.linkedin.com/in/amul-baidhya/', icon: 'fa-linkedin-in', label: 'LinkedIn', rel: 'noopener' },
  { href: 'https://www.instagram.com/amulyaaa.v/', icon: 'fa-instagram', label: 'Instagram', rel: 'nofollow noopener' },
  { href: 'https://www.facebook.com/amul.baidhya.71', icon: 'fa-facebook', label: 'Facebook', rel: 'nofollow noopener' },
];

const quickFacts = [
  { icon: 'fa-envelope', label: 'Email', value: 'amul.baidhya123@gmail.com' },
  { icon: 'fa-map-marker-alt', label: 'Location', value: 'Pokhara, Nepal' },
  { icon: 'fa-phone', label: 'Phone', value: '9860578607' },
  { icon: 'fa-briefcase', label: 'Experience', value: '1.5 Years' },
  { icon: 'fa-graduation-cap', label: 'Education', value: "Bachelor's in BIT" },
];

const skillGroups = [
  {
    title: 'Mobile Development',
    description: 'Cross-platform apps with a native feel.',
    icon: 'fa-mobile-screen-button',
    skills: ['React Native', 'Expo', 'NativeWind'],
  },
  {
    title: 'Frontend Foundations',
    description: 'Core web technologies behind every UI I build.',
    icon: 'fa-code',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind', 'Bootstrap'],
  },
  {
    title: 'Backend & Data',
    description: 'Server-side logic and data persistence.',
    icon: 'fa-database',
    skills: ['Django', 'PostgreSQL', 'SQLite'],
  },
];

const experience = [
  {
    date: '2025 to Present',
    company: 'Codex Pokhara',
    role: 'Developer',
    description:
      'Working on application development with a current focus on React Native mobile experiences, while applying my web development background where needed.',
    skills: ['React Native', 'JavaScript', 'Expo', 'React', 'NativeWind'],
  },
  {
    date: 'Jan 2026 to Mar 2026',
    company: 'Codex Pokhara',
    role: 'React Native Internship',
    description:
      'Focused specifically on React Native mobile development, building UI screens and features with Expo and NativeWind while strengthening component-based development practices.',
    skills: ['React Native', 'Expo', 'NativeWind', 'React'],
  },
  {
    date: 'Nov 2024 to Feb 2025',
    company: 'XDezo Technologies, Pokhara',
    role: 'Developer Intern',
    description:
      'Built foundational experience with HTML, CSS, JavaScript, Bootstrap, and basic Django through internship tasks and project work.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Basic Django'],
  },
];

const stats = [
  { value: String(new Set(experience.map((item) => item.company)).size), label: 'Companies' },
  { value: String(heroTech.length), label: 'Technologies' },
];

function App() {
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [subtitle, setSubtitle] = useState('A React Native Developer');
  const [navOpen, setNavOpen] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [activeProject, setActiveProject] = useState(null);
  const revealRefs = useRef([]);
  const progressRef = useRef(null);

  const registerReveal = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current) setTheme(current);
  }, []);

  useEffect(() => {
    const loaderTimeout = window.setTimeout(() => setLoaderVisible(false), 1000);
    return () => window.clearTimeout(loaderTimeout);
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const tick = () => {
      const currentText = headerMessages[currentIndex];

      if (isDeleting) {
        setSubtitle(currentText.substring(0, charIndex - 1));
        charIndex -= 1;
        if (charIndex === 0) {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % headerMessages.length;
          timeoutId = window.setTimeout(tick, 500);
          return;
        }
        timeoutId = window.setTimeout(tick, 75);
        return;
      }

      setSubtitle(currentText.substring(0, charIndex + 1));
      charIndex += 1;

      if (charIndex === currentText.length) {
        isDeleting = true;
        timeoutId = window.setTimeout(tick, 2000);
      } else {
        timeoutId = window.setTimeout(tick, 150);
      }
    };

    timeoutId = window.setTimeout(tick, 1000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleScroll = () => setNavbarScrolled(window.scrollY > 100);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );

    revealRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
    let rafId = null;

    const update = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (progressRef.current) {
        const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      if (!prefersReducedMotion) {
        const viewportH = window.innerHeight;
        parallaxEls.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax) || 0.1;
          const rect = el.getBoundingClientRect();
          const centerOffset = rect.top + rect.height / 2 - viewportH / 2;
          const maxOffset = rect.height * 0.16;
          const offset = Math.max(-maxOffset, Math.min(maxOffset, centerOffset * speed * -1));
          el.style.transform = `translateY(${offset.toFixed(1)}px)`;
        });
      }

      rafId = null;
    };

    const onScrollOrResize = () => {
      if (rafId === null) rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (prefersReducedMotion || !supportsHover) return undefined;

    const orbs = Array.from(document.querySelectorAll('.ambient-bg__orb')).map((el) => ({
      el,
      depth: parseFloat(el.dataset.depth) || 30,
      ease: parseFloat(el.dataset.ease) || 0.05,
      x: 0,
      y: 0,
    }));
    if (!orbs.length) return undefined;

    let mouseX = 0.5;
    let mouseY = 0.5;
    let rafId;

    const handleMouseMove = (event) => {
      mouseX = event.clientX / window.innerWidth;
      mouseY = event.clientY / window.innerHeight;
    };

    const tick = () => {
      orbs.forEach((orb) => {
        const targetX = (mouseX - 0.5) * orb.depth;
        const targetY = (mouseY - 0.5) * orb.depth;
        orb.x += (targetX - orb.x) * orb.ease;
        orb.y += (targetY - orb.y) * orb.ease;
        orb.el.style.transform = `translate3d(${orb.x.toFixed(1)}px, ${orb.y.toFixed(1)}px, 0)`;
      });
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (prefersReducedMotion || !supportsHover) return undefined;

    const cleanups = [];

    const attachTilt = (el, max, lift) => {
      const applyTilt = (event) => {
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        const rotateY = (px * max * 2).toFixed(2);
        const rotateX = (py * max * -2).toFixed(2);
        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${lift}px)`;
      };
      const handleEnter = (event) => {
        el.style.transition = 'none';
        applyTilt(event);
      };
      const handleLeave = () => {
        el.style.transition = '';
        el.style.transform = '';
      };
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mousemove', applyTilt);
      el.addEventListener('mouseleave', handleLeave);
      cleanups.push(() => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mousemove', applyTilt);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };

    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const max = parseFloat(el.dataset.tilt) || 8;
      const lift = parseFloat(el.dataset.tiltLift) || 0;
      attachTilt(el, max, lift);
    });

    const heroEl = document.getElementById('header');
    const avatarEl = document.querySelector('.hero__avatar-wrap');
    if (heroEl && avatarEl) {
      const applyHeroTilt = (event) => {
        const rect = heroEl.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        avatarEl.style.transform = `perspective(1000px) rotateX(${(py * -12).toFixed(2)}deg) rotateY(${(px * 16).toFixed(2)}deg)`;
      };
      const handleHeroEnter = () => {
        avatarEl.style.transition = 'none';
      };
      const handleHeroLeave = () => {
        avatarEl.style.transition = 'transform .6s var(--ease)';
        avatarEl.style.transform = '';
      };
      heroEl.addEventListener('mouseenter', handleHeroEnter);
      heroEl.addEventListener('mousemove', applyHeroTilt);
      heroEl.addEventListener('mouseleave', handleHeroLeave);
      cleanups.push(() => {
        heroEl.removeEventListener('mouseenter', handleHeroEnter);
        heroEl.removeEventListener('mousemove', applyHeroTilt);
        heroEl.removeEventListener('mouseleave', handleHeroLeave);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  useEffect(() => {
    if (!activeProject) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActiveProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeProject]);

  const handleSmoothScroll = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    window.scrollTo({ top: target.offsetTop - 88, behavior: 'smooth' });
    setNavOpen(false);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        /* ignore */
      }
      return next;
    });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="scroll-progress" ref={progressRef} aria-hidden="true"></div>

      <div className="ambient-bg" aria-hidden="true">
        <span className="ambient-bg__orb ambient-bg__orb--1" data-depth="90" data-ease="0.03"></span>
        <span className="ambient-bg__orb ambient-bg__orb--2" data-depth="-130" data-ease="0.045"></span>
        <span className="ambient-bg__orb ambient-bg__orb--3" data-depth="170" data-ease="0.07"></span>
      </div>

      {loaderVisible && (
        <div className="loader-container" id="loader">
          <div className="loader"></div>
          <span className="loader-mark">Amul Baidhya</span>
        </div>
      )}

      <nav className={`nav${navbarScrolled ? ' nav--scrolled' : ''}`}>
        <div className="container">
          <div className="nav__inner">
            <a className="nav__brand" href="#header" onClick={(e) => handleSmoothScroll(e, 'header')}>
              Amul Baidhya
            </a>

            <ul className="nav__links">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a className="nav__link" href={`#${link.id}`} onClick={(e) => handleSmoothScroll(e, link.id)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="nav__actions">
              <button
                className="theme-toggle"
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true"></i>
              </button>
              <a
                href="/files/AMUL_BAIDHYA_CV.pdf"
                download="AMUL_BAIDHYA_CV.pdf"
                className="btn btn--primary nav__cta nav__cta--desktop"
              >
                Download CV
              </a>
              <button
                className="nav__toggle"
                type="button"
                aria-controls="navbarNav"
                aria-expanded={navOpen}
                aria-label="Toggle navigation"
                onClick={() => setNavOpen((prev) => !prev)}
              >
                <span className="nav__toggle-line"></span>
                <span className="nav__toggle-line"></span>
                <span className="nav__toggle-line"></span>
              </button>
            </div>
          </div>

          <div className={`nav__mobile glass${navOpen ? ' is-open' : ''}`} id="navbarNav">
            {navLinks.map((link) => (
              <a
                className="nav__link"
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleSmoothScroll(e, link.id)}
              >
                {link.label}
              </a>
            ))}
            <a href="/files/AMUL_BAIDHYA_CV.pdf" download="AMUL_BAIDHYA_CV.pdf" className="btn btn--primary nav__cta">
              Download CV
            </a>
          </div>
        </div>
      </nav>

      <main id="main-content">
        <header id="header" className="hero">
          <div className="container">
            <div className="hero__grid">
              <div className="hero__content">
                <div className="hero__eyebrow-row">
                  <span className="badge badge--dot">Based in Pokhara, Nepal</span>
                </div>
                <h3 className="hero__greeting">Hello, I&apos;m</h3>
                <h1 className="hero__name">Amul Baidhya</h1>
                <h2 className="hero__subtitle">
                  {subtitle}
                  <span className="cursor" aria-hidden="true"></span>
                </h2>

                <div className="hero__badges">
                  {heroTech.map((tech) => (
                    <span key={tech} className="chip">{tech}</span>
                  ))}
                </div>

                <div className="hero__actions">
                  <a href="/files/AMUL_BAIDHYA_CV.pdf" download="AMUL_BAIDHYA_CV.pdf" className="btn btn--primary btn--lg">
                    <i className="fas fa-download" aria-hidden="true"></i>
                    Download CV
                  </a>
                  <a href="#contact" className="btn btn--ghost btn--lg" onClick={(e) => handleSmoothScroll(e, 'contact')}>
                    Get in Touch
                  </a>
                </div>

                <div className="hero__social">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      className="social-icon"
                      rel={social.rel}
                      aria-label={social.label}
                    >
                      <i className={`fab ${social.icon}`} aria-hidden="true"></i>
                    </a>
                  ))}
                </div>
              </div>

              <div className="hero__visual">
                <div className="hero__avatar-wrap">
                  <div className="hero__avatar-glow" aria-hidden="true"></div>
                  <div className="hero__avatar-ring">
                    <img
                      src="/images/port.webp"
                      srcSet="/images/port.webp 200w"
                      sizes="(max-width: 768px) 150px, 200px"
                      alt="Amul Baidhya, React Native Developer in Nepal"
                      loading="lazy"
                      width="200"
                      height="200"
                      className="image avatar"
                    />
                  </div>
                  {heroFloats.map((tech, idx) => (
                    <span key={tech} className={`chip hero__float hero__float--${idx + 1}`}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="about" className="section">
          <div className="container">
            <div className="about__grid">
              <div>
                <div className="section__header" data-reveal="true" ref={registerReveal}>
                  <span className="eyebrow">About Me</span>
                  <h2 className="section__title">Get to know a little about me</h2>
                </div>
                <div className="about__paragraphs" data-reveal="true" ref={registerReveal}>
                  <p className="about__lead">I&apos;m Amul Baidhya, a React Native developer focused on building clean and practical mobile apps.</p>
                  <p>I started with HTML, CSS, JavaScript, Bootstrap, and basic Django during college, which gave me a strong foundation in UI and web fundamentals.</p>
                  <p>Now I&apos;m focused on React Native and cross-platform app development, with attention to maintainable code and smooth user experience.</p>
                  <p>I keep learning and improving through real projects, and I enjoy turning ideas into reliable products.</p>
                </div>
              </div>

              <div className="facts-card glass" data-reveal="scale" ref={registerReveal}>
                <h3 className="facts-card__title">Personal Details</h3>
                {quickFacts.map((fact) => (
                  <div className="fact-item" key={fact.label}>
                    <span className="fact-icon"><i className={`fas ${fact.icon}`} aria-hidden="true"></i></span>
                    <div>
                      <h5 className="fact-label">{fact.label}</h5>
                      <p className="fact-value">{fact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section section--alt">
          <div className="container">
            <div className="section__header section__header--center" data-reveal="true" ref={registerReveal}>
              <span className="eyebrow">Skills &amp; Technologies</span>
              <h2 className="section__title">What I build with</h2>
              <p className="section__subtitle">A categorized look at the tools and technologies I use across mobile and web development.</p>
            </div>

            <div className="skills__grid">
              {skillGroups.map((group, idx) => (
                <div
                  className="skill-group glass"
                  key={group.title}
                  data-reveal="scale"
                  data-tilt="8"
                  data-tilt-lift="-6"
                  style={{ '--reveal-delay': `${idx * 100}ms` }}
                  ref={registerReveal}
                >
                  <span className="skill-group__icon"><i className={`fas ${group.icon}`} aria-hidden="true"></i></span>
                  <h3 className="skill-group__title">{group.title}</h3>
                  <p className="skill-group__desc">{group.description}</p>
                  <div className="skill-group__chips">
                    {group.skills.map((skill) => (
                      <span key={skill} className="chip">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="section">
          <div className="container">
            <div className="section__header" data-reveal="true" ref={registerReveal}>
              <span className="eyebrow">Professional Experience</span>
              <h2 className="section__title">My journey as a developer</h2>
              <p className="section__subtitle">Hands-on real world experience building web and mobile applications.</p>
            </div>

            <div className="timeline">
              {experience.map((item, idx) => (
                <div
                  className="timeline__item"
                  key={`${item.company}-${item.date}`}
                  data-reveal="true"
                  style={{ '--reveal-delay': `${idx * 100}ms` }}
                  ref={registerReveal}
                >
                  <span className="timeline__marker"><i className="fas fa-briefcase" aria-hidden="true"></i></span>
                  <div className="timeline__card glass">
                    <span className="chip timeline__date">{item.date}</span>
                    <h4 className="timeline__company">{item.company}</h4>
                    <h5 className="timeline__role">{item.role}</h5>
                    <p className="timeline__desc">{item.description}</p>
                    <div className="timeline__tags">
                      {item.skills.map((skill) => (
                        <span key={skill} className="chip">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section section--alt">
          <div className="container">
            <div className="section__header" data-reveal="true" ref={registerReveal}>
              <span className="eyebrow">Projects</span>
              <h2 className="section__title">A selection of my work</h2>
            </div>

            <div className="projects__grid">
              {projects.map((project, idx) => (
                <article
                  className="project-card glass"
                  key={project.title}
                  role="button"
                  tabIndex={0}
                  data-reveal="scale"
                  data-tilt="7"
                  data-tilt-lift="-6"
                  style={{ '--reveal-delay': `${(idx % 4) * 80}ms` }}
                  ref={registerReveal}
                  onClick={() => setActiveProject(project)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setActiveProject(project);
                    }
                  }}
                >
                  <div className="project-card__top">
                    <span className="project-card__arrow" aria-hidden="true">
                      <i className="fas fa-arrow-right"></i>
                    </span>
                  </div>
                  <h5 className="project-card__title">
                    {project.title}
                    {project.subtitle ? <small>{project.subtitle}</small> : null}
                  </h5>
                  <p className="project-card__summary">{project.summary}</p>
                  <div className="project-card__tags">
                    {project.tech.map((tech) => (
                      <span key={tech} className="tag">{tech}</span>
                    ))}
                  </div>
                  <span className="project-card__link">
                    View Details
                    <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <div className="section__header section__header--center" data-reveal="true" ref={registerReveal}>
              <span className="eyebrow">Get In Touch</span>
              <h2 className="section__title">Let&apos;s work together</h2>
              <p className="section__subtitle">I&apos;m currently available for freelance work and new opportunities. Feel free to reach out.</p>
            </div>

            <div className="contact__wrap">
              <div className="contact-card glass" data-reveal="scale" ref={registerReveal}>
                <a href="mailto:amul.baidhya123@gmail.com" className="contact-email">
                  <i className="fas fa-envelope" aria-hidden="true"></i>
                  amul.baidhya123@gmail.com
                </a>
                <p className="contact-card__hint">Send me an email and I&apos;ll get back to you as soon as possible.</p>

                <div className="contact-meta">
                  <span className="badge"><i className="fas fa-map-marker-alt" aria-hidden="true"></i>&nbsp;Pokhara, Nepal</span>
                  <span className="badge"><i className="fas fa-phone" aria-hidden="true"></i>&nbsp;9860578607</span>
                </div>

                <div className="contact-card__social">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      className="social-icon"
                      rel={social.rel}
                      aria-label={social.label}
                    >
                      <i className={`fab ${social.icon}`} aria-hidden="true"></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <div>
              <div className="footer__brand">Amul Baidhya</div>
              <p className="footer__tagline">React Native Developer, Pokhara, Nepal</p>
            </div>
            <ul className="footer__nav">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} onClick={(e) => handleSmoothScroll(e, link.id)}>{link.label}</a>
                </li>
              ))}
            </ul>
            <div className="footer__social">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  className="social-icon"
                  rel={social.rel}
                  aria-label={social.label}
                >
                  <i className={`fab ${social.icon}`} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>

          <div className="footer__bottom">
            <p>&copy; 2025 Amul Baidhya. All rights reserved.</p>
            <button className="back-to-top" type="button" onClick={scrollToTop}>
              <i className="fas fa-arrow-up" aria-hidden="true"></i>
              Back to top
            </button>
          </div>
        </div>
      </footer>

      {activeProject && (
        <div className="project-modal-overlay" onClick={() => setActiveProject(null)}>
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="project-modal__close"
              type="button"
              aria-label="Close project details"
              onClick={() => setActiveProject(null)}
            >
              <i className="fas fa-xmark" aria-hidden="true"></i>
            </button>
            <div className="project-modal__body">
              <h3 className="project-modal__title" id="project-modal-title">
                {activeProject.title}
                {activeProject.subtitle ? <small>{activeProject.subtitle}</small> : null}
              </h3>
              <div className="project-modal__tags">
                {activeProject.tech.map((tech) => (
                  <span key={tech} className="tag">{tech}</span>
                ))}
              </div>
              <p className="project-modal__desc">{activeProject.description}</p>
              <div className="project-modal__actions">
                <a href={activeProject.link} target="_blank" className="btn btn--primary" rel="noopener">
                  <i className="fab fa-github" aria-hidden="true"></i>
                  View on GitHub
                </a>
                <button className="btn btn--ghost" type="button" onClick={() => setActiveProject(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
