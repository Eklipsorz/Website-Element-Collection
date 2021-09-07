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
  
  // 呼叫函式
  console.log(encodeName('Bernard'))  // Be*****
  console.log(encodeName('Youchi'))  // Yo****
  console.log(encodeName('Yenting'))  // Ye*****
  
  console.log(encodeEmail('bernard@example.com'))  // ber...@example.com
  console.log(encodeEmail('youchi@example.com'))  // you...@example.com
  console.log(encodeEmail('yenting@example.com'))  // yen...@example.com