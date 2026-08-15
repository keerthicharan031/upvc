/* OUTLOOK ENTERPRISES - CRM Admin & Sales Dashboard Engine */

const AdminEngine = {
  leads: [],

  init() {
    this.loadLeads();
    this.bindEvents();
    this.renderMetrics();
    this.renderLeadTable();
    this.renderCharts();
  },

  loadLeads() {
    const saved = localStorage.getItem('outlook_upvc_leads');
    if (saved) {
      try {
        this.leads = JSON.parse(saved);
      } catch (e) {
        this.leads = [...UPVC_DATA.initialLeads];
      }
    } else {
      this.leads = [...UPVC_DATA.initialLeads];
      this.saveLeads();
    }
  },

  saveLeads() {
    localStorage.setItem('outlook_upvc_leads', JSON.stringify(this.leads));
  },

  addLead(lead) {
    this.leads.unshift(lead);
    this.saveLeads();
    this.renderMetrics();
    this.renderLeadTable();
  },

  bindEvents() {
    const filterSelect = document.getElementById('admin-lead-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => this.renderLeadTable(e.target.value));
    }

    const exportBtn = document.getElementById('admin-export-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportCSV());
    }
  },

  renderMetrics() {
    const totalLeads = this.leads.length;
    const wonLeads = this.leads.filter(l => l.status.includes('Won')).length;
    const conversionRate = totalLeads ? Math.round((wonLeads / totalLeads) * 100) : 0;

    const metricLeads = document.getElementById('metric-total-leads');
    if (metricLeads) metricLeads.innerText = totalLeads;

    const metricConversion = document.getElementById('metric-conversion');
    if (metricConversion) metricConversion.innerText = `${conversionRate}%`;

    const metricWon = document.getElementById('metric-won-orders');
    if (metricWon) metricWon.innerText = wonLeads;
  },

  renderLeadTable(filterStatus = 'all') {
    const tableBody = document.getElementById('admin-lead-tbody');
    if (!tableBody) return;

    let filtered = this.leads;
    if (filterStatus !== 'all') {
      filtered = this.leads.filter(l => l.status.toLowerCase().includes(filterStatus.toLowerCase()));
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No leads match the filter.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map((lead, idx) => {
      let statusClass = "status-new";
      if (lead.status.includes('Visit')) statusClass = "status-visit";
      else if (lead.status.includes('Quote')) statusClass = "status-quote";
      else if (lead.status.includes('Won')) statusClass = "status-won";

      return `
        <tr>
          <td><strong>${lead.id}</strong></td>
          <td>${lead.name}</td>
          <td>${lead.phone}</td>
          <td>${lead.product}</td>
          <td>${lead.value}</td>
          <td>
            <span class="status-pill ${statusClass}" onclick="AdminEngine.advanceStatus(${idx})">
              ${lead.status} ⚡
            </span>
          </td>
          <td>${lead.date}</td>
        </tr>
      `;
    }).join('');
  },

  advanceStatus(idx) {
    const lead = this.leads[idx];
    if (!lead) return;

    if (lead.status === "New") lead.status = "Site Visit Scheduled";
    else if (lead.status === "Site Visit Scheduled") lead.status = "Quote Sent";
    else if (lead.status === "Quote Sent") lead.status = "Won / Order Confirmed";
    else lead.status = "New";

    this.saveLeads();
    this.renderMetrics();
    this.renderLeadTable();
    if (window.App) window.App.showToast(`Updated Lead ${lead.id} status to: ${lead.status}`);
  },

  renderCharts() {
    // Render Canvas Sales Performance Chart
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = 220;

    ctx.clearRect(0, 0, w, h);

    // Draw Grid Lines
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.lineWidth = 1;
    for (let i = 40; i < h; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(w, i);
      ctx.stroke();
    }

    // Chart Line Data (Monthly Sales Trend)
    const points = [
      { x: 40, y: 160, label: "Jan" },
      { x: w * 0.22, y: 130, label: "Feb" },
      { x: w * 0.42, y: 140, label: "Mar" },
      { x: w * 0.62, y: 80, label: "Apr" },
      { x: w * 0.82, y: 50, label: "May" },
      { x: w - 30, y: 30, label: "Jun" }
    ];

    // Gradient Fill under curve
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "rgba(2, 132, 199, 0.35)");
    grad.addColorStop(1, "rgba(2, 132, 199, 0.0)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, h - 20);
    ctx.lineTo(points[0].x, h - 20);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line stroke
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Data points dots
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px Plus Jakarta Sans";
      ctx.fillText(p.label, p.x - 10, h - 5);
    });
  },

  exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,ID,Name,Phone,Product,Value,Status,Date\n";
    this.leads.forEach(l => {
      csvContent += `${l.id},"${l.name}","${l.phone}","${l.product}","${l.value}","${l.status}","${l.date}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Outlook_UPVC_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
