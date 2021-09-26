//////// 在這裡寫你的答案 /////////
function toRoman(value) {

  // 演算法：
  // 先窮舉每個位數上對應羅馬數字是為何，比如1000~3000、100~900、10~90、1~9
  // 再試著用羅馬數字組成規則來看這些位數若獨立結合的話是否會違反，比如對應1000的羅馬
  // 數字和對應500的羅馬數字結合在一起用是否違反，但結果是都不違反。因此基於這個事實，
  // 可以將number和symbol窮舉成1000~3000、100~900、10~90、1~9以及對應羅馬數字符號，
  // 並直接對應結合就解答，在這裡為了縮減這兩個陣列所佔的空間以及滿足羅馬數字的轉換規則，
  // 濃縮成以下形式：
  // 1、4、5、9、10、40、50、90、100、400、500、900、1000
  // 一開始會先從number和symbol找出離value較近且比value還小的數字所擁有的索引值index
  // ，以及宣告一個空字串romanNum，接著試著用value / number[index]來來當作放入
  // symbol[index]至romanNum的次數，處理完之後便直接用number[index]來餘除以達到換次高
  // 位數或者將數值切割成對應數值和剩下數值進行處理，接著將index往前，同樣地，而餘除結果會進
  // 行著相同的除法、餘除、index往前，而這個動作會一直持續，直到換下一個餘除結果為0才會停

  // 根據窮舉法以及羅馬數字的規則來決定如何對應數字和符號
  const number = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000]
  const symbol = ['I', 'IV', 'V', 'IX', 'X', 'XL', 'L',
    'XC', 'C', 'CD', 'D', 'CM', 'M']



  // 找出離value較近且比value還小的數字所擁有的索引值index
  let index = +(value >= 100) * 12 || +(value >= 10) * 7 || 3
  let decimalNum = value
  let romanNum = ''

  // 當數值為0時就表示，已經完成對應符號的處理
  while (decimalNum) {

    // 獲取當下數值能跟目前number對應的數字換多少個對應符號，即次數
    let divisor = Math.floor(decimalNum / number[index])

    // 換次高位數或者將數值切割成對應數值和剩下數值來處理
    decimalNum %= number[index]

    // 根據數值來產生對應符號
    while (divisor--) {
      romanNum += symbol[index]
    }

    // 處理完就將number和symbol的索引值往前
    index--
  }

  return romanNum
}

// expect('toRoman(48)', toRoman(48), 'XLVIII');
// expect('toRoman(59)', toRoman(59), 'LIX');


//////// 以下是測試程式，請勿更動 /////////
const expect = (name, value, result) => {
  if (value === result) { return true; }

  throw new Error(`${name} failed successfully`);
};

expect('toRoman(1)', toRoman(1), 'I');
expect('toRoman(2)', toRoman(2), 'II');
expect('toRoman(3)', toRoman(3), 'III');
expect('toRoman(4)', toRoman(4), 'IV');
expect('toRoman(5)', toRoman(5), 'V');
expect('toRoman(6)', toRoman(6), 'VI');
expect('toRoman(9)', toRoman(9), 'IX');
expect('toRoman(27)', toRoman(27), 'XXVII');
expect('toRoman(48)', toRoman(48), 'XLVIII');
expect('toRoman(59)', toRoman(59), 'LIX');
expect('toRoman(93)', toRoman(93), 'XCIII');
expect('toRoman(141)', toRoman(141), 'CXLI');
expect('toRoman(163)', toRoman(163), 'CLXIII');
expect('toRoman(402)', toRoman(402), 'CDII');
expect('toRoman(575)', toRoman(575), 'DLXXV');
expect('toRoman(911)', toRoman(911), 'CMXI');
expect('toRoman(1024)', toRoman(1024), 'MXXIV');
expect('toRoman(3000)', toRoman(3000), 'MMM');
console.log(toRoman(10))




console.log('all pass!');