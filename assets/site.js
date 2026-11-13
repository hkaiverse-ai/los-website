(() => {
  const email = 'info@leanovaopexsolutions.com';
  const menu = document.querySelector('.menu');
  const nav = document.getElementById('navigation');
  if (menu && nav) {
    menu.hidden = false;
    nav.classList.add('is-collapsed');
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-collapsed', !open);
    });
  }
  async function copy(text, status, field) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      status.textContent = 'Copied. Paste into your email or message.';
    } catch {
      if (field) { field.focus(); field.select(); }
      status.textContent = field ? 'Select and copy the enquiry text above, then paste it into your email.' : `Copy this address manually: ${email}`;
    }
  }
  document.getElementById('copy-email')?.addEventListener('click', () => copy(email, document.getElementById('email-status')));
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  const result = document.getElementById('enquiry-result');
  const status = document.getElementById('send-status');
  const output = document.getElementById('enquiry-text');
  const fields = [...form.querySelectorAll('input,select,textarea')];
  fields.forEach(field => field.addEventListener('input', () => {
    field.setCustomValidity(field.required && !field.value.trim() ? 'Please complete this field.' : '');
    result.hidden = true;
    output.value = '';
    status.textContent = '';
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    fields.forEach(field => field.setCustomValidity(field.required && !field.value.trim() ? 'Please complete this field.' : ''));
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    const subject = 'Leanova project enquiry';
    const body = `Name: ${values.name.trim()}\r\nCompany: ${values.company.trim()}\r\nEmail: ${values.email.trim()}\r\nIndustry: ${values.industry}\r\n\r\nProject requirements:\r\n${values.requirements.trim().replace(/\r\n|\r|\n/g, '\r\n')}`;
    output.value = `To: ${email}\nSubject: ${subject}\n\n${body}`;
    document.getElementById('send-mail').href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const query = obj => Object.entries(obj).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    document.getElementById('send-gmail').href = `https://mail.google.com/mail/?${query({view:'cm',fs:'1',to:email,su:subject,body})}`;
    document.getElementById('send-outlook').href = `https://outlook.live.com/mail/0/deeplink/compose?${query({to:email,subject,body})}`;
    document.getElementById('send-wa').href = `https://wa.me/919491887419?text=${encodeURIComponent(subject+'\n\n'+body)}`;
    result.hidden = false;
    document.getElementById('result-heading').focus();
  });
  document.getElementById('copy-enquiry').addEventListener('click', () => copy(output.value, status, output));
  document.getElementById('send-mail').addEventListener('click', () => {
    status.textContent = 'Your browser was asked to open an email app. If nothing opens, choose Gmail or Outlook, or copy the enquiry text. Review and send it there. No message has been sent by this website.';
  });
  ['send-gmail','send-outlook','send-wa'].forEach(id => document.getElementById(id).addEventListener('click', () => {
    status.textContent = 'Review and send the message in the selected service. Opening a draft does not confirm delivery.';
  }));
})();
