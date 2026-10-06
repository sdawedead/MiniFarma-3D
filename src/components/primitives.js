import * as T from 'three';
export const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.86,...extra});
export const M={wood:mat('#92734e'),metal:mat('#74817b',{metalness:.55,roughness:.42}),dark:mat('#333c35'),white:mat('#e8e4d9'),leaf:mat('#55733c'),soil:null,gravel:null,grass:null,glass:mat('#a7d1cf',{transparent:true,opacity:.22,roughness:.18,depthWrite:false,side:T.DoubleSide}),water:mat('#647c74'),red:mat('#a44631')};
function texture(base,noise,repeat){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=base;ctx.fillRect(0,0,128,128);let seed=19;for(let i=0;i<6000;i++){seed=(seed*16807)%2147483647;const x=seed%128;seed=(seed*16807)%2147483647;const y=seed%128;ctx.fillStyle=noise[i%noise.length];ctx.fillRect(x,y,1+(i%3),1+(i%2));}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(repeat,repeat);t.colorSpace=T.SRGBColorSpace;return t;}
export function initMaterials(){M.soil=mat('#fff',{map:texture('#65503a',['#59452f','#746044','#473a2e'],3)});M.gravel=mat('#fff',{map:texture('#b6ad98',['#bfb8a5','#9c9587','#cec6b3'],8)});M.grass=mat('#fff',{map:texture('#819262',['#768755','#8e9c6a','#697c4f'],20)});}
export function mesh(g,geometry,material,x=0,y=0,z=0){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;g.add(m);return m;}
export function box(g,w,h,d,m,x=0,y=h/2,z=0){return mesh(g,new T.BoxGeometry(w,h,d),m,x,y,z);}
export function ball(g,r,m,x,y,z,s=[1,1,1]){const o=mesh(g,new T.SphereGeometry(r,10,7),m,x,y,z);o.scale.set(...s);return o;}
export function pole(g,a,b,r=.045,m=M.metal){const av=new T.Vector3(...a),bv=new T.Vector3(...b),v=bv.clone().sub(av);const o=mesh(g,new T.CylinderGeometry(r,r,v.length(),6),m);o.position.copy(av.add(bv).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;}
export function roof(g,w,d,y,m=M.dark){for(const s of [-1,1]){const p=box(g,w,.1,d*.56,m,0,y, s*d*.25);p.rotation.x=s*.38;}}
export function plantPatch(g,w,d,kind='leaf',offset=[0,0,0]){
 const spacing=kind==='squash'?.85:.48, nx=Math.max(1,Math.floor(w/spacing)),nz=Math.max(1,Math.floor(d/spacing));
 const geom=new T.SphereGeometry(1,6,4),material=mat(kind==='root'?'#4e743a':kind==='allium'?'#658254':'#557640');
 const inst=new T.InstancedMesh(geom,material,nx*nz);const dummy=new T.Object3D();
 for(let a=0;a<nx;a++)for(let b=0;b<nz;b++){const x=(a+.5)*w/nx-w/2,z=(b+.5)*d/nz-d/2;const tall=['tomato','pepper','climber'].includes(kind);const h=kind==='allium'?.4:tall?.8:.22;dummy.position.set(x+offset[0],.2+h/2+offset[1],z+offset[2]);dummy.scale.set(kind==='allium'?.055:.18,h,.18);dummy.rotation.y=a+b;dummy.updateMatrix();inst.setMatrixAt(a*nz+b,dummy.matrix);if(tall&&b%3===0)pole(g,[x,.1,z],[x,1.7,z],.022,M.wood);if(kind==='tomato'&&b%2===0)ball(g,.07,M.red,x+.12,.65,z);}
 inst.castShadow=true;inst.receiveShadow=true;g.add(inst);
 if(kind==='climber')for(let x=-w/2+.2;x<w/2;x+=1){pole(g,[x,0,-d/2],[x,1.8,-d/2],.03,M.wood);pole(g,[x,1.8,-d/2],[x,1.8,d/2],.02,M.wood);pole(g,[x,0,d/2],[x,1.8,d/2],.03,M.wood);}
}
