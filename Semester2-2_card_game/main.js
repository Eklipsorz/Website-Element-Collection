const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]


const view = {
  /* 顯示牌本身，預設是背面 */
  getCardElement(index) {
    return `<div data-index=${index} class="card back"></div>`
  },

  /* 牌的正面 */
  getCardContent(index) {
    const number = this.transferNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]


    return `
        <p>${number}</p>
        <img src=${symbol} alt="">
        <p>${number}</p>
    `
  },

  displayCards() {
    const rootElement = document.querySelector('#cards')
    console.log(utility.getRandomNumberArray(52))
    rootElement.innerHTML = utility.getRandomNumberArray(52).map(index => this.getCardElement(index)).join("")
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


  },

  flipCard(card) {

    if (card.classList.contains('back')) {
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(+(card.dataset.index))
      return
    }

    card.classList.add('back')
    card.innerHTML = null

  }

}
const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }

    return number
  }

}



view.displayCards()


document.querySelectorAll('.card').forEach(card => {

  card.addEventListener('click', event => {
    view.flipCard(card)
  })

})