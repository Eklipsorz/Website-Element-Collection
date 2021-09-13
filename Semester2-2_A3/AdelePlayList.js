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
const activeItemIndex = 0
const tracks = album.tracks

/* 設定一開始預設被點擊的項目 */
const activeItem = tracks[activeItemIndex]

/* 從歌曲項目中移除預設被點擊的項目 */
const inactiveTrackList = tracks.filter((track) => {
  return track !== tracks[activeItemIndex]
})

/* 增加預設被點擊的項目至畫面中 */
addSongList(activeItem, true)


/* 增加剩餘項目至畫面中 */
for (let track of inactiveTrackList) {
  addSongList(track, false)
}








function addSongList(track, isActiveItem) {
  /* 建立歌曲項目以及對應連結 */
  const songListItem = document.createElement('li')
  const songListItemLink = document.createElement('a')


  /* 替項目、連結增加樣式 */
  songListItem.classList.add('nav-item')
  songListItemLink.classList.add('nav-link')

  if (isActiveItem) {
    songListItemLink.classList.add('active')
  }

  /* 設定連結內容並將連結本身設定給項目當作其內容 */
  songListItemLink.innerHTML = track
  songListItem.append(songListItemLink)

  songList.append(songListItem)


}