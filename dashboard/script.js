const clock = document.getElementById('clock');
const connectBtn = document.getElementById('connectBtn');
const simulateBtn = document.getElementById('simulateBtn');
const clearBtn = document.getElementById('clearBtn');
const connectionText = document.getElementById('connectionText');
const modeLabel = document.getElementById('modeLabel');
const systemState = document.getElementById('systemState');
const exposureCard = document.getElementById('exposureCard');
const exposureTitle = document.getElementById('exposureTitle');
const signal = document.getElementById('signal');
const responseRing = document.getElementById('responseRing');
const responseValue = document.getElementById('responseValue');
const responseText = document.getElementById('responseText');
const responseDesc = document.getElementById('responseDesc');
const alertCard = document.getElementById('alertCard');
const alertTitle = document.getElementById('alertTitle');
const alertMessage = document.getElementById('alertMessage');
const alertTime = document.getElementById('alertTime');
const alertWorker = document.getElementById('alertWorker');
const eventCount = document.getElementById('eventCount');
const statusNote = document.getElementById('statusNote');
const systemStatus = document.getElementById('systemStatus');
const history = document.getElementById('history');
const lastSync = document.getElementById('lastSync');
const lastResponse = document.getElementById('lastResponse');
const sampleIdEl = document.getElementById('sampleId');
const sampleTime = document.getElementById('sampleTime');
const workerId = document.getElementById('workerId');
const workerIdTitle = document.getElementById('workerIdTitle');
const healthWorker = document.getElementById('healthWorker');
const wristbandId = document.getElementById('wristbandId');
const deviceBadge = document.getElementById('deviceBadge');
const activeWorkers = document.getElementById('activeWorkers');

const SERVICE_UUID = '7b2a0001-6c4a-4d3b-9c1f-4153454e544c';
const CHARACTERISTIC_UUID = '7b2a0002-6c4a-4d3b-9c1f-4153454e544c';
const DB_KEY = 'airSentinalSamplesV1';
let characteristic = null;
let events = loadEvents();

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function updateClock() { clock.textContent = now(); }
setInterval(updateClock, 1000);
updateClock();

function loadEvents() {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); }
  catch { return []; }
}

function saveEvents() {
  localStorage.setItem(DB_KEY, JSON.stringify(events.slice(0, 100)));
}

function randomSample() {
  const response = Math.floor(18 + Math.random() * 78);
  return {
    event_id: `AS-${Date.now().toString().slice(-6)}`,
    worker_id: 'AS-024',
    wristband_id: 'WB-024',
    response_index: response,
    status: response >= 70 ? 'ALERT' : response >= 40 ? 'UNKNOWN' : 'SAFE',
    source: 'SIMULATED',
    timestamp: new Date().toISOString()
  };
}

function normaliseSample(data) {
  const response = Math.max(0, Math.min(100, Number(data.response_index ?? data.response ?? 0)));
  const status = String(data.status || (response >= 70 ? 'ALERT' : response >= 40 ? 'UNKNOWN' : 'SAFE')).toUpperCase();
  return {
    event_id: data.event_id || `AS-${Date.now().toString().slice(-6)}`,
    worker_id: data.worker_id || 'AS-024',
    wristband_id: data.wristband_id || 'WB-024',
    response_index: Math.round(response),
    status: ['SAFE', 'ALERT', 'UNKNOWN'].includes(status) ? status : 'UNKNOWN',
    source: data.source || 'WRISTBAND',
    timestamp: data.timestamp || new Date().toISOString()
  };
}

