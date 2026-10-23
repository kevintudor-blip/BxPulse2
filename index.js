/**
 * BxPulse Analytics - Core Application Engine (app.js)
 * Behavioral & IEP Analytics System
 */

// ==========================================
// 1. DATA CONFIGURATION & GLOBAL STATE
// ==========================================
const US_STATES_DATABASE = [
  { code: 'IL', name: 'Illinois', board: 'Illinois State Board of Education (ISBE)', form: 'ISBE-34-54-IEP', codeRef: '23 IL Admin Code 226' },
  { code: 'CA', name: 'California', board: 'California Department of Education (CDE / SELPA)', form: 'CA-SEIS-IEP-504', codeRef: '5 CA ADC § 3030' },
  { code: 'NY', name: 'New York', board: 'New York State Education Department (NYSED)', form: 'NYSED-IEP-TEMPLATE', codeRef: '8 NYCRR Part 200' },
  { code: 'TX', name: 'Texas', board: 'Texas Education Agency (TEA / ARD)', form: 'TX-TEA-ARD-IEP-DOC', codeRef: '19 TAC Ch 89 Subch AA' },
  { code: 'FL', name: 'Florida', board: 'Florida Department of Education (FLDOE / ESE)', form: 'FL-FAPE-IEP-01', codeRef: '6A-6.03028 FAC' }
];

const MASTER_ACCOUNT_EMAIL = 'kevin.tudor@brightmontacademy.com';
const MASTER_ACCOUNT_PASSWORD = 'Teachsped13!';

let appState = {
  currentUser: { 
    id: 'a1', 
    name: 'Kevin Tudor', 
    role: 'Master Admin', 
    email: MASTER_ACCOUNT_EMAIL, 
    password: MASTER_ACCOUNT_PASSWORD, 
    state: 'IL', 
    district: 'District #158' 
  },
  currentStudentId: 's1',
  activeTab: 'analytics',
  activeMasterSubTab: 'roster',
  activeDataMethod: 'mts',
  activeGoalId: 'g1',
  activeMessagingRecipientId: 'p1',
  activeLinkTab: 'students',
  anonymizePII: false,
  visiblePasswordsMap: {},
  districts: [
    { id: 'd1', name: 'District #158', state: 'IL', code: 'DIST-158', status: 'ACTIVE' },
    { id: 'd2', name: 'District #204', state: 'IL', code: 'DIST-204', status: 'ACTIVE' }
  ],
  rosterMembers: [
    { 
      id: 's1', 
      name: 'Alex Rivera', 
      role: 'student', 
      typeLabel: '7th Grade', 
      detail: 'IEP-8842', 
      password: 'AlexR#2026',
      state: 'IL', 
      district: 'District #158', 
      status: 'ACTIVE', 
      parentName: 'Elena Rivera',
      parentEmail: 'e.rivera@parent.org',
      parentPhone: '(555) 234-8901',
      classes: [
        { id: 'c1', name: 'Math - Algebra I', status: 'ACTIVE' },
        { id: 'c2', name: 'Language Arts 7', status: 'ACTIVE' },
        { id: 'c3', name: 'General Science', status: 'ACTIVE' }
      ]
    },
    { 
      id: 's2', 
      name: 'Jordan Chen', 
      role: 'student', 
      typeLabel: '5th Grade', 
      detail: 'IEP-9104', 
      password: 'JordanC#2026',
      state: 'IL', 
      district: 'District #158', 
      status: 'ACTIVE'
    },
    { id: 't1', name: 'Sarah Miller BCBA', role: 'staff', typeLabel: 'Lead BCBA', detail: 's.miller@bxpulse.edu', password: 'BCBApass2026!', state: 'IL', district: 'District #158', status: 'ACTIVE' },
    { id: 't2', name: 'David Ross M.Ed', role: 'staff', typeLabel: 'SpEd Educator', detail: 'd.ross@bxpulse.edu', password: 'SpedEd2026!', state: 'IL', district: 'District #158', status: 'ACTIVE' },
    { 
      id: 'p1', 
      name: 'Elena Rivera', 
      role: 'parent', 
      typeLabel: 'Parent Guardian', 
      detail: 'e.rivera@parent.org', 
      password: 'ParentSecure123!', 
      state: 'IL', 
      district: 'District #158', 
      status: 'ACTIVE',
      linkedContacts: ['s1', 't1', 't2', 'a1']
    },
    { id: 'a1', name: 'Kevin Tudor', role: 'admin', typeLabel: 'Master Owner', detail: MASTER_ACCOUNT_EMAIL, password: MASTER_ACCOUNT_PASSWORD, state: 'IL', district: 'District #158', status: 'ACTIVE' }
  ],
  goals: [
    { id: 'g1', studentId: 's1', title: 'On-Task Engagement in Academic Work', domain: 'Behavioral', current: 78.4, target: 85, metricType: 'MTS %', status: 'ACTIVE' }
  ],
  observations: [
    { id: 'obs_101', studentId: 's1', goalId: 'g1', className: 'Math - Algebra I', method: 'MTS', score: 80, note: 'Sustained engagement', date: '2026-10-20' },
    { id: 'obs_102', studentId: 's1', goalId: 'g1', className: 'Math - Algebra I', method: 'MTS', score: 90, note: 'On-task minimal redirection', date: '2026-10-21' },
    { id: 'obs_103', studentId: 's1', goalId: 'g1', className: 'Language Arts 7', method: 'MTS', score: 65, note: 'Mild off-task behavior', date: '2026-10-21' },
    { id: 'obs_104', studentId: 's1', goalId: 'g1', className: 'General Science', method: 'MTS', score: 95, note: 'Used break card independently', date: '2026-10-22' }
  ],
  messages: [
    { id: 'm1', studentId: 's1', senderId: 't1', senderName: 'Sarah Miller BCBA', senderRole: 'staff', recipientId: 'p1', recipientName: 'Elena Rivera', recipientRole: 'parent', text: 'Alex had a great session today!', timestamp: '10/22/2026, 9:15 AM' }
  ],
  taskSteps: [
    { text: 'Gather required materials', done: true },
    { text: 'Open assignment page', done: true },
    { text: 'Complete assigned problems independently', done: false },
    { text: 'Raise hand for verification', done: false }
  ]
};

