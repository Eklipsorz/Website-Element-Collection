let playerList = document.querySelector('.table tbody').children


for (let player of playerList) {
    let infoPlayer = player.children
    let scoreString = infoPlayer[1].innerHTML
 
    if (parseInt(scoreString, 10) >= 20) {   
        let newThumbsUpSign = document.createElement('i')
        newThumbsUpSign.classList.add('fa', 'fa-thumbs-up')
        infoPlayer[0].append(newThumbsUpSign)
    }

}