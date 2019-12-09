$(document).ready(function () {
    $('#show_post_map').slideUp(300);
    $('#GridArea').slideDown(300);
    var swipecount = 0;
    $("#home").on("swipeleft", function () {
        swipecount += 1;
        switch (swipecount) {
            case 1:
                $("#top_btn_new").click();
                break;
            case 2:
                $("#top_btn_share").click();
                break;
            case 3:
                $("#top_btn_emergency").click();
                break;
            case 4:
                $("#top_btn_together").click();
                break;
            case 5:
                $("#top_btn_sad").click();
                break;
        }
    });
    $("#home").on("swiperight", function () {
        swipecount -= 1;
        switch (swipecount) {
            case 1:
                $("#top_btn_new").click();
                break;
            case 2:
                $("#top_btn_share").click();
                break;
            case 3:
                $("#top_btn_emergency").click();
                break;
            case 4:
                $("#top_btn_together").click();
                break;
            case 5:
                $("#top_btn_sad").click();
                break;
        }
    });

    $('.toggle-btn').on("vclick", function () {
        console.log("toggle");
        $('.filter-btn').toggleClass('open');
        $('.one').attr("style", "display:block;")
        $('.two').attr("style", "display:block;")
    });

    //$('.filter-btn a').click(function () {
    //    console.log("filter");
    //    $('.filter-btn').removeClass('open');
    //});

    $('.one').click(function () {
        console.log("map");
        $('.filter-btn').removeClass('open');
        $('#GridArea').slideUp(300);
        $('#show_post_map').slideDown(300);
        $('.one').attr("style", "display:none;")
        $('.two').attr("style", "display:none;")
    });

    $('.two').click(function () {
        console.log("list");
        $('.filter-btn').removeClass('open');
        $('#show_post_map').slideUp(300);
        $('#GridArea').slideDown(300);
        $('.one').attr("style", "display:none;")
        $('.two').attr("style", "display:none;")
    });
    //signup
    $("#register-form").validate({
        rules: {
            reg_username: "required",
            reg_password: {
                required: true,
                minlength: 5
            },
            reg_password_confirm: {
                required: true,
                minlength: 5,
                equalTo: "#register-form [name=reg_password]"
            },
            reg_email: {
                required: true,
                email: true
            },
            reg_agree: "required",
        },
        errorClass: "form-invalid",
        errorPlacement: function (label, element) {
            if (element.attr("type") === "checkbox" || element.attr("type") === "radio") {
                element.parent().append(label); // this would append the label after all your checkboxes/labels (so the error-label will be the last element in <div class="controls"> )
            }
            else {
                label.insertAfter(element); // standard behaviour
            }
        }
    });

});
