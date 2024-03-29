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

function isBadCommentId(badCommentId, Id) {
  return badCommentId === Id
}


// 假設一開始只有一筆badCommentId的話，其badCommentId會是以數字型別，而非陣列
// 若指定多筆badCommentId的話，其badCommentId勢必會是以陣列形式來進行。
// 在這段會一律會統一用陣列的形式來儲存單筆badCommentId或者多筆badCommentId
const badCommentIdArray = Array.isArray(badCommentId) ? badCommentId : [1].fill(badCommentId)

// 過濾出黑名單評論的評論
const filteredComments = comments.filter(comment => {
  return !badCommentIdArray.includes(comment.id)
})

renderComments(filteredComments)  // 有需要的話可以更動參數