export const restaurarEstadoMecanismo=(eventos:Set<string>,prefixo:string,maximo:number):number=>{for(let etapa=maximo;etapa>0;etapa--)if(eventos.has(`${prefixo}-${etapa}`))return etapa;return 0;};
