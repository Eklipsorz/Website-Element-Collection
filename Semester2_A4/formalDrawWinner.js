const players = [
    { name: 'Bernard', email: 'bernard@example.com', number: 'XL3558' },
    { name: 'Youchi', email: 'youchi@example.com', number: 'AH9188' },
    { name: 'Yenting', email: 'yenting@example.com', number: 'LO9903' },
    { name: 'Angela', email: 'angela@example.com', number: 'HY7212' },
    { name: 'Yvonne', email: 'yvonne@example.com', number: 'CH7684' },
    { name: 'Ellen', email: 'ellen@example.com', number: 'BB1750' },
    { name: 'Walter', email: 'walter@example.com', number: 'EI5724' },
    { name: 'Kevin', email: 'kevin@example.com', number: 'TT1804' },
    { name: 'Tim', email: 'tim@example.com', number: 'CK4592' },
    { name: 'Russell', email: 'russell@example.com', number: 'SI0305' }
  ]
  
  function drawWinner (players) {
    // write your code here
    let winnerIndex = Math.floor(Math.random() * players.length) 
    let winner = players.splice(winnerIndex, 1)[0]
  
  
    let winnerName = encodeName(winner.name)
    let winnerEmail = encodeEmail(winner.email)
  
    return `${winner.number} | ${winnerName} | ${winnerEmail}`
  
  }
 
  
  // encodeName 功能為加密接收到的名字
  // 參數說明： parameter1 是指要被加密的名字
  function encodeName (name) {
    // 以明碼顯示名字前兩個字元，後續字元全用*符號表示
    return  name.substr(0, 2) + '*'.repeat(name.length - 2)
  }
  
  // encodeEmail 功能為加密接收到的email
  // 參數說明： parameter1 是指要被加密的email
  function encodeEmail (email) {
    // 請封裝你之前寫好的程式碼，並設計必要參數

      // 找到@的索引值，而該值剛好是email使用者名稱的字元數
      let indexOfAtSign = email.indexOf('@') 

      // 獲取email使用者名稱的一半字元數。
      let halfLengthOfUserName = Math.floor(indexOfAtSign / 2)

      // 使用 "使用者名稱的一半字元以明碼顯示＋3個.符號＋@＋@後綴字" 來組成加密後的email
      let econdedEmail = email.slice(0, halfLengthOfUserName) + 
                        '.'.repeat(3)                        +
                        email.slice(indexOfAtSign, email.length)

      return econdedEmail
  }
  
  console.log(drawWinner(players))
  console.log(drawWinner(players))
  console.log(drawWinner(players))
  console.log(drawWinner(players))
  console.log(drawWinner(players))