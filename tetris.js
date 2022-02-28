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
                    position: [5, 13, 15, 14],
                    nextRot: 0,
                    rightRot: [[-20, -10, 1, 0], [1, 0, -1, 9], [-10, 0, -11, 10], [-1, 1, -9, 0]],
                    leftRot: [[-20, -10, -21, 0], [1, 0, -1, 9], [-10, 0, 11, 10], [-1, 1, -9, 0]]}, 
                    {name: 'blue-ricky',
                    position: [3, 13, 14, 15], 
                    nextRot: 0,
                    rightRot: [[-10, -20, 0, -19], [0, -1, 1, 11], [0, -10, 10, 9], [-1, 1, 0, -11]],
                    leftRot: [[-10, -1, 0, -20], [0, 1, -1, 11], [0, -9, 10, -10], [-1, 1, 0, -11]]}, 
                    {name: 'hero',
                    position: [3, 4, 5, 6],
                    nextRot: 0,
                    rightRot: [[20, 10, 0, -10], [-2, -1, 0, 1], [10, 0, -10, -20], [-1, 0, 1, 2]],
                    leftRot: [[20, 10, 0, -10], [-1, 0, 1, 2], [10, 0, -10, -20], [-2, -1, 0, 1]]},
                    {name: 'teewee',
                    position: [4, 13, 14, 15],
                    nextRot: 0,
                    rightRot: [[0, -10, 10, 1], [0, -1, 1, 10], [0, -10, -1, 10], [0, 9, 10, 11]],
                    leftRot: [[0, -10, -1, 10], [0, -1, 1, 10], [0, -10, 1, 10], [0, 9, 10, 11]]},
                    {name: 'smashboy',
                    position: [4, 5, 14, 15],
                    nextRot: 0,
                    rightRot: [[0, 1, 10, 11], [0, 1, 10, 11], [0, 1, 10, 11], [0, 1, 10, 11]],
                    leftRot: [[0, 1, 10, 11], [0, 1, 10, 11], [0, 1, 10, 11], [0, 1, 10, 11]]},
                    {name: 'cleveland-z',
                    position: [3, 4, 14, 15], 
                    nextRot: 0,
                    rightRot: [[-10, 0, -1, 9], [-1, 0, 10, 11], [-10, 0, -1, 9], [-1, 0, 10, 11]],
                    leftRot: [[-9, 0, 1, 10], [-1, 0, 10, 11], [-9, 0, 1, 10], [-1, 0, 10, 11]]},
                    {name: 'rhode-island-z',
                    position: [4, 5, 13, 14],
                    nextRot: 0,
                    rightRot: [[0, -10, 11, 1], [0, 1, 9, 10], [0, -10, 11, 1], [0, 1, 9, 10]],
                    leftRot: [[0, -1, -11, 10], [0, 1, 9, 10], [0, -1, -11, 10], [0, 1, 9, 10]]}]


// Tracking Variables
let oldPosition = []
let activeBlock = {}
let downSpeed = 1000
let bottomEdge = false
let gameEnd = false
let downInterval = null
let intervals = new Set()

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
    
    moveAutoDown('startGame')
}

function placeBlock() {
    activeBlock.position.forEach((num) => {
        if (num >= 0) {
            tetrisGrids[num].classList.remove('active')
            tetrisGrids[num].classList.add('filled')
        }
    })
    bottomEdge = false

    gameEnd = activeBlock.position.some(num => num < 0)
    if (gameEnd === true) {

    } else {
        newBlockSelector()
        renderBlock()
        moveAutoDown('placeBlock')
        console.log('new block')
    }
}


function newBlockSelector() {
    let blockRNG = Math.floor(Math.random() * 7)
    let randomBlock = blocksList[blockRNG]
    activeBlock = {name: randomBlock.name,
                   position: [...randomBlock.position],
                   nextRot: randomBlock.nextRot,
                   rightRot: [...randomBlock.rightRot],
                   leftRot: [...randomBlock.leftRot]}
}

function renderBlock() {
    let positionOverlap = oldPosition.filter(num => {
        return activeBlock.position.indexOf(num) !== -1
    })

    let oldGrids = oldPosition.filter(num => {
        return positionOverlap.indexOf(num) === -1
    })

    oldGrids.forEach(num => {
        if (num >= 0) {
            tetrisGrids[num].classList.remove('active', activeBlock.name)
        }
    })

    activeBlock.position.forEach(num => {
        if (num >= 0) {
            tetrisGrids[num].classList.add(activeBlock.name, 'active');
        }
    })

    checkBottomEdge(activeBlock.position);

    if (bottomEdge === true) {
        console.log('bottom true')
        oldPosition = []
        placeBlock()
    }
}

