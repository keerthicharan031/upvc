/* OUTLOOK ENTERPRISES - AI Chatbot Engine */

const ChatbotEngine = {
  isOpen: false,

  init() {
    this.bindEvents();
    this.sendBotMessage("👋 Hello! Welcome to **Outlook Enterprises**. I'm your AI UPVC Specialist. How can I assist you today?");
  },

  bindEvents() {
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.getElementById('chat-close-btn');
    const sendBtn = document.getElementById('chat-send-btn');
    const input = document.getElementById('chat-input');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleChat());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggleChat(false));
    }
    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => this.handleUserSend());
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleUserSend();
      });
    }

    // Quick Option Chips
    document.querySelectorAll('[data-chat-prompt]').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.dataset.chatPrompt;
        this.processUserInput(text);
      });
    });
  },

  toggleChat(forceState) {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    const chatWin = document.getElementById('chat-window');
    if (chatWin) {
      if (this.isOpen) chatWin.classList.add('active');
      else chatWin.classList.remove('active');
    }
  },

  handleUserSend() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this.processUserInput(text);
  },

  processUserInput(userText) {
    this.appendMessage(userText, 'user');

    // Simulate AI response delay
    setTimeout(() => {
      const response = this.generateResponse(userText.toLowerCase());
      this.sendBotMessage(response);
    }, 600);
  },

  sendBotMessage(msgText) {
    this.appendMessage(msgText, 'bot');
  },

  appendMessage(text, sender) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  },

  generateResponse(query) {
    if (query.includes('price') || query.includes('cost') || query.includes('rate') || query.includes('sq ft')) {
      return "Our UPVC doors and windows range from **₹450 to ₹880 per sq. ft.** depending on the frame profile finish, glass glazing (Single vs Double Glazed Acoustic), and German locking hardware. You can try our live **Smart Calculator** on this page for an instant exact quote!";
    }
    if (query.includes('benefit') || query.includes('why upvc') || query.includes('aluminum') || query.includes('wood')) {
      return "Key benefits of **Outlook UPVC** over Wood & Aluminum:\n\n1. **42dB Noise Insulation**\n2. **40% AC Energy Savings** (Low thermal conductivity)\n3. **100% Water & Termite Proof**\n4. **10 Year Color Anti-UV Warranty**\n5. **Zero Maintenance** (No painting needed)";
    }
    if (query.includes('warranty') || query.includes('guarantee')) {
      return "Outlook Enterprises provides a **10-Year Comprehensive Warranty** on UPVC profile discoloration, cracking, weather gaskets, and hardware mechanism support.";
    }
    if (query.includes('appointment') || query.includes('site') || query.includes('visit') || query.includes('measure')) {
      return "We offer **Free On-Site Measurement & Consultation** across the city! Would you like us to schedule an expert technician? Please submit your contact details via our 'Request Quote' form or click WhatsApp.";
    }
    if (query.includes('contact') || query.includes('phone') || query.includes('number') || query.includes('address') || query.includes('partner') || query.includes('email') || query.includes('website')) {
      return "🤝 **Partners:** Saravanavel & Durai\n📍 **Address:** No.7, 3rd Street, Sasthri Nagar, Adambakkam, Chennai – 600 088\n🌐 **Website:** www.outlookenterprises.in\n✉️ **Email:** outlookenterprises2@gmail.com\n📞 **Mobile/WhatsApp:** +91 80727 07041 / +91 70101 98326";
    }
    return "Thank you for reaching out! At **Outlook Enterprises**, we manufacture lead-free, high-performance UPVC sliding windows, tilt-and-turn systems, and French doors. Feel free to ask about pricing, warranty, or book a free site measurement!";
  }
};
