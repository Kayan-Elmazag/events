/**
 * نظام تسجيل أحداث الرشاش - النسخة المطورة والمنقحة
 * تم التطوير لمعالجة مشاكل التخطيط وعرض البيانات
 */

// تهيئة المتغيرات العامة
const API_URL = "https://script.google.com/macros/s/AKfycbyjC0rnOGMu7Wpoj0QWSDv80kR9CMCT9U3Uis4NUhr3ZE707joVebV8wQ8bxJFSfZhe/exec";
const USER_DATA = JSON.parse(localStorage.getItem('userData')) || {};
const TODAY = new Date().toISOString().split('T')[0];

// عناصر DOM العامة
let sidebarToggleBtn;

/**
 * تحميل نموذج تسجيل أحداث الرشاش
 */
function loadSprinklerEventForm() {
    try {
        // تحميل بيانات المستخدم
        const fullName = USER_DATA.fullName || "مستخدم النظام";
        const uuid = generateUUID();
        
        // إنشاء واجهة النموذج
        const mainContent = document.getElementById("mainContent");
        mainContent.innerHTML = `
            <div class="sprinkler-form-container">
                <div class="sprinkler-form-card animated fadeIn">
                    <h2 class="sprinkler-form-title">
                        <i class="bx bxs-calendar-event"></i> تسجيل أحداث الرشاش
                    </h2>
                    
                    <form id="eventForm" class="sprinkler-form">
                        <input type="hidden" name="المنشئ" value="${fullName}">
                        <input type="hidden" name="المعرف_الفريد" value="${uuid}">
                        <input type="hidden" name="الحالة" value="قيد الانتظار">
                        <input type="hidden" name="ملاحظات_التنفيذ" value="لم يتم التنفيذ بعد">
                        <input type="hidden" name="تاريخ_ووقت_التسجيل">
                        
                        <div class="form-group">
                            <label class="sprinkler-form-label">🚿 اسم الرشاش</label>
                            <div class="sprinkler-input-with-icon">
                                <input type="text" class="sprinkler-form-control" name="اسم_الرشاش" id="sprinklerInput" 
                                    list="sprinklers" required placeholder="اختر أو اكتب اسم الرشاش">
                                <i class="bx bx-shower"></i>
                                <datalist id="sprinklers"></datalist>
                            </div>
                            <div id="sprinklerError" class="error-message"></div>
                        </div>
                        
                        <div class="form-group">
                            <label class="sprinkler-form-label">📌 نوع الحدث</label>
                            <div class="sprinkler-input-with-icon">
                                <input type="text" class="sprinkler-form-control" name="الحدث" id="eventInput" 
                                    list="events" required placeholder="اختر أو اكتب نوع الحدث">
                                <i class="bx bx-calendar-event"></i>
                                <datalist id="events"></datalist>
                            </div>
                            <div id="eventError" class="error-message"></div>
                        </div>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="sprinkler-form-label">⏱️ تنفيذ بعد (أيام)</label>
                                <div class="sprinkler-input-with-icon">
                                    <input type="number" class="sprinkler-form-control" name="تنفيذ_بعد" 
                                        min="1" max="30" required placeholder="عدد الأيام" id="daysInput">
                                    <i class="bx bx-time"></i>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="sprinkler-form-label">📅 تاريخ التنفيذ</label>
                                <div class="sprinkler-input-with-icon">
                                    <input type="text" class="sprinkler-form-control" id="executionDate" 
                                        readonly placeholder="سيتم حسابه تلقائياً">
                                    <i class="bx bx-calendar"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="sprinkler-form-label">📝 ملاحظة</label>
                            <div class="sprinkler-input-with-icon">
                                <textarea class="sprinkler-form-control" name="ملاحظة" rows="3" 
                                    placeholder="أدخل أي ملاحظات إضافية"></textarea>
                                <i class="bx bx-edit"></i>
                            </div>
                        </div>
                        
                        <div class="sprinkler-form-actions">
                            <button type="submit" class="btn btn-primary ripple">
                                <i class="bx bx-save"></i> حفظ البيانات
                            </button>
                            <button type="reset" class="btn btn-secondary ripple">
                                <i class="bx bx-reset"></i> إعادة تعيين
                            </button>
                        </div>
                    </form>
                </div>
                
                <div id="todayRecords" class="sprinkler-today-records animated fadeIn">
                    <h3 class="sprinkler-records-title">
                        <i class="bx bx-list-check"></i> سجلات اليوم (${formatDate(TODAY)})
                    </h3>
                    <div id="recordsLoading" class="loading-spinner">
                        <div class="spinner"></div>
                        <p>جاري تحميل السجلات...</p>
                    </div>
                    <div id="recordsList" class="sprinkler-records-list"></div>
                </div>
            </div>
        `;
        
        // تحميل الخيارات والسجلات
        loadFormOptions();
        setupFormListeners();
        fetchTodayRecords();
        setupSidebarToggle();
        
    } catch (error) {
        console.error("حدث خطأ في تحميل النموذج:", error);
        showError("حدث خطأ في تحميل النموذج. يرجى تحديث الصفحة والمحاولة مرة أخرى.");
    }
}

