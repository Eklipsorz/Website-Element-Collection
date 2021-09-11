//////// 在這裡寫你的答案 /////////
function findLongestWord(sentence) {

  // Step1: 將句子當中的單字找出來放到陣列當中
  const stringArray = sentence.split(' ')
  let longestWord = ''
  let maxLength = 0
  let indexOfLongestWord = 0

  // Step2: 找出長度最長的單字

  for (let index = 0; index < stringArray.length; index++) {

    if (stringArray[index].length > maxLength) {
      maxLength = stringArray[index].length
      indexOfLongestWord = index
    }
  }

  longestWord = stringArray[indexOfLongestWord]

  return longestWord
}





//////// 以下是測試程式，請勿更動 /////////
const expect = (name, value, result) => {
  if (value === result) { return true; }

  throw new Error(`${name} failed successfully`);
};

expect('This is an apple', findLongestWord('This is an apple'), 'apple');
expect('Good morning everybody', findLongestWord('Good morning everybody'), 'everybody');
expect('Please prepare your book', findLongestWord('Please prepare your book'), 'prepare');
expect('Gone with the wind', findLongestWord('Gone with the wind'), 'Gone');

console.log('all pass!');