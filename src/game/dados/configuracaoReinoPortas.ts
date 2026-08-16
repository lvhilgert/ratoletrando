import * as Phaser from 'phaser';

export type CategoriaDesafio='matematica'|'letras'|'silabas'|'quantidade';
export type DificuldadeReino='tranquilo'|'normal'|'aventura';

export interface PalavraReino {palavra:string;silabas:string[]}
export interface ConfiguracaoReinoPortas {
    dificuldade:DificuldadeReino;
    matematica:{minimo:number;maximo:number;permitirSoma:boolean;permitirSubtracao:boolean};
    linguagem:{palavras:PalavraReino[]};
}

export const CONFIGURACAO_REINO_PORTAS:ConfiguracaoReinoPortas={
    dificuldade:'normal',
    matematica:{minimo:0,maximo:50,permitirSoma:true,permitirSubtracao:true},
    linguagem:{palavras:[
        {palavra:'CASA',silabas:['CA','SA']},
        {palavra:'GATO',silabas:['GA','TO']},
        {palavra:'BANANA',silabas:['BA','NA','NA']},
        {palavra:'CAVALO',silabas:['CA','VA','LO']},
        {palavra:'ESCOLA',silabas:['ES','CO','LA']},
        {palavra:'JANELA',silabas:['JA','NE','LA']},
        {palavra:'BONECA',silabas:['BO','NE','CA']}
    ]}
};

export interface DesafioPorta {categoria:CategoriaDesafio;pergunta:string;palavra?:string;resposta:number;alternativas:number[];explicacao:string}
export interface FaixasDesafio {soma?:{minimo:number;maximo:number};quantidade?:{minimo:number;maximo:number}}

const alternativas=(resposta:number,minimo=0):number[]=>{
    const valores=new Set<number>([resposta]);
    for(const desvio of Phaser.Utils.Array.Shuffle([-2,-1,1,2,3,-3]))if(resposta+desvio>=minimo&&valores.size<3)valores.add(resposta+desvio);
    return Phaser.Utils.Array.Shuffle([...valores]);
};

export function criarDesafio(categoria:CategoriaDesafio,dificuldade:DificuldadeReino='normal',faixas:FaixasDesafio={}):DesafioPorta {
    const config=CONFIGURACAO_REINO_PORTAS;
    if(categoria==='matematica'){
        const minimo=faixas.soma?.minimo??config.matematica.minimo,maximo=faixas.soma?.maximo??(dificuldade==='tranquilo'?20:dificuldade==='aventura'?90:config.matematica.maximo);
        const soma=config.matematica.permitirSoma&&(!config.matematica.permitirSubtracao||Math.random()>.5);
        if(soma){const resultado=Phaser.Math.Between(Math.min(maximo,Math.max(minimo,15)),maximo),a=resultado>=8?Phaser.Math.Between(5,resultado-3):Phaser.Math.Between(0,resultado),b=resultado-a;return {categoria,pergunta:`${a} + ${b} = ?`,resposta:resultado,alternativas:alternativas(resultado,minimo),explicacao:`Junte ${a} com ${b}: o resultado é ${resultado}.`};}
        const a=Phaser.Math.Between(Math.min(maximo,Math.max(minimo,12)),maximo),limiteB=a-minimo,b=limiteB>=2?Phaser.Math.Between(2,limiteB):Phaser.Math.Between(0,limiteB),resultado=a-b;return {categoria,pergunta:`${a} − ${b} = ?`,resposta:resultado,alternativas:alternativas(resultado,minimo),explicacao:`Tire ${b} de ${a}: restam ${resultado}.`};
    }
    if(categoria==='quantidade'){
        const minimo=faixas.quantidade?.minimo??3,maximo=faixas.quantidade?.maximo??9,resposta=Phaser.Math.Between(minimo,maximo);
        return {categoria,pergunta:'Quantas estrelas você vê?',resposta,alternativas:alternativas(resposta,1),explicacao:`Contando uma por uma: são ${resposta}.`};
    }
    const item=Phaser.Utils.Array.GetRandom(config.linguagem.palavras);
    const resposta=categoria==='letras'?Array.from(item.palavra).length:item.silabas.length;
    return {categoria,palavra:item.palavra,pergunta:categoria==='letras'?`Quantas letras tem ${item.palavra}?`:`Quantas partes tem ${item.palavra}?`,resposta,alternativas:alternativas(resposta,1),explicacao:categoria==='letras'?`${item.palavra} tem ${resposta} letras: ${Array.from(item.palavra).join(' – ')}.`:`${item.palavra} se divide em ${item.silabas.join(' – ')}.`};
}
