import assert from 'node:assert/strict';
import { framesArma, LIMITES_FRAMES_ARMAS } from './FramesArmasReino.ts';

for(const [arma,limites] of Object.entries(LIMITES_FRAMES_ARMAS)){
    const frames=framesArma(limites);
    assert.equal(frames.length,10,`${arma}: quantidade de frames`);
    for(const [i,frame] of frames.entries()){
        assert.ok(frame.destinoX>=8,`${arma}/${i}: margem esquerda`);
        assert.ok(frame.destinoX+frame.largura<=332,`${arma}/${i}: margem direita`);
    }
}
console.log('Sprites de armas: 4 folhas, 40 frames e margens virtuais validadas.');
