import json, sys
D = '/tmp/claude-0/-home-claude/2fe2cedc-b205-5850-a0d8-7f4fa33ecd38/scratchpad/rm'
ep = sys.argv[1]
TL = open(f'{D}/tl_{ep}.json').read()
html = f'''<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Regras da Madrugada · Ep. {ep}</title>
<style>html,body{{margin:0;background:#000}}canvas{{display:block;max-height:100vh;margin:auto}}</style>
<canvas id="tela" width="1080" height="1920"></canvas>
<script>
{open(f'{D}/motor.js').read()}
const TL = {TL};
{open(f'{D}/ep{ep}_cenas.js').read()}
montaLegendas(TL);
window.DURACAO = TL.dur; window.FPS = FPS;
window.renderFrame = function (t) {{
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  const c = CENAS.find(c => t >= c[0] && t < c[1]) || CENAS[CENAS.length - 1];
  c[2](t, t - c[0]);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  if (t < CENAS[CENAS.length - 1][0]) {{ tag(); desenhaLegenda(t); }}
}};
window.pronto = Promise.all(['84px "Archivo Black"', '52px "Caveat"', '30px "IBM Plex Mono"'].map(f => document.fonts.load(f))).then(() => document.fonts.ready).then(() => true);
if (!location.search.includes('render')) window.pronto.then(() => {{ const t0 = performance.now(); (function loop() {{ renderFrame(((performance.now() - t0) / 1000) % TL.dur); requestAnimationFrame(loop); }})(); }});
</script></html>'''
open(f'{D}/ep{ep}.html', 'w').write(html)
