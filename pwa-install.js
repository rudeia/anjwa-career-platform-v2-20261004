(() => {
  let deferredPrompt = null;
  let guide = null;
  let opener = null;
  let busy = false;
  let installed = false;
  let message = '';
  const standaloneMedia = window.matchMedia('(display-mode: standalone)');
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMacSafari = /Macintosh/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent) && !/Chrome|Chromium|Edg/i.test(navigator.userAgent);
  const isFileProtocol = window.location.protocol === 'file:';
  const panels = () => document.querySelectorAll ? [...document.querySelectorAll('[data-pwa-install]')] : [document.querySelector('[data-pwa-install]')].filter(Boolean);
  const standalone = () => installed || standaloneMedia.matches || window.navigator.standalone === true;
  const defaultMessage = () => isFileProtocol ? '배포된 웹 주소에서 설치할 수 있습니다.' : isIos ? 'iPhone·iPad 설치 안내' : isMacSafari ? 'Safari 설치 안내' : '기기에 맞는 설치 방법을 확인하세요.';
  function refresh() {
    for (const panel of panels()) {
      panel.hidden = standalone();
      const status = panel.querySelector('[data-pwa-install-status]');
      const button = panel.querySelector('[data-pwa-install-button]');
      if (status) status.textContent = message || defaultMessage();
      if (button) { button.disabled = busy; button.textContent = busy ? '설치 확인 중' : '앱 설치'; }
    }
  }
  function closeGuide() {
    if (!guide) return;
    guide.hidden = true;
    document.body.classList.remove('pwa-guide-open');
    if (opener?.isConnected !== false) opener?.focus();
  }
  function ensureGuide() {
    if (guide) return guide;
    guide = document.createElement('div');
    guide.className = 'pwa-guide'; guide.hidden = true;
    guide.innerHTML = '<div class="pwa-guide-backdrop" data-pwa-guide-close></div><section class="pwa-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="pwaGuideTitle"><button class="pwa-guide-close" type="button" aria-label="설치 안내 닫기" data-pwa-guide-close>×</button><h2 id="pwaGuideTitle">앱 설치 안내</h2><div data-pwa-guide-content></div></section>';
    guide.querySelectorAll('[data-pwa-guide-close]').forEach(target => target.addEventListener('click', closeGuide));
    document.addEventListener('keydown', event => {
      if (guide.hidden) return;
      if (event.key === 'Escape') { event.preventDefault(); closeGuide(); }
      if (event.key === 'Tab') {
        const focusables = [...guide.querySelectorAll('button:not([disabled]), a[href], select, input:not([disabled]), [tabindex="0"]')];
        const first = focusables[0], last = focusables.at(-1);
        if (!focusables.includes(document.activeElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault(); (event.shiftKey ? last : first)?.focus();
        }
      }
    });
    document.body.append(guide); return guide;
  }
  function openGuide() {
    const target = ensureGuide(), content = target.querySelector('[data-pwa-guide-content]');
    content.innerHTML = isFileProtocol
      ? '<p>파일을 직접 연 화면에서는 앱을 설치할 수 없습니다.</p><ol><li>배포된 안좌고 교육과정 도우미 웹 주소로 접속합니다.</li><li><b>앱 설치</b> 버튼을 다시 누릅니다.</li></ol>'
      : isIos
      ? '<p>iPhone·iPad에서는 Safari의 공유 메뉴를 이용할 수 있습니다.</p><ol><li>Safari에서 이 앱의 웹 주소를 엽니다.</li><li><b>공유 → 홈 화면에 추가</b>를 선택합니다.</li><li>이름을 확인한 뒤 <b>추가</b>를 누릅니다.</li></ol>'
      : isMacSafari
      ? '<p>Mac의 Safari에서는 지원되는 버전에서 웹 앱을 Dock에 추가할 수 있습니다.</p><ol><li>Safari의 <b>파일 → Dock에 추가</b>를 선택합니다. 공유 메뉴에서도 찾을 수 있습니다.</li><li>이름을 확인한 뒤 <b>추가</b>를 누릅니다.</li><li>메뉴가 없으면 Chrome이나 Edge의 앱 설치 메뉴를 확인하세요.</li></ol>'
      : '<p>이 브라우저에서는 자동 설치창을 열 수 없어 설치 방법을 안내합니다.</p><ol><li>Chrome·Edge의 주소창 설치 아이콘이나 브라우저 메뉴를 엽니다.</li><li><b>앱 설치</b> 또는 <b>홈 화면에 추가</b>를 선택합니다.</li><li>앱 내부 브라우저라면 웹 주소를 Chrome·Edge 또는 Safari에서 다시 열어주세요.</li></ol>';
    target.hidden = false; document.body.classList.add('pwa-guide-open'); target.querySelector('.pwa-guide-close')?.focus();
  }
  async function installApp(event) {
    if (busy || standalone()) return;
    opener = event?.currentTarget || document.activeElement;
    if (!deferredPrompt) { openGuide(); return; }
    const prompt = deferredPrompt; deferredPrompt = null; busy = true; refresh();
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      message = choice?.outcome === 'accepted' ? '설치를 진행하고 있습니다.' : '설치를 취소했습니다. 다시 누르면 설치 방법을 볼 수 있습니다.';
    } catch {
      message = '설치창을 열지 못했습니다. 설치 방법을 확인하세요.'; openGuide();
    } finally { busy = false; refresh(); }
  }
  function initInstall() {
    panels().forEach(panel => panel.querySelector('[data-pwa-install-button]')?.addEventListener('click', installApp)); refresh();
  }
  if (document.readyState === 'loading' || document.readyState === 'interactive') document.addEventListener('DOMContentLoaded', initInstall, { once: true });
  else initInstall();
  standaloneMedia.addEventListener?.('change', refresh);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); if (standalone()) return;
    deferredPrompt = event; message = '이 기기에 설치할 수 있습니다.'; refresh();
  });
  window.addEventListener('appinstalled', () => { installed = true; deferredPrompt = null; closeGuide(); refresh(); });

  if ("serviceWorker" in navigator) {
    const hadController = Boolean(navigator.serviceWorker.controller);
    let reloading = false;
    let registration = null;
    let lastUpdateCheck = 0;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController || reloading || !document.querySelector("#home.active, #curriculum.active")) return;
      reloading = true;
      if (document.querySelector("#curriculum.active")) window.location.hash = "curriculum";
      window.location.reload();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible" || !registration || Date.now() - lastUpdateCheck < 60000) return;
      lastUpdateCheck = Date.now();
      registration.update().catch((error) => console.warn("앱 업데이트 확인 생략", error));
    });
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js", { scope: "./", updateViaCache: "none" })
        .then((result) => { registration = result; lastUpdateCheck = Date.now(); })
        .catch((error) => console.warn("서비스 워커 등록 실패", error));
    }, { once: true });
  }
})();
