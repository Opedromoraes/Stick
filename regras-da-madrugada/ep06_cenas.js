// ============================================================
// REGRAS DA MADRUGADA · Ep. 06 "Corrida das 3h17"
// ============================================================
const TAGTXT = 'REGRAS DA MADRUGADA · APLICATIVO';
delete DEST.tres; delete DEST.luz; delete DEST.gerente;
Object.assign(DEST, { sozinho: 'perigo', passageiro: 'perigo', bonfim: 'perigo', cemiterio: 'perigo', retrovisor: 'perigo', dezessete: 'amarelo', abrir: 'perigo', fechar: 'perigo', leve: 'perigo', estrelas: 'amarelo', volto: 'perigo', gps: 'amarelo' });
const L = k => TL.linhas[k].ini, F = k => TL.linhas[k].fim;
const PWw = (k, re) => { const p = TL.linhas[k].palavras.find(([w]) => re.test(NORM(w))); return p ? p[1] : L(k); };
const MOLETOM = '#4A4F63';
const REGRAS_APP = [
  ['1. App aceitou corrida sozinho?', 'NÃO busque o passageiro.'],
  ['2. Nunca aceite corrida pro', 'Bonfim depois da 0h.'],
  ['3. Porta de trás abriu sozinha?', 'NÃO olhe o retrovisor.'],
];

