
// 取得三個顏色的slider元件
const redSlider = document.querySelector('#red-slider')
const greenSlider = document.querySelector('#green-slider')
const blueSlider = document.querySelector('#blue-slider')


// 設定RGB的初始值
const defaultRedValue = redSlider.value
const defaultGreenValue = greenSlider.value
const defaultBlueValue = blueSlider.value


// model 負責處理/儲存顏色資料(RGB碼)，裡頭的資料會盡可能讓內部函式去獲取以及修正。 
const model = {

  // redValue 代表紅色色碼(十進制)
  // greenValue 代表綠色色碼(十進制)
  // blueValue 代表藍色色碼(十進制)
  // fullHexCode 代表著上述色碼以十六進制組合在一起的色碼，形式:#xxxxxx
  redValue: 0,
  greenValue: 0,
  blueValue: 0,
  fullHexCode: '',

  // 設定Red、Green、Blue這三種顏色的色碼(十進制)，外部只能透過此函式來
  // 設定model的redValue、greenValue、blueValue這三種屬性值

  colorValuesSetter(...hexValues) {
    this.redValue = hexValues[0]
    this.greenValue = hexValues[1]
    this.blueValue = hexValues[2]

  },

  // 獲取model儲存的三原色色碼(十進制)，外部只能透過此函式來獲取model
  // 的redValue、greenValue、blueValue這三種屬性值
  colorValuesGetter() {
    return [this.redValue, this.greenValue, this.blueValue]
  },

  // 設定三原色色碼結合在一起的代碼(16進制)，外部只能透過此函式來設定model的fullHexCode屬性值。
  fullHexCodeSetter(...colorValues) {
    this.fullHexCode = this.intToHexString({
      redValue: colorValues[0],
      greenValue: colorValues[1],
      blueValue: colorValues[2]
    })
  },

  // 獲取fullHexCode屬性值
  fullHexCodeGetter() {
    return this.fullHexCode
  },

  // 將十進制數值轉換兩位16進制的字串，若十進制只能產生一位16進制數值便會補零
  intToTwoHexDigits(value) {

    let number = Number(value)
    return number > 15 ? number.toString(16) : '0' + number.toString(16)

  },

  // 將三原色的數值(十進制)合併成一組十六進制的色碼字串
  intToHexString({ redValue, greenValue, blueValue }) {

    const redHexString = this.intToTwoHexDigits(redValue)
    const greenHexString = this.intToTwoHexDigits(greenValue)
    const blueHexString = this.intToTwoHexDigits(blueValue)

    return '#' + redHexString + greenHexString + blueHexString

  }

}


// View 負責渲染畫面(背景/畫布、三原色色碼實際數值(十進制)、三原色色碼合併結果)
const view = {

  // 負責渲染背景/畫布，以body作為畫布
  renderCanvas({ redValue, greenValue, blueValue }) {

    const canvas = document.body
    const colorHex = model.fullHexCodeGetter()

    canvas.style.background = colorHex

  },

  // 負責渲染三原色色碼實際數值
  renderColorTextArea({ redValue, greenValue, blueValue }) {

    const redTextArea = document.querySelector('#red-decimal-textarea')
    const greenTextArea = document.querySelector('#green-decimal-textarea')
    const blueTextArea = document.querySelector('#blue-decimal-textarea')

    redTextArea.innerHTML = redValue
    greenTextArea.innerHTML = greenValue
    blueTextArea.innerHTML = blueValue

  },

  // 負責渲染三原色合併結果(十六進制)
  renderResultTextArea({ redValue, greenValue, blueValue }) {

    const resultTextArea = document.querySelector('#result-textarea')
    const colorHex = model.fullHexCodeGetter()

    resultTextArea.setAttribute('result-text', colorHex)
  },

  // 負責一次渲染畫布、三原色色碼實際數值、三原色合併結果
  render({ redValue, greenValue, blueValue }) {

    // 設定三原色色碼、三原色合併結果
    model.colorValuesSetter(redValue, greenValue, blueValue)
    model.fullHexCodeSetter(redValue, greenValue, blueValue)

    this.renderCanvas({ redValue, greenValue, blueValue })
    this.renderColorTextArea({ redValue, greenValue, blueValue })
    this.renderResultTextArea({ redValue, greenValue, blueValue })
  }

}

// Controller：負責接收/處理使用者對於介面的請求
const controller = {


  // 重設畫面(背景/畫布、三原色色碼實際數值(十進制)、三原色色碼合併結果)
  resetPanelDisplay() {

    view.render({
      redValue: defaultRedValue,
      greenValue: defaultGreenValue,
      blueValue: defaultBlueValue
    })

  },

  // 當input事件發生時，會由controller負責委派並且按照slider滑到的數值來渲染
  // 畫面(背景/畫布、三原色色碼實際數值(十進制)、三原色色碼合併結果)
  dispatchPanelAction({ redValue, greenValue, blueValue }) {


    modelHexValueArray = model.colorValuesGetter()

    // 除了使用者使用對應顏色的slider是以其元件的數值來表示以外，
    // 其他顏色則是以model目前的三原色色碼為主
    redValue = redValue || modelHexValueArray[0]
    greenValue = greenValue || modelHexValueArray[1]
    blueValue = blueValue || modelHexValueArray[2]


    view.render({ redValue, greenValue, blueValue })

  }

}

// 讓每個顏色的slider綁定在controller，讓它能夠負責處理事件
redSlider.addEventListener('input', event => {
  controller.dispatchPanelAction({ redValue: event.target.value })
})

greenSlider.addEventListener('input', event => {
  controller.dispatchPanelAction({ greenValue: event.target.value })
})


blueSlider.addEventListener('input', event => {
  controller.dispatchPanelAction({ blueValue: event.target.value })
})

// 重設畫面
controller.resetPanelDisplay()
