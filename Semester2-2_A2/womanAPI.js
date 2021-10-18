let button = document.querySelector('.btn')
let dataPanel = document.querySelector('#data-panel')
const url = 'https://randomuser.me/api/?gender=female&results=3'

button.addEventListener('click', function (event) {

  axios.get(url).then(function (response) {
    // handle success
    const womanSet = response.data.results

    for (let woman of womanSet) {

      // 使用desturing assignment按照woman物件所擁有的屬性取出來 
      const { email, name, picture } = woman
      // 建立存放名字、照片、電子郵件的框架 
      const personItem = document.createElement('div')

      personItem.classList.add('person-item')

      personItem.innerHTML = `
      <h3>${name.first + " " + name.last} </h3>
      <img src="${picture.large}">
      <p>${email}</p>
      `

      dataPanel.appendChild(personItem)
    }

  }).catch(function (error) {
    // handle error
    console.log(error);
  })

})