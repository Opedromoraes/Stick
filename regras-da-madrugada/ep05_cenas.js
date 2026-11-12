// ============================================================
// REGRAS DA MADRUGADA · Ep. 05 "Quarto 313"
// ============================================================
const TAGTXT = 'REGRAS DA MADRUGADA · HOSPITAL';
delete DEST.tres; delete DEST.luz; delete DEST.gerente;
Object.assign(DEST, { cortina: 'perigo', feche: 'perigo', vazios: 'amarelo', desocupado: 'perigo', campainha: 'amarelo', silencio: 'perigo', coberto: 'perigo', lencol: 'perigo', amanhecer: 'amarelo', vazia: 'perigo', nome: 'perigo', treze: 'amarelo', dezessete: 'amarelo', maca: 'amarelo' });
const L = k => TL.linhas[k].ini, F = k => TL.linhas[k].fim;
const PWw = (k, re) => { const p = TL.linhas[k].palavras.find(([w]) => re.test(NORM(w))); return p ? p[1] : L(k); };
const PIJAMA = '#3FA7A0';
const REGRAS_HOSP = [
  ['1. Se um paciente pedir pra', 'fechar a cortina, NÃO feche.'],
  ['2. O quarto 313 está', 'desocupado. Sempre.'],
  ['3. Se a campainha do 313', 'tocar, não vá.'],
];

