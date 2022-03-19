let vector_pu = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: "rgba(32,200,255,0.2)",
        }),
        stroke: new ol.style.Stroke({
            color: "blue",
            width: 2,
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: "#ffcc33",
            }),
        }),
    }),
});

map.addLayer(vector_pu);
// let typeSelect = document.getElementById("type");

function AddInteractionLQW() {
    let value = "LineString";
    if (source === null) {
        source = new ol.source.Vector({
            wrapX: false,
        });
        vector_pu.setSource(source);
    }

    let geometryFunction, maxPoints;

    if (value === "Square") {
        value = "Circle";
        geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
    } else if (value === "rectangle") {
        value = "LineString";
        maxPoints = 2;
        geometryFunction = function (coordinates, geometry) {
            if (!geometry) {
                geometry = new ol.geom.Polygon(null);
            }
            let start = coordinates[0];
            let end = coordinates[1];
            geometry.setCoordinates([
                [start, [start[0], end[1]], end, [end[0], start[1]], start],
            ]);
            return geometry;
        };
    }

    draw_pu = new ol.interaction.Draw({
        source: source,
        type: value,
        geometryFunction: geometryFunction,
        maxPoints: maxPoints,
    });
    map.addInteraction(draw_pu);

    draw_pu.on("drawend", function (e) {
        info_pu = e;
        console.log(e);

        if (value === "Point") {
            console.log(
                "点坐标" +
                "x:" +
                e.feature.getGeometry().getCoordinates()[0] +
                ",y" +
                e.feature.getGeometry().getCoordinates()[1]
            );
        } else if (value === "LineString") {
            let lineInfo = "线的端点坐标为:";
            console.log(e.feature.getGeometry().getCoordinates());
            coords = e.feature.getGeometry().getCoordinates();
            for (
                let i = 0; i < e.feature.getGeometry().getCoordinates().length; i++
            ) {
                const lineCoordinate =
                    "[x:" +
                    e.feature.getGeometry().getCoordinates()[i][0] +
                    ",y:" +
                    e.feature.getGeometry().getCoordinates()[i][1] +
                    "]";
                lineInfo = lineInfo + lineCoordinate;
            }
            // alert(lineInfo);
        }

        addLineLQW();
    });
}


//添加线要素
function addLineLQW() {
    let pointObj = new Array();
    console.log("coords");
    console.log(coords);
    pointObj[0] = new Zondy.Object.Point2D(coords[0][0], coords[0][1]);
    pointObj[1] = new Zondy.Object.Point2D(coords[1][0], coords[1][1]);
    pointObj[2] = new Zondy.Object.Point2D(coords[2][0], coords[2][1]);
    let gArc = new Zondy.Object.Arc(pointObj);
    let gAnyLine = new Zondy.Object.AnyLine([gArc]);
    let gLine = new Zondy.Object.GLine(gAnyLine);
    var fGeom = new Zondy.Object.FeatureGeometry({
        LinGeom: [gLine],
    });
    // 设置线要素的图形参数信息
    let clineInfo = new Zondy.Object.CLineInfo({
        Color: 156,
        LinStyleID: 20,
        LinStyleID2: 0,
        LinWidth: 1,
        Yscale: 1,
        Yscale: 1,
    });
    // 要素图形参数信息
    let graphicInfo = new Zondy.Object.WebGraphicsInfo({
        InfoType: 2,
        LinInfo: clineInfo,
    });
    // 设置线要素的属性信息
    let attValue = [];
    let newFeature = new Zondy.Object.Feature({
        fGeom: fGeom,
        GraphicInfo: graphicInfo,
        AttValue: attValue,
    });
    newFeature.setFType(2);
    let featureSet = new Zondy.Object.FeatureSet();
    let cAttStruct = new Zondy.Object.CAttStruct({
        FldName: [],
        FldNumber: 0,
        FldType: [],
    });
    featureSet.AttStruct = cAttStruct;
    featureSet.addFeature(newFeature);
    let editDocFeature = new Zondy.Service.EditDocFeature("line", 0, {
        ip: "39.108.94.40",
        port: "6163",
    });
    editDocFeature.add(featureSet, onLineSuccess);
}

