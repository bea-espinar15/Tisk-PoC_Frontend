$(() => {
    var closeModal = $("#span-close-modal");

    if (closeModal != null) {
        closeModal.on("click", () => {
            $("#div-response-modal").hide();
        });
    }
});