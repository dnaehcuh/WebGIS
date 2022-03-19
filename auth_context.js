let logout_wxh = function () {
  logoutAjax(function () {
      localStorage.removeItem('token');
      window.open('../index_login.html', '_self');
    },
    function (msg) {
      alert("登出失败");
      console.log(msg);
    })
}