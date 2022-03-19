function baseAjax(url, method, data, contentType, succ_fn, e_fn, ...rest) {
  // let baseURL = "http://101.200.150.149:8010",
  let baseURL = "http://localhost:8010",
    headers = {
      "Authorization": "Bearer " + localStorage.getItem('token')
    },
    default_e_fn = resp => {
      if (resp.status == 401) {
        alert(resp.responseJSON.message)
        localStorage.removeItem('token');
        // window.history.go(-1)
      } else if (resp.status == 402) {
        alert("请求参数错误")
      } else {
        alert("服务器出错啦！")
        console.log(resp);
      }
    },
    err_fn = e_fn || default_e_fn;
  $.ajax({
    type: method,
    headers: headers,
    url: baseURL + url,
    data: data,
    contentType: contentType,
    success: succ_fn,
    error: err_fn
  });
}

function loginAjax(form_data, succ_fn) {
  let url = "/api/auth/login",
    method = "POST",
    data = form_data,
    contentType = "application/x-www-form-urlencoded"
  baseAjax(
    url,
    method,
    data,
    contentType,
    succ_fn,
    e_fn = null
  );
}

function registerAjax(form_data) {
  let url = "/api/auth/register",
    method = "POST",
    data = JSON.stringify(form_data),
    contentType = "application/json",
    succ_fn = resp => {
      console.log(resp);
      let code = resp.code;
      if (code == 0) {
        alert("注册成功，用户ID为" + resp.result[0].user_id);
        dl();
      } else {
        alert("注册失败");
        console.log(resp);
      }
    }
  baseAjax(
    url,
    method,
    data,
    contentType,
    succ_fn,
    e_fn = null
  );
}

function addUserAjax(form_data) {
  let url = "/api/user/add",
    headers = {
      // "Authorization": "Bearer " + localStorage.getItem('token')
      "Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsImV4cCI6MTYyNzg4NDc0NX0.Rpy9lZE6-or133ETblKtB3fos9Fm1ZPYOsX8cl4gmBc"
    },
    method = "POST",
    data = JSON.stringify(form_data),
    contentType = "application/json",
    succ_fn = resp => {
      console.log(resp);
      let code = resp.code;
      if (code == 0) {
        alert("添加成功");
      } else {
        alert("添加失败");
        console.log(code);
      }
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

// 用户修改
function updateUserAjax(form_data, ok_fn, err_fn) {
  let url = "/api/user/update",
    method = "PUT",
    contentType = "application/json",
    data = JSON.stringify(form_data),
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || [])
      } else {
        err_fn(resp.message)
        console.log(resp);
      }
    }
  baseAjax(
    url,
    method,
    data,
    contentType,
    succ_fn,
    e_fn = null
  );
}


