/* OUTLOOK ENTERPRISES - Interactive Customizer Engine */

const CustomizerEngine = {
  state: {
    type: "sliding-win",
    colorId: "white",
    glassId: "double",
    grill: "none",
    mesh: true,
    handle: "matte-black",
    width: 6, // feet
    height: 4 // feet
  },

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    // Type Selectors
    document.querySelectorAll('[data-customizer-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-customizer-type]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.type = btn.dataset.customizerType;
        this.render();
      });
    });

    // Color Swatches
    document.querySelectorAll('[data-customizer-color]').forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        document.querySelectorAll('[data-customizer-color]').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this.state.colorId = swatch.dataset.customizerColor;
        this.render();
      });
    });

    // Glass Selectors
    document.querySelectorAll('[data-customizer-glass]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('[data-customizer-glass]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.state.glassId = chip.dataset.customizerGlass;
        this.render();
      });
    });

    // Grill Toggle
    const grillSelect = document.getElementById('customizer-grill');
    if (grillSelect) {
      grillSelect.addEventListener('change', (e) => {
        this.state.grill = e.target.value;
        this.render();
      });
    }

    // Mesh Checkbox
    const meshToggle = document.getElementById('customizer-mesh');
    if (meshToggle) {
      meshToggle.addEventListener('change', (e) => {
        this.state.mesh = e.target.checked;
        this.render();
      });
    }
  },

  render() {
    const container = document.getElementById('customizer-svg-container');
    if (!container) return;

    const colorObj = UPVC_DATA.profileColors.find(c => c.id === this.state.colorId) || UPVC_DATA.profileColors[0];
    const glassObj = UPVC_DATA.glassTypes.find(g => g.id === this.state.glassId) || UPVC_DATA.glassTypes[0];

    // Determine Glass Fill Color & Opacity
    let glassFill = "rgba(186, 230, 253, 0.4)";
    let glassStroke = "#38bdf8";
    if (this.state.glassId === "tinted") {
      glassFill = "rgba(30, 58, 138, 0.55)";
      glassStroke = "#1d4ed8";
    } else if (this.state.glassId === "frosted") {
      glassFill = "rgba(241, 245, 249, 0.85)";
      glassStroke = "#94a3b8";
    } else if (this.state.glassId === "low-e") {
      glassFill = "rgba(45, 212, 191, 0.35)";
      glassStroke = "#0d9488";
    }

    const frameColor = colorObj.hex;
    const strokeColor = colorObj.border;
    const isDarkFrame = ["walnut", "anthracite", "black"].includes(colorObj.id);
    const handleColor = isDarkFrame ? "#f8fafc" : "#0f172a";

    // Build SVG Graphic dynamically
    let svgContent = '';
    const width = 360;
    const height = 280;

    if (this.state.type === 'sliding-win') {
      svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer Frame -->
          <rect x="10" y="10" width="340" height="260" rx="6" fill="${frameColor}" stroke="${strokeColor}" stroke-width="8" />
          <rect x="22" y="22" width="316" height="236" fill="none" stroke="${strokeColor}" stroke-width="2" />

          <!-- Left Sash -->
          <rect x="25" y="25" width="160" height="230" fill="${frameColor}" stroke="${strokeColor}" stroke-width="4" />
          <rect x="37" y="37" width="136" height="206" fill="${glassFill}" stroke="${glassStroke}" stroke-width="1.5" />
          ${this.renderGrillLines(37, 37, 136, 206)}

          <!-- Right Sash -->
          <rect x="175" y="25" width="160" height="230" fill="${frameColor}" stroke="${strokeColor}" stroke-width="4" />
          <rect x="187" y="37" width="136" height="206" fill="${glassFill}" stroke="${glassStroke}" stroke-width="1.5" />
          ${this.renderGrillLines(187, 37, 136, 206)}

          <!-- Mesh Overlay -->
          ${this.state.mesh ? `<rect x="37" y="37" width="136" height="206" fill="url(#meshPattern)" opacity="0.4" />` : ''}

          <!-- Handles -->
          <rect x="155" y="125" width="8" height="30" rx="2" fill="${handleColor}" />
          <rect x="195" y="125" width="8" height="30" rx="2" fill="${handleColor}" />

          <!-- Pattern Defs -->
          <defs>
            <pattern id="meshPattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="6" y2="6" stroke="#475569" stroke-width="0.75" />
              <line x1="6" y1="0" x2="0" y2="6" stroke="#475569" stroke-width="0.75" />
            </pattern>
          </defs>
        </svg>
      `;
    } else if (this.state.type === 'french-door') {
      svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg">
          <!-- Door Outer Frame -->
          <rect x="30" y="10" width="300" height="260" rx="4" fill="${frameColor}" stroke="${strokeColor}" stroke-width="10" />
          
          <!-- Left Door Leaf -->
          <rect x="42" y="22" width="134" height="236" fill="${frameColor}" stroke="${strokeColor}" stroke-width="4" />
          <rect x="54" y="34" width="110" height="212" fill="${glassFill}" stroke="${glassStroke}" stroke-width="1.5" />
          ${this.renderGrillLines(54, 34, 110, 212)}

          <!-- Right Door Leaf -->
          <rect x="184" y="22" width="134" height="236" fill="${frameColor}" stroke="${strokeColor}" stroke-width="4" />
          <rect x="196" y="34" width="110" height="212" fill="${glassFill}" stroke="${glassStroke}" stroke-width="1.5" />
          ${this.renderGrillLines(196, 34, 110, 212)}

          <!-- Luxury Brass/Chrome Long Handles -->
          <rect x="160" y="120" width="8" height="45" rx="3" fill="${handleColor}" />
          <rect x="192" y="120" width="8" height="45" rx="3" fill="${handleColor}" />
        </svg>
      `;
    } else {
      // Arch Window
      svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg">
          <!-- Arch Frame -->
          <path d="M 50,260 L 50,120 A 130,120 0 0,1 310,120 L 310,260 Z" fill="${frameColor}" stroke="${strokeColor}" stroke-width="10" />
          <path d="M 64,250 L 64,124 A 116,106 0 0,1 296,124 L 296,250 Z" fill="${glassFill}" stroke="${glassStroke}" stroke-width="2" />
          
          <!-- Arch Transom Line -->
          <line x1="64" y1="130" x2="296" y2="130" stroke="${strokeColor}" stroke-width="6" />
          
          <!-- Vertical Division -->
          <line x1="180" y1="130" x2="180" y2="250" stroke="${strokeColor}" stroke-width="6" />
          ${this.renderGrillLines(64, 130, 232, 120)}
        </svg>
      `;
    }

    container.innerHTML = svgContent;

    // Update Live Cost Summary in Customizer
    const baseSqFt = 24; // 6ft x 4ft
    const baseRate = 480;
    const estPrice = Math.round(baseSqFt * baseRate * colorObj.baseCostMultiplier * glassObj.factor + (this.state.mesh ? 1200 : 0));

    const priceElem = document.getElementById('customizer-live-price');
    if (priceElem) {
      priceElem.innerText = `₹ ${estPrice.toLocaleString('en-IN')}`;
    }

    const detailElem = document.getElementById('customizer-specs-summary');
    if (detailElem) {
      detailElem.innerHTML = `
        <strong>Configuration:</strong> ${colorObj.name} Profile | ${glassObj.name} | ${this.state.grill === 'none' ? 'No Grills' : 'Georgian Grills'} ${this.state.mesh ? '| Insect Mesh Included' : ''}
      `;
    }
  },

  renderGrillLines(x, y, w, h) {
    if (this.state.grill === 'none') return '';
    if (this.state.grill === 'colonial') {
      return `
        <line x1="${x}" y1="${y + h / 3}" x2="${x + w}" y2="${y + h / 3}" stroke="rgba(255,255,255,0.7)" stroke-width="2" />
        <line x1="${x}" y1="${y + (2 * h) / 3}" x2="${x + w}" y2="${y + (2 * h) / 3}" stroke="rgba(255,255,255,0.7)" stroke-width="2" />
        <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="rgba(255,255,255,0.7)" stroke-width="2" />
      `;
    }
    return `
      <line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="rgba(255,255,255,0.7)" stroke-width="2" />
      <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="rgba(255,255,255,0.7)" stroke-width="2" />
    `;
  }
};
