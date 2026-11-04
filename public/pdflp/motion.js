'use strict';

(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate || reduced.matches) return;
  const running = new Map();
  const groups = [];
  let observer;
  let stopped = false;

  function register(container, elements, selectParts, options = {}) {
    if (!container || !elements.length) return;
    const group = {container, nextStart: 0, interval: 170, direction: 'up', immediate: false, ordered: false, units: [], ...options};
    container.dataset.motionGroup = '';
    elements.forEach((element, index) => {
      const parts = selectParts(element).filter(Boolean);
      if (!parts.length) return;
      parts.forEach(part => part.classList.add('motion-part', 'motion-pending'));
      group.units.push({element, parts, index, group, seen: false, ready: false});
    });
    groups.push(group);
  }
  const each = selector => [...document.querySelectorAll(selector)];
  const one = (selector, parts, options) => {
    const element = document.querySelector(selector);
    register(element, element ? [element] : [], parts, options);
  };

  // First screen: three lines slide right, starting on page load.
  one('.hero h1', el => [...el.querySelectorAll('.motion-copy')],
    {direction: 'right', immediate: true, interval: 320});

  // Retain the six vertical sequences from version 03.
  each('.feature-strip, .sample-explanation').forEach(container => {
    register(container, [...container.children].filter(el => el.tagName === 'DIV'),
      el => [el.querySelector('.icon-circle'), el.querySelector('strong'), el.querySelector('small')]);
  });
  const steps = document.querySelector('.learning-steps');
  register(steps, steps ? [...steps.children] : [], el => [...el.children]);
  const books = document.querySelector('.basic-books');
  register(books, books ? [...books.children] : [],
    el => [el.querySelector('.book-cover'), el.querySelector('.basic-book-label')], {interval: 150});
  const concerns = document.querySelector('.concerns');
  register(concerns, concerns ? [...concerns.children] : [], el => [el],
    {direction: 'right', interval: 260, ordered: true});
  one('#about .section-heading', el => [...el.querySelectorAll('.motion-copy')], {interval: 210});
  one('.vision-message', el => [...el.children], {interval: 240});

  // New horizontal sequences: each list item/card waits for its own crossing.
  one('.technical-panel .panel-heading', el => [...el.children], {direction: 'right', interval: 220});
  const technical = document.querySelector('.technical-books');
  register(technical, technical ? [...technical.children] : [],
    el => [...el.querySelector('a').children], {direction: 'right', interval: 140, ordered: true});
  const usage = document.querySelector('.usage-grid');
  register(usage, usage ? [...usage.children] : [],
    el => [el.querySelector('.usage-icon'), el.querySelector('h3'), el.querySelector('p')],
    {direction: 'right', interval: 220});
  one('.purchase-section h2', el => [...el.querySelectorAll('.motion-copy')], {direction: 'right', interval: 320});
  one('.closing h2', el => [...el.querySelectorAll('.motion-copy')], {direction: 'right', interval: 320});

  // 無料教材 (free-workbook) セクション
  // 1. 「まずは自分の滑舌を知ろう」を左からフェードイン
  one('#free-workbook-title', el => {
    const heading = el.closest('.free-heading');
    const eyebrow = heading ? heading.querySelector('.eyebrow') : null;
    return eyebrow ? [eyebrow, el] : [el];
  }, {motionType: 'slide-left', interval: 260});

  // 2. 「滑舌が悪い」を、ひとまとめにしない... を下からポップアップ
  one('.free-heading > p:last-child', el => [el], {motionType: 'popup'});

  // 6. 左側の画像をゆっくりポップアップ
  one('.free-workbook-cover', el => [el], {motionType: 'slow-popup'});

  // 3. 「日本語の発音を、舌と唇の位置から。」「発音の現在地 一音ずつの舌と唇」を左からフェードイン
  one('.free-workbook-copy', el => {
    const tag = el.querySelector('.free-book-tag');
    const title = el.querySelector('h3');
    const desc = el.querySelector('h3 + p');
    return [tag, title, desc].filter(Boolean);
  }, {motionType: 'slide-left', interval: 240});

  // 4. ①②③の各行で、「番号」➔「位置を知る」➔「説明文」を順番に時間差で左からフェードイン
  const freeSteps = document.querySelector('.free-workbook-steps');
  register(freeSteps, freeSteps ? [...freeSteps.children] : [], el => [
    el.querySelector('.step-num'),
    el.querySelector('strong'),
    el.querySelector('.step-desc')
  ].filter(Boolean), {motionType: 'slide-left', interval: 240, ordered: true});

  // 5. 「全部を順に練習する必要はありません...」を下からフェードイン
  one('.free-workbook-note', el => [el], {motionType: 'up-fade'});

  // 7. PDFダウンロードボタンをポップアップ
  one('.free-pdf-download', el => {
    const meta = el.nextElementSibling && el.nextElementSibling.classList.contains('free-download-meta') ? el.nextElementSibling : null;
    return meta ? [el, meta] : [el];
  }, {motionType: 'popup', interval: 200});

  // ブリッジ部分（自分の課題が見えたら、その先へ。）
  one('.free-workbook-bridge', el => [el], {motionType: 'up-fade'});

  // Move existing block effects to the same midpoint; avoid nested effects.
  each('.section-heading, .vision-body, .purchase-grid, .faq-list').forEach(el => {
    if (!el.hasAttribute('data-motion-group')) register(el, [el], item => [item]);
  });
  const byElement = new Map();
  groups.forEach(group => group.units.forEach(unit => byElement.set(unit.element, unit)));

  function show(unit) {
    if (unit.seen) return;
    unit.ready = true;
    // In a two-column grid, 7 may reach the midpoint before 2. Keep it queued.
    if (unit.group.ordered && unit.group.units.slice(0, unit.index).some(previous => !previous.seen)) return;
    unit.seen = true;
    if (observer) observer.unobserve(unit.element);
    if (stopped || reduced.matches) {
      unit.parts.forEach(part => part.classList.remove('motion-pending'));
      return;
    }
    const now = performance.now();
    const start = Math.max(now, unit.group.nextStart);
    const offset = unit.group.direction === 'right' ? 'translateX(-42px)' : 'translateY(24px)';
    unit.parts.forEach((part, index) => {
      let keyframes = [
        {opacity: 0, transform: offset},
        {opacity: 1, transform: 'translate(0, 0)'}
      ];
      let duration = unit.group.direction === 'right' ? 650 : 500;
      let easing = 'cubic-bezier(.22, 1, .36, 1)';

      const mType = unit.group.motionType;
      if (mType === 'slide-left') {
        keyframes = [
          {opacity: 0, transform: 'translateX(-42px)'},
          {opacity: 1, transform: 'translateX(0)'}
        ];
        duration = 650;
        easing = 'cubic-bezier(.22, 1, .36, 1)';
      } else if (mType === 'popup') {
        keyframes = [
          {opacity: 0, transform: 'translateY(24px) scale(0.92)'},
          {opacity: 1, transform: 'translate(0, 0) scale(1)'}
        ];
        duration = 650;
        easing = 'cubic-bezier(.22, 1, .36, 1)';
      } else if (mType === 'slow-popup') {
        keyframes = [
          {opacity: 0, transform: 'translateY(28px) scale(0.92)'},
          {opacity: 1, transform: 'translate(0, 0) scale(1)'}
        ];
        duration = 950;
        easing = 'cubic-bezier(.22, 1, .36, 1)';
      } else if (mType === 'up-fade') {
        keyframes = [
          {opacity: 0, transform: 'translateY(24px)'},
          {opacity: 1, transform: 'translateY(0)'}
        ];
        duration = 500;
        easing = 'cubic-bezier(.22, 1, .36, 1)';
      }

      const animation = part.animate(keyframes, {
        duration,
        delay: start - now + index * unit.group.interval,
        easing,
        fill: 'backwards'
      });
      part.classList.remove('motion-pending');
      running.set(animation, unit.group);
      animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    });
    unit.group.nextStart = start + unit.parts.length * unit.group.interval + 100;
    if (unit.group.ordered) {
      const next = unit.group.units.find(item => !item.seen);
      if (next && next.ready) show(next);
    }
  }

  function observeAtMidpoint() {
    if (stopped) return;
    if (observer) observer.disconnect();
    // Pixel margins: percentage root margins are relative to width, not height.
    const lowerHalf = Math.ceil(window.innerHeight / 2);
    observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting)
        .map(entry => byElement.get(entry.target)).filter(Boolean)
        .sort((a, b) => groups.indexOf(a.group) - groups.indexOf(b.group) || a.index - b.index)
        .forEach(show);
    }, {threshold: 0, rootMargin: `0px 0px -${lowerHalf}px 0px`});
    groups.forEach(group => {
      if (!group.immediate) group.units.forEach(unit => {
        if (!unit.seen) observer.observe(unit.element);
      });
    });
    checkProgress();
  }

  function checkProgress() {
    if (stopped) return;
    const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const midpoint = Math.floor(window.innerHeight / 2);
    byElement.forEach(unit => {
      if (unit.seen || unit.group.immediate) return;
      const rect = unit.element.getBoundingClientRect();
      // Large scroll jumps can skip the observer's entire intersection zone.
      if (rect.bottom <= 0) {
        unit.seen = true;
        observer.unobserve(unit.element);
        unit.parts.forEach(part => part.classList.remove('motion-pending'));
      } else if (rect.top <= midpoint || (atEnd && rect.top < window.innerHeight)) {
        show(unit);
      }
    });
  }

  function stop() {
    stopped = true;
    if (observer) observer.disconnect();
    running.forEach((group, animation) => animation.cancel());
    running.clear();
    byElement.forEach(unit => unit.parts.forEach(part => part.classList.remove('motion-pending')));
  }

  try {
    observeAtMidpoint();
    requestAnimationFrame(() => {
      groups.filter(group => group.immediate).forEach(group => group.units.forEach(show));
    });
    window.addEventListener('resize', observeAtMidpoint, {passive: true});
    let scrollFrame = false;
    window.addEventListener('scroll', () => {
      if (scrollFrame) return;
      scrollFrame = true;
      requestAnimationFrame(() => {scrollFrame = false; checkProgress();});
    }, {passive: true});
    document.addEventListener('focusin', event => {
      const container = event.target.closest('[data-motion-group]');
      const group = groups.find(item => item.container === container);
      if (!group) return;
      running.forEach((owner, animation) => {
        if (owner === group) {animation.cancel(); running.delete(animation);}
      });
      group.units.forEach(unit => {
        unit.seen = true;
        observer.unobserve(unit.element);
        unit.parts.forEach(part => part.classList.remove('motion-pending'));
      });
      group.nextStart = 0;
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        running.forEach((group, animation) => animation.cancel());
        running.clear();
        groups.forEach(group => {group.nextStart = 0;});
      }
    });
    const onMotionChange = () => {if (reduced.matches) stop();};
    if (reduced.addEventListener) reduced.addEventListener('change', onMotionChange);
    else reduced.addListener(onMotionChange);
  } catch (error) {
    stop();
  }
})();
