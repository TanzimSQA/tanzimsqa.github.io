document.addEventListener('DOMContentLoaded', () => {

  // 1. Skill Search Filter
  const skillSearch = document.getElementById('skillSearch');
  const skillCards = document.querySelectorAll('.skill-card');

  if (skillSearch) {
    skillSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      skillCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 2. Competency Category Filter
  const compFilterBtns = document.querySelectorAll('.comp-filter-btn');
  compFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      compFilterBtns.forEach(b => {
        b.classList.remove('active', 'bg-cyan-500', 'text-black');
        b.classList.add('bg-slate-900', 'text-slate-300');
      });
      btn.classList.add('active', 'bg-cyan-500', 'text-black');
      btn.classList.remove('bg-slate-900', 'text-slate-300');

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach(card => {
        const group = card.getAttribute('data-group');
        if (filter === 'all' || group === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. Interactive Lab Tab Switching
  const btnTabPlaywright = document.getElementById('btnTabPlaywright');
  const btnTabApi = document.getElementById('btnTabApi');
  const btnTabJmeter = document.getElementById('btnTabJmeter');

  const panelPlaywright = document.getElementById('panelPlaywright');
  const panelApi = document.getElementById('panelApi');
  const panelJmeter = document.getElementById('panelJmeter');
  const terminalTitle = document.getElementById('terminalTitle');

  const tabs = [
    { btn: btnTabPlaywright, panel: panelPlaywright, title: 'saucedemo-e2e-suite :: pytest v9.1.1' },
    { btn: btnTabApi, panel: panelApi, title: 'railway-api-tests :: newman CLI v6.1' },
    { btn: btnTabJmeter, panel: panelJmeter, title: 'performance-profile :: apache jmeter v5.6' }
  ];

  tabs.forEach(tab => {
    if (tab.btn) {
      tab.btn.addEventListener('click', () => {
        tabs.forEach(t => {
          t.btn.classList.remove('active', 'bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'text-white', 'shadow-md', 'shadow-cyan-500/20');
          t.btn.classList.add('text-slate-400');
          t.panel.classList.add('hidden');
        });
        tab.btn.classList.add('active', 'bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'text-white', 'shadow-md', 'shadow-cyan-500/20');
        tab.btn.classList.remove('text-slate-400');
        tab.panel.classList.remove('hidden');
        if (terminalTitle) terminalTitle.textContent = tab.title;

        if (tab.btn === btnTabJmeter) {
          renderJmeterChart();
        }
      });
    }
  });

  // 4. Playwright Simulator Test Runner
  const btnRunTests = document.getElementById('btnRunTests');
  const btnRunTestsText = document.getElementById('btnRunTestsText');
  const testOutputLog = document.getElementById('testOutputLog');
  const testProgressBar = document.getElementById('testProgressBar');
  const testResultSummary = document.getElementById('testResultSummary');

  const testSteps = [
    { text: 'rootdir: D:\\Automation testing, configfile: pytest.ini', color: 'text-slate-400' },
    { text: 'plugins: playwright-0.9.0, html-4.2.0, base-url-2.1.0', color: 'text-slate-400' },
    { text: 'collected 56 items across 10 modules', color: 'text-cyan-300' },
    { text: 'tests/test_login.py::test_standard_user_successful_auth PASSED [ 12% ]', color: 'text-emerald-400' },
    { text: 'tests/test_login.py::test_locked_out_user_error_banner PASSED [ 24% ]', color: 'text-emerald-400' },
    { text: 'tests/test_inventory.py::test_inventory_six_cards_loaded PASSED [ 36% ]', color: 'text-emerald-400' },
    { text: 'tests/test_inventory.py::test_sorting_price_low_to_high PASSED [ 48% ]', color: 'text-emerald-400' },
    { text: 'tests/test_cart.py::test_item_badge_synchronization PASSED [ 62% ]', color: 'text-emerald-400' },
    { text: 'tests/test_checkout.py::test_dynamic_tax_math_verification PASSED [ 78% ]', color: 'text-emerald-400' },
    { text: 'tests/test_checkout.py::test_e2e_complete_order_dispatch PASSED [ 90% ]', color: 'text-emerald-400' },
    { text: 'tests/test_security_auth.py::test_unauthenticated_cart_redirect PASSED [ 100% ]', color: 'text-emerald-400' },
    { text: '==================== 56 passed in 14.82s ====================', color: 'text-emerald-300 font-bold' }
  ];

  if (btnRunTests) {
    btnRunTests.addEventListener('click', () => {
      btnRunTests.disabled = true;
      btnRunTestsText.textContent = 'Running Tests...';
      btnRunTests.classList.add('opacity-50', 'cursor-not-allowed');
      testOutputLog.innerHTML = '';
      testProgressBar.style.width = '0%';
      testResultSummary.textContent = 'Running: 0 / 56 tests...';

      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < testSteps.length) {
          const item = testSteps[stepIndex];
          const div = document.createElement('div');
          div.className = `test-pass-item ${item.color}`;
          div.textContent = item.text;
          testOutputLog.appendChild(div);

          // Update progress
          const progressPercent = Math.min(100, Math.round(((stepIndex + 1) / testSteps.length) * 100));
          testProgressBar.style.width = `${progressPercent}%`;

          stepIndex++;
        } else {
          clearInterval(interval);
          btnRunTests.disabled = false;
          btnRunTestsText.textContent = 'Re-Run Test Suite';
          btnRunTests.classList.remove('opacity-50', 'cursor-not-allowed');
          testResultSummary.innerHTML = '<span class="text-emerald-400 font-bold">✓ 56 / 56 Passed (100% Reliability)</span>';
        }
      }, 160);
    });
  }

  // 5. Postman API Simulator
  const btnSendApiRequest = document.getElementById('btnSendApiRequest');
  if (btnSendApiRequest) {
    btnSendApiRequest.addEventListener('click', () => {
      btnSendApiRequest.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-[10px]"></i> Asserting...';
      setTimeout(() => {
        btnSendApiRequest.innerHTML = '<i class="fa-solid fa-check text-[10px] text-emerald-400"></i> Passed (200 OK)';
        setTimeout(() => {
          btnSendApiRequest.innerHTML = '<i class="fa-solid fa-paper-plane text-[10px]"></i> Send & Assert';
        }, 1500);
      }, 400);
    });
  }

  // 6. JMeter Load Simulator
  const sliderUsers = document.getElementById('sliderUsers');
  const valUsers = document.getElementById('valUsers');
  const valTps = document.getElementById('valTps');
  const valLatency = document.getElementById('valLatency');
  const jmeterBarContainer = document.getElementById('jmeterBarContainer');

  function renderJmeterChart() {
    if (!jmeterBarContainer) return;
    jmeterBarContainer.innerHTML = '';
    const users = parseInt(sliderUsers ? sliderUsers.value : 250);
    const barsCount = 28;

    for (let i = 0; i < barsCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'jmeter-bar';
      // Profile curve
      const factor = Math.sin((i / (barsCount - 1)) * Math.PI);
      const randomNoise = (Math.random() * 0.15) - 0.075;
      const heightPercent = Math.max(10, Math.min(95, ((users / 1000) * 80 * (factor + 0.2)) + (randomNoise * 20)));
      bar.style.height = `${heightPercent}%`;
      jmeterBarContainer.appendChild(bar);
    }
  }

  if (sliderUsers) {
    sliderUsers.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      if (valUsers) valUsers.textContent = `${val} Users`;
      if (valTps) valTps.textContent = `${Math.round(val * 1.95)} req/sec`;
      if (valLatency) {
        const lat = Math.round(45 + (val * 0.28));
        valLatency.textContent = `${lat} ms`;
        valLatency.className = lat > 200 ? 'text-xl font-bold text-amber-400' : 'text-xl font-bold text-purple-400';
      }
      renderJmeterChart();
    });
    renderJmeterChart();
  }

  // 7. Contact Message Form
  const contactForm = document.getElementById('contactForm');
  const contactFeedback = document.getElementById('contactFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const msg = document.getElementById('senderMsg').value;

      // Construct mailto link as fallback or show instant confirmation
      const mailtoUrl = `mailto:tanzimsqa@gmail.com?subject=SQA Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(msg + "\n\nContact Email: " + email)}`;

      contactFeedback.innerHTML = `✓ Thank you, ${name}! Redirecting to email... (Or message directly on WhatsApp: <a href="https://wa.me/8801992321575" target="_blank" class="underline text-cyan-300">+8801992321575</a>)`;
      contactFeedback.classList.remove('hidden');

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 800);
    });
  }

});
