import re, subprocess, json, sys
D = '/tmp/claude-0/-home-claude/2fe2cedc-b205-5850-a0d8-7f4fa33ecd38/scratchpad/rm'

def silencios(f, nz=-35, d=0.25):
    o = subprocess.run(['ffmpeg', '-i', f, '-af', f'silencedetect=noise={nz}dB:d={d}', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', o)]
    e = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', o)]
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
    sil = list(zip(s, e + [dur] * (len(s) - len(e))))
    return sil, dur

def peso(w):
    return len(re.sub(r'[^\wÀ-ú]', '', w)) + 1.5

def alinha(f, linhas):
    """linhas: lista de strings. devolve [(linha_idx, [(palavra, t_ini)], t_fim_linha)] em tempo do arquivo."""
    sil, dur = silencios(f)
    ini = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
    sil = [x for x in sil if x[0] > 0.05]
    fim = sil[-1][0] if sil and sil[-1][1] >= dur - 0.05 else dur
    sil = [x for x in sil if x[1] < dur - 0.05]
    # palavras com marca de fronteira (pontuação)
    pal = []
    for li, l in enumerate(linhas):
        ws = l.split()
        for k, w in enumerate(ws):
            fr = 2 if k == len(ws) - 1 else (1 if re.search(r'[.,:;!?…]$', w) else 0)
            pal.append([li, w, peso(w), fr])
    # tempo de fala (sem silêncios)
    fala = (fim - ini) - sum(b - a for a, b in sil)
    tot = sum(p[2] for p in pal)
    # posição esperada (em tempo de fala) do fim de cada palavra-fronteira
    acc = 0; cand = []
    for i, p in enumerate(pal):
        acc += p[2]
        if p[3] and i < len(pal) - 1: cand.append((i, acc / tot * fala, p[3]))
    # posição de cada silêncio em tempo de fala
    pos = []; perdido = 0; ant = ini
    for a, b in sil:
        pos.append((a - ini - perdido, a, b)); perdido += b - a
    # casa silêncios com fronteiras por programação dinâmica (ordem preservada, todo silêncio casa)
    n, m = len(pos), len(cand); INF = 1e9
    dp = [[INF] * (m + 1) for _ in range(n + 1)]; bk = [[None] * (m + 1) for _ in range(n + 1)]
    for j in range(m + 1): dp[0][j] = 0
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            # silêncio i casa com cand j-1, ou cand j-1 fica sem silêncio
            c = dp[i - 1][j - 1] + abs(cand[j - 1][1] - pos[i - 1][0]) - (0.6 if cand[j - 1][2] == 2 else 0) + (0.8 if cand[j - 1][2] == 2 and False else 0)
            if c < dp[i][j]: dp[i][j] = c; bk[i][j] = 'casa'
            if dp[i][j - 1] + (1.2 if cand[j - 1][2] == 2 else 0) < dp[i][j]: dp[i][j] = dp[i][j - 1] + (1.2 if cand[j - 1][2] == 2 else 0); bk[i][j] = 'pula'
    i, j = n, m; usados = []
    # permite candidatos finais sem silêncio
    j = min(range(m + 1), key=lambda jj: dp[n][jj] + sum(1.2 for c in cand[jj:] if c[2] == 2))
    while i > 0:
        if bk[i][j] == 'casa': usados.append((cand[j - 1][0], pos[i - 1][1], pos[i - 1][2])); i -= 1; j -= 1
        else: j -= 1
    usados.reverse()
    # monta trechos: [palavra_i0..i1] falados entre t0 e t1
    cortes = [(-1, None, ini)] + usados + [(len(pal) - 1, fim, None)]
    tempos = [0] * len(pal); fimp = [0] * len(pal)
    for k in range(len(cortes) - 1):
        i0 = cortes[k][0] + 1; i1 = cortes[k + 1][0]
        t0 = cortes[k][2]; t1 = cortes[k + 1][1]
        ws = pal[i0:i1 + 1]; tt = sum(p[2] for p in ws); t = t0
        for m, p in enumerate(ws):
            tempos[i0 + m] = t; t += p[2] / tt * (t1 - t0); fimp[i0 + m] = t
    out = []
    for li in range(len(linhas)):
        idx = [i for i, p in enumerate(pal) if p[0] == li]
        out.append((li, [(pal[i][1], tempos[i]) for i in idx], fimp[idx[-1]]))
    return out

if __name__ == '__main__':
    import pprint
    pprint.pprint(alinha(sys.argv[1], json.load(open(sys.argv[2]))))

def alinha_janelas(f, linhas, janelas):
    """janelas: [(t_ini, t_fim)] por linha (tempo do arquivo). Alinha cada linha dentro da sua janela."""
    import os, tempfile
    out = []
    for li, (l, (a, b)) in enumerate(zip(linhas, janelas)):
        tmp = f'{D}/_jan.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(a), '-to', str(b), '-i', f, tmp], check=True)
        r = alinha(tmp, [l])[0]
        out.append((li, [(w, a + t) for w, t in r[1]], a + r[2]))
    return out
