// =====================================================
// 1. MOBILE HAMBURGER MENU TOGGLE
// =====================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close the mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// =====================================================
// 2. CONTACT FORM — sends data to your Python Flask server,
// which saves it into your MySQL database
// =====================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault(); // stop the page from refreshing

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = '⚠ Please fill in all fields.';
    formStatus.style.color = '#f87171';
    return;
  }

  formStatus.textContent = 'Sending...';
  formStatus.style.color = '#8b97a8';

  try {
    const response = await fetch('http://127.0.0.1:5000/submit-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });

    const result = await response.json();

    if (response.ok) {
      formStatus.textContent = `✓ Thanks ${name}, your message has been saved!`;
      formStatus.style.color = '#2dd4bf';
      contactForm.reset();
    } else {
      formStatus.textContent = `⚠ ${result.message}`;
      formStatus.style.color = '#f87171';
    }
  } catch (error) {
    formStatus.textContent = '⚠ Could not connect to server. Is app.py running?';
    formStatus.style.color = '#f87171';
    console.error(error);
  }
});

// =====================================================
// 3. AUTO-UPDATE FOOTER YEAR
// =====================================================
document.getElementById('year').textContent = new Date().getFullYear();