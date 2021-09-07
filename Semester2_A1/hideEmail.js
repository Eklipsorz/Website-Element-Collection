let email = 'bernard@example.com'


// 請封裝你之前寫好的程式碼，並設計必要參數

// 找到@的索引值，而該值剛好是email使用者名稱的字元數
let indexOfAtSign = email.indexOf('@') 

// 獲取email使用者名稱的一半字元數。
let halfLengthOfUserName = Math.floor(indexOfAtSign / 2)

// 使用 "使用者名稱的一半字元以明碼顯示＋3個.符號＋@＋@後綴字" 來組成加密後的email
let econdedEmail = email.slice(0, halfLengthOfUserName)     + 
                   '.'.repeat(3)                            +
                   email.slice(indexOfAtSign, email.length)

email = econdedEmail
   
console.log(email)