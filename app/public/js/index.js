"use strict"

$(() => {
    const buttonHamburger = $("#button-hamburger");
    const divHamburger = $("#div-hamburger");
    
    buttonHamburger.on("click", function() {
        $(this).toggleClass("active");
        divHamburger.toggleClass("collapsed-menu");
    });
    
    const logout = $("#form-logout");
    logout.on("click", async () => {
        logout.submit();
    });
});
