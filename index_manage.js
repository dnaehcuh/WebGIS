$(function () {
  loadPageUser();

  let token = localStorage.getItem("token") || "";
  let user_name;
  if (token != "") {
    tokenAuth(token, function (data) {
      user_name = data[0].user_name;
      $("#username-displayer").text("你好，" + user_name)
    })
  } else {
    alert("登录信息失效，请重新登录")
    window.open("./index_login.html")
  }

  // 绑定注册按钮事件
  $("#form-user-create").on('submit', (event) => {
    event.preventDefault();
    let user_name = $("#reg_username").val();
    let user_password = $("#reg_pwd").val();
    let user_type = $('#reg_type input:radio:checked').val();
    let submit_data = {
      user_name,
      user_password,
      user_type
    }
    addUser(submit_data)
  })

  // 绑定修改按钮 --> 切换出修改面板
  $(".content").delegate(".btn-edit", "click", function () {
    showPanelUpdate();
    let tr = $(this).parent().parent().children().eq(0);
    let user_id = tr.text();
    $("#edit_userID").val(user_id);
  });

  // 绑定删除按钮 --> 删除按钮
  $(".content").delegate(".btn-delete", "click", function () {
    let tr = $(this).parent().parent().children().eq(0);
    let user_id = tr.text();
    if (confirm("确定删除ID为" + user_id + "的用户?")) {
      let submit_data = {
        user_id
      }
      deletUser(submit_data);
    }
  });

  // 绑定禁用/启用按钮
  $(".content").delegate(".btn-forbidden", "click", function () {
    let tr = $(this).parent().parent().children();
    let user_id = tr.eq(0).text();
    let user_other = tr.eq(4).text();
    user_other = (user_other == 1 ? 0 : 1)
    let submit_data = {
      user_id,
      user_other
    }
    updateUser(submit_data)

  });

  // 下线
  $(".content").delegate(".btn-logout", "click", function () {
    let tr = $(this).parent().parent().children();
    let user_id = tr.eq(0).text();
    tr.eq(3).text(0);
    let form_data = {
      user_id,
      user_onlinestatus: 0
    }
    let that = this;
    updateUserAjax(form_data, function (param) {
      $(that).attr("disabled", "disabled");
    })
  });

  // 修改面板切换回注册面板
  $(".btn-cancel").click(function () {
    document.getElementById("form-user-update").reset();
    showPanelCreate();
  });

  // 修改表单提交
  $("#form-user-update").on('submit', (event) => {
    event.preventDefault();
    let user_id = $("#edit_userID").val();
    let user_name = $("#edit_username").val();
    let user_password = $("#edit_pwd").val();
    let user_type = $('#edit_type input:radio:checked').val();
    let submit_data = {
      user_id,
      user_name,
      user_password,
      user_type
    }
    updateUser(submit_data, function () {
      alert("修改成功")
    })
  })

  // 页码修改
  $(".pagination").delegate('li', 'click', function () {
    if ($(this).hasClass('disabled')) {
      return
    }
    var index = $(".pagination li").index(this);
    if (index == 0) {
      cur_page -= 1
    } else if (index == page_counts + 1) {
      cur_page += 1
    } else if (index != cur_page) {
      cur_page = index
    }
    loadPageUser();
  })

  // 退出登录
  $('#logout').click(logout_wxh)

})