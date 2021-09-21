const redSlider = document.querySelector('#red-slider')
const greenSlider = document.querySelector('#green-slider')
const blueSlider = document.querySelector('#blue-slider')



const view = {

  redValue: 0,
  greenValue: 0,
  blueValue: 0,

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
    console.log(colorHex)

    this.redValue = redValue
    this.greenValue = greenValue
    this.blueValue = blueValue

    canvas.style.background = colorHex


  }

}

redSlider.addEventListener('input', event => {

  const target = event.target

  view.renderCanvas({
    redValue: target.value,
    greenValue: view.greenValue,
    blueValue: view.blueValue
  })

})



greenSlider.addEventListener('input', event => {

  const target = event.target

  view.renderCanvas({
    redValue: view.redValue,
    greenValue: target.value,
    blueValue: view.blueValue
  })

})


blueSlider.addEventListener('input', event => {

  const target = event.target

  view.renderCanvas({
    redValue: view.redValue,
    greenValue: view.redValue,
    blueValue: target.value
  })

})

view.renderCanvas({ redValue: 255, greenValue: 255, blueValue: 255 })



