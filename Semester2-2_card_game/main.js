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

  flipCards(...cards) {

    cards.map(card => {
      if (card.classList.contains('back')) {
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(+(card.dataset.index))
        return
      }

      card.classList.add('back')
      card.innerHTML = null
    })


  },

  pairCards(...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })

  },

  renderScore(score) {
    document.querySelector('.score').innerHTML = `Score: ${score}`
  },

  renderTriedTimes(times) {
    document.querySelector('.tried').innerHTML = `You've tried: ${times} times`
  },

  appendWrongAnimation(...cards) {

    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', event => {
        card.classList.remove('wrong')
      }, { once: true })

    })

  }

}


const model = {


  score: 0,
  triedTimes: 0,
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
        view.flipCards(card)
        model.revealedCards.push(card)
        break
      case GAME_STATE.SecondCardAwaits:


        // 翻第二張牌
        view.flipCards(card)
        // 將第二張牌存入model
        model.revealedCards.push(card)

        view.renderTriedTimes(++model.triedTimes)

        if (model.isRevealedCardsMatched()) {
          // 配對成功
          console.log('matched')


          this.currentState = GAME_STATE.CardsMatched

          // 增加分數
          view.renderScore(model.score += 10)

          // 一樣的牌設定不同樣式
          view.pairCards(...model.revealedCards)
          model.revealedCards = []



          this.currentState = GAME_STATE.FirstCardAwaits

        } else {
          // 配對失敗
          console.log('matched failed')

          this.currentState = GAME_STATE.CardsMatchFailed

          // 不建議放到setTimeout後面
          view.appendWrongAnimation(...model.revealedCards)


          // 給予玩家一秒的時間去記憶牌
          setTimeout(this.resetCards, 1000)

        }

        break
    }
    // view.flipCard(card)
    console.log('current state: ' + this.currentState)
    console.log('current revealedCards: ', model.revealedCards)


  },

  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits


  }



}

controller.generateCards()

document.querySelectorAll('.card').forEach(card => {

  card.addEventListener('click', event => {
    controller.dispatchCardAction(card)

  })

})