function rotate(direction) {
    oldPosition = [...activeBlock.position]
    
    let nextRot = []
    if (direction === 'left') {
        nextRot = activeBlock.leftRot[activeBlock.nextRot]
    } else if (direction === 'right') {
        nextRot = activeBlock.rightRot[activeBlock.nextRot]
    }
    
    if (activeBlock.nextRot >= 3) {
        activeBlock.nextRot = 0
    } else {
        activeBlock.nextRot += 1
    }
    
    let axis = activeBlock.position[nextRot.indexOf(0)]
    activeBlock.position.forEach((num, index) => {
        activeBlock.position[index] = axis + nextRot[index]
    })
    
    let oldAvg = (oldPosition.reduce((total, num) => total + (num % 10), 0))/4
    let newAvg = (activeBlock.position.reduce((total, num) => total + (num % 10), 0))/4

    let outBounds = true
    while (outBounds === true){
        outBounds = ((activeBlock.position.some(num => num % 10 === 0)) && (activeBlock.position.some(num => (num + 1) % 10 === 0)))
        if (outBounds === true && newAvg > oldAvg) {
            activeBlock.position.forEach((num, index) => activeBlock.position[index] += 1)
        } else if (outBounds === true && newAvg < oldAvg) {
            activeBlock.position.forEach((num, index) => activeBlock.position[index] -= 1)
        }
    }

    renderBlock()
}

function moveLeft() {
    oldPosition = [...activeBlock.position]
    let leftEdge = oldPosition.some(num => {
        return num % 10 == 0
    })

    if (leftEdge === false) {
        activeBlock.position.forEach((num, index) => {
            activeBlock.position[index] -= 1
        })
        renderBlock()
    }
}

function moveRight() {
    oldPosition = [...activeBlock.position]
    let rightEdge = oldPosition.some(num => {
        return (num + 1) % 10 == 0
    })

    if (rightEdge != true) {
        activeBlock.position.forEach((num, index) => {
            activeBlock.position[index] += 1
        })
        console.log('move right')
        renderBlock()
    }
}

function moveDown() {
    oldPosition = [...activeBlock.position];
    checkBottomEdge(oldPosition);

    if (bottomEdge === false) {
        activeBlock.position.forEach((num, index) => {
            activeBlock.position[index] += 20
        })
        console.log('move down')
        renderBlock()
    }
}


function moveAutoDown(message) {
    oldPosition = [...activeBlock.position];
    checkBottomEdge(oldPosition)

    
    let iter = 0

    downInterval = setInterval(function() {
        if (bottomEdge === false && iter < 18) {
            activeBlock.position.forEach((num, index) => {
                activeBlock.position[index] += 10
            })
            renderBlock()
        }

        oldPosition = [...activeBlock.position];
        checkBottomEdge(oldPosition);
        console.log(`${message}: ${iter} | ${intervals} | ${downInterval}`);

        iter++;
        
        (bottomEdge === true && clearInterval(downInterval) && intervals.add(downInterval));
    }, downSpeed);
    

    console.log(`end intervals for ${message}`)
    
    if (bottomEdge === true) {
        placeBlock()
    }
}

function dropBlock() {
    oldPosition = [...activeBlock.position]
    bottomEdge = oldPosition.some(num => {
        return (num >= 190) || ((tetrisGrids[num + 10].classList.contains('filled')) === true)
    })
    do {
        bottomEdge = activeBlock.position.some(num => {
            return (num >= 190) || ((tetrisGrids[num + 10].classList.contains('filled')) === true)
        }) 
        if (bottomEdge === false) {
            activeBlock.position.forEach((num, index) => {
                activeBlock.position[index] += 10
            })
        }
    } 
    while (bottomEdge === false)

    renderBlock()
}

function checkKey(e) {
    if (e.keyCode == '37') {
        moveLeft()
    } else if (e.keyCode == '39') {
        moveRight()
    } else if (e.keyCode == '38') {
        rotate("right")
    } else if (e.keyCode == '90') {
        rotate("left")
    } else if (e.keyCode == '40') {
        moveDown()
    } else if (e.keyCode == '32') {
        dropBlock()
    }
}

function checkBottomEdge (position) {
    bottomEdge = position.some(num => {
        return (num >= 190) || ((tetrisGrids[num + 10].classList.contains('filled')) === true)
    })
}


