// ============================================================
// REGRAS DA MADRUGADA · Ep. 04 "Elevador de Serviço"
// ============================================================
const TAGTXT = 'REGRAS DA MADRUGADA · ELEVADOR';
delete DEST.tres; delete DEST.luz; delete DEST.gerente;
Object.assign(DEST, { existe: 'perigo', saia: 'perigo', elevador: 'amarelo', terceiro: 'perigo', sozinho: 'perigo', vazio: 'perigo', bilhete: 'amarelo', esperando: 'perigo', entrei: 'perigo', subiu: 'perigo', cameras: 'amarelo', atenda: 'perigo', dezessete: 'amarelo' });
const L = k => TL.linhas[k].ini, F = k => TL.linhas[k].fim;
const PWw = (k, re) => { const p = TL.linhas[k].palavras.find(([w]) => re.test(NORM(w))); return p ? p[1] : L(k); };
const AZUL = '#2F5DA8';
const REGRAS_PREDIO = [
  ['1. Parou num andar que', 'não existe? Não saia.'],
  ['2. Após a meia-noite, ninguém', 'usa o elevador de serviço.'],
  ['3. Interfone do 13º andar:', 'NÃO atenda.'],
];

// ---------- portaria ----------
// o: {andar (texto do visor), porta (0..1 aberta), luzElev, bilhete, porteiro:{...}, sindico, cctv}
function portaria(t, o = {}) {
  // parede e piso
  ctx.fillStyle = '#3B3346'; ctx.fillRect(-400, -400, W + 800, H + 800);
  ctx.fillStyle = '#4A4156'; for (let x = -400; x < W + 400; x += 160) ctx.fillRect(x, 0, 6, 1300);
  ctx.fillStyle = '#2B2530'; ctx.fillRect(-400, 1260, W + 800, 800);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 3; for (let x = -400; x < W + 400; x += 140) { ctx.beginPath(); ctx.moveTo(x, 1260); ctx.lineTo(540 + (x - 540) * 2.4, 1920); ctx.stroke(); }
  // elevador de serviço (à direita)
  const ex0 = 600, ey0 = 560, ew = 340, eh = 700;
  ctx.fillStyle = '#1A161F'; ctx.fillRect(ex0 - 30, ey0 - 30, ew + 60, eh + 30);
  const ab = clamp(o.porta ?? 0);
  // interior do elevador (visível quando abre)
  ctx.fillStyle = o.luzElev ? '#D9E6DF' : '#0A090D'; ctx.fillRect(ex0, ey0, ew, eh);
  if (o.luzElev) { glow(ex0 + ew / 2, ey0 + 60, 380, '235,255,245', 0.35); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(ex0, ey0 + eh - 120, ew, 120); }
  if (o.bilhete && o.luzElev) { ctx.save(); ctx.translate(ex0 + ew / 2 + 20, ey0 + eh - 50); ctx.rotate(0.2); ctx.fillStyle = COR.papel; ctx.fillRect(-40, -18, 80, 36); ctx.restore(); }
  if (o.dentro) o.dentro(ex0, ey0, ew, eh);
  // portas de aço
  const pw = ew / 2 * (1 - ab);
  const aco = ctx.createLinearGradient(ex0, 0, ex0 + ew, 0); aco.addColorStop(0, '#7E8592'); aco.addColorStop(0.5, '#B5BBC6'); aco.addColorStop(1, '#7E8592');
  ctx.fillStyle = aco; ctx.fillRect(ex0, ey0, pw, eh); ctx.fillRect(ex0 + ew - pw, ey0, pw, eh);
  ctx.strokeStyle = '#4E535D'; ctx.lineWidth = 4; ctx.strokeRect(ex0, ey0, pw, eh); ctx.strokeRect(ex0 + ew - pw, ey0, pw, eh);
  // visor do andar
  ctx.fillStyle = '#0A0505'; rr(ex0 + ew / 2 - 90, ey0 - 140, 180, 90, 12); ctx.fill();
  ctx.fillStyle = '#FF4040'; ctx.font = '64px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(o.andar ?? 'T', ex0 + ew / 2, ey0 - 95); glow(ex0 + ew / 2, ey0 - 95, 120, '255,64,64', 0.2);
  ctx.fillStyle = '#E8E4DA'; ctx.font = '26px "Archivo Black"'; ctx.fillText('SERVIÇO', ex0 + ew / 2, ey0 - 20);
  // interfone na parede (esquerda)
  ctx.fillStyle = '#C9C2B2'; rr(80, 620, 200, 300, 20); ctx.fill(); ctx.strokeStyle = COR.T; ctx.lineWidth = 6; ctx.stroke();
  for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) { const n = 13 - (r * 3 + c); const on = o.interfone && n === 13 && Math.sin(t * 12) > 0; ctx.fillStyle = on ? '#FF4040' : '#5A564C'; circ(120 + c * 60, 680 + r * 50, 14, ctx.fillStyle); }
  // relógio
  ctx.fillStyle = '#0F1220'; rr(70, 300, 260, 90, 14); ctx.fill();
  ctx.fillStyle = COR.perigo; ctx.font = '62px "IBM Plex Mono"'; ctx.fillText(o.hora ?? '03:17', 200, 346);
  // porteiro atrás da mesa
  if (o.porteiro !== false) frentista(o.px ?? 300, 1800, 1.3, Object.assign({ t, cor: AZUL }, o.porteiro || {}));
  if (o.sindico) gerente(o.sx ?? 120, 1800, 1.25, Object.assign({ t, colete: '#5B3A2E' }, o.sindico));
  // mesa da portaria
  ctx.fillStyle = '#6B4B36'; ctx.fillRect(-400, 1560, 1000, 400); ctx.fillStyle = '#8A6448'; ctx.fillRect(-400, 1540, 1000, 40);
  if (o.monitor) { ctx.fillStyle = '#111'; rr(380, 1380, 200, 150, 10); ctx.fill(); ctx.fillStyle = '#2E3B33'; ctx.fillRect(392, 1392, 176, 118); }
  // luz geral (penumbra)
  ctx.fillStyle = `rgba(5,4,10,${o.escuro ?? 0.35})`; ctx.fillRect(-400, -400, W + 800, H + 800);
  if (o.luzElev && ab > 0) glow(ex0 + ew / 2, 1300, 520 * ab, '235,255,245', 0.25);
}

