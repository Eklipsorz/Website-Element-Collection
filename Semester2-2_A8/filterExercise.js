////// start code, please don't change ///////

let comments = [
  { id: 1, user: "小美", text: "感謝你分享你的心情！" },
  { id: 2, user: "阿明", text: "讀了你的文章我很有共鳴！" },
  { id: 3, user: "路人", text: "共鳴+1" },
  { id: 4, user: "V 怪客", text: "你想跟我一樣開跑車嗎 這是我們上禮拜買的小牛" },
  { id: 5, user: "粉絲", text: "期待下一篇！" }
]

const container = document.querySelector(".container");
const badCommentId = 4

function renderComments(comments) {
  let rawHtml = `
    <table class="table table-sm table-striped table-bordered">
      <thead>
        <tr>
          <th>Id</th>
          <th>留言者</th>
          <th>留言內容</th>
        </tr>
      </thead>
      <tbody>
  `

  for (let i = 0; i < comments.length; i++) {
    rawHtml += `
      <tr>
        <td>${comments[i].id}</td>
        <td>${comments[i].user}</td>
        <td>${comments[i].text}</td>
      </tr>
    `
  }

  rawHtml += `
      </tbody>
    </table>
  `

  container.innerHTML = rawHtml
}

////// 請在以下區域進行修改 ///////



renderComments(comments)  // 有需要的話可以更動參數