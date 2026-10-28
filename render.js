// Renderiza um episódio de Linha 0 frame a frame (30 fps) e gera MP4 H.264.
// Uso: node render.js [ep02.html] [saida.mp4]
//      node render.js ep02.html --frames 1.5,8,20   (só PNGs de prévia)
// Se existir narracao.mp3 na mesma pasta, ela entra como trilha de áudio.
const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const flagIdx = args.indexOf('--frames');
const previa = flagIdx >= 0 ? args.splice(flagIdx, 2)[1].split(',').map(Number) : null;
const entrada = path.resolve(args[0] || 'ep02.html');
const saida = path.resolve(args[1] || path.basename(entrada, '.html') + '.mp4');
const narracao = path.join(path.dirname(entrada), 'narracao.mp3');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--no-sandbox', '--force-device-scale-factor=1'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.goto('file://' + entrada + '?render=1', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.pronto);
  const { duracao, fps } = await page.evaluate(() => ({ duracao: window.DURACAO, fps: window.FPS }));

  const frame = async t => {
    const b64 = await page.evaluate(t => {
      window.renderFrame(t);
      return document.getElementById('tela').toDataURL('image/png').split(',')[1];
    }, t);
    return Buffer.from(b64, 'base64');
  };

  if (previa) {
    const dir = path.join(path.dirname(saida), 'previa');
    fs.mkdirSync(dir, { recursive: true });
    for (const t of previa) {
      const f = path.join(dir, `t${t.toFixed(2)}.png`);
      fs.writeFileSync(f, await frame(t));
      console.log(f);
    }
    await browser.close();
    return;
  }

  const total = Math.round(duracao * fps);
  const ff = ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
  if (fs.existsSync(narracao)) ff.push('-i', narracao, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k');
  ff.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium',
    '-movflags', '+faststart', '-t', String(duracao), saida);
  const ffmpeg = spawn('ffmpeg', ff, { stdio: ['pipe', 'ignore', 'inherit'] });
  const fim = new Promise((ok, erro) => ffmpeg.on('close', c => (c === 0 ? ok() : erro(new Error('ffmpeg saiu com ' + c)))));

  for (let i = 0; i < total; i++) {
    const png = await frame(i / fps);
    if (!ffmpeg.stdin.write(png)) await new Promise(r => ffmpeg.stdin.once('drain', r));
    if (i % fps === 0) process.stdout.write(`\r${i}/${total} frames`);
  }
  ffmpeg.stdin.end();
  await fim;
  await browser.close();
  console.log(`\nPronto: ${saida}`);
})().catch(e => { console.error(e); process.exit(1); });
