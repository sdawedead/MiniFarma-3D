import * as T from 'three';
import './ui/style.css';
import {createScene} from './scene.js';
import {createUI} from './ui/interface.js';
import {initMaterials} from './components/primitives.js';
import * as F from './components/farm.js';
import {createLabels} from './components/labels.js';
import {optimizeStaticMeshes} from './components/optimize.js';
import {validateLayout,BEDS,FARM_CONFIG} from './farmLayout.js';
const ui=createUI();
try{
 const app=createScene(ui.container);initMaterials();
 [F.createGround,F.createPaths,F.createFence,F.createCaravan,F.createVan,F.createGreenhouse,F.createGardenBeds,F.createChickenArea,F.createRabbitArea,F.createOrchard,F.createWaterSystem,F.createCompostArea,F.createSolarSystem,F.createUtilityArea].forEach(fn=>fn(app.farm));
 optimizeStaticMeshes([app.farm,...F.selectable]);
 let highlight=null;
 function select(group){if(highlight){app.scene.remove(highlight);highlight.geometry.dispose();highlight.material.dispose();}app.scene.updateMatrixWorld(true);highlight=new T.BoxHelper(group,0xe8b95f);highlight.material.depthTest=false;highlight.renderOrder=10;app.scene.add(highlight);ui.showInfo(group);document.querySelectorAll('[data-zone]').forEach(b=>b.classList.toggle('selected',b.dataset.zone===group.userData.id));}
 document.addEventListener('clear-selection',()=>{if(highlight){app.scene.remove(highlight);highlight.geometry.dispose();highlight.material.dispose();highlight=null;}});
 const labels=createLabels(select);const ray=new T.Raycaster(),pointer=new T.Vector2();let down;
 app.renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
 app.renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;const r=app.renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,app.camera);const hits=ray.intersectObjects(F.selectable,true);if(hits.length){let g=hits[0].object;while(g&&!g.userData.id)g=g.parent;if(g)select(g);}});
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{app.view(b.dataset.view);ui.markView(b.dataset.view);});
 document.querySelectorAll('[data-zone]').forEach(b=>b.onclick=()=>select(F.selectable.find(g=>g.userData.id===b.dataset.zone)));
 document.querySelector('#labels').onclick=e=>{const b=e.currentTarget,on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);labels.forEach(l=>l.visible=on);};
 document.querySelector('#shadows').onclick=e=>{app.renderer.shadowMap.enabled=!app.renderer.shadowMap.enabled;e.currentTarget.setAttribute('aria-pressed',app.renderer.shadowMap.enabled);app.scene.traverse(o=>{if(o.material)o.material.needsUpdate=true;});};
 document.querySelector('#loading').remove();
 // Read-only diagnostics make future layout and browser checks straightforward.
 window.MINIFARMA={config:FARM_CONFIG,beds:BEDS,zones:F.selectable.map(g=>g.userData),validation:validateLayout(),get renderedFrames(){return app.frames;},get rendering(){return {calls:app.renderer.info.render.calls,triangles:app.renderer.info.render.triangles};}};
 if(validateLayout().length)console.warn('Rozloženie vyžaduje kontrolu:',validateLayout());
}catch(error){document.querySelector('#loading').textContent='3D model sa nepodarilo načítať. Skontrolujte podporu WebGL 2 a obnovte stránku.';console.error(error);}
