import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import { Color, Geometry } from "three"

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Particles
 */
const parameters = {}

parameters.count = 100000
parameters.size = 0.001

let pointsGeometry,
  pointsMaterial,
  points = null

const generateParticles = () => {
  /**
   * Destroy Galaxy
   */
  if (points !== null) {
    pointsGeometry.dispose()
    pointsMaterial.dispose()
    scene.remove(points)
  }

  const positions = new Float32Array(parameters.count * 3)

  for (let i = 0; i < parameters.count; i++) {
    positions[i + 0] = Math.random() - 0.5
    positions[i + 1] = Math.random() - 0.5
    positions[i + 2] = Math.random() - 0.5
  }

  // Geometry
  pointsGeometry = new THREE.BufferGeometry()
  pointsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  )

  // Material
  pointsMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    color: "#ff0",
  })

  // Points
  points = new THREE.Points(pointsGeometry, pointsMaterial)

  scene.add(points)
}

generateParticles()

// Debug
gui
  .add(parameters, "count")
  .min(1000)
  .max(1000000)
  .step(100)
  .onFinishChange(generateParticles)
gui
  .add(parameters, "size")
  .min(0.001)
  .max(1)
  .step(0.001)
  .onFinishChange(generateParticles)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