// ---------- interior do carro (visto de trás do motorista) ----------
// o: {t, vel, celular:{tela}, porta (0..1), retro:{a, olhos}, portao, motorista:{...}}
function carro(t, o = {}) {
  const v = o.vel ?? 1;
  // rua pelo para-brisa
  ctx.fillStyle = '#0A0B12'; ctx.fillRect(-400, -400, W + 800, H + 800);
  const g = ctx.createLinearGradient(0, 300, 0, 1000); g.addColorStop(0, '#0B0D18'); g.addColorStop(1, '#1C1A2A'); ctx.fillStyle = g; ctx.fillRect(-200, 300, W + 400, 700);
  // estrada em perspectiva
  ctx.fillStyle = '#16151C'; ctx.beginPath(); ctx.moveTo(500, 640); ctx.lineTo(580, 640); ctx.lineTo(1300, 1000); ctx.lineTo(-220, 1000); ctx.fill();
  for (let i = 0; i < 6; i++) { const k = ((i / 6 + t * 0.6 * v) % 1); const y = 640 + k * k * 360, w = 4 + k * 26, h = 6 + k * 40; ctx.fillStyle = '#C9B26A'; ctx.fillRect(540 - w / 2, y, w, h); }
  // postes passando
  for (let i = 0; i < 3; i++) { const k = ((i / 3 + t * 0.35 * v) % 1); const x = 590 + k * k * 900, y = 640 - k * k * 380; ctx.fillStyle = '#2A2D38'; ctx.fillRect(x, y, 4 + k * 14, 40 + k * 380); glow(x, y, 40 + k * 200, '255,214,150', 0.35 * k); }
  if (o.portao) portaoCemiterio(o.portao);
  // painel e moldura do para-brisa
  ctx.fillStyle = '#121218'; ctx.beginPath(); ctx.moveTo(-200, 260); ctx.lineTo(W + 200, 260); ctx.lineTo(W + 200, 330); ctx.lineTo(-200, 330); ctx.fill();
  ctx.fillStyle = '#121218'; ctx.beginPath(); ctx.moveTo(-200, 300); ctx.lineTo(120, 300); ctx.lineTo(-40, 1000); ctx.lineTo(-200, 1000); ctx.fill();
  ctx.beginPath(); ctx.moveTo(W + 200, 300); ctx.lineTo(960, 300); ctx.lineTo(1120, 1000); ctx.lineTo(W + 200, 1000); ctx.fill();
  ctx.fillStyle = '#1B1C24'; ctx.fillRect(-200, 980, W + 400, 1000);
  // banco de trás (visto de frente, atrás do motorista)
  ctx.fillStyle = '#15151C'; rr(-60, 760, W + 120, 260, 40); ctx.fill();
  for (const x of [170, 910]) { ctx.fillStyle = '#20202A'; rr(x - 80, 640, 160, 150, 30); ctx.fill(); }
  if (o.retro) { const a = o.retro.a; ctx.globalAlpha = a; ctx.fillStyle = '#030305';
    ctx.beginPath(); ctx.ellipse(175, 700, 78, 96, 0, 0, 7); ctx.fill(); rr(60, 770, 230, 300, 80); ctx.fill();
    if (o.retro.olhos) { circ(150, 690, 9, '#FFF4C2'); circ(200, 690, 9, '#FFF4C2'); glow(175, 690, 70, '255,244,194', 0.4 * a); }
    if (o.retro.sorriso) { ctx.strokeStyle = '#EDE6D6'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(175, 720, 34, 0.25, Math.PI - 0.25); ctx.stroke(); }
    ctx.globalAlpha = 1; }
  // celular no suporte
  if (o.celular !== false) { const c = o.celular || {}; ctx.save(); ctx.translate(820, 1060); ctx.rotate(0.05); ctx.fillStyle = '#111'; rr(-90, -150, 180, 300, 24); ctx.fill(); const glo = c.alerta ? '255,90,95' : '120,170,255'; ctx.fillStyle = c.alerta && Math.sin(t * 12) > 0 ? '#3A1214' : '#122038'; rr(-78, -136, 156, 272, 16); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '22px "Archivo Black"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; (c.tela || ['ONLINE']).forEach((l, i) => ctx.fillText(l, 0, -60 + i * 40)); ctx.restore(); glow(820, 1060, 260, glo, 0.25); }
  // motorista (de costas, cabeça e ombros)
  const m = o.motorista || {};
  ctx.save(); ctx.translate(420, 1980); ctx.scale(2.2, 2.2);
  frentista(0, 0, 1, Object.assign({ t, cor: MOLETOM, vira: -1 }, m));
  ctx.restore();
  // porta de trás (luz interna acendendo)
  if (o.porta) { ctx.fillStyle = `rgba(255,236,190,${0.18 * o.porta})`; ctx.fillRect(0, 0, W, H); }
}
function portaoCemiterio(k) {
  ctx.save(); ctx.globalAlpha = k;
  ctx.fillStyle = '#2A2833'; ctx.fillRect(260, 380, 60, 300); ctx.fillRect(760, 380, 60, 300);
  ctx.strokeStyle = '#3B3946'; ctx.lineWidth = 8; for (let x = 330; x < 760; x += 36) { ctx.beginPath(); ctx.moveTo(x, 440); ctx.lineTo(x, 680); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(540, 440, 230, Math.PI, 0); ctx.stroke();
  ctx.fillStyle = '#3B3946'; ctx.font = '34px "Archivo Black"'; ctx.textAlign = 'center'; ctx.fillText('BONFIM', 540, 300);
  // cruz e túmulos atrás
  for (const [x, h] of [[400, 60], [480, 80], [620, 70], [700, 55]]) { ctx.fillStyle = '#1F1E27'; rr(x - 20, 680 - h, 40, h, 10); ctx.fill(); }
  ctx.restore();
}

// ---------- tela do app ----------
function app(t, o = {}) {
  ctx.fillStyle = '#05060A'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 1050); ctx.scale(o.z ?? 1, o.z ?? 1);
  ctx.fillStyle = '#111'; rr(-330, -620, 660, 1240, 70); ctx.fill(); ctx.strokeStyle = '#333'; ctx.lineWidth = 8; ctx.stroke();
  ctx.fillStyle = '#F4F5F7'; rr(-300, -590, 600, 1180, 50); ctx.fill();
  // mapa
  ctx.fillStyle = '#DDE3DF'; ctx.fillRect(-300, -520, 600, 520);
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 22; for (const [a, b, c, d] of [[-300, -300, 300, -360], [-100, -520, -40, 0], [120, -520, 200, 0], [-300, -120, 300, -80]]) { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }
  ctx.strokeStyle = '#2B6FE8'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-200, -60); ctx.lineTo(-60, -110); ctx.lineTo(-40, -330); ctx.lineTo(150, -360); ctx.stroke();
  circ(150, -360, 22, '#E5484D'); circ(-200, -60, 18, '#111');
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (o.modo === 'corrida') {
    const pul = 1 + 0.04 * Math.sin(t * 10);
    ctx.fillStyle = '#111'; ctx.font = '46px "Archivo Black"'; ctx.fillText('CORRIDA ACEITA', 0, 70);
    ctx.fillStyle = '#E5484D'; ctx.font = '30px "Archivo Black"'; ctx.fillText('aceita automaticamente', 0, 120);
    ctx.fillStyle = '#555'; ctx.font = '32px "IBM Plex Mono"'; ctx.fillText('03:17 · 1 passageiro', 0, 190);
    ctx.fillStyle = '#111'; ctx.font = '40px "Archivo Black"'; ctx.fillText('Destino:', 0, 270);
    ctx.save(); ctx.scale(pul, pul); ctx.fillStyle = o.dest ? '#C0262D' : '#999'; ctx.fillText(o.dest ? 'Cemitério do Bonfim' : '...', 0, 330 / pul); ctx.restore();
    ctx.fillStyle = '#E5484D'; rr(-240, 420, 480, 100, 50); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '38px "Archivo Black"'; ctx.fillText(o.cancela ? 'CANCELADA... ACEITA' : 'CANCELAR', 0, 472);
  } else {
    ctx.fillStyle = '#111'; ctx.font = '44px "Archivo Black"'; ctx.fillText('Avaliação do passageiro', 0, 70);
    const n = Math.floor(5 * clamp(o.est ?? 1));
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i < n ? '#FFB400' : '#CCC'; ctx.font = '86px "Archivo Black"'; ctx.fillText('★', -200 + i * 100, 170); }
    if (o.coment) { ctx.fillStyle = '#EEF0F3'; rr(-260, 260, 520, 200, 24); ctx.fill(); ctx.fillStyle = '#C0262D'; ctx.font = '58px "Caveat"'; const s = '"Amanhã eu volto."'; ctx.fillText(s.slice(0, Math.floor(s.length * clamp(o.coment))), 0, 360); }
  }
  ctx.restore();
  glow(540, 1000, 800, '120,170,255', 0.08);
  vinheta(0.55);
}

