// Units are metres. X = east, -Z = north; origin is the centre of the parcel.
// Positions are relative to the reference parcel; structures keep real dimensions.
export const FARM_CONFIG = {width:50,depth:45,people:2,chickens:6,rabbitFemales:2,rabbitMales:1,fruitTrees:3,orientation:0,terrainSlope:0,referenceWidth:50,referenceDepth:45};
export const CROPS = [
 ['Zemiaky',70,7,10,'leaf','160–240 kg'],['Fazuľa',30,3,10,'climber','Podľa odrody a spôsobu zberu'],['Tekvice',14,3.5,4,'squash','Podľa odrody'],
 ['Cibuľa',12,3,4,'allium'],['Cesnak',8,2,4,'allium'],['Mrkva',12,3,4,'root'],['Petržlen / Paštrnák',6,1.5,4,'root'],['Cvikla',5,1.25,4,'root'],['Kapusta',10,2.5,4,'cabbage'],['Kel',4,1,4,'cabbage'],
 ['Paradajky',14,3.5,4,'tomato'],['Paprika',10,2.5,4,'pepper'],['Uhorky',7,1.75,4,'climber'],['Cuketa',5,1.25,4,'squash'],['Hrach',12,3,4,'climber'],['Šaláty',10,2.5,4,'cabbage'],['Špenát / Mangold',6,1.5,4,'leaf'],['Bylinky',4,1,4,'leaf']
].map(([name,area,width,depth,kind,yieldText])=>({name,area,width,depth,kind,yieldText}));
// The garden occupies 29 × 17 m including paths and a 36 m² rotation reserve.
let nextX=-8;
export const BEDS=CROPS.map((crop,i)=>{
 let x,z;
 if(i===0){x=-4.5;z=6;} else if(i===1){x=2;z=6;} else if(i===2){x=6.25;z=3;}
 else if(i<10){if(i===3)nextX=-8;x=nextX+crop.width/2;z=15;nextX+=crop.width+.65;}
 else {if(i===10)nextX=9.1;x=nextX+crop.width/2;z=i<14?3:9;if(i===14){nextX=9.1;x=nextX+crop.width/2;}nextX+=crop.width+.65;}
 return {...crop,id:`bed-${i}`,x,z};
});
export const ZONES={caravan:[-13,-14],greenhouse:[4,-7],chickens:[17,-14],rabbits:[19,-4],water:[-3,-8],compost:[21,17],solar:[-17,-6],work:[-14,3],reserve:[14,15]};
export function position(x,z,c=FARM_CONFIG){return [x*c.width/c.referenceWidth,z*c.depth/c.referenceDepth];}
export function validateLayout(c=FARM_CONFIG){
 const errors=[];
 for(const b of BEDS){const [x,z]=position(b.x,b.z,c);if(Math.abs(x)+b.width/2>c.width/2||Math.abs(z)+b.depth/2>c.depth/2)errors.push(`${b.name}: mimo parcely`);}
 for(let i=0;i<BEDS.length;i++)for(let j=i+1;j<BEDS.length;j++){const a=BEDS[i],b=BEDS[j],[ax,az]=position(a.x,a.z,c),[bx,bz]=position(b.x,b.z,c);if(Math.abs(ax-bx)<(a.width+b.width)/2&&Math.abs(az-bz)<(a.depth+b.depth)/2)errors.push(`${a.name} / ${b.name}: kolízia`);}
 return errors;
}

