/* 화면을 가리는 전환 대신 짧은 진입 효과만 사용합니다. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pending = null;
  function enabled(){return !reduced.matches && typeof Element.prototype.animate === 'function';}
  function cancel(){if(!pending)return;const work=pending;pending=null;work.animations.forEach(animation=>animation.cancel());}
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


  function begin(previousId,nextId,interactive=true){
    cancel();
    if(!interactive||previousId===nextId||!enabled())return null;
    const work={animations:[]};pending=work;
    return ()=>{
      if(pending!==work)return;
      const destination=document.getElementById(nextId);
      if(!destination?.classList.contains('active')||!enabled()){cancel();return;}
      const targets=entranceTargets(destination);
      work.animations=(targets.length?targets:[destination]).map((node,i)=>node.animate([
        {opacity:.8,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}
      ],{duration:160,delay:Math.min(i*42,84),easing:'ease-out',fill:'backwards'}));
      Promise.all(work.animations.map(a=>a.finished.catch(()=>{}))).then(()=>{if(pending===work)cancel();});
    };
  }
  reduced.addEventListener?.('change',cancel);
  window.addEventListener('pagehide',cancel);
  window.AnjwaMotion={begin,cancel};
})();
