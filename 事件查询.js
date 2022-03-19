function queryVectorLayerByPnt() {
  clearAzy()
  // const docLayerzy = new Zondy.Map.Doc('', '事件', {
  //   // ip地址
  //   ip: '39.108.94.40',
  //   // 端口号 .net6163 java8089
  //   port: '6163',
  // })
  // map.addLayer(docLayerzy)
  //实例化一个矢量图层Vector作为绘制层
  var source = new ol.source.Vector({ wrapX: false })
  var vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
      //填充色
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      //边线样式
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2,
      }),
    }),
  })
  //将绘制层添加到地图容器中
  map.addLayer(vector)

  //实例化交互绘制类对象并添加到地图容器中
  draw = new ol.interaction.Draw({
    type: 'Circle',
    //绘制层数据源
    source: source,
  })
  map.addInteraction(draw)
  //点击查询的回调函数
  draw.on('drawend', drawControlbackzy)

  $('#resultShow').tabs('select', 1)
}
function drawControlbackzy(feature) {
  //clearAzy()
  //初始化查询结构对象，设置查询结构包含几何信息
  var queryStruct = new Zondy.Service.QueryFeatureStruct()
  //是否包含几何图形信息
  queryStruct.IncludeGeometry = true
  //是否包含属性信息
  queryStruct.IncludeAttribute = true
  //是否包含图形显示参数
  queryStruct.IncludeWebGraphic = false
  //创建一个用于查询的圆
  var geomObj = new Zondy.Object.Circle()
  geomObj.setByOL(feature.feature.values_.geometry)
  //指定查询规则
  var rule = new Zondy.Service.QueryFeatureRule({
    //是否将要素的可见性计算在内
    EnableDisplayCondition: false,
    //是否完全包含
    MustInside: true,
    //是否仅比较要素的外包矩形
    CompareRectOnly: false,
    //是否相交
    Intersect: true,
  })
  // //实例化查询参数对象
  // var queryParam = new Zondy.Service.QueryByLayerParameter(
  //   'gdbp://MapGisLocal/OpenLayerVecterMap/ds/世界地图经纬度/sfcls/世界政区',
  //   {
  //     geometry: geomObj,
  //     resultFormat: 'json',
  //     rule: rule,
  //     struct: queryStruct,
  //   }
  // )
  var queryParam = new Zondy.Service.QueryParameter({
    geometry: geomObj,
    resultFormat: 'json',
    struct: queryStruct,
    rule: rule,
  })
  //设置查询分页号
  queryParam.pageIndex = 0
  //设置查询要素数目
  queryParam.recordNumber = 20
  //实例化地图文档查询服务对象
  // var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
  //   ip: 'develop.smaryun.com',
  //   port: '6163', //访问IGServer的端口号，.net版为6163，Java版为8089
  // })
  //实例化地图文档查询服务对象
  var queryService = new Zondy.Service.QueryDocFeature(
    queryParam,
    '事件',
    '0',
    {
      ip: '39.108.94.40',
      port: '6163', // 访间IGServer的端口号，. net版为6163, Java版 为8
    }
  )
  //执行查询操作，querySuccess为查询回调函数
  queryService.query(querySuccess_sjcx, queryError_sjcx)
}

//查询失败回调
function queryError_sjcx(e) {
  console.log(e)
}

//查询成功回调
function querySuccess_sjcx(result) {
  // console.log(result)
  // clearAzy()
  removezy()
  //  $("#newtable tr:not(:first)").empty("");
  if (result) {
    fillzy()

    showDialogzy()
    // showLayer(newtable)
  }

  function fillzy() {
    //填充默认
    var table = document.getElementById('newtable') //获取html中table
    for (let i in result.SFEleArray) {
      //遍历数组
      show_result(i, table)
    }
  }
  function Deletezy(Row) {
    //获取当前行
    if (confirm('是否删除？') === true) {
      //确认框
      let table1 = document.getElementById('newtable')
      // 根据this返回值删除当前行
      table1.deleteRow(Row.parentNode.parentNode.rowIndex)
    }
  }
  function show_result(a, table) {
    //传入当前数组的下标及需要输出的表格，显示信息在表格某一行
    let newRow = table.insertRow() //新建一行
    let cellid = newRow.insertCell()
    let celltype = newRow.insertCell()
    let celllevel = newRow.insertCell()
    let celltime = newRow.insertCell()
    let cellplace = newRow.insertCell()
    let cellcarnum = newRow.insertCell()
    let celldiver = newRow.insertCell()
    let cellcondition = newRow.insertCell()
    let cellDel = newRow.insertCell()
    cellid.innerHTML = result.SFEleArray[a].AttValue[0] //对应一行的第一格
    celltype.innerHTML = result.SFEleArray[a].AttValue[1] //对应一行的第二格
    celllevel.innerHTML = result.SFEleArray[a].AttValue[2] //对应一行的第三格
    celltime.innerHTML = result.SFEleArray[a].AttValue[3] //对应一行的第四格
    cellplace.innerHTML = result.SFEleArray[a].AttValue[4] //对应一行的第五格
    cellcarnum.innerHTML = result.SFEleArray[a].AttValue[5] //对应一行的第六格
    celldiver.innerHTML = result.SFEleArray[a].AttValue[6]
    cellcondition.innerHTML = result.SFEleArray[a].AttValue[7]
    cellDel.innerHTML =
      "<input type='button' id = 'delete' value='删除' οnclick='Delete(this);'>" //对应一行的第七格
    //每行最后添加一个删除按钮，当点击它时调用Delete(this)函数
  }
}
function removezy() {
  var table = document.getElementById('newtable'),
    trs = table.getElementsByTagName('tr')

  for (var i = trs.length - 1; i > 0; i--) {
    table.deleteRow(i)
  }
}

