'use strict';
/*
  MATRIX / DIGITAL RAIN INTRO
  No dependencies, no changes to your SVGs or project data.
  Settings can be changed using the Neon Studio editor.
*/
(() => {
  const overlay = document.getElementById('matrix-intro');
  const canvas = document.getElementById('matrix-canvas');
  const skip = document.getElementById('matrix-skip');
  const replay = document.getElementById('matrix-replay');
  const bar = document.getElementById('matrix-progress-bar');
  const status = document.getElementById('matrix-boot-status');
  const title = document.getElementById('matrix-intro-title');
  const label = document.getElementById('matrix-intro-label');
  const ctx = canvas?.getContext('2d', {alpha:false});
  if (!overlay || !canvas || !ctx || !skip) return;

  const settings = window.SITE_CONTENT || {};
  const enabled = settings.matrixIntroEnabled !== false && settings.matrixIntroEnabled !== 'false';
  const durationChoices = [3000,4500,6500];
  const duration = durationChoices.includes(Number(settings.matrixIntroDuration))
    ? Number(settings.matrixIntroDuration) : 4500;
  const selectedColor = /^#[0-9a-f]{6}$/i.test(settings.matrixIntroColor || '')
    ? settings.matrixIntroColor : '#49ff88';
  const message = (typeof settings.matrixIntroTitle === 'string' && settings.matrixIntroTitle.trim())
    ? settings.matrixIntroTitle.trim().slice(0,64) : 'ENTER THE GRID';
  const eyebrow = (typeof settings.matrixIntroLabel === 'string' && settings.matrixIntroLabel.trim())
    ? settings.matrixIntroLabel.trim().slice(0,70) : 'ESTABLISHING CONNECTION';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canPlay = enabled && !reducedMotion;
  replay.hidden = !canPlay;
  overlay.style.setProperty('--matrix-ink', selectedColor);
  title.firstChild.textContent = message;
  label.textContent = eyebrow;

  let frame = 0;
  let finishTimer = 0;
  let cleanupTimer = 0;
  let startTime = 0;
  let lastFrameTime = 0;
  let running = false;
  let rain = [];
  let fontSize = 17;
  let width = 0;
  let height = 0;
  let beforeFocus = null;
  let lastStatus = -1;
  const glyphs = ['0','1'];
  const colorValues = [1,3,5].map(i => parseInt(selectedColor.slice(i,i+2),16));

  const rgba = (alpha) => `rgba(${colorValues[0]},${colorValues[1]},${colorValues[2]},${alpha})`;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    fontSize = width < 640 ? 14 : 17;
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle = '#010806';
    ctx.fillRect(0,0,width,height);
    const cols = Math.ceil(width / fontSize);
    rain = Array.from({length:cols},() => ({
      y: Math.random() * (height / fontSize + 25) - 20,
      speed: .45 + Math.random() * 1.05,
      phase: Math.random() * 99,
      trail: 4 + Math.floor(Math.random() * 9)
    }));
  }
  function draw(now) {
    if (!running) return;
    frame = window.requestAnimationFrame(draw);
    if (now - lastFrameTime < 33) return; // limit to ~30 frames per second
    const elapsed = Math.min(68,now - lastFrameTime || 33);
    lastFrameTime = now;
    ctx.fillStyle = 'rgba(1,8,5,.13)';
    ctx.fillRect(0,0,width,height);
    ctx.font = `700 ${fontSize}px "Space Mono",monospace`;
    ctx.textBaseline = 'top';
    rain.forEach((col,i) => {
      const x = i * fontSize;
      col.y += col.speed * elapsed / 33;
      if (col.y * fontSize > height + col.trail * fontSize) {
        col.y = -4 - Math.random() * 22;
        col.speed = .45 + Math.random() * 1.05;
      }
      // Bright lead bit and fading trailing bits. Digits are re-randomized every tick.
      for (let t = 0; t < col.trail; t++) {
        const y = (col.y - t) * fontSize;
        if (y < -fontSize || y > height) continue;
        ctx.fillStyle = t === 0 ? '#d8ffe6' : rgba(Math.max(.10,.78 * (1 - t / col.trail)));
        ctx.fillText(glyphs[Math.random() > .5 ? 1 : 0],x,y);
      }
    });
    const fraction = Math.min(1,(performance.now()-startTime) / duration);
    bar.style.width = `${Math.round(fraction * 100)}%`;
    const phase = fraction < .24 ? 0 : fraction < .52 ? 1 : fraction < .8 ? 2 : 3;
    if (phase !== lastStatus) {
      lastStatus = phase;
      status.textContent = [
        'DECRYPTING PORTFOLIO DATA...',
        'ACCESSING SECURE DIRECTORY...',
        'LOADING MISSION ARCHIVE...',
        'CONNECTION ESTABLISHED.'
      ][phase];
    }
  }
  function stop() {
    if (!running) return;
    running = false;
    window.cancelAnimationFrame(frame);
    clearTimeout(finishTimer);
    overlay.classList.add('is-hiding');
    document.body.classList.remove('matrix-intro-active');
    cleanupTimer = window.setTimeout(() => {
      overlay.hidden = true;
      overlay.classList.remove('is-hiding');
      ctx.clearRect(0,0,width,height);
      if (overlay.contains(document.activeElement)) {
        document.getElementById('home')?.setAttribute('tabindex','-1');
        document.getElementById('home')?.focus({preventScroll:true});
      }
    },800);
  }
  function start() {
    if (!canPlay) return;
    if (running) stop();
    clearTimeout(cleanupTimer);
    clearTimeout(finishTimer);
    if (overlay.contains(document.activeElement)) skip.blur();
    beforeFocus = document.activeElement;
    overlay.classList.remove('is-hiding');
    overlay.hidden = false;
    document.body.classList.add('matrix-intro-active');
    resize();
    bar.style.width = '0%';
    status.textContent = 'DECRYPTING PORTFOLIO DATA...';
    lastStatus = -1;
    lastFrameTime = 0;
    startTime = performance.now();
    running = true;
    frame = requestAnimationFrame(draw);
    finishTimer = window.setTimeout(stop, duration);
    skip.focus({preventScroll:true});
  }

  skip.addEventListener('click',stop);
  document.addEventListener('keydown', e => {
    if (!running) return;
    if (e.key === 'Escape') {e.preventDefault();stop();}
    if (e.key === 'Tab') {e.preventDefault();skip.focus({preventScroll:true});}
  });
  document.addEventListener('visibilitychange',() => {if (document.hidden) stop();});
  window.addEventListener('resize',() => {if (running) resize();},{passive:true});
  replay.addEventListener('click',() => {
    // Replaying from the footer intentionally returns to the landing screen.
    window.scrollTo({top:0,behavior:'instant'});
    start();
  });
  // Don't obstruct direct project links, back/forward navigation, or scrolled reloads.
  if (canPlay && (!window.location.hash || window.location.hash === '#home') && window.scrollY < 40) start();
})();
