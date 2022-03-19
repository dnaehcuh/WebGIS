// let notice = [{
//     notice_id: 3,
//     user_id: 1,
//     notice_content: "内容2djdjdeieieieieie5553",
//     notice_time: "2021-08-02T09:10:35",
//   },
//   {
//     notice_id: 4,
//     user_id: 0,
//     notice_content: "内容5488",
//     notice_time: "2021-08-03T03:44:29",
//   },
//   {
//     notice_id: 5,
//     user_id: 0,
//     notice_content: "string",
//     notice_time: "2021-08-03T06:31:00",
//   },
//   {
//     notice_id: 6,
//     user_id: 0,
//     notice_content: "string",
//     notice_time: "2021-08-03T07:11:41",
//   },
//   {
//     notice_id: 7,
//     user_id: 0,
//     notice_content: "string",
//     notice_time: "2021-08-05T09:31:50",
//   },
// ];

let notice_show_flag = true;
let notice_data;

function checkNotice() {
  if (!notice_show_flag) {
    notice_show_flag = true;
    $("#noticeTable_qw").hide();
    return;
  }
  qAllNoticeAjax(function (notice) {
    notice_data = notice;
    notice_show_flag = false;
    $("#notice_tbody").empty();
    // let res = JSON.parse(notice);
    // console.log(res);
    document.getElementById("noticeTable_qw").style.display = "block";
    let tbody = document.getElementById("notice_tbody");
    for (
      let i = 0; i < notice.length; i++ //外面的for循环 是 行tr
    ) {
      let tr = document.createElement("tr");
      tbody.appendChild(tr);
      //3,往tr每一行里面创建单元格（跟数据有关系的3个单元格），td单元格的数量取决于每个对象的属性个数 for循环遍历对象 notice[i]
      //里面的for循环是 列
      let td1 = document.createElement("td"); //创建单元格
      tr.appendChild(td1);
      if (notice[i].notice_content.length > 20) {
        td1.innerHTML = notice[i].notice_content.slice(0, 20) + "...";
      } else {
        td1.innerHTML = notice[i].notice_content;
      }
      let td2 = document.createElement("td"); //创建单元格
      tr.appendChild(td2);
      td2.innerHTML = notice[i].notice_time; //把对象里面的属性值 notice[i][k]给td
      let td = document.createElement("td");
      tr.appendChild(td);
      td.innerHTML =
        "<a href='javascript:showDia_qwlog(" + i + ")'>查看详情</a>";
    }
  }, function (msg) {
    alert(msg);
    return;
  })

}

// 最大化时保存弹窗的位置大小
let preDia_qwlogWidth = 0;
let preDia_qwlogHeight = 0;
let preDia_qwlogLeft = "0px";
let preDia_qwlogTop = "0px";
// 页面初始化
$(function () {
  // 常用功能
  $("#btn_show_dia_qwlog").bind("click", showDia_qwlog);
  $(".dlg_qw_btn_close").bind("click", hideDia_qwlog);
  $("#dlg_qw_submit").bind("click", submitHandler_pub);

  // 移动
  $("#dia_qwlog").bind("mousedown", moveHandler_pub);

  // 最大化 || 还原
  $(".dlg_qw_btn_max_top").bind("click", maxDia_qwlog);
  $(".dlg_qw_btn_reback_top").bind("click", rebackDia_qwlog);
});

