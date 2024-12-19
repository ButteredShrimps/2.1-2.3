import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const brickTexture = textureLoader.load('/textures/bricks/color.jpg');

//Disco Ball
const geometry = new THREE.OctahedronGeometry( 4, 3 ); 
//const material = new THREE.MeshPhysicalMaterial( { color: 0x72777c } ); 

const material = new THREE.MeshPhysicalMaterial({
    color: 0x72777c, // Base color
    metalness: 0.5, // Adjust metallicity
    roughness: 0.1, // Adjust roughness
    reflectivity: 1.0, //Adjust reflectivity, don't set metalness to 1 :<
    //clearcoat: 0.5, // Add a clearcoat layer
    clearcoatRoughness: 0.1 // Adjust clearcoat roughness
});

const DiscoBall = new THREE.Mesh( geometry, material ); scene.add( DiscoBall );
DiscoBall.castShadow= true

DiscoBall.position.y= 15

/**
 * House
 */
// Temporary sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ roughness: 0.7 })
)
sphere.position.y = 1
scene.add(sphere)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ map: brickTexture ,color: '#a9c388' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow= true
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#2a23fb', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// spotlights that will shine on discoBall

const pinkLight = new THREE.SpotLight('#ff28cb', 0.9)
pinkLight.position.set(2, 20, 7)
pinkLight.castShadow= true
scene.add(pinkLight)


const blueLight = new THREE.SpotLight('#1780ff', 1.0)
blueLight.position.set(-4, 20, -5)
blueLight.castShadow= true
scene.add(blueLight)

const yellowLight = new THREE.SpotLight('#f1ff1d', 1.5)
yellowLight.position.set(-25, 0, 5)
yellowLight.castShadow = true
scene.add(yellowLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//YOU MUST enable shadows on renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const targetObject = new THREE.Object3D();
pinkLight.target = targetObject;
blueLight.target = targetObject;
yellowLight.target = targetObject;


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    targetObject.position.x = 10 * Math.cos(Date.now() * 0.001);
    targetObject.position.z = 10 * Math.cos(Date.now() * 0.001);
    targetObject.position.y = 10 * Math.cos(Date.now() * 0.001);


    DiscoBall.rotation.y += 0.01;


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()