// ---------- visão de dentro do elevador (gancho) ----------
function porta13(t, ab) {
  ctx.fillStyle = '#0B0A0E'; ctx.fillRect(0, 0, W, H);
  // corredor escuro do outro lado
  const g = ctx.createLinearGradient(0, 400, 0, 1700); g.addColorStop(0, '#08070B'); g.addColorStop(1, '#141018'); ctx.fillStyle = g; ctx.fillRect(140, 360, 800, 1360);
  ctx.globalAlpha = faixa(ab, 0.15, 0.6); for (const [x, y, s] of [[380, 900, 1], [700, 820, 0.8], [560, 1060, 1.2], [300, 1180, 0.9], [800, 1120, 1]]) { circ(x - 14 * s, y, 7 * s, '#FFF4C2'); circ(x + 14 * s, y, 7 * s, '#FFF4C2'); glow(x, y, 40 * s, '255,244,194', 0.3); } ctx.globalAlpha = 1;
  // portas abrindo
  const pw = 400 * (1 - ab);
  const aco = ctx.createLinearGradient(140, 0, 940, 0); aco.addColorStop(0, '#5E6572'); aco.addColorStop(0.5, '#9AA0AB'); aco.addColorStop(1, '#5E6572');
  ctx.fillStyle = aco; ctx.fillRect(140, 360, pw, 1360); ctx.fillRect(940 - pw, 360, pw, 1360);
  // moldura interna do elevador
  ctx.fillStyle = '#C8D2CC'; ctx.fillRect(0, 0, 140, H); ctx.fillRect(940, 0, 140, H); ctx.fillRect(0, 0, W, 360); ctx.fillRect(0, 1720, W, 200);
  ctx.fillStyle = '#B4BEB8'; ctx.fillRect(0, 300, W, 60);
  // visor 13
  ctx.fillStyle = '#0A0505'; rr(420, 1740, 240, 140, 16); ctx.fill();
  ctx.fillStyle = '#FF4040'; ctx.font = '110px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('13', 540, 1812);
  glow(540, 1812, 200, '255,64,64', 0.35);
  vinheta(0.65);
}

