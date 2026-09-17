const menuToggle = document.querySelector('.menu-toggle');
const desktopNav = document.querySelector('.desktop-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = desktopNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

desktopNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    desktopNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.getElementById('year').textContent = new Date().getFullYear();

const whatsappModal = document.getElementById('whatsapp-form');
const whatsappForm = document.getElementById('whatsapp-contact-form');
const modalChannelLabel = document.getElementById('modal-channel-label');
const modalSubmit = document.getElementById('modal-submit');
const modalIntro = document.querySelector('.modal-intro');
let selectedContact = 'whatsapp';

const closeWhatsappModal = () => {
  whatsappModal.classList.remove('is-open');
  whatsappModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

document.querySelectorAll('.contact-trigger').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    selectedContact = trigger.dataset.contact;
    const platformName = selectedContact.charAt(0).toUpperCase() + selectedContact.slice(1);
    modalChannelLabel.textContent = `${platformName} message`;
    modalSubmit.innerHTML = `Continue to ${platformName} <span>↗</span>`;
    modalIntro.textContent = selectedContact === 'whatsapp'
      ? 'Fill in your details and WhatsApp will open with your message ready to send.'
      : selectedContact === 'email'
        ? 'Fill in your details and your email app will open with the message ready to send.'
        : 'Fill in your details. Your message will be copied, then your profile will open so you can paste and send it.';
    whatsappModal.classList.add('is-open');
    whatsappModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    whatsappModal.querySelector('input').focus();
  });
});

whatsappModal.querySelectorAll('[data-close-modal]').forEach((element) => {
  element.addEventListener('click', closeWhatsappModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && whatsappModal.classList.contains('is-open')) closeWhatsappModal();
});

whatsappForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const details = new FormData(whatsappForm);
  const message = `Hello Samiullah,\n\nName: ${details.get('name')}\nEmail: ${details.get('email')}\nPhone: ${details.get('phone')}\nMessage: ${details.get('message')}`;
  const encodedMessage = encodeURIComponent(message);
  const destinations = {
    whatsapp: `https://wa.me/923291504030?text=${encodedMessage}`,
    email: `mailto:chsami1596@gmail.com?subject=Portfolio%20contact%20from%20${encodeURIComponent(details.get('name'))}&body=${encodedMessage}`,
    instagram: 'https://instagram.com/ch_sami1596',
    facebook: 'https://facebook.com'
  };
  if (selectedContact === 'instagram' || selectedContact === 'facebook') {
    navigator.clipboard?.writeText(message);
  }
  window.open(destinations[selectedContact], '_blank', 'noopener,noreferrer');
  closeWhatsappModal();
  whatsappForm.reset();
});