// 还原
function rebackDia_qwlog() {
  el_dia_qwlog = $("#dia_qwlog")[0];
  el_dia_qwlog.style.left = preDia_qwlogLeft;
  el_dia_qwlog.style.top = preDia_qwlogTop;
  el_dia_qwlog.style.width = preDia_qwlogWidth + "px";
  el_dia_qwlog.style.height = preDia_qwlogHeight + "px";

  $(this).blur();
  $(this)
    .removeClass("dlg_qw_btn_reback_top")
    .addClass("dlg_qw_btn_max_top");
  $(".dlg_qw_btn_max_top").unbind("click").bind("click", maxDia_qwlog);
}
// 最大化
function maxDia_qwlog() {
  el_dia_qwlog = $("#dia_qwlog")[0];
  preDia_qwlogWidth = el_dia_qwlog.offsetWidth;
  preDia_qwlogHeight = el_dia_qwlog.offsetHeight;
  preDia_qwlogLeft = el_dia_qwlog.style.left;
  preDia_qwlogTop = el_dia_qwlog.style.top;
  el_dia_qwlog.style.left = 0 + "px";
  el_dia_qwlog.style.top = 0 + "px";
  el_dia_qwlog.style.width = window.innerWidth - 5 + "px";
  el_dia_qwlog.style.height = window.innerHeight - 5 + "px";
  $(this).blur();
  $(this)
    .removeClass("dlg_qw_btn_max_top")
    .addClass("dlg_qw_btn_reback_top");
  $(".dlg_qw_btn_reback_top")
    .unbind("click")
    .bind("click", rebackDia_qwlog);
}
// 移动
function moveHandler_pub(evt) {
  let $trgt = $(event.target);
  if (!$trgt.hasClass("dlg_qw_top")) return;

  let $this = $(this);
  let el = $this[0];
  let oevent = evt || event;
  let distanceX = oevent.clientX - el.offsetLeft;
  let distanceY = oevent.clientY - el.offsetTop;
  $(document).bind("mousemove", function (evt) {
    let oevent = evt || event;
    el.style.left = oevent.clientX - distanceX + "px";
    el.style.top = oevent.clientY - distanceY + "px";
  });
  $(document).bind("mouseup", function () {
    $(document).unbind("mousemove");
    $(document).unbind("mouseup");
  });
}
// 显示弹窗
function showDia_qwlog(i) {
  let gonggao_zhuti = notice_data[i].notice_content + notice_data[i].notice_time;
  let GongGaoLanLQW = document.getElementById("GongGaoLanLQW");
  GongGaoLanLQW.innerHTML = gonggao_zhuti;
  $("#dia_qwlog").show();
}
// 隐藏弹窗
function hideDia_qwlog() {
  $("#dia_qwlog").hide();
}
// 提交事件
function submitHandler_pub() {
  // alert("发布成功!");
  $("#dia_qwlog").hide();
}
// 拖拽缩放：支持右拉 || 下拉 || 右下拉
window.onload = function () {
  let el_dlg_qw_right_bottom = document.getElementById(
    "dlg_qw_right_bottom"
  );
  let el_dia_qwlog = document.getElementById("dia_qwlog");
  let minHeight = $(el_dia_qwlog).attr("minheight");
  let minWidth = $(el_dia_qwlog).attr("minwidth");
  let right = document.getElementById("dlg_qw_right");
  let bottom = document.getElementById("dlg_qw_bottom");
  let mouseStart = {};
  let divStart = {};
  let rightStart = {};
  let bottomStart = {};
  // drag from right
  right.onmousedown = function (ev) {
    let oEvent = ev || event;
    mouseStart.x = oEvent.clientX;
    mouseStart.y = oEvent.clientY;
    rightStart.x = right.offsetLeft;
    if (right.setCapture) {
      right.onmousemove = doDragToRightBottomToRight;
      right.onmouseup = stopDragToRightBottomToRight;
      right.setCapture();
    } else {
      document.addEventListener(
        "mousemove",
        doDragToRightBottomToRight,
        true
      );
      document.addEventListener(
        "mouseup",
        stopDragToRightBottomToRight,
        true
      );
    }
  };

  function doDragToRightBottomToRight(ev) {
    let oEvent = ev || event;
    let l = oEvent.clientX - mouseStart.x + rightStart.x;
    let w = l + el_dlg_qw_right_bottom.offsetWidth;
    if (w < el_dlg_qw_right_bottom.offsetWidth) {
      w = el_dlg_qw_right_bottom.offsetWidth;
    } else if (
      w >
      document.documentElement.clientWidth - el_dia_qwlog.offsetLeft
    ) {
      w =
        document.documentElement.clientWidth -
        el_dia_qwlog.offsetLeft -
        2;
    }
    if (w < minWidth) return;
    el_dia_qwlog.style.width = w + "px";
  }

  function stopDragToRightBottomToRight() {
    if (right.releaseCapture) {
      right.onmousemove = null;
      right.onmouseup = null;
      right.releaseCapture();
    } else {
      document.removeEventListener(
        "mousemove",
        doDragToRightBottomToRight,
        true
      );
      document.removeEventListener(
        "mouseup",
        stopDragToRightBottomToRight,
        true
      );
    }
  }
  // drag from bottom
  bottom.onmousedown = function (ev) {
    let oEvent = ev || event;
    mouseStart.x = oEvent.clientX;
    mouseStart.y = oEvent.clientY;
    bottomStart.y = bottom.offsetTop;
    if (bottom.setCapture) {
      bottom.onmousemove = doDragToRightBottomToBottom;
      bottom.onmouseup = stopDragToRightBottomToBottom;
      bottom.setCapture();
    } else {
      document.addEventListener(
        "mousemove",
        doDragToRightBottomToBottom,
        true
      );
      document.addEventListener(
        "mouseup",
        stopDragToRightBottomToBottom,
        true
      );
    }
  };

  function doDragToRightBottomToBottom(ev) {
    let oEvent = ev || event;
    let t = oEvent.clientY - mouseStart.y + bottomStart.y;
    let h = t + el_dlg_qw_right_bottom.offsetHeight;
    if (h < el_dlg_qw_right_bottom.offsetHeight) {
      h = el_dlg_qw_right_bottom.offsetHeight;
    } else if (
      h >
      document.documentElement.clientHeight - el_dia_qwlog.offsetTop
    ) {
      h =
        document.documentElement.clientHeight -
        el_dia_qwlog.offsetTop -
        2;
    }
    if (h < minHeight) return;
    el_dia_qwlog.style.height = h + "px";
  }

  function stopDragToRightBottomToBottom() {
    if (bottom.releaseCapture) {
      bottom.onmousemove = null;
      bottom.onmouseup = null;
      bottom.releaseCapture();
    } else {
      document.removeEventListener(
        "mousemove",
        doDragToRightBottomToBottom,
        true
      );
      document.removeEventListener(
        "mouseup",
        stopDragToRightBottomToBottom,
        true
      );
    }
  }
  // drag from right bottom
  el_dlg_qw_right_bottom.onmousedown = function (ev) {
    let oEvent = ev || event;
    mouseStart.x = oEvent.clientX;
    mouseStart.y = oEvent.clientY;
    divStart.x = el_dlg_qw_right_bottom.offsetLeft;
    divStart.y = el_dlg_qw_right_bottom.offsetTop;
    if (el_dlg_qw_right_bottom.setCapture) {
      el_dlg_qw_right_bottom.onmousemove = doDragToRightBottom;
      el_dlg_qw_right_bottom.onmouseup = stopDragToRightBottom;
      el_dlg_qw_right_bottom.setCapture();
    } else {
      document.addEventListener("mousemove", doDragToRightBottom, true);
      document.addEventListener("mouseup", stopDragToRightBottom, true);
    }
  };

  function doDragToRightBottom(ev) {
    let oEvent = ev || event;
    let l = oEvent.clientX - mouseStart.x + divStart.x;
    let t = oEvent.clientY - mouseStart.y + divStart.y;
    let w = l + el_dlg_qw_right_bottom.offsetWidth;
    let h = t + el_dlg_qw_right_bottom.offsetHeight;
    if (w < el_dlg_qw_right_bottom.offsetWidth) {
      w = el_dlg_qw_right_bottom.offsetWidth;
    } else if (
      w >
      document.documentElement.clientWidth - el_dia_qwlog.offsetLeft
    ) {
      w =
        document.documentElement.clientWidth -
        el_dia_qwlog.offsetLeft -
        2;
    }
    if (h < el_dlg_qw_right_bottom.offsetHeight) {
      h = el_dlg_qw_right_bottom.offsetHeight;
    } else if (
      h >
      document.documentElement.clientHeight - el_dia_qwlog.offsetTop
    ) {
      h =
        document.documentElement.clientHeight -
        el_dia_qwlog.offsetTop -
        2;
    }
    if (w < minWidth) return;
    el_dia_qwlog.style.width = w + "px";
    if (h < minHeight) return;
    el_dia_qwlog.style.height = h + "px";
  }

  function stopDragToRightBottom() {
    if (el_dlg_qw_right_bottom.releaseCapture) {
      el_dlg_qw_right_bottom.onmousemove = null;
      el_dlg_qw_right_bottom.onmouseup = null;
      el_dlg_qw_right_bottom.releaseCapture();
    } else {
      document.removeEventListener(
        "mousemove",
        doDragToRightBottom,
        true
      );
      document.removeEventListener(
        "mouseup",
        stopDragToRightBottom,
        true
      );
    }
  }

  $("#btn_notice_qw").click(checkNotice);
};