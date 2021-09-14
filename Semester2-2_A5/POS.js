// ======= default data =======
const menu = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const totalAmount = document.querySelector("#total-amount");
const button = document.querySelector("#submit-button");

// 菜單資料
let productData = [
  {
    id: "product-1",
    imgUrl:
      "https://images.unsplash.com/photo-1558024920-b41e1887dc32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "馬卡龍",
    price: 90
  },
  {
    id: "product-2",
    imgUrl:
      "https://images.unsplash.com/photo-1560691023-ca1f295a5173?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "草莓",
    price: 60
  },
  {
    id: "product-3",
    imgUrl:
      "https://images.unsplash.com/photo-1568271675068-f76a83a1e2d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "奶茶",
    price: 100
  },
  {
    id: "product-4",
    imgUrl:
      "https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "冰咖啡",
    price: 180
  }
];
// ======= 請從這裡開始 =======

let totalAmountContent = 0

const cartList = productData.map(product => {
  return {
    product: product,
    numProduct: 0
  }
})


const allCardsContent = productData.reduce((previousContent, currentProduct) => {

  let content = `
     
     <div class="col-3">
       <div class="card">
          <img src=${currentProduct.imgUrl} class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${currentProduct.name}</h5>
            <p class="card-text">${currentProduct.price}</p>
            <a href="#" data-id=${currentProduct.id} class="btn btn-primary">加入購物車</a>
          </div>
        </div>
      </div>
    `

  return previousContent + content

}, '')


menu.innerHTML = allCardsContent
cart.innerHTML = ""





/* TODO: */


function calcAllThingsOnCart(productIndex, productPrice) {

  cartList[productIndex].numProduct++
  totalAmountContent += productPrice
  totalAmount.innerHTML = totalAmountContent

}




function addItemToCart(productIndex) {

  const product = productData[productIndex]
  const newListItem = document.createElement('li')

  newListItem.classList.add('list-group-item')
  newListItem.innerHTML = `${product.name} X 1 小計：${product.price}`

  cart.appendChild(newListItem)
  calcAllThingsOnCart(productIndex, product.price)

}





menu.addEventListener('click', event => {
  const target = event.target

  if (target.classList.contains('btn')) {

    const productID = target.dataset.id
    const indexOfProduct = productID.split('-')[1]

    addItemToCart(+(indexOfProduct) - 1)

  }

})


button.addEventListener('click', event => {

  if (totalAmountContent > 0) {
    const billContent = `總金額：${totalAmountContent}`
    alert(`感謝購買\n${billContent}`)

    totalAmount.innerHTML = ""
    cart.innerHTML = ""

    totalAmountContent = 0

    cartList.forEach(item => {
      item.numProduct = 0
    })
  }

})