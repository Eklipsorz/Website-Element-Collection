const grandpa = document.querySelector('.grandpa')
const parent = document.querySelector('.parent')
const child = document.querySelector('.child')

// bubbling
child.addEventListener('click', function (event) {
  console.log('child is clicked!')
  console.log(this)
  console.log(event.target)
  child.append('click!')
})

parent.addEventListener('click', function (event) {
  console.log('parent is clicked!')
  console.log(this)
  console.log(event.target)
  parent.append('click!')
})

grandpa.addEventListener('click', function (event) {
  console.log('grandpa is clicked!')
  console.log(this)
  console.log(event.target)
  grandpa.append('click!')
})