function onLineSuccess(rlt) {
    if (rlt) {
        console.log(rlt);
        alert("添加线要素成功");
        singleBufferAnalysisLQW();
        // docLayer.refresh();
    } else {
        alert("添加线失败");
    }
}

// 缓冲区
let resultBaseUrl_sht = "gdbp://MapGISLocalPlus/示例数据/sfcls/";
let resultname_sht;


function singleBufferAnalysisLQW() {
    resultname_sht = resultBaseUrl_sht + "Buffer" + getCurentTime();
    let clsBufBySR = new Zondy.Service.ClassBufferBySingleRing({
        ip: "39.108.94.40",
        port: "6163",
        leftRad: 0.001,
        rightRad: 0.001,
        isByAtt: false,
    });

    clsBufBySR.srcInfo = "gdbp://MapGISLocalPlus/示例数据/sfcls/line";
    clsBufBySR.desInfo = resultname_sht;
    DataBufferLQW = resultname_sht;
    clsBufBySR.execute(
        AnalysisSuccess_lqw,
        "post",
        false,
        "json",
        AnalysisError
    );
    OverlayByLayerAnalysisLQW();
}

// 叠加分析
function OverlayByLayerAnalysisLQW() {

    resultname_sht = resultBaseUrl_sht + "Overlay" + getCurentTime();
    let overlayParam = new Zondy.Service.OverlayByLayer({
        ip: "39.108.94.40",
        port: "6163",
        srcInfo1: "gdbp://MapGisLocal/wuhan/sfcls/居民区",
        srcInfo2: DataBufferLQW,
        desInfo: resultname_sht,
        infoOptType: 1,
        overType: 1,
        attOptType: 1,
        isReCalculate: true,
        radius: 0.000001,
        color: 'red',
    });
    overlayParam.execute(
        AnalysisSuccess_lqw,
        "post",
        false,
        "json",
        AnalysisError
    );
}

// // 要素查询
// function queryByAttribute() {
//   // startPressBar();
//   // $('#resultShow').tabs('select', 1);
//   //初始化查询结构对象，设置查询结构包含几何信息
//   var queryStruct = new Zondy.Service.QueryFeatureStruct();
//   // queryStruct.IncludeGeometry = true;
//   //实例化查询参数对象
//   var queryParam = new Zondy.Service.QueryByLayerParameter(
//     "gdbp://MapGISLocalPlus/示例数据/ds/三维示例/sfcls/Overlay2021-08-03-232121",
//     {
//       resultFormat: "json",
//       struct: queryStruct,
//     }
//   );
//   //设置查询分页号
//   queryParam.pageIndex = 0;
//   //设置查询要素数目
//   queryParam.recordNumber = 20;
//   //设置属性条件
//   // var name = $("#Conditions").val();
//   // queryParam.where = ;
//   //queryParam.where = "name='中国'";
//   //实例化地图文档查询服务对象
//   var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
//     ip: "localhost",
//     port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089
//   });
//   //执行查询操作，querySuccess为查询回调函数
//   queryService.query(querySuccess, queryError);
// }
// function querySuccess(data) {
//   //将JSON对象转换成JSON字符串
//   var formatData = JSON.stringify(data.ObjClsArray);
//   //将结果显示在指定的div上
//   console.log(formatData);
// }
// function queryError(e) {
//   console.log(e);
// }

// 获取当前时间
function getCurentTime() {
    var now = new Date();
    //获取当前年份
    var year = now.getFullYear();
    //获取当前月份
    var month = now.getMonth() + 1;
    //获取当前日期
    var day = now.getDate();
    //获取当前时刻
    var hh = now.getHours();
    //获取当前分钟
    var mm = now.getMinutes();
    //获取当前秒钟
    var ss = now.getSeconds();
    //将当前的日期拼串
    var clock = year + "-";
    if (month < 10) clock += "0";
    clock += month + "-";
    if (day < 10) clock += "0";
    clock += day + "-";
    if (hh < 10) clock += "0";
    clock += hh;
    if (mm < 10) clock += "0";
    clock += mm;
    if (ss < 10) clock += "0";
    clock += ss;
    return clock;
}

function AnalysisError(e) {
    console.log(e);
}

