const form = document.getElementById('form')
const input = document.getElementById('input')

form.addEventListener('submit', (event) => {
  event.preventDefault()
  let name = input.value
  form.innerHTML = `<h3 class="display-3">Hi, ${name}</h3>`
})