// ---------- corredor do hospital ----------
// o: {pisca, maca:{x, s, respira, vazia, lencol(0..1 puxado)}, enf:{...}, chefe:{...}, painel, dia, porta313}
function corredor(t, o = {}) {
  const dia = o.dia ?? 0;
  ctx.fillStyle = dia ? '#D7E4DE' : '#16231F'; ctx.fillRect(-400, -400, W + 800, H + 800);
  // parede do fundo em perspectiva
  ctx.fillStyle = dia ? '#BFD3CB' : '#1D2E29'; ctx.beginPath(); ctx.moveTo(380, 520); ctx.lineTo(700, 520); ctx.lineTo(700, 1060); ctx.lineTo(380, 1060); ctx.fill();
  ctx.fillStyle = dia ? '#A9BEB5' : '#0F1916';
  ctx.beginPath(); ctx.moveTo(-400, 0); ctx.lineTo(380, 520); ctx.lineTo(380, 1060); ctx.lineTo(-400, 1700); ctx.fill();
  ctx.beginPath(); ctx.moveTo(W + 400, 0); ctx.lineTo(700, 520); ctx.lineTo(700, 1060); ctx.lineTo(W + 400, 1700); ctx.fill();
  // piso
  ctx.fillStyle = dia ? '#E9ECE6' : '#2A3330'; ctx.beginPath(); ctx.moveTo(380, 1060); ctx.lineTo(700, 1060); ctx.lineTo(W + 400, 1920); ctx.lineTo(-400, 1920); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(540, 1060); ctx.lineTo(540, 1920); ctx.stroke();
  // portas dos quartos
  const portas = [[180, 640, '311'], [-60, 520, '312'], [880, 640, '313'], [1120, 520, '314']];
  for (const [x, top, n] of portas) {
    const esq = x < 540, w = 120, h = 420;
    ctx.fillStyle = dia ? '#7FA89A' : '#21362F'; ctx.fillRect(x - w / 2, top + 260, w, h);
    ctx.fillStyle = n === '313' && o.porta313 ? '#FF4040' : (dia ? '#2B3F38' : '#9FB8AE');
    ctx.font = '34px "Archivo Black"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n, x, top + 230);
    if (n === '313' && o.porta313) glow(x, top + 230, 90, '255,64,64', 0.35);
  }
  // lâmpadas do teto
  for (const [x, y, w] of [[540, 300, 260], [540, 450, 170], [540, 540, 110]]) {
    const on = o.pisca && x === 540 && y === 300 ? (Math.sin(t * 23) > -0.5 ? 1 : 0.2) : 1;
    ctx.fillStyle = on > 0.5 ? '#EFFFF8' : '#3A4A44'; rr(x - w / 2, y, w, 16, 8); ctx.fill();
    if (!dia) glow(x, y + 300, 500 * (w / 260), '200,255,230', 0.18 * on);
  }
  // placa
  ctx.fillStyle = '#0F3A30'; rr(410, 560, 260, 70, 10); ctx.fill(); ctx.fillStyle = '#E8F5EF'; ctx.font = '36px "Archivo Black"'; ctx.fillText('3º ANDAR', 540, 596);
  // maca
  if (o.maca) maca(o.maca.x ?? 600, o.maca.y ?? 1500, o.maca.s ?? 1, t, o.maca);
  if (o.chefe) gerente(o.cx ?? 800, 1830, 1.2, Object.assign({ t, colete: '#E9EEF0' }, o.chefe));
  if (o.enf) frentista(o.ex ?? 300, 1830, 1.25, Object.assign({ t, cor: PIJAMA }, o.enf));
  // posto de enfermagem
  if (o.balcao) { ctx.fillStyle = '#C9D9D2'; ctx.fillRect(-400, 1600, 900, 400); ctx.fillStyle = '#E8F1EC'; ctx.fillRect(-400, 1580, 900, 30); }
  ctx.fillStyle = `rgba(4,10,8,${dia ? 0 : (o.escuro ?? 0.25)})`; ctx.fillRect(-400, -400, W + 800, H + 800);
}
function maca(x, y, s, t, o) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#8E9AA0'; ctx.fillRect(-260, 0, 520, 20); for (const px of [-230, 230]) { ctx.fillRect(px - 6, 20, 12, 160); circ(px, 190, 16, '#333'); }
  ctx.fillStyle = '#DDE3E0'; rr(-270, -30, 540, 40, 12); ctx.fill();
  const puxa = clamp(o.lencol ?? 0);
  if (!o.vazia || puxa < 1) {
    // corpo coberto (some quando vazia e o lençol sai)
    const resp = (o.respira ?? 1) * Math.sin(t * 2.2) * 4;
    ctx.save(); ctx.translate(lerp(0, 600, puxa), lerp(0, -80, puxa)); ctx.rotate(lerp(0, 0.4, puxa));
    ctx.fillStyle = '#F2F4F1'; ctx.strokeStyle = COR.T; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-260, -20);
    if (!o.vazia) { ctx.quadraticCurveTo(-240, -110 - resp, -170, -120 - resp); ctx.quadraticCurveTo(-120, -125, -110, -80); ctx.quadraticCurveTo(0, -95 - resp, 120, -70); ctx.quadraticCurveTo(220, -80, 260, -20); }
    else { ctx.quadraticCurveTo(0, -60, 260, -20); }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 4; for (const fx of [-60, 40, 150]) { ctx.beginPath(); ctx.moveTo(fx, -70); ctx.lineTo(fx + 30, -25); ctx.stroke(); }
    ctx.restore();
  }
  if (o.mao && !o.vazia) { const bal = Math.sin(t * 1.3) * 4; lin([[200, -30], [214 + bal, 60], [220 + bal, 120]], '#B8C2BE', 26); ctx.fillStyle = '#B8C2BE'; ctx.beginPath(); ctx.ellipse(222 + bal, 140, 20, 28, 0.1, 0, 7); ctx.fill(); for (let i = 0; i < 4; i++) lin([[210 + i * 8 + bal, 160], [208 + i * 9 + bal, 200 + (i % 2) * 8]], '#B8C2BE', 7); }
  if (o.vazia && puxa >= 0.6) { ctx.save(); ctx.translate(-30, -50); ctx.rotate(-0.1); ctx.fillStyle = COR.papel; ctx.fillRect(-60, -40, 120, 80); ctx.strokeStyle = '#555'; ctx.lineWidth = 3; ctx.strokeRect(-60, -40, 120, 80); ctx.restore(); }
  ctx.restore();
}
function painelCampainha(t, toca, z = 1) {
  ctx.fillStyle = '#0B1311'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 1000); ctx.scale(z, z);
  ctx.fillStyle = '#C9D9D2'; rr(-380, -320, 760, 640, 30); ctx.fill(); ctx.strokeStyle = COR.T; ctx.lineWidth = 8; ctx.stroke();
  ctx.fillStyle = '#0F3A30'; ctx.font = '44px "Archivo Black"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CHAMADA DE LEITO', 0, -250);
  const nums = ['309', '310', '311', '312', '313', '314'];
  nums.forEach((n, i) => { const x = -220 + (i % 3) * 220, y = -100 + Math.floor(i / 3) * 220; const on = n === '313' && toca && Math.sin(t * 10) > 0; ctx.fillStyle = on ? '#FF4040' : '#5A6A64'; circ(x, y, 60, ctx.fillStyle); if (on) glow(x, y, 160, '255,64,64', 0.5); ctx.fillStyle = '#0F3A30'; ctx.font = '40px "Archivo Black"'; ctx.fillText(n, x, y + 100); });
  ctx.restore(); vinheta(0.6);
}
function ficha(t, k) {
  ctx.fillStyle = '#2A2E2C'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 1060); ctx.rotate(0.03); ctx.scale(lerp(1, 1.18, k), lerp(1, 1.18, k));
  ctx.fillStyle = '#6B4B36'; rr(-400, -520, 800, 1040, 30); ctx.fill();
  ctx.fillStyle = '#A9A9A9'; rr(-110, -560, 220, 80, 16); ctx.fill();
  ctx.fillStyle = '#F7F5EE'; ctx.fillRect(-350, -460, 700, 920);
  ctx.fillStyle = '#0F3A30'; ctx.font = '50px "Archivo Black"'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('FICHA DE INTERNAÇÃO', -310, -370);
  ctx.fillStyle = '#333'; ctx.font = '40px "IBM Plex Mono"';
  ctx.fillText('PACIENTE:', -310, -250); ctx.fillText('QUARTO:', -310, -120); ctx.fillText('ENTRADA:', -310, 10);
  ctx.fillStyle = '#C0262D'; ctx.font = '80px "Caveat"';
  ctx.fillText('Lucas M.', -60, -248); ctx.fillText('313', -60, -118);
  ctx.fillStyle = '#1B2240'; ctx.fillText('hoje, 3h17', -60, 12);
  ctx.restore();
  vinheta(0.5);
}

