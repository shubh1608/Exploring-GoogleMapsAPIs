var forgotPassword = {
    Init: function () {
        var me = forgotPassword;
        SetToastrOption();
        me.BindEvents();
    },

    BindEvents: function () {
        var me = forgotPassword;
        $("#btnSendMail").off("click");
        $("#btnSendMail").on("click", function () {
            if(me.IsValidEmailAddress($.trim($("#txtMail").val()))){
                me.SendPasswordResetMail();
            }else{
                showToastr('error', 'Invalid Email Address.', 'Error');
            }
        });
    },

    IsValidEmailAddress:function(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
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