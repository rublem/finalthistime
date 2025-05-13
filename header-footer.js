fetch('header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header-container').innerHTML = data;

    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle && mainMenu) {
      menuToggle.addEventListener('click', function () {
        mainMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
      });

      mainMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mainMenu.classList.remove('active');
          menuToggle.classList.remove('active');
        });
      });
    } else {
      console.error("Menu toggle or main menu element not found in the loaded header.");
    }
  });

fetch('footer.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('footer-container').innerHTML = data;
  });