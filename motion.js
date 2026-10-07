/* Presentation only: navigation, curriculum, storage and demand logic stay synchronous. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pending = null;
  const styleProperties = ['display','position','box-sizing','width','height','min-width','min-height','max-width','max-height','padding','margin','top','right','bottom','left','flex-direction','flex-wrap','flex-grow','flex-shrink','align-items','justify-content','gap','background','color','border','border-radius','box-shadow','font-family','font-size','font-weight','line-height','letter-spacing','white-space','text-align','opacity','overflow','transform','transform-origin','z-index'];

  function cancel() {
    if (!pending) return;
    const work = pending;
    pending = null;
    clearTimeout(work.timer);
    work.animations.forEach(animation => animation.cancel());
    work.layer?.remove();
  }

  function enabled() { return !reduced.matches && typeof Element.prototype.animate === 'function'; }

  function entranceTargets(destination) {
    const selector = destination.id === 'home'
      ? '.home-brand-row,.home-intro,.home-area-card,.home-library-block,.student-start-card'
      : '.section-head,.launch-card,.curriculum-filter-panel,.subject-list-panel,.planner-mode-panel,.planner-summary-panel,.semester-board,.self-eval-mode-switch,.self-eval-identity-row,.student-draft-controls,.self-eval-control-row,.self-eval-side-panel';
    const candidates = [...destination.querySelectorAll(selector)];
    const items = candidates.length ? candidates : [...destination.children];
    return items.filter(node => {
      const box = node.getBoundingClientRect();
      return box.width && box.height && box.bottom > 0 && box.top < window.innerHeight
        && !items.some(parent => parent !== node && parent.contains(node));
    }).slice(0,12);
  }

  function copyCard(source) {
    const copy = source.cloneNode(true);
    const originals = [source, ...source.querySelectorAll('*')];
    const copies = [copy, ...copy.querySelectorAll('*')];
    originals.forEach((original, i) => {
      const node = copies[i];
      node.removeAttribute('id');
      node.removeAttribute('autofocus');
      const computed = getComputedStyle(original);
      for (const property of styleProperties) node.style.setProperty(property, computed.getPropertyValue(property));
    });
    copy.querySelectorAll('.button-feedback-wave').forEach(node => node.remove());
    const box = source.getBoundingClientRect();
    Object.assign(copy.style, {position:'absolute',left:`${box.left}px`,top:`${box.top}px`,right:'auto',bottom:'auto',width:`${box.width}px`,height:`${box.height}px`,margin:'0',pointerEvents:'none'});
    copy.inert = true;
    return copy;
  }

  function begin(previousId, nextId, interactive = true) {
    cancel();
    if (!interactive || previousId === nextId || !enabled()) return null;
    const work = {animations:[], timer:null, layer:null};
    pending = work;
    const previous = document.getElementById(previousId);
    const candidates = previousId === 'home' ? previous?.querySelectorAll('.home-area-card') : previousId === 'departments' ? previous?.querySelectorAll('.department-choice') : [];
    const visible = [...(candidates || [])].filter(node => {
      const rect = node.getBoundingClientRect();
      return rect.width && rect.height && rect.bottom > 0 && rect.top < window.innerHeight;
    });
    if (visible.length) {
      const layer = document.createElement('div');
      layer.className = 'app-motion-layer';
      layer.setAttribute('aria-hidden','true');
      const canvas = document.createElement('div');
      canvas.className = 'app-motion-canvas';
      visible.forEach(card => canvas.append(copyCard(card)));
      const indicator = document.createElement('div');
      indicator.className = 'app-motion-indicator';
      const dots = document.createElement('span');
      dots.className = 'app-motion-dots';
      for (let i=0; i<3; i++) dots.append(document.createElement('span'));
      const text = document.createElement('span');
      text.textContent = '화면 전환 중';
      indicator.append(dots,text);
      layer.append(canvas,indicator);
      document.body.append(layer);
      work.layer = layer;
    }
    return () => {
      if (pending !== work) return;
      const destination = document.getElementById(nextId);
      const enter = () => {
        if (pending !== work) return;
        work.layer?.remove();
        work.layer = null;
        if (!destination?.classList.contains('active') || !enabled()) { cancel(); return; }
        const targets = entranceTargets(destination);
        const items = targets.length ? targets : [destination];
        const arrivals = items.map((node,i) => {
          const box = node.getBoundingClientRect();
          const x = (box.left + box.width / 2 < window.innerWidth / 2 ? -1 : 1) * 24;
          const animation = node.animate([
            {opacity:0,transform:`translate(${x}px,28px) scale(.94) rotate(${x < 0 ? -1.2 : 1.2}deg)`},
            {opacity:1,transform:'translate(0,-2px) scale(1.008) rotate(0deg)',offset:.78},
            {opacity:1,transform:'translate(0,0) scale(1) rotate(0deg)'}
          ],{duration:430,delay:i*42,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
          work.animations.push(animation);
          return animation.finished.catch(()=>{});
        });
        Promise.all(arrivals).then(() => { if (pending === work) cancel(); });
      };
      if (!work.layer) { enter(); return; }
      const directions = [[-64,-30,-6],[64,-30,6],[-64,30,-4],[64,30,4]];
      [...work.layer.querySelector('.app-motion-canvas').children].forEach((card,i) => {
        const [x,y,rotation] = directions[i % directions.length];
        const animation = card.animate([{opacity:1,transform:'translate(0,0) rotate(0deg)'},{opacity:1,transform:'translate(0,-4px) scale(1.015)',offset:.18},{opacity:0,transform:`translate(${x}px,${y}px) rotate(${rotation}deg) scale(.97)`}],{duration:300,delay:i*48,easing:'cubic-bezier(.4,0,.8,.4)',fill:'forwards'});
        work.animations.push(animation);
        animation.finished.catch(()=>{});
      });
      work.layer.classList.add('is-playing');
      work.timer = setTimeout(enter,Math.min(560,300 + (visible.length-1)*48));
    };
  }

  reduced.addEventListener?.('change',cancel);
  window.addEventListener('pagehide',cancel);
  window.AnjwaMotion = {begin,cancel};
})();
