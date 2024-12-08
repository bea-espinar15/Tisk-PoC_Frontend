var closeModal = document.getElementById("span-close-modal");

if (closeModal != null) {
    closeModal.onclick = function() {
        var modal = document.getElementById("div-response-modal");
        modal.style.display = "none";
    };
}