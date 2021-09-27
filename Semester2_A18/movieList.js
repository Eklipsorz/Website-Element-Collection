// 電影資料
const movies = [{
  title: 'The Avengers',
  image: 'https://bit.ly/2NQOG6H',
  rating: 0
},
{
  title: 'Our Times',
  image: 'https://bit.ly/2OsGmv2',
  rating: 0
},
{
  title: "Aquaman",
  image:
    "https://assets-lighthouse.alphacamp.co/uploads/image/file/15303/AquamanPoster.jpg",
  rating: 0
}]

// 電影清單物件
const dataPanel = document.querySelector('#data-panel')


// function displayMovieList(parameter1) 以parameter1來建立對應的電影表格
// 參數說明：parameter1為要填入的電影清單
function displayMovieList(movies) {


  let htmlContent = `      
            <table class="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Rating</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
  `

  movies.forEach(movie => {
    htmlContent += `
            <tr>
              <td>
                <img src=${movie['image']} width="70" class="img-thumbnail" />
              </td>
              <td>${movie['title']}</td>
              <td>
                <span class="fa fa-thumbs-up"></span>
                <span class="fa fa-thumbs-down px-2"></span>
                <span>${movie['rating']}</span>
              </td>
              <td>
                <button class="btn btn-sm btn-danger">X</button>
              </td>
            </tr>

    `

  });

  htmlContent += `
          </tbody>
      </table>
  `



  return htmlContent
}

// 電影清單以表格來顯示每部電影
dataPanel.innerHTML = displayMovieList(movies)

// 綁定並指定電影清單的點擊事件要做些什麼
dataPanel.addEventListener('click', function (event) {

  const target = event.target

  // 檢測被點擊元件是否為按讚或者按不喜歡
  if (target.matches('.fa-thumbs-up') || target.matches('.fa-thumbs-down')) {

    // 如果是按讚就設定+1，不是就-1
    const isThumbsUp = target.matches('.fa-thumbs-up') ? 1 : -1

    // 取出按讚數並根據isThumbsUp來增加或者減少
    const ratingCell = target.parentElement.lastElementChild
    const score = parseInt(ratingCell.innerHTML, 10) + isThumbsUp

    // 檢測計算分數是否為負值，若是的話，就是0，否則就原始分數
    ratingCell.innerHTML = '' + (score > 0 ? score : 0)
  }


  // 檢測被點擊的元件是否為刪除按鈕
  if (target.matches('.btn-danger')) {
    const movie = target.parentElement.parentElement
    movie.remove()
  }

})