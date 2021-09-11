let showDog = document.querySelector('#showRandomDog')

axios.get('https://dog.ceo/api/breeds/image/random')
  .then(function (response) {
    // handle success
    showDog.src = response.data.message
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });