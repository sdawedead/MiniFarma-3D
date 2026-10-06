import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {CSS2DRenderer} from 'three/addons/renderers/CSS2DRenderer.js';
import {FARM_CONFIG as C} from './farmLayout.js';
export function createScene(container){
 const scene=new T.Scene();scene.background=new T.Color('#dce1d6');scene.fog=new T.Fog('#dce1d6',120,340);
 const camera=new T.PerspectiveCamera(42,1,.1,1000);
 const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;container.append(renderer.domElement);
 const labels=new CSS2DRenderer();labels.domElement.className='label-layer';container.append(labels.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=4;controls.maxDistance=160;controls.maxPolarAngle=Math.PI/2-.025;controls.target.set(0,0,0);controls.screenSpacePanning=true;
 scene.add(new T.HemisphereLight('#e7edf1','#736c4d',2.2));const sun=new T.DirectionalLight('#fff1d4',3.1);sun.position.set(-28,48,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-38,right:38,top:38,bottom:-38,near:1,far:140});sun.shadow.normalBias=.05;sun.shadow.bias=-.0001;scene.add(sun);
 const farm=new T.Group();farm.rotation.y=T.MathUtils.degToRad(C.orientation);farm.rotation.x=T.MathUtils.degToRad(C.terrainSlope);scene.add(farm);
 const presets={plan:[39,49,58],top:[0,83,.01],iso:[48,37,51],ground:[-12,3,28],reset:[39,49,58]};let transition=null;
 let fit=1;
 function view(name,instant=false){const p=new T.Vector3(...presets[name]);p.multiplyScalar(Math.max(C.width/50,C.depth/45)*(name==='ground'?1:fit));const target=new T.Vector3(name==='ground'?-3:0,0,name==='ground'?1:0);if(instant){camera.position.copy(p);controls.target.copy(target);controls.update();}else transition={start:performance.now(),from:camera.position.clone(),to:p,oldTarget:controls.target.clone(),target};}
 controls.addEventListener('start',()=>transition=null);
 const resize=()=>{const {width,height}=container.getBoundingClientRect();camera.aspect=width/height;const previous=fit;fit=Math.max(1,.95/camera.aspect);camera.position.sub(controls.target).multiplyScalar(fit/previous).add(controls.target);controls.maxDistance=160*fit;camera.updateProjectionMatrix();renderer.setSize(width,height);labels.setSize(width,height);};new ResizeObserver(resize).observe(container);resize();view('plan',true);
 let frames=0;renderer.setAnimationLoop(()=>{if(transition){const t=Math.min(1,(performance.now()-transition.start)/850),e=t*t*(3-2*t);camera.position.lerpVectors(transition.from,transition.to,e);controls.target.lerpVectors(transition.oldTarget,transition.target,e);if(t===1)transition=null;}controls.update();renderer.render(scene,camera);labels.render(scene,camera);frames++;});
 return {scene,farm,camera,renderer,controls,view,get frames(){return frames;}};
}