/**
 * إعداد زرار القائمة الجانبية
 */
function setupSidebarToggle() {
    sidebarToggleBtn = document.createElement('button');
    sidebarToggleBtn.id = 'sidebarToggle';
    sidebarToggleBtn.className = 'sidebar-toggle-btn';
    sidebarToggleBtn.innerHTML = '<i class="bx bx-menu"></i>';
    
    sidebarToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('sidebar-collapsed');
    });
    
    document.body.appendChild(sidebarToggleBtn);
}

/**
 * توليد معرف فريد
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
              v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * تحميل خيارات النموذج من الخادم
 */
async function loadFormOptions() {
    try {
        // عرض حالة التحميل
        document.getElementById("sprinklers").innerHTML = '<option value="جاري التحميل...">';
        document.getElementById("events").innerHTML = '<option value="جاري التحميل...">';
        
        // جلب خيارات الرشاشات
        const sprinklersResponse = await fetch(`${API_URL}?header=اسم_الرشاش`);
        const sprinklersData = await sprinklersResponse.json();
        document.getElementById("sprinklers").innerHTML = sprinklersData.data.map(item => 
            `<option value="${item}">`).join('');
        
        // جلب خيارات الأحداث
        const eventsResponse = await fetch(`${API_URL}?header=الحدث`);
        const eventsData = await eventsResponse.json();
        document.getElementById("events").innerHTML = eventsData.data.map(item => 
            `<option value="${item}">`).join('');
            
    } catch (error) {
        console.error("حدث خطأ في جلب الخيارات:", error);
        document.getElementById("sprinklers").innerHTML = '<option value="فشل التحميل">';
        document.getElementById("events").innerHTML = '<option value="فشل التحميل">';
        showError("حدث خطأ في جلب الخيارات. يرجى المحاولة مرة أخرى.");
    }
}

/**
 * إعداد مستمعي النموذج
 */
function setupFormListeners() {
    const form = document.getElementById("eventForm");
    const daysInput = form.querySelector('[name="تنفيذ_بعد"]');
    const executionDate = document.getElementById("executionDate");
    
    // تحديث تاريخ التنفيذ عند تغيير عدد الأيام
    daysInput.addEventListener('input', function() {
        if (this.value && !isNaN(this.value) && this.value > 0) {
            const execDate = calculateExecutionDate(parseInt(this.value));
            executionDate.value = formatDate(execDate);
        } else {
            executionDate.value = '';
        }
    });
    
    // إرسال النموذج
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // التحقق من صحة المدخلات
        if (!validateForm()) return;
        
        // تعيين تاريخ التسجيل
        form.querySelector('[name="تاريخ_ووقت_التسجيل"]').value = new Date().toISOString();
        
        try {
            // عرض حالة التحميل
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="bx bx-loader bx-spin"></i> جاري الحفظ...';
            submitBtn.disabled = true;
            
            // إرسال البيانات
            const formData = new FormData(form);
            const response = await fetch(API_URL, {
                method: "POST",
                body: formData
            });
            
            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: '✅ تم الحفظ بنجاح',
                    text: 'تم تسجيل الحدث بنجاح في قاعدة البيانات',
                    confirmButtonText: 'تم',
                    timer: 2000,
                    timerProgressBar: true
                });
                
                // إعادة تعيين النموذج وتحديث البيانات
                form.reset();
                executionDate.value = '';
                await loadFormOptions();
                await fetchTodayRecords();
                
            } else {
                throw new Error("فشل الإرسال");
            }
            
        } catch (error) {
            console.error("حدث خطأ في إرسال النموذج:", error);
            await Swal.fire({
                icon: 'error',
                title: '❌ خطأ في الحفظ',
                text: 'حدث خطأ أثناء محاولة حفظ البيانات. يرجى المحاولة مرة أخرى.',
                confirmButtonText: 'حاول مرة أخرى'
            });
            
        } finally {
            // إعادة تعيين زر الإرسال
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="bx bx-save"></i> حفظ البيانات';
            submitBtn.disabled = false;
        }
    });
}