// ========== cenas ==========
function cenaGancho(t, u) {
  carro(t, { retro: { a: faixa(u, 0.6, 1.2), olhos: true }, celular: { tela: ['CORRIDA', 'ACEITA', '03:17'], alerta: true }, motorista: { ox: 0 } });
  const z = lerp(1, 1.0, u); vinheta(0.6);
}
function cenaFacul(t, u) {
  camera(560, 1150, lerp(1.0, 1.05, u / 4), () => carro(t, { celular: { tela: ['ONLINE', 'R$ 84,50', 'hoje'] } }));
  vinheta(0.55);
}
function cenaVeterano(t, u) {
  // no ponto: o motorista mais velho (gerente com casaco) passando o papel
  const e = faixa(t, L(2) + 0.5, L(2) + 1.2);
  camera(400, 1300, 1.4, () => {
    posto({ t, dia: 0 });
    gerente(600, 1790, 1.2, { t, colete: '#5A4632', ox: -0.6, bD: lerp(-0.2, -1.3, e), segura: e < 0.9 ? 'papel' : null });
    frentista(260, 1790, 1.25, { t, cor: MOLETOM, ox: 0.7, bD: lerp(-0.25, -1.0, e), segura: e > 0.9 ? 'papel' : null });
  });
  vinheta(0.6);
}
function cenaRegras(t, u) {
  ctx.fillStyle = '#0B0B12'; ctx.fillRect(0, 0, W, H);
  const v2 = faixa(t, L(3) + 0.3, F(3)), v3 = faixa(t, L(4) + 0.3, F(4));
  papelRegras(540, 1060, lerp(1.0, 1.1, faixa(t, L(3), F(4))), -0.03, [1, v2, v3], t < L(4) ? 1 : 2, 'REGRAS DO PONTO', REGRAS_APP);
  maos(540, 1560, 1); vinheta(0.6);
}
function cenaAceita(t, u) { app(t, { modo: 'corrida', dest: t > L(6) - 0.1, z: lerp(1, 1.08, u / 6) }); }
function cenaCancela(t, u) { app(t, { modo: 'corrida', dest: true, cancela: Math.sin(t * 6) > 0, z: 1.1 }); }
function cenaPorta(t, u) {
  const ab = faixa(t, PWw(8, /abrir/), PWw(8, /abrir/) + 0.3) * (1 - faixa(t, PWw(8, /fechar/), PWw(8, /fechar/) + 0.3));
  carro(t, { vel: 0.3, porta: ab, celular: { tela: ['A CAMINHO', 'BONFIM'], alerta: true }, motorista: { ox: 0, treme: 2 } });
  vinheta(0.65);
}
function cenaGPS(t, u) {
  camera(820, 1060, lerp(2.2, 2.6, u / 4), () => carro(t, { celular: { tela: ['SIGA EM', 'FRENTE', '400 m'], alerta: true } }));
  vinheta(0.7);
}
function cenaOlhos(t, u) {
  // close na nuca do motorista; o retrovisor fica no alto da tela, com algo lá — ele não olha
  camera(380, 1050, lerp(1.25, 1.45, u / 4), () => carro(t, { retro: { a: 1, olhos: true, sorriso: true }, celular: { tela: ['SIGA EM', 'FRENTE'], alerta: true }, motorista: { ox: 0, treme: 2, aberto: 0.12, sob: 1 } }));
  vinheta(0.75);
}
function cenaChegou(t, u) {
  const k = faixa(t, L(12) - 0.3, L(12) + 0.6);
  const leve = PWw(12, /leve/);
  carro(t, { vel: lerp(0.5, 0, k), portao: k, porta: faixa(t, PWw(12, /abriu/), PWw(12, /abriu/) + 0.3) * (1 - faixa(t, leve - 0.2, leve + 0.3)), retro: { a: 1 - faixa(t, leve - 0.2, leve + 0.2), olhos: true }, celular: { tela: ['CHEGOU', 'BONFIM'] } });
  vinheta(0.65);
}
function cenaAvalia(t, u) {
  const e = PWw(14, /estrelas/), c = PWw(14, /comentario/);
  app(t, { modo: 'aval', est: faixa(t, L(14) - 0.2, e), coment: faixa(t, c, F(14)), z: lerp(1, 1.2, faixa(t, L(13), F(14))) });
  const ch = faixa(t, F(14) - 0.2, F(14) - 0.1) * (1 - faixa(t, F(14) - 0.1, F(14) + 0.7));
  if (ch > 0) vinheta(0.8 * ch, '229,72,77');
}
function cenaFim(t, u) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (u < 0.12) { ctx.fillStyle = 'rgba(229,72,77,0.35)'; ctx.fillRect(0, 0, W, H); }
  const a = k => faixa(u, k, k + 0.35);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.globalAlpha = a(0); ctx.fillStyle = '#fff'; ctx.font = '96px "Archivo Black"';
  ctx.fillText('VOCÊ OLHARIA O', 540, 820); ctx.fillStyle = COR.perigo; ctx.fillText('RETROVISOR?', 540, 940);
  ctx.globalAlpha = a(0.6); ctx.fillStyle = COR.amarelo; ctx.font = '44px "Archivo Black"'; ctx.fillText('COMENTA AÍ', 540, 1080);
  ctx.globalAlpha = a(1.0); ctx.fillStyle = '#8A90A0'; ctx.font = '40px "Archivo Black"';
  ctx.fillText('REGRAS DA MADRUGADA', 540, 1240); ctx.fillText('@continuaamanha.tv', 540, 1300);
  ctx.globalAlpha = 1;
}

// linhas: 0 gancho,1 facul,2 veterano,3 r2,4 r3,5 3h17,6 destino,7 cancelei,8 porta,9 gps-fala,10 GPS(voz),11 nao olhei,12 parei,13 app,14 estrelas
const _b = [0, L(1) - 0.3, L(2) - 0.25, L(3) - 0.25, L(5) - 0.25, L(7) - 0.2, L(8) - 0.2, L(9) - 0.2, L(11) - 0.2, L(12) - 0.3, L(13) - 0.2, F(14) + 1.4];
const _f = [cenaGancho, cenaFacul, cenaVeterano, cenaRegras, cenaAceita, cenaCancela, cenaPorta, cenaGPS, cenaOlhos, cenaChegou, cenaAvalia];
const CENAS = _f.map((f, i) => [_b[i], _b[i + 1], f]).concat([[_b[11], 999, cenaFim]]);
