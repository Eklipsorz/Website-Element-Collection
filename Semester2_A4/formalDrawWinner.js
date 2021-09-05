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
  
  
  function encodeName (name) {
    // 請封裝你之前寫好的程式碼，並設計必要參數
    return  name.substr(0,2) + '*'.repeat(name.length - 2)
  }
  
  function encodeEmail (email) {
    // 請封裝你之前寫好的程式碼，並設計必要參數
  
  // find index of '@' sign and that index is just length of name part
      let indexOfAtSign = email.indexOf('@') 
  
  // obtain half length of name part
      let halfLengthOfUserName = Math.floor(indexOfAtSign / 2)
  
  // generate new emailUserName with '*'
      let emailUserName = email.slice(0, halfLengthOfUserName) + '*'.repeat(indexOfAtSign - halfLengthOfUserName) 
  
  // get email suffix part
      let emailSuffix = email.slice(indexOfAtSign, email.length)
  
      return emailUserName + emailSuffix
  // combine new emailUserName with emailSuffix
  }
  
  console.log(drawWinner(players))
  console.log(drawWinner(players))
  console.log(drawWinner(players))
  console.log(drawWinner(players))
  console.log(drawWinner(players))