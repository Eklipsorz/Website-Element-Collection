
// 定義 API Server 
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'

// 使用 INDEX API
const INDEX_URL = BASE_URL + '/api/v1/users/'



const dataPanel = document.querySelector('#data-panel')

const friendList = []






axios.get(INDEX_URL)
  .then(response => {
    const allFriendData = response.data.results
    friendList.push(...allFriendData)
    console.log(friendList)
    renderFriendList(friendList)
  })
  .catch(error => {
    console.log(error)
  })


function renderFriendList(data) {
  let rawHTML = ''

  data.forEach(item => {



    rawHTML += `
            <div class="col-sm-3">
        <div class="mb-2">
          <!-- cards -->
          <div class="card">
            <img
              src="https://raw.githubusercontent.com/ALPHACamp/movie-list-api/master/public/posters/80PWnSTkygi3QWWmJ3hrAwqvLnO.jpg"
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">Movie title</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal">More</button>
              <button class="btn btn-info btn-show-favorite">+</button>
            </div>
          </div>
        </div>
      </div>
    `


  });

  dataPanel.innerHTML = rawHTML

}