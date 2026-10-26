// Navigation, project detail dialogs, and contact helpers.
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  });
});
const projects = {
  certification: {
    kicker: 'ACADEMIC PROJECT · WEB APPLICATION',
    title: 'Online Certification System',
    description: 'An academic capstone project concept for digitizing certification application and administrative workflows. Use this case study to explain the exact features you implemented and the decisions you made.',
    highlights: [
      'Designed and developed workflow screens for online certification requests.',
      'Worked with Laravel and MongoDB as part of the application stack.',
      'Organized application statuses and administrative review steps.',
      'Add your own screenshots and clarify your individual contribution before publishing.'
    ]
  },
  aurum: {
    kicker: 'WEBSITE PROJECT · DESIGN & CONTENT',
    title: 'Aurum Website',
    description: 'A luxury-inspired collaboration website with a restrained gold and neutral palette, clean content hierarchy, and responsive page layouts.',
    highlights: [
      'Built page layouts using WordPress and Elementor.',
      'Focused on visual consistency, navigation, and readable content.',
      'Use this section to add a public demo or screenshots of your actual website.'
    ]
  },
  qa: {
    kicker: 'INTERNSHIP EXPERIENCE · QA',
    title: 'Website QA & Data Validation',
    description: 'A summary of quality assurance tasks completed during internship. Keep company-sensitive details out of public screenshots and documentation.',
    highlights: [
      'Tested website forms and checked behavior against business rules.',
      'Verified system-generated information for accuracy.',
      'Documented issues and collaborated with developers on improvements.',
      'Add anonymized sample test cases that reflect work you are allowed to share.'
    ]
  },
  workflow: {
    kicker: 'DEMONSTRATION PROJECT · VIRTUAL ASSISTANCE',
    title: 'VA Task Management Board',
    description: 'A sample workflow demonstrating how recurring remote tasks can be tracked clearly using a simple spreadsheet or task board. This is a demonstration, not client work.',
    highlights: [
      'Organize tasks by priority, due date, and status.',
      'Use a simple weekly view to identify upcoming deadlines.',
      'Track follow-ups and keep notes in one place.',
      'Create a sample board with fictional data and link it here if you want to share it.'
    ]
  }
};
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project || !dialog) return;
    document.querySelector('#dialog-kicker').textContent = project.kicker;
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-description').textContent = project.description;
    const list = document.querySelector('#dialog-highlights');
    list.replaceChildren(...project.highlights.map(item => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    }));
    dialog.showModal();
  });
});
document.querySelector('.dialog-close')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && dialog?.open) dialog.close();
});
document.querySelector('#year').textContent = new Date().getFullYear();
// IMPORTANT: replace this placeholder in index.html with your real professional email.
const emailDisplay = document.querySelector('#email-display');
const emailLink = document.querySelector('#email-link');
const copyButton = document.querySelector('#copy-email');
copyButton?.addEventListener('click', async () => {
  const email = emailDisplay?.textContent.trim();
  if (!email || email === 'your.email@example.com') {
    copyButton.textContent = 'Add your email in index.html first';
    return;
  }
  try {
    await navigator.clipboard.writeText(email);
    copyButton.textContent = 'Email copied ✓';
  }
  catch {
    copyButton.textContent = email;
  }
});

const profileDialog = document.querySelector("#profile-dialog");
const openProfile = document.querySelector("#open-profile");
const closeProfile = document.querySelector(".profile-dialog-close");

openProfile?.addEventListener("click", () => {
  profileDialog?.showModal();
});

closeProfile?.addEventListener("click", () => {
  profileDialog?.close();
});

profileDialog?.addEventListener("click", (event) => {
  if (event.target === profileDialog) {
    profileDialog.close();
  }
});


// AR/VR-inspired interaction layer: reveal-on-scroll, gentle 3D tilt, and header depth.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  document.documentElement.classList.add('js-motion');

  const revealTargets = document.querySelectorAll(
    '.section-heading, .about-grid, .skill-card, .tech-card, .project-card, .working-grid, .contact-panel'
  );
  revealTargets.forEach((el, index) => {
    el.classList.add('reveal');
    if (el.matches('.skill-card, .tech-card, .project-card')) {
      el.style.transitionDelay = `${(index % 4) * 75}ms`;
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const visual = document.querySelector('.hero-visual');
  if (visual && window.matchMedia('(pointer: fine)').matches) {
    visual.addEventListener('pointermove', event => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      visual.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${y * -5}deg) translateY(-2px)`;
    });
    visual.addEventListener('pointerleave', () => { visual.style.transform = ''; });
  }
})();


/* Repeatable CV download with numbered filenames and a visible paper-plane animation. */
(() => {
  const cvLink = document.querySelector('.nav-cv[download]');
  const overlay = document.querySelector('#download-overlay');
  if (!cvLink || !overlay) return;

  let activeDownload = false;

  cvLink.addEventListener('click', async (event) => {
    event.preventDefault();
    if (activeDownload) return;
    activeDownload = true;

    const startedAt = Date.now();
    const title = overlay.querySelector('.download-title');
    const subtitle = overlay.querySelector('.download-subtitle');
    if (title) title.textContent = 'Preparing your CV...';
    if (subtitle) subtitle.textContent = 'Your download is starting. You can stay right here.';
    overlay.classList.add('is-active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    let downloadError = null;
    try {
      const downloadUrl = new URL(cvLink.getAttribute('href'), window.location.href);
      downloadUrl.searchParams.set('_download', `${Date.now()}-${Math.random().toString(36).slice(2)}`);

      const response = await fetch(downloadUrl.href, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store'
      });
      if (!response.ok) throw new Error(`CV request failed (${response.status}).`);
      const blob = await response.blob();
      if (!blob.size) throw new Error('The PDF file is empty.');

      const objectUrl = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = objectUrl;
      downloadAnchor.download = cvLink.getAttribute('download') || 'PamintuanDwight_CV.pdf';
      downloadAnchor.style.position = 'fixed';
      downloadAnchor.style.left = '-9999px';
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 15000);

      if (title) title.textContent = 'Your CV is on its way!';
      if (subtitle) subtitle.textContent = 'The download has started. You can keep browsing this page.';
    } catch (error) {
      downloadError = error;
      if (title) title.textContent = 'Download could not start';
      if (subtitle) subtitle.textContent = 'Please check that PamintuanDwight_CV.pdf exists beside your website page and try again.';
      console.error('CV download failed:', error);
    } finally {
      const elapsed = Date.now() - startedAt;
      window.setTimeout(() => {
        overlay.classList.remove('is-active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        activeDownload = false;
      }, Math.max(0, 4000 - elapsed));
    }
  });
})();
