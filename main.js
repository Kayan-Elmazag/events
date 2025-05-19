/**
 * Main application initialization file
 * Now with sidebar functionality separated into its own module
 */

document.addEventListener('DOMContentLoaded', function() {
  // 1. تحميل المكونات أولاً
  loadComponents().then(() => {
    // 2. تهيئة التطبيق بعد تحميل كل شيء
    initApp();
  });
});

async function loadComponents() {
  try {
    await Promise.all([
      loadComponent('header', '/shared/header.html'),
      loadComponent('sidebar', '/shared/sidebar.html'),
      loadComponent('footer', '/shared/footer.html')
    ]);
    console.log("تم تحميل جميع المكونات بنجاح");
  } catch (error) {
    console.error('حدث خطأ في تحميل المكونات:', error);
  }
}

async function loadComponent(id, url) {
  const element = document.getElementById(id);
  if (!element) return;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`فشل في تحميل ${url}: ${response.status}`);
    element.innerHTML = await response.text();
    
    // إضافة تأثير الظهور بالتدريج
    element.classList.add('animated');
    
    return true;
  } catch (error) {
    console.error(`خطأ في تحميل ${url}:`, error);
    element.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-circle"></i>
        خطأ في تحميل ${url}
      </div>`;
    return false;
  }
}

function initApp() {
  // تم نقل تهيئة الشريط الجانبي إلى ملف sidebar.js منفصل
  
  // تهيئة قائمة المستخدم
  initUserDropdown();
  
  // إضافة تأثيرات الـ Ripple للأزرار
  initRippleEffect();
  
  // تهيئة أي رسوم بيانية أو مخططات
  initCharts();
  
  // إضافة تأثيرات التمرير السلس
  initSmoothScroll();
  
  // تهيئة رسائل الإشعارات
  initNotifications();
}

function initUserDropdown() {
  const userAvatar = document.querySelector('.user-avatar');
  if (!userAvatar) return;
  
  userAvatar.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.dropdown-menu');
    if (dropdown) {
      e.stopPropagation();
      dropdown.classList.toggle('active');
      
      // إضافة تأثير ظهور متدرج
      if (dropdown.classList.contains('active')) {
        const menuItems = dropdown.querySelectorAll('a');
        menuItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50 * index);
        });
      }
    }
  });
  
  // إغلاق القائمة عند النقر خارجها
  document.addEventListener('click', () => {
    const dropdown = document.querySelector('.dropdown-menu.active');
    if (dropdown) dropdown.classList.remove('active');
  });
}

function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn, .nav-link, .ripple');
  
  buttons.forEach(button => {
    button.classList.add('ripple');
    
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.className = 'ripple-effect';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

function initCharts() {
  // تهيئة الرسوم البيانية إذا وجدت
  const chartContainers = document.querySelectorAll('.chart-container');
  if (chartContainers.length === 0) return;
  
  console.log('تم العثور على', chartContainers.length, 'رسوم بيانية');
}

function initSmoothScroll() {
  // التمرير السلس للروابط الداخلية
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function initNotifications() {
  // إضافة وظيفة لعرض الإشعارات
  window.showNotification = function(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="notification-icon fas ${getIconForType(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">&times;</button>
    `;
    
    const notificationsContainer = document.querySelector('.notifications-container');
    if (!notificationsContainer) {
      const container = document.createElement('div');
      container.className = 'notifications-container';
      document.body.appendChild(container);
      container.appendChild(notification);
    } else {
      notificationsContainer.appendChild(notification);
    }
    
    // إضافة حدث الإغلاق
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.classList.add('notification-hiding');
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    // إخفاء الإشعار تلقائيًا بعد مدة محددة
    setTimeout(() => {
      notification.classList.add('notification-hiding');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duration);
    
    // تأثير ظهور الإشعار
    setTimeout(() => {
      notification.classList.add('notification-show');
    }, 10);
  };
  
  function getIconForType(type) {
    switch(type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-circle';
      case 'warning': return 'fa-exclamation-triangle';
      default: return 'fa-info-circle';
    }
  }
}

// تهيئة نظام البطاقات المتحركة
function initAnimatedCards() {
  const cards = document.querySelectorAll('.card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
      }
    });
  }, {
    threshold: 0.1
  });
  
  cards.forEach(card => {
    card.classList.add('card-animated');
    observer.observe(card);
  });
}

// تهيئة مؤشرات التحميل
function initLoaders() {
  window.showPageLoader = function(show = true) {
    let loader = document.querySelector('.page-loader');
    
    if (show) {
      if (!loader) {
        loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
          <div class="loader-spinner"></div>
          <div class="loader-text">جاري التحميل...</div>
        `;
        document.body.appendChild(loader);
      }
      setTimeout(() => {
        loader.classList.add('loader-visible');
      }, 10);
    } else {
      if (loader) {
        loader.classList.remove('loader-visible');
        setTimeout(() => {
          loader.remove();
        }, 300);
      }
    }
  };
  
  window.addEventListener('load', () => {
    window.showPageLoader(false);
  });
}

// تهيئة الأدوات المساعدة
function initHelpers() {
  // تفعيل التلميحات (Tooltips)
  const tooltips = document.querySelectorAll('[data-tooltip]');
  
  tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', () => {
      const text = tooltip.getAttribute('data-tooltip');
      const tooltipElement = document.createElement('div');
      tooltipElement.className = 'tooltip';
      tooltipElement.textContent = text;
      
      document.body.appendChild(tooltipElement);
      
      const rect = tooltip.getBoundingClientRect();
      tooltipElement.style.top = rect.top - tooltipElement.offsetHeight - 10 + 'px';
      tooltipElement.style.left = rect.left + (rect.width / 2) - (tooltipElement.offsetWidth / 2) + 'px';
      
      setTimeout(() => {
        tooltipElement.classList.add('tooltip-visible');
      }, 10);
    });
    
    tooltip.addEventListener('mouseleave', () => {
      const tooltipElement = document.querySelector('.tooltip');
      if (tooltipElement) {
        tooltipElement.classList.remove('tooltip-visible');
        setTimeout(() => {
          tooltipElement.remove();
        }, 300);
      }
    });
  });
}

// تشغيل الوظائف الإضافية بعد تحميل الصفحة
window.addEventListener('load', () => {
  initAnimatedCards();
  initLoaders();
  initHelpers();
  
  // عرض إشعار ترحيبي
  setTimeout(() => {
    if (typeof window.showNotification === 'function') {
      window.showNotification('مرحبًا بك في لوحة التحكم!', 'success', 5000);
    }
  }, 1000);
});