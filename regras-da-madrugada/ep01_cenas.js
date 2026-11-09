// ============================================================
// REGRAS DA MADRUGADA · Ep. 01 "Posto 24h"
// ============================================================
delete DEST.tres;

// 1. GANCHO: o carro sem farol na bomba 3
function cenaGancho(t, u) {
  camera(lerp(560, 600, u / 2.6), 1260, lerp(1.25, 1.5, u / 2.6), () => posto({ t, carro: { x: 360, olhos: faixa(u, 0.3, 0.8) } }));
  chuva(t);
  vinheta(0.7);
}

// 2. Gancho: o papel, regra 1 sublinhada
function cenaPapel1(t, u) {
  ctx.fillStyle = '#0D0B18'; ctx.fillRect(0, 0, W, H);
  const z = lerp(1.0, 1.08, u / 2.5);
  papelRegras(540, 1080, z, -0.04, [1, 0, 0], 0);
  maos(540, 1560, 1);
  glow(540, 900, 900, COR.luz, 0.08);
  vinheta(0.6);
}

// 3. Primeiro plantão, 22h
function cenaChega(t, u) {
  const k = faixa(u, 0, 3.0);
  camera(lerp(420, 380, u / 4.4), 1150, 1.05, () => {
    posto({ t });
    frentista(lerp(-180, 220, k), 1790, 1.25, { t, passo: k < 1 ? u * 9 : null, ox: 0.4, bE: 0.25 + (k < 1 ? Math.sin(u * 9) * 0.25 : 0), bD: -0.25 - (k < 1 ? Math.sin(u * 9) * 0.25 : 0) });
  });
  chuva(t, 160);
  // relógio 22:00 no canto
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; rr(760, 1640, 250, 96, 16); ctx.fill();
  ctx.fillStyle = '#7CFFB2'; ctx.font = '64px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('22:00', 885, 1690);
  vinheta(0.55);
}

// 4. O gerente entrega o papel e vai embora sem olhar pra trás
function cenaGerente(t, u) {
  const entrega = faixa(t, 10.3, 10.9), sai = faixa(t, 12.2, 14.1);
  camera(380, 1260, 1.45, () => {
    posto({ t });
    gerente(lerp(560, 1250, sai), 1790, 1.2, { t, bD: sai > 0 ? -0.2 : lerp(-0.2, -1.3, entrega) * (1 - faixa(t, 11.0, 11.4)) - 0.2, segura: entrega < 0.9 ? 'papel' : null, ox: -0.6, boca: 'reta' });
    frentista(220, 1790, 1.25, { t, ox: lerp(0.6, 0.2, faixa(t, 11.2, 11.6)), oy: faixa(t, 11.2, 11.6) * 0.6, bD: lerp(-0.25, -1.1, entrega), segura: entrega > 0.9 ? 'papel' : null, sob: faixa(t, 12.4, 13) * 0.6 });
  });
  chuva(t, 160);
  vinheta(0.6);
}

// 5. As regras 2 e 3 aparecem no papel
function cenaRegras(t, u) {
  ctx.fillStyle = '#0D0B18'; ctx.fillRect(0, 0, W, H);
  const v2 = faixa(t, 14.3, 17.9), v3 = faixa(t, 18.7, 21.3);
  const dest = t < 18.5 ? 1 : 2;
  papelRegras(540, lerp(1080, 1020, faixa(t, 14, 22)), lerp(1.0, 1.12, faixa(t, 14, 22)), -0.03, [1, v2, v3], dest);
  maos(540, 1560, 1);
  glow(540, 900, 900, COR.luz, 0.08);
  vinheta(0.6);
}

// 6. 03:17
function cenaRelogio(t, u) {
  ctx.fillStyle = '#05060A'; ctx.fillRect(0, 0, W, H);
  const z = lerp(1, 1.12, u / 1.4);
  ctx.save(); ctx.translate(540, 1000); ctx.scale(z, z);
  ctx.fillStyle = '#111420'; rr(-360, -150, 720, 300, 30); ctx.fill();
  ctx.fillStyle = COR.perigo; ctx.font = '210px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(Math.sin(t * 8) > -0.2 ? '03:17' : '03 17', 0, 10);
  glow(0, 0, 420, '255,90,95', 0.18);
  ctx.restore();
  vinheta(0.7);
}