/**
 * التحقق من صحة النموذج
 */
function validateForm() {
    let isValid = true;
    const sprinklerInput = document.getElementById("sprinklerInput");
    const eventInput = document.getElementById("eventInput");
    
    // التحقق من اسم الرشاش
    if (!sprinklerInput.value.trim()) {
        document.getElementById("sprinklerError").textContent = "يجب إدخال اسم الرشاش";
        sprinklerInput.focus();
        isValid = false;
    } else {
        document.getElementById("sprinklerError").textContent = "";
    }
    
    // التحقق من نوع الحدث
    if (!eventInput.value.trim()) {
        document.getElementById("eventError").textContent = "يجب إدخال نوع الحدث";
        if (isValid) eventInput.focus();
        isValid = false;
    } else {
        document.getElementById("eventError").textContent = "";
    }
    
    return isValid;
}

/**
 * حساب تاريخ التنفيذ
 */
function calculateExecutionDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

/**
 * تنسيق التاريخ (بدون وقت)
 */
function formatDate(date) {
    if (!date) return '';
    
    const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const months = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    
    const d = new Date(date);
    const dayName = days[d.getDay()];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    
    return `${dayName}، ${day} ${month} ${year}`;
}

/**
 * جلب سجلات اليوم من الخادم
 */
async function fetchTodayRecords() {
    const recordsList = document.getElementById("recordsList");
    const loadingElement = document.getElementById("recordsLoading");
    
    try {
        // عرض حالة التحميل
        recordsList.innerHTML = '';
        loadingElement.style.display = 'flex';
        
        // جلب البيانات من الخادم
        const response = await fetch(`${API_URL}?date=${TODAY}`);
        const json = await response.json();
        
        // إخفاء حالة التحميل
        loadingElement.style.display = 'none';
        
        if (json.result === "success") {
            if (json.data.length === 0) {
                recordsList.innerHTML = `
                    <div class="sprinkler-empty-records">
                        <i class="bx bx-info-circle"></i>
                        <p>لا توجد سجلات مسجلة اليوم</p>
                    </div>
                `;
                return;
            }
            
            // عرض السجلات
            recordsList.innerHTML = json.data.map(record => `
                <div class="sprinkler-record-card animated fadeIn">
                    <div class="sprinkler-record-header">
                        <span class="sprinkler-record-sprinkler">🚿 ${record["اسم_الرشاش"]}</span>
                        <span class="sprinkler-record-event">📌 ${record["الحدث"]}</span>
                    </div>
                    
                    <div class="sprinkler-record-details">
                        <div class="sprinkler-record-detail">
                            <i class="bx bx-calendar"></i>
                            <span>${formatDate(record["تاريخ_ووقت_التسجيل"])}</span>
                        </div>
                        
                        <div class="sprinkler-record-detail">
                            <i class="bx bx-time-five"></i>
                            <span>تنفيذ: ${formatDate(record["تاريخ_الحدث"])}</span>
                        </div>
                        
                        <div class="sprinkler-record-detail">
                            <i class="bx bx-user"></i>
                            <span>${record["المنشئ"]}</span>
                        </div>
                        
                        <div class="sprinkler-record-detail">
                            <i class="bx bx-info-circle"></i>
                            <span>الحالة: ${getStatusBadge(record["الحالة"])}</span>
                        </div>
                    </div>
                    
                    ${record["ملاحظة"] ? `
                        <div class="sprinkler-record-note">
                            <i class="bx bx-note"></i>
                            <p>${record["ملاحظة"]}</p>
                        </div>
                    ` : ''}
                </div>
            `).join('');
            
        } else {
            throw new Error(json.message || "فشل في جلب السجلات");
        }
        
    } catch (error) {
        console.error("حدث خطأ في جلب السجلات:", error);
        loadingElement.style.display = 'none';
        recordsList.innerHTML = `
            <div class="sprinkler-error-records">
                <i class="bx bx-error-circle"></i>
                <p>حدث خطأ أثناء جلب السجلات: ${error.message}</p>
            </div>
        `;
    }
}

/**
 * عرض شارة الحالة
 */
function getStatusBadge(status) {
    const statusClasses = {
        "قيد الانتظار": "status-pending",
        "مكتمل": "status-completed",
        "ملغى": "status-cancelled",
        "متأخر": "status-delayed"
    };
    
    return `<span class="status-badge ${statusClasses[status] || ''}">${status}</span>`;
}

/**
 * عرض رسالة خطأ
 */
function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: message,
        confirmButtonText: 'حسناً'
    });
}

// تحميل النموذج عند اكتمال تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadSprinklerEventForm);