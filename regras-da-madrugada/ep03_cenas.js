// ============================================================
// REGRAS DA MADRUGADA · Ep. 03 "Regra nº 5"
// ============================================================
delete DEST.tres;
Object.assign(DEST, { cinco: 'amarelo', apagar: 'perigo', tras: 'perigo', caiu: 'perigo', letreiro: 'amarelo', passos: 'perigo', rafael: 'perigo', rosto: 'perigo', reflexo: 'perigo', seis: 'amarelo', porta: 'perigo', mesmo: 'perigo', ninguem: 'perigo' });
const L = k => TL.linhas[k].ini, F = k => TL.linhas[k].fim;
const PWw = (k, re) => { const p = TL.linhas[k].palavras.find(([w]) => re.test(NORM(w))); return p ? p[1] : L(k); };

// reaproveita a loja do Ep. 02
const escuro = document.createElement('canvas'); escuro.width = W; escuro.height = H;
const ex = escuro.getContext('2d');
const LAMP = [[200, 330], [540, 300], [880, 330], [540, 620]];
function loja(t, o = {}) {
  const luz = o.luzes ?? [1, 1, 1, 1];
  ctx.fillStyle = '#2A2F3A'; ctx.fillRect(-400, -400, W + 800, H + 800);
  ctx.fillStyle = '#20242E'; ctx.fillRect(-400, 0, W + 800, 420);
  ctx.fillStyle = '#353B48'; ctx.fillRect(-400, 420, W + 800, 900);
  ctx.fillStyle = '#05050A'; ctx.fillRect(450, 640, 180, 560);
  ctx.strokeStyle = '#4A5160'; ctx.lineWidth = 10; ctx.strokeRect(450, 640, 180, 560);
  for (let i = 0; i < 4; i++) { ctx.fillStyle = '#4B3A2E'; ctx.fillRect(-60, 560 + i * 170, 460, 18); for (let j = 0; j < 9; j++) { ctx.fillStyle = ['#D9363E', '#FFD54A', '#3E8EDE', '#1E9C6B'][(i + j) % 4]; rr(-40 + j * 48, 470 + i * 170, 36, 88, 6); ctx.fill(); } }
  for (let i = 0; i < 2; i++) { const x = 680 + i * 210; ctx.fillStyle = '#1B2230'; ctx.fillRect(x, 480, 190, 760); ctx.fillStyle = `rgba(200,255,235,${luz[2] ? 0.55 : 0.08})`; ctx.fillRect(x + 14, 500, 162, 720); }
  ctx.fillStyle = '#C9C5BA'; ctx.fillRect(-400, 1240, W + 800, 700);
  LAMP.forEach(([x, y], i) => { const k = luz[i] ?? 0; ctx.fillStyle = k > 0.5 ? '#F4FFF8' : '#3A3F4A'; rr(x - 110, y - 10, 220, 20, 10); ctx.fill(); });
  if (o.antes) o.antes();
  if (!o.semFrentista) frentista(o.fx ?? 540, 1800, 1.3, Object.assign({ t }, o.f || {}));
  ctx.fillStyle = '#1E9C6B'; ctx.fillRect(-400, 1560, W + 800, 400); ctx.fillStyle = '#E8E4DA'; ctx.fillRect(-400, 1540, W + 800, 40);
  ex.globalCompositeOperation = 'source-over'; ex.clearRect(0, 0, W, H);
  ex.fillStyle = `rgba(0,0,0,${o.base ?? 0.93})`; ex.fillRect(0, 0, W, H);
  ex.globalCompositeOperation = 'destination-out';
  const m = ctx.getTransform();
  LAMP.forEach(([x, y], i) => { const k = luz[i] ?? 0; if (k <= 0) return; const p = m.transformPoint(new DOMPoint(x, y + 420)); const r = 560 * m.a; const g = ex.createRadialGradient(p.x, p.y, 0, p.x, p.y, r); g.addColorStop(0, `rgba(0,0,0,${k})`); g.addColorStop(0.5, `rgba(0,0,0,${0.85 * k})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ex.fillStyle = g; ex.fillRect(0, 0, W, H); });
  if (o.spot) { const p = m.transformPoint(new DOMPoint(540, 1420)); const r = 330 * m.a; const g = ex.createRadialGradient(p.x, p.y - 200 * m.a, 0, p.x, p.y, r); g.addColorStop(0, `rgba(0,0,0,${o.spot})`); g.addColorStop(0.6, `rgba(0,0,0,${0.8 * o.spot})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ex.fillStyle = g; ex.fillRect(0, 0, W, H); }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(escuro, 0, 0); ctx.restore();
  if (o.depois) o.depois();
}

// o duplo: o mesmo rosto do frentista, olhos pretos e sorriso largo demais
function duble(x, fy, s, t, rosto = 1) {
  frentista(x, fy, s, { t, boca: 'reta', ox: 0, aberto: 1 });
  ctx.save(); ctx.translate(x, fy); ctx.scale(s, s); ctx.globalAlpha = rosto;
  circ(-36, -365, 27, '#000'); circ(36, -365, 27, '#000'); circ(-30, -370, 4, '#FFF4C2'); circ(42, -370, 4, '#FFF4C2');
  ctx.fillStyle = '#2A0E10'; ctx.beginPath(); ctx.moveTo(-85, -320); ctx.quadraticCurveTo(0, -250, 85, -320); ctx.quadraticCurveTo(0, -290, -85, -320); ctx.fill();
  ctx.fillStyle = '#F4F0E4'; for (let i = 0; i < 14; i++) { const u = (i + 0.5) / 14, xx = lerp(-78, 78, u), yy = -318 + Math.sin(u * Math.PI) * 22; ctx.fillRect(xx - 4, yy - 2, 8, 12); }
  ctx.restore();
}

// letreiro 24H visto de dentro, pela vitrine
function letreiro(t, z = 1, piscar = 0) {
  ctx.fillStyle = '#030305'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 900); ctx.scale(z, z);
  const on = piscar && Math.sin(t * 25) < -0.85 ? 0.4 : 1;
  glow(0, 0, 700, '255,90,95', 0.35 * on);
  ctx.fillStyle = '#1D0B0D'; rr(-300, -110, 600, 220, 20); ctx.fill();
  ctx.fillStyle = `rgba(255,${lerp(90, 120, on)},95,${on})`; ctx.font = '170px "Archivo Black"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('24H', 0, 8);
  ctx.restore();
  // caixilho da vitrine
  ctx.strokeStyle = '#151820'; ctx.lineWidth = 40; ctx.strokeRect(-20, 300, W + 40, 1200); ctx.beginPath(); ctx.moveTo(960, 300); ctx.lineTo(960, 1500); ctx.stroke();
  vinheta(0.7);
}

// frentista em close, iluminado só pelo vermelho do letreiro
function closeVermelho(t, o = {}, z = 1) {
  ctx.fillStyle = '#050304'; ctx.fillRect(0, 0, W, H);
  glow(540, 1500, 1000, '229,72,77', 0.22);
  ctx.save(); ctx.translate(540, 1150); ctx.scale(z, z); ctx.translate(-540, -1150);
  if (o.atras) { const a = o.atras; ctx.globalAlpha = a; circ(820, 560, 12, '#FFF4C2'); circ(880, 560, 12, '#FFF4C2'); glow(850, 560, 100, '255,244,194', 0.25 * a); ctx.globalAlpha = 1; }
  frentista(540, 1900, 2.3, Object.assign({ t }, o.f || {}));
  ctx.restore();
  ctx.fillStyle = 'rgba(229,72,77,0.16)'; ctx.fillRect(0, 0, W, H);
  if (o.sombra) { ctx.globalAlpha = o.sombra.a; ctx.fillStyle = '#000'; const sx = o.sombra.x; rr(sx - 160, 300, 320, 1700, 140); ctx.fill(); ctx.beginPath(); ctx.ellipse(sx, 380, 150, 170, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
  vinheta(0.75);
}

// vidro da porta: reflexo do frentista e do duplo
function vidro(t, o = {}) {
  ctx.fillStyle = '#06070B'; ctx.fillRect(0, 0, W, H);
  glow(760, 520, 520, '255,90,95', 0.3);
  const z = o.z ?? 1;
  ctx.save(); ctx.translate(540, o.sy ?? 1300); ctx.scale(z, z); ctx.translate(-540, -(o.cy ?? 1300));
  ctx.globalAlpha = 0.5; frentista(380, 1900, 1.5, { t, ox: 0, sob: 1, boca: 'medo', suor: true }); ctx.globalAlpha = 1;
  if (o.duble) { ctx.globalAlpha = 0.55 * o.duble.a; duble(720, 1900, 1.5, t, o.duble.rosto); ctx.globalAlpha = 1; }
  ctx.restore();
  // vidro: tom azulado, reflexos diagonais, caixilho
  ctx.fillStyle = 'rgba(120,150,200,0.08)'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.moveTo(100, 0); ctx.lineTo(300, 0); ctx.lineTo(-100, 1920); ctx.lineTo(-300, 1920); ctx.fill();
  if (o.fog) { ctx.fillStyle = `rgba(200,210,225,${0.28 * o.fog})`; ctx.fillRect(0, 0, W, H); }
  if (o.escrita) {
    const linhas = ['REGRA 6:', 'NÃO ABRA', 'A PORTA', 'PRA VOCÊ', 'MESMO.'];
    const tot = linhas.join('').length; let n = Math.floor(tot * o.escrita);
    ctx.save(); ctx.translate(540, 700); ctx.rotate(-0.05);
    ctx.font = '120px "Caveat"'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(15,18,28,0.85)';
    linhas.forEach((l, i) => { const k = Math.max(0, Math.min(l.length, n)); n -= l.length; if (k > 0) ctx.fillText(l.slice(0, k), 0, i * 130); });
    ctx.restore();
  }
  ctx.strokeStyle = '#2A2F3A'; ctx.lineWidth = 50; ctx.strokeRect(0, 0, W, H);
  ctx.fillStyle = '#8A8F9C'; rr(940, 900, 30, 260, 12); ctx.fill();
  vinheta(0.65);
}

// ========== cenas ==========
function cenaGancho(t, u) {
  const ap = PWw(0, /apagar/);
  const spot = t < ap ? (Math.sin(t * 30) > -0.6 ? 1 : 0.3) : 0;
  camera(540, 1350, lerp(1.5, 1.7, u / 5), () => loja(t, { luzes: [0, 0, 0, 0], spot, base: 0.985, f: { ox: 0, oy: -0.2, sob: 1, boca: 'medo', suor: true } }));
  if (t >= ap) { glow(540, 1500, 900, '229,72,77', 0.18); const k = faixa(t, ap + 0.6, ap + 1.2); ctx.globalAlpha = k; circ(330, 700, 12, '#FFF4C2'); circ(390, 700, 12, '#FFF4C2'); glow(360, 700, 100, '255,244,194', 0.3 * k); ctx.globalAlpha = 1; }
  vinheta(0.7);
}
function cenaTroca(t, u) {
  camera(560, 1300, 1.05, () => loja(t, { base: 0.5, antes: () => gerente(220, 1800, 1.2, { t, ox: 0.7, boca: t < F(1) ? 'fala' : 'sorri', fala: Math.abs(Math.sin(t * 11)), bD: -2.6 }), fx: 700, f: { ox: -0.6, sob: 0.4, boca: 'reta' } }));
  vinheta(0.5);
}
function cenaQueda(t, u) {
  const c = PWw(2, /caiu/);
  const on = t < c ? 1 : 0;
  camera(560, 1250, 1.05, () => loja(t, { luzes: [on, on, on, on], base: on ? 0.5 : 0.985, f: { ox: 0, oy: -0.5, sob: on ? 0.3 : 1, boca: on ? 'reta' : 'medo' } }));
  const ch = faixa(t, c, c + 0.08) * (1 - faixa(t, c + 0.08, c + 0.8));
  if (ch > 0) vinheta(0.7 * ch, '229,72,77');
  vinheta(0.6);
}
function cenaLetreiro(t, u) { letreiro(t, lerp(1, 1.12, u / 4), 1); }
function cenaPassos(t, u) { closeVermelho(t, { f: { ox: 0.6, oy: -0.1, sob: 1, boca: 'medo', suor: true } }, lerp(1, 1.08, u / 3)); }
function cenaChama(t, u) { closeVermelho(t, { atras: faixa(u, 0.1, 0.6), f: { ox: 0.3, sob: 1, boca: 'medo', suor: true, treme: 2 } }, 1.08); }
function cenaNaoOlha(t, u) { closeVermelho(t, { atras: 1 - faixa(u, 1.2, 2), f: { ox: 0, oy: -0.3, sob: 1, boca: 'nervoso', suor: true, treme: 3 } }, lerp(1.08, 1.2, u / 2)); }
function cenaVolta(t, u) {
  const v = PWw(7, /volta/), l = PWw(7, /lado/);
  const sx = t < v ? -400 : lerp(-200, 1000, faixa(t, v, l));
  closeVermelho(t, { sombra: { a: t > v ? 0.9 : 0, x: sx }, f: { ox: t > l ? 1 : 0, oy: -0.2, sob: 1, boca: 'nervoso', suor: true, treme: 2 } }, 1.15);
}
function cenaReflexo(t, u) { vidro(t, { z: lerp(1, 1.1, u / 3), duble: { a: faixa(u, 0.5, 1.5), rosto: 0 } }); }
function cenaRosto(t, u) {
  vidro(t, { sy: 1100, cy: 1520, z: lerp(1.7, 1.95, u / 1.3), duble: { a: 1, rosto: faixa(u, 0.1, 0.3) } });
  const ch = faixa(u, 0.1, 0.18) * (1 - faixa(u, 0.18, 1.0));
  if (ch > 0) vinheta(0.85 * ch, '229,72,77');
}
function cenaVoltou(t, u) {
  camera(560, 1300, 1.05, () => loja(t, { base: 0.5, f: { ox: 0.8, oy: 0.1, sob: 0.8, boca: 'medo', suor: true } }));
  vinheta(0.5);
}
function cenaEscrita(t, u) {
  const k = faixa(t, L(11) + 0.6, F(12) - 0.2);
  const fim = F(12);
  vidro(t, { fog: 1, escrita: k, duble: t > fim + 0.25 ? { a: 1.4, rosto: 1 } : null, z: t > fim + 0.25 ? 1.25 : 1 });
  const ch = faixa(t, fim + 0.25, fim + 0.35) * (1 - faixa(t, fim + 0.35, fim + 1.2));
  if (ch > 0) vinheta(0.85 * ch, '229,72,77');
}
function cenaFim(t, u) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (u < 0.12) { ctx.fillStyle = 'rgba(229,72,77,0.35)'; ctx.fillRect(0, 0, W, H); }
  const a = k => faixa(u, k, k + 0.35);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.globalAlpha = a(0); ctx.fillStyle = '#fff'; ctx.font = '104px "Archivo Black"';
  ctx.fillText('VOCÊ', 540, 820); ctx.fillStyle = COR.perigo; ctx.fillText('OLHARIA?', 540, 940);
  ctx.globalAlpha = a(0.6); ctx.fillStyle = COR.amarelo; ctx.font = '44px "Archivo Black"'; ctx.fillText('COMENTA AÍ', 540, 1080);
  ctx.globalAlpha = a(1.0); ctx.fillStyle = '#8A90A0'; ctx.font = '40px "Archivo Black"';
  ctx.fillText('REGRAS DA MADRUGADA · EP. 3', 540, 1240); ctx.fillText('@continuaamanha.tv', 540, 1300);
  ctx.globalAlpha = 1;
}

const _b = [0, L(1) - 0.3, L(2) - 0.25, L(3) - 0.2, L(4) - 0.2, L(5) - 0.2, L(6) - 0.2, L(7) - 0.2, L(8) - 0.2, L(9) - 0.15, L(10) - 0.4, L(11) - 0.2, F(12) + 1.6];
const _f = [cenaGancho, cenaTroca, cenaQueda, cenaLetreiro, cenaPassos, cenaChama, cenaNaoOlha, cenaVolta, cenaReflexo, cenaRosto, cenaVoltou, cenaEscrita];
const CENAS = _f.map((f, i) => [_b[i], _b[i + 1], f]).concat([[_b[12], 999, cenaFim]]);