// ---------- visor descendo (close) ----------
function visor(t, n, z = 1) {
  ctx.fillStyle = '#08070B'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 1000); ctx.scale(z, z);
  ctx.fillStyle = '#1A161F'; rr(-330, -230, 660, 460, 30); ctx.fill();
  ctx.fillStyle = '#0A0505'; rr(-270, -170, 540, 340, 20); ctx.fill();
  ctx.fillStyle = '#FF4040'; ctx.font = '260px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n, 0, 10);
  glow(0, 0, 500, '255,64,64', 0.25);
  ctx.fillStyle = '#E8E4DA'; ctx.font = '40px "Archivo Black"'; ctx.fillText('▼', 0, 200);
  ctx.restore();
  vinheta(0.7);
}

// ---------- bilhete no chão ----------
function bilheteSobe(t, k) {
  ctx.fillStyle = '#B9C6BF'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 3; for (let x = 0; x < W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  ctx.save(); ctx.translate(540, 1050); ctx.rotate(-0.06); ctx.scale(lerp(1, 1.12, k), lerp(1, 1.12, k));
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 30; ctx.fillStyle = COR.papel; ctx.fillRect(-380, -260, 760, 520); ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#7A1418'; ctx.font = '110px "Caveat"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const a = 'Sobe.', b = 'Tá todo mundo', c = 'te esperando.';
  const n = Math.floor((a.length + b.length + c.length) * k);
  ctx.fillText(a.slice(0, n), 0, -130); ctx.fillText(b.slice(0, Math.max(0, n - a.length)), 0, 0); ctx.fillText(c.slice(0, Math.max(0, n - a.length - b.length)), 0, 120);
  ctx.restore();
  vinheta(0.5);
}

// ---------- câmera de segurança ----------
function cctv(t, o = {}) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.beginPath(); ctx.rect(40, 360, 1000, 1200); ctx.clip();
  ctx.translate(40, 360); ctx.scale(1000 / W, 1200 / 1400); ctx.translate(0, -150);
  ctx.filter = 'grayscale(1) contrast(1.25) brightness(0.9)';
  portaria(t, { andar: o.andar ?? 'T', porta: o.porta ?? 1, luzElev: o.porta > 0.05, porteiro: false, escuro: 0.3, dentro: o.dentro });
  ctx.restore();
  ctx.filter = 'none';
  // linhas de varredura + texto
  ctx.fillStyle = 'rgba(255,255,255,0.04)'; for (let y = 360; y < 1560; y += 6) ctx.fillRect(40, y, 1000, 2);
  ctx.fillStyle = '#E8E8E8'; ctx.font = '36px "IBM Plex Mono"'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('CAM 02 · TÉRREO', 70, 400); ctx.textAlign = 'right'; ctx.fillText(o.hora ?? '03:24:51', 1010, 400);
  if (Math.sin(t * 4) > 0) { circ(80, 1510, 12, '#E5484D'); ctx.textAlign = 'left'; ctx.fillStyle = '#E8E8E8'; ctx.fillText('REC', 104, 1512); }
  ctx.strokeStyle = '#333'; ctx.lineWidth = 6; ctx.strokeRect(40, 360, 1000, 1200);
}
function porteiroCCTV(ex0, ey0, ew, eh, k, t) { // o porteiro (de costas) entrando no elevador
  const x = lerp(260, ex0 + ew / 2, k), fy = lerp(1800, ey0 + eh - 10, k), s = lerp(1.2, 0.75, k);
  frentista(x, fy, s, { t, cor: AZUL, passo: k < 1 ? t * 8 : null, ox: 1 });
}

