// FB Login
function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        testAPI();
    } else {                                 // Not logged into your webpage or we are unable to tell.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this webpage.';
    }
};

function checkLoginState() {               // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function (response) {   // See the onlogin handler
        statusChangeCallback(response);
    });
};

window.fbAsyncInit = function () {
    FB.init({
        appId: '2437149979895267',
        cookie: true,                     // Enable cookies to allow the server to access the session.
        xfbml: true,                     // Parse social plugins on this webpage.
        version: 'v4.0'           // Use this Graph API version for this call.
    });

    FB.getLoginStatus(function (response) {   // Called after the JS SDK has been initialized.
        statusChangeCallback(response);        // Returns the login status.
    });
};

(function (d, s, id) {                      // Load the SDK asynchronously
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function (response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';
    });
};

function fblogout() {
    FB.logout(function (response) {
        // user is now logged out
    });
};

// Google Login
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var name = profile.getName();
    var password = profile.getEmail();
    var mail = profile.getEmail();
    if (name != null) {
        window.location.href = "#easyRegister";
        $("#gf_submit").click(function () {
            $("#gf_Uid").val(name);
            console.log(name);
            var reg = {
                UserID: name,
                User_Password: password,
                Email: mail,
                Nickname: $("#gf_name").val(),
                Phone: $("#gf_phone").val(),
                Gender: $("input[name=gf_gender]").val()
            };
            $.ajax({
                type: "POST",
                url: "/Library/EasyRegister",
                data: JSON.stringify(reg),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response == 1) {
                        //$("#userId").val(name);
                        console.log(response);
                        alert("註冊成功");
                        $("#easyRegister-form")[0].reset();
                        window.location.href = "#easyLogin";
                    } else {
                        alert("註冊有誤請重試！");
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
            return false;
        });
    } else {
        console.log("fail");
    }
    //GF登入
    $("#easyLogin_submit").click(function () {
        $("#easyLogin_Uid").val(name);
        console.log($("#easyLogin_Uid").val());
        var uid = $("#easyLogin_Uid").val();
        var reg = {
            UserID: $("#easyLogin_Uid").val(),
            Nickname: $("#easyLogin_name").val(),
            Phone: $("#easyLogin_phone").val(),
        };
        $.ajax({
            type: "POST",
            url: "/Library/EasyLogin",
            data: JSON.stringify(reg),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    //console.log($("#userId").val());
                    $("#userId").val(uid);
                    $("#sucDialogContent").html("登入成功");
                    window.location.href = "#suc_dialog";
                    $("#easyLogin-form")[0].reset();
                    window.location.href = "#home";
                } else {
                    alert("用戶不存在，請註冊後再進行登入！");
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
        return false;
    });
};

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    //auth2.disconnect().then(function () {
    //    console.log('User has cleaned the account');
    //});
};

