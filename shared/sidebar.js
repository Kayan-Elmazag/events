document.addEventListener('DOMContentLoaded', function() {
  // تأخير التنفيذ قليلاً للتأكد من تحميل كل شيء
  setTimeout(initSidebar, 100);
});

function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) {
    console.error('Sidebar element not found!');
    return;
  }

  // إنشاء زر التبديل إذا لم يكن موجودًا
  if (!document.querySelector('.sidebar-toggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.setAttribute('aria-label', 'Toggle sidebar menu');
    document.body.appendChild(toggleBtn);
  }

  // إنشاء الطبقة الشفافة إذا لم تكن موجودة
  if (!document.querySelector('.overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
  }

  setupEventListeners();
  handleResponsiveBehavior();
  highlightCurrentPage();
}

function setupEventListeners() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const overlay = document.querySelector('.overlay');
  
  if (!toggleBtn || !overlay) {
    console.error('Toggle button or overlay not found!');
    return;
  }
  
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
  
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
  
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  });
}

function handleResponsiveBehavior() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const overlay = document.querySelector('.overlay');
  
  function updateLayout() {
    if (window.innerWidth <= 768) {
      toggleBtn.style.display = 'flex';
      sidebar.style.transform = 'translateX(100%)';
      overlay.classList.remove('active');
    } else {
      toggleBtn.style.display = 'none';
      sidebar.style.transform = 'translateX(0)';
      overlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }
  
  window.addEventListener('resize', updateLayout);
  updateLayout();
}

function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const menuLinks = document.querySelectorAll('.sidebar a');
  
  menuLinks.forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    link.classList.remove('active');
    
    if (linkPath === currentPage || 
        (linkPath === 'index.html' && currentPage === '') ||
        (linkPath === '' && currentPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}