// 登出
function logoutAjax(ok_fn, err_fn) {
  let url = "/api/user/logout",
    method = "PUT",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      console.log(resp)
      if (code == 0) {
        ok_fn(resp.result || [])
      } else {
        err_fn(resp.message)
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


// 验证token
function tokenAuth(token, ok_fn, err_fn) {
  let url = "/api/auth/token?token=" + token,
    method = "GET",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      console.log(resp)
      if (code == 0) {
        ok_fn(resp.result || [])
      } else {
        err_fn(resp.message)
        // console.log(resp);
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

// 获取一条交通数据
function qTraffic(traffic_id, ok_fn, err_fn) {
  let url = "/api/traffic/query_one?traffic_id=" + traffic_id,
    method = "GET",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || [])
      } else {
        err_fn()
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
    data = [],
    contentType,
    succ_fn,
    e_fn
  );
}

// 获取所有交通信息
function qTrafficAll(ok_fn, err_fn) {
  let url = "/api/traffic/query_all",
    method = "GET",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || [])
      } else {
        err_fn()
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
    data = [],
    contentType,
    succ_fn,
    e_fn
  );
}
// 查询一页交通数据
function qTrafficPage(page_id, ok_fn, err_fn, page_size = 12) {
  let url = "/api/traffic/query_page?page=" + page_id + "&page_size=" + page_size
  method = "GET",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || [], resp.count)
      } else {
        err_fn(resp.message)
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
    data = [],
    contentType,
    succ_fn,
    e_fn
  );
}
// 删除一条交通数据
function delTraffic(traffic_id, ok_fn, err_fn) {
  let url = "/api/traffic/del?traffic_id=" + traffic_id,
    method = "DELETE",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || [])
      } else {
        err_fn(resp.message)
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
    data = [],
    contentType,
    succ_fn,
    e_fn
  );
}
// 更新交通数据
function updateTraffic(form_data, ok_fn, err_fn) {
  let url = "/api/traffic/update",
    method = "PUT",
    contentType = "application/json",
    data = JSON.stringify(form_data),
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || [])
      } else {
        err_fn(resp.message)
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
// 添加一条交通数据
function addTrafficAjax(form_data, ok_fn, err_fn) {
  let url = "/api/traffic/add",
    method = "POST",
    contentType = "application/json",
    data = JSON.stringify(form_data),
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn(resp.message);
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



// 查询一条公告
function qNoticeAjax(notice_id, ok_fn, err_fn) {
  let url = "/api/notice/query_one?notice_id=" + notice_id,
    method = "GET",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn(resp.message);
      }
    },
    e_fn = e => {
      alert("请求失败");
      console.log(e);
    }
  baseAjax(
    url,
    method,
    data = [],
    contentType,
    succ_fn,
    e_fn
  );
}
// 查询一页公告
function qPageNoticeAjax(page_id, ok_fn, err_fn, page_step = 12) {
  let url = "/api/notice/query_page?page=" + page_id + "&page_size=" + page_step,
    method = "GET",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn();
      }
    },
    e_fn = e => {
      alert("请求失败");
      console.log(e);
    }
  baseAjax(
    url,
    method,
    data = [],
    contentType,
    succ_fn,
    e_fn
  );
}
// 查询所有公告
function qAllNoticeAjax(ok_fn, err_fn) {
  let url = "/api/notice/query_all",
    method = "GET",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn(resp.message);
        console.log(resp);
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
// 删除一条公告
function delNoticeAjax(notice_id, ok_fn, err_fn) {
  let url = "/api/notice/del?notice_id=" + notice_id,
    method = "DELETE",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn(resp.message);
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
    data = [],
    contentType,
    succ_fn,
    e_fn
  );
}
// 添加一条公告
function addNoticeAjax(form_data, ok_fn, err_fn) {
  let url = "/api/notice/add",
    method = "POST",
    contentType = "application/json",
    data = JSON.stringify(form_data),
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn(resp.message);
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
// 更新一条公告
function updateNoticeAjax(form_data, ok_fn, err_fn) {
  let url = "/api/notice/update",
    method = "PUT",
    contentType = "application/json",
    data = JSON.stringify(form_data),
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn(resp.message);
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



// 查询一事件
function qEventAjax(event_id, ok_fn, err_fn) {
  let url = "/api/event/query_one?event_id=" + event_id,
    method = "GET",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn(resp.message);
      }
    },
    e_fn = e => {
      alert("请求失败");
      console.log(e);
    }
  baseAjax(
    url,
    method,
    data = [],
    contentType,
    succ_fn,
    e_fn
  );
}
// 查询一页事件
function qPageEventAjax(page_id, ok_fn, err_fn, page_step = 12) {
  let url = "/api/event/query_page?page=" + page_id + "&page_size=" + page_step,
    method = "GET",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn(resp.message);
      }
    },
    e_fn = e => {
      alert("请求失败");
      console.log(e);
    }
  baseAjax(
    url,
    method,
    data = [],
    contentType,
    succ_fn,
    e_fn
  );
}
// 查询所有事件
function qAllEventAjax(ok_fn, err_fn) {
  let url = "/api/event/query_all",
    method = "GET",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn(resp.message);
        console.log(resp);
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
// 删除一条事件
function delEventAjax(event_id, ok_fn, err_fn) {
  let url = "/api/event/del?event_id=" + event_id,
    method = "DELETE",
    contentType = "application/json",
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn(resp.message);
        console.log(resp);
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
// 添加一条事件
function addEventAjax(form_data, ok_fn, err_fn) {
  let url = "/api/event/add",
    method = "POST",
    contentType = "application/json",
    data = JSON.stringify(form_data),
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn(resp.message);
        console.log(resp);
      }
    }
  baseAjax(
    url,
    method,
    data,
    contentType,
    succ_fn,
    e_fn = null
  );
}
// 更新一条事件
function updateEventAjax(form_data, ok_fn, err_fn) {
  let url = "/api/event/update",
    method = "PUT",
    contentType = "application/json",
    data = JSON.stringify(form_data),
    succ_fn = resp => {
      let code = resp.code;
      if (code == 0) {
        ok_fn(resp.result || []);
      } else {
        err_fn(resp.message);
        console.log(resp);
      }
    }
  baseAjax(
    url,
    method,
    data,
    contentType,
    succ_fn,
    e_fn = null
  );
}