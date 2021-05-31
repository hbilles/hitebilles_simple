const introContent = document.querySelector('.intro__content')
const addFadeIn = () => introContent.classList.add('intro__content--fade-in')
let timeoutId = setTimeout(() => {
  addFadeIn()
  clearTimeout(timeoutId)
}, 3000)

const MAX_FRAMES = 1500
const MAX_SPAWN_FRAMES = 1000
const MAX_SPAWN_TICKS = 500

const canvas = document.querySelector('.intro__canvas')
const ctx = canvas.getContext('2d')

const generator = {}
const spawns = []

let tock = false
let frame = 0
let hScale
let sScale
let w
let h

const updateCanvasSize = () => {
  w = window.innerWidth
  h = window.innerHeight
  canvas.width = w * 2
  canvas.height = h * 2

  hScale = 360 / w
  sScale = 100 / h
}

updateCanvasSize()

const getLength = (x, y) => Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

const randomlyMutateVelocity = (entity, selector) => {
  entity[selector] = ((Math.random() / 4) - .125) + entity[selector]
}

const randomlyMutateEntityVelocity = entity => {
  randomlyMutateVelocity(entity, 'vx')
  randomlyMutateVelocity(entity, 'vy')
}

class Factory {
  constructor() {
    const angle = Math.atan2(generator.vy, generator.vx) + 90
    const length = getLength(generator.vy, generator.vx)

    this.x = generator.x
    this.y = generator.y
    this.vx = Math.cos(angle) * length
    this.vy = Math.sin(angle) * length
    this.rad = .5
    this.ticks = 0
  }
}

const draw = () => {
  ctx.globalCompositeOperation = 'lighter'
  ctx.lineWidth = .75

  generator.x += generator.vx
  generator.y += generator.vy

  if (generator.x >= w || generator.x <= 0) generator.vx = generator.vx * -1
  if (generator.y >= h || generator.y <= 0) generator.vy = generator.vy * -1

  if (tock && frame < MAX_SPAWN_FRAMES) spawns.push(new Factory())

  spawns.forEach(spawn => {
    if (spawn.ticks < MAX_SPAWN_TICKS) {
      spawn.x += spawn.vx
      spawn.y += spawn.vy

      const hsl = `hsl(${spawn.x * hScale},${spawn.y * sScale}%,${100 - (spawn.ticks / MAX_SPAWN_TICKS * 50) - 50}%)`
      ctx.fillStyle = hsl
      ctx.beginPath()
      ctx.moveTo(spawn.x, spawn.y)
      ctx.arc(spawn.x, spawn.y, spawn.rad, 0, Math.PI * 2, true)
      ctx.fill()
      ctx.closePath()

      randomlyMutateEntityVelocity(spawn)

      spawn.ticks++
    }
  })

  randomlyMutateEntityVelocity(generator)

  if (generator.vx > 2 || generator.vx < -2) generator.vx = (Math.random() * 2) - 1
  if (generator.vy > 2 || generator.vy < -2) generator.vy = (Math.random() * 2) - 1

  tock = !tock
  frame++
}

// set the canvas scale for retina devices
ctx.scale(2, 2)

generator.x = Math.round(Math.random() * w)
generator.y = Math.round(Math.random() * h)
generator.vx = 0
generator.vy = 0

const loop = () => {
  draw()
  if (frame < MAX_FRAMES) requestAnimationFrame(loop)
}

loop()
