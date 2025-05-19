function showSupportModal() {
  document.getElementById("supportModal").style.display = "block";
}

function closeModal() {
  document.getElementById("supportModal").style.display = "none";
}

function callSupport() {
  window.location.href = "tel:+20123456789";
}

function openWhatsApp() {
  window.open("https://wa.me/20123456789", "_blank");
}

// إغلاق النافذة عند النقر خارجها
window.onclick = function(event) {
  const modal = document.getElementById("supportModal");
  if (event.target == modal) {
    closeModal();
  }
}