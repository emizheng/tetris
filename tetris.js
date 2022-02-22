const introWrapEl = document.getElementById('intro-wrap')
const introNameInput = document.getElementById('intro-name-input')
const gameplayWrapEl = document.getElementById('tetris-gameplay-wrap')
const gameplayNameEl = document.getElementById('name-display')

// List of Elements
const holdGrids = document.querySelectorAll('.hold-grid')
const nextGrids = document.querySelectorAll('.next-grid')
const tetrisGrids = document.querySelectorAll('.tetris-grid')

// Buttons
const startBtn = document.getElementById('start-btn')


// Event Listeners
startBtn.addEventListener('click', startGame)

// Other Constants
const blocksList = [{name: 'orange-ricky',
                    startingPosition: [5, 13, 14, 15],
                    color: '#ffb380'}, 
                    {name: 'blue-ricky',
                    startingPosition: [3, 13, 14, 15],
                    color: '#189AB4'}, 
                    {name: 'hero',
                    startingPosition: [3, 4, 5, 6],
                    }]

const blocksList = ['orange-ricky', 'blue-ricky', 'hero', 'teewee', 'smashboy', 'cleveland-z', 'rhode-island-z']
const startingPositions = [[5, 13, 14, 15], [3, 13, 14, 15], [3, 4, 5, 6], [4, 13, 14, 15], [4, 5, 14, 15], [3, 4, 14, 15], [4, 5, 13, 14]]

function startGame() {
    var username = introNameInput.value
    introWrapEl.classList.remove('show')
    holdGrids.forEach(holdGrid => {
        holdGrid.classList = ['hold-grid']
    })

    nextGrids.forEach(nextGrid => {
        nextGrid.classList = ['next-grid']
    })

    gameplayWrapEl.classList.add('show')
    gameplayNameEl.innerText += username

    blockFall()
}

function blockFall() {
    let blockRNG = Math.floor(Math.random() * 7)

    startingPositions[blockRNG].forEach(position => {
        tetrisGrids[position].style.backgroundColor = '#ffb380';
        tetrisGrids[position].style.borderColor = 'white';
    })
}

function moveLeft() {

}