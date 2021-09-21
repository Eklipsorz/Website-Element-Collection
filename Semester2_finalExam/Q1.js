const redSlider = document.querySelector('#red-slider')
const greenSlider = document.querySelector('#green-slider')
const blueSlider = document.querySelector('#blue-slider')

const defaultRedValue = redSlider.value
const defaultGreenValue = greenSlider.value
const defaultBlueValue = blueSlider.value


const view = {

  redValue: defaultRedValue,
  greenValue: defaultGreenValue,
  blueValue: defaultBlueValue,

  intToTwoHexDigits(value) {

    let number = Number(value)
    return number > 15 ? number.toString(16) : '0' + number.toString(16)

  },


  intToHexString({ redValue, greenValue, blueValue }) {

    const redHexString = this.intToTwoHexDigits(redValue)
    const greenHexString = this.intToTwoHexDigits(greenValue)
    const blueHexString = this.intToTwoHexDigits(blueValue)

    return '#' + redHexString + greenHexString + blueHexString

  },

  renderCanvas({ redValue, greenValue, blueValue }) {


    const canvas = document.body

    const colorHex = this.intToHexString({ redValue: redValue, greenValue: greenValue, blueValue: blueValue })


    this.redValue = redValue
    this.greenValue = greenValue
    this.blueValue = blueValue

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
    const colorHex = this.intToHexString({ redValue: redValue, greenValue: greenValue, blueValue: blueValue })
    resultTextArea.setAttribute('result-text', colorHex)
  },

  render({ redValue, greenValue, blueValue }) {

    this.renderCanvas({ redValue, greenValue, blueValue })
    this.renderColorTextArea({ redValue, greenValue, blueValue })
    this.renderResultTextArea({ redValue, greenValue, blueValue })
  }

}


view.render({
  redValue: defaultRedValue,
  greenValue: defaultGreenValue,
  blueValue: defaultBlueValue
})



redSlider.addEventListener('input', event => {

  const target = event.target

  view.render({
    redValue: target.value,
    greenValue: view.greenValue,
    blueValue: view.blueValue
  })


})



greenSlider.addEventListener('input', event => {

  const target = event.target

  view.render({
    redValue: view.redValue,
    greenValue: target.value,
    blueValue: view.blueValue
  })

})


blueSlider.addEventListener('input', event => {

  const target = event.target

  view.render({
    redValue: view.redValue,
    greenValue: view.greenValue,
    blueValue: target.value
  })

})





