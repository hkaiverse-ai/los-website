// Progressive enhancement: navigation remains visible when JavaScript is absent.
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('primary-navigation');
  if (!toggle || !navigation) return;
  const mobile = window.matchMedia('(max-width: 58rem)');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('span').textContent = open ? '−' : '+';
    navigation.hidden = mobile.matches && !open;
  };
  const sync = () => {
    const moveFocus = mobile.matches && navigation.contains(document.activeElement);
    toggle.hidden = !mobile.matches;
    setOpen(false);
    if (moveFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', (event) => {
    if (mobile.matches && event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobile.matches && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  mobile.addEventListener('change', sync);
  sync();
})();

// Copy-to-clipboard for visible contact details (no mail handler needed).
document.querySelectorAll('[data-copy]').forEach((button) => {
  const status = document.getElementById(button.getAttribute('aria-describedby') || '');
  const say = (text) => { if (status) status.textContent = text; };
  button.addEventListener('click', async () => {
    const value = button.getAttribute('data-copy');
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('unavailable');
      await navigator.clipboard.writeText(value);
      say(`Copied ${value}. Paste it into the "To" field of any email account.`);
    } catch (error) {
      say(`Copy is not available in this browser. Please select and copy: ${value}`);
    }
  });
});