function AnalysisSuccess_lqw(data) {
    console.log(data);
    if (data.succeed) {
        const resultLayer = new Zondy.Map.GdbpLayer("", [resultname_sht], {
            ip: "39.108.94.40",
            port: "6163",
        });
        map.addLayer(resultLayer);
    }
    queryByPnt_sht()
}


// 属性查询

function queryByPnt_sht() {



    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    queryStruct.IncludeGeometry = true;
    //创建一个用于查询的点形状
    var pointObj = new Zondy.Object.Point2D(114.39, 30.49); //光谷中心点
    //设置点容差半径
    pointObj.nearDis = 1; //越小查询的范围越大
    //实例化查询参数对象	

    var queryParam = new Zondy.Service.QueryByLayerParameter(resultname_sht, {
        geometry: pointObj,
        resultFormat: "json",
        struct: queryStruct
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 20;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
        ip: "39.108.94.40",
        port: "6163" //访问IGServer的端口号，.net版为6163，Java版为8089
    });
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(queryPointSuccess_sht, queryPointError_sht);
}

//查询失败回调
function queryPointError_sht(e) {
    console.log(e)

}

function queryPointSuccess_sht(result) {
    var gonggao_quyu = " "
    console.log(result)
    for (var tempfid = 0; tempfid < result.SFEleArray.length; tempfid++) {
        let YingXiangname = result.SFEleArray[tempfid].AttValue[6]
        console.log(YingXiangname);
        gonggao_quyu = gonggao_quyu + YingXiangname + ","
    }
    var gonggao_zhuti = `
尊敬的居民及商户：
xxxx区污水治理工程是市政府民生工程，根据本工程的施工作业需要，将于2021年8月4日对xx村路段道路进行开挖施工；为确保正常施工、保证施工安全，将分段对部分道路进行封闭、半封闭施工，请广大市民进入施工路段，注意安全，按照交通标志指示信息绕行，因工程施工带来的不便，敬请各位居民、商户谅解和支持。
影响范围：
` + gonggao_quyu + `
　　谢谢合作，特此通告！

　　                                                                                                        xxxx建筑工程有限责任公司
                                                                                                      ` + getCurentTime()
    console.log(gonggao_zhuti)

    var content = document.getElementById("GongGaoLan");
    GongGaoLan.innerHTML = gonggao_zhuti;

    // $("#GongGao").append(gonggao_zhuti)
    addGongGao()








}

function addGongGao() {
    $("#dia_gglog").show();
}

function addInteractionLqw1() {
    AddInteractionLQW()
}

// 最大化时保存弹窗的位置大小
var preDia_gglogWidth = 0;
var preDia_gglogHeight = 0;
var preDia_gglogLeft = "0px";
var preDia_gglogTop = "0px";
// 页面初始化
$(function () {
    // 常用功能
    $("#btn_show_dia_gglog").bind("click", addInteractionLqw1);
    $(".dlg_gg_btn_close").bind("click", hideDia_gglog);
    $("#dlg_gg_submit").bind("click", submitHandler_pub);

    // 移动
    $("#dia_gglog").bind("mousedown", moveHandler_pub);

    // 最大化 || 还原
    $(".dlg_gg_btn_max_top").bind("click", maxDia_gglog);
    $(".dlg_gg_btn_reback_top").bind("click", rebackDia_gglog);
});