let chartInstances = {};
let timerInterval = null;
let timerTimeLeft = 30;
let isTimerActive = false;
let stopwatchInterval = null;
let stopwatchSeconds = 0;
let freqCount = 0;
let audioCtx = null;

// ==========================================
// 2. INITIALIZATION & STATE PERSISTENCE
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  loadStoredState();
  populate50StatesDropdowns();
  populateDistrictDropdowns();
  populateStudentDropdown();
  populateGoalDropdown();
  populateDataTrackerClasses();
  enforceRolePermissions();
  renderTaskChecklist();
  renderActiveStudentViews();
  renderStateComplianceDetails();
});

function loadStoredState() {
  const saved = localStorage.getItem('bxpulse_encrypted_payload');
  if (saved) {
    try {
      const decoded = JSON.parse(atob(saved));
      if (decoded.rosterMembers) appState.rosterMembers = decoded.rosterMembers;
      if (decoded.messages) appState.messages = decoded.messages;
      if (decoded.goals) appState.goals = decoded.goals;
    } catch(e) {
      console.warn('Could not parse stored session payload:', e);
    }
  }
}

function saveState() {
  const encoded = btoa(JSON.stringify({
    rosterMembers: appState.rosterMembers,
    messages: appState.messages,
    goals: appState.goals
  }));
  localStorage.setItem('bxpulse_encrypted_payload', encoded);
}

// ==========================================
// 3. AUTHENTICATION & ACCESS CONTROL
// ==========================================
function isMasterAccount() {
  return appState.currentUser && appState.currentUser.email.toLowerCase() === MASTER_ACCOUNT_EMAIL.toLowerCase();
}

function isTeacherOrAdmin() {
  if (!appState.currentUser) return false;
  const role = appState.currentUser.role.toLowerCase();
  return role.includes('admin') || role.includes('bcba') || role.includes('teacher') || role.includes('staff');
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass = document.getElementById('loginPassword').value;

  if (email === MASTER_ACCOUNT_EMAIL) {
    if (pass !== MASTER_ACCOUNT_PASSWORD) {
      document.getElementById('loginErrorMsg').classList.remove('hidden');
      return;
    }
    appState.currentUser = { id: 'a1', name: 'Kevin Tudor', role: 'Master Admin', email: MASTER_ACCOUNT_EMAIL, password: MASTER_ACCOUNT_PASSWORD, state: 'IL', district: 'District #158' };
  } else if (email.includes('parent') || email === 'e.rivera@parent.org') {
    const parentObj = appState.rosterMembers.find(r => r.role === 'parent' && r.detail === email);
    appState.currentUser = parentObj || { id: 'p1', name: 'Elena Rivera', role: 'parent', detail: email, password: pass || 'ParentSecure123!', state: 'IL', district: 'District #158', linkedContacts: ['s1', 't1', 't2', 'a1'] };
  } else {
    appState.currentUser = { id: 't1', name: 'Sarah Miller BCBA', role: 'staff', detail: email, password: pass || 'BCBApass2026!', state: 'IL', district: 'District #158' };
  }

  document.getElementById('authScreen').classList.add('hidden');
  enforceRolePermissions();
  populateStudentDropdown();
  switchStudentContext();
}

function handleUserLogout() {
  appState.currentUser = null;
  document.getElementById('authScreen').classList.remove('hidden');
}

function enforceRolePermissions() {
  const isMaster = isMasterAccount();
  const isStaff = isTeacherOrAdmin();

  document.getElementById('userRoleBadge').textContent = appState.currentUser.role;

  const navContainer = document.getElementById('navigationTabsContainer');
  navContainer.innerHTML = '';

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: 'fa-chart-line', perm: true },
    { id: 'goals', label: 'Interactive Goals', icon: 'fa-bullseye', perm: true },
    { id: 'aigoalwriter', label: 'Gemini AI Goal Writer', icon: 'fa-wand-magic-sparkles', perm: isStaff },
    { id: 'messaging', label: 'Messaging Portal', icon: 'fa-comments', perm: true },
    { id: 'tracking', label: 'Multi-Method Hub', icon: 'fa-stopwatch', perm: isStaff },
    { id: 'stateguidelines', label: '50 State Boards', icon: 'fa-landmark', perm: isStaff },
    { id: 'masterhub', label: 'Master Admin & Rosters', icon: 'fa-user-shield', perm: isMaster },
    { id: 'reports', label: 'Reports', icon: 'fa-file-invoice', perm: true }
  ];

  tabs.forEach(t => {
    if (t.perm) {
      const btn = document.createElement('button');
      btn.id = `tabBtn-${t.id}`;
      btn.onclick = () => switchTab(t.id);
      btn.className = 'tab-btn bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap btn-3d';
      btn.innerHTML = `<i class="fa-solid ${t.icon}"></i> <span>${t.label}</span>`;
      navContainer.appendChild(btn);
    }
  });

  populateMessagingRecipients();
  switchTab('analytics');
}