// ========== cenas ==========
function cenaGancho(t, u) {
  camera(560, 1300, lerp(1.6, 1.85, u / 5), () => corredor(t, { pisca: true, escuro: 0.45, maca: { x: 560, y: 1520, s: 1.1, respira: 1, mao: true } }));
  const ce = PWw(0, /feche/);
  if (t > ce) { const k = faixa(t, ce, ce + 0.15) * (1 - faixa(t, ce + 0.15, ce + 0.9)); if (k > 0) vinheta(0.7 * k, '229,72,77'); }
  vinheta(0.7);
}
function cenaPlantao(t, u) {
  camera(lerp(520, 470, u / 4), 1150, 1.0, () => corredor(t, { balcao: true, enf: { ox: 0.4, oy: -0.1 }, ex: 200 }));
  vinheta(0.55);
}
function cenaChefe(t, u) {
  const e = faixa(t, L(2) + 0.6, L(2) + 1.3);
  camera(380, 1400, 1.5, () => corredor(t, { chefe: { ox: -0.7, bD: lerp(-0.2, -1.3, e), segura: e < 0.9 ? 'papel' : null }, cx: 560, enf: { ox: 0.7, bD: lerp(-0.25, -1.0, e), segura: e > 0.9 ? 'papel' : null }, ex: 230 }));
  vinheta(0.55);
}
function cenaRegras(t, u) {
  ctx.fillStyle = '#0B1311'; ctx.fillRect(0, 0, W, H);
  const v2 = faixa(t, L(3) + 0.3, F(3)), v3 = faixa(t, L(4) + 0.3, F(4));
  papelRegras(540, 1060, lerp(1.0, 1.1, faixa(t, L(3), F(4))), -0.03, [1, v2, v3], t < L(4) ? 1 : 2, 'PLANTÃO NOTURNO', REGRAS_HOSP);
  maos(540, 1560, 1); vinheta(0.6);
}
function cenaCampainha(t, u) { painelCampainha(t, true, lerp(1, 1.12, u / 5)); }
function cenaNaoVai(t, u) {
  camera(260, 1420, 1.9, () => corredor(t, { balcao: true, ex: 260, enf: { ox: 1, sob: 1, boca: 'nervoso', suor: true, treme: 2 } }));
  vinheta(0.7);
}
function cenaSilencio(t, u) {
  camera(540, 900, lerp(1.2, 1.5, u / 3), () => corredor(t, { pisca: true, escuro: 0.4 }));
  vinheta(0.7);
}
function cenaMaca(t, u) {
  const a = faixa(t, L(8) + 0.3, L(8) + 1.2);
  camera(540, 1250, lerp(1.0, 1.25, faixa(t, L(8), F(8))), () => { corredor(t, { pisca: true, escuro: 0.4, maca: a > 0 ? { x: 560, y: 1430, s: 0.9 } : null }); });
  if (a < 1) { ctx.fillStyle = `rgba(0,0,0,${0.0})`; }
  vinheta(0.7);
}
function cenaVoz(t, u) {
  camera(400, 1440, lerp(2.4, 2.8, u / 4), () => corredor(t, { escuro: 0.5, maca: { x: 560, y: 1520, s: 1.1, respira: 2, mao: true } }));
  vinheta(0.8);
}
function cenaVigia(t, u) {
  const h = Math.floor(lerp(17, 58, faixa(t, L(11), F(11))));
  camera(480, 1350, 1.25, () => corredor(t, { escuro: 0.45, maca: { x: 640, y: 1560, s: 1, respira: 1 }, ex: 240, enf: { ox: 1, oy: 0.3, sob: 1, boca: 'nervoso', suor: true } }));
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; rr(760, 1640, 260, 96, 16); ctx.fill();
  ctx.fillStyle = '#7CFFB2'; ctx.font = '64px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t < F(11) - 0.4 ? `03:${String(h).padStart(2, '0')}` : '05:58', 890, 1690);
  vinheta(0.65);
}
function cenaPuxa(t, u) {
  const p = faixa(t, PWw(12, /puxou/), PWw(12, /lencol/) + 0.5), vazia = true;
  camera(560, 1380, 1.35, () => corredor(t, { dia: 1, maca: { x: 600, y: 1560, s: 1, vazia, lencol: p }, chefe: { ox: -0.6, bD: -1.0 }, cx: 920, enf: { ox: 1, sob: 1, boca: 'medo' }, ex: 220 }));
  vinheta(0.35);
}
function cenaVazia(t, u) {
  camera(560, 1500, lerp(2.0, 2.6, u / 2.5), () => corredor(t, { dia: 1, maca: { x: 560, y: 1560, s: 1, vazia: true, lencol: 1 } }));
  vinheta(0.4);
}
function cenaFicha(t, u) {
  ficha(t, faixa(t, L(14), F(14)));
  const n = PWw(14, /nome/);
  const ch = faixa(t, n, n + 0.1) * (1 - faixa(t, n + 0.1, n + 1.0));
  if (ch > 0) vinheta(0.8 * ch, '229,72,77');
}
function cenaFim(t, u) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (u < 0.12) { ctx.fillStyle = 'rgba(229,72,77,0.35)'; ctx.fillRect(0, 0, W, H); }
  const a = k => faixa(u, k, k + 0.35);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.globalAlpha = a(0); ctx.fillStyle = '#fff'; ctx.font = '104px "Archivo Black"';
  ctx.fillText('VOCÊ', 540, 820); ctx.fillStyle = COR.perigo; ctx.fillText('FECHARIA?', 540, 940);
  ctx.globalAlpha = a(0.6); ctx.fillStyle = COR.amarelo; ctx.font = '44px "Archivo Black"'; ctx.fillText('COMENTA AÍ', 540, 1080);
  ctx.globalAlpha = a(1.0); ctx.fillStyle = '#8A90A0'; ctx.font = '40px "Archivo Black"';
  ctx.fillText('REGRAS DA MADRUGADA', 540, 1240); ctx.fillText('@continuaamanha.tv', 540, 1300);
  ctx.globalAlpha = 1;
}

const _b = [0, L(1) - 0.3, L(2) - 0.25, L(3) - 0.25, L(5) - 0.25, L(6) - 0.2, L(7) - 0.2, L(8) - 0.2, L(9) - 0.2, L(11) - 0.25, L(12) - 0.4, L(13) - 0.2, L(14) - 0.2, F(14) + 1.4];
const _f = [cenaGancho, cenaPlantao, cenaChefe, cenaRegras, cenaCampainha, cenaNaoVai, cenaSilencio, cenaMaca, cenaVoz, cenaVigia, cenaPuxa, cenaVazia, cenaFicha];
const CENAS = _f.map((f, i) => [_b[i], _b[i + 1], f]).concat([[_b[13], 999, cenaFim]]);
