﻿var SessionUserName="";

function showLoader() {
    $("#loaderModal").modal({
        backdrop: 'static',
        keyboard: false
    });
}

function hideLoader() {
    $("#loaderModal").modal("hide");
}

function showMessageDialog(msg) {
    $("#divMessage").html(msg);
    $("#messageModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#btnCloseMsgModal").off("click");
    $("#btnCloseMsgModal").on("click", function () {
        $("#messageModal").modal("hide");
    });
}

function SetToastrOption() {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}

function showToastr(toastrType,toastrMsg,toastrTitle) {
    Command: toastr[toastrType](toastrMsg, toastrTitle);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}