function switchTab(tabKey) {
  appState.activeTab = tabKey;
  ['analytics', 'goals', 'aigoalwriter', 'messaging', 'tracking', 'stateguidelines', 'masterhub', 'reports'].forEach(t => {
    const sec = document.getElementById(`sec-${t}`);
    const btn = document.getElementById(`tabBtn-${t}`);
    if (sec) sec.classList.toggle('hidden', t !== tabKey);
    if (btn) {
      btn.classList.toggle('bg-emerald-600', t === tabKey);
      btn.classList.toggle('text-white', t === tabKey);
      btn.classList.toggle('bg-slate-200/80', t !== tabKey);
      btn.classList.toggle('text-slate-700', t !== tabKey);
    }
  });

  if (tabKey === 'analytics') renderCharts();
  if (tabKey === 'messaging') {
    populateMessagingRecipients();
    renderMessagingPortal();
  }
  if (tabKey === 'tracking') {
    populateDataTrackerClasses();
    syncGlobalTrackerGoal();
  }
}

// ==========================================
// 4. MULTI-METHOD DATA COLLECTION ENGINES
// ==========================================

// Method 1: MTS Timer
function toggleMtsTimer() {
  const btn = document.getElementById('mtsToggleBtn');
  const status = document.getElementById('mtsStatusText');
  
  if (isTimerActive) {
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerActive = false;
    btn.textContent = 'Resume Session';
    status.textContent = 'Session Paused';
  } else {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    isTimerActive = true;
    btn.textContent = 'Pause Session';
    status.textContent = 'Session Active - Observing...';

    timerInterval = setInterval(() => {
      timerTimeLeft--;
      updateMtsDisplay();
      
      if (timerTimeLeft <= 0) {
        playAudioChime();
        status.textContent = 'INTERVAL COMPLETE - RECORD OBSERVATION!';
        clearInterval(timerInterval);
        timerInterval = null;
        isTimerActive = false;
        btn.textContent = 'Restart Timer';
      }
    }, 1000);
  }
}

function resetMtsTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isTimerActive = false;
  const intervalSecs = parseInt(document.getElementById('mtsIntervalSelect').value, 10);
  timerTimeLeft = intervalSecs;
  document.getElementById('mtsToggleBtn').textContent = 'Start Session';
  document.getElementById('mtsStatusText').textContent = 'Timer Ready';
  updateMtsDisplay();
}

function updateMtsDisplay() {
  const mins = Math.floor(timerTimeLeft / 60).toString().padStart(2, '0');
  const secs = (timerTimeLeft % 60).toString().padStart(2, '0');
  document.getElementById('mtsDigits').textContent = `${mins}:${secs}`;
}

function recordMtsTally(isOnTask) {
  commitObservationEvent('MTS', isOnTask ? 100 : 0, isOnTask ? 'MTS: ON-TASK' : 'MTS: OFF-TASK');
  alert(`Recorded MTS Interval: ${isOnTask ? 'ON-TASK (100%)' : 'OFF-TASK (0%)'}`);
  resetMtsTimer();
  toggleMtsTimer();
}

function playAudioChime() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch(e) {
    console.warn('Audio playback restricted:', e);
  }
}

// Method 2: ABC Data Logger
function handleAbcSubmit(e) {
  e.preventDefault();
  const ant = document.getElementById('abcAntecedent').value;
  const beh = document.getElementById('abcBehavior').value.trim();
  const con = document.getElementById('abcConsequence').value;
  const fn = document.getElementById('abcFunction').value;

  commitObservationEvent('ABC', 1, `Trigger: ${ant} | Behavior: ${beh} | Consequence: ${con}`, { func: fn });
  document.getElementById('abcBehavior').value = '';
  alert(`ABC Event Logged: Function - ${fn}`);
}

// Method 3: Frequency Counter
function adjustFreqCount(val) {
  freqCount = Math.max(0, freqCount + val);
  document.getElementById('freqCountDisplay').textContent = freqCount;
}

function saveFreqObservation() {
  commitObservationEvent('Frequency Tally', freqCount, `Total frequency tally: ${freqCount} events.`);
  alert(`Committed Frequency Tally: ${freqCount}`);
  freqCount = 0;
  document.getElementById('freqCountDisplay').textContent = '0';
}

