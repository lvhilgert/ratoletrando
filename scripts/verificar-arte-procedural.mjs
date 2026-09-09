import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const raiz='src/game',padrao=/\.add\.(graphics|rectangle|circle|ellipse|star|polygon|triangle)\s*\(/,falhas=[];
async function visitar(diretorio){for(const item of await readdir(diretorio,{withFileTypes:true})){const caminho=join(diretorio,item.name);if(item.isDirectory())await visitar(caminho);else if(item.name.endsWith('.ts')){const linhas=(await readFile(caminho,'utf8')).split(/\r?\n/);linhas.forEach((linha,i)=>{if(padrao.test(linha)&&!linha.includes('raster-exception:')&&!linhas[i-1]?.includes('raster-exception:'))falhas.push(`${relative('.',caminho)}:${i+1}`);});}}}
await visitar(raiz);
if(falhas.length){console.error(`Arte procedural sem justificativa:\n${falhas.join('\n')}`);process.exit(1);}
console.log('Arte procedural restrita a colisores invisíveis, desenho da criança e efeitos efêmeros.');
