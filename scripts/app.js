/* OUTLOOK ENTERPRISES - Main Application Controller */

window.App = {
  theme: 'light',

  init() {
    this.initTheme();
    this.bindEvents();
    this.renderProducts('all');
    this.renderProjects();
    
    // Initialize Sub-engines
    if (window.CustomizerEngine) CustomizerEngine.init();
    if (window.CalculatorEngine) CalculatorEngine.init();
    if (window.AdminEngine) AdminEngine.init();
    if (window.ChatbotEngine) ChatbotEngine.init();
  },

  initTheme() {
    const saved = localStorage.getItem('outlook_theme') || 'light';
    this.setTheme(saved);
  },

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('outlook_theme', theme);
    const icon = document.getElementById('theme-toggle-icon');
    if (icon) {
      icon.innerText = theme === 'dark' ? '☀️' : '🌙';
    }
  },

  toggleTheme() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  },

  bindEvents() {
    // Navbar Scroll shadow
    window.addEventListener('scroll', () => {
      const nav = document.querySelector('.navbar');
      if (nav) {
        if (window.scrollY > 40) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      }
    });

    // Theme Toggle Button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Catalog Filter Buttons
    document.querySelectorAll('[data-catalog-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-catalog-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderProducts(btn.dataset.catalogFilter);
      });
    });

    // Quote Form Submission
    const quoteForm = document.getElementById('quote-request-form');
    if (quoteForm) {
      quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleQuoteSubmit(quoteForm);
      });
    }
  },

  renderProducts(category = 'all') {
    const grid = document.getElementById('product-catalog-grid');
    if (!grid) return;

    let items = UPVC_DATA.products;
    if (category !== 'all') {
      items = items.filter(p => p.category === category);
    }

    grid.innerHTML = items.map(p => `
      <div class="glass-card product-card">
        <div class="product-img-box">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
          <span class="badge ${p.badgeClass} product-tag">${p.tag}</span>
        </div>
        <div class="product-content">
          <h3 class="product-title">${p.name}</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted);">${p.description}</p>
          
          <div class="product-specs">
            ${p.specs.map(s => `<span class="spec-chip">✓ ${s}</span>`).join('')}
          </div>

          <div class="product-footer">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Starting from</span>
              <span class="product-price">₹ ${p.pricePerSqFt} <small style="font-size:0.75rem; font-weight: normal; color: var(--text-muted);">/ sq.ft</small></span>
            </div>
            <button class="btn btn-primary" onclick="App.quickCustomize('${p.id}')">Customize ⚡</button>
          </div>
        </div>
      </div>
    `).join('');
  },

  renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.innerHTML = UPVC_DATA.projects.map(p => `
      <div class="project-card">
        <img src="${p.image}" alt="${p.title}" />
        <div class="project-overlay">
          <span class="badge badge-gold" style="width: fit-content; margin-bottom: 0.5rem;">${p.category}</span>
          <h3 style="font-size: 1.3rem;">${p.title}</h3>
          <p style="font-size: 0.85rem; opacity: 0.9;">📍 ${p.location}</p>
          <p style="font-size: 0.8rem; margin-top: 0.4rem; opacity: 0.75;">${p.details}</p>
        </div>
      </div>
    `).join('');
  },

  quickCustomize(productId) {
    const customizerSec = document.getElementById('customizer');
    if (customizerSec) {
      customizerSec.scrollIntoView({ behavior: 'smooth' });
      this.showToast('Selected product loaded in visual customizer!');
    }
  },

  handleQuoteSubmit(form) {
    const name = form.querySelector('[name="name"]').value;
    const phone = form.querySelector('[name="phone"]').value;
    const product = form.querySelector('[name="product"]').value;
    const notes = form.querySelector('[name="notes"]').value;

    const newLead = {
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name,
      phone: phone,
      product: product || "UPVC Custom System",
      area: "300 sq ft (Estimated)",
      value: "₹ 1,80,000",
      status: "New",
      date: "Just now"
    };

    if (window.AdminEngine) {
      AdminEngine.addLead(newLead);
    }

    this.showToast(`🎉 Thank you, ${name}! Your quotation request #${newLead.id} has been logged.`);
    form.reset();
  },

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <div>${message}</div>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