// 还原
function rebackDia_gglog() {
    el_dia_gglog = $("#dia_gglog")[0];
    el_dia_gglog.style.left = preDia_gglogLeft;
    el_dia_gglog.style.top = preDia_gglogTop;
    el_dia_gglog.style.width = preDia_gglogWidth + "px";
    el_dia_gglog.style.height = preDia_gglogHeight + "px";

    $(this).blur();
    $(this).removeClass("dlg_gg_btn_reback_top").addClass("dlg_gg_btn_max_top");
    $(".dlg_gg_btn_max_top").unbind("click").bind("click", maxDia_gglog);
}
// 最大化
function maxDia_gglog() {
    el_dia_gglog = $("#dia_gglog")[0];
    preDia_gglogWidth = el_dia_gglog.offsetWidth;
    preDia_gglogHeight = el_dia_gglog.offsetHeight;
    preDia_gglogLeft = el_dia_gglog.style.left;
    preDia_gglogTop = el_dia_gglog.style.top;
    el_dia_gglog.style.left = 0 + "px";
    el_dia_gglog.style.top = 0 + "px";
    el_dia_gglog.style.width = window.innerWidth - 5 + "px";
    el_dia_gglog.style.height = window.innerHeight - 5 + "px";
    $(this).blur();
    $(this).removeClass("dlg_gg_btn_max_top").addClass("dlg_gg_btn_reback_top");
    $(".dlg_gg_btn_reback_top").unbind("click").bind("click", rebackDia_gglog);
}
// 移动
function moveHandler_pub(evt) {
    var $trgt = $(event.target);
    if (!$trgt.hasClass("dlg_gg_top")) return;

    var $this = $(this);
    var el = $this[0];
    var oevent = evt || event;
    var distanceX = oevent.clientX - el.offsetLeft;
    var distanceY = oevent.clientY - el.offsetTop;
    $(document).bind("mousemove", function (evt) {
        var oevent = evt || event;
        el.style.left = oevent.clientX - distanceX + "px";
        el.style.top = oevent.clientY - distanceY + "px";
    });
    $(document).bind("mouseup", function () {
        $(document).unbind("mousemove");
        $(document).unbind("mouseup");
    });
}

