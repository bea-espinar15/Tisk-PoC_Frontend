$(() => {
    const buttonHamburger = $("#button-hamburger");
    const divHamburger = $("#div-hamburger");
    
    buttonHamburger.on("click", () => {
        buttonHamburger.classList.toggle("active");
        divHamburger.classList.toggle("collapsed-menu");
    });
    
    const logout = $("#form-logout");
    logout.on("click", async () => {
        logout.submit();
    });
});
