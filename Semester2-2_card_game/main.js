const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}

const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]


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

  displayCards(indexs) {
    const rootElement = document.querySelector('#cards')
    console.log(indexs)
    rootElement.innerHTML = indexs.map(index => this.getCardElement(index)).join("")
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

  },

  pairCard(card) {
    card.classList.add('paired')
  }

}


const model = {
  // 被翻閱的卡片
  revealedCards: [],

  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  }
}

const controller = {

  currentState: GAME_STATE.FirstCardAwaits,

  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },

  dispatchCardAction(card) {
    // 如果點擊的牌是正面的話，就不做任何事情
    if (!card.classList.contains('back')) {
      return
    }

    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        this.currentState = GAME_STATE.SecondCardAwaits
        view.flipCard(card)
        model.revealedCards.push(card)
        break
      case GAME_STATE.SecondCardAwaits:
        // this.currentState = GAME_STATE.
        view.flipCard(card)
        model.revealedCards.push(card)

        if (model.isRevealedCardsMatched()) {
          // 配對成功
          console.log('matched')
          this.currentState = GAME_STATE.CardsMatched
          view.pairCard(model.revealedCards[0])
          view.pairCard(model.revealedCards[1])
          model.revealedCards = []
          this.currentState = GAME_STATE.FirstCardAwaits

        } else {
          // 配對失敗
          console.log('matched failed')

          this.currentState = GAME_STATE.CardsMatchFailed
          // 給予玩家一秒的時間去記憶牌
          setTimeout(() => {
            view.flipCard(model.revealedCards[0])
            view.flipCard(model.revealedCards[1])
            model.revealedCards = []
            this.currentState = GAME_STATE.FirstCardAwaits
          }, 1000)

        }

        break
    }
    // view.flipCard(card)
    console.log('current state: ' + this.currentState)
    console.log('current revealedCards: ', model.revealedCards)


  }



}

controller.generateCards()

document.querySelectorAll('.card').forEach(card => {

  card.addEventListener('click', event => {
    controller.dispatchCardAction(card)
  })

})