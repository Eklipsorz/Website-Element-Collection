
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


function showFriendModal(id) {

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


dataPanel.addEventListener('click', onPanelClicked)