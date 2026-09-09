import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const saida='public/assets/compartilhados';
await mkdir(saida,{recursive:true});
const navegador=await chromium.launch({channel:'chrome',headless:true}),pagina=await navegador.newPage();
const formas=[['painel',128,128,24],['botao',256,96,40],['circulo',128,128,64],['barra',256,32,14]];
for(const [nome,largura,altura,raio] of formas){
    const png=await pagina.evaluate(({largura,altura,raio})=>{const canvas=document.createElement('canvas');canvas.width=largura;canvas.height=altura;const c=canvas.getContext('2d');if(!c)throw new Error('Canvas 2D indisponível.');c.fillStyle='#fff';c.beginPath();c.roundRect(4,4,largura-8,altura-8,raio);c.fill();return canvas.toDataURL('image/png').split(',')[1];},{largura,altura,raio});
    await writeFile(`${saida}/ui-${nome}.png`,Buffer.from(png,'base64'));
}
for(const nome of ['speaker','speaker-off','lock','plus']){
    const png=await pagina.evaluate(nome=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const c=canvas.getContext('2d');if(!c)throw new Error('Canvas 2D indisponível.');c.fillStyle='#fff';c.strokeStyle='#fff';c.lineWidth=6;c.lineCap='round';c.lineJoin='round';if(nome.startsWith('speaker')){c.fillRect(9,25,11,14);c.beginPath();c.moveTo(20,25);c.lineTo(35,14);c.lineTo(35,50);c.lineTo(20,39);c.closePath();c.fill();c.beginPath();c.arc(34,32,13,-.7,.7);c.stroke();c.beginPath();c.arc(34,32,21,-.65,.65);c.stroke();if(nome==='speaker-off'){c.strokeStyle='#fff';c.lineWidth=9;c.beginPath();c.moveTo(10,10);c.lineTo(54,54);c.stroke();}}else if(nome==='lock'){c.lineWidth=7;c.beginPath();c.arc(32,27,13,Math.PI,0);c.stroke();c.beginPath();c.roundRect(14,27,36,28,7);c.fill();}else{c.fillRect(27,9,10,46);c.fillRect(9,27,46,10);}return canvas.toDataURL('image/png').split(',')[1];},nome);
    await writeFile(`${saida}/ui-${nome}.png`,Buffer.from(png,'base64'));
}
const espada=await pagina.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const c=canvas.getContext('2d');if(!c)throw new Error('Canvas 2D indisponível.');c.translate(64,64);c.rotate(-.72);c.lineCap='round';c.lineJoin='round';c.strokeStyle='#70452f';c.lineWidth=12;c.beginPath();c.moveTo(-42,0);c.lineTo(-18,0);c.stroke();c.strokeStyle='#ffd85a';c.lineWidth=10;c.beginPath();c.moveTo(-22,-17);c.lineTo(-22,17);c.stroke();c.fillStyle='#68def2';c.strokeStyle='#fff0a6';c.lineWidth=5;c.beginPath();c.moveTo(-15,-10);c.lineTo(45,0);c.lineTo(-15,10);c.closePath();c.fill();c.stroke();c.fillStyle='#d5fbff';c.beginPath();c.moveTo(-8,-6);c.lineTo(35,0);c.lineTo(-8,1);c.closePath();c.fill();return canvas.toDataURL('image/png').split(',')[1];});
await writeFile('public/assets/reino-portas/reino-espada-cristal.png',Buffer.from(espada,'base64'));
await navegador.close();
console.log('8 primitivas raster de UI e espada de cristal geradas.');
