// 存放所有朋友
const dataPanel = document.querySelector('#data-panel')
// 搜尋表單(包含輸入欄、按鈕)
const searchForm = document.querySelector('#search-form')
// 搜尋表單中的輸入欄
const searchInput = document.querySelector('#search-input')



// 定義 API Server 
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'

// 使用 INDEX API
const INDEX_URL = BASE_URL + '/api/v1/users/'





const friendList = []



axios.get(INDEX_URL)
  .then(response => {
    const allFriendData = response.data.results
    friendList.push(...allFriendData)
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
              src=${item.avatar}
              class="card-img-top card-avatar" alt="Friend Avatar" 
              data-toggle="modal" data-target="#friend-modal"data-id=${item.id}>
            <div class="card-body">
              <h5 class="card-title">${item.name + " " + item.surname}</h5>
            </div>
        
          </div>
        </div>
      </div>
    `


  });

  dataPanel.innerHTML = rawHTML

}

/* FIXME: 會從預設頁面轉換至正確頁面，正確來說是直接正確頁面，而非轉換*/
function showFriendModal(id) {

  console.log(id)

  // <ul class="list-unstyled">
  //   <!-- email -->
  //   <li id="friend-modal-email">email: guillaume.vincent@example.com</li>
  //   <!-- birthday -->
  //   <li id="friend-modal-birthday">birthday: 1995-05-05</li>
  //   <!-- age -->
  //   <li id="friend-modal-age">age: 25</li>
  //   <!-- gender -->
  //   <li id="friend-modal-gender">gender: male</li>
  //   <!-- region -->
  //   <li id="friend-modal-region">region: CH</li>

  const friendName = document.querySelector('#friend-modal-name')
  const friendEmail = document.querySelector('#friend-modal-email')
  const friendBirthDay = document.querySelector('#friend-modal-birthday')
  const friendAge = document.querySelector('#friend-modal-age')
  const friendGender = document.querySelector('#friend-modal-gender')
  const friendRegion = document.querySelector('#friend-modal-region')


  axios.get(INDEX_URL + id)
    .then(response => {
      const data = response.data

      friendName.innerHTML = `${data.name} ${data.surname}`
      friendEmail.innerHTML = `email: ${data.email}`
      friendBirthDay.innerHTML = `birthday: ${data.birthday}`
      friendAge.innerHTM = `$age: ${data.age}`
      friendGender.innerHTML = `gender: ${data.gender}`
      friendRegion.innerHTML = `region: ${data.region}`
    })
    .catch(error => {
      console.log(error)
    })



}


function onPanelClicked(event) {

  const target = event.target

  if (target.matches('.card-avatar')) {


    const friendID = +(target.dataset.id)
    showFriendModal(friendID)

  }

}

function onSearchFormSubmitted(event) {


  event.preventDefault()
  const warningIcon = document.querySelector('#search-form .search-input-warning-icon')


  let filteredFriends = []
  const keyword = searchInput.value.trim().toLowerCase()

  if (keyword.trim() === '') {
    console.log('hi')
    searchInput.style.setProperty('--search-input-border-color', '#FF665A')
    warningIcon.style.setProperty('--search-input-warning-icon-display', ' ')
    return
  }

  filteredFriends = friendList.filter(friend => {
    const fullName = friend.name + " " + friend.surname
    return fullName.trim().toLowerCase().includes(keyword)
  })

  if (!filteredFriends.length) {

    alert(`我們找不到名為${keyword}的朋友，抱歉`)
    return
  }

  renderFriendList(filteredFriends)
}


dataPanel.addEventListener('click', onPanelClicked)

searchForm.addEventListener('submit', onSearchFormSubmitted)



