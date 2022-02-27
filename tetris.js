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
                    // TODO: Fix Orange Ricky
                    rightRot: [[-20, -10, 1, 0], [1, 0, -1, 9], [-10, 0, -11, 10], [-1, 1, -9, 0]],
                    leftRot: [[-10, -20, -21, 0], [0, 1, -1, 9], [0, -10, 10, 11], [-1, 1, 0, -9]]}, 
                    {name: 'blue-ricky',
                    position: [3, 13, 14, 15]}, 
                    {name: 'hero',
                    position: [3, 4, 5, 6],
                    nextRot: 2,
                    rightRot: [[10, 0, -10, -20], [-1, 0, 1, 2], [20, 10, 0, -10], [-2, -1, 0, 1]],
                    leftRot: [[10, 0, -10, -20], [-2, -1, 0, 1], [20, 10, 0, -10], [-1, 0, 1, 2]]},
                    {name: 'teewee',
                    position: [4, 13, 14, 15]},
                    {name: 'smashboy',
                    position: [4, 5, 14, 15]},
                    {name: 'cleveland-z',
                    position: [3, 4, 14, 15], 
                    nextRot: 0,
                    rightRot: [[-10, 0, -1, 9], [-1, 0, 10, 11], [-10, 0, -1, 9], [-1, 0, 10, 11]],
                    leftRot: [[-9, 0, 1, 10], [-1, 0, 10, 11], [-9, 0, 1, 10], [-1, 0, 10, 11]]},
                    {name: 'rhode-island-z',
                    position: [4, 5, 13, 14]}
                    ]

function rotateRight() {
    oldPosition = [...activeBlock.position]
    let oldAvg = (oldPosition.reduce((total, num) => total + (num % 10), 0))/4

    let nextRot = activeBlock.rightRot[activeBlock.nextRot]
    console.log(`nextRot ${nextRot}`)
    if (activeBlock.nextRot >= 3) {
        activeBlock.nextRot = 0
    } else {
        activeBlock.nextRot += 1
    }
    let axis = activeBlock.position[nextRot.indexOf(0)]
    
    activeBlock.position.forEach((num, index) => {
        activeBlock.position[index] = axis + nextRot[index] 
    })

    let newAvg = (activeBlock.position.reduce((total, num) => total + (num % 10), 0))/4
    let outBounds = true
    while (outBounds === true) {
        outBounds = ((activeBlock.position.some(num => num % 10 === 0)) && (activeBlock.position.some(num => (num + 1) % 10 === 0)))

        console.log('boundary!')
        if (outBounds === true) {
            if (newAvg > oldAvg) {
                activeBlock.position.forEach((num, index) => activeBlock.position[index] += 1)
            } else {
                activeBlock.position.forEach((num, index) => activeBlock.position[index] -= 1)
            }
        }
    }

    renderBlock()
}

function rotateLeft() {
    oldPosition = [...activeBlock.position]
    let oldAvg = (oldPosition.reduce((total, num) => total + (num % 10), 0))/4

    let nextRot = activeBlock.leftRot[activeBlock.nextRot]
    if (activeBlock.nextRot >= 3) {
        activeBlock.nextRot = 0
    } else {
        activeBlock.nextRot += 1
    }

    let axis = activeBlock.position[nextRot.indexOf(0)]

    activeBlock.position.forEach((num, index) => {
        activeBlock.position[index] = axis + nextRot[index]
    })
    console.log('next left rot')
    console.log(oldPosition)
    console.log(activeBlock.position)
    let newAvg = (activeBlock.position.reduce((total, num) => total + (num % 10), 0))/4

    let outBounds = true
    while (outBounds === true){
        outBounds = ((activeBlock.position.some(num => num % 10 === 0)) && (activeBlock.position.some(num => (num + 1) % 10 === 0)))

        console.log('bounds!')
        if (outBounds === true) {
            if (newAvg > oldAvg) {
                activeBlock.position.forEach((num, index) => activeBlock.position[index] += 1)
            } else {
                activeBlock.position.forEach((num, index) => activeBlock.position[index] -= 1)
            }
        }
    }

    renderBlock()
}
// Tracking Variables
let oldPosition = []
let activeBlock = {}
let downSpeed = 2000

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
    
    moveDown()
    moveDown()
    moveDown()
    moveDown()

}


function newBlockSelector() {
    let blockRNG = Math.floor(Math.random() * 7)
    let randomBlock = blocksList[0]
    activeBlock = {name: randomBlock.name,
                   position: [...randomBlock.position],
                   nextRot: randomBlock.nextRot,
                   rightRot: [...randomBlock.rightRot],
                   leftRot: [...randomBlock.leftRot]}
}

function renderBlock() {
    // console.log(`Old: ${oldPosition}`)
    // console.log(`New: ${activeBlock.position}`)

    let positionOverlap = oldPosition.filter(num => {
        return activeBlock.position.indexOf(num) !== -1
    })

    // console.log(positionOverlap)

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

    oldPosition = [...activeBlock.position]
}

function moveLeft() {
    oldPosition = [...activeBlock.position]
    let leftEdge = oldPosition.some(num => {
        return num % 10 == 0
    })

    if (leftEdge != true) {
        activeBlock.position.forEach((num, index) => {
            activeBlock.position[index] -= 1
        })
        console.log('move left')
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
    oldPosition = [...activeBlock.position]
    let bottomEdge = oldPosition.some(num => {
        return (num >= 190) || ((tetrisGrids[num + 10].classList.contains('filled')) === true)
    })

    if (bottomEdge === false) {
        activeBlock.position.forEach((num, index) => {
            activeBlock.position[index] += 10
        })
        console.log('move down')
        renderBlock()
    }
}

function moveAutoDown() {
    oldPosition = [...activeBlock.position]
    let bottomEdge = oldPosition.some(num => {
        return (num >= 190) || ((tetrisGrids[num + 10].classList.contains('filled')) === true)
    })

    let downInterval = setInterval(function() {
        activeBlock.position.forEach((num, index) => {
            activeBlock.position[index] += 10
        })

        renderBlock()
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
    if (e.keyCode == '37') {
        moveLeft()
    } else if (e.keyCode == '39') {
        moveRight()
    } else if (e.keyCode == '38') {
        rotateRight()
    } else if (e.keyCode == '90') {
        rotateLeft()
    }
}

let itsy = (true && true)
console.log(itsy)