const clock = document.getElementById('clock');
const simulateBtn = document.getElementById('simulateBtn');
const clearBtn = document.getElementById('clearBtn');
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
const eventCount = document.getElementById('eventCount');
const statusNote = document.getElementById('statusNote');
const history = document.getElementById('history');
const lastSync = document.getElementById('lastSync');

let events = 0;

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function updateClock() {
  clock.textContent = now();
}
setInterval(updateClock, 1000);
updateClock();

simulateBtn.addEventListener('click', () => {
  events += 1;
  const time = now();
  const response = 82;

  exposureCard.classList.add('alert-mode');
  exposureTitle.textContent = 'Exposure Response Detected';
  signal.textContent = 'ALERT';
  signal.classList.add('alert');
  responseRing.style.borderColor = '#c85a61';
  responseRing.style.boxShadow = '0 0 35px rgba(200,90,97,.22)';
  responseValue.textContent = response;
  responseText.textContent = 'HIGH RESPONSE';
  responseText.style.color = '#ff8585';
  responseDesc.textContent = 'Simulated colorimetric exposure event for demonstration.';

  alertCard.classList.add('active');
  alertTitle.textContent = 'H₂S Exposure Alert';
  alertMessage.textContent = 'A simulated exposure response has been detected for Worker AS-024. The event has been logged for monitoring.';
  alertTime.textContent = time;
  statusNote.textContent = 'Active exposure alert';
  statusNote.style.color = '#ff8585';
  eventCount.textContent = String(events).padStart(2, '0');
  lastSync.textContent = 'Just now';

  if (history.querySelector('.empty')) history.innerHTML = '';
  const row = document.createElement('tr');
  row.innerHTML = `<td>${time}</td><td>AS-024</td><td>H₂S exposure response</td><td>82 / 100</td><td><span class="status-pill">ALERT</span></td>`;
  history.prepend(row);
});

clearBtn.addEventListener('click', () => {
  exposureCard.classList.remove('alert-mode');
  exposureTitle.textContent = 'No Exposure Detected';
  signal.textContent = 'SAFE';
  signal.classList.remove('alert');
  responseRing.style.borderColor = '#1d7770';
  responseRing.style.boxShadow = '0 0 35px rgba(67,199,183,.1)';
  responseValue.textContent = '12';
  responseText.textContent = 'NORMAL';
  responseText.style.color = '';
  responseDesc.textContent = 'No simulated exposure event is active.';

  alertCard.classList.remove('active');
  alertTitle.textContent = 'All Clear';
  alertMessage.textContent = 'The monitoring system is ready. Simulated events will appear here.';
  alertTime.textContent = 'No active event';
  statusNote.textContent = 'No active exposure alert';
  statusNote.style.color = '';
});
