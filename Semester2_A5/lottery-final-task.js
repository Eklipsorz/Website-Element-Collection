// DATA /////////////////////////////////////

const players = [
    { name: 'Bernard', email: 'bernard@example.com' },
    { name: 'Youchi', email: 'youchi@example.com' },
    { name: 'Yenting', email: 'yenting@example.com' },
    { name: 'Angela', email: 'angela@example.com' },
    { name: 'Yvonne', email: 'yvonne@example.com' },
    { name: 'Ellen', email: 'ellen@example.com' },
    { name: 'Walter', email: 'walter@example.com' },
    { name: 'Kevin', email: 'kevin@example.com' },
    { name: 'Tim', email: 'tim@example.com' },
    { name: 'Russell', email: 'russell@example.com' }
  ]
  
  // FUNCTIONS /////////////////////////////////////
  // drawWiner -> announceMsg
  function drawWinner (players, prize) {
    // write your code here
    let winnerIndex = Math.floor(Math.random() * players.length) 
    let winner = players.splice(winnerIndex, 1)[0]
  
    announceMsg(winner, prize)
  }
  
  function announceMsg (winner, prize) {
    // 請新增 encodeName 和 encodeEmail 函式進行字串處理 
    console.log(`${winner.number} | ${encodeName(winner.name)} | ${encodeEmail(winner.email)} | ${prize}`)
  }
  
  // add more functions here
  
  function encodeName (name) {
    return  name.substr(0,2) + '*'.repeat(name.length - 2)
  }
  
  function encodeEmail (email) {
    // 請封裝你之前寫好的程式碼，並設計必要參數
  
  // find index of '@' sign and that index is just length of name part
      let indexOfAtSign = email.indexOf('@') 
  
  // obtain half length of name part
      let halfLengthOfUserName = Math.floor(indexOfAtSign / 2)
  
  // generate new emailUserName with '*'
      let emailUserName = email.slice(0, halfLengthOfUserName) + '.'.repeat(indexOfAtSign - halfLengthOfUserName) 
  
  // get email suffix part
      let emailSuffix = email.slice(indexOfAtSign, email.length)
  
      return emailUserName + emailSuffix
  // combine new emailUserName with emailSuffix
  }
  
  function generateTicketNumber(players, literalLength, digitLength) {
  
      let ticketSet = []  
  
      for (let player of players) {        
          let ticketNumber
  
          do {
              
              ticketNumber = ''
  
              for (let round = 0; round < literalLength; round++) {
                  ticketNumber += String.fromCharCode(Math.floor(Math.random() * 26) + 65)
              }
             
              for (let round = 0; round < digitLength; round++) {
                  ticketNumber += Math.floor(Math.random() * 10)
              }
    
          } while (ticketSet.includes(ticketNumber))
          
          player.number = ticketNumber
      }
  
  
  
  }
  
  
  
  // EXECUTING /////////////////////////////////////
  // each player gets a lottery ticket
  // write your code here
  generateTicketNumber(players, 2, 4)
  
  
  
  // draw 3 winners and announce the results
  drawWinner(players, '頭獎')
  drawWinner(players, '貮獎')
  drawWinner(players, '叁獎')
  
  // the rest of players get participation award
  // write your code here
  
  for (let restPlayer of players) {
    announceMsg(restPlayer, '參加獎')
  }