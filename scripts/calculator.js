/* OUTLOOK ENTERPRISES - Smart Price Calculator Engine */

const CalculatorEngine = {
  init() {
    this.bindEvents();
    this.calculate();
  },

  bindEvents() {
    const inputs = ['calc-width', 'calc-height', 'calc-qty', 'calc-type', 'calc-color', 'calc-glass', 'calc-mesh', 'calc-distance'];
    inputs.forEach(id => {
      const elem = document.getElementById(id);
      if (elem) {
        elem.addEventListener('input', () => this.calculate());
        elem.addEventListener('change', () => this.calculate());
      }
    });

    const printBtn = document.getElementById('calc-download-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => this.generateQuotePDF());
    }
  },

  calculate() {
    const width = parseFloat(document.getElementById('calc-width')?.value || 6);
    const height = parseFloat(document.getElementById('calc-height')?.value || 4);
    const qty = parseInt(document.getElementById('calc-qty')?.value || 1);
    const distance = parseFloat(document.getElementById('calc-distance')?.value || 10);
    const typeSqFtRate = parseFloat(document.getElementById('calc-type')?.value || 350);
    const colorId = document.getElementById('calc-color')?.value || "white";
    const glassId = document.getElementById('calc-glass')?.value || "5mm";

    const hasMesh = document.getElementById('calc-mesh')?.checked || false;

    const colorObj = UPVC_DATA.profileColors.find(c => c.id === colorId) || UPVC_DATA.profileColors[0];
    const glassObj = UPVC_DATA.glassTypes.find(g => g.id === glassId) || UPVC_DATA.glassTypes[0];

    const areaPerUnit = width * height;
    const totalArea = areaPerUnit * qty;

    const baseFrameCost = totalArea * typeSqFtRate * colorObj.baseCostMultiplier;
    const glazingCost = baseFrameCost * (glassObj.factor - 1.0);
    const meshCost = hasMesh ? (150 * totalArea) : 0;
    const subtotalMaterial = baseFrameCost + glazingCost + meshCost;

    const transportCost = distance * 50; // ₹50 per km transport
    const subtotal = subtotalMaterial + transportCost;
    const gst = subtotal * 0.18; // 18% GST
    const grandTotal = subtotal + gst;

    // Update DOM UI
    this.updateText('receipt-sqft', `${totalArea.toFixed(1)} sq. ft (${qty} Unit${qty > 1 ? 's' : ''})`);
    this.updateText('receipt-material', `₹ ${Math.round(subtotalMaterial).toLocaleString('en-IN')}`);
    this.updateText('receipt-transport', `₹ ${Math.round(transportCost).toLocaleString('en-IN')}`);
    this.updateText('receipt-gst', `₹ ${Math.round(gst).toLocaleString('en-IN')}`);
    this.updateText('receipt-total', `₹ ${Math.round(grandTotal).toLocaleString('en-IN')}`);

    this.currentQuote = {
      width, height, qty, totalArea, subtotalMaterial, transportCost, gst, grandTotal,
      colorName: colorObj.name, glassName: glassObj.name, date: new Date().toLocaleDateString('en-IN')
    };
  },

  updateText(id, val) {
    const elem = document.getElementById(id);
    if (elem) elem.innerText = val;
  },

  generateQuotePDF() {
    if (!this.currentQuote) return;
    const q = this.currentQuote;

    const windowWin = window.open('', '_blank');
    windowWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Estimation Quote - Outlook Enterprises UPVC</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; border-bottom: 3px solid #0284c7; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 800; color: #0284c7; }
          .quote-title { font-size: 20px; margin-top: 30px; font-weight: 700; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 25px; }
          th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
          th { background: #f1f5f9; font-weight: 700; }
          .total-row { font-size: 18px; font-weight: 800; color: #0284c7; background: #e0f2fe; }
          .footer { margin-top: 50px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">OUTLOOK ENTERPRISES</div>
            <p>Premium UPVC Doors & Windows Solutions</p>
            <p>No.7, 3rd Street, Sasthri Nagar, Adambakkam, Chennai - 600088 | Tel: +91 80727 07041 / +91 70101 98326 | www.outlookenterprises.in</p>
          </div>
          <div style="text-align: right;">
            <h3>OFFICIAL ESTIMATE</h3>
            <p><strong>Quote No:</strong> OUT-${Math.floor(100000 + Math.random() * 900000)}</p>
            <p><strong>Date:</strong> ${q.date}</p>
          </div>
        </div>

        <div class="quote-title">ESTIMATED COST BREAKDOWN</div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Specification</th>
              <th>Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dimensions & Quantity</td>
              <td>${q.width} ft x ${q.height} ft (${q.totalArea} sq ft total) - ${q.qty} Unit(s)</td>
              <td>Included</td>
            </tr>
            <tr>
              <td>UPVC Profile Finish</td>
              <td>${q.colorName} Laminated German Profile</td>
              <td>Included</td>
            </tr>
            <tr>
              <td>Glass & Hardware</td>
              <td>${q.glassName} Glazing</td>
              <td>Included</td>
            </tr>
            <tr>
              <td>Material Subtotal</td>
              <td>Fabrication & Steel Reinforcement</td>
              <td>₹ ${Math.round(q.subtotalMaterial).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Transport Charge (depends on distance)</td>
              <td>₹50 per kilometer</td>
              <td>₹ ${Math.round(q.transportCost).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>GST (18%)</td>
              <td>Statutory Tax Component</td>
              <td>₹ ${Math.round(q.gst).toLocaleString('en-IN')}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">ESTIMATED GRAND TOTAL</td>
              <td>₹ ${Math.round(q.grandTotal).toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 30px; font-size: 13px;">
          <p><strong>Note:</strong> This estimation is valid for 30 days. Final quotation subject to physical site measurement.</p>
        </div>

        <div class="footer">
          <p>Thank you for choosing Outlook Enterprises - 10 Year Comprehensive Warranty Included</p>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body >
      </html >
  `);
    windowWin.document.close();
  }
};
