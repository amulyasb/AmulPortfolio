import { useEffect, useMemo, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const headerMessages = ['A React Native Developer', 'Welcome to My Portfolio'];

const projects = [
  {
    title: 'Room Rental',
    subtitle: '(Academic Task)',
    image: '/images/roomrental.webp',
    alt: 'Room Rental web App Using Django, HTML, CSS, JS, Bootstrap',
    tech: ['Django', 'HTML5', 'CSS3', 'Bootstrap', 'PostgreSQL'],
    description:
      'The Room Rental WebApp is a full-featured web platform designed to streamline the process of renting rooms by connecting Sellers(brokers) and Customers(Room Sekeers) in a user-friendly and secure environment. This system simplifies Renting Room discovery, Real Time Communication, appointment booking, and Subscription Wise payments.',
    link: 'https://github.com/amulyasb/RoomRental',
  },
  {
    title: 'Django Todo List',
    image: '/images/todo.webp',
    alt: 'Django Todo App - Task management with Python/Django',
    tech: ['HTML5', 'CSS3', 'Bootstrap', 'PostgreSQL', 'Django'],
    description:
      'A full-featured Todo application with user authentication, task management, and completion tracking.',
    link: 'https://github.com/amulyasb/todo_Project',
  },
  {
    title: 'Trip Manager',
    image: '/images/TripManager.webp',
    alt: 'Trip Manager mobile app built with React Native',
    tech: ['React Native', 'JavaScript', 'Mobile App'],
    description:
      'A React Native mobile app for managing trips with itinerary organization, activity planning, and expense tracking.',
    link: 'https://github.com/amulyasb/TripManagerMobile',
  },
  {
    title: 'Basic Calculator',
    image: '/images/calculator.webp',
    alt: 'Basic Calculator using python djnago. html, css, js, bootstrap',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    description:
      'A functional calculator supporting basic arithmetic operations with intuitive interface.',
    link: 'https://github.com/amulyasb/SimpleCalculator',
  },
];

const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

function App() {
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [subtitle, setSubtitle] = useState('A React Native Developer');
  const [expandedProjects, setExpandedProjects] = useState({});
  const [navOpen, setNavOpen] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const sectionRefs = useRef([]);

  useEffect(() => {
    emailjs.init({ publicKey: 'K2uJniHUV2-Yue5hN' });
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
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 100);
      sectionRefs.current.forEach((element) => {
        if (!element) return;
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        if (elementPosition < screenPosition) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        } else {
          element.style.opacity = '0';
          element.style.transform = 'translateY(20px)';
        }
      });
    };

    sectionRefs.current.forEach((element) => {
      if (!element) return;
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    setNavOpen(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = async (event) => {
    event.preventDefault();
    try {
      await emailjs.send('service_50lxbgs', 'template_b39bd3n', formData);
      alert('Contact Form Sent Successfully, Thank You!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Unable to send Contact Form');
    }
  };

  const toggledProjects = useMemo(() => expandedProjects, [expandedProjects]);

  return (
    <>
      {loaderVisible && (
        <div className="loader-container" id="loader">
          <div className="loader"></div>
        </div>
      )}

      <nav className={`navbar navbar-expand-lg navbar-light sticky-top${navbarScrolled ? ' navbar-scrolled' : ''}`}>
        <div className="container">
          <a className="navbar-brand" href="#header" onClick={(e) => handleSmoothScroll(e, 'header')}>
            Amul Baidhya
          </a>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarNav"
            aria-expanded={navOpen}
            aria-label="Toggle navigation"
            onClick={() => setNavOpen((prev) => !prev)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse${navOpen ? ' show' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {navLinks.map((link) => (
                <li className="nav-item" key={link.id}>
                  <a className="nav-link" href={`#${link.id}`} onClick={(e) => handleSmoothScroll(e, link.id)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <header id="header" className={!loaderVisible ? 'show' : ''}>
        <div className="container text-center">
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
          <h3 className="display-7 fw-bold mb-1">Hello, I&apos;m</h3>
          <h1 className="display-4 fw-bold mb-3">Amul Baidhya</h1>
          <h2 className="h3 mb-4">{subtitle}</h2>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <span className="tech-badge">React Native</span>
            <span className="tech-badge">JavaScript</span>
            <span className="tech-badge">HTML5</span>
            <span className="tech-badge">CSS3</span>
            <span className="tech-badge">Bootstrap</span>
            <span className="tech-badge">Basic Django</span>
          </div>
          <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
            <a href="/files/AMUL_BAIDHYA_CV.pdf" download="AMUL_BAIDHYA_CV.pdf" className="btn btn-primary">
              Download CV
            </a>
          </div>
        </div>
      </header>

      <section id="about" className="bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h2 className="section-title" ref={(el) => (sectionRefs.current[0] = el)}>About Me</h2>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-8 pe-lg-5">
              <div className="about-text">
                <p className="lead">I&apos;m Amulya Vaidya, a React Native developer focused on building clean and practical mobile apps.</p>
                <p>I started with HTML, CSS, JavaScript, Bootstrap, and basic Django during college, which gave me a strong foundation in UI and web fundamentals.</p>
                <p>Now I&apos;m focused on React Native and cross-platform app development, with attention to maintainable code and smooth user experience.</p>
                <p>I keep learning and improving through real projects, and I enjoy turning ideas into reliable products.</p>
              </div>
            </div>

            <div className="col-lg-4 mt-5 mt-lg-0">
              <div className="details-card" ref={(el) => (sectionRefs.current[1] = el)}>
                <div className="details-card-header">
                  <h3 className="h5 mb-0">Personal Details</h3>
                </div>
                <div className="details-card-body">
                  <div className="detail-item"><i className="fas fa-envelope detail-icon"></i><div><h5 className="h6 mb-1">Email</h5><p className="mb-0">amul.baidhya123@gmail.com</p></div></div>
                  <div className="detail-item"><i className="fas fa-map-marker-alt detail-icon"></i><div><h5 className="h6 mb-1">Location</h5><p className="mb-0">Pokhara, Nepal</p></div></div>
                  <div className="detail-item"><i className="fas fa-phone detail-icon"></i><div><h5 className="h6 mb-1">Phone</h5><p className="mb-0">9860578607</p></div></div>
                  <div className="detail-item"><i className="fas fa-briefcase detail-icon"></i><div><h5 className="h6 mb-1">Experience</h5><p className="mb-0">1.5 Years</p></div></div>
                  <div className="detail-item"><i className="fas fa-graduation-cap detail-icon"></i><div><h5 className="h6 mb-1">Education</h5><p className="mb-0">Bachelor&apos;s in BIT</p></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h2 className="section-title" ref={(el) => (sectionRefs.current[2] = el)}>Professional Experience</h2>
              <p className="lead mb-5">My journey as a web developer with hands-on real world experience</p>
            </div>
          </div>
          <div className="row"><div className="col-lg-12">
            <div className="experience-item"><span className="experience-date">2025 - PRESENT</span><h4 className="experience-company">Codex Pokhara</h4><h5 className="experience-position">Developer</h5><p>Working on application development with a current focus on React Native mobile experiences, while applying my web development background where needed.</p><div className="experience-skills"><span className="experience-skill">React Native</span><span className="experience-skill">JavaScript</span><span className="experience-skill">HTML/CSS</span><span className="experience-skill">Bootstrap</span><span className="experience-skill">Basic Django</span></div></div>
            <div className="experience-item"><span className="experience-date">2024 - 2025 (3 months)</span><h4 className="experience-company">XDezo Technologies, Pokhara</h4><h5 className="experience-position">Developer Intern</h5><p>Built foundational experience with HTML, CSS, JavaScript, Bootstrap, and basic Django through internship tasks and project work.</p><div className="experience-skills"><span className="experience-skill">HTML5</span><span className="experience-skill">CSS3</span><span className="experience-skill">JavaScript</span><span className="experience-skill">Bootstrap</span><span className="experience-skill">Basic Django</span></div></div>
          </div></div>
        </div>
      </section>

      <section id="projects">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h2 className="section-title" ref={(el) => (sectionRefs.current[3] = el)}>Projects</h2>
            </div>
          </div>
          <div className="row">
            {projects.map((project, idx) => {
              const isExpanded = !!toggledProjects[idx];
              return (
                <div className="col-lg-4 col-md-6 mb-4" key={project.title}>
                  <div
                    className="project-card card h-100"
                    onMouseEnter={() => setHoveredProject(idx)}
                    onMouseLeave={() => setHoveredProject(null)}
                    style={hoveredProject === idx ? { transform: 'scale(1.03)' } : { transform: 'scale(1)' }}
                  >
                    <img src={project.image} className="card-img-top" loading="lazy" alt={project.alt} />
                    <div className="card-body">
                      <h5>
                        {project.title} {project.subtitle ? <strong className="fs-6">{project.subtitle}</strong> : null}
                      </h5>
                      <div>{project.tech.map((tech) => <span key={tech} className="tech-badge">{tech}</span>)}</div>
                      <p className={`project-description ${isExpanded ? 'expanded' : ''}`}>{project.description}</p>
                      <button className="view-more-btn" aria-label="Expand project details" onClick={() => setExpandedProjects((prev) => ({ ...prev, [idx]: !isExpanded }))}>
                        {isExpanded ? 'View Less' : 'View More'}
                      </button>
                      <a href={project.link} target="_blank" className="btn btn-primary w-100" rel="noopener">
                        <i className="fab fa-github me-2"></i>View on GitHub
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h2 className="section-title" ref={(el) => (sectionRefs.current[4] = el)}>Get In Touch</h2>
              <p className="lead mb-5">I&apos;m currently available for freelance work and new opportunities. Feel free to reach out.</p>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <form className="contact-form" onSubmit={handleSend}>
                <div className="row g-3">
                  <div className="col-md-6"><input type="text" className="form-control" id="name" name="name" placeholder="Your Name" required value={formData.name} onChange={handleFormChange} /></div>
                  <div className="col-md-6"><input type="email" className="form-control" id="email" name="email" placeholder="Your Email" required value={formData.email} onChange={handleFormChange} /></div>
                  <div className="col-md-12"><input type="text" className="form-control" id="subject" name="subject" placeholder="Subejct.." required value={formData.subject} onChange={handleFormChange} /></div>
                  <div className="col-12"><textarea className="form-control" id="message" name="message" rows="5" placeholder="Your Message" required value={formData.message} onChange={handleFormChange}></textarea></div>
                  <div className="col-12"><button type="submit" className="btn btn-primary btn-lg w-100">Send Message</button></div>
                </div>
              </form>
            </div>

            <div className="col-lg-6">
              <div className="contact-info">
                <h3 className="h4 mb-4">Contact Information</h3>
                <div className="contact-item"><i className="fas fa-map-marker-alt contact-icon"></i><div><h5 className="h6 mb-1">Location</h5><p className="mb-0">Pokhara, Nepal</p></div></div>
                <div className="contact-item"><i className="fas fa-envelope contact-icon"></i><div><h5 className="h6 mb-1">Email</h5><p className="mb-0">amul.baidhya123@gmail.com</p></div></div>
                <div className="contact-item"><i className="fas fa-phone contact-icon"></i><div><h5 className="h6 mb-1">Phone</h5><p className="mb-0">9860578607</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container text-center">
          <div className="mb-4">
            <a href="https://github.com/amulyasb" target="_blank" className="social-icon" rel="noopener"><i className="fab fa-github"></i></a>
            <a href="https://www.linkedin.com/in/amul-baidhya/" target="_blank" className="social-icon" rel="noopener"><i className="fab fa-linkedin-in"></i></a>
            <a href="https://www.instagram.com/amulyaaa.v/" target="_blank" className="social-icon" rel="nofollow noopener"><i className="fab fa-instagram"></i></a>
            <a href="https://www.facebook.com/amul.baidhya.71" target="_blank" className="social-icon" rel="nofollow noopener"><i className="fab fa-facebook"></i></a>
          </div>
          <p className="mb-2">&copy; 2025 Amul Baidhya. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
