
const tela = document.querySelector('canvas');
const ctx = tela.getContext(`2d`)

const menu = document.querySelector(`.menu-screen`)
const buttonRetry = document.querySelector(`.retry`)

const scoreText = document.querySelector(`.score`)
const finalScore = document.querySelector(`.final-score`)

const size = 30
var points = 0

let snake = [
    { x: 270, y: 270}
]


const randonNum = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randPos = () => {
    const n1 = randonNum(0, tela.width - size)
    return Math.round(n1 / 30) * 30
}

const randColor = () => {
    return `rgb(${randonNum(0,255)}, ${randonNum(0,255)}, ${randonNum(0,255)})`
}


const food = { x: randPos(), y: randPos(), color: randColor()}

let dir, loopId;


const drawFood = () => {

    const {x, y, color} = food

    ctx.shadowColor = color

    ctx.shadowBlur = 40
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd"
    snake.forEach((posi, index) => {
        if(index == snake.length - 1) {
            ctx.fillStyle = `blue`
        }
        ctx.fillRect(posi.x, posi.y, size, size)
    })
}

const moveSnake = () => {
    const head = snake.at(-1)

   
    switch (dir) {
        case 'right':
            snake.push({x:head.x + size, y:head.y})
            break;
        case 'left':
            snake.push({x:head.x - size, y:head.y})
            break;
        case 'up':
            snake.push({x:head.x , y:head.y - size})
            break;
        case 'down':
            snake.push({x:head.x, y:head.y + size})
            break;
        default:
            return;

        }
    snake.shift()
}

const backGround = () => {
    ctx.lineWidth = 1.5
    ctx.strokeStyle = `#191919`

    for (let i = 30; i < tela.width; i += 30) {

        ctx.beginPath()

        ctx.lineTo(i,0)
        ctx.lineTo(i,600)
    
        ctx.stroke()

        ctx.beginPath()

        ctx.lineTo(0,i)
        ctx.lineTo(600,i)
    
        ctx.stroke()
    }


 
}

const checkEat = () => {

    const head = snake[snake.length - 1]
    if (head.x == food.x && head.y == food.y) {
        snake.push(head)
        points += 10
        scoreText.textContent = points

        let x = randPos()
        let y = randPos()

        while( snake.find((pos) => { pos.x == x && pos.y == y})) {
            x = randPos()
            y = randPos()
        }

        food.x = x
        food.y = y
        food.color = randColor()

    }
}

const gameOver = () => {
    dir = undefined
    tela.style.filter = `blur(5px)`
    menu.style.display = `flex`
    finalScore.textContent = points

}

const checkColis = () => {
    const head = snake[snake.length - 1]
    const neck = snake.length - 2

    const wallColis = (head.x < 0 || head.x > tela.width - size || head.y < 0 || head.y > tela.height - 30)
    const selfColis = snake.find( (pos, index) => {
        return index < neck && pos.x == head.x && pos.y == head.y
    })

    if(wallColis || selfColis){
            gameOver()
            
    }
}

const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0,0,600,600)
    backGround()
    drawFood()
    moveSnake()
    checkColis()
    drawSnake()
    checkEat()

    loopId = setTimeout(() => {
        gameLoop()
    }, 300);

}


gameLoop()


document.addEventListener(`keydown`, ({ key }) => {
    console.log(key);
    switch (key) {
        case `ArrowRight`:
        case `d`:
            dir = (dir != "left") ? 'right' : dir
            break;
        case `ArrowLeft`:
        case `a`:
            dir = (dir != "right") ? 'left' : dir
            break;
        case `ArrowUp`:
        case `w`:
            dir = (dir != "down") ? 'up' : dir
            break;
        case `ArrowDown`:
        case `s`:
            dir = (dir != "up") ? 'down' : dir
            break;
    
        default:
            break;
    }
})

buttonRetry.addEventListener(`click`, () => {
    points = 0
    scoreText.textContent = `00`
    menu.style.display = `none`
    tela.style.filter = `none`
    snake = [ { x: 270, y: 270}]
})