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
document.onkeydown = checkKey


// Other Constants
const blocksList = [{name: 'orange-ricky',
                    position: [5, 13, 14, 15]}, 
                    {name: 'blue-ricky',
                    position: [3, 13, 14, 15]}, 
                    {name: 'hero',
                    position: [3, 4, 5, 6]},
                    {name: 'teewee',
                    position: [4, 13, 14, 15]},
                    {name: 'smashboy',
                    position: [4, 5, 14, 15]},
                    {name: 'cleveland-z',
                    position: [3, 4, 14, 15]},
                    {name: 'rhode-island-z',
                    position: [4, 5, 13, 14]}
                    ]

// Tracking Variables
let activeBlock = {name: '',
                position: []}
let downSpeed = 1000

// Functions
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

    newBlockSelector()
    renderBlock()
    
    moveAutoDown()
}

function newBlockSelector() {
    let blockRNG = Math.floor(Math.random() * 7)
    activeBlock = blocksList[blockRNG]    
}

function renderBlock(oldPosition = [...activeBlock.position]) {
    let positionOverlap = oldPosition.filter(num => {
        return activeBlock.position.indexOf(num) !== -1
    })

    console.log(positionOverlap)

    // Clear out blocks that should be emptied
    let oldGrids = oldPosition.filter(num => {
        return positionOverlap.indexOf(num) === -1
    })

    oldGrids.forEach(num => {
        tetrisGrids[num].classList = ['tetris-grid']
    })


    activeBlock.position.forEach(num => {
        tetrisGrids[num].classList.add(activeBlock.name, 'active');
    })
}

function moveLeft() {
    let oldPosition = [...activeBlock.position]
    let leftEdge = oldPosition.some(num => {
        return num % 10 == 0
    })

    if (leftEdge != true) {
        activeBlock.position.forEach((num, index) => {
            activeBlock.position[index] -= 1
        })
        renderBlock(oldPosition)
    }
}

function moveRight() {
    let oldPosition = [...activeBlock.position]
    let rightEdge = oldPosition.some(num => {
        return (num + 1) % 10 == 0
    })

    if (rightEdge != true) {
        activeBlock.position.forEach((num, index) => {
            activeBlock.position[index] += 1
        })
        renderBlock(oldPosition)
    }
}

function moveDown() {
    let oldPosition = [...activeBlock.position]
    let bottomEdge = oldPosition.some(num => {
        return (num >= 190) || ((tetrisGrids[num + 10].classList.contains('filled')) === true)
    })

    if (bottomEdge != true) {
        activeBlock.position.forEach((num, index) => {
            activeBlock.position[index] += 10
        })
        renderBlock(oldPosition)
    }
}

function moveAutoDown() {
    let oldPosition = [...activeBlock.position]
    let bottomEdge = oldPosition.some(num => {
        return (num >= 190) || ((tetrisGrids[num + 10].classList.contains('filled')) === true)
    })
    console.log('run')

    let downInterval = setInterval(function() {
        activeBlock.position.forEach((num, index) => {
            activeBlock.position[index] += 10
        })

        console.log('timeout')

        renderBlock(oldPosition)
        oldPosition = [...activeBlock.position]

        bottomEdge = oldPosition.some(num => {
            return (num >= 190) || ((tetrisGrids[num + 10].classList.contains('filled')) === true)
        });

        (bottomEdge === true && clearInterval(downInterval))
    }, downSpeed)
    
    if (bottomEdge === true) {
        activeBlock.position.forEach((num) => {
            tetrisGrids[num].classList.add('filled')
        })
    }
}

function checkKey(e) {
    e = e || window.event

    if (e.keyCode == '37') {
        moveLeft()
    }
}