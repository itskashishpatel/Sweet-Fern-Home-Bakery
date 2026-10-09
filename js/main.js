/* ==========================================================================
   Sweet Fern — main.js
   Progressive enhancement only. Every page is fully readable and navigable
   with JavaScript disabled; this file adds the drawer, the personalisation
   prompt, form validation, the FAQ accordion, the gallery lightbox and the
   opening-hours highlight.
   ========================================================================== */

(function () {
  'use strict';

  /* --- Site configuration ------------------------------------------------ */
  /* Replace XXXXX with the real number before launch. Digits only, no +.    */
  var SITE = {
    whatsapp: '91XXXXXXXXXX',
    email: 'hello@sweetfern.example',
    instagram: 'https://instagram.com/'
  };

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ======================================================================
     1. Header — condense on scroll
     ====================================================================== */
  function initHeader() {
    var header = $('.site-header');
    if (!header) return;

    var ticking = false;
    var update = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ======================================================================
     2. Navigation drawer — slide-in, focus-trapped, scroll-locked
     ====================================================================== */
  function initDrawer() {
    var drawer = $('#navDrawer');
    var toggle = $('.nav-toggle');
    if (!drawer || !toggle) return;

    var scrim  = $('.nav-drawer__scrim', drawer);
    var close  = $('.nav-drawer__close', drawer);
    var panel  = $('.nav-drawer__panel', drawer);
    var lastFocused = null;

    var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), ' +
                    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function open() {
      lastFocused = document.activeElement;
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      var first = $$(FOCUSABLE, panel)[0];
      if (first) first.focus();
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      if (lastFocused) lastFocused.focus();
    }

    toggle.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) { closeDrawer(); } else { open(); }
    });
    if (close) close.addEventListener('click', closeDrawer);
    if (scrim) scrim.addEventListener('click', closeDrawer);

    /* Close when a nav link is chosen */
    $$('a', panel).forEach(function (a) {
      a.addEventListener('click', function () { closeDrawer(); });
    });

    document.addEventListener('keydown', function (e) {
      if (!drawer.classList.contains('is-open')) return;

      if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }

      if (e.key === 'Tab') {
        var items = $$(FOCUSABLE, panel).filter(function (el) {
          return el.offsetParent !== null;
        });
        if (!items.length) return;
        var first = items[0];
        var last  = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });

    /* If the viewport grows past the drawer breakpoint, reset it */
    var mq = window.matchMedia('(min-width: 1024px)');
    var onChange = function (ev) {
      if (ev.matches && drawer.classList.contains('is-open')) closeDrawer();
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ======================================================================
     3. Personalisation prompt
     A quiet, dismissible invitation — NOT a blocking modal.
     - single field
     - never blocks the page
     - skipped state and name both persist in localStorage
     - the visitor can change or clear it at any time
     ====================================================================== */
  var STORE = {
    name: 'dc.name',
    skip: 'dc.promptSkipped'
  };

  function readName() {
    try { return window.localStorage.getItem(STORE.name) || ''; }
    catch (e) { return ''; }
  }
  function writeName(v) {
    try {
      if (v) window.localStorage.setItem(STORE.name, v);
      else   window.localStorage.removeItem(STORE.name);
    } catch (e) { /* storage unavailable — degrade quietly */ }
  }
  function readSkipped() {
    try { return window.localStorage.getItem(STORE.skip) === '1'; }
    catch (e) { return false; }
  }
  function writeSkipped(v) {
    try {
      if (v) window.localStorage.setItem(STORE.skip, '1');
      else   window.localStorage.removeItem(STORE.skip);
    } catch (e) { /* no-op */ }
  }

  function paintGreetings() {
    var name = readName();
    $$('[data-greet]').forEach(function (el) {
      if (name) {
        el.textContent = name;
        el.hidden = false;
        el.closest('[data-greet-wrap]') && (el.closest('[data-greet-wrap]').hidden = false);
      } else {
        el.textContent = '';
        el.hidden = true;
      }
    });
    /* Any block that only makes sense once we know the name */
    $$('[data-greet-wrap]').forEach(function (el) {
      el.hidden = !name;
    });
  }

  function initPersonalise() {
    var prompt = $('#personalise');
    if (!prompt) return;

    var form    = $('form', prompt);
    var input   = $('#prefName', prompt);
    var dismiss = $('.personalise__dismiss', prompt);
    var skip    = $('.personalise__skip', prompt);
    var error   = $('.field__error', prompt);
    var field   = input ? input.closest('.field') : null;

    function hide() {
      prompt.classList.remove('is-visible');
      prompt.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') hide(); }

    /* Only offer the prompt once the visitor has actually engaged. */
    function show() {
      if (prompt.classList.contains('is-visible')) return;
      prompt.classList.add('is-visible');
      prompt.setAttribute('aria-hidden', 'false');
      document.addEventListener('keydown', onKey);
      if (input) {
        var current = readName();
        if (current) input.value = current;
      }
    }

    if (!readName() && !readSkipped()) {
      var engageOnce = function () {
        window.setTimeout(show, 1200);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('click', onScroll);
      };
      var onScroll = function () {
        if (window.scrollY > 320) engageOnce();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      /* Fallback: if nothing happens, still offer it gently after a while. */
      window.setTimeout(function () {
        if (!readName() && !readSkipped() && !prompt.classList.contains('is-visible')) engageOnce();
      }, 12000);
    }

    if (dismiss) dismiss.addEventListener('click', function () {
      writeSkipped(true); hide();
    });
    if (skip) skip.addEventListener('click', function () {
      writeSkipped(true); hide();
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var value = (input.value || '').trim().replace(/\s+/g, ' ');

        if (value.length > 40) {
          if (field) field.classList.add('has-error');
          if (error) error.textContent = 'Please keep it under 40 characters.';
          return;
        }
        if (value && !/^[\p{L}\p{M}'’\-. ]+$/u.test(value)) {
          if (field) field.classList.add('has-error');
          if (error) error.textContent = 'Please use letters only.';
          return;
        }

        if (field) field.classList.remove('has-error');
        if (error) error.textContent = '';

        writeName(value);
        writeSkipped(false);
        paintGreetings();
        hide();
      });

      if (input) {
        input.addEventListener('input', function () {
          if (field) field.classList.remove('has-error');
          if (error) error.textContent = '';
        });
      }
    }

    paintGreetings();
  }

  /* ======================================================================
     4. Enquiry forms — client-side validation, then hand off.
     No data leaves the browser: the visitor reviews the message and sends it
     themselves from their own WhatsApp or mail client.
     ====================================================================== */
  function validateField(input) {
    var field  = input.closest('.field') || input.closest('.form__row');
    var errEl  = field ? $('.field__error', field) : null;
    var label  = input.getAttribute('data-label') ||
                 (field && $('.field__label', field) ? $('.field__label', field).textContent.trim() : 'This field');
    var value  = (input.value || '').trim();
    var message = '';

    if (input.hasAttribute('required') && !value) {
      message = label.replace(/\s*\*$/, '') + ' is required.';
    } else if (value && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      message = 'Please enter a valid email address.';
    } else if (value && input.type === 'tel' && !/^[\d\s()+\-]{7,20}$/.test(value)) {
      message = 'Please enter a valid phone number.';
    } else if (value && input.hasAttribute('minlength') &&
               value.length < parseInt(input.getAttribute('minlength'), 10)) {
      message = 'Please add a little more detail.';
    }

    if (field) field.classList.toggle('has-error', !!message);
    if (errEl) errEl.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');

    return !message;
  }

  function initEnquiryForms() {
    $$('form[data-enquiry]').forEach(function (form) {
      var inputs = $$('input, select, textarea', form).filter(function (el) {
        return el.type !== 'hidden' && el.type !== 'submit' && el.type !== 'button';
      });
      var status = $('.form-status', form);

      /* Validate on blur, then live once it has been touched. */
      inputs.forEach(function (input) {
        input.addEventListener('blur', function () { validateField(input); });
        input.addEventListener('input', function () {
          var field = input.closest('.field');
          if (field && field.classList.contains('has-error')) validateField(input);
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var firstBad = null;
        inputs.forEach(function (input) {
          if (!validateField(input) && !firstBad) firstBad = input;
        });

        if (firstBad) {
          if (status) {
            status.className = 'form-status form-status--err';
            status.hidden = false;
            status.textContent = 'Please check the highlighted fields and try again.';
          }
          firstBad.focus();
          return;
        }

        /* Build a readable, structured handoff message. */
        var lines = ['Hello Sweet Fern,', '', 'I would like to place an enquiry:'];
        var name = '';
        inputs.forEach(function (input) {
          var field = input.closest('.field') || input.closest('.form__row');
          var label = input.getAttribute('data-label') ||
                      (field && $('.field__label', field) ? $('.field__label', field).textContent.replace(/\s*\*\s*$/, '').trim() : input.name);
          var value = (input.value || '').trim();
          if (input.name === 'name') name = value;
          if (!value) return;
          if (input.type === 'checkbox') {
            if (input.checked) lines.push('• ' + label + ': yes');
            return;
          }
          lines.push('• ' + label + ': ' + value);
        });
        lines.push('', 'Sent from the Sweet Fern website.');

        var text = lines.join('\n');

        /* The visitor may pick WhatsApp or email with a second submit button. */
        var target = form.getAttribute('data-enquiry');
        var submitter = e.submitter;
        if (submitter && submitter.getAttribute('data-enquiry-switch')) {
          target = submitter.getAttribute('data-enquiry-switch');
        }

        var url;

        if (target === 'whatsapp') {
          url = 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(text);
        } else {
          url = 'mailto:' + SITE.email +
                '?subject=' + encodeURIComponent('Website enquiry' + (name ? ' from ' + name : '')) +
                '&body=' + encodeURIComponent(text);
        }

        if (status) {
          status.className = 'form-status form-status--ok';
          status.hidden = false;
          status.textContent = target === 'whatsapp'
            ? 'All set — opening WhatsApp so you can review and send your enquiry.'
            : 'All set — opening your email app so you can review and send your enquiry.';
        }

        window.open(url, '_blank', 'noopener');
        form.reset();
      });
    });
  }

  /* ======================================================================
     5. FAQ accordion
     ====================================================================== */
  function initFaq() {
    $$('.faq__q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    });
  }

  /* ======================================================================
     6. Gallery lightbox
     ====================================================================== */
  function initLightbox() {
    var box = $('#lightbox');
    if (!box) return;

    var img   = $('.lightbox__img', box);
    var title = $('.lightbox__title', box);
    var sub   = $('.lightbox__sub', box);
    var close = $('.lightbox__close', box);
    var lastFocused = null;

    function open(trigger) {
      var source = $('img', trigger);
      if (!source) return;
      lastFocused = trigger;

      img.src = source.currentSrc || source.src;
      img.alt = source.alt || '';
      title.textContent = trigger.getAttribute('data-title') || source.alt || '';
      sub.textContent   = trigger.getAttribute('data-caption') || '';

      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      close.focus();
    }

    function hide() {
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      img.removeAttribute('src');
      if (lastFocused) lastFocused.focus();
    }

    $$('.gallery__item').forEach(function (item) {
      item.addEventListener('click', function () { open(item); });
    });

    close.addEventListener('click', hide);
    box.addEventListener('click', function (e) { if (e.target === box) hide(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-open')) hide();
    });
  }

  /* ======================================================================
     7. Opening hours — highlight today
     ====================================================================== */
  function initHours() {
    var rows = $$('[data-day]');
    if (!rows.length) return;
    var today = new Date().getDay(); /* 0 = Sunday */
    rows.forEach(function (row) {
      if (parseInt(row.getAttribute('data-day'), 10) === today) {
        row.classList.add('hours__row--today');
      }
    });

    var badge = $('#openState');
    if (!badge) return;
    var open = badge.getAttribute('data-open');   /* "HH:MM" */
    var shut = badge.getAttribute('data-close');  /* "HH:MM" */
    if (!open || !shut) return;

    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    var toMins = function (s) {
      var p = s.split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
    };

    var isOpen = mins >= toMins(open) && mins < toMins(shut);
    badge.textContent = isOpen ? 'Open now' : 'Closed now';
    badge.classList.toggle('hours-badge--closed', !isOpen);
  }

  /* ======================================================================
     8. Footer year
     ====================================================================== */
  function initYear() {
    $$('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ======================================================================
     9. Reveal-on-scroll (skipped entirely for reduced-motion visitors)
     ====================================================================== */
  function initReveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    items.forEach(function (el) { el.classList.add('will-reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ======================================================================
     Boot
     ====================================================================== */
  function boot() {
    initHeader();
    initDrawer();
    initPersonalise();
    initEnquiryForms();
    initFaq();
    initLightbox();
    initHours();
    initYear();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
