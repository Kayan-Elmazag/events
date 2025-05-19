// نظام المصادقة من الصفحة الأولى
const AuthSystem = {
  // دالة التحقق من الجلسة
  verifyUserSession: async function(token) {
    // هنا بتكون عادة اتصال بالسيرفر للتحقق
    // بس هنستخدم النسخة البسيطة من الصفحة الأولى
    return new Promise(resolve => resolve(!!token));
  },

  // دالة تسجيل الخروج
  logout: function() {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('userData');
    window.location.href = 'login.html';
  },

  // دالة تحميل بيانات المستخدم
  loadUserProfile: function() {
    try {
      const userData = JSON.parse(localStorage.getItem('userData')) || {};
      const userNameElement = document.getElementById('userName');
      const avatarElement = document.getElementById('userAvatar');
      
      if (userNameElement && userData.fullName) {
        userNameElement.textContent = userData.fullName;
      }
      
      if (avatarElement && userData.fullName) {
        const names = userData.fullName.split(' ');
        let initials = names[0].charAt(0);
        if (names.length > 1) initials += names[1].charAt(0);
        avatarElement.textContent = initials || 'م';
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }
};

// دالة التحقق من الجلسة (من الصفحة الأولى)
async function checkSession() {
  const token = localStorage.getItem('sessionToken');
  const userData = localStorage.getItem('userData');
  
  if (!token || !userData) {
    window.location.href = 'login.html';
    return false;
  }
  
  try {
    const isValid = await AuthSystem.verifyUserSession(token);
    if (!isValid) {
      AuthSystem.logout();
      return false;
    }
    return true;
  } catch (error) {
    AuthSystem.logout();
    return false;
  }
}

// دالة تسجيل الخروج (من الصفحة الأولى)
function logout() {
  AuthSystem.logout();
}