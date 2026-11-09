import json, subprocess
from alinha import alinha_janelas, D
K = 1.08  # aceleração da narração
N = json.load(open('narr.json')); J = json.load(open('narr_jan.json'))
narr = alinha_janelas('narr.mp3', N, J)
car = alinha_janelas('carro.mp3', json.load(open('carro.json')), [(0, 1.5), (2.0, 4.12)])
ger = alinha_janelas('gerente.mp3', json.load(open('gerente.json')), [(0, 2.5)])
SEQ = [('n', 0, 0.15), ('n', 1, 0.45), ('n', 2, 0.35), ('n', 3, 0.4), ('n', 4, 0.3), ('n', 5, 0.45),
       ('c', 0, 0.45), ('n', 6, 0.35), ('c', 1, 0.4), ('n', 7, 0.35), ('n', 8, 0.5), ('n', 9, 0.45),
       ('g', 0, 0.35), ('n', 10, 0.5), ('n', 11, 0.35), ('n', 12, 0.9), ('n', 13, 0.35), ('n', 14, 0.4)]
FONTE = {'n': ('narr.mp3', narr, J, K), 'c': ('carro.mp3', car, [(0, 1.5), (2.0, 4.12)], 1.0), 'g': ('gerente.mp3', ger, [(0, 2.5)], 1.0)}
t = 0; linhas = []; inputs = []; filt = []
for k, (q, i, gap) in enumerate(SEQ):
    f, al, jan, sp = FONTE[q]
    a, b = jan[i]; dur = (b - a) / sp
    t += gap
    pal = [[w, round(t + (tw - a) / sp, 3)] for w, tw in al[i][1]]
    linhas.append({'quem': q, 'i': i, 'ini': round(t, 3), 'fim': round(t + (al[i][2] - a) / sp, 3), 'palavras': pal})
    inputs += ['-ss', str(a), '-to', str(b), '-i', f]
    af = f'atempo={sp}' if sp != 1 else 'anull'
    vol = {'n': 'volume=1.0', 'c': 'volume=1.1,aecho=0.6:0.5:40:0.25', 'g': 'volume=0.75,highpass=f=250,aecho=0.7:0.6:180|360:0.35|0.2'}[q]
    filt.append(f'[{k}:a]{af},{vol},adelay={int(t*1000)}:all=1[a{k}]')
    t += dur
DUR = round(t + 3.6, 2)
fc = ';'.join(filt) + ';' + ''.join(f'[a{k}]' for k in range(len(SEQ))) + f'amix=inputs={len(SEQ)}:normalize=0,apad,atrim=0:{DUR}[o]'
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', fc, '-map', '[o]', '-ar', '48000', f'{D}/voz.wav'], check=True)
json.dump({'dur': DUR, 'linhas': linhas}, open(f'{D}/tl.json', 'w'), ensure_ascii=False, indent=0)
for l in linhas: print(l['quem'], l['i'], l['ini'], l['fim'], ' '.join(w for w, _ in l['palavras'])[:60])
print('DUR', DUR)
