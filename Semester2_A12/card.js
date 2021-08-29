
/*  獲取代表名字、自我介紹、圖片、經驗的元素節點 */
let myName = document.querySelector('.my-card > .my-name')
let myInfo = document.querySelector('.my-card > .info')
let myExperience = document.querySelector('.my-card .experience ul')
let myAvatar = document.querySelector('.my-card img')


/*      設定經驗數       */
let myExperienceLength = 3


/*      設定名字       */
myName.innerHTML = 'Orion'
/*      設定自我介紹    */
myInfo.innerHTML = 'Hi!! I\'m a sloth. That\'s it'

/*      設定 myExperienceLength 筆經驗       */
for (let item = 0; item < myExperienceLength; item++) {
    let itemNode = document.createElement('li')
    itemNode.innerHTML = `experience item ${item}`
    myExperience.appendChild(itemNode)
}

/*      設定大頭貼      */
myAvatar.src = "https://res.cloudinary.com/dqfxgtyoi/image/upload/v1628517886/blog/avatar_lbr6dt.jpg"