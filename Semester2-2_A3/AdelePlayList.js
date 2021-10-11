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


/* 
  displaySongList(parameter1) 負責在網頁左邊呈現專輯下的每個歌名
  parameter1 要被呈現的專輯物件
*/
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

  /* 當點選到歌曲清單中的項目時 */
  if (target.matches('.nav-link')) {

    /* 取得歌手名稱、歌曲名稱，並搭配提供API的伺服器之URL來重新組一個對應API的網址與該伺服器索取歌詞 */
    const singerName = album.artist
    const songName = target.innerHTML
    const requestURL = `${BASE_URL}${singerName}/${songName}.json`

    /* 利用axios發送非同步請求，然後在panel那邊顯示歌名、歌詞 */
    axios.get(requestURL).then(function (response) {

      const lyrics = response.data.lyrics
      let songContent = ''

      songContent = `
        <h3>${songName}</h3>
        <pre>${lyrics}</pre>
      `
      lyricsPanel.innerHTML = songContent

    })



  }

})

// 在網頁左邊添加專輯下的每個歌名
displaySongList(album)