function stopqueryVectorLayerByPnt() {
  if (draw != null)
    //移除交互绘制控件
    map.removeInteraction(draw)
  clearAzy()
  $('#dialogsjcx').hide()
  $('#main').hide()
  $('#rltlevel').hide()
}
function clearAzy() {
  if (map.getLayers().array_.length > 1) {
    for (var i = map.getLayers().array_.length - 1; i > 6; i--) {
      map.removeLayer(map.getLayers().array_[i])
    }
  } else return
}

//弹窗
// 最大化时保存弹窗的位置大小
var preDialogWidth = 0
var preDialogHeight = 0
var preDialogLeft = '0px'
var preDialogTop = '0px'
// 页面初始化
$(function () {
  // 常用功能
  // $('#btn_show_dialog').bind('click', showDialog)
  $('.dlg_btn_close').bind('click', hideDialog)

  // 移动
  $('#dialogsjcx').bind('mousedown', moveHandlerzy)

  // 最大化 || 还原
  $('.dlg_btn_max_top').bind('click', maxDialogzy)
  $('.dlg_btn_reback_top').bind('click', rebackDialogzy)
})

// 还原
function rebackDialogzy() {
  el_dialog = $('#dialogsjcx')[0]
  el_dialog.style.left = preDialogLeft
  el_dialog.style.top = preDialogTop
  el_dialog.style.width = preDialogWidth + 'px'
  el_dialog.style.height = preDialogHeight + 'px'

  $(this).blur()
  $(this).removeClass('dlg_btn_reback_top').addClass('dlg_btn_max_top')
  $('.dlg_btn_max_top').unbind('click').bind('click', maxDialogzy)
}
// 最大化
function maxDialogzy() {
  el_dialog = $('#dialogsjcx')[0]
  preDialogWidth = el_dialog.offsetWidth
  preDialogHeight = el_dialog.offsetHeight
  preDialogLeft = el_dialog.style.left
  preDialogTop = el_dialog.style.top
  el_dialog.style.left = 0 + 'px'
  el_dialog.style.top = 0 + 'px'
  el_dialog.style.width = window.innerWidth - 5 + 'px'
  el_dialog.style.height = window.innerHeight - 5 + 'px'
  $(this).blur()
  $(this).removeClass('dlg_btn_max_top').addClass('dlg_btn_reback_top')
  $('.dlg_btn_reback_top').unbind('click').bind('click', rebackDialogzy)
}
// 移动
function moveHandlerzy(evt) {
  var $trgt = $(event.target)
  if (!$trgt.hasClass('dlg_top')) return

  var $this = $(this)
  var el = $this[0]
  var oevent = evt || event
  var distanceX = oevent.clientX - el.offsetLeft
  var distanceY = oevent.clientY - el.offsetTop
  $(document).bind('mousemove', function (evt) {
    var oevent = evt || event
    el.style.left = oevent.clientX - distanceX + 'px'
    el.style.top = oevent.clientY - distanceY + 'px'
  })
  $(document).bind('mouseup', function () {
    $(document).unbind('mousemove')
    $(document).unbind('mouseup')
  })
}
// 显示弹窗
function showDialogzy() {
  $('#dialogsjcx').show()
}
// 隐藏弹窗
function hideDialog() {
  $('#dialogsjcx').hide()
}

