// Prepare a reviewable email locally. This page has no form-delivery endpoint.
(() => {
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  const categories = {
    operations: ['Improve Our Operations', 'Tell us which process needs attention, the current challenge and the outcome you want.'],
    'digital-ai': ['Explore Digital & AI Solutions', 'Describe the task, information or workflow you want to improve. Solution scope and readiness will be confirmed during enquiry.'],
    asf: ['Understand ASF™', 'Tell us about your business context, improvement decisions, or access questions for the separate ASF Analysis application. Do not include an API key.'],
  };
  const services = {
    operations: ['operations', 'Operational Excellence'],
    lean: ['operations', 'Lean Transformation'],
    productivity: ['operations', 'Productivity Improvement'],
    quality: ['operations', 'Quality & Process Excellence'],
    'supply-chain': ['operations', 'Supply Chain & Operational Flow'],
    training: ['operations', 'Capability Development'],
    digital: ['digital-ai', 'Digital Transformation'],
    ai: ['digital-ai', 'AI-Enabled Operations'],
    agents: ['digital-ai', 'AI Agents & Agentic Systems'],
    'multi-agent': ['digital-ai', 'Multi-Agent Systems & Orchestration'],
    llm: ['digital-ai', 'LLM Applications & Integration'],
    assistants: ['digital-ai', 'AI Assistants & Knowledge Assistants'],
    voice: ['digital-ai', 'Voice AI & Voice Agents'],
    workflows: ['digital-ai', 'Intelligent Workflow & Business Process Automation'],
    rag: ['digital-ai', 'Retrieval-Augmented Generation (RAG)'],
    reporting: ['digital-ai', 'AI-enabled Reporting & Knowledge Management'],
  };
  const params = new URLSearchParams(window.location.search);
  const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const requestedInterest = params.get('interest');
  const requestedService = params.get('service');
  const selectedService = has(services, requestedService) ? services[requestedService] : null;
  const initialInterest = has(categories, requestedInterest) ? requestedInterest : selectedService?.[0];
  const radios = [...form.querySelectorAll('input[name="interest"]')];
  const result = document.getElementById('prepared-enquiry');
  const copyText = document.getElementById('enquiry-copy');
  const copyStatus = document.getElementById('enquiry-copy-status');
  const openStatus = document.getElementById('enquiry-open-status');
  const context = document.getElementById('enquiry-context');
  const serviceLabel = document.getElementById('selected-service');
  const fields = ['name', 'email', 'phone', 'company', 'industry', 'location', 'challenge'].map((name) => form.elements.namedItem(name));
  const currentInterest = () => radios.find((radio) => radio.checked)?.value;
  const matchingService = () => selectedService && selectedService[0] === currentInterest() ? selectedService[1] : '';
  const providerLinks = {
    'compose-gmail': 'https://mail.google.com/mail/',
    'compose-outlook': 'https://outlook.live.com/mail/0/deeplink/compose',
    'compose-m365': 'https://outlook.office.com/mail/deeplink/compose',
  };
  const whatsapp = (form.getAttribute && form.getAttribute('data-whatsapp')) || '';
  const waLink = document.getElementById('compose-whatsapp');
  const encodeQuery = (values) => Object.entries(values)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');

  const updateChoice = () => {
    const category = currentInterest();
    context.textContent = has(categories, category) ? categories[category][1] : 'Choose an enquiry option to continue.';
    const service = matchingService();
    serviceLabel.textContent = service ? `Your area of interest: ${service}` : '';
    serviceLabel.hidden = !service;
    result.hidden = true;
    if (waLink) waLink.hidden = true;
    document.getElementById('compose-enquiry').setAttribute('href', 'mailto:contact@leanovaopexsolutions.com');
    Object.entries(providerLinks).forEach(([id, url]) => document.getElementById(id).setAttribute('href', url));
    document.getElementById('enquiry-copy').value = '';
    copyStatus.textContent = '';
    openStatus.textContent = '';
  };

  radios.forEach((radio) => {
    radio.checked = radio.value === initialInterest;
    radio.addEventListener('change', updateChoice);
  });
  fields.forEach((field) => {
    const validateWhitespace = () => field.setCustomValidity(field.required && !field.value.trim() ? 'Please complete this field.' : '');
    field.addEventListener('input', () => {
      validateWhitespace();
      if (!result.hidden) updateChoice();
    });
    field.addEventListener('change', validateWhitespace);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    fields.forEach((field) => field.setCustomValidity(field.required && !field.value.trim() ? 'Please complete this field.' : ''));
    if (!form.reportValidity()) return;
    const category = currentInterest();
    if (!has(categories, category)) return;
    const values = Object.fromEntries(fields.map((field) => [field.name, field.value.trim()]));
    // The subject is selected from trusted labels. Encode each mailto header separately.
    const subject = `Leanova enquiry: ${categories[category][0]}`;
    const headers = [
      `Enquiry: ${categories[category][0]}`,
      matchingService() ? `Area of interest: ${matchingService()}` : '',
      `Name: ${values.name}`,
      `Reply email: ${values.email}`,
      values.phone ? `Phone: ${values.phone}` : '',
      values.company ? `Company: ${values.company}` : '',
      values.industry ? `Industry: ${values.industry}` : '',
      values.location ? `Location: ${values.location}` : '',
    ].filter(Boolean).join('\r\n');
    // RFC 6068 mailto bodies use CRLF; preserve the visitor's multiline message.
    const body = `${headers}\r\n\r\nRequirement / business challenge:\r\n${values.challenge.replace(/\r\n|\r|\n/g, '\r\n')}`;
    copyText.value = `To: contact@leanovaopexsolutions.com\nSubject: ${subject}\n\n${body.replace(/\r\n/g, '\n')}`;
    document.getElementById('compose-enquiry').setAttribute('href', `mailto:contact@leanovaopexsolutions.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    const to = 'contact@leanovaopexsolutions.com';
    document.getElementById('compose-gmail').setAttribute('href', `${providerLinks['compose-gmail']}?${encodeQuery({ view: 'cm', fs: '1', to, su: subject, body })}`);
    const outlookQuery = encodeQuery({ to, subject, body });
    document.getElementById('compose-outlook').setAttribute('href', `${providerLinks['compose-outlook']}?${outlookQuery}`);
    document.getElementById('compose-m365').setAttribute('href', `${providerLinks['compose-m365']}?${outlookQuery}`);
    if (waLink && /^\d{10,15}$/.test(whatsapp)) {
      waLink.setAttribute('href', `https://wa.me/${whatsapp}?text=${encodeURIComponent(`${subject}\n\n${body.replace(/\r\n/g, '\n')}`)}`);
      waLink.hidden = false;
    }
    result.hidden = false;
    copyStatus.textContent = '';
    openStatus.textContent = '';
    document.getElementById('prepared-heading').focus();
  });

  Object.keys(providerLinks).forEach((id) => {
    document.getElementById(id).addEventListener('click', () => {
      openStatus.textContent = 'A draft was requested in your chosen email provider. Sign in if asked, review the recipient and message, then click Send there. If the draft is not filled in, use Copy enquiry text. This website has not sent the email.';
    });
  });

  document.getElementById('compose-enquiry').addEventListener('click', () => {
    // Do not cancel the native mailto action or claim that a handler opened/sent mail.
    openStatus.textContent = 'Your browser was asked to open an email application. If no compose window appears, use Copy enquiry text and compose the message manually. No email has been sent by this website.';
  });

  document.getElementById('copy-enquiry').addEventListener('click', async () => {
    const text = copyText.value;
    if (!text || result.hidden) return;
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch { /* Fall back to a user-selected text field below. */ }
    if (!copied) {
      copyText.focus();
      copyText.select();
      copyText.setSelectionRange(0, text.length);
      try { copied = document.execCommand('copy'); } catch { /* Manual selection remains. */ }
    }
    if (copyText.value !== text || result.hidden) return;
    copyStatus.textContent = copied
      ? 'Enquiry text copied. Paste it into a new email and review it before sending. No email has been sent.'
      : 'Automatic copying is unavailable. The text is selected: press Ctrl+C (Windows), Command+C (Mac), or use your device’s Copy command. Then paste it into a new email. No email has been sent.';
  });

  form.hidden = false;
  document.getElementById('email-fallback').hidden = true;
  updateChoice();
})();
