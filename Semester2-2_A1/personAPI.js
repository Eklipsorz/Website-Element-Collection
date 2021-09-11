let button = document.querySelector('.btn')
let dataPanel = document.querySelector('#data-panel')



button.addEventListener('click', function (event) {

  axios.get('https://randomuser.me/api/')
    .then(function (response) {
      // handle success
      const user = response.data.results[0]
      const userName = user.name
      console.log(userName)
      dataPanel.innerHTML = `
      <h3>${userName.first + " " + userName.last} </h3>
      <img src="${user.picture.large}">
      <p>${user.email}</p>
      `
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })

})