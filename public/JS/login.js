var login = {
    Init: function () {
        var me = login;
        $("#myModal").modal({
            backdrop: 'static',
            keyboard: false
        });
        SetToastrOption();
        me.BindEvents();
    },

    BindEvents: function () {
        var me = login;

        $("#btnLogin").off("click");
        $("#btnLogin").on("click", function () {
            var errMsg = me.ValidateLoginInfo();
            if (errMsg === "") {
                me.AttemptLogin();
            } else {
                showToastr('error', errMsg, 'Error');
            }
        });

        $("#btnRegister").off("click");
        $("#btnRegister").on("click", function () {
            var errMsg = me.ValidateLoginInfo();
            if (errMsg === "") {
                me.RegisterUser();
            } else {
                showToastr('error', errMsg, 'Error');
            }
        });
    },

    ValidateLoginInfo: function () {
        var me = login;
        var errMsg = "";
        if ($.trim($("#txtUser").val()) === "") {
            errMsg = "Please enter a username.";
        }
        if ($.trim($("#txtPassword").val()) === "") {
            errMsg = errMsg == "" ? errMsg : errMsg + "<br>";
            errMsg = errMsg + "Please enter a password.";
        }
        return errMsg;
    },

    AttemptLogin: function () {
        var me = login;
        var data = {};
        data.userName = $("#txtUser").val();
        data.password = $("#txtPassword").val();
        showLoader();
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            timeout: 360000,
            data: JSON.stringify(data),
            url: '/usersAuthentication',
            success: function (data) {
                hideLoader();
                if (data == true) {
                    Window.SessionUserName = $("#txtUser").val();
                    window.location = "MyMaps";
                } else {
                    showToastr('error',"Username not found.Click on Register to create an account.",'Error');
                }
            }
        });
    },

    RegisterUser: function () {
        var me = login;
        var data = {};
        data.userName = $("#txtUser").val();
        data.password = $("#txtPassword").val();
        showLoader();
        $.ajax({
            type: 'Post',
            contentType: 'application/json',
            timeout: 360000,
            data: JSON.stringify(data),
            url: 'http://localhost:3000/registerUser',
            success: function (data) {
                hideLoader();
                if (data == true) {
                    showToastr('info', "Registration Successfull. Click on Login to continue.", 'Information');
                } else {
                    showToastr('error', "Registration Failed. Please try again.", 'Error');
                }
            }
        });
    },
}

$(function () {
    login.Init();
})

function onSignIn(googleUser) {
    $("#myModal").modal("hide");
    var profile = googleUser.getBasicProfile();
    alert("inside google sign in.");
    window.location = "MyMaps";
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