// Method 4: Duration Stopwatch
function toggleStopwatch() {
  const btn = document.getElementById('stopwatchToggleBtn');
  if (stopwatchInterval) {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    btn.textContent = 'Resume Timer';
  } else {
    btn.textContent = 'Pause Timer';
    stopwatchInterval = setInterval(() => {
      stopwatchSeconds++;
      const mins = Math.floor(stopwatchSeconds / 60).toString().padStart(2, '0');
      const secs = (stopwatchSeconds % 60).toString().padStart(2, '0');
      document.getElementById('stopwatchDisplay').textContent = `${mins}:${secs}`;
    }, 1000);
  }
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  stopwatchSeconds = 0;
  document.getElementById('stopwatchDisplay').textContent = '00:00';
  document.getElementById('stopwatchToggleBtn').textContent = 'Start Timer';
}

function saveDurationObservation() {
  commitObservationEvent('Duration (Secs)', stopwatchSeconds, `Elapsed time: ${stopwatchSeconds}s`);
  alert(`Recorded Duration: ${stopwatchSeconds} Seconds.`);
  resetStopwatch();
}

// Method 5: Task Analysis Checklist
function renderTaskChecklist() {
  const container = document.getElementById('taskChecklistContainer');
  if (!container) return;
  container.innerHTML = '';
  appState.taskSteps.forEach((step, idx) => {
    container.innerHTML += `
      <div class="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <span class="font-medium text-slate-700">${idx + 1}. ${step.text}</span>
        <input type="checkbox" ${step.done ? 'checked' : ''} onchange="toggleTaskStep(${idx})" class="w-4 h-4 text-emerald-600 rounded">
      </div>
    `;
  });
  calculateTaskScore();
}

function toggleTaskStep(idx) {
  appState.taskSteps[idx].done = !appState.taskSteps[idx].done;
  calculateTaskScore();
}

function calculateTaskScore() {
  const doneCount = appState.taskSteps.filter(s => s.done).length;
  const pct = Math.round((doneCount / appState.taskSteps.length) * 100);
  const scoreEl = document.getElementById('taskScorePct');
  if (scoreEl) scoreEl.textContent = `${pct}%`;
  return pct;
}

function saveTaskAnalysisObservation() {
  const score = calculateTaskScore();
  commitObservationEvent('Task Analysis %', score, `Task completion rate: ${score}%`);
  alert(`Committed Task Score: ${score}%`);
}

function switchDataMethod(methodKey) {
  ['mts', 'abc', 'freq', 'dur', 'task'].forEach(m => {
    const panel = document.getElementById(`method-${m}`);
    const btn = document.getElementById(`methodBtn-${m}`);
    if (panel) panel.classList.toggle('hidden', m !== methodKey);
    if (btn) {
      btn.classList.toggle('bg-emerald-600', m === methodKey);
      btn.classList.toggle('text-white', m === methodKey);
      btn.classList.toggle('bg-slate-100', m !== methodKey);
      btn.classList.toggle('text-slate-700', m !== methodKey);
    }
  });
}

function commitObservationEvent(method, score, noteText, meta = {}) {
  const goal = appState.goals.find(g => g.id === appState.activeGoalId);
  const selectedClass = document.getElementById('globalTrackerClassSelect') ? document.getElementById('globalTrackerClassSelect').value : 'General Class';
  
  if (goal && method !== 'ABC') {
    goal.current = Math.min(100, Math.round((goal.current + score) / 2));
  }

  appState.observations.push({
    id: 'obs_' + Date.now(),
    studentId: appState.currentStudentId,
    goalId: appState.activeGoalId,
    className: selectedClass,
    method,
    score,
    note: `[Class: ${selectedClass}] ${noteText}`,
    meta,
    date: new Date().toISOString().split('T')[0]
  });

  saveState();
  renderInteractiveGoals();
  renderCharts();
}

// ==========================================
// 5. GEMINI AI GOAL & BEHAVIOR ASSISTANT
// ==========================================
function generateSmartGoalAI(e) {
  e.preventDefault();
  const domain = document.getElementById('aiGoalDomain').value;
  const baseline = document.getElementById('aiGoalBaseline').value;
  const target = document.getElementById('aiGoalTarget').value;
  const area = document.getElementById('aiGoalArea').value.trim();

  const student = appState.rosterMembers.find(s => s.id === appState.currentStudentId);
  const studentName = student ? student.name : 'The student';

  const goalText = `By the end of the annual IEP period, given standard instructional settings, ${studentName} will demonstrate improved ${domain.toLowerCase()} competency in ${area}, increasing performance from a baseline of ${baseline}% to at least ${target}% accuracy across 4 of 5 opportunities.`;

  appState.lastGeneratedGoal = { title: area, domain, current: parseFloat(baseline), target: parseFloat(target) };
  document.getElementById('aiGoalGeneratedText').textContent = goalText;
  document.getElementById('aiGoalOutputBox').classList.remove('hidden');
}

function addGeneratedGoalToActiveStudent() {
  if (!appState.lastGeneratedGoal) return;
  appState.goals.push({
    id: 'g_' + Date.now(),
    studentId: appState.currentStudentId,
    title: appState.lastGeneratedGoal.title,
    domain: appState.lastGeneratedGoal.domain,
    current: appState.lastGeneratedGoal.current,
    target: appState.lastGeneratedGoal.target,
    status: 'ACTIVE'
  });
  saveState();
  populateGoalDropdown();
  renderInteractiveGoals();
  renderCharts();
  alert('Goal successfully added to active student profile!');
}

