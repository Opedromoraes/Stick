// ============================================================
// REGRAS DA MADRUGADA · Ep. 02 "Regra nº 4"
// ============================================================
delete DEST.tres;
Object.assign(DEST, { quatro: 'amarelo', nome: 'perigo', responda: 'perigo', loja: 'perigo', propria: 'perigo', escuro: 'perigo', lampada: 'perigo', apagou: 'perigo', cinco: 'perigo', rafael: 'perigo', tras: 'perigo', luz: 'amarelo' });
const L = k => TL.linhas[k].ini, F = k => TL.linhas[k].fim;
const PW = (k, i) => TL.linhas[k].palavras[Math.min(i, TL.linhas[k].palavras.length - 1)][1];
const PWw = (k, re) => { const p = TL.linhas[k].palavras.find(([w]) => re.test(NORM(w))); return p ? p[1] : L(k); };

// ---------- loja por dentro ----------
const escuro = document.createElement('canvas'); escuro.width = W; escuro.height = H;
const ex = escuro.getContext('2d');
const LAMP = [[200, 330], [540, 300], [880, 330], [540, 620]];
// luzes: [l0..l3] 0..1 ; atras: aparição no corredor {a, sorriso}
function loja(t, o = {}) {
  const luz = o.luzes ?? [1, 1, 1, 1];
  ctx.fillStyle = '#2A2F3A'; ctx.fillRect(-400, -400, W + 800, H + 800);
  // teto
  ctx.fillStyle = '#20242E'; ctx.fillRect(-400, 0, W + 800, 420);
  // fundo: corredor escuro no centro
  ctx.fillStyle = '#353B48'; ctx.fillRect(-400, 420, W + 800, 900);
  ctx.fillStyle = '#05050A'; ctx.fillRect(450, 640, 180, 560);
  ctx.strokeStyle = '#4A5160'; ctx.lineWidth = 10; ctx.strokeRect(450, 640, 180, 560);
  if (o.atras) { const a = o.atras; ctx.globalAlpha = a.a ?? 1; circ(520, 860, 5, '#FFF4C2'); circ(552, 860, 5, '#FFF4C2'); glow(536, 860, 40, '255,244,194', 0.3); if (a.sorriso) { ctx.strokeStyle = '#EDE6D6'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(536, 880, 16 + 30 * a.sorriso, 0.25, Math.PI - 0.25); ctx.stroke(); } ctx.globalAlpha = 1; }
  // prateleiras à esquerda
  for (let i = 0; i < 4; i++) { ctx.fillStyle = '#4B3A2E'; ctx.fillRect(-60, 560 + i * 170, 460, 18); for (let j = 0; j < 9; j++) { ctx.fillStyle = ['#D9363E', '#FFD54A', '#3E8EDE', '#1E9C6B'][(i + j) % 4]; rr(-40 + j * 48, 470 + i * 170, 36, 88, 6); ctx.fill(); } }
  // geladeiras à direita
  for (let i = 0; i < 2; i++) {
    const x = 680 + i * 210; ctx.fillStyle = '#1B2230'; ctx.fillRect(x, 480, 190, 760);
    ctx.fillStyle = 'rgba(200,255,235,0.55)'; ctx.fillRect(x + 14, 500, 162, 720);
    for (let j = 0; j < 4; j++) { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x + 14, 640 + j * 160, 162, 8); for (let k = 0; k < 4; k++) { ctx.fillStyle = ['#D9363E', '#7CFFB2', '#3E8EDE', '#FFD54A'][(j + k) % 4]; rr(x + 24 + k * 38, 572 + j * 160, 28, 64, 6); ctx.fill(); } }
  }
  // relógio na parede
  ctx.fillStyle = '#0F1220'; rr(70, 180, 260, 90, 14); ctx.fill();
  ctx.fillStyle = COR.perigo; ctx.font = '62px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.hora ?? '03:17', 200, 226);
  // chão
  ctx.fillStyle = '#C9C5BA'; ctx.fillRect(-400, 1240, W + 800, 700);
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 3; for (let x = -400; x < W + 400; x += 120) { ctx.beginPath(); ctx.moveTo(x, 1240); ctx.lineTo(540 + (x - 540) * 2.2, 1920); ctx.stroke(); }
  // lâmpadas (tubos)
  LAMP.forEach(([x, y], i) => { const k = luz[i] ?? 0; ctx.fillStyle = k > 0.5 ? '#F4FFF8' : '#3A3F4A'; rr(x - 110, y - 10, 220, 20, 10); ctx.fill(); });
  // frentista atrás do balcão
  if (!o.semFrentista) frentista(o.fx ?? 540, 1800, 1.3, Object.assign({ t }, o.f || {}));
  // balcão
  ctx.fillStyle = '#1E9C6B'; ctx.fillRect(-400, 1560, W + 800, 400); ctx.fillStyle = '#E8E4DA'; ctx.fillRect(-400, 1540, W + 800, 40);
  ctx.fillStyle = '#157552'; ctx.fillRect(-400, 1640, W + 800, 14);
  // telefone no balcão
  const tr = o.toca ? Math.sin(t * 60) * 5 : 0;
  ctx.save(); ctx.translate(820 + tr, 1500);
  ctx.fillStyle = '#D8D0BC'; rr(-80, -30, 160, 70, 14); ctx.fill(); ctx.strokeStyle = COR.T; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = '#D8D0BC'; ctx.save(); ctx.translate(0, -40 - (o.toca ? Math.abs(Math.sin(t * 30)) * 6 : 0)); rr(-90, -16, 180, 32, 16); ctx.fill(); ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#7CFFB2'; ctx.fillRect(-40, -12, 80, 20);
  ctx.restore();
  // escuridão por lâmpada
  ex.globalCompositeOperation = 'source-over'; ex.clearRect(0, 0, W, H);
  ex.fillStyle = `rgba(0,0,0,${o.base ?? 0.93})`; ex.fillRect(0, 0, W, H);
  ex.globalCompositeOperation = 'destination-out';
  const m = ctx.getTransform();
  LAMP.forEach(([x, y], i) => {
    const k = luz[i] ?? 0; if (k <= 0) return;
    const p = m.transformPoint(new DOMPoint(x, y + 420)); const r = 560 * m.a;
    const g = ex.createRadialGradient(p.x, p.y, 0, p.x, p.y, r); g.addColorStop(0, `rgba(0,0,0,${k})`); g.addColorStop(0.5, `rgba(0,0,0,${0.85 * k})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    ex.fillStyle = g; ex.fillRect(0, 0, W, H);
  });
  if (o.spot) { const p = m.transformPoint(new DOMPoint(540, 1420)); const r = 330 * m.a; const g = ex.createRadialGradient(p.x, p.y - 200 * m.a, 0, p.x, p.y, r); g.addColorStop(0, `rgba(0,0,0,${o.spot})`); g.addColorStop(0.6, `rgba(0,0,0,${0.8 * o.spot})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ex.fillStyle = g; ex.fillRect(0, 0, W, H); }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(escuro, 0, 0); ctx.restore();
  // flicker do tubo
  if (o.atras && o.atras.a > 0) { ctx.save(); ctx.setTransform(m); ctx.globalAlpha = o.atras.a; circ(520, 860, 5, '#FFF4C2'); circ(552, 860, 5, '#FFF4C2'); ctx.restore(); }
}

// ---------- papel da regra 4 ----------
function papel4(z, blur, rot = 0.03) {
  ctx.fillStyle = '#0D0B18'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 1050); ctx.scale(z, z); ctx.rotate(rot);
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 40; ctx.fillStyle = COR.papel; ctx.fillRect(-380, -470, 760, 940); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(80,120,200,0.25)'; ctx.lineWidth = 3; for (let y = -330; y < 440; y += 70) { ctx.beginPath(); ctx.moveTo(-350, y); ctx.lineTo(350, y); ctx.stroke(); }
  ctx.fillStyle = '#1B2240'; ctx.font = '80px "Caveat"'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText('TURNO DA NOITE', -260, -350);
  ctx.fillStyle = '#C0262D'; ctx.font = '170px "Caveat"'; ctx.fillText('4.', -260, -110);
  ctx.save(); if (blur > 0.2) ctx.filter = `blur(${blur}px)`; ctx.fillStyle = '#1B2240'; ctx.font = '64px "Caveat"';
  ['Se ele voltar e te chamar', 'pelo nome, NÃO responda.', 'Ele não é o gerente.'].forEach((l, i) => ctx.fillText(l, -265, 20 + i * 90));
  ctx.restore();
  ctx.restore();
  glow(540, 900, 900, COR.luz, 0.08);
  maos(540, 1560, 1);
  vinheta(0.6);
}

