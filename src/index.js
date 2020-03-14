import * as THREE from 'three';
import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './jsm/postprocessing/RenderPass.js';
import { FilmPass } from './jsm/postprocessing/FilmPass.js';
import { BloomPass } from './jsm/postprocessing/BloomPass.js';

var container;
var camera, scene, renderer, composer, clock;
var uniforms, mesh;
var mouseX = 0, mouseY = 0;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

init();
animate();

function init() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 3000 );
    camera.position.z = 1;
    camera.position.y = THREE.MathUtils.clamp( camera.position.y + ( - ( mouseY + 200 ) - camera.position.y ) * .085, -200, 1000 );
    
    scene = new THREE.Scene();
    var light1 = new THREE.DirectionalLight( 0xffffff, 2 );
    light1.position.set( 1, 1, 1 );
    scene.add( light1 );

    // scene.background = new THREE.Color( 0xf2f7ff );

    clock = new THREE.Clock();
    var textureLoader = new THREE.TextureLoader(); uniforms = {

        "fogDensity": { value: 0.45 },
        "fogColor": { value: new THREE.Vector3(0, 0, 0) },
        "time": { value: 1.0 },
        "uvScale": { value: new THREE.Vector2(3.0, 1.0) },
        "texture1": { value: textureLoader.load('textures/lava/cloud.png') },
        "texture2": { value: textureLoader.load('textures/lava/lavatile.jpg') }

    };

    uniforms["texture1"].value.wrapS = uniforms["texture1"].value.wrapT = THREE.RepeatWrapping;
    uniforms["texture2"].value.wrapS = uniforms["texture2"].value.wrapT = THREE.RepeatWrapping;

    // var size = 0.65;

    var material = new THREE.ShaderMaterial({

        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent

    });

    // mesh = new THREE.Mesh(new THREE.TorusBufferGeometry(size, 0.3, 30, 30), material);
    var geometry = new THREE.PlaneBufferGeometry( 0.3, 0.3 );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.scale.set( 100, 100, 100 );
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    renderer.autoClear = false;

    var renderModel = new RenderPass(scene, camera);
    var effectBloom = new BloomPass(1.25 );
    var effectFilm = new FilmPass(0.35, 0.95, 2048, false);

    composer = new EffectComposer(renderer);

    composer.addPass(renderModel);
    composer.addPass(effectBloom);
    composer.addPass(effectFilm);

    onWindowResize();

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {

    
    camera.position.x += ( mouseX - camera.position.x ) * .05;
    // console.log(THREE.MathUtils.clamp( camera.position.y + ( - ( mouseY - 200 ) - camera.position.y ) * .05, 50, 1000 ));
    // console.log(camera.position.y);
    // camera.position.y = THREE.MathUtils.clamp( camera.position.y + ( - ( mouseY - 200 ) - camera.position.y ) * .05, 50, 1000 );
    // camera.position.y = -2;
    camera.lookAt( scene.position );

    var delta = 5 * clock.getDelta();
    uniforms["time"].value += 0.2 * delta;
    // mesh.rotation.y += 0.0125 * delta;
    // mesh.rotation.x += 0.05 * delta;
    renderer.clear();
    composer.render(0.01);
}

// movement - please calibrate these values
var xSpeed = 1;
var ySpeed = 1;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        camera.position.y += ySpeed;
    } else if (keyCode == 83) {
        camera.position.y -= ySpeed;
    } else if (keyCode == 65) {
        camera.position.x -= xSpeed;
    } else if (keyCode == 68) {
        camera.position.x += xSpeed;
    } else if (keyCode == 32) {
        camera.position.set(0, 0, 0);
    }
};
