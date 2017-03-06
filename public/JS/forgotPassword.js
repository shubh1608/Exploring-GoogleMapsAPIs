var forgotPassword = {
    Init: function () {
        var me = forgotPassword;
        me.BindEvents();
    },

    BindEvents: function () {
        var me = forgotPassword;
        $("#btnSendMail").off("click");
        $("#btnSendMail").on("click", function () {
            me.SendPasswordResetMail();
        });
    },

    SendPasswordResetMail: function () {
        var me = forgotPassword;
        showLoader();
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            timeout: 360000,
            data: JSON.stringify({ mailId: $.trim($("#txtMail").val()) }),
            url: '/passwordResetMail',
            success: function (data) {
                hideLoader();
                if (data == true) {
                    window.location = "/";
                } else {
                    showToastr('error', "Error in Sending Mail.Please try again.", 'Error');
                }
            }
        });
    }
}

$(function () {
    forgotPassword.Init();
})