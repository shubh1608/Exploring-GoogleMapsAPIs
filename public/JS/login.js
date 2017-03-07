var login = {
    Init: function () {
        var me = login;
        //$("#myModal").modal({
        //    backdrop: 'static',
        //    keyboard: false
        //});
        SetToastrOption();
        me.BindEvents();
    },

    BindEvents: function () {
        var me = login;

        $("#btnLogin").off("click");
        $("#btnLogin").on("click", function () {
            var errMsg = me.ValidateLoginInfo();
            if (errMsg === "") {
                me.AttemptLogin($.trim($("#txtUser").val()), $.trim($("#txtPassword").val()));
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

        $("#linkforgotPassword").off("click");
        $("#linkforgotPassword").on("click", function () {
            window.location = "forgotPassword";
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

    AttemptLogin: function (userName,password) {
        var me = login;
        var data = {};
        data.userName = userName;
        data.password = password;
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
                    window.SessionUserName = $("#txtUser").val();
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
            url: '/registerUser',
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

    CreateGoogleUserSession: function (tokenId) {
        var me = login;
        var data = {};
        data.tokenId = tokenId,
        showLoader();
        $.ajax({
            type: 'Post',
            contentType: 'application/json',
            timeout: 360000,
            data: JSON.stringify(data),
            url: '/googleUserSession',
            success: function (data) {
                hideLoader();
                window.location = "MyMaps";
            }
        });
    },

    CreateFBUserSession: function (userName) {
        var me = login;
        var data = {};
        data.userName = userName,
        console.log(userName);
        showLoader();
        $.ajax({
            type: 'Post',
            contentType: 'application/json',
            timeout: 360000,
            data: JSON.stringify(data),
            url: '/facebookUserSession',
            success: function (data) {
                hideLoader();
                window.location = "MyMaps";
            }
        });
    }
}

$(function () {
    login.Init();
})

function onSuccess(googleUser) {
    var profile = googleUser.getAuthResponse();
    console.log('Logged in as: ' + googleUser.getAuthResponse().id_token);
    login.CreateGoogleUserSession(profile.id_token);
}

function onFailure(error) {
    console.log(error);
}

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 130,
        'height': 27,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        testAPI();
    } else if (response.status === 'not_authorized') {
        showToastr('info','Please log into this app.','Information');
    } else {
        showToastr('info', 'Please log into Facebook.', 'Information');
    }
}

function testAPI() {
    var me = login;
    FB.api('/me', function (response) {
        me.CreateFBUserSession(response.name);
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}