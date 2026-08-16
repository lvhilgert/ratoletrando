import * as Phaser from 'phaser';

export type CategoriaDesafio='matematica'|'letras'|'silabas';

export interface PalavraReino {palavra:string;silabas:string[]}
export interface ConfiguracaoReinoPortas {
    dificuldade:'tranquilo'|'normal'|'aventura';
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

const alternativas=(resposta:number,minimo=0):number[]=>{
    const valores=new Set<number>([resposta]);
    for(const desvio of Phaser.Utils.Array.Shuffle([-2,-1,1,2,3,-3]))if(resposta+desvio>=minimo&&valores.size<3)valores.add(resposta+desvio);
    return Phaser.Utils.Array.Shuffle([...valores]);
};

export function criarDesafio(categoria:CategoriaDesafio):DesafioPorta {
    const config=CONFIGURACAO_REINO_PORTAS;
    if(categoria==='matematica'){
        const soma=config.matematica.permitirSoma&&(!config.matematica.permitirSubtracao||Math.random()>.5);
        if(soma){const resultado=Phaser.Math.Between(15,config.matematica.maximo),a=Phaser.Math.Between(5,resultado-3),b=resultado-a;return {categoria,pergunta:`${a} + ${b} = ?`,resposta:resultado,alternativas:alternativas(resultado),explicacao:`Junte ${a} com ${b}: o resultado é ${resultado}.`};}
        const a=Phaser.Math.Between(12,config.matematica.maximo),b=Phaser.Math.Between(2,a),resultado=a-b;return {categoria,pergunta:`${a} − ${b} = ?`,resposta:resultado,alternativas:alternativas(resultado),explicacao:`Tire ${b} de ${a}: restam ${resultado}.`};
    }
    const item=Phaser.Utils.Array.GetRandom(config.linguagem.palavras);
    const resposta=categoria==='letras'?Array.from(item.palavra).length:item.silabas.length;
    return {categoria,palavra:item.palavra,pergunta:categoria==='letras'?`Quantas letras tem ${item.palavra}?`:`Quantas partes tem ${item.palavra}?`,resposta,alternativas:alternativas(resposta,1),explicacao:categoria==='letras'?`${item.palavra} tem ${resposta} letras: ${Array.from(item.palavra).join(' – ')}.`:`${item.palavra} se divide em ${item.silabas.join(' – ')}.`};
}
