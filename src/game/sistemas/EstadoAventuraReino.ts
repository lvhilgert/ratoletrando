import type { AventuraReino } from './LevelReino';

export const carregarEventosAventura=(fase:number,seed:number,salvo:{fase:number;seed:number;eventos:string[]}):Set<string>=>new Set(salvo.fase===fase&&salvo.seed===seed?salvo.eventos:[]);
export const registrarEvento=(eventos:Set<string>,evento:string):boolean=>eventos.has(evento)?false:(eventos.add(evento),true);
export const aventuraConcluida=(aventura:AventuraReino|undefined,eventos:Set<string>):boolean=>!!aventura&&aventura.eventos.every(evento=>eventos.has(evento));
export const textoObjetivoAventura=(aventura:AventuraReino,eventos:Set<string>):{texto:string;completo:boolean}=>{const feitos=aventura.eventos.filter(evento=>eventos.has(evento)).length,completo=feitos===aventura.eventos.length,progresso=aventura.eventos.length>1?` ${feitos}/${aventura.eventos.length}`:'';return {texto:`${completo?'✓':aventura.icone} ${aventura.nome}${progresso}`,completo};};