// ---------- telefone da loja (close) ----------
function telefoneClose(t, tela, toca, z = 1, destaque = 0) {
  ctx.fillStyle = '#08070D'; ctx.fillRect(0, 0, W, H);
  glow(540, 1000, 800, COR.luz, 0.1);
  ctx.save(); ctx.translate(540 + (toca ? Math.sin(t * 60) * 6 : 0), 1080); ctx.scale(z, z);
  ctx.fillStyle = '#D8D0BC'; ctx.strokeStyle = COR.T; ctx.lineWidth = 10;
  rr(-420, -160, 840, 420, 50); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.translate(0, -230 - (toca ? Math.abs(Math.sin(t * 30)) * 14 : 0)); rr(-460, -70, 920, 140, 70); ctx.fill(); ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#0F2A1C'; rr(-300, -110, 600, 170, 16); ctx.fill();
  ctx.fillStyle = '#7CFFB2'; ctx.font = '50px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  tela.forEach((l, i) => { ctx.fillStyle = i === 1 && destaque ? `rgb(${lerp(124, 255, destaque)},${lerp(255, 90, destaque)},${lerp(178, 95, destaque)})` : '#7CFFB2'; ctx.fillText(l, 0, -60 + i * 64); });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { ctx.fillStyle = '#C2B9A2'; rr(-250 + c * 130, 100 + r * 50, 110, 36, 10); ctx.fill(); }
  ctx.restore();
  vinheta(0.7);
}

