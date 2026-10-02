/**
 * Tanzim Rahman Portfolio — Interactive SQA Engineering Suite
 * Powers the Live Test Lab, Terminal Simulator, JMeter Benchmark,
 * API Inspector, Jira Ticket Viewer, Filter Systems & Dynamic Micro-Interactions.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Toast Notification System
  // =========================================================================
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer;

  function showToast(message, iconClass = 'fa-solid fa-check text-cyan-400') {
    if (!toast || !toastMsg) return;
    toastMsg.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
  window.showToast = showToast;

  // =========================================================================
  // 2. Dynamic Headline Typewriter / Rotator
  // =========================================================================
  const typewriterEl = document.getElementById('typewriterText');
  if (typewriterEl) {
    const roles = [
      "Full Stack SQA Engineer",
      "Playwright & Python SDET",
      "API & Performance Testing Specialist",
      "Defect Hunter & Quality Gatekeeper",
      "Certified Security & Network Associate"
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeDelay = 90;

    function tickTypewriter() {
      const currentRole = roles[roleIdx];
      
      if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typeDelay = 45;
      } else {
        typewriterEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typeDelay = 90;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typeDelay = 2200; // Pause at end of text
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeDelay = 450;
      }

      setTimeout(tickTypewriter, typeDelay);
    }
    setTimeout(tickTypewriter, 600);
  }

  // =========================================================================
  // 3. Mobile Navigation Drawer
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
      
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // =========================================================================
  // 4. Scrollspy & Back-to-Top Floating Button
  // =========================================================================
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.desktop-nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        backToTopBtn.classList.add('opacity-100', 'translate-y-0');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
      }
    }

    // Scrollspy for active nav link
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-cyan-400', 'font-semibold');
      link.classList.add('text-slate-300');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('text-cyan-400', 'font-semibold');
        link.classList.remove('text-slate-300');
      }
    });
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 5. One-Click Copy Actions (Email & Credential IDs)
  // =========================================================================
  document.querySelectorAll('.copy-email-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'tanzimsqa@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard! (tanzimsqa@gmail.com)', 'fa-solid fa-envelope text-cyan-400');
      }).catch(() => {
        showToast('tanzimsqa@gmail.com', 'fa-solid fa-envelope text-cyan-400');
      });
    });
  });

  document.querySelectorAll('.copy-cred-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const credId = btn.getAttribute('data-cred-id');
      if (credId) {
        navigator.clipboard.writeText(credId).then(() => {
          const originalHtml = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i> Copied';
          showToast(`Credential ID copied: ${credId}`, 'fa-solid fa-award text-emerald-400');
          setTimeout(() => {
            btn.innerHTML = originalHtml;
          }, 1800);
        });
      }
    });
  });

  // =========================================================================
  // 6. Skills Search & Filter Architecture
  // =========================================================================
  const skillSearch = document.getElementById('skillSearch');
  const skillCards = document.querySelectorAll('.skill-card');
  const skillMatchCount = document.getElementById('skillMatchCount');
  const compFilterBtns = document.querySelectorAll('.comp-filter-btn');

  let activeCompFilter = 'all';

  function applySkillFilters() {
    const term = skillSearch ? skillSearch.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    skillCards.forEach(card => {
      const group = card.getAttribute('data-group');
      const text = card.textContent.toLowerCase();

      const matchesGroup = (activeCompFilter === 'all' || group === activeCompFilter);
      const matchesSearch = (!term || text.includes(term));

      if (matchesGroup && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (skillMatchCount) {
      skillMatchCount.textContent = `Showing ${visibleCount} competencies`;
    }
  }

  if (skillSearch) {
    skillSearch.addEventListener('input', applySkillFilters);
  }

  compFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      compFilterBtns.forEach(b => {
        b.classList.remove('active', 'bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'text-white', 'shadow-md', 'shadow-cyan-500/20');
        b.classList.add('bg-slate-900', 'text-slate-300', 'border-slate-800');
      });
      btn.classList.add('active', 'bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'text-white', 'shadow-md', 'shadow-cyan-500/20');
      btn.classList.remove('bg-slate-900', 'text-slate-300', 'border-slate-800');

      activeCompFilter = btn.getAttribute('data-filter') || 'all';
      applySkillFilters();
    });
  });

  // =========================================================================
  // 7. Certifications Category Filter
  // =========================================================================
  const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');

  certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      certFilterBtns.forEach(b => {
        b.classList.remove('active', 'bg-gradient-to-r', 'from-purple-500', 'to-indigo-600', 'text-white', 'shadow-md', 'shadow-purple-500/20');
        b.classList.add('bg-slate-900', 'text-slate-300', 'border-slate-800');
      });
      btn.classList.add('active', 'bg-gradient-to-r', 'from-purple-500', 'to-indigo-600', 'text-white', 'shadow-md', 'shadow-purple-500/20');
      btn.classList.remove('bg-slate-900', 'text-slate-300', 'border-slate-800');

      const filter = btn.getAttribute('data-cert-filter');
      certCards.forEach(card => {
        const category = card.getAttribute('data-cert-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 8. Interactive Live Engineering Lab (4 Tabs)
  // =========================================================================
  const labTabs = [
    { btnId: 'btnTabPlaywright', panelId: 'panelPlaywright', title: 'saucedemo-e2e-suite :: pytest v9.1.1 (Python 3.11)' },
    { btnId: 'btnTabApi', panelId: 'panelApi', title: 'railway-api-assertions :: newman CLI v6.1 & Postman v12' },
    { btnId: 'btnTabJmeter', panelId: 'panelJmeter', title: 'concurrency-stress-test :: apache jmeter v5.6' },
    { btnId: 'btnTabJira', panelId: 'panelJira', title: 'stlc-defect-lifecycle :: jira software enterprise' }
  ];

  const terminalTitle = document.getElementById('terminalTitle');

  labTabs.forEach(tab => {
    const btn = document.getElementById(tab.btnId);
    const panel = document.getElementById(tab.panelId);

    if (btn && panel) {
      btn.addEventListener('click', () => {
        labTabs.forEach(t => {
          const b = document.getElementById(t.btnId);
          const p = document.getElementById(t.panelId);
          if (b) {
            b.classList.remove('active', 'bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'text-white', 'shadow-md', 'shadow-cyan-500/20');
            b.classList.add('text-slate-400');
          }
          if (p) p.classList.add('hidden');
        });

        btn.classList.add('active', 'bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'text-white', 'shadow-md', 'shadow-cyan-500/20');
        btn.classList.remove('text-slate-400');
        panel.classList.remove('hidden');

        if (terminalTitle) terminalTitle.textContent = tab.title;

        if (tab.btnId === 'btnTabJmeter') {
          renderJmeterChart();
        }
      });
    }
  });

  // -------------------------------------------------------------------------
  // 8A. Tab 1: Playwright Test Suite Simulator
  // -------------------------------------------------------------------------
  const btnRunTests = document.getElementById('btnRunTests');
  const btnRunTestsText = document.getElementById('btnRunTestsText');
  const testOutputLog = document.getElementById('testOutputLog');
  const testProgressBar = document.getElementById('testProgressBar');
  const testProgressPercent = document.getElementById('testProgressPercent');
  const testResultSummary = document.getElementById('testResultSummary');
  const testSuiteSelect = document.getElementById('testSuiteSelect');

  const suiteCatalog = {
    full: [
      { text: '$ pytest tests/ -v --browser=chromium --headless', color: 'text-slate-400 font-semibold' },
      { text: 'rootdir: D:\\Automation testing\\saucedemo-playwright, configfile: pytest.ini', color: 'text-slate-500' },
      { text: 'plugins: playwright-0.9.0, html-4.2.0, base-url-2.1.0', color: 'text-slate-500' },
      { text: 'collected 56 items across 10 test modules', color: 'text-cyan-300 font-bold' },
      { text: 'tests/test_auth.py::test_standard_user_successful_login PASSED [  12% ]', color: 'text-emerald-400' },
      { text: 'tests/test_auth.py::test_locked_out_user_banner_assert PASSED [  22% ]', color: 'text-emerald-400' },
      { text: 'tests/test_auth.py::test_empty_credentials_validation PASSED [  32% ]', color: 'text-emerald-400' },
      { text: 'tests/test_inventory.py::test_six_items_present_and_visible PASSED [  44% ]', color: 'text-emerald-400' },
      { text: 'tests/test_inventory.py::test_sort_price_low_to_high PASSED [  54% ]', color: 'text-emerald-400' },
      { text: 'tests/test_cart.py::test_badge_count_increment_on_add PASSED [  66% ]', color: 'text-emerald-400' },
      { text: 'tests/test_checkout.py::test_dynamic_tax_8_percent_exact_math PASSED [  78% ]', color: 'text-emerald-400' },
      { text: 'tests/test_checkout.py::test_complete_order_dispatch_message PASSED [  88% ]', color: 'text-emerald-400' },
      { text: 'tests/test_edge_cases.py::test_unauthenticated_cart_block PASSED [ 100% ]', color: 'text-emerald-400' },
      { text: '==================== 56 passed in 14.82s (100% Reliability) ====================', color: 'text-emerald-300 font-bold bg-emerald-950/40 p-1.5 rounded border border-emerald-800/60' }
    ],
    smoke: [
      { text: '$ pytest tests/ -m smoke --browser=chromium --headless', color: 'text-slate-400 font-semibold' },
      { text: 'collected 12 items matching "smoke"', color: 'text-cyan-300 font-bold' },
      { text: 'tests/test_auth.py::test_standard_user_smoke PASSED [ 25% ]', color: 'text-emerald-400' },
      { text: 'tests/test_inventory.py::test_catalog_smoke PASSED [ 50% ]', color: 'text-emerald-400' },
      { text: 'tests/test_cart.py::test_cart_flow_smoke PASSED [ 75% ]', color: 'text-emerald-400' },
      { text: 'tests/test_checkout.py::test_checkout_smoke PASSED [ 100% ]', color: 'text-emerald-400' },
      { text: '==================== 12 passed in 3.14s ====================', color: 'text-emerald-300 font-bold bg-emerald-950/40 p-1 rounded' }
    ],
    tax: [
      { text: '$ pytest tests/test_checkout.py -k "tax" -v', color: 'text-slate-400 font-semibold' },
      { text: 'collected 8 items matching "tax"', color: 'text-cyan-300 font-bold' },
      { text: 'tests/test_checkout.py::test_single_item_tax_calculation PASSED [ 25% ]', color: 'text-emerald-400' },
      { text: 'tests/test_checkout.py::test_multi_item_tax_calculation PASSED [ 50% ]', color: 'text-emerald-400' },
      { text: 'tests/test_checkout.py::test_high_value_tax_rounding PASSED [ 75% ]', color: 'text-emerald-400' },
      { text: 'tests/test_checkout.py::test_zero_item_boundary_assert PASSED [ 100% ]', color: 'text-emerald-400' },
      { text: '==================== 8 passed in 2.05s ====================', color: 'text-emerald-300 font-bold bg-emerald-950/40 p-1 rounded' }
    ]
  };

  let testRunningInterval = null;

  if (btnRunTests) {
    btnRunTests.addEventListener('click', () => {
      if (testRunningInterval) clearInterval(testRunningInterval);

      const suiteKey = testSuiteSelect ? testSuiteSelect.value : 'full';
      const steps = suiteCatalog[suiteKey] || suiteCatalog.full;

      btnRunTests.disabled = true;
      btnRunTestsText.textContent = 'Running Playwright...';
      btnRunTests.classList.add('opacity-50', 'cursor-not-allowed');
      testOutputLog.innerHTML = '';
      testProgressBar.style.width = '0%';
      if (testProgressPercent) testProgressPercent.textContent = '0%';
      testResultSummary.innerHTML = '<span class="text-amber-400"><i class="fa-solid fa-spinner fa-spin"></i> Executing browser workers in headless mode...</span>';

      let stepIdx = 0;
      testRunningInterval = setInterval(() => {
        if (stepIdx < steps.length) {
          const item = steps[stepIdx];
          const div = document.createElement('div');
          div.className = `test-pass-item ${item.color} leading-relaxed`;
          div.textContent = item.text;
          testOutputLog.appendChild(div);
          testOutputLog.scrollTop = testOutputLog.scrollHeight;

          const progress = Math.min(100, Math.round(((stepIdx + 1) / steps.length) * 100));
          testProgressBar.style.width = `${progress}%`;
          if (testProgressPercent) testProgressPercent.textContent = `${progress}%`;

          stepIdx++;
        } else {
          clearInterval(testRunningInterval);
          btnRunTests.disabled = false;
          btnRunTestsText.textContent = 'Re-Run Suite';
          btnRunTests.classList.remove('opacity-50', 'cursor-not-allowed');
          testResultSummary.innerHTML = '<span class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check"></i> All Tests Passed (0 Flaky / 0 Failed)</span>';
          showToast('Playwright suite execution finished with 100% pass rate!', 'fa-solid fa-circle-check text-emerald-400');
        }
      }, 150);
    });
  }

  // -------------------------------------------------------------------------
  // 8B. Tab 2: Postman API Inspector & Mock Assertions
  // -------------------------------------------------------------------------
  const apiEndpointSelect = document.getElementById('apiEndpointSelect');
  const apiMethodBadge = document.getElementById('apiMethodBadge');
  const apiEndpointUrl = document.getElementById('apiEndpointUrl');
  const btnSendApiRequest = document.getElementById('btnSendApiRequest');
  const apiResponseCode = document.getElementById('apiResponseCode');
  const apiResponseTime = document.getElementById('apiResponseTime');
  const apiResponseJson = document.getElementById('apiResponseJson');
  const apiAssertionsContainer = document.getElementById('apiAssertionsContainer');

  const apiMockEndpoints = {
    railway: {
      method: 'GET',
      badgeClass: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      url: 'https://eticket.railway.gov.bd/api/v1/trains/search?from=Dhaka&to=Chittagong&date=2026-10-15',
      time: '38ms',
      assertions: [
        'Status code is 200 OK (38ms)',
        'Response Content-Type contains application/json',
        'Available seats > 0 for AC_B berth',
        'Train timetable schema conforms to IEEE spec'
      ],
      json: {
        status: "success",
        route: "Dhaka - Chittagong",
        query_date: "2026-10-15",
        trains_count: 2,
        trains: [
          { name: "Suborno Express", train_id: 702, departure: "07:00", arrival: "12:15", ac_seats: 42, fare_bdt: 950 },
          { name: "Mahanagar Provati", train_id: 704, departure: "07:45", arrival: "14:00", ac_seats: 18, fare_bdt: 775 }
        ],
        audit_note: "Verified by Tanzim Rahman with 225 IEEE 829 test cases"
      }
    },
    taxEngine: {
      method: 'POST',
      badgeClass: 'bg-cyan-950 text-cyan-400 border-cyan-800',
      url: 'https://api.saucedemo.com/v1/checkout/tax-engine',
      time: '45ms',
      assertions: [
        'Status code is 200 OK (45ms)',
        'Calculated tax exactly matches 8.00% rate',
        'Total sum = Subtotal ($39.98) + Tax ($3.20) = $43.18',
        'Zero cents rounding drift confirmed'
      ],
      json: {
        currency: "USD",
        items_subtotal: 39.98,
        tax_rate: 0.08,
        tax_amount: 3.20,
        order_total: 43.18,
        precision_check: "PASS (IEEE 754 Floating point safe)",
        verified_by: "Tanzim Rahman Automated Checkout Engine"
      }
    },
    auth: {
      method: 'POST',
      badgeClass: 'bg-purple-950 text-purple-400 border-purple-800',
      url: 'https://auth.koyjabo.com/oauth/token',
      time: '62ms',
      assertions: [
        'Status code is 200 OK (62ms)',
        'JWT token contains valid signature & exp header',
        'User roles include ["sqa_engineer", "qa_lead"]',
        'HTTPOnly secure cookie flag asserted'
      ],
      json: {
        token_type: "Bearer",
        expires_in: 86400,
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          username: "tanzimsqa",
          role: "SQA Engineer",
          company: "Koy Jabo",
          status: "Active"
        }
      }
    }
  };

  function updateApiView(key) {
    const config = apiMockEndpoints[key] || apiMockEndpoints.railway;
    if (apiMethodBadge) {
      apiMethodBadge.textContent = config.method;
      apiMethodBadge.className = `px-2.5 py-1 rounded font-bold border text-[11px] ${config.badgeClass}`;
    }
    if (apiEndpointUrl) apiEndpointUrl.value = config.url;
    if (apiResponseCode) apiResponseCode.textContent = '200 OK';
    if (apiResponseTime) apiResponseTime.textContent = config.time;
    if (apiResponseJson) {
      apiResponseJson.textContent = JSON.stringify(config.json, null, 2);
    }
    if (apiAssertionsContainer) {
      apiAssertionsContainer.innerHTML = '';
      config.assertions.forEach(assertText => {
        const item = document.createElement('div');
        item.className = 'text-emerald-400 flex items-center gap-1.5';
        item.innerHTML = `<i class="fa-solid fa-check text-[11px]"></i> <span>${assertText}</span>`;
        apiAssertionsContainer.appendChild(item);
      });
    }
  }

  if (apiEndpointSelect) {
    apiEndpointSelect.addEventListener('change', (e) => {
      updateApiView(e.target.value);
    });
  }

  if (btnSendApiRequest) {
    btnSendApiRequest.addEventListener('click', () => {
      btnSendApiRequest.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-[10px]"></i> Asserting...';
      btnSendApiRequest.disabled = true;

      setTimeout(() => {
        const key = apiEndpointSelect ? apiEndpointSelect.value : 'railway';
        updateApiView(key);
        btnSendApiRequest.disabled = false;
        btnSendApiRequest.innerHTML = '<i class="fa-solid fa-check text-[10px] text-emerald-400"></i> Passed (200 OK)';
        showToast('API Assertion Passed: 4/4 test criteria met!', 'fa-solid fa-network-wired text-emerald-400');
        setTimeout(() => {
          btnSendApiRequest.innerHTML = '<i class="fa-solid fa-paper-plane text-[10px]"></i> Send & Assert';
        }, 1500);
      }, 350);
    });
  }

  // -------------------------------------------------------------------------
  // 8C. Tab 3: JMeter Concurrency & Load Benchmark
  // -------------------------------------------------------------------------
  const sliderUsers = document.getElementById('sliderUsers');
  const valUsers = document.getElementById('valUsers');
  const valTps = document.getElementById('valTps');
  const valLatency = document.getElementById('valLatency');
  const valStability = document.getElementById('valStability');
  const jmeterBarContainer = document.getElementById('jmeterBarContainer');

  function renderJmeterChart() {
    if (!jmeterBarContainer) return;
    jmeterBarContainer.innerHTML = '';
    const users = parseInt(sliderUsers ? sliderUsers.value : 250);
    const barsCount = 28;

    for (let i = 0; i < barsCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'jmeter-bar';
      
      const factor = Math.sin((i / (barsCount - 1)) * Math.PI);
      const randomNoise = (Math.random() * 0.12) - 0.06;
      let heightPercent = Math.max(12, Math.min(96, ((users / 1500) * 85 * (factor + 0.25)) + (randomNoise * 15)));

      if (users > 1000) {
        bar.classList.add('danger');
      } else if (users > 600) {
        bar.classList.add('warning');
      }

      bar.style.height = `${heightPercent}%`;
      jmeterBarContainer.appendChild(bar);
    }
  }

  if (sliderUsers) {
    sliderUsers.addEventListener('input', (e) => {
      const users = parseInt(e.target.value);
      if (valUsers) valUsers.textContent = `${users} Virtual Users`;
      
      const tps = Math.round(users * 2.15);
      if (valTps) valTps.textContent = `${tps} req/sec`;

      const latency = Math.round(35 + (users * 0.22) + ((users > 800) ? (users - 800) * 0.35 : 0));
      if (valLatency) {
        valLatency.textContent = `${latency} ms`;
        if (latency > 350) {
          valLatency.className = 'text-xl font-bold text-rose-400';
        } else if (latency > 180) {
          valLatency.className = 'text-xl font-bold text-amber-400';
        } else {
          valLatency.className = 'text-xl font-bold text-emerald-400';
        }
      }

      if (valStability) {
        if (users > 1000) {
          valStability.innerHTML = '<span class="text-rose-400"><i class="fa-solid fa-triangle-exclamation"></i> Heavy Load (95th percentile &gt; 350ms)</span>';
        } else if (users > 600) {
          valStability.innerHTML = '<span class="text-amber-400"><i class="fa-solid fa-gauge-high"></i> Sustained Peak (Safe Threshold)</span>';
        } else {
          valStability.innerHTML = '<span class="text-emerald-400"><i class="fa-solid fa-circle-check"></i> Optimal SLA Response Time</span>';
        }
      }

      renderJmeterChart();
    });
    renderJmeterChart();
  }

  // -------------------------------------------------------------------------
  // 8D. Tab 4: Jira Bug Defect Lifecycle Viewer
  // -------------------------------------------------------------------------
  const jiraTicketSelect = document.getElementById('jiraTicketSelect');
  const jiraBugId = document.getElementById('jiraBugId');
  const jiraBugTitle = document.getElementById('jiraBugTitle');
  const jiraBugSeverity = document.getElementById('jiraBugSeverity');
  const jiraBugPriority = document.getElementById('jiraBugPriority');
  const jiraBugEnvironment = document.getElementById('jiraBugEnvironment');
  const jiraStepsList = document.getElementById('jiraStepsList');
  const jiraExpected = document.getElementById('jiraExpected');
  const jiraActual = document.getElementById('jiraActual');

  const jiraTicketsData = {
    railway: {
      id: "RAIL-104",
      title: "Passenger Berth Race Condition during Simultaneous Seat Locking",
      severity: "High (Severity 1)",
      severityClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      priority: "P1 - Blocker",
      env: "Production & Staging · Chrome 129 / Windows 11 · Latency 45ms",
      steps: [
        "1. Open Bangladesh Railway e-Ticketing Portal (eticket.railway.gov.bd).",
        "2. Search Dhaka to Chittagong with two concurrent authenticated user sessions.",
        "3. Simultaneously select the last remaining AC_B seat (Seat #18) in coach 'GA'.",
        "4. Click 'Purchase Ticket' within < 200ms delta from both browser sessions."
      ],
      expected: "Backend distributed lock triggers 409 Conflict with clear UI toast: 'Seat is currently reserved by another passenger. Please select another seat.'",
      actual: "Both sessions receive 200 OK and proceed to checkout, resulting in duplicate payment authorization for a single seat inventory entry."
    },
    sauce: {
      id: "SAUCE-082",
      title: "Dynamic 8% Tax Rounding Drift for High-Value Multi-Cart Items",
      severity: "Medium (Severity 2)",
      severityClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      priority: "P2 - Major",
      env: "SauceDemo Staging · Python Playwright Automated Runner · Pytest v9.1",
      steps: [
        "1. Authenticate with standard_user credentials.",
        "2. Add 'Sauce Labs Fleece Jacket' ($49.99) and 'Sauce Labs Backpack' ($29.99) to cart.",
        "3. Proceed to Checkout Step Two (Overview Page).",
        "4. Inspect Item total ($79.98) and Tax calculation ($6.40)."
      ],
      expected: "Tax formula Math.round(79.98 * 0.08 * 100) / 100 strictly outputs $6.40, totaling $86.38.",
      actual: "Passed in Playwright automated assertion: verified zero floating point precision drift."
    },
    auth: {
      id: "AUTH-019",
      title: "Unauthenticated Cart Checkout Route Bypass via Direct URL Navigation",
      severity: "Critical (Security Audit)",
      severityClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      priority: "P0 - Critical",
      env: "Koy Jabo Staging API & Frontend Web Client",
      steps: [
        "1. Launch browser in Incognito mode with zero stored localStorage or cookies.",
        "2. Navigate directly to https://app.target.com/checkout-step-one.html.",
        "3. Observe route guard redirection logic."
      ],
      expected: "Middleware immediately redirects to /login.html?redirect=checkout and flushes state.",
      actual: "Intercepted in manual STLC audit: Redirection properly verified by Tanzim's automation suite."
    }
  };

  function updateJiraTicket(key) {
    const data = jiraTicketsData[key] || jiraTicketsData.railway;
    if (jiraBugId) jiraBugId.textContent = data.id;
    if (jiraBugTitle) jiraBugTitle.textContent = data.title;
    if (jiraBugSeverity) {
      jiraBugSeverity.textContent = data.severity;
      jiraBugSeverity.className = `px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${data.severityClass}`;
    }
    if (jiraBugPriority) jiraBugPriority.textContent = data.priority;
    if (jiraBugEnvironment) jiraBugEnvironment.textContent = data.env;
    if (jiraStepsList) {
      jiraStepsList.innerHTML = '';
      data.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        jiraStepsList.appendChild(li);
      });
    }
    if (jiraExpected) jiraExpected.textContent = data.expected;
    if (jiraActual) jiraActual.textContent = data.actual;
  }

  if (jiraTicketSelect) {
    jiraTicketSelect.addEventListener('change', (e) => {
      updateJiraTicket(e.target.value);
    });
  }

  // =========================================================================
  // 9. Contact Message Form
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const contactFeedback = document.getElementById('contactFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const msg = document.getElementById('senderMsg').value;

      const mailtoUrl = `mailto:tanzimsqa@gmail.com?subject=SQA Opportunity from ${encodeURIComponent(name)}&body=${encodeURIComponent(msg + "\n\nFrom: " + name + "\nEmail: " + email)}`;

      if (contactFeedback) {
        contactFeedback.innerHTML = `✓ Thank you, ${name}! Launching your email client... (Or message directly on WhatsApp: <a href="https://wa.me/8801992321575" target="_blank" class="underline text-cyan-300 font-semibold">+880 1992-321575</a>)`;
        contactFeedback.classList.remove('hidden');
      }

      showToast(`Thank you, ${name}! Redirecting to email...`, 'fa-solid fa-paper-plane text-cyan-400');

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);
    });
  }

});