// 拖拽缩放：支持右拉 || 下拉 || 右下拉
window.onload = function () {
  var el_dlg_right_bottom = document.getElementById('dlg_right_bottom')
  var el_dialog = document.getElementById('dialogsjcx')
  var minHeight = $(el_dialog).attr('minheight')
  var minWidth = $(el_dialog).attr('minwidth')
  var right = document.getElementById('dlg_right')
  var bottom = document.getElementById('dlg_bottom')
  var mouseStart = {}
  var divStart = {}
  var rightStart = {}
  var bottomStart = {}
  // drag from right
  right.onmousedown = function (ev) {
    var oEvent = ev || event
    mouseStart.x = oEvent.clientX
    mouseStart.y = oEvent.clientY
    rightStart.x = right.offsetLeft
    if (right.setCapture) {
      right.onmousemove = doDragToRightBottomToRightzy
      right.onmouseup = stopDragToRightBottomToRightzy
      right.setCapture()
    } else {
      document.addEventListener('mousemove', doDragToRightBottomToRightzy, true)
      document.addEventListener('mouseup', stopDragToRightBottomToRightzy, true)
    }
  }
  function doDragToRightBottomToRightzy(ev) {
    var oEvent = ev || event
    var l = oEvent.clientX - mouseStart.x + rightStart.x
    var w = l + el_dlg_right_bottom.offsetWidth
    if (w < el_dlg_right_bottom.offsetWidth) {
      w = el_dlg_right_bottom.offsetWidth
    } else if (
      w >
      document.documentElement.clientWidth - el_dialog.offsetLeft
    ) {
      w = document.documentElement.clientWidth - el_dialog.offsetLeft - 2
    }
    if (w < minWidth) return
    el_dialog.style.width = w + 'px'
  }
  function stopDragToRightBottomToRightzy() {
    if (right.releaseCapture) {
      right.onmousemove = null
      right.onmouseup = null
      right.releaseCapture()
    } else {
      document.removeEventListener(
        'mousemove',
        doDragToRightBottomToRightzy,
        true
      )
      document.removeEventListener(
        'mouseup',
        stopDragToRightBottomToRightzy,
        true
      )
    }
  }
  // drag from bottom
  bottom.onmousedown = function (ev) {
    var oEvent = ev || event
    mouseStart.x = oEvent.clientX
    mouseStart.y = oEvent.clientY
    bottomStart.y = bottom.offsetTop
    if (bottom.setCapture) {
      bottom.onmousemove = doDragToRightBottomToBottomzy
      bottom.onmouseup = stopDragToRightBottomToBottomzy
      bottom.setCapture()
    } else {
      document.addEventListener(
        'mousemove',
        doDragToRightBottomToBottomzy,
        true
      )
      document.addEventListener(
        'mouseup',
        stopDragToRightBottomToBottomzy,
        true
      )
    }
  }
  function doDragToRightBottomToBottomzy(ev) {
    var oEvent = ev || event
    var t = oEvent.clientY - mouseStart.y + bottomStart.y
    var h = t + el_dlg_right_bottom.offsetHeight
    if (h < el_dlg_right_bottom.offsetHeight) {
      h = el_dlg_right_bottom.offsetHeight
    } else if (
      h >
      document.documentElement.clientHeight - el_dialog.offsetTop
    ) {
      h = document.documentElement.clientHeight - el_dialog.offsetTop - 2
    }
    if (h < minHeight) return
    el_dialog.style.height = h + 'px'
  }
  function stopDragToRightBottomToBottomzy() {
    if (bottom.releaseCapture) {
      bottom.onmousemove = null
      bottom.onmouseup = null
      bottom.releaseCapture()
    } else {
      document.removeEventListener(
        'mousemove',
        doDragToRightBottomToBottomzy,
        true
      )
      document.removeEventListener(
        'mouseup',
        stopDragToRightBottomToBottomzy,
        true
      )
    }
  }
  // drag from right bottom
  el_dlg_right_bottom.onmousedown = function (ev) {
    var oEvent = ev || event
    mouseStart.x = oEvent.clientX
    mouseStart.y = oEvent.clientY
    divStart.x = el_dlg_right_bottom.offsetLeft
    divStart.y = el_dlg_right_bottom.offsetTop
    if (el_dlg_right_bottom.setCapture) {
      el_dlg_right_bottom.onmousemove = doDragToRightBottomzy
      el_dlg_right_bottom.onmouseup = stopDragToRightBottomzy
      el_dlg_right_bottom.setCapture()
    } else {
      document.addEventListener('mousemove', doDragToRightBottomzy, true)
      document.addEventListener('mouseup', stopDragToRightBottomzy, true)
    }
  }
  function doDragToRightBottomzy(ev) {
    var oEvent = ev || event
    var l = oEvent.clientX - mouseStart.x + divStart.x
    var t = oEvent.clientY - mouseStart.y + divStart.y
    var w = l + el_dlg_right_bottom.offsetWidth
    var h = t + el_dlg_right_bottom.offsetHeight
    if (w < el_dlg_right_bottom.offsetWidth) {
      w = el_dlg_right_bottom.offsetWidth
    } else if (
      w >
      document.documentElement.clientWidth - el_dialog.offsetLeft
    ) {
      w = document.documentElement.clientWidth - el_dialog.offsetLeft - 2
    }
    if (h < el_dlg_right_bottom.offsetHeight) {
      h = el_dlg_right_bottom.offsetHeight
    } else if (
      h >
      document.documentElement.clientHeight - el_dialog.offsetTop
    ) {
      h = document.documentElement.clientHeight - el_dialog.offsetTop - 2
    }
    if (w < minWidth) return
    el_dialog.style.width = w + 'px'
    if (h < minHeight) return
    el_dialog.style.height = h + 'px'
  }
  function stopDragToRightBottomzy() {
    if (el_dlg_right_bottom.releaseCapture) {
      el_dlg_right_bottom.onmousemove = null
      el_dlg_right_bottom.onmouseup = null
      el_dlg_right_bottom.releaseCapture()
    } else {
      document.removeEventListener('mousemove', doDragToRightBottomzy, true)
      document.removeEventListener(
        'mouseup',
        stopDragToRightBottomzy,

        true
      )
    }
  }
}
function relitu1() {
  $('#rltlevel').show()
  $('#main').hide()
  var blur = document.getElementById('blur')
  var radius = document.getElementById('radius')
  //创建一个Heatmap图层
  var vectorrlt = new ol.layer.Heatmap({
    //矢量数据源（读取本地的KML数据）
    source: new ol.source.Vector({
      url: './js/事件.kml',
      format: new ol.format.KML({
        extractStyles: false,
      }),
    }),

    //热点半径
    radius: parseInt(radius.value, 10),
    //模糊尺寸
    blur: parseInt(blur.value, 10),
  })
  //为矢量数据源添加addfeature事件监听
  vectorrlt.getSource().on('addfeature', function (event) {
    // 示例数据2012_Earthquakes_Mag5.kml，可从其地标名称提取地震信息
    //要素的名称属性
    var name = event.feature.get('事件等级')
    //得到要素的地震震级属性（magnitude）
    var magnitude = parseFloat(name.substr(1))
    //设置要素的weight属性
    event.feature.set('weight', magnitude - 1)
  })

  //实例化Map对象加载地图（底图+热点图）
  map.addLayer(vectorrlt)

  //分别为另个参数设置控件（input）添加事件监听，动态设置热点图的参数
  radius.addEventListener('input', function () {
    //设置热点图层的热点半径
    vectorrlt.setRadius(parseInt(radius.value, 10))
  })
  blur.addEventListener('input', function () {
    //设置热点图层的模糊尺寸
    vectorrlt.setBlur(parseInt(blur.value, 10))
  })
}
function tongjitu_shijian() {
  $('#rltlevel').hide()
  $('#main').show()
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('main'))

  // 指定图表的配置项和数据
  var option = {
    title: {
      text: '事件类型统计图',
      subtext: '2018年1月到12月',
      x: 'center',
    },
    tooltip: {},
    // legend: {
    //   show: true,
    //   data: ['事件数量'],
    // },
    xAxis: {
      name: '事件类型',
      data: ['碰撞', '刮擦', '失火', '翻车', '碾压', '其他'],
    },
    yAxis: {
      name: '数量/起',
    },
    series: [
      {
        type: 'bar',
        // type: 'line',
        data: [22, 13, 5, 6, 3, 2],
      },
    ],
  }

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
function tonjitu_yuefen() {
  $('#rltlevel').hide()
  $('#main').show()

  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('main'))

  // 指定图表的配置项和数据
  var option = {
    title: {
      text: '事件月份统计图',
      subtext: '2018年1月到12月',
      x: 'center',
    },
    tooltip: {},
    // legend: {
    //   show: true,
    //   data: ['事件数量'],
    // },
    xAxis: {
      name: '事件月份/月',
      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    },
    yAxis: {
      name: '数量/起',
    },
    series: [
      {
        // type: 'bar',
        type: 'line',
        data: [2, 1, 1, 0, 0, 0, 4, 0, 0, 9, 25, 10],
      },
    ],
  }

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
