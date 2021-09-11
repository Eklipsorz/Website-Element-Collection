let button = document.querySelector('button')
let showLyricsList = document.querySelector('#showLyrics')



button.addEventListener('click', function (event) {
  axios.get('https://api.lyrics.ovh/v1/Coldplay/yellow')

    .then(function (response) {
      // handle success
      showLyricsList.innerHTML = response.data.lyrics
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })


})