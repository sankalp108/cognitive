$(document).ready(function () {
    const pathName = location.pathname
    $("header .nav-item .nav-link").removeClass("active");
    $(`header .nav-item .nav-link[href="${pathName}"]`).addClass("active")
  });
$(".password-show").click(function () {
    var input = $(this).prev();
    if (input.attr("type") == "password") {
        input.attr("type", "text");
        $(this).find('.fa-eye').addClass('d-none');
        $(this).find('.fa-eye-slash').addClass('d-block');
        $(this).find('.fa-eye-slash').removeClass('d-none');
    } else {
        input.attr("type", "password");
        $(this).find('.fa-eye-slash').addClass('d-none');
        $(this).find('.fa-eye').removeClass('d-none');
    }
})


setTimeout(() => {
    $(".toast").remove()
}, 5000);
function createToast(message, type = 'success') {
    let toast = document.createElement("div")
    $(toast).append(`<div class="toast ${type} align-items-center show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="close-btn me-2 m-auto" data-bs-dismiss="toast" aria-label="Close">
                    <i class="fa-regular fa-xmark"></i>
                </button>
            </div>
        </div>`)
    $(".toast-container").append(toast)
    setTimeout(() => {
        $(toast).remove()
    }, 5000);
}