// ---------- celular com a mensagem ----------
function celular(t, msg, vib, z = 1) {
  ctx.fillStyle = '#05050A'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540 + (vib ? Math.sin(t * 70) * 7 : 0), 1060); ctx.scale(z, z);
  ctx.fillStyle = '#111'; rr(-300, -560, 600, 1120, 70); ctx.fill(); ctx.strokeStyle = '#333'; ctx.lineWidth = 8; ctx.stroke();
  const g = ctx.createLinearGradient(0, -520, 0, 520); g.addColorStop(0, '#1B2448'); g.addColorStop(1, '#0B0F20');
  ctx.fillStyle = g; rr(-270, -530, 540, 1060, 50); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '120px "Archivo Black"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('03:21', 0, -330);
  ctx.font = '34px "Archivo Black"'; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillText('terça-feira', 0, -240);
  if (msg > 0) {
    ctx.globalAlpha = clamp(msg * 3);
    ctx.fillStyle = 'rgba(240,240,245,0.95)'; rr(-250, -150, 500, 260, 34); ctx.fill();
    ctx.fillStyle = '#1E9C6B'; rr(-225, -125, 60, 60, 14); ctx.fill();
    ctx.fillStyle = '#111'; ctx.textAlign = 'left'; ctx.font = '32px "Archivo Black"'; ctx.fillText('Gerente Almir', -150, -95);
    ctx.font = '30px "Archivo Black"'; ctx.fillStyle = '#222';
    const txt = 'Não olha pra trás.', txt2 = 'Regra 5.';
    ctx.fillText(txt.slice(0, Math.floor(txt.length * clamp(msg * 2))), -220, -10);
    ctx.fillStyle = '#C0262D'; ctx.fillText(txt2.slice(0, Math.floor(txt2.length * clamp(msg * 2 - 1))), -220, 50);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  glow(540, 1000, 700, '120,140,255', 0.12);
  vinheta(0.6);
}

