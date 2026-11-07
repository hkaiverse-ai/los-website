// Prepare a reviewable email locally. This page has no form-delivery endpoint.
(() => {
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  const categories = {
    operations: ['Improve Our Operations', 'Tell us which process needs attention, the current challenge and the outcome you want.'],
    'digital-ai': ['Explore Digital & AI Solutions', 'Describe the task, information or workflow you want to improve. Solution scope and readiness will be confirmed during enquiry.'],
    asf: ['Understand ASF™ and its analysis application', 'Tell us about your business context, improvement decisions, or access questions for the separate ASF Analysis application. Do not include an API key.'],
  };
  const services = {
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
  const context = document.getElementById('enquiry-context');
  const serviceLabel = document.getElementById('selected-service');
  const fields = ['name', 'email', 'company', 'challenge'].map((name) => form.elements.namedItem(name));
  const currentInterest = () => radios.find((radio) => radio.checked)?.value;
  const matchingService = () => selectedService && selectedService[0] === currentInterest() ? selectedService[1] : '';

  const updateChoice = () => {
    const category = currentInterest();
    context.textContent = has(categories, category) ? categories[category][1] : 'Choose an enquiry option to continue.';
    const service = matchingService();
    serviceLabel.textContent = service ? `Your area of interest: ${service}` : '';
    serviceLabel.hidden = !service;
    result.hidden = true;
    document.getElementById('compose-enquiry').setAttribute('href', 'mailto:info@leanovaopexsolutions.com');
    document.getElementById('enquiry-copy').value = '';
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
    // Strip line breaks from the subject; all values are URI-encoded and rendered as text.
    const subject = `Leanova enquiry: ${categories[category][0]}`;
    const body = [
      `Enquiry: ${categories[category][0]}`,
      matchingService() ? `Area of interest: ${matchingService()}` : '',
      `Name: ${values.name}`,
      `Reply email: ${values.email}`,
      values.company ? `Organization: ${values.company}` : '',
      '',
      'Challenge or idea:',
      values.challenge,
    ].filter((line) => line !== '').join('\n');
    document.getElementById('enquiry-copy').value = `To: info@leanovaopexsolutions.com\nSubject: ${subject}\n\n${body}`;
    document.getElementById('compose-enquiry').setAttribute('href', `mailto:info@leanovaopexsolutions.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    result.hidden = false;
    document.getElementById('prepared-heading').focus();
  });

  form.hidden = false;
  document.getElementById('email-fallback').hidden = true;
  updateChoice();
})();
