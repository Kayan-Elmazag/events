// نسخة معدلة من نظام الصفحة الثانية ليتوافق مع النظام الجديد
async function validateSession() {
  return await checkSession();
}

function endSession(message = 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى') {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: 'warning',
      title: message,
      confirmButtonText: 'تسجيل الدخول'
    }).then(() => {
      logout();
    });
  } else {
    logout();
  }
}

// مراقبة النشاط (من الصفحة الثانية)
function monitorSessionActivity() {
  let idleTime = 0;
  const idleInterval = setInterval(() => {
    idleTime++;
    if (idleTime > 30) { // بعد 30 دقيقة من عدم النشاط
      clearInterval(idleInterval);
      endSession('تم تسجيل الخروج بسبب عدم النشاط');
    }
  }, 60000); // دقيقة

  document.addEventListener('mousemove', () => idleTime = 0);
  document.addEventListener('keypress', () => idleTime = 0);
}