// ========== cenas ==========
function cenaGancho(t, u) { porta13(t, faixa(u, 0.0, 1.4)); }
function cenaPortaria(t, u) {
  camera(lerp(520, 460, u / 4), 1150, lerp(1.0, 1.08, u / 4), () => portaria(t, { hora: '22:00', porteiro: { ox: 0.5, oy: -0.1 } }));
  vinheta(0.55);
}
function cenaSindico(t, u) {
  const e = faixa(t, L(2) + 0.6, L(2) + 1.2);
  camera(260, 1350, 1.55, () => portaria(t, { hora: '22:00', sindico: { ox: 0.7, boca: 'reta', bD: lerp(-0.2, -1.3, e), segura: e < 0.9 ? 'papel' : null }, sx: 70, px: 400, porteiro: { ox: -0.7, bD: lerp(-0.25, -1.0, e), segura: e > 0.9 ? 'papel' : null } }));
  vinheta(0.55);
}
function cenaRegras(t, u) {
  ctx.fillStyle = '#0D0B18'; ctx.fillRect(0, 0, W, H);
  const v2 = faixa(t, L(3) + 0.3, F(3)), v3 = faixa(t, L(4) + 0.3, F(4));
  papelRegras(540, 1060, lerp(1.0, 1.1, faixa(t, L(3), F(4))), -0.03, [1, v2, v3], t < L(4) ? 1 : 2, 'PORTARIA · NOITE', REGRAS_PREDIO);
  maos(540, 1560, 1); vinheta(0.6);
}
function cenaInterfone(t, u) {
  camera(220, 820, lerp(2.2, 2.6, u / 3), () => portaria(t, { interfone: true, porteiro: { ox: -1, sob: 1, boca: 'medo' } }));
  vinheta(0.7);
}
function cenaNaoAtende(t, u) {
  camera(300, 1420, 2.0, () => portaria(t, { interfone: true, porteiro: { ox: -1, sob: 1, boca: 'nervoso', suor: true, treme: 2 } }));
  vinheta(0.7);
}
function cenaDesce(t, u) {
  const ws = TL.linhas[8].palavras;
  let n = '13';
  if (t >= L(7) + 1.2) n = '13';
  if (ws.length) { if (t >= ws[0][1]) n = '12'; if (t >= (ws[1] || ws[0])[1]) n = '11'; if (t >= (ws[2] || ws[0])[1]) n = '10'; }
  if (t >= PWw(8, /terreo/)) n = 'T';
  if (t < L(8)) { visor(t, Math.sin(t * 6) > 0 ? '13' : '13', lerp(1, 1.08, faixa(t, L(7), F(7)))); return; }
  if (n !== 'T') { visor(t, n, 1.1); return; }
  camera(620, 1150, 1.1, () => portaria(t, { andar: 'T', porteiro: { ox: 1, sob: 1, boca: 'medo', suor: true } }));
  vinheta(0.6);
}
function cenaAbre(t, u) {
  const ab = faixa(t, L(9) - 0.1, L(9) + 0.8);
  camera(lerp(620, 770, faixa(t, PWw(9, /bilhete/) - 0.5, PWw(9, /bilhete/))), lerp(1150, 1150, 0), lerp(1.1, 1.8, faixa(t, PWw(9, /bilhete/) - 0.5, PWw(9, /bilhete/))), () => portaria(t, { andar: 'T', porta: ab, luzElev: true, bilhete: true, porteiro: { ox: 1, sob: 1, boca: 'medo', suor: true } }));
  vinheta(0.6);
}
function cenaBilhete(t, u) { bilheteSobe(t, faixa(t, L(10) - 0.35, F(10) - 0.2)); }
function cenaEspera(t, u) {
  const h = 17 + Math.floor(faixa(t, L(11), F(11)) * 10);
  camera(480, 1200, 1.0, () => portaria(t, { andar: 'T', porta: 1, luzElev: true, bilhete: true, hora: `03:${h}`, porteiro: { ox: 1, sob: 1, boca: 'nervoso', suor: true } }));
  vinheta(0.6);
}
function cenaCameras(t, u) {
  ctx.fillStyle = '#F6E3C0'; ctx.fillRect(0, 0, W, H);
  camera(300, 1350, 1.5, () => portaria(t, { escuro: 0, hora: '07:02', monitor: true, porteiro: false, sindico: { ox: 0.8, oy: 0.4, boca: 'reta' }, sx: 220 }));
  vinheta(0.3);
}
function cenaEntrei(t, u) {
  const k = faixa(t, L(13) + 0.4, PWw(13, /entrei/) + 0.3);
  cctv(t, { porta: 1, hora: '03:28:' + String(10 + Math.floor(u * 7)).padStart(2, '0'), dentro: k < 1 ? null : null });
  // porteiro desenhado por cima (dentro do quadro do cctv)
  ctx.save(); ctx.beginPath(); ctx.rect(40, 360, 1000, 1200); ctx.clip();
  ctx.translate(40, 360); ctx.scale(1000 / W, 1200 / 1400); ctx.translate(0, -150); ctx.filter = 'grayscale(1) contrast(1.2)';
  porteiroCCTV(600, 560, 340, 700, k, t); ctx.restore(); ctx.filter = 'none';
}
function cenaSobe(t, u) {
  const fecha = faixa(t, L(14) - 0.2, L(14) + 0.8), sobe = PWw(14, /terceiro/);
  const n = t < L(14) + 0.9 ? 'T' : t < sobe - 0.6 ? String(1 + Math.floor(faixa(t, L(14) + 0.9, sobe - 0.6) * 11)) : '13';
  cctv(t, { porta: 1 - fecha, andar: n, hora: '03:28:31' });
  const ch = faixa(t, sobe, sobe + 0.1) * (1 - faixa(t, sobe + 0.1, sobe + 1.0));
  if (ch > 0) vinheta(0.85 * ch, '229,72,77');
}
function cenaFim(t, u) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (u < 0.12) { ctx.fillStyle = 'rgba(229,72,77,0.35)'; ctx.fillRect(0, 0, W, H); }
  const a = k => faixa(u, k, k + 0.35);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.globalAlpha = a(0); ctx.fillStyle = '#fff'; ctx.font = '104px "Archivo Black"';
  ctx.fillText('VOCÊ', 540, 820); ctx.fillStyle = COR.perigo; ctx.fillText('ENTRARIA?', 540, 940);
  ctx.globalAlpha = a(0.6); ctx.fillStyle = COR.amarelo; ctx.font = '44px "Archivo Black"'; ctx.fillText('COMENTA AÍ', 540, 1080);
  ctx.globalAlpha = a(1.0); ctx.fillStyle = '#8A90A0'; ctx.font = '40px "Archivo Black"';
  ctx.fillText('REGRAS DA MADRUGADA', 540, 1240); ctx.fillText('@continuaamanha.tv', 540, 1300);
  ctx.globalAlpha = 1;
}

const _b = [0, L(1) - 0.3, L(2) - 0.25, L(3) - 0.25, L(5) - 0.25, L(6) - 0.2, L(7) - 0.2, L(9) - 0.25, L(10) - 0.2, L(11) - 0.2, L(12) - 0.3, L(13) - 0.2, L(14) - 0.2, F(14) + 1.4];
const _f = [cenaGancho, cenaPortaria, cenaSindico, cenaRegras, cenaInterfone, cenaNaoAtende, cenaDesce, cenaAbre, cenaBilhete, cenaEspera, cenaCameras, cenaEntrei, cenaSobe];
const CENAS = _f.map((f, i) => [_b[i], _b[i + 1], f]).concat([[_b[13], 999, cenaFim]]);