function applySample(raw) {
  const sample = normaliseSample(raw);
  const time = new Date(sample.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const response = sample.response_index;

  workerId.textContent = sample.worker_id;
  workerIdTitle.textContent = sample.worker_id;
  healthWorker.textContent = sample.worker_id;
  wristbandId.textContent = sample.wristband_id;
  alertWorker.textContent = sample.worker_id;
  sampleIdEl.textContent = sample.event_id;
  sampleTime.textContent = time;
  lastResponse.textContent = String(response).padStart(2, '0');
  lastSync.textContent = 'Just now';

  exposureCard.classList.toggle('alert-mode', sample.status === 'ALERT');
  signal.className = `signal ${sample.status.toLowerCase()}`;
  signal.textContent = sample.status;
  responseValue.textContent = response;
  responseRing.style.borderColor = sample.status === 'ALERT' ? '#c85a61' : sample.status === 'UNKNOWN' ? '#c5a65b' : '#1d7770';
  responseRing.style.boxShadow = sample.status === 'ALERT' ? '0 0 35px rgba(200,90,97,.22)' : '0 0 35px rgba(67,199,183,.1)';

  if (sample.status === 'ALERT') {
    exposureTitle.textContent = 'Exposure Response Detected';
    responseText.textContent = 'HIGH RESPONSE';
    responseText.style.color = '#ff8585';
    responseDesc.textContent = 'Prototype response crossed the experimental alert state. This is not a validated H₂S concentration.';
    systemStatus.textContent = 'ALERT';
    systemStatus.className = 'bad';
    statusNote.textContent = 'Active exposure response';
    statusNote.style.color = '#ff8585';
    alertCard.classList.add('active');
    alertTitle.textContent = 'H₂S Exposure Response Alert';
    alertMessage.textContent = `A wristband sample from Worker ${sample.worker_id} reported response index ${response}/100. The event has been logged.`;
    alertTime.textContent = time;
  } else if (sample.status === 'UNKNOWN') {
    exposureTitle.textContent = 'Uncertain Sample';
    responseText.textContent = 'UNKNOWN';
    responseText.style.color = '#d6bd6a';
    responseDesc.textContent = 'Signal is outside the current demo safe/alert interpretation. Experimental thresholding is still to be validated.';
    systemStatus.textContent = 'UNKNOWN';
    systemStatus.className = 'warn';
    statusNote.textContent = 'Sample requires validation';
    statusNote.style.color = '#d6bd6a';
    alertCard.classList.remove('active');
    alertTitle.textContent = 'Sample Requires Review';
    alertMessage.textContent = `Worker ${sample.worker_id} returned an uncertain prototype response of ${response}/100.`;
    alertTime.textContent = time;
  } else {
    exposureTitle.textContent = 'No Exposure Response Detected';
    responseText.textContent = 'NORMAL';
    responseText.style.color = '';
    responseDesc.textContent = 'Prototype response is currently in the demo safe state; no validated H₂S concentration is inferred.';
    systemStatus.textContent = 'SAFE';
    systemStatus.className = 'good';
    statusNote.textContent = 'No active exposure response';
    statusNote.style.color = '';
    alertCard.classList.remove('active');
    alertTitle.textContent = 'All Clear';
    alertMessage.textContent = 'The monitoring system received a sample without an active demo alert.';
    alertTime.textContent = time;
  }

  events.unshift(sample);
  events = events.slice(0, 100);
  saveEvents();
  eventCount.textContent = String(events.filter(e => e.status === 'ALERT').length).padStart(2, '0');
  renderHistory();
}

function renderHistory() {
  if (!events.length) {
    history.innerHTML = '<tr class="empty"><td colspan="6">No samples recorded yet.</td></tr>';
    return;
  }
  history.innerHTML = events.slice(0, 20).map(e => {
    const time = new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const cls = e.status.toLowerCase();
    return `<tr><td>${time}</td><td>${e.event_id}</td><td>${e.worker_id}</td><td>${e.response_index} / 100</td><td><span class="status-pill ${cls}">${e.status}</span></td><td>${e.source}</td></tr>`;
  }).join('');
}

function clearAlert() {
  const current = {
    event_id: 'AS-CLEAR', worker_id: workerId.textContent, wristband_id: wristbandId.textContent,
    response_index: 12, status: 'SAFE', source: 'MANUAL CLEAR', timestamp: new Date().toISOString()
  };
  applySample(current);
}

simulateBtn.addEventListener('click', () => applySample(randomSample()));
clearBtn.addEventListener('click', clearAlert);

async function connectWristband() {
  if (!navigator.bluetooth) {
    connectionText.textContent = 'Web Bluetooth is not available in this browser. Use Chrome or Edge on HTTPS, or use simulation mode.';
    return;
  }
  try {
    connectionText.textContent = 'Select your AIR SENTINAL wristband from the Bluetooth picker.';
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [SERVICE_UUID] }, { namePrefix: 'AIR-SENTINAL' }],
      optionalServices: [SERVICE_UUID]
    });
    device.addEventListener('gattserverdisconnected', () => {
      modeLabel.textContent = 'DEMO MODE';
      deviceBadge.textContent = 'DISCONNECTED';
      deviceBadge.className = 'badge demo';
      connectionText.textContent = 'Wristband disconnected. Simulation remains available.';
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', handleBluetoothData);
    modeLabel.textContent = 'BLUETOOTH LIVE';
    deviceBadge.textContent = 'CONNECTED';
    deviceBadge.className = 'badge connected';
    activeWorkers.textContent = '01';
    connectionText.textContent = `${device.name || 'AIR SENTINAL wristband'} connected. Waiting for sensor samples.`;
  } catch (error) {
    connectionText.textContent = `Connection cancelled or failed: ${error.message}`;
  }
}

function handleBluetoothData(event) {
  try {
    const text = new TextDecoder().decode(event.target.value);
    const data = JSON.parse(text);
    applySample(data);
  } catch (error) {
    connectionText.textContent = 'Received data was not valid JSON. Check the wristband firmware format.';
  }
}

connectBtn.addEventListener('click', connectWristband);
renderHistory();
eventCount.textContent = String(events.filter(e => e.status === 'ALERT').length).padStart(2, '0');
