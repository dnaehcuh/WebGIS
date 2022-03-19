// 当前页数
let cur_page = 1;
let page_counts = 1;
// 一页显示数目
const page_step = 12;

// 访问数据库获取所有用户
function loadUser() {
  let url = "/api/user/query_all",
    headers = {
      //   "Authorization": "Bearer " + localStorage.getItem('token')
      "Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsImV4cCI6MTYyNzg4NDc0NX0.Rpy9lZE6-or133ETblKtB3fos9Fm1ZPYOsX8cl4gmBc"
    },
    method = "GET",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        users = resp.result;
        $("#number-users").text(users.length)
        resetTable();
        for (user of users) {
          addLine(user)
        }
      } else {
        alert("查询失败");
        console.log(code);
      }
    }
  baseAjax(
    url,
    method,
    data = [],
    contentType,
    succ_fn,
    e_fn = null
  );
}
// 访问数据库获取一页用户
function loadPageUser() {
  let url = "/api/user/query_page?page=" + cur_page,
    method = "GET",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        let users = resp.result;
        let counts = resp.count;
        $("#number-users").text(counts)
        resetTable();
        for (user of users) {
          addLine(user)
        }
        page_counts = Math.ceil(counts / page_step)
        generatePage(page_counts);
        setPage();
      } else {
        alert("查询失败");
        console.log(code);
      }
    }
  baseAjax(
    url,
    method,
    data = [],
    contentType,
    succ_fn,
    e_fn = null
  );
}

// 注册用户
function addUser(submit_data) {
  let url = "/api/user/add",
    headers = {
      //   "Authorization": "Bearer " + localStorage.getItem('token')
      // "Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsImV4cCI6MTYyNzg5MDI1OX0.6cl0zRL02GlXMP2gpbq3f102Qd6kRgDqp5zsFPJRenk"
    },
    data = JSON.stringify(submit_data),
    method = "POST",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        loadPageUser();
        document.getElementById("form-user-create").reset();
        alert("添加用户成功")
      } else {
        alert("查询失败");
        console.log(resp);
      }
    },
    e_fn = e => {
      alert("请求失败");
      console.log(e);
    }
  console.log(data);

  baseAjax(
    url,
    method,
    data,
    contentType,
    succ_fn,
    e_fn
  );
}

// 修改用户信息
function updateUser(submit_data, ok_fn = null) {
  let url = "/api/user/update",

    data = JSON.stringify(submit_data),
    method = "PUT",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        loadPageUser();
        document.getElementById("form-user-create").reset();
        if (ok_fn) {
          ok_fn();
        }
      } else {
        alert("更改失败");
        console.log(resp);
      }
    },
    e_fn = e => {
      alert("请求失败");
      console.log(e);
    }

  baseAjax(
    url,
    method,
    data,
    contentType,
    succ_fn,
    e_fn
  );
}

// 删除用户信息
function deletUser(submit_data) {
  let url = "/api/user/del",
    headers = {
      //   "Authorization": "Bearer " + localStorage.getItem('token')
      // "Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsImV4cCI6MTYyNzg5MDI1OX0.6cl0zRL02GlXMP2gpbq3f102Qd6kRgDqp5zsFPJRenk"
    },
    data = JSON.stringify(submit_data),
    method = "DELETE",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        loadPageUser();
        alert("用户信息删除成功")
      } else {
        alert("删除失败");
        console.log(resp);
      }
    },
    e_fn = e => {
      alert("请求失败");
      console.log(e);
    }

  baseAjax(
    url,
    method,
    data,
    contentType,
    succ_fn,
    e_fn
  );
}

// 展示表格添加一行
function addLine(dataUser) {
  let tr = document.createElement('tr');
  let inner = `
  <td>${dataUser.user_id}</td>
  <td>${dataUser.user_name}</td>
  <td>${dataUser.user_type}</td>
  <td>${dataUser.user_onlinestatus}</td>
  <td>${dataUser.user_other}</td>
  <td>
      <button type="button" class="btn btn-success btn-edit btn-xs btn-flat">修改</button>
`
  if (dataUser.user_onlinestatus == 0) {
    inner += `
    <button type="button" class="btn btn-primary btn-logout btn-xs btn-flat" disabled>下线</button>
    `
  } else {
    inner += `
    <button type="button" class="btn btn-primary btn-logout btn-xs btn-flat">下线</button>
    `
  }
  if (dataUser.user_other == 0) {
    inner += `
    <button type="button" class="btn btn-info btn-forbidden btn-xs btn-flat">启用</button>
`
  } else {
    inner += `
        <button type="button" class="btn btn-warning btn-forbidden btn-xs btn-flat">禁用</button>
  `
  }
  inner += `<button type = "button"
  class = "btn btn-danger btn-delete btn-xs btn-flat">删除</button>
  </td>`;
  tr.innerHTML = inner;
  $("#table-users").append(tr);
}

// 重置表格
function resetTable() {
  $("#table-users").children().remove();
}

// 展示注册页面
function showPanelCreate() {
  document.querySelector('#box-user-create').style.display = 'block'
  document.querySelector('#box-user-update').style.display = 'none'
}

// 展示修改页面
function showPanelUpdate() {
  document.querySelector('#box-user-create').style.display = 'none'
  document.querySelector('#box-user-update').style.display = 'block'
}

// 页数跳转
function setPage() {
  $(".pagination").children().removeClass();
  $(".pagination").children().eq(cur_page).addClass("active");
  if (cur_page == 1) {
    $(".pagination").children().eq(0).addClass("disabled");
  }
  if (page_counts == cur_page) {
    $(".pagination").children().eq(page_counts + 1).addClass("disabled");
  }
}

// 更新页数显示器
function generatePage() {
  let innerHTML = `<li><a href="#" aria-label="Previous">&laquo;</a></li>`
  for (let i = 1; i <= page_counts; i++) {
    innerHTML += `<li><a href="#">${i} </a></li>`
  }
  innerHTML += `<li><a href="#" aria-label="Next">&raquo;</a></li>`
  $(".pagination").html(innerHTML);
}