function generateBipStrategyAI(e) {
  e.preventDefault();
  const beh = document.getElementById('aiBipBehavior').value;
  const fn = document.getElementById('aiBipFunction').value;

  const strategyMatrix = {
    "Escape / Avoidance": {
      antecedents: [
        `Pre-teach transitions and chunk academic tasks into 5-minute visual work blocks to mitigate ${beh.toLowerCase()}.`,
        `Provide controlled choices (e.g., choice of assignment sequence, seating position, or writing tool).`,
        `Implement a visual schedule with explicit 'First/Then' cues prior to task presentation.`
      ],
      replacement: `Train student to request a 2-minute sensory/break card prior to exhibiting ${beh.toLowerCase()}.`,
      consequences: [
        `Immediately grant a functional 2-minute break upon appropriate break request (Differential Reinforcement of Alternative behavior - DRA).`,
        `Maintain silent task demand persistence (escape extinction) without power struggles during non-compliance.`
      ],
      deescalation: `Provide neutral redirection to the visual break schedule without engaging in verbal negotiation or extended debate.`
    },
    "Attention Seeking": {
      antecedents: [
        `Schedule non-contingent educator check-ins every 3-5 minutes during independent work.`,
        `Assign structured leadership roles or peer-partner responsibilities during instructional activities.`
      ],
      replacement: `Teach student to tap a 'Help / Check-In' desk visual or raise a hand to solicit positive adult attention.`,
      consequences: [
        `Deliver immediate, behavior-specific praise and enthusiasm when the student utilizes proper attention-seeking communication.`,
        `Apply planned ignoring (extinction) for minor ${beh.toLowerCase()}, reserving verbal interactions strictly for appropriate behavior.`
      ],
      deescalation: `Maintain a calm, neutral stance with minimal eye contact while redirecting to reduce unintended reinforcement.`
    },
    "Access to Tangible": {
      antecedents: [
        `Use visual countdown timers (5-min, 2-min) before transitioning away from preferred materials.`,
        `Display a visual token economy showing exactly when access to preferred activities will be earned.`
      ],
      replacement: `Teach student to request a 'My Turn' visual or use a waiting timer to gain access to preferred items.`,
      consequences: [
        `Reinforce patient waiting with immediate token system progress or access to a secondary preferred activity.`,
        `Withhold access to the contested item or activity while ${beh.toLowerCase()} is occurring.`
      ],
      deescalation: `Offer choices between two neutral alternative tasks while keeping restricted items out of reach.`
    }
  };

  const plan = strategyMatrix[fn] || strategyMatrix["Escape / Avoidance"];

  const htmlOutput = `
    <div class="space-y-3 text-slate-800">
      <div class="bg-sky-50 border-l-4 border-sky-600 p-2.5 rounded-r-xl">
        <span class="text-[10px] font-black uppercase text-sky-800 block">Behavior Target & Function Profile</span>
        <p class="font-bold text-xs text-slate-900">${beh} <span class="text-slate-500 font-normal">(Function: ${fn})</span></p>
      </div>

      <div>
        <h4 class="font-extrabold text-emerald-700 text-xs flex items-center gap-1.5 mb-1">
          <i class="fa-solid fa-shield-halved"></i> 1. Proactive Antecedent Modifications
        </h4>
        <ul class="list-disc pl-5 space-y-1 text-slate-700 text-xs">
          ${plan.antecedents.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>

      <div>
        <h4 class="font-extrabold text-sky-700 text-xs flex items-center gap-1.5 mb-1">
          <i class="fa-solid fa-arrows-rotate"></i> 2. Functionally Equivalent Replacement Behavior (FERB)
        </h4>
        <p class="bg-slate-100 p-2 rounded-lg text-slate-800 font-medium text-xs">${plan.replacement}</p>
      </div>

      <div>
        <h4 class="font-extrabold text-teal-700 text-xs flex items-center gap-1.5 mb-1">
          <i class="fa-solid fa-circle-check"></i> 3. Reinforcement & Consequence Protocols
        </h4>
        <ul class="list-disc pl-5 space-y-1 text-slate-700 text-xs">
          ${plan.consequences.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>

      <div>
        <h4 class="font-extrabold text-rose-700 text-xs flex items-center gap-1.5 mb-1">
          <i class="fa-solid fa-triangle-exclamation"></i> 4. De-escalation & Crisis Protocol
        </h4>
        <p class="bg-rose-50 border border-rose-200 text-rose-900 p-2 rounded-lg font-medium text-xs">${plan.deescalation}</p>
      </div>
    </div>
  `;

  document.getElementById('aiBipGeneratedContent').innerHTML = htmlOutput;
  document.getElementById('aiBipOutputBox').classList.remove('hidden');
}

