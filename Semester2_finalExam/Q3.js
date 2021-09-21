//////// 在這裡寫你的答案 /////////
function toRoman(value) {

  const number = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000]
  const symbol = ['I', 'IV', 'V', 'IX', 'X', 'XL', 'L',
    'XC', 'C', 'CD', 'D', 'CM', 'M']

  let index = +(value >= 100) * 12 || +(value >= 10) * 7 || 3
  let decimalNum = value
  let romanNum = ''

  while (decimalNum) {

    let divisor = Math.floor(decimalNum / number[index])
    decimalNum %= number[index]

    while (divisor--) {
      romanNum += symbol[index]
    }

    index--
  }

  return romanNum
}
console.log(toRoman(9))
// expect('toRoman(48)', toRoman(48), 'XLVIII');
// expect('toRoman(59)', toRoman(59), 'LIX');


//////// 以下是測試程式，請勿更動 /////////
// const expect = (name, value, result) => {
//   if (value === result) { return true; }

//   throw new Error(`${name} failed successfully`);
// };

// expect('toRoman(1)', toRoman(1), 'I');
// expect('toRoman(2)', toRoman(2), 'II');
// expect('toRoman(3)', toRoman(3), 'III');
// expect('toRoman(4)', toRoman(4), 'IV');
// expect('toRoman(5)', toRoman(5), 'V');
// expect('toRoman(6)', toRoman(6), 'VI');
// expect('toRoman(9)', toRoman(9), 'IX');
// expect('toRoman(27)', toRoman(27), 'XXVII');
// expect('toRoman(48)', toRoman(48), 'XLVIII');
// expect('toRoman(59)', toRoman(59), 'LIX');
// expect('toRoman(93)', toRoman(93), 'XCIII');
// expect('toRoman(141)', toRoman(141), 'CXLI');
// expect('toRoman(163)', toRoman(163), 'CLXIII');
// expect('toRoman(402)', toRoman(402), 'CDII');
// expect('toRoman(575)', toRoman(575), 'DLXXV');
// expect('toRoman(911)', toRoman(911), 'CMXI');
// expect('toRoman(1024)', toRoman(1024), 'MXXIV');
// expect('toRoman(3000)', toRoman(3000), 'MMM');
// console.log(toRoman(10))




// console.log('all pass!');