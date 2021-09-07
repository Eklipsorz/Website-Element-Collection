// input
let name = 'Bernard'

// write your code
// 先取出前兩個字元，剩下字元按照原本字元數來填入*
name = name.substr(0, 2) + '*'.repeat(name.length - 2)

// output
console.log(name)