// 7. O carro preto, sem farol, encosta na bomba 3
function cenaCarro(t, u) {
  const k = 1 - Math.pow(1 - clamp((t - 23.3) / 2.8), 3);
  const cx = lerp(-520, 360, k);
  camera(lerp(380, 470, faixa(t, 23.4, 27)), 1250, lerp(1.0, 1.12, faixa(t, 23.4, 27)), () => {
    posto({ t, carro: { x: cx, olhos: faixa(t, 26.2, 26.6), roda: cx / 42 } });
    frentista(150, 1790, 1.25, { t, ox: lerp(-0.3, 0.9, faixa(t, 24, 25)), sob: faixa(t, 25.3, 26) * 0.8, boca: t > 26.2 ? 'medo' : 'reta', bD: -0.25 });
  });
  chuva(t);
  vinheta(0.65);
}

// 8. Diálogo: janela do carro ↔ frentista
function janela(t, abre) {
  camera(560, 1250, 2.3, () => posto({ t, carro: { x: 360, olhos: 1 } }));
  chuva(t, 160);
  vinheta(0.75);
}
function closeFrentista(t, o) {
  camera(230, 1460, 1.9, () => { posto({ t, carro: { x: 360, olhos: 1 } }); frentista(220, 1790, 1.25, Object.assign({ t }, o)); });
  chuva(t, 140);
  vinheta(0.7);
}
function cenaDialogo(t, u) {
  if (t < 28.85) janela(t);
  else if (t < 31.0) closeFrentista(t, { ox: 1, sob: 0.8, boca: t < 30.9 ? 'fala' : 'nervoso', fala: Math.abs(Math.sin(t * 14)), suor: true });
  else janela(t);
}

// 9. "Tá quebrado, eu disse."
function cenaQuebrado(t, u) {
  closeFrentista(t, { ox: 1, sob: 1, boca: t < 34.9 ? 'fala' : 'nervoso', fala: Math.abs(Math.sin(t * 13)), suor: true, treme: 2 });
}

// 10. O carro parado, motor desligado
function cenaParado(t, u) {
  camera(500, 1250, lerp(1.05, 1.2, u / 3.5), () => {
    posto({ t, carro: { x: 360, olhos: 1 } });
    frentista(150, 1790, 1.25, { t, ox: 1, sob: 0.8, boca: 'nervoso', suor: true });
  });
  chuva(t);
  vinheta(0.7);
}

// 11. Na beira da estrada, fora da luz, alguém acena
function cenaEstrada(t, u) {
  const pan = faixa(t, 39.4, 41.6), z2 = faixa(t, 43.6, 44.8);
  camera(lerp(300, 900, pan), lerp(1300, 1080, z2), lerp(1.1, 2.4, z2), () => {
    posto({ t, carro: { x: 360, olhos: 1 }, figura: { a: faixa(t, 41.2, 41.9), acena: faixa(t, 42.4, 42.7) } });
    frentista(150, 1790, 1.25, { t, ox: 1, oy: -0.3, sob: 0.8, boca: 'reta' });
  });
  chuva(t);
  vinheta(0.7);
}

// 12/14. O "gerente" no escuro, acenando (o sorriso cresce)
function gerenteEscuro(t, sorriso, z) {
  ctx.fillStyle = '#040308'; ctx.fillRect(0, 0, W, H);
  glow(-100, 1400, 900, COR.luz, 0.12);
  ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540, -1100);
  ctx.fillStyle = '#0B0A10'; ctx.fillRect(0, 1520, W, 400);
  for (let x = -100; x < W + 100; x += 140) { ctx.fillStyle = 'rgba(201,178,106,0.25)'; ctx.fillRect(x, 1560, 70, 6); }
  const ac = -2.3 + Math.sin(t * 6) * 0.5;
  gerente(540, 1560, 1.55, { t, sombra: 0.72, sorriso, bD: ac, ox: -0.8, oy: 0.1 });
  ctx.restore();
  chuva(t, 200, 0.18);
  vinheta(0.8);
}
function cenaChama(t, u) { gerenteEscuro(t, 0.35 + 0.1 * Math.sin(t * 3), lerp(1.35, 1.5, u / 3)); }

