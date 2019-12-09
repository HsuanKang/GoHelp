$(document).ready(function () {
    kendo.culture("zh-TW");
    $("#show_post").kendoGrid({
        height: 480,
        pageable: false,
        columns: [
            {
                hidden: true,
                field: "PostID" //rank
            },
            {
                hidden: true,
                field: "PostContent"
            },
            {
                hidden: true,
                field: "Phone"
            },
            {
                hidden: true,
                field: "IsShowPhone"
            },
            {
                hidden: true,
                field: "PostLat"
            },
            {
                hidden: true,
                field: "PostLong"
            },
            {
                hidden: true,
                field: "EndTime",
                format: "{0: yyyy-MM-dd}"
            },
            {
                field: "Kind",
                title: "種類",
                width: "10%",
                template: kendo.template($("#Kind-template").html())
            },
            {
                field: "Nickname",
                title: "暱稱",
                width: "20%",
                minScreenWidth: 750
            }, {
                field: "PostTitle",
                title: "貼文名稱",
                width: "30%"
            }, {
                field: "City",
                title: "地點",
                width: "15%",
                template: kendo.template($("#MeetAddress-template").html())
            }, {
                field: "StartTime",
                format: "{0: yyyy-MM-dd}",
                title: "時間",
                minScreenWidth: 750
            },
            { command: { text: "查看", click: showDetail }, title: " ", width: "15%" }]
    });
    $('#top_btn_new').on("vclick", function () {
        //grid
        $.ajax({
            type: "POST",
            url: "/Library/Index",
            dataType: "json",
            success: function (response) {
                console.log(response);
                var grid = $('#show_post').data("kendoGrid");
                grid.setDataSource(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    //註冊表單送出
    $("#reg_submit").click(function () {
        var reg = {
            User_Account: $("#reg_username").val(),
            User_Password: $("#reg_password").val(),
            Nickname: $("#reg_fullname").val(),
            Phone: $("#reg_phone").val(),
            Gender: $("input[name=reg_gender]").val(),
            Email: $("#reg_email").val()
        };
        $.ajax({
            type: "POST",
            url: "/Library/SignUp",
            data: JSON.stringify(reg),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response == 1) {
                    console.log(response);
                    alert("註冊成功");
                    $("#register-form")[0].reset();
                    window.location.href = "#login";
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
    var checklogin = 0;
    $("#logout").on("vclick", function () {
        console.log(checklogin);
        if (checklogin == 0) {
            checklogin = 1;
            window.location.href = "#login";
        } else {
            window.location.href = "#confirm-dialog";
            $("#chk_logout_btn").on("vclick", function () {
                checklogin = 0
                $("#userId").val("");
                window.location.reload();
            });
        }

    });
    //login驗證
    $("#login_sb").click(function () {
        var userId = $("#uname").val(); //記錄使用者
        var obj = {
            Account: $("#uname").val(),
            Passwd: $("#upasswd").val()
        };
        $.ajax({
            type: "POST",
            url: "/Library/Login",
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    console.log(userId);
                    $("#userId").val(userId);
                    $("#sucDialogContent").html("登入成功");
                    window.location.href = "#suc_dialog";
                    $("#login-form")[0].reset();
                    window.location.href = "#home";


                } else {
                    alert("用戶不存在，請註冊後再進行登入！");
                }
            },
            error: function (error) {
                console.log(error);
                checklogin = 0;
            }
        });
        return false;
    });

    //送出求助表單
    $("#insert_q").click(function () {
        console.log($("#lat").val());
        console.log($("#long").val());
        var userId = $("#userId").val(); //記錄使用者
        var StartTime = new Date();
        var addHours = parseInt($("#open_time").val()); //開放多長時間
        var EndTime = new Date();
        EndTime.setHours(StartTime.getHours() + addHours);

        var obj = {
            UserID: userId,
            PostTitle: $("#PostTitle").val(),
            PostContent: $("#PostContent").val(),
            StartTime: StartTime,
            EndTime: EndTime,
            MeetAddress: $("#autocomplete_search").val(),
            Kind: $("#question_kind").val(),
            PostLat: $("#lat").val(),
            PostLong: $("#long").val(),
            City: $("#City").val(),
            IsShowPhone: $("#question_IsShowPhone").val()
        };
        console.log(obj);
        console.log(StartTime.getHours());
        $.ajax({
            type: "POST",
            url: "/Library/InsertPost",
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log(response);
                if (response == 1) {
                    $("#sucDialogContent").html("新增成功");
                    window.location.href = "#suc_dialog";
                    $("#ask_form")[0].reset();
                    window.location.href = "#home";
                } else {
                    alert("新增失敗");
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
        return false;
    });

    var PostID;
    //HelpDetail
    function showDetail(e) {
        console.log("showDeleteDetail");
        // prevent page scroll position change
        e.preventDefault();
        // e.target is the DOM element representing the button
        var tr = $(e.target).closest("tr"); // get the current table row (tr)
        // get the data bound to the current table row
        var data = this.dataItem(tr);
        $("#hide_helping").click();
        $("#post_person_name").html(data.Nickname);
        console.log(data);
        console.log(data.Phone);
        if (data.IsShowPhone == "True") {
            $("#post_person_phone").html("<i class='fas fa-phone'></i> " + data.Phone);
        } else {
            $("#post_person_phone").html("");
        }
        PostID = data.PostID;

        $("#post_title").html(data.PostTitle);
        $("#post_kind").html(data.Kind);
        $("#post_content").html(data.PostContent);
        $("#post_startTime").html(data.StartTime);
        $("#post_endTime").html(data.EndTime);
        $("#post_lat").val(data.PostLat);
        $("#post_long").val(data.PostLong);
        $("#meet_address").val(data.MeetAddress);
        console.log($("#post_lat").val());
        console.log($("#post_long").val());
        showPostPosition();
        var Pid = data.PostID;
        $.ajax({
            type: "POST",
            url: "/Library/ShowMsg",
            data: JSON.stringify({ PostID: Pid }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var msg = "";
                for (var i = 0; i < response.length; i++) {
                    msg += "<span style='color: palevioletred;font-weight:bold;'>";
                    msg += response[i].Nickname + "：";
                    msg += "</span>";
                    msg += "<span>";
                    msg += response[i].Message;
                    msg += "</span><hr>";
                }
                $("#post_msg").html(msg);
            },
            error: function (error) {
                console.log(error);
            }
        });
        return false;
    }
    // 求助紀錄
    $("#history").on("vclick", function () {
        $('#search_div').hide(1000);
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/Library/History",
            data: JSON.stringify({ UserID: $("#userId").val() }),
            dataType: "json",
            success: function (response) {
                var obj = document.getElementById("content");
                obj.innerHTML = "";
                $("#content").kendoGrid({
                    dataSource: response,
                    height: 550,
                    pageable: false,
                    columns: [
                        {
                            field: "PostTitle",
                            title: "標題",
                            width: "20%",
                        },
                        {
                            field: "Kind",
                            title: "類別",
                            width: "10%",
                            minScreenWidth: 750
                        }, {
                            field: "PostContent",
                            title: "貼文內容",
                            width: "30%"
                        }, {
                            field: "City",
                            title: "地點",
                            width: "15%",
                            template: kendo.template($("#MeetAddress-template").html())
                        }, {
                            field: "Status",
                            title: "狀態",
                            minScreenWidth: 750
                        }]
                });
                window.location.href = "#moreSetting";
                var changeTitle = document.getElementById("title");
                changeTitle.innerHTML = "來看你在這裡獲得了多少幫助！";
            },
            error: function (error) {
                console.log(error);
            }
        });
        return false;
    });

    //新增留言
    $("#send_msg").click(function () {
        if ($("#userId").val() == null) {
            alert("請先登入");
        } else {
            var obj = {
                PostID: PostID,
                UserID: $("#userId").val(),
                Message: $("#input_msg").val()
            };
            console.log(obj);
            $.ajax({
                type: "POST",
                url: "/Library/InsertMessage",
                data: JSON.stringify(obj),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    if (response == 1) {
                        $("#input_msg").val("");
                        history.back();
                    } else {
                        alert("新增失敗");
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
            return false;
        }
    });

    // 助人事蹟
    $("#hero").on("vclick", function () {
        $('#search_div').hide(1000);
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/Library/MyHelp",
            data: JSON.stringify({ UserID: $("#userId").val() }),
            dataType: "json",
            success: function (response) {
                var obj = document.getElementById("content");
                obj.innerHTML = "";
                console.log(response);
                $("#content").kendoGrid({
                    dataSource: response,
                    height: 550,
                    pageable: false,
                    columns: [
                        {
                            field: "PostTitle",
                            title: "標題",
                            width: "20%",
                        },
                        {
                            field: "Kind",
                            title: "類別",
                            width: "10%",
                            minScreenWidth: 750
                        }, {
                            field: "PostContent",
                            title: "貼文內容",
                            width: "30%"
                        }, {
                            field: "City",
                            title: "地點",
                            width: "15%",
                            template: kendo.template($("#MeetAddress-template").html())
                        }]
                });
                window.location.href = "#moreSetting";
                var changeTitle = document.getElementById("title");
                changeTitle.innerHTML = "本周的你上榜了嗎！";
            },
            error: function (error) {
                console.log(error);
            }
        });
        return false;
    });

    // 個人資料
    $("#user_data").on("vclick", function () {
        $('#search_div').hide(1000);


        var htm = `
            <center>
                <div class="progress" style="width:95%;height:35px;">
                    <div class="progress-bar bg-success" style="width:40%;height:35px">
                            20 / 100 ( 活躍成績 )
                    </div>
                </div>
            </center>
        <br>
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6 pb-5">
 
                <!--Form with header-->
 
                <form action="mail.php" method="post">
                    <div class="card rounded-0">
                        <div class="card-header p-0">
                            <div class="bg-info text-white text-center py-2">
                                <h5>個人資料查看</h5>
                            </div>
                        </div>
                        <div class="card-body p-3">
 
                            <!--Body-->
                            <div class="form-group">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text"><i class="fas fa-venus-mars"
                                                style="color:#6699A1"></i>性別</div>
                                    </div>
                                    <img id="Ugender" src width="50" height="50" />
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text"><i class="fas fa-user"
                                                style="color:#6699A1"></i>帳號</div>
                                    </div>
                                    <input type="email" class="form-control" id="Uid" name="Uid" readonly>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text"><i class="fas fa-lock"
                                                style="color:#6699A1"></i>密碼</div>
                                    </div>
                                    <input type="email" class="form-control" id="Upass" name="Upass" readonly>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text"><i class="fas fa-user-circle"
                                                style="color:#6699A1"></i>暱稱</div>
                                    </div>
                                    <input type="text" class="form-control" id="Uname" name="Uname" readonly>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text"><i class="fas fa-phone"
                                                style="color:#6699A1"></i>手機號碼</div>
                                    </div>
                                    <input type="text" class="form-control" id="Uphone" name="Uphone" readonly>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text"><i class="fas fa-envelope"
                                                style="color:#6699A1"></i>信箱</div>
                                    </div>
                                    <input type="text" class="form-control" id="Umail" name="Umail" readonly>
 
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text"><i class="fas fa-pencil-alt"
                                                style="color:#6699A1"></i>求救次數</div>
                                    </div>
                                    <label id="Upo_cnt" for="Upo_cnt"></label>
                                </div>
 
                            </div>
                            <br>
                        </div>
                </form>
 
 
            </div>
 
 
 
 
        </div>
        `;
        var htm_logout =
            `<center>
                <br>
                <p class="form-control">
                登入才可看見個人資料!<br>
                還沒加入GoHelp嗎?快點動手加入吧~
                </p>
                <a href="#signup" id="joinus" data-transition="slidefade">點我註冊！</a>
            </center>
            `;

        if (checklogin == 0) {
            $("#content").html(htm_logout);
        } else {
            $("#content").html(htm);
        };



        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/Library/Udata",
            data: JSON.stringify({ UserID: $("#userId").val() }),
            dataType: "json",
            success: function (response) {
                console.log(response);
                var changeTitle = document.getElementById("title");
                changeTitle.innerHTML = "";
                var id = response[0]["UserID"];
                console.log(id);
                $("#Uid").val(id);
                var pass = response[0]["User_Password"];
                $("#Upass").val(pass);

                var name = response[0]["Nickname"];
                $("#Uname").val(name);

                var phone = response[0]["Phone"];
                $("#Uphone").val(phone);
                if (response[0]["Gender"] == "True") {
                    $('#Ugender').attr('src', 'https://png.pngtree.com/png-clipart/20190618/original/pngtree-girl-girl-girl-teenage-girl-png-image_3937912.jpg');
                } else {
                    $('#Ugender').attr('src', 'https://png.pngtree.com/png-clipart/20190618/original/pngtree-boy-boy-boy-juvenile-png-image_3937913.jpg');
                }
                var mail = response[0]["Email"];
                $("#Umail").val(mail);

                var postCnt = response[0]["Post_Cnt"];
                document.getElementById("Upo_cnt").innerHTML = postCnt;




            },
            error: function (error) {
                console.log(error);
            }
        });
        return false;
    });

    // 排行榜
    $('#rank, #more_btn').on("vclick", function () {
        $('#search_div').show("slow");
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/Library/Rank",
            data: JSON.stringify({ UserID: $("#userId").val() }),
            dataType: "json",
            success: function (response) {
                var obj = document.getElementById("content");
                obj.innerHTML = "";

                $("#content").kendoGrid({
                    dataSource: response,
                    height: 550,
                    pageable: false,
                    columns: [
                        {
                            field: "Rank",
                            title: "排名",
                            width: "15%",
                            template: kendo.template($("#Rank-template").html())
                        },
                        {
                            field: "Nickname",
                            title: "會員暱稱",
                            width: "27%",
                        },
                        {
                            field: "Gender",
                            title: "性別",
                            width: "23%",
                            template: kendo.template($("#Gender-template").html())
                        }, {
                            field: "Score",
                            title: "分數",
                            width: "25%"
                        },]
                });
                window.location.href = "#moreSetting";
                var changeTitle = document.getElementById("title");
                changeTitle.innerHTML = "來看看你有沒有上榜吧～";
            },
            error: function (error) {
                console.log(error);
            }
        });
        return false;
    });

    $("#btnSearch").on("vclick", function () {
        var searchValue = $('#searchBox').val();
        console.log(searchValue);
        $(".gridContent").data("kendoGrid").dataSource.filter({
            logic: "or",
            filters: [
                {
                    field: "Nickname",
                    operator: "contains",
                    value: searchValue
                }
            ]
        });
    });

    function cleanBGcss() {
        $('#line1').css("background-color", "");
        $('#line2').css("background-color", "");
        $('#line3').css("background-color", "");
        $('#line4').css("background-color", "");
        $('#line5').css("background-color", "");
        $('#moreLine_1').css("background-color", "");
        $('#moreLine_2').css("background-color", "");
        $('#moreLine_3').css("background-color", "");
        $('#moreLine_4').css("background-color", "");
        $('#top_btn_new').css({ "color": "" });
        $('#top_btn_share').css({ "color": "" });
        $('#top_btn_emergency').css({ "color": "" });
        $('#top_btn_together').css({ "color": "" });
        $('#top_btn_sad').css({ "color": "" });
        $('#rank').css({ "color": "" });
        $('#hero').css({ "color": "" });
        $('#history').css({ "color": "" });
        $('#user_data').css({ "color": "" });
    };

    // 首頁及更多navbar
    $('#top_btn_new,#rank,#more_btn,#backHome').on("vclick", function () {
        cleanBGcss();
        $('#line1').css({ "background-color": "#E2943B", "height": "2px" });
        $('#moreLine_1').css({ "background-color": "#E2943B", "height": "2px" });
        $('#top_btn_new').css({ "color": "#E2943B" });
        $('#rank').css({ "color": "#E2943B" });
    });
    $('#top_btn_share,#hero').on("vclick", function () {
        ChangeType("share");
        cleanBGcss();
        $('#line2').css({ "background-color": "#E2943B", "height": "2px" });
        $('#moreLine_2').css({ "background-color": "#E2943B", "height": "2px" });
        $('#top_btn_share').css({ "color": "#E2943B" });
        $('#hero').css({ "color": "#E2943B" });
    });
    $('#top_btn_emergency,#history').on("vclick", function () {
        ChangeType("emergency");
        cleanBGcss();
        $('#line3').css({ "background-color": "#E2943B", "height": "2px" });
        $('#moreLine_3').css({ "background-color": "#E2943B", "height": "2px" });
        $('#top_btn_emergency').css({ "color": "#E2943B" });
        $('#history').css({ "color": "#E2943B" });
    });
    $('#top_btn_together,#user_data').on("vclick", function () {
        ChangeType("together");
        cleanBGcss();
        $('#line4').css({ "background-color": "#E2943B", "height": "2px" });
        $('#moreLine_4').css({ "background-color": "#E2943B", "height": "2px" });
        $('#top_btn_together').css({ "color": "#E2943B" });
        $('#user_data').css({ "color": "#E2943B" });
    });
    $('#top_btn_sad').on("vclick", function () {
        ChangeType("talk");
        cleanBGcss();
        $('#line5').css({ "background-color": "#E2943B", "height": "2px" });
        $('#top_btn_sad').css({ "color": "#E2943B" });
    });
    // 分類屬性
    function ChangeType(type) {
        $.ajax({
            type: "POST",
            url: "/Library/ChangeType",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ type: type }),
            dataType: "json",
            success: function (response) {
                console.log("123");
                console.log(response);
                var grid = $('#show_post').data("kendoGrid");
                grid.setDataSource(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
        return false;
    }
    //Post地理位置

    function showPostPosition() {
        console.log("2");
        var postlat = $("#post_lat").val();
        var postlong = $("#post_long").val();
        var post_latlon = new google.maps.LatLng(postlat, postlong);
        console.log(postlat);
        console.log(postlong);
        var myOptions = {
            center: post_latlon, zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
        };
        var addr = $("#meet_address").val();

        var map2 = new google.maps.Map(document.getElementById("helping_map"), myOptions);
        var marker2 = new google.maps.Marker({ position: post_latlon, map: map2, title: addr });
    }
    $('#top_btn_new').click();
    $("#home").on("pageload", function () {
        $('#top_btn_new').click();
    });
});
