import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import particleVertexShader from "./shaders/particles/vertex.glsl"
import particleFragmentShader from "./shaders/particles/fragment.glsl"

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.close()

const debugObject = {}

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Particles
 */
const parameters = {}

parameters.count = 128
parameters.radius = 2.5

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

  /**
   * Geometry
   */
  pointsGeometry = new THREE.SphereBufferGeometry(
    parameters.radius,
    parameters.count,
    parameters.count
  )

  /**
   * Material
   */
  pointsMaterial = new THREE.ShaderMaterial({
    vertexColors: true,
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms: {
      uTime: { value: 1 },
      uColor: { value: new THREE.Color("#b9b5ff") },
    },
  })

  /**
   * Points
   */
  points = new THREE.Points(pointsGeometry, pointsMaterial)

  // points.rotation.set(0, 0, 45)

  scene.add(points)
}

generateParticles()

// Debug
gui
  .add(parameters, "count")
  .min(0)
  .max(1024)
  .step(parameters.count)
  .onFinishChange(() => {
    generateParticles()
  })
gui
  .add(parameters, "radius")
  .min(1)
  .max(10)
  .step(0.5)
  .onFinishChange(() => {
    generateParticles()
  })

/**
 * Sphere
 */
/**
 * Geometry
 */
let sphereGeometry = new THREE.SphereGeometry(2.4, 64, 32)

/**
 * Material
 */
const sphereMaterial = new THREE.MeshStandardMaterial({
  // color: 0xffffff,
})

const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(mesh)

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

/**
 * Lights
 */
// Ambient light
debugObject.lightColor = "#6b6982"
// const ambientLight = new THREE.AmbientLight(debugObject.lightColor, 0.12)
const ambientLight = new THREE.AmbientLight(debugObject.lightColor, 0.121)
gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("ambientIntensity")
scene.add(ambientLight)

// Directional light
// const moonLight = new THREE.DirectionalLight(debugObject.lightColor, 0.12)
const moonLight = new THREE.DirectionalLight(debugObject.lightColor, 0.25)
// moonLight.position.set(4, 5, -2)
moonLight.position.set(-10, 7.385, 1.099)
gui
  .add(moonLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("directionalIntensity")
gui.add(moonLight.position, "x").min(-10).max(10).step(0.001)
gui.add(moonLight.position, "y").min(-10).max(10).step(0.001)
gui.add(moonLight.position, "z").min(-10).max(10).step(0.001)

gui.addColor(debugObject, "lightColor").onChange(() => {
  moonLight.color.set(debugObject.lightColor)
  ambientLight.color.set(debugObject.lightColor)
})

scene.add(moonLight)

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

  // Update material
  if (pointsMaterial) {
    pointsMaterial.uniforms.uTime.value = elapsedTime
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