// ========== cenas (tempos amarrados às falas) ==========
function cenaGancho(t, u) { papel4(lerp(1.0, 1.1, u / 4), Math.max(0, 9 - u * 7)); }
function cenaNoite2(t, u) {
  camera(lerp(360, 420, u / 5), 1250, 1.15, () => { posto({ t }); frentista(220, 1790, 1.25, { t, ox: 0.3, oy: -0.2, bE: 0.15, bD: -0.15 }); });
  vinheta(0.6);
}
function cenaDecora(t, u) {
  const k = 2, fala = t > L(2) && t < F(2);
  camera(380, 1260, 1.45, () => {
    posto({ t });
    gerente(560, 1790, 1.2, { t, ox: -0.7, sob: 0.4, boca: fala ? 'fala' : 'reta', fala: Math.abs(Math.sin(t * 12)), bD: -2.6 + Math.sin(t * 9) * 0.25 });
    frentista(220, 1790, 1.25, { t, ox: 0.7, sob: 0.5, boca: 'reta', segura: 'papel', bD: -1.1 });
  });
  vinheta(0.6);
}
function cenaToca(t, u) {
  camera(560, 1250, lerp(1.0, 1.15, u / 3), () => loja(t, { toca: true, f: { ox: 0.8, oy: 0.4, sob: 0.8, boca: 'medo' } }));
  vinheta(0.55);
}
function cenaLigacao(t, u) { telefoneClose(t, ['RAMAL 01', 'CHAMANDO...'], false, lerp(1.0, 1.1, u / 3)); }
function cenaNumero(t, u) {
  const k = faixa(t, PWw(5, /propria/) - 0.3, PWw(5, /propria/) + 0.2);
  telefoneClose(t, ['DE: LOJA 24H', 'ESTE APARELHO'], false, lerp(1.1, 1.6, faixa(t, L(5), F(5))), k);
}
function cenaDesliga(t, u) {
  telefoneClose(t, ['CHAMADA', 'ENCERRADA'], false, 1.2);
}
function cenaCorredor(t, u) {
  const k = faixa(t, L(7) + 0.4, F(7));
  camera(lerp(560, 540, k), lerp(1250, 920, k), lerp(1.0, 1.9, k), () => loja(t, { f: { ox: 0, oy: -0.5, sob: 0.9, boca: 'medo' } }));
  vinheta(0.6);
}
function cenaVoz(t, u) {
  camera(540, 900, lerp(2.4, 2.9, u / 3), () => loja(t, { atras: { a: faixa(u, 0.3, 1.0) }, f: { ox: 0, oy: -0.5 } }));
  chuva(t, 0); vinheta(0.75);
}
function cenaQuieto(t, u) {
  camera(540, 1420, lerp(1.9, 2.1, u / 3), () => loja(t, { f: { ox: -0.2, oy: -0.4, sob: 1, boca: 'nervoso', suor: true, treme: 2 } }));
  vinheta(0.6);
}
function cenaApaga(t, u) {
  const a1 = PWw(10, /apagou/), a2 = PWw(10, /outra/), a3 = PWw(10, /perto/);
  const l0 = t < a1 ? 1 : 0, l2 = t < a2 ? 1 : 0, l3 = t < a3 ? 1 : 0;
  camera(560, 1150, 1.0, () => loja(t, { luzes: [l0, 1, l2, l3], atras: { a: 0.6 }, f: { ox: 0, oy: -0.4, sob: 1, boca: 'nervoso', suor: true } }));
  vinheta(0.6);
}
function cenaVoz2(t, u) {
  camera(540, 900, lerp(2.0, 2.6, u / 3), () => loja(t, { luzes: [0, 1, 0, 0], base: 0.97, atras: { a: 1, sorriso: faixa(u, 0.3, 2.0) }, semFrentista: true }));
  vinheta(0.8);
}
function cenaUltima(t, u) {
  camera(540, 1350, lerp(1.4, 1.7, u / 3), () => loja(t, { luzes: [0, 0, 0, 0], spot: Math.sin(t * 40) > -0.8 ? 1 : 0.5, base: 0.985, f: { ox: 0, oy: 0, sob: 1, boca: 'medo', suor: true, treme: 3 } }));
  vinheta(0.75);
}
function cenaVibra(t, u) { celular(t, 0, true, lerp(1.0, 1.08, u / 3)); }
function cenaMensagem(t, u) {
  const fimMsg = F(14);
  if (t < fimMsg + 0.15) { celular(t, faixa(t, L(14), fimMsg) * 1.0 + 0.001, false, lerp(1.08, 1.3, faixa(t, L(14), fimMsg))); return; }
  // corte: ele debaixo da luz e, atrás, no escuro, o sorriso enorme
  camera(540, 1350, 1.6, () => loja(t, { luzes: [0, 0, 0, 0], spot: 1, base: 0.985, f: { ox: 0, oy: 0.2, sob: 1, boca: 'medo', suor: true } }));
  const k = faixa(t, fimMsg + 0.2, fimMsg + 0.6);
  ctx.save(); ctx.globalAlpha = k;
  circ(210, 470, 14, '#FFF4C2'); circ(290, 470, 14, '#FFF4C2'); glow(250, 470, 120, '255,244,194', 0.3);
  ctx.fillStyle = '#EDE6D6'; for (let i = 0; i < 18; i++) { const uu = i / 17; ctx.fillRect(lerp(90, 410, uu) - 7, 540 + Math.sin(uu * Math.PI) * 60, 14, 22); }
  ctx.restore();
  const choque = faixa(t, fimMsg + 0.2, fimMsg + 0.3) * (1 - faixa(t, fimMsg + 0.3, fimMsg + 1.1));
  if (choque > 0) vinheta(0.85 * choque, '229,72,77');
  vinheta(0.6);
}
function cenaFim(t, u) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (u < 0.12) { ctx.fillStyle = 'rgba(229,72,77,0.35)'; ctx.fillRect(0, 0, W, H); }
  const a = k => faixa(u, k, k + 0.35);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.globalAlpha = a(0); ctx.fillStyle = '#fff'; ctx.font = '104px "Archivo Black"';
  ctx.fillText('VOCÊ', 540, 820); ctx.fillStyle = COR.perigo; ctx.fillText('RESPONDERIA?', 540, 940);
  ctx.globalAlpha = a(0.6); ctx.fillStyle = COR.amarelo; ctx.font = '44px "Archivo Black"'; ctx.fillText('COMENTA AÍ', 540, 1080);
  ctx.globalAlpha = a(1.0); ctx.fillStyle = '#8A90A0'; ctx.font = '40px "Archivo Black"';
  ctx.fillText('REGRAS DA MADRUGADA · EP. 2', 540, 1240); ctx.fillText('@continuaamanha.tv', 540, 1300);
  ctx.globalAlpha = 1;
}

const _b = [0, L(1) - 0.3, L(2) - 0.25, L(3) - 0.3, L(4) - 0.15, L(5) - 0.15, L(6) - 0.15, L(7) - 0.2, L(8) - 0.15, L(9) - 0.2, L(10) - 0.2, L(11) - 0.15, L(12) - 0.2, L(13) - 0.2, L(14) - 0.15, F(14) + 1.6];
const _f = [cenaGancho, cenaNoite2, cenaDecora, cenaToca, cenaLigacao, cenaNumero, cenaDesliga, cenaCorredor, cenaVoz, cenaQuieto, cenaApaga, cenaVoz2, cenaUltima, cenaVibra, cenaMensagem];
const CENAS = _f.map((f, i) => [_b[i], _b[i + 1], f]).concat([[_b[15], 999, cenaFim]]);
