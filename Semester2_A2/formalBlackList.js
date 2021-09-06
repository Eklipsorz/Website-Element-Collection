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
    
    // 該程式是以”name、email、ticket皆和黑名單顯示的資料一樣“的標準來挑出在黑名單的人



    // 比對抽獎者名單的每一個人是否在黑名單中
    for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
    
    
        // 用黑名單的每一個人來比對目前所選定的人
        for (let blackListIndex = 0; blackListIndex < blackList.length; blackListIndex++) {
  
    
            // 利用isSame變數來表示目前所選定的人所擁有的資料是否和黑名單的人一樣，若一樣為true；若不一樣則為false
            // 預設該變數為true
            let isSame = true  
            // 比對黑名單的人所擁有的資料是否目前所選定人的所擁有的資料一樣
            for (let property in blackList[blackListIndex]) {

                 
                // 若不一樣則不把目前所選的人當成黑名單的人，直接設定isSame為false並跳出
                if (players[playerIndex][property] !== blackList[blackListIndex][property]) {
                    // 記錄相同數
                    isSame = false
                    break
                }
                
            }

            // isSame為true時，表示目前選定的人就是按照標準所挑出的(在黑名單出現的)人
            if (isSame === true) {
                players.splice(playerIndex, 1)
                // 由於刪除後的index就是原本被刪除的元素之後一個元素，所以必須扣1
                playerIndex--
                break
            }  
                
        }
    
       
    }
    
    
    
    
    console.log(players) 