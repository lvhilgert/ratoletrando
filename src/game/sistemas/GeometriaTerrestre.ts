export interface LimitesOpacos {topo:number;base:number}

export const medirLimitesOpacos=(pixels:Uint8ClampedArray,largura:number,altura:number):LimitesOpacos=>{
    let topo=altura,base=-1;
    for(let y=0;y<altura;y++)for(let x=0;x<largura;x++)if(pixels[(y*largura+x)*4+3]>8){topo=Math.min(topo,y);base=Math.max(base,y+1);}
    return base<0?{topo:0,base:altura}:{topo:topo/altura,base:base/altura};
};

export const medirTopoApoiavel=(pixels:Uint8ClampedArray,largura:number,altura:number):number=>{
    for(let y=0;y<altura;y++){
        let opacos=0;
        for(let x=0;x<largura;x++)if(pixels[(y*largura+x)*4+3]>8)opacos++;
        if(opacos*5>=largura*4)return y/altura;
    }
    return medirLimitesOpacos(pixels,largura,altura).topo;
};
