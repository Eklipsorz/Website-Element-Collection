// DEFAULT CODE ////////////////////////
const BASE_URL = 'https://lyric-api-403c0.firebaseio.com/'
const songList = document.querySelector('#song-list')
const lyricsPanel = document.querySelector('#lyrics-panel')
const album = {
  artist: 'Adele',
  album: '25',
  tracks: [
    'Hello',
    'Send My Love (To Your New Lover)',
    'I Miss You',
    'When We Were Young',
    'Remedy',
    'Water Under the Bridge',
    'River Lea',
    'Love in the Dark',
    'Million Years Ago',
    'All I Ask',
    'Sweetest Devotion'
  ]
}

// WRITE YOUR CODE ////////////////////////


/* 印出左欄歌曲項目 */
function displaySongList(album) {

  let songListContent = ''

  for (let track of album.tracks) {
    songListContent += `
    <li class="nav-item">
      <a class="nav-link" data-toggle="pill" href="#" role="tab">${track}</a>
    </li>
    `
  }

  songList.innerHTML = songListContent
}


/* 設定左欄項目清單的點擊事件 */
songList.addEventListener('click', (event) => {

  const target = event.target


  if (target.matches('.nav-link')) {

    const singerName = album.artist
    const songName = target.innerHTML

    const requestURL = BASE_URL + singerName + "/" + songName + ".json"
    console.log(requestURL)
    axios.get(requestURL).then(function (response) {

      console.log(response.data)

    })



  }

})

displaySongList(album)