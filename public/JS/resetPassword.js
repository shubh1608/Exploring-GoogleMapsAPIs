var resetPassword = {
    Init: function () {
        var me = resetPassword;
        me.BindEvents();
    },

    BindEvents: function () {
        var me = resetPassword;
        $("#btnResetPassword").off("click");
        $("#btnResetPassword").on("click", function () {
            me.ResetPassword();
        });
    },

    ResetPassword: function () {
        var me = resetPassword;
        showLoader();
        var data = {};
        data.userName = $("#txtUserName").val();
        data.newPassword = $("#txtNewPassword").val();
        data.confirmPassword = $("#txtConfirmPassword").val();
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            timeout: 360000,
            data: JSON.stringify(data),
            url: '/resetPasswordInDataBase',
            success: function (data) {
                hideLoader();
                if (data == true) {
                    window.location = "/";
                } else {
                    showToastr('error', "Error in resetting password.Please try again.", 'Error');
                }
            }
        });
    }
}

$(function () {
    resetPassword.Init();
})