function createPlayer(name, hp, mp) {
    return {
      name: name,
      hp: hp,
      mp: mp,
      cure: function (hp) {
        // write your code
        const demendMP = hp * 2
        // 自己hp還有剩且mp還足夠補血的話
        if (this.mp >= demendMP && this.hp > 0) {
  
          // 扣掉使用治癒的mp需求量
          this.mp -= demendMP
          // 回血
          this.hp += hp
          // 印出回血資訊
          console.log(`${this.name} HP recovered! (HP=${this.hp}, MP=${this.mp})`)
  
        }
        return 'Change sides.'
      },
      attack: function (enemy) {
        // write your code
        // 自己的hp還有剩的話，可以繼續攻擊
        if (this.hp > 0) {
          // 計算隨機傷害
          const damage = Math.floor(Math.random() * 100) + 1
          // 敵人受到傷害
          enemy.hp = enemy.hp >= damage ? enemy.hp - damage : 0
          // 印出攻擊資訊
          console.log(`${this.name} hit ${enemy.name}.  ${enemy.name} lose ${damage}.`)
  
          if (enemy.hp > 0) {       // 敵人還活著的話
            return `${enemy.name} is still alive. (HP=${enemy.hp})`
          } else {                  // 敵人已經死亡
            console.log(`${enemy.name} is dead.`)
            return 'GAME OVER.'
          }
        }
      }
    }
  }
 
  console.log('====== CREATE PLAYERS ======')
  const magician = createPlayer('Magician', 30, 100)
  const warrior = createPlayer('Warrior', 100, 30)
  console.log(magician) // {name: "Magician", hp: 30, mp: 100}
  console.log(warrior) // {name: "Warrior", hp: 100, mp: 30}
  console.log('====== START FIGHT ======')
  while (warrior.hp > 0 && magician.hp > 0) {
    // 戰士先攻
    console.log(warrior.attack(magician))
  
    console.log(magician.cure(15)) // 固定補血 15 點
    // 魔法師後攻
    if (magician.hp > 0) {
      console.log(magician.attack(warrior))
      console.log(warrior.cure(15)) // 固定補血 15 點
    }
    console.log('======')
  }