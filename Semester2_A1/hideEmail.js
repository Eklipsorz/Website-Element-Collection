let email = 'bernard@example.com'
// write your code

// find index of '@' sign and that index is just length of name part
let indexOfAtSign = email.indexOf('@') 

// obtain half length of name part
let halfLengthOfUserName = Math.floor(indexOfAtSign / 2)

// generate new emailUserName with '*'
let emailUserName = email.slice(0, halfLengthOfUserName) + '*'.repeat(indexOfAtSign - halfLengthOfUserName) 

// get email suffix part
let emailSuffix = email.slice(indexOfAtSign, email.length)

// combine new emailUserName with emailSuffix
email = emailUserName + emailSuffix

console.log(email)