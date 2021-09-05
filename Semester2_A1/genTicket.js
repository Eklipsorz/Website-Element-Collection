let ticket=''


// Math.floor(Math.random() * 26) + 65
// 上式利用ASCII碼直接轉換成大寫字母，其碼範圍為十進制的65~90
// Math.floor(Math.random() * 26) 產生0~25數值範圍
// 然後在這個基礎上添加65就能產生65~90的數值範圍


// 產生前面兩個大寫英文，並附加在抽獎券號碼之後
for (let round = 0; round < 2; round++) {
  // fromCharCode能根據ASCII將十進制數字轉換對應字元
  ticket += String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}


// 產生後面四個數字，並附加在抽獎券號碼之後
for (let round = 0; round < 4; round++) {
  ticket += Math.floor(Math.random() * 10)
}


console.log(ticket)




