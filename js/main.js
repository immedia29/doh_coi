document.addEventListener('DOMContentLoaded', function () {
  // Dashboard page
  const startButton = document.getElementById('startButton');
  const mainContent = document.querySelector('.main-content');
  const actionSection = document.querySelector('.action-section');

  startButton.addEventListener('click', function () {
    mainContent.style.display = 'none';
    actionSection.style.display = 'block';
  });

  // Tab functionality
  const tabs = document.querySelectorAll('.tab-link');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      tabs.forEach((item) => item.classList.remove('active'));
      contents.forEach((item) => item.classList.remove('active'));

      this.classList.add('active');
      document.getElementById(this.dataset.tab).classList.add('active');
    });
  });
});

// Log-in page
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function () {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);

  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});

const privacyCheckbox = document.getElementById('privacyPolicy');
const loginBtn = document.getElementById('loginBtn');

privacyCheckbox.addEventListener('change', function () {
  loginBtn.disabled = !this.checked;
});
