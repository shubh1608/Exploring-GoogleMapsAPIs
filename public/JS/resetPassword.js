var resetPassword = {
    Init: function () {
        var me = resetPassword;
        SetToastrOption();
        me.BindEvents();
    },

    BindEvents: function () {
        var me = resetPassword;
        $("#btnResetPassword").off("click");
        $("#btnResetPassword").on("click", function () {
            var errMsg=me.ValidateEnteredInfo();
            if(errMsg === ""){
                me.ResetPassword();
            }else{
                showToastr('error', errMsg ,'Error');
            }
        });

        $("#btnCancel").off("click");
        $("#btnCancel").on("click", function () {
            window.location="/";
        });
    },

    ValidateEnteredInfo:function(){
        var me = resetPassword;
        var errMsg="";
        if($("#txtUserName").val() === ""){
            errMsg="UserName field can't be empty."
        }
        if($("#txtNewPassword").val() === "" || $("#txtConfirmPassword").val()===""){
            errMsg=errMsg == ""?errMsg:errMsg+"<br>";
            errMsg=errMsg+"Password can't be empty.";
        }else{
            if($("#txtNewPassword").val() != $("#txtConfirmPassword").val()){
                errMsg=errMsg == ""?errMsg:errMsg+"<br>";
                errMsg=errMsg+"Password doesn't match with confirm password.";
            }
        }
        return errMsg;
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