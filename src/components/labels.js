import * as T from 'three';
import {CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
import {labelData} from './farm.js';
export function createLabels(onSelect){return labelData.map(({group,name,offset,small})=>{const el=document.createElement('button');el.className=`scene-label ${small?'small':''} ${group.userData.crop?'crop-label':''}`;el.textContent=name;el.addEventListener('pointerdown',e=>e.stopPropagation());el.addEventListener('click',e=>{e.stopPropagation();onSelect(group);});const label=new CSS2DObject(el);label.position.copy(new T.Vector3(...(offset||[0,group.userData.crop?.6:2.6,0])));group.add(label);return label;});}
