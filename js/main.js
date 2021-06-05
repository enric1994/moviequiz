let gltf = null;
let mixer = null;
let clock = new THREE.Clock();
let controls;
let camera;

init();
animate();

function init() {
    width = window.innerWidth;
    height = window.innerHeight;

    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 10000);
    camera.position.set(40, 20, 30);

    // Background
    scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    scene.fog = new THREE.Fog(scene.background, 1, 5000);

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0, 0, 1);
    hemiLight.groundColor.setHSL(0, 0, 1);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    // const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    // scene.add(hemiLightHelper);

    //
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    // dirLight.color.setHSL(0, 1, 0.95);
    dirLight.position.set(- 1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    const d = 50;

    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;

    // const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
    // // dirLight2.color.setHSL(0, 1, 0.95);
    // dirLight2.position.set( 1, -1.75, -1);
    // dirLight2.position.multiplyScalar(30);
    // scene.add(dirLight2);

    // dirLight2.castShadow = true;

    // dirLight2.shadow.mapSize.width = 2048;
    // dirLight2.shadow.mapSize.height = 2048;

    // const d2 = -20;

    // dirLight2.shadow.camera.left = - d2;
    // dirLight2.shadow.camera.right = d2;
    // dirLight2.shadow.camera.top = d2;
    // dirLight2.shadow.camera.bottom = - d2;

    // dirLight2.shadow.camera.far = 3500;
    // dirLight2.shadow.bias = - 0.0001;

    // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
    // scene.add(dirLightHelper);

    // Ground

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry( 100, 100 ),
        new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff } )
    );
    plane.rotation.x = - Math.PI / 2;
    plane.position.y = -10;
    scene.add( plane );

    plane.receiveShadow = true;

    // 3D model

    let loader = new THREE.GLTFLoader();

    let scale = 5.0;
    let url = "gltf/platform7.glb";

    loader.load(url, function (data) {
        gltf = data;
        let object = gltf.scene;
        object.scale.set(scale, scale, scale);
        object.castShadow = true;
        object.receiveShadow = true;

        gltf.scene.traverse( function ( object ) {

            if ( object.isMesh ) {
        
                object.castShadow = true;
                object.receiveShadow = true;
        
            }
        
        } );

        let animations = gltf.animations;
        if (animations && animations.length) {
            mixer = new THREE.AnimationMixer(object);
            for (let i = 0; i < animations.length; i++) {
                let animation = animations[i];
                mixer.clipAction(animation).play();
            }
        }
        scene.add(object);
    });

    // let axis = new THREE.AxesHelper(1000);
    // scene.add(axis);

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;

    // Orbit Controls

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.userPanSpeed = 0.0;
    controls.maxDistance = 5000.0;
    controls.maxPolarAngle = Math.PI * 0.30;
    controls.minPolarAngle = Math.PI * 0.30;
    controls.autoRotate = false;
    controls.autoRotateSpeed = -2.0;

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(width, height);
    renderer.gammaOutput = true;
    document.body.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(clock.getDelta());
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}