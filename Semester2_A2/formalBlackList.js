const players = [
    { name: 'Bernard', email: 'bernard@example.com', ticket: 'XL3558' },
    { name: 'Youchi', email: 'youchi@example.com', ticket: 'AH9188' },
    { name: 'Yenting', email: 'yenting@example.com', ticket: 'LO9903' },
    { name: 'Angela', email: 'angela@example.com', ticket: 'HY7212' },
    { name: 'Yvonne', email: 'yvonne@example.com', ticket: 'CH7684' },
    { name: 'Ellen', email: 'ellen@example.com', ticket: 'BB1750' },
    { name: 'Walter', email: 'walter@example.com', ticket: 'EI5724' },
    { name: 'Walter', email: 'walter@example.com', ticket: 'EI5724' },
    { name: 'Tim', email: 'tim@example.com', ticket: 'CK4592' },
    { name: 'Kevin', email: 'kevin@example.com', ticket: 'TT1804' },
    { name: 'Russell', email: 'russell@example.com', ticket: 'SI0305' }
  ]
  const blackList = [
    { name: 'Tim', email: 'tim@example.com', ticket: 'CK4592' },
    { name: 'Walter', email: 'walter@example.com', ticket: 'EI5724' }
  ]
    // write your code
    
    let lengthBlackList = blackList.length
    let blackListEmail = []
    
    // 先在新的陣列放入黑名單中每個人的email
    for (let blackListIndex = 0; blackListIndex < lengthBlackList; blackListIndex++) {
      blackListEmail.push(blackList[blackListIndex]['email'])
    }
    
    
    for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
    
        // 利用存放黑名單的email來比對每個人的email是否一致，若下一個還一致就繼續比對，直到不一致
        while (blackListEmail.includes(players[playerIndex]['email'])) {
    
            // 比對在黑名單的每一個人
            for (let blackListIndex = 0; blackListIndex < lengthBlackList; blackListIndex++) {
  
                // 記錄符合黑名單的人之資料相同數，一開始宣告為1是因為只有email和黑名單的人一致才能進來，
                // 所以可以先宣告為1，接著之後再比對其他屬性的時候，若一樣就+1，直到比完所有屬性
                let samePoint = 1
                for (let property in blackList[blackListIndex]) {
                    
                    // 只比對email以外的屬性
                    if (property !== 'email') {
                        // 記錄相同數
                        samePoint += Number(players[playerIndex][property] === blackList[blackListIndex][property])
                    }
                    
                }
                // 若全相同的話，就刪除這筆，然後跳過黑名單資料比較
                if (samePoint === Object.keys(blackList[blackListIndex]).length) {
                  players.splice(playerIndex, 1)
                  // 將 for (let blackListIndex = 0; ...) 這段迴圈中斷
                  break
                }  
                
            }
    
        }
    }
    
    
    
    
    console.log(players) 