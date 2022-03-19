let layer = new Array() //map中的图层数组
let layerName = new Array() //图层名称数组
let layerVisibility = new Array() //图层可见属性数组
loadLayersControl(map, 'layerTree')

// 添加图层目录
function loadLayersControl(map, id) {
  let treeContent = document.getElementById(id) //图层目录容器
  // let layers = map.getLayers(); //获取地图中所有图层
  let layers = map.getLayers() //获取地图中所有图层
  console.log(layers)
  // console.log(layers.array_[0].values_.title);
  for (let i = 0; i < layers.getLength(); i++) {
    //获取每个图层的名称、是否可见属性

    layer[i] = layers.item(i)
    layerName[i] = layers.array_[i].values_.title

    layerVisibility[i] = layer[i].getVisible()

    //新增li元素，用来承载图层项
    let elementLi = document.createElement('li')
    treeContent.appendChild(elementLi) // 添加子节点
    //创建复选框元素
    let elementInput = document.createElement('input')
    elementInput.type = 'checkbox'
    elementInput.name = 'layers'
    elementLi.appendChild(elementInput)
    //创建label元素
    let elementLable = document.createElement('label')
    elementLable.className = 'layer'
    //设置图层名称
    setInnerText(elementLable, layerName[i])
    elementLi.appendChild(elementLable)

    //设置图层默认显示状态
    if (layerVisibility[i]) {
      elementInput.checked = true
    }
    addChangeEvent(elementInput, layer[i]) //为checkbox添加变更事件
  }
}

function setInnerText(element, text) {
  if (typeof element.textContent == 'string') {
    element.textContent = text
  } else {
    element.innerText = text
  }
}

function addChangeEvent(element, layer) {
  element.onclick = function () {
    if (element.checked) {
      layer.setVisible(true) //显示图层
    } else {
      layer.setVisible(false) //不显示图层
    }
  }
}
