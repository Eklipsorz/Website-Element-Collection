const movies = [{
    title: 'The Avengers',
    image: 'https://bit.ly/2NQOG6H',
    rating: 0
  }, 
  {
    title: 'Our Times',
    image: 'https://bit.ly/2OsGmv2',
    rating: 0
  }]


const dataPanel = document.querySelector('#data-panel')


  
function displayMovieList (movies) {
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

  movies.forEach( movie => {
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

dataPanel.innerHTML = displayMovieList(movies)

/* */
dataPanel.addEventListener('click', function (event) {
  let target = event.target
  
  let isClassWeWant = target.matches('.fa-thumbs-up') ? 1 : target.matches('.fa-thumbs-down') ? -1 : 0

  if (isClassWeWant) {
    let ratingCell = target.parentElement.lastElementChild
    let score = parseInt(ratingCell.innerHTML, 10) + isClassWeWant
    ratingCell.innerHTML = '' + (score > 0 ? score : 0)
  }


  if (target.matches('.btn-danger')) {
    let movie = target.parentElement.parentElement
    movie.remove()
  }

})