// ==========================================
// 6. MESSAGING HUB & PARENT CONTACT LINKING
// ==========================================
function populateMessagingRecipients() {
  const select = document.getElementById('messageRecipientSelect');
  if (!select) return;
  select.innerHTML = '';

  const me = appState.currentUser;
  const isParentUser = me.role === 'parent' || me.role.toLowerCase().includes('parent');
  let recipients = [];

  if (isParentUser) {
    const parentObj = appState.rosterMembers.find(m => m.id === me.id || m.detail === me.email);
    const linked = (parentObj && parentObj.linkedContacts) ? parentObj.linkedContacts : ['s1', 't1', 't2', 'a1'];
    recipients = appState.rosterMembers.filter(m => m.id !== me.id && m.status === 'ACTIVE' && linked.includes(m.id));
  } else {
    recipients = appState.rosterMembers.filter(m => m.id !== me.id && m.status === 'ACTIVE');
  }

  recipients.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.name} (${m.typeLabel || m.role.toUpperCase()})`;
    select.appendChild(opt);
  });

  if (recipients.length > 0) {
    if (!appState.activeMessagingRecipientId || !recipients.some(r => r.id === appState.activeMessagingRecipientId)) {
      appState.activeMessagingRecipientId = recipients[0].id;
    }
    select.value = appState.activeMessagingRecipientId;
  }
  updateConversationHeader();
}

function switchMessagingRecipient() {
  appState.activeMessagingRecipientId = document.getElementById('messageRecipientSelect').value;
  updateConversationHeader();
  renderMessagingPortal();
}

function updateConversationHeader() {
  const partner = appState.rosterMembers.find(m => m.id === appState.activeMessagingRecipientId);
  if (partner) {
    document.getElementById('conversationPartnerName').textContent = partner.name;
    document.getElementById('conversationPartnerRole').textContent = partner.typeLabel || partner.role.toUpperCase();
  }
}

function renderMessagingPortal() {
  const container = document.getElementById('messageThreadContainer');
  if (!container) return;
  container.innerHTML = '';

  const myId = appState.currentUser.id || 'a1';
  const targetId = appState.activeMessagingRecipientId;

  const thread = appState.messages.filter(m => 
    (m.senderId === myId && m.recipientId === targetId) || 
    (m.senderId === targetId && m.recipientId === myId)
  );

  if (thread.length === 0) {
    container.innerHTML = `<div class="text-center py-10 text-slate-400 font-bold">No direct messages exchanged with this contact yet.</div>`;
    return;
  }

  thread.forEach(m => {
    const isMe = m.senderId === myId;
    const bubble = document.createElement('div');
    bubble.className = `flex flex-col ${isMe ? 'items-end' : 'items-start'}`;
    bubble.innerHTML = `
      <div class="max-w-[80%] rounded-2xl p-3 border ${isMe ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-slate-800 border-slate-200'}">
        <div class="flex justify-between items-center gap-2 mb-1 text-[10px] ${isMe ? 'text-emerald-100' : 'text-slate-400'} font-bold">
          <span>${m.senderName}</span>
          <span>${m.timestamp}</span>
        </div>
        <p class="leading-relaxed">${m.text}</p>
      </div>
    `;
    container.appendChild(bubble);
  });
  container.scrollTop = container.scrollHeight;
}

function handleSendPortalMessage(e) {
  e.preventDefault();
  const input = document.getElementById('portalMessageInput');
  const text = input.value.trim();
  if (!text) return;

  const myUser = appState.currentUser;
  const recipient = appState.rosterMembers.find(m => m.id === appState.activeMessagingRecipientId) || { id: 'p1', name: 'Elena Rivera', role: 'parent' };

  appState.messages.push({
    id: 'm_' + Date.now(),
    studentId: appState.currentStudentId,
    senderId: myUser.id || 'a1',
    senderName: myUser.name,
    senderRole: myUser.role,
    recipientId: recipient.id,
    recipientName: recipient.name,
    recipientRole: recipient.role,
    text,
    timestamp: new Date().toLocaleString([], { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  });

  input.value = '';
  saveState();
  renderMessagingPortal();
}

function openLinkParentContactsModal() {
  const select = document.getElementById('linkModalParentSelect');
  select.innerHTML = '';
  const parents = appState.rosterMembers.filter(m => m.role === 'parent' && m.status === 'ACTIVE');
  parents.forEach(p => { select.innerHTML += `<option value="${p.id}">${p.name} (${p.detail})</option>`; });
  
  switchLinkCategoryTab('students');
  document.getElementById('linkParentContactsModal').classList.remove('hidden');
}

function closeLinkParentContactsModal() {
  document.getElementById('linkParentContactsModal').classList.add('hidden');
}

function switchLinkCategoryTab(category) {
  appState.activeLinkTab = category;
  ['students', 'teachers', 'admins'].forEach(cat => {
    const btn = document.getElementById(`linkCatBtn-${cat}`);
    if (btn) btn.className = cat === category ? 'px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-600 text-white btn-3d' : 'px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 text-slate-700';
  });
  renderParentContactSelectionList();
}

function renderParentContactSelectionList() {
  const parentId = document.getElementById('linkModalParentSelect').value;
  const parentObj = appState.rosterMembers.find(m => m.id === parentId);
  const linked = (parentObj && parentObj.linkedContacts) ? parentObj.linkedContacts : [];

  const container = document.getElementById('parentContactChecklistContainer');
  container.innerHTML = '';

  let targetRoleFilter = 'student';
  if (appState.activeLinkTab === 'teachers') targetRoleFilter = 'staff';
  if (appState.activeLinkTab === 'admins') targetRoleFilter = 'admin';

  const eligible = appState.rosterMembers.filter(m => m.role === targetRoleFilter && m.status === 'ACTIVE');

  eligible.forEach(m => {
    const isChecked = linked.includes(m.id);
    container.innerHTML += `
      <div class="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
        <div>
          <p class="font-bold text-xs text-slate-800">${m.name}</p>
          <span class="text-[10px] text-slate-400">${m.detail}</span>
        </div>
        <input type="checkbox" value="${m.id}" ${isChecked ? 'checked' : ''} class="parent-link-checkbox w-4 h-4 text-sky-600 rounded">
      </div>
    `;
  });
}

function saveParentContactLinks(e) {
  e.preventDefault();
  const parentId = document.getElementById('linkModalParentSelect').value;
  const parentObj = appState.rosterMembers.find(m => m.id === parentId);
  if (!parentObj) return;

  if (!parentObj.linkedContacts) parentObj.linkedContacts = [];

  document.querySelectorAll('.parent-link-checkbox').forEach(cb => {
    if (cb.checked) {
      if (!parentObj.linkedContacts.includes(cb.value)) parentObj.linkedContacts.push(cb.value);
    } else {
      parentObj.linkedContacts = parentObj.linkedContacts.filter(id => id !== cb.value);
    }
  });

  saveState();
  populateMessagingRecipients();
  closeLinkParentContactsModal();
  alert('Messaging directory updated!');
}

// ==========================================
// 7. GOALS & OBSERVATION LOGIC
// ==========================================
function openAddGoalModal() {
  document.getElementById('modalGoalHeader').textContent = 'Add New IEP Goal';
  document.getElementById('modalGoalId').value = '';
  document.getElementById('modalGoalTitle').value = '';
  document.getElementById('modalGoalCurrent').value = 50;
  document.getElementById('modalGoalTarget').value = 85;
  document.getElementById('goalEditModal').classList.remove('hidden');
}

function closeGoalEditModal() { 
  document.getElementById('goalEditModal').classList.add('hidden'); 
}

function handleGoalFormSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('modalGoalTitle').value.trim();
  appState.goals.push({
    id: 'g_' + Date.now(),
    studentId: appState.currentStudentId,
    title, 
    domain: document.getElementById('modalGoalDomain').value,
    current: parseFloat(document.getElementById('modalGoalCurrent').value),
    target: parseFloat(document.getElementById('modalGoalTarget').value), 
    status: 'ACTIVE'
  });
  saveState();
  closeGoalEditModal();
  renderInteractiveGoals();
  renderCharts();
}

function openGoalDataLogModal(goalId) {
  document.getElementById('directLogGoalId').value = goalId;
  document.getElementById('goalDataLogModal').classList.remove('hidden');
}

function closeGoalDataLogModal() { 
  document.getElementById('goalDataLogModal').classList.add('hidden'); 
}

function handleDirectDataLogSubmit(e) {
  e.preventDefault();
  commitObservationEvent('Direct Log', parseFloat(document.getElementById('directLogScore').value), document.getElementById('directLogNotes').value);
  closeGoalDataLogModal();
}

function deleteGoal(goalId) {
  if (confirm('Are you sure you want to delete this goal?')) {
    appState.goals = appState.goals.filter(g => g.id !== goalId);
    saveState();
    populateGoalDropdown();
    renderInteractiveGoals();
    renderCharts();
  }
}

// ==========================================
// 8. ROSTER & DISTRICT MANAGEMENT
// ==========================================
function renderRosters() {
  const container = document.getElementById('rosterTableContainer');
  if (!container) return;
  let html = `<table class="w-full text-left text-xs"><thead><tr class="border-b font-extrabold uppercase text-[10px]"><th class="py-2">Name</th><th class="py-2">Role</th><th class="py-2">Identifier</th><th class="py-2">Password</th><th class="py-2 text-right">Actions</th></tr></thead><tbody class="divide-y">`;
  
  appState.rosterMembers.forEach(m => {
    const isPassVisible = !!appState.visiblePasswordsMap[m.id];
    html += `
      <tr>
        <td class="py-2 font-bold">${m.name}</td>
        <td class="py-2">${m.role}</td>
        <td class="py-2 font-mono">${m.detail}</td>
        <td class="py-2 font-mono">
          ${isPassVisible ? m.password : '••••••••'}
          <button onclick="toggleRosterPasswordVisibility('${m.id}')" class="ml-1 text-slate-400"><i class="fa-solid ${isPassVisible ? 'fa-eye-slash' : 'fa-eye'}"></i></button>
        </td>
        <td class="py-2 text-right">
          <button onclick="openEditRosterMemberModal('${m.id}')" class="text-sky-600 font-bold">Edit</button>
        </td>
      </tr>
    `;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

function toggleRosterPasswordVisibility(memberId) {
  appState.visiblePasswordsMap[memberId] = !appState.visiblePasswordsMap[memberId];
  renderRosters();
}

// ==========================================
// 9. ANALYTICS & CHARTING ENGINES
// ==========================================
function renderCharts() {
  if (appState.activeTab !== 'analytics') return;
  
  // Predictive Trend Chart
  if (chartInstances.predictive) chartInstances.predictive.destroy();
  const logs = appState.observations.filter(o => o.studentId === appState.currentStudentId);
  const chartCanvas = document.getElementById('predictiveChartCanvas');
  if (chartCanvas) {
    chartInstances.predictive = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: logs.length ? logs.map((_, i) => `Log ${i + 1}`) : ['No Data'],
        datasets: [{ label: 'Score', data: logs.map(l => l.score), borderColor: '#0284c7', backgroundColor: 'rgba(2, 132, 199, 0.1)', fill: true }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // Subject/Setting Chart
  if (chartInstances.subject) chartInstances.subject.destroy();
  const subjectCanvas = document.getElementById('subjectChartCanvas');
  if (subjectCanvas) {
    const classAggregates = {};
    logs.forEach(log => {
      const cls = log.className || 'General Setting';
      if (!classAggregates[cls]) classAggregates[cls] = { totalScore: 0, count: 0 };
      classAggregates[cls].totalScore += log.score;
      classAggregates[cls].count += 1;
    });

    const subjectLabels = Object.keys(classAggregates);
    const subjectScores = subjectLabels.map(cls => Math.round(classAggregates[cls].totalScore / classAggregates[cls].count));

    chartInstances.subject = new Chart(subjectCanvas, {
      type: 'bar',
      data: {
        labels: subjectLabels.length ? subjectLabels : ['No Class Data'],
        datasets: [{ label: 'Mean Class Score (%)', data: subjectScores.length ? subjectScores : [0], backgroundColor: 'rgba(16, 185, 129, 0.85)', borderRadius: 8 }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}

// ==========================================
// 10. UTILITIES & UI RENDERERS
// ==========================================
function populate50StatesDropdowns() {
  const select = document.getElementById('guidelinesStateSelect');
  if (!select) return;
  select.innerHTML = '';
  US_STATES_DATABASE.forEach(s => { select.innerHTML += `<option value="${s.code}">${s.name} (${s.code})</option>`; });
}

function populateDistrictDropdowns() {
  const selects = [document.getElementById('rosterDistrictFilter'), document.getElementById('modalMemberDistrict')];
  selects.forEach(sel => {
    if (!sel) return;
    sel.innerHTML = sel.id === 'rosterDistrictFilter' ? '<option value="ALL">All Districts</option>' : '';
    appState.districts.forEach(d => { sel.innerHTML += `<option value="${d.name}">${d.name} (${d.state})</option>`; });
  });
}

function populateStudentDropdown() {
  const select = document.getElementById('activeStudentSelect');
  if (!select) return;
  select.innerHTML = '';
  appState.rosterMembers.filter(r => r.role === 'student').forEach(s => {
    select.innerHTML += `<option value="${s.id}">${s.name}</option>`;
  });
}

function switchStudentContext() {
  appState.currentStudentId = document.getElementById('activeStudentSelect').value;
  populateGoalDropdown();
  populateDataTrackerClasses();
  renderActiveStudentViews();
}

function populateGoalDropdown() {
  const select = document.getElementById('globalTrackerGoalSelect');
  if (!select) return;
  select.innerHTML = '';
  appState.goals.filter(g => g.studentId === appState.currentStudentId).forEach(g => {
    select.innerHTML += `<option value="${g.id}">${g.title}</option>`;
  });
}

function syncGlobalTrackerGoal() {
  const select = document.getElementById('globalTrackerGoalSelect');
  if (select) appState.activeGoalId = select.value;
}

function populateDataTrackerClasses() {
  const select = document.getElementById('globalTrackerClassSelect');
  if (!select) return;
  select.innerHTML = '';
  const student = appState.rosterMembers.find(r => r.id === appState.currentStudentId);
  const activeClasses = (student && student.classes) ? student.classes : [];

  if (activeClasses.length === 0) {
    select.innerHTML = `<option value="General Class">General Class Setting</option>`;
  } else {
    activeClasses.forEach(c => { select.innerHTML += `<option value="${c.name}">${c.name}</option>`; });
  }
}

function renderActiveStudentViews() {
  renderInteractiveGoals();
  renderCharts();
}

function renderInteractiveGoals() {
  const container = document.getElementById('interactiveGoalsContainer');
  if (!container) return;
  container.innerHTML = '';
  appState.goals.filter(g => g.studentId === appState.currentStudentId).forEach(g => {
    container.innerHTML += `
      <div class="card-3d bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
        <h3 class="font-bold text-slate-900 text-sm">${g.title}</h3>
        <div class="flex justify-between text-xs font-semibold">
          <span>Score: ${g.current}%</span><span>Target: ${g.target}%</span>
        </div>
        <div class="flex gap-2">
          <button onclick="openGoalDataLogModal('${g.id}')" class="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs btn-3d">Log Data</button>
          <button onclick="deleteGoal('${g.id}')" class="bg-rose-50 text-rose-700 font-bold px-2 py-1 rounded text-xs">Delete</button>
        </div>
      </div>
    `;
  });
}

function renderStateComplianceDetails() {
  const select = document.getElementById('guidelinesStateSelect');
  if (!select) return;
  const code = select.value;
  const st = US_STATES_DATABASE.find(s => s.code === code) || US_STATES_DATABASE[0];
  const card = document.getElementById('stateComplianceDetailCard');
  if (card) {
    card.innerHTML = `
      <h3 class="text-base font-black text-slate-900">${st.name} - ${st.board}</h3>
      <p class="text-xs text-slate-600">Form: ${st.form} • Code: ${st.codeRef}</p>
    `;
  }
}

function toggleAnonymizePII() {
  appState.anonymizePII = !appState.anonymizePII;
  populateStudentDropdown();
  renderActiveStudentViews();
}

function resetInactivityTimer() {}