// 显示弹窗
function showDia_gglog() {


    // $("#dia_gglog").show();

    $("#dia_gglog").show();
}
// 隐藏弹窗
function hideDia_gglog() {
    $("#dia_gglog").hide();
}
// 提交事件
function submitHandler_pub() {
    alert("发布成功!");
}
// 拖拽缩放：支持右拉 || 下拉 || 右下拉
window.onload = function () {
    var el_dlg_gg_right_bottom = document.getElementById("dlg_gg_right_bottom");
    var el_dia_gglog = document.getElementById("dia_gglog");
    var minHeight = $(el_dia_gglog).attr("minheight");
    var minWidth = $(el_dia_gglog).attr("minwidth");
    var right = document.getElementById("dlg_gg_right");
    var bottom = document.getElementById("dlg_gg_bottom");
    var mouseStart = {};
    var divStart = {};
    var rightStart = {};
    var bottomStart = {};
    // drag from right
    right.onmousedown = function (ev) {
        var oEvent = ev || event;
        mouseStart.x = oEvent.clientX;
        mouseStart.y = oEvent.clientY;
        rightStart.x = right.offsetLeft;
        if (right.setCapture) {
            right.onmousemove = doDragToRightBottomToRight_pub;
            right.onmouseup = stopDragToRightBottomToRight_pub;
            right.setCapture();
        } else {
            document.addEventListener(
                "mousemove",
                doDragToRightBottomToRight_pub,
                true
            );
            document.addEventListener(
                "mouseup",
                stopDragToRightBottomToRight_pub,
                true
            );
        }
    };

    function doDragToRightBottomToRight_pub(ev) {
        var oEvent = ev || event;
        var l = oEvent.clientX - mouseStart.x + rightStart.x;
        var w = l + el_dlg_gg_right_bottom.offsetWidth;
        if (w < el_dlg_gg_right_bottom.offsetWidth) {
            w = el_dlg_gg_right_bottom.offsetWidth;
        } else if (
            w >
            document.documentElement.clientWidth - el_dia_gglog.offsetLeft
        ) {
            w = document.documentElement.clientWidth - el_dia_gglog.offsetLeft - 2;
        }
        if (w < minWidth) return;
        el_dia_gglog.style.width = w + "px";
    }

    function stopDragToRightBottomToRight_pub() {
        if (right.releaseCapture) {
            right.onmousemove = null;
            right.onmouseup = null;
            right.releaseCapture();
        } else {
            document.removeEventListener(
                "mousemove",
                doDragToRightBottomToRight_pub,
                true
            );
            document.removeEventListener(
                "mouseup",
                stopDragToRightBottomToRight_pub,
                true
            );
        }
    }
    // drag from bottom
    bottom.onmousedown = function (ev) {
        var oEvent = ev || event;
        mouseStart.x = oEvent.clientX;
        mouseStart.y = oEvent.clientY;
        bottomStart.y = bottom.offsetTop;
        if (bottom.setCapture) {
            bottom.onmousemove = doDragToRightBottomToBottom_pub;
            bottom.onmouseup = stopDragToRightBottomToBottom_pub;
            bottom.setCapture();
        } else {
            document.addEventListener(
                "mousemove",
                doDragToRightBottomToBottom_pub,
                true
            );
            document.addEventListener(
                "mouseup",
                stopDragToRightBottomToBottom_pub,
                true
            );
        }
    };

    function doDragToRightBottomToBottom_pub(ev) {
        var oEvent = ev || event;
        var t = oEvent.clientY - mouseStart.y + bottomStart.y;
        var h = t + el_dlg_gg_right_bottom.offsetHeight;
        if (h < el_dlg_gg_right_bottom.offsetHeight) {
            h = el_dlg_gg_right_bottom.offsetHeight;
        } else if (
            h >
            document.documentElement.clientHeight - el_dia_gglog.offsetTop
        ) {
            h = document.documentElement.clientHeight - el_dia_gglog.offsetTop - 2;
        }
        if (h < minHeight) return;
        el_dia_gglog.style.height = h + "px";
    }

    function stopDragToRightBottomToBottom_pub() {
        if (bottom.releaseCapture) {
            bottom.onmousemove = null;
            bottom.onmouseup = null;
            bottom.releaseCapture();
        } else {
            document.removeEventListener(
                "mousemove",
                doDragToRightBottomToBottom_pub,
                true
            );
            document.removeEventListener(
                "mouseup",
                stopDragToRightBottomToBottom_pub,
                true
            );
        }
    }
    // drag from right bottom
    el_dlg_gg_right_bottom.onmousedown = function (ev) {
        var oEvent = ev || event;
        mouseStart.x = oEvent.clientX;
        mouseStart.y = oEvent.clientY;
        divStart.x = el_dlg_gg_right_bottom.offsetLeft;
        divStart.y = el_dlg_gg_right_bottom.offsetTop;
        if (el_dlg_gg_right_bottom.setCapture) {
            el_dlg_gg_right_bottom.onmousemove = doDragToRightBottom_pub;
            el_dlg_gg_right_bottom.onmouseup = stopDragToRightBottom_pub;
            el_dlg_gg_right_bottom.setCapture();
        } else {
            document.addEventListener("mousemove", doDragToRightBottom_pub, true);
            document.addEventListener("mouseup", stopDragToRightBottom_pub, true);
        }
    };

    function doDragToRightBottom_pub(ev) {
        var oEvent = ev || event;
        var l = oEvent.clientX - mouseStart.x + divStart.x;
        var t = oEvent.clientY - mouseStart.y + divStart.y;
        var w = l + el_dlg_gg_right_bottom.offsetWidth;
        var h = t + el_dlg_gg_right_bottom.offsetHeight;
        if (w < el_dlg_gg_right_bottom.offsetWidth) {
            w = el_dlg_gg_right_bottom.offsetWidth;
        } else if (
            w >
            document.documentElement.clientWidth - el_dia_gglog.offsetLeft
        ) {
            w = document.documentElement.clientWidth - el_dia_gglog.offsetLeft - 2;
        }
        if (h < el_dlg_gg_right_bottom.offsetHeight) {
            h = el_dlg_gg_right_bottom.offsetHeight;
        } else if (
            h >
            document.documentElement.clientHeight - el_dia_gglog.offsetTop
        ) {
            h = document.documentElement.clientHeight - el_dia_gglog.offsetTop - 2;
        }
        if (w < minWidth) return;
        el_dia_gglog.style.width = w + "px";
        if (h < minHeight) return;
        el_dia_gglog.style.height = h + "px";
    }

    function stopDragToRightBottom_pub() {
        if (el_dlg_gg_right_bottom.releaseCapture) {
            el_dlg_gg_right_bottom.onmousemove = null;
            el_dlg_gg_right_bottom.onmouseup = null;
            el_dlg_gg_right_bottom.releaseCapture();
        } else {
            document.removeEventListener(
                "mousemove",
                doDragToRightBottom_pub,
                true
            );
            document.removeEventListener(
                "mouseup",
                stopDragToRightBottom_pub,
                true
            );
        }
    }
};