import json, subprocess, sys
from alinha import alinha_janelas, silencios, D
# uso: python3 timeline2.py 02
ep = sys.argv[1]
CFG = json.load(open(f'{D}/cfg_{ep}.json'))
def janelas(f, linhas):
    import re
    n = len(linhas)
    sil, dur = silencios(f, d=0.2)
    ini = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
    fim = sil[-1][0] if sil and sil[-1][1] >= dur - 0.05 else dur
    meio = [s for s in sil if s[0] > 0.05 and s[1] < dur - 0.05]
    if n == 1: return [(ini, fim + 0.02)]
    # posição de cada silêncio em "tempo de fala" relativo
    fala_tot = (fim - ini) - sum(b - a for a, b in meio)
    pos = []; perd = 0
    for a, b in meio: pos.append((a - ini - perd) / fala_tot); perd += b - a
    peso = [len(re.sub(r'\W', '', l)) + 2 for l in linhas]; tot = sum(peso)
    alvo = []; acc = 0
    for p in peso[:-1]: acc += p; alvo.append(acc / tot)
    m = len(meio); INF = 1e9
    dp = [[INF] * (m + 1) for _ in range(n)]; bk = [[None] * (m + 1) for _ in range(n)]
    for i in range(m + 1): dp[0][i] = 0
    for j in range(1, n):
        for i in range(1, m + 1):
            best = min(range(i), key=lambda k: dp[j - 1][k]) if True else 0
            c = dp[j - 1][best] + abs(pos[i - 1] - alvo[j - 1]) * 10 - min(meio[i - 1][1] - meio[i - 1][0], 1.0) * 1.5
            dp[j][i] = c; bk[j][i] = best
    i = min(range(1, m + 1), key=lambda k: dp[n - 1][k]); esc = []
    for j in range(n - 1, 0, -1): esc.append(i - 1); i = bk[j][i]
    esc.reverse()
    pts = [ini] + [x for e in esc for x in meio[e]] + [fim]
    return [(round(pts[2 * k], 3), round(pts[2 * k + 1] + 0.02, 3)) for k in range(n)]
FONTES = {}
for q, c in CFG['fontes'].items():
    linhas = json.load(open(f"{D}/{c['texto']}"))
    jan = [tuple(x) for x in c['janelas']] if 'janelas' in c else janelas(f"{D}/{c['arquivo']}", linhas)
    al = alinha_janelas(f"{D}/{c['arquivo']}", linhas, jan)
    FONTES[q] = (c, al, jan)
    print(q, [(round(a, 2), round(b, 2)) for a, b in jan])
t = 0; out = []; inputs = []; filt = []
for k, (q, i, gap, fx) in enumerate(CFG['seq']):
    c, al, jan = FONTES[q]; sp = c.get('vel', 1.0)
    a, b = jan[i]; dur = (b - a) / sp
    t += gap
    pal = [[w, round(t + (tw - a) / sp, 3)] for w, tw in al[i][1]]
    out.append({'quem': q, 'i': i, 'ini': round(t, 3), 'fim': round(t + (al[i][2] - a) / sp, 3), 'palavras': pal})
    inputs += ['-ss', str(a), '-to', str(b), '-i', f"{D}/{c['arquivo']}"]
    af = (f'atempo={sp},' if sp != 1 else '') + (fx or 'anull')
    filt.append(f'[{k}:a]{af},adelay={int(t*1000)}:all=1[a{k}]')
    t += dur
DUR = round(t + CFG.get('cauda', 5.0), 2)
fc = ';'.join(filt) + ';' + ''.join(f'[a{k}]' for k in range(len(filt))) + f'amix=inputs={len(filt)}:normalize=0,apad,atrim=0:{DUR}[o]'
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', fc, '-map', '[o]', '-ar', '48000', f'{D}/voz_{ep}.wav'], check=True)
json.dump({'dur': DUR, 'linhas': out}, open(f'{D}/tl_{ep}.json', 'w'), ensure_ascii=False)
for k, l in enumerate(out): print(k, l['quem'], l['ini'], l['fim'], ' '.join(w for w, _ in l['palavras'])[:50])
print('DUR', DUR)
