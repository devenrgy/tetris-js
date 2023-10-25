export default class Records {
  tableBody = document.querySelector('.records__table tbody')

  constructor() {
    this.records = JSON.parse(localStorage.getItem('records')) ?? []

    this.updateRecordsTable()
  }

  get players() {
    return this.records
  }

  updateRecordsTable() {
    this.tableBody.innerHTML = ''

    const trHeader = document.createElement('tr')
    const thPlayers = document.createElement('th')
    const thScores = document.createElement('th')

    thPlayers.textContent = 'Players'
    thScores.textContent = 'Scores'

    trHeader.append(thPlayers, thScores)

    this.tableBody.append(trHeader)

    this.records.map((player, i) => {
      if (i < 10) {
        const tr = document.createElement('tr')
        const tdName = document.createElement('td')
        const tdScores = document.createElement('td')

        tdName.textContent = player.playerName
        tdScores.textContent = player.score

        tr.append(tdName, tdScores)

        this.tableBody.append(tr)
      }
    })
  }

  addPlayerRecord(player) {
    this.records.unshift(player)
  }

  deletePlayerRecord({ name }) {
    this.records = this.records.filter((players) => players.name !== name)
  }
}
