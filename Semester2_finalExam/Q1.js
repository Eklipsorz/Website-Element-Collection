const redSlider = document.querySelector('#red-slider')
const greenSlider = document.querySelector('#green-slider')
const blueSlider = document.querySelector('#blue-slider')

const defaultRedValue = redSlider.value
const defaultGreenValue = greenSlider.value
const defaultBlueValue = blueSlider.value



const model = {
  redValue: 0,
  greenValue: 0,
  blueValue: 0,
  fullHexCode: '',

  colorValuesSetter(...hexValues) {
    this.redValue = hexValues[0]
    this.greenValue = hexValues[1]
    this.blueValue = hexValues[2]

  },

  colorValuesGetter() {
    return [this.redValue, this.greenValue, this.blueValue]
  },

  fullHexCodeSetter(...colorValues) {
    this.fullHexCode = this.intToHexString({
      redValue: colorValues[0],
      greenValue: colorValues[1],
      blueValue: colorValues[2]
    })
  },

  fullHexCodeGetter() {
    return this.fullHexCode
  },

  // 將十進制數值轉換兩位16進制的數值，若十進制只能產生一位16進制數值便會補零
  intToTwoHexDigits(value) {

    let number = Number(value)
    return number > 15 ? number.toString(16) : '0' + number.toString(16)

  },

  intToHexString({ redValue, greenValue, blueValue }) {

    const redHexString = this.intToTwoHexDigits(redValue)
    const greenHexString = this.intToTwoHexDigits(greenValue)
    const blueHexString = this.intToTwoHexDigits(blueValue)

    return '#' + redHexString + greenHexString + blueHexString

  }

}

const view = {

  renderCanvas({ redValue, greenValue, blueValue }) {


    const canvas = document.body
    const colorHex = model.fullHexCodeGetter()
    // const colorHex = model.intToHexString({ redValue: redValue, greenValue: greenValue, blueValue: blueValue })

    canvas.style.background = colorHex

  },

  renderColorTextArea({ redValue, greenValue, blueValue }) {

    const redTextArea = document.querySelector('#red-decimal-textarea')
    const greenTextArea = document.querySelector('#green-decimal-textarea')
    const blueTextArea = document.querySelector('#blue-decimal-textarea')

    redTextArea.innerHTML = redValue
    greenTextArea.innerHTML = greenValue
    blueTextArea.innerHTML = blueValue

  },

  renderResultTextArea({ redValue, greenValue, blueValue }) {

    const resultTextArea = document.querySelector('#result-textarea')
    const colorHex = model.fullHexCodeGetter()
    // const colorHex = model.intToHexString({ redValue: redValue, greenValue: greenValue, blueValue: blueValue })
    resultTextArea.setAttribute('result-text', colorHex)
  },

  render({ redValue, greenValue, blueValue }) {

    model.colorValuesSetter(redValue, greenValue, blueValue)
    model.fullHexCodeSetter(redValue, greenValue, blueValue)

    this.renderCanvas({ redValue, greenValue, blueValue })
    this.renderColorTextArea({ redValue, greenValue, blueValue })
    this.renderResultTextArea({ redValue, greenValue, blueValue })
  }

}

const controller = {

  resetPanelDisplay() {

    redValue = defaultRedValue
    greenValue = defaultGreenValue
    blueValue = defaultBlueValue

    view.render({ redValue, greenValue, blueValue })

  },

  dispatchPanelAction({ redValue, greenValue, blueValue }) {

    modelHexValueArray = model.colorValuesGetter()


    redValue = redValue || modelHexValueArray[0]
    greenValue = greenValue || modelHexValueArray[1]
    blueValue = blueValue || modelHexValueArray[2]


    view.render({ redValue, greenValue, blueValue })

  }

}


redSlider.addEventListener('input', event => {
  controller.dispatchPanelAction({ redValue: event.target.value })
})

greenSlider.addEventListener('input', event => {
  controller.dispatchPanelAction({ greenValue: event.target.value })
})


blueSlider.addEventListener('input', event => {
  controller.dispatchPanelAction({ blueValue: event.target.value })
})

controller.resetPanelDisplay()
