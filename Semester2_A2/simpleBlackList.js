const players = ['Bernard', 'Youchi', 'Yenting', 'Angela', 'Yvonne', 'Ellen', 'Walter', 'Walter', 'Tim', 'Kevin', 'Russell']
const blackList = ['Walter', 'Tim']


// write your code

for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
    // 試著找看看後續有沒有重複人名，若有就繼續刪，沒有就跳過
    while (blackList.includes(players[playerIndex])) {
      // 找到在黑名單的人後刪除，便會更動players內容，
      // 而playerIndex會是原本被刪的下一筆資料。
      players.splice(playerIndex, 1)
    }

}




console.log(players)