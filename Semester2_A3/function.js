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
  
  // 呼叫函式
  console.log(encodeName('Bernard'))  // Be*****
  console.log(encodeName('Youchi'))  // Yo****
  console.log(encodeName('Yenting'))  // Ye*****
  
  console.log(encodeEmail('bernard@example.com'))  // ber...@example.com
  console.log(encodeEmail('youchi@example.com'))  // you...@example.com
  console.log(encodeEmail('yenting@example.com'))  // yen...@example.com