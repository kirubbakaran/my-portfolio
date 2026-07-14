// =====================================================
// 1. MOBILE HAMBURGER MENU TOGGLE
// =====================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// =====================================================
// 2. CONTACT FORM — sends data to your Flask + MySQL API
// =====================================================
const CONTACT_API_URL = 'https://portfolio-contact-api-bpqh.onrender.com/contact';

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault(); // stop normal page reload

  formStatus.textContent = 'Sending...';
  formStatus.style.color = '#8b97a8';

  const payload = {
    name: contactForm.name.value,
    email: contactForm.email.value,
    message: contactForm.message.value,
    botcheck: contactForm.botcheck.checked,
  };

  try {
    const response = await fetch(CONTACT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      formStatus.textContent = '✓ Your message has been stored!';
      formStatus.style.color = '#2dd4bf';
      contactForm.reset();
    } else {
      formStatus.textContent = '⚠ ' + (result.error || 'Something went wrong. Please try again.');
      formStatus.style.color = '#f87171';
    }
  } catch (error) {
    formStatus.textContent = '⚠ Could not send. Check your internet connection.';
    formStatus.style.color = '#f87171';
  }
});

// =====================================================
// 3. AUTO-UPDATE FOOTER YEAR
// =====================================================
document.getElementById('year').textContent = new Date().getFullYear();
