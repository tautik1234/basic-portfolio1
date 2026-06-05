import { useState, useEffect, useRef } from 'react';

// Hardcoded fallback data in case the server is not running
const FALLBACK_PROFILE = {
  name: 'Tautik Venkata Siva Sai Penumudi',
  birthYear: 2005,
  presentAge: new Date().getFullYear() - 2005,
  homeplace: 'Vijayawada',
  college: 'Prasad V Potluri Siddhartha Institute of Technology',
  interests: [
    {
      name: 'Video Editing',
      description: 'Crafting visually stunning narratives, color grading, pacing, and editing engaging content.',
      proof: {
        platform: 'Instagram',
        handle: '@siva.cc_',
        url: 'https://instagram.com/siva.cc_'
      }
    },
    {
      name: 'Story Writing',
      description: 'Developing worlds, writing screenplays, character-driven narratives, and short fiction.',
      proof: {
        platform: 'Twitter / X',
        handle: '@TautikPenumudi',
        url: 'https://twitter.com/TautikPenumudi'
      }
    }
  ],
  languages: ['Java', 'Python', 'C'],
  framework: 'MERN'
};

function App() {
  const [profile] = useState(FALLBACK_PROFILE);
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem('portfolio_messages');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    } else {
      // Setup some default mock messages so the UI is not empty
      const defaultMessages = [
        {
          id: 'mock-1',
          name: 'PVPSIT Department of IT',
          email: 'it_dept@pvpsiddhartha.ac.in',
          message: 'Excellent portfolio showcase! Looking forward to your project presentations on React and modern front-end design patterns.',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
        },
        {
          id: 'mock-2',
          name: 'Video Production Guild',
          email: 'editor@creativevideo.org',
          message: "Loved your video editing examples! Your storytelling style aligns well with our upcoming project. Let's collaborate.",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
        }
      ];
      try {
        localStorage.setItem('portfolio_messages', JSON.stringify(defaultMessages));
      } catch {
        // Fallback if localStorage is disabled/full
      }
      return defaultMessages;
    }
  });
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Refs for tracking mouse parallax glow
  const glow1Ref = useRef(null);
  const glow2Ref = useRef(null);

  const fetchMessages = () => {
    const stored = localStorage.getItem('portfolio_messages');
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        setMessages([]);
      }
    }
  };

  // 2. Parallax mouse movement handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!glow1Ref.current || !glow2Ref.current) return;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const moveX1 = (mouseX - window.innerWidth / 2) * -0.02;
      const moveY1 = (mouseY - window.innerHeight / 2) * -0.02;

      const moveX2 = (mouseX - window.innerWidth / 2) * 0.015;
      const moveY2 = (mouseY - window.innerHeight / 2) * 0.015;

      glow1Ref.current.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
      glow2Ref.current.style.transform = `translate(${moveX2}px, ${moveY2}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. Scroll Listeners for Navbar effect and Active Section highlight
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ['hero', 'about', 'interests', 'skills', 'contact'];
      let currentSection = 'hero';

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && window.scrollY >= el.offsetTop - 220) {
          currentSection = sectionId;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Scroll Reveal IntersectionObserver
  useEffect(() => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [profile]); // Triggers again if profile details load later

  // 5. Contact Form Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus({ type: 'error', message: 'All form fields are required.' });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    // Simulate network delay for realistic experience
    setTimeout(() => {
      const newMessage = {
        id: `msg-${Date.now()}`,
        name: formState.name,
        email: formState.email,
        message: formState.message,
        createdAt: new Date().toISOString()
      };

      try {
        const stored = localStorage.getItem('portfolio_messages');
        let currentMessages = [];
        if (stored) {
          currentMessages = JSON.parse(stored);
        }
        currentMessages.unshift(newMessage);
        localStorage.setItem('portfolio_messages', JSON.stringify(currentMessages));
        setMessages(currentMessages);
        setFormStatus({
          type: 'success',
          message: 'Message sent successfully! Saved in simulated local database.'
        });
        setFormState({ name: '', email: '', message: '' });
      } catch {
        setFormStatus({
          type: 'error',
          message: 'Failed to write message to simulated database.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <>
      {/* Background Glows */}
      <div className="glow-bg">
        <div ref={glow1Ref} className="glow-sphere glow-1" id="glow-1"></div>
        <div ref={glow2Ref} className="glow-sphere glow-2" id="glow-2"></div>
      </div>

      {/* Header / Navbar */}
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="main-header">
        <div className="nav-container">
          <a href="#" className="nav-logo" id="logo-link">
            <span className="logo-accent">&lt;</span>Tautik<span className="logo-accent"> /&gt;</span>
          </a>

          <nav className={`nav-menu ${menuActive ? 'active' : ''}`} id="navigation-menu">
            <ul>
              {['Home', 'About', 'Interests', 'Skills', 'Contact'].map((item) => {
                const id = item === 'Home' ? 'hero' : item.toLowerCase();
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={`nav-link ${activeSection === id ? 'active' : ''}`}
                      onClick={() => setMenuActive(false)}
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            className={`mobile-menu-toggle ${menuActive ? 'active' : ''}`}
            id="menu-toggle"
            aria-label="Toggle Menu"
            onClick={() => setMenuActive(!menuActive)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="hero-section">
          <div className="container hero-container">
            <div className="hero-content">
              <span className="badge hero-badge">Welcome to my space</span>
              <h1 className="hero-title">
                Hi, I'm <span className="gradient-text">{profile.name.split(' ')[0]} {profile.name.split(' ')[1] || ''}</span>
              </h1>
              <p className="hero-subtitle">
                A developer and creative creator specializing in building full-stack applications and creating compelling digital narratives through code, video, and words.
              </p>
              <div className="hero-actions">
                <a href="#about" className="btn btn-primary" id="hero-btn-about">
                  About Me
                </a>
                <a href="#contact" className="btn btn-secondary" id="hero-btn-contact">
                  Get In Touch
                </a>
              </div>
            </div>
            <div className="hero-image-wrapper">
              <div className="avatar-glow"></div>
              <div className="avatar-card">
                <img
                  src="/developer_avatar.png"
                  alt={`${profile.name} Avatar`}
                  className="profile-img"
                  id="profile-picture"
                />
              </div>
            </div>
          </div>
          <div
            className="scroll-indicator"
            id="scroll-prompt"
            onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Scroll Down</span>
            <div className="mouse-icon">
              <div className="wheel"></div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section scroll-reveal">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Identity</span>
              <h2 className="section-title">About Me</h2>
              <div className="section-divider"></div>
            </div>

            <div className="about-grid">
              <div className="about-info-card glass-panel">
                <h3>Personal Profile</h3>
                <p className="about-bio">
                  I am a builder of digital experiences, bridging logical engineering with artistic expression. Currently expanding my horizons in both the technical and creative landscapes.
                </p>

                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{profile.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Born</span>
                    <span className="info-value">{profile.birthYear}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Age</span>
                    <span className="info-value" id="current-age">
                      {profile.presentAge} years old
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Homeplace</span>
                    <span className="info-value">{profile.homeplace}, India</span>
                  </div>
                </div>
              </div>

              <div className="about-education-card glass-panel">
                <h3>Education</h3>
                <div className="education-timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <h4 className="timeline-title">B.Tech in Computer Science / Engineering</h4>
                    <p className="timeline-subtitle">{profile.college}</p>
                    <p className="timeline-desc">
                      Acquiring core knowledge of computer science, algorithms, software engineering principles, and hands-on application development.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interests Section */}
        <section id="interests" className="interests-section scroll-reveal">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Creative Passions</span>
              <h2 className="section-title">Interests & Proof</h2>
              <div className="section-divider"></div>
            </div>

            <div className="interests-grid">
              {profile.interests.map((interest, idx) => (
                <article
                  key={interest.name}
                  className="interest-card glass-panel"
                  id={`card-${interest.name.toLowerCase().replace(' ', '-')}`}
                >
                  <div className={`interest-icon-wrapper ${idx === 0 ? 'video-icon-bg' : 'writing-icon-bg'}`}>
                    {idx === 0 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="interest-svg"
                      >
                        <path d="M23 7l-7 5 7 5V7z" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="interest-svg"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="interest-name">{interest.name}</h3>
                  <p className="interest-desc">{interest.description}</p>
                  <div className="proof-links">
                    <h4 className="proof-heading">Verify / Connect:</h4>
                    <a
                      href={interest.proof.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`proof-btn ${interest.proof.platform === 'Instagram' ? 'instagram-btn' : 'twitter-btn'}`}
                      id={`link-${interest.proof.platform.toLowerCase().split(' ')[0]}-proof`}
                    >
                      {interest.proof.platform === 'Instagram' ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="social-svg-inline"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="social-svg-inline"
                        >
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                        </svg>
                      )}
                      {interest.proof.handle}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="skills-section scroll-reveal">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Technical Arsenal</span>
              <h2 className="section-title">Skills & Technologies</h2>
              <div className="section-divider"></div>
            </div>

            <div className="skills-wrapper">
              {/* Languages Group */}
              <div className="skills-category-card glass-panel" id="category-languages">
                <h3>Programming Languages</h3>
                <div className="skills-list">
                  {profile.languages.map((lang) => {
                    let icon = '⚙️';
                    if (lang === 'Java') icon = '☕';
                    if (lang === 'Python') icon = '🐍';
                    return (
                      <div key={lang} className="skill-item" id={`skill-${lang.toLowerCase()}`}>
                        <div className="skill-icon">{icon}</div>
                        <span className="skill-name">{lang}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Frameworks Group */}
              <div className="skills-category-card glass-panel" id="category-frameworks">
                <h3>Preferred Architecture</h3>
                <div className="mern-showcase">
                  <div className="mern-title-container">
                    <span className="mern-badge">Framework</span>
                    <h4 className="mern-title">{profile.framework} Stack</h4>
                  </div>
                  <p className="mern-desc">
                    Building full-stack, scalable, fast web applications with modern component-driven patterns and NoSQL databases.
                  </p>
                  <div className="mern-components">
                    <div className="mern-chip" title="MongoDB">
                      M
                    </div>
                    <div className="mern-chip" title="Express.js">
                      E
                    </div>
                    <div className="mern-chip" title="React.js">
                      R
                    </div>
                    <div className="mern-chip" title="Node.js">
                      N
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Messages Section */}
        <section id="contact" className="contact-section scroll-reveal">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Let's Connect</span>
              <h2 className="section-title">Get In Touch</h2>
              <div className="section-divider"></div>
            </div>

            <div className="contact-card glass-panel">
              <h3>Let's collaborate on code or creative content!</h3>
              <p>
                I'm always open to discussing web development, video projects, writing collaborations, or opportunities in software engineering.
              </p>

              {/* HTML Form for Contact submission */}
              <form onSubmit={handleFormSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name-input">Name</label>
                  <input
                    type="text"
                    id="name-input"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email-input">Email</label>
                  <input
                    type="email"
                    id="email-input"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message-input">Message</label>
                  <textarea
                    id="message-input"
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Your Message..."
                    required
                  ></textarea>
                </div>

                {formStatus.message && (
                  <div className={`form-status ${formStatus.type}`}>{formStatus.message}</div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary submit-btn"
                  id="submit-contact-form"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>

              {/* Social Channels */}
              <div className="contact-links-grid">
                <a
                  href="https://instagram.com/siva.cc_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item instagram-card"
                  id="contact-insta"
                >
                  <div className="contact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="contact-svg-icon"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">Instagram</span>
                    <span className="contact-handle">@siva.cc_</span>
                  </div>
                </a>

                <a
                  href="https://twitter.com/TautikPenumudi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item twitter-card"
                  id="contact-twitter"
                >
                  <div className="contact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="contact-svg-icon"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">Twitter / X</span>
                    <span className="contact-handle">@TautikPenumudi</span>
                  </div>
                </a>
              </div>

              {/* Messages Panel (Displays received contact inquiries to demonstrate MERN capability) */}
              <div className="admin-section">
                <div className="admin-header">
                  <h3 className="admin-title">Recent Inquiries (Simulated Local DB)</h3>
                  <button onClick={fetchMessages} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                    Refresh List
                  </button>
                </div>

                <div className="messages-list">
                  {messages.length > 0 ? (
                    messages.slice(0, 5).map((msg) => (
                      <div key={msg._id || msg.id} className="message-card">
                        <div className="message-meta">
                          <div>
                            <span className="message-sender">{msg.name}</span>
                            <span className="message-email">({msg.email})</span>
                          </div>
                          <span className="message-date">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="message-text">{msg.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="no-messages">
                      No inquiries found. Send a message above to store it in the database and see it live!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <p className="copyright">
            &copy; {new Date().getFullYear()} Tautik Venkata Siva Sai Penumudi. All rights reserved.
          </p>
          <p className="footer-subtext">
            Designed with premium aesthetics and built using React JS (featuring a Simulated MERN Stack architecture).
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
