let players = [
    { name: '櫻木花道', pts: 0, reb: 0, ast: 0, stl: 0, blk: 2 },
    { name: '流川楓', pts: 30, reb: 6, ast: 3, stl: 3, blk: 0 },
    { name: '赤木剛憲', pts: 16, reb: 10, ast: 0, stl: 0, blk: 5 },
    { name: '宮城良田', pts: 6, reb: 0, ast: 7, stl: 6, blk: 0 },
    { name: '三井壽', pts: 21, reb: 4, ast: 3, stl: 0, blk: 0 }
  ]
  
const dataPanel = document.querySelector('#data-panel')
  

  // write your code here
function displayPlayerList (players) {
      let htmlContent = ``


      players.forEach( player => {

          htmlContent += `
              <tr>
          `
       
          for (let key in player) {
        
                if (isNaN(player[key])) {
                  htmlContent += `
                      <td>${player[key]}</td>
                  `
                } else {
                  htmlContent += `
                        <td>
                            <span style="font-size: 25px">${player[key]}</span>
                            <i class="fa fa-plus-circle up"></i>
                            <i class="fa fa-minus-circle down"></i>
                        </td>
                  `
                }

          }

          htmlContent += `
              </tr>
          `

      });

      dataPanel.innerHTML = htmlContent
}

dataPanel.addEventListener('click', function (event) {
    let target = event.targe
    let dataCell = target.parentElement
    
    if (target.classList.contains('fa-plus-circle')) {
        let score = +(dataCell.children[0].innerHTML)
        dataCell.children[0].innerHTML = '' + (score + 1)
    } else if (target.classList.contains('fa-minus-circle')) {
        let score = +(dataCell.children[0].innerHTML)
        dataCell.children[0].innerHTML = '' + (score - 1)
    }

    
})

  
  displayPlayerList(players)