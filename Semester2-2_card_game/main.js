const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]

const view = {


  getCardContent(index) {

    const number = this.transferNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]


    return `
      <div class="card">
        <p>${number}</p>
        <img src=${symbol} alt="">
        <p>${number}</p>
      </div>
    `
  },

  displayCard(index) {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = this.getCardContent(index)

  },

  transferNumber(number) {

    switch (number) {

      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return '' + number
    }


  }

}

view.displayCard(41)

console.log(Array(52))