const buttonHamburger = document.getElementById('button-hamburger');
    const divHamburger = document.getElementById('div-hamburger');

    buttonHamburger.addEventListener('click', () => {
        buttonHamburger.classList.toggle('active');
        divHamburger.classList.toggle('collapsed-menu');
    });