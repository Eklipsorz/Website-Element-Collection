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
// Global Variable ////////////////////////////
let ticketSet = []


// FUNCTIONS /////////////////////////////////////
// drawWiner -> announceMsg

// drawWinner 功能為從抽獎者中抽出一位贏家，並給予特定獎項，最後印出贏家資訊
// 參數說明：parameter1 是指存放所有抽獎者的陣列，parameter2 是指定發放獎項是什麼
function drawWinner (players, prize) {

  // 以亂數來抽獎
  let winnerIndex = Math.floor(Math.random() * players.length) 
  // 按照winnerIndex找到對應的贏家
  let winner = players.splice(winnerIndex, 1)[0]

  // 印出贏家資訊
  announceMsg(winner, prize)
}

// announceMsg 功能為印出贏家資訊、獎項
// 參數說明：parameter1 是指贏家，parameter2 是指定獲取的獎項是什麼
function announceMsg (winner, prize) {
  // 印出贏家資訊、贏家獲取的獎項是為何
  console.log(`${winner.ticket} | ${encodeName(winner.name)} | ${encodeEmail(winner.email)} | ${prize}`)
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

// generateTicketNumber 功能為產生獨立且不重複的抽獎券號碼給抽獎者
// 格式為xxxyyy，xxx代表要填入的英文字母，而yyy代表要填入的數字 
// 參數說明：parameter1~2 是指定抽獎券的號碼格式分別要填多少個英文字母和數字
function generateTicketNumber (literalLength, digitLength) {

    

    // 利用無限迴圈的特性來不斷產生號碼，直到產生出獨立且不重複的號碼為止
    while (true) {
      
        let ticket = ''

        // 產生英文字母來填入號碼裡
        for (let round = 0; round < literalLength; round++) {
            ticket += String.fromCharCode(Math.floor(Math.random() * 26) + 65)
        }

        // 產生數字來填入號碼裡 
        for (let round = 0; round < digitLength; round++) {
            ticket += Math.floor(Math.random() * 10)
        }

        // ticketSet是存放所有已產生且獨立不重複的號碼，用它檢查新產生出來的號碼是否重複
        if (!ticketSet.includes(ticket)) {

            // 將獨立不重複的號碼放到ticketSet
            ticketSet.push(ticket)
            
            return ticket
        }
    }

}



// EXECUTING /////////////////////////////////////
// each player gets a lottery ticket
// write your code here

// 幫每位抽獎者產生一組獨立不重複的抽獎券號碼，號碼預設填入2個大寫英文字母和4個數字
for (let player of players) {
  player['ticket'] = generateTicketNumber(2, 5)
}

console.log(ticketSet)

// draw 3 winners and announce the results
drawWinner(players, '頭獎')
drawWinner(players, '貮獎')
drawWinner(players, '叁獎')

// the rest of players get participation award
// write your code here

for (let player of players) {
  announceMsg(player, '參加獎')
}