// 13. Um passo... e parou na borda da luz
function cenaPasso(t, u) {
  ctx.fillStyle = '#05050A'; ctx.fillRect(0, 0, W, H);
  // chão: metade de baixo iluminada, de cima escura, borda inclinada
  const g = ctx.createLinearGradient(0, 900, 0, 1100); g.addColorStop(0, 'rgba(220,255,235,0)'); g.addColorStop(1, 'rgba(220,255,235,0.22)');
  ctx.fillStyle = '#1C1A26'; ctx.fillRect(0, 1000, W, 920); ctx.fillStyle = g; ctx.fillRect(0, 900, W, 1020);
  ctx.strokeStyle = 'rgba(220,255,235,0.35)'; ctx.lineWidth = 4; ctx.setLineDash([24, 18]); ctx.beginPath(); ctx.moveTo(0, 1000); ctx.lineTo(W, 1000); ctx.stroke(); ctx.setLineDash([]);
  // poças
  for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(160,190,255,0.08)'; ctx.beginPath(); ctx.ellipse(hash(i) * W, 1200 + hash(i + 3) * 600, 120, 26, 0, 0, 7); ctx.fill(); }
  // tênis: o de trás parado, o da frente avança e para rente à linha
  const k = faixa(t, 48.1, 48.7), freia = faixa(t, 49.1, 49.4);
  const tenis = (x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = COR.calca; rr(-70, -420, 140, 400, 30); ctx.fill(); ctx.fillStyle = '#1A1A1A'; ctx.strokeStyle = COR.T; ctx.lineWidth = 8; rr(-90, -40, 180, 90, 40); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#EEE'; ctx.fillRect(-90, 30, 180, 16); ctx.restore(); };
  tenis(380, 1680, 1.2);
  tenis(700, lerp(1700, 1080, k) - freia * 6, lerp(1.2, 0.95, k));
  chuva(t, 160);
  vinheta(0.7);
}
function cenaSorriso(t, u) {
  const so = lerp(0.4, 2.3, faixa(t, 51.8, 53.9));
  gerenteEscuro(t, so, lerp(1.5, 2.1, faixa(t, 50, 54.4)));
  const choque = faixa(t, 53.65, 53.75) * (1 - faixa(t, 53.75, 54.5));
  if (choque > 0) vinheta(0.85 * choque, '229,72,77');
}

// 15. De manhã: o gerente chega pra render
function cenaManha(t, u) {
  const k = faixa(t, 54.7, 56.6);
  camera(lerp(520, 430, faixa(t, 56.6, 59.4)), 1250, lerp(1.0, 1.35, faixa(t, 56.6, 59.4)), () => {
    posto({ t, dia: 1 });
    frentista(250, 1790, 1.25, { t, ox: 1, aberto: 0.65, boca: t > 59.3 && t < 62.2 ? 'fala' : 'reta', fala: Math.abs(Math.sin(t * 13)), sob: 0.3 });
    gerente(lerp(1300, 620, k), 1790, 1.2, { t, ox: -0.8, boca: t > 57.2 && t < 58.8 ? 'fala' : 'sorri', fala: Math.abs(Math.sin(t * 12)), passo: k < 1 ? t * 8 : null });
  });
  vinheta(0.35);
}

// 16. Ele ficou branco
function cenaBranco(t, u) {
  ctx.fillStyle = '#FBE3B8'; ctx.fillRect(0, 0, W, H);
  camera(620, 1420, 2.3, () => { posto({ t, dia: 1 }); gerente(620, 1790, 1.2, { t, ox: -0.6, oy: 0.2, palido: faixa(t, 63.0, 63.6), sob: faixa(t, 63.0, 63.4), aberto: lerp(1, 1.25, faixa(t, 63, 63.4)), boca: 'reta' }); });
  vinheta(0.4);
}

// 17. O papel novo: regra número 4
function cenaRegra4(t, u) {
  ctx.fillStyle = '#2A1F18'; ctx.fillRect(0, 0, W, H);
  const z = lerp(1.0, 1.25, faixa(t, 64.3, 67.6));
  ctx.save(); ctx.translate(540, 1050); ctx.scale(z, z); ctx.rotate(0.03);
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 40; ctx.fillStyle = COR.papel; ctx.fillRect(-380, -470, 760, 940); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(80,120,200,0.25)'; ctx.lineWidth = 3; for (let y = -330; y < 440; y += 70) { ctx.beginPath(); ctx.moveTo(-350, y); ctx.lineTo(350, y); ctx.stroke(); }
  ctx.fillStyle = '#1B2240'; ctx.font = '64px "Caveat"'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText('TURNO DA NOITE', -260, -350);
  ctx.fillStyle = '#C0262D'; ctx.font = '170px "Caveat"'; ctx.fillText('4.', -260, -90);
  // o resto riscado/borrado
  ctx.save(); ctx.filter = 'blur(9px)'; ctx.fillStyle = '#1B2240'; ctx.font = '52px "Caveat"';
  ['Se ele voltar e te chamar', 'pelo nome, não responda.', 'Ele não é o gerente.'].forEach((l, i) => ctx.fillText(l, -260, 40 + i * 70));
  ctx.restore();
  ctx.restore();
  glow(540, 900, 900, '255,220,160', 0.12);
  const choque = faixa(t, 66.8, 66.9) * (1 - faixa(t, 66.9, 67.6));
  if (choque > 0) vinheta(0.7 * choque, '229,72,77');
  vinheta(0.55);
}

// 18. Final: pergunta
function cenaFim(t, u) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (u < 0.12) { ctx.fillStyle = 'rgba(229,72,77,0.35)'; ctx.fillRect(0, 0, W, H); }
  const a = k => faixa(u, k, k + 0.35);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.globalAlpha = a(0); ctx.fillStyle = '#fff'; ctx.font = '96px "Archivo Black"';
  ctx.fillText('VOCÊ TERIA', 540, 780); ctx.fillText('DADO AQUELE', 540, 890);
  ctx.fillStyle = COR.perigo; ctx.fillText('PASSO?', 540, 1000);
  ctx.globalAlpha = a(0.6); ctx.fillStyle = COR.amarelo; ctx.font = '44px "Archivo Black"'; ctx.fillText('COMENTA AÍ', 540, 1140);
  ctx.globalAlpha = a(1.0); ctx.fillStyle = '#8A90A0'; ctx.font = '40px "Archivo Black"';
  ctx.fillText('REGRAS DA MADRUGADA', 540, 1300); ctx.fillText('@continuaamanha.tv', 540, 1360);
  ctx.globalAlpha = 1;
}

const CENAS = [
  [0, 2.6, cenaGancho], [2.6, 5.1, cenaPapel1], [5.1, 9.5, cenaChega], [9.5, 14.1, cenaGerente],
  [14.1, 22.0, cenaRegras], [22.0, 23.4, cenaRelogio], [23.4, 27.0, cenaCarro], [27.0, 33.4, cenaDialogo],
  [33.4, 35.4, cenaQuebrado], [35.4, 38.9, cenaParado], [38.9, 44.8, cenaEstrada], [44.8, 47.8, cenaChama],
  [47.8, 49.9, cenaPasso], [49.9, 54.6, cenaSorriso], [54.6, 62.7, cenaManha], [62.7, 64.0, cenaBranco],
  [64.0, 67.6, cenaRegra4], [67.6, 99, cenaFim],
];
