async function handleLogout() {
  // 1. جلب اسم المستخدم
  let username = 'عزيزي المستخدم';
  if (typeof AuthSystem !== 'undefined' && AuthSystem.getCurrentUser) {
    const user = AuthSystem.getCurrentUser();
    if (user && user.name) username = user.name;
  } else {
    const storedUser = localStorage.getItem('username');
    if (storedUser) username = storedUser;
  }

  // 2. عرض تنبيه تأكيد فخم مع اسم المستخدم
  const { isConfirmed } = await Swal.fire({
    title: `هل أنت متأكد يا ${username}؟`,
    text: "سنفتقدك! سيتم تسجيل خروجك من النظام.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'نعم، سجل خروجي',
    cancelButtonText: 'إلغاء',
    customClass: {
      popup: 'rtl-swal'
    }
  });

  if (!isConfirmed) return;

  // 3. عرض مؤشر تحميل أنيق
  Swal.fire({
    title: 'جاري تسجيل الخروج... في أمان الله!',
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
    }
  });

  // 4. تنفيذ عملية الخروج
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (typeof AuthSystem !== 'undefined') {
      AuthSystem.logout();
    } else {
      localStorage.clear();
      window.location.href = '/login.html';
    }

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'خطأ!',
      text: 'حدث خطأ أثناء تسجيل الخروج',
      confirmButtonText: 'حسناً'
    });
  }
}

// تحميل بيانات المستخدم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  let username = 'عزيزي المستخدم';
  
  if (typeof AuthSystem !== 'undefined') {
    const user = AuthSystem.getCurrentUser?.();
    if (user && user.name) username = user.name;
  } else {
    const storedUser = localStorage.getItem('username');
    if (storedUser) username = storedUser;
  }

  // عرض الاسم في الهيدر
  document.getElementById('userName').textContent = username;

  // تحميل البروفايل (لو موجود)
  if (typeof AuthSystem !== 'undefined') {
    AuthSystem.loadUserProfile?.();
  }
});
