const players = [
    { name: 'Bernard', email: 'bernard@example.com', number: 'XL3558' },
    { name: 'Youchi', email: 'youchi@example.com', number: 'AH9188' },
    { name: 'Yenting', email: 'yenting@example.com', number: 'LO9903' },
    { name: 'Angela', email: 'angela@example.com', number: 'HY7212' },
    { name: 'Yvonne', email: 'yvonne@example.com', number: 'CH7684' },
    { name: 'Ellen', email: 'ellen@example.com', number: 'BB1750' },
    { name: 'Walter', email: 'walter@example.com', number: 'EI5724' },
    { name: 'Kevin', email: 'kevin@example.com', number: 'TT1804' },
    { name: 'Tim', email: 'tim@example.com', number: 'CK4592' },
    { name: 'Russell', email: 'russell@example.com', number: 'SI0305' }
  ]
  
  function drawWinner (players) {
    // write your code here
    let winnerIndex = Math.floor(Math.random() * players.length) 
    let winner = players.splice(winnerIndex, 1)[0]
  
    return `${winner.number} | ${winner.name} | ${winner.email}`
  
  }
  
  console.log(drawWinner(players))
  console.log(drawWinner(players))
  console.log(drawWinner(players))
  console.log(drawWinner(players))
  console.log(drawWinner(players))