// ---- Flash message auto-dismiss ----
document.addEventListener('DOMContentLoaded', () => {
  // Auto-dismiss flash messages after 4 seconds
  const flashMessages = document.querySelectorAll('.flash-message');
  flashMessages.forEach(msg => {
    setTimeout(() => {
      msg.style.animation = 'slideInRight 0.3s ease-in reverse forwards';
      setTimeout(() => msg.remove(), 300);
    }, 4000);

    // Click to dismiss
    msg.addEventListener('click', () => {
      msg.style.animation = 'slideInRight 0.3s ease-in reverse forwards';
      setTimeout(() => msg.remove(), 300);
    });
  });

  // ---- Mobile sidebar toggle ----
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 992 && sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // ---- Confirm delete modals ----
  const deleteForms = document.querySelectorAll('.delete-form');
  deleteForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        e.preventDefault();
      }
    });
  });

  // ---- Confirm vacate ----
  const vacateForms = document.querySelectorAll('.vacate-form');
  vacateForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!confirm('Are you sure you want to vacate this student from the room?')) {
        e.preventDefault();
      }
    });
  });

  // ---- Dynamic room filter by hostel (allocation form) ----
  const hostelSelect = document.getElementById('hostelSelect');
  const roomSelect = document.getElementById('roomSelect');
  if (hostelSelect && roomSelect) {
    const allOptions = Array.from(roomSelect.querySelectorAll('option'));
    hostelSelect.addEventListener('change', () => {
      const selectedHostel = hostelSelect.value;
      roomSelect.innerHTML = '<option value="">-- Select Room --</option>';
      allOptions.forEach(opt => {
        if (!opt.value) return;
        if (!selectedHostel || opt.dataset.hostel === selectedHostel) {
          roomSelect.appendChild(opt.cloneNode(true));
        }
      });
    });
  }

  // ---- Live table search ----
  const searchInputs = document.querySelectorAll('[data-table-search]');
  searchInputs.forEach(input => {
    const tableId = input.dataset.tableSearch;
    const table = document.getElementById(tableId);
    if (!table) return;
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase();
      const rows = tbody.querySelectorAll('tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  });

  // ---- Auto-submit filter forms on change ----
  const filterSelects = document.querySelectorAll('.filter-auto-submit');
  filterSelects.forEach(sel => {
    sel.addEventListener('change', () => {
      sel.closest('form').submit();
    });
  });
});
