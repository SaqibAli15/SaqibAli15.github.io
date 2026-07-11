/* ============================================================
   Saqib Ali — Portfolio interactions
   - Mobile nav, theme toggle, scroll progress, active links
   - Scroll-reveal animations
   - Contact form → Web3Forms (real email delivery)
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', stored || (prefersDark ? 'dark' : 'light'));

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  function closeNav() {
    if (!mainNav) return;
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    mainNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
  }

  /* ---------- Header shadow + scroll progress ---------- */
  var header = document.getElementById('siteHeader');
  var progress = document.getElementById('scrollProgress');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll-reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Active nav link on scroll (scroll-spy) ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = mainNav ? mainNav.querySelectorAll('a') : [];
  if ('IntersectionObserver' in window && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ============================================================
     CONTACT FORM → Web3Forms
     Sends the visitor's name, email, subject and message to your
     inbox (syedmuhammadsaqibali@outlook.com). Set your access key
     in index.html: <input name="access_key" value="...">.
     Get a free key at https://web3forms.com (uses your email).
     ============================================================ */
  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');
  var ENDPOINT = 'https://api.web3forms.com/submit';

  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (type ? ' ' + type : '');
  }

  function fieldError(name, msg) {
    var span = form.querySelector('.field-error[data-for="' + name + '"]');
    var field = span ? span.closest('.field') : null;
    if (span) span.textContent = msg || '';
    if (field) field.classList.toggle('invalid', !!msg);
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validate(data) {
    var ok = true;
    if (!data.name || data.name.trim().length < 2) { fieldError('name', 'Please enter your name.'); ok = false; }
    else fieldError('name', '');

    if (!isEmail(data.email)) { fieldError('email', 'Please enter a valid email.'); ok = false; }
    else fieldError('email', '');

    if (!data.user_subject || data.user_subject.trim().length < 3) { fieldError('userSubject', 'Please add a subject.'); ok = false; }
    else fieldError('userSubject', '');

    if (!data.message || data.message.trim().length < 10) { fieldError('message', 'Please write at least 10 characters.'); ok = false; }
    else fieldError('message', '');

    return ok;
  }

  if (form) {
    // Clear a field's error as the user types
    form.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        var span = form.querySelector('.field-error[data-for="' + (el.id) + '"]');
        if (span && span.textContent) { span.textContent = ''; el.closest('.field').classList.remove('invalid'); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setStatus('', '');

      var fd = new FormData(form);
      var data = {
        name: fd.get('name'),
        email: fd.get('email'),
        user_subject: fd.get('user_subject'),
        message: fd.get('message'),
        access_key: fd.get('access_key')
      };

      // Honeypot: if filled, silently succeed (bot)
      if (fd.get('botcheck')) { setStatus('Thanks! Your message has been sent.', 'success'); form.reset(); return; }

      if (!validate(data)) {
        setStatus('Please fix the highlighted fields.', 'error');
        return;
      }

      if (!data.access_key || data.access_key === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        setStatus('Contact form not configured yet — add your Web3Forms access key. (See README.)', 'error');
        return;
      }

      // Build the payload Web3Forms expects. `subject` is the email
      // subject line; we prefix the visitor's own subject and set
      // replyto so replies go straight back to them.
      var payload = {
        access_key: data.access_key,
        subject: 'Portfolio inquiry: ' + data.user_subject,
        from_name: data.name + ' (via portfolio)',
        replyto: data.email,
        name: data.name,
        email: data.email,
        'Subject line': data.user_subject,
        message: data.message
      };

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      setStatus('Sending your message…', '');

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, body: j }; }); })
        .then(function (r) {
          if (r.ok && r.body && r.body.success) {
            setStatus('✓ Thank you, ' + data.name.split(' ')[0] + '! Your message has been sent — I\'ll get back to you soon.', 'success');
            form.reset();
          } else {
            var m = (r.body && r.body.message) ? r.body.message : 'Something went wrong.';
            setStatus('Could not send: ' + m + ' You can also email me directly.', 'error');
          }
        })
        .catch(function () {
          setStatus('Network error — please check your connection or email me directly at syedmuhammadsaqibali@outlook.com.', 'error');
        })
        .finally(function () {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        });
    });
  }
})();
