const clock = document.getElementById('clock');
const connectBtn = document.getElementById('connectBtn');
const simulateBtn = document.getElementById('simulateBtn');
const clearBtn = document.getElementById('clearBtn');
const connectionText = document.getElementById('connectionText');
const modeLabel = document.getElementById('modeLabel');
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
const sampleIdEl = document.getElementById('sampleId');
const sampleTime = document.getElementById('sampleTime');
const rawSensorValue = document.getElementById('rawSensorValue');
const workerId = document.getElementById('workerId');
const workerIdTitle = document.getElementById('workerIdTitle');
const healthWorker = document.getElementById('healthWorker');
const wristbandId = document.getElementById('wristbandId');
const deviceBadge = document.getElementById('deviceBadge');
const activeWorkers = document.getElementById('activeWorkers');
const attendanceState = document.getElementById('attendanceState');
const attendanceValue = document.getElementById('attendanceValue');
const healthAttendance = document.getElementById('healthAttendance');
const entryTimeEl = document.getElementById('entryTime');
const exitTimeEl = document.getElementById('exitTime');
const durationValue = document.getElementById('durationValue');
const durationStat = document.getElementById('durationStat');
const healthDuration = document.getElementById('healthDuration');
const shiftBadge = document.getElementById('shiftBadge');
const attendanceHistory = document.getElementById('attendanceHistory');

const SERVICE_UUID = '7b2a0001-6c4a-4d3b-9c1f-4153454e544c';
const CHARACTERISTIC_UUID = '7b2a0002-6c4a-4d3b-9c1f-4153454e544c';
const DB_KEY = 'airSentinalSamplesV1';
const ATTENDANCE_KEY = 'airSentinalAttendanceV1';
const SHIFT_KEY = 'airSentinalCurrentShiftV1';
let characteristic = null;
let events = loadEvents();
let attendanceRecords = loadAttendance();
let shift = loadShift();

function now() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
function updateClock() { clock.textContent = now(); updateDuration(); }
setInterval(updateClock, 1000);
updateClock();

function loadEvents() { try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); } catch { return []; } }
function saveEvents() { localStorage.setItem(DB_KEY, JSON.stringify(events.slice(0, 100))); }
function loadAttendance() { try { return JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '[]'); } catch { return []; } }
function saveAttendance() { localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendanceRecords.slice(0, 100))); }
function loadShift() { try { return JSON.parse(localStorage.getItem(SHIFT_KEY) || 'null'); } catch { return null; } }
function saveShift() { if (shift) localStorage.setItem(SHIFT_KEY, JSON.stringify(shift)); else localStorage.removeItem(SHIFT_KEY); }
function formatDuration(ms) { if (!Number.isFinite(ms) || ms < 0) ms = 0; const s = Math.floor(ms / 1000); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60; return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':'); }
function formatDateTime(iso) { return iso ? new Date(iso).toLocaleString([], { year:'numeric', month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' }) : 'Not recorded'; }
function formatTime(iso) { return iso ? new Date(iso).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' }) : 'Not recorded'; }

function updateDuration() {
  if (!shift) { durationValue.textContent='00:00:00'; durationStat.textContent='00:00:00'; healthDuration.textContent='00:00:00'; return; }
  const end = shift.exit ? new Date(shift.exit).getTime() : Date.now();
  const duration = formatDuration(end - new Date(shift.entry).getTime());
  durationValue.textContent=duration; durationStat.textContent=duration; healthDuration.textContent=duration;
}

function updateShiftUI() {
  if (!shift) {
    entryTimeEl.textContent='Not recorded'; exitTimeEl.textContent='Not recorded'; shiftBadge.textContent='NO ENTRY'; shiftBadge.className='badge demo';
    attendanceValue.textContent='ABSENT'; attendanceValue.className='warn-text'; healthAttendance.textContent='ABSENT'; healthAttendance.className='warn-text'; attendanceState.textContent='No active entry'; activeWorkers.textContent='00';
  } else if (!shift.exit) {
    entryTimeEl.textContent=formatDateTime(shift.entry); exitTimeEl.textContent='Not recorded'; shiftBadge.textContent='IN PROGRESS'; shiftBadge.className='badge connected';
    attendanceValue.textContent='PRESENT'; attendanceValue.className='good'; healthAttendance.textContent='PRESENT'; healthAttendance.className='good'; attendanceState.textContent='Worker is inside'; activeWorkers.textContent='01';
  } else {
    entryTimeEl.textContent=formatDateTime(shift.entry); exitTimeEl.textContent=formatDateTime(shift.exit); shiftBadge.textContent='SHIFT COMPLETE'; shiftBadge.className='badge demo';
    attendanceValue.textContent='EXITED'; attendanceValue.className=''; healthAttendance.textContent='EXITED'; healthAttendance.className=''; attendanceState.textContent='Worker has exited'; activeWorkers.textContent='00';
  }
  updateDuration();
}

function recordEntry(source='MANUAL') {
  if (shift && !shift.exit) { connectionText.textContent='Worker already has an active entry. Record exit before starting another shift.'; return; }
  shift={worker_id:workerId.textContent,wristband_id:wristbandId.textContent,entry:new Date().toISOString(),exit:null,source}; saveShift(); updateShiftUI();
  connectionText.textContent=`Entry recorded for ${shift.worker_id}. Duration is now running.`;
}
function recordExit(source='MANUAL') {
  if (!shift || shift.exit) { connectionText.textContent='No active worker entry is available to record an exit.'; return; }
  shift.exit=new Date().toISOString(); const duration=formatDuration(new Date(shift.exit).getTime()-new Date(shift.entry).getTime());
  attendanceRecords.unshift({worker_id:shift.worker_id,wristband_id:shift.wristband_id,entry:shift.entry,exit:shift.exit,duration,source}); saveAttendance(); saveShift(); updateShiftUI(); renderAttendanceHistory();
  connectionText.textContent=`Exit recorded for ${shift.worker_id}. Total duration: ${duration}.`;
}
function resetShift() { shift=null; saveShift(); updateShiftUI(); connectionText.textContent='Current entry/exit session reset. Ready for the next worker entry.'; }

document.getElementById('entryBtn').addEventListener('click',()=>recordEntry());
document.getElementById('exitBtn').addEventListener('click',()=>recordExit());
document.getElementById('resetShiftBtn').addEventListener('click',resetShift);

function randomSample() {
  const response=Math.floor(18+Math.random()*78);
  const raw=Math.round(response*4095/100);
  return {event_id:`AS-${Date.now().toString().slice(-6)}`,worker_id:workerId.textContent||'AS-024',wristband_id:wristbandId.textContent||'WB-024',response_index:response,sensor_raw:raw,status:response>=70?'ALERT':response>=40?'UNKNOWN':'SAFE',source:'SIMULATED',timestamp:new Date().toISOString()};
}
function normaliseSample(data) {
  const response=Math.max(0,Math.min(100,Number(data.response_index??data.response??0)));
  const status=String(data.status||(response>=70?'ALERT':response>=40?'UNKNOWN':'SAFE')).toUpperCase();
  const raw=Number.isFinite(Number(data.sensor_raw))?Number(data.sensor_raw):Math.round(response*4095/100);
  return {event_id:data.event_id||`AS-${Date.now().toString().slice(-6)}`,worker_id:data.worker_id||'AS-024',wristband_id:data.wristband_id||'WB-024',response_index:Math.round(response),sensor_raw:raw,status:['SAFE','ALERT','UNKNOWN'].includes(status)?status:'UNKNOWN',source:data.source||'WRISTBAND',timestamp:data.timestamp||new Date().toISOString()};
}

function applySample(raw) {
  const sample=normaliseSample(raw),time=formatTime(sample.timestamp),response=sample.response_index;
  workerId.textContent=sample.worker_id; workerIdTitle.textContent=sample.worker_id; healthWorker.textContent=sample.worker_id; wristbandId.textContent=sample.wristband_id; alertWorker.textContent=sample.worker_id; sampleIdEl.textContent=sample.event_id; sampleTime.textContent=time; if(rawSensorValue) rawSensorValue.textContent=String(sample.sensor_raw);
  lastSync.textContent='Just now';
  exposureCard.classList.toggle('alert-mode',sample.status==='ALERT'); signal.className=`signal ${sample.status.toLowerCase()}`; signal.textContent=sample.status; responseValue.textContent=response; responseRing.style.borderColor=sample.status==='ALERT'?'#c85a61':sample.status==='UNKNOWN'?'#c5a65b':'#1d7770';
  if(sample.status==='ALERT') {
    exposureTitle.textContent='Exposure Response Detected'; responseText.textContent='HIGH SENSOR RESPONSE'; responseText.style.color='#ff8585'; responseDesc.textContent=`Normalized sensor response ${response}/100 from raw ADC signal ${sample.sensor_raw}/4095. This is not a distance measurement and not a validated H₂S concentration.`;
    systemStatus.textContent='ALERT'; systemStatus.className='bad'; statusNote.textContent='Active sensor-response alert'; statusNote.style.color='#ff8585'; alertCard.classList.add('active'); alertTitle.textContent='H₂S Exposure Response Alert'; alertMessage.textContent=`Worker ${sample.worker_id}: sensor response ${response}/100 (raw ADC ${sample.sensor_raw}/4095). Event logged for review.`; alertTime.textContent=time;
  } else if(sample.status==='UNKNOWN') {
    exposureTitle.textContent='Uncertain Sensor Response'; responseText.textContent='REQUIRES VALIDATION'; responseText.style.color='#d6bd6a'; responseDesc.textContent=`Normalized sensor response ${response}/100 from raw ADC signal ${sample.sensor_raw}/4095. Thresholds require experimental calibration before ppm interpretation.`;
    systemStatus.textContent='UNKNOWN'; systemStatus.className='warn'; statusNote.textContent='Calibration / validation required'; statusNote.style.color='#d6bd6a'; alertCard.classList.remove('active'); alertTitle.textContent='Sample Requires Review'; alertMessage.textContent=`Worker ${sample.worker_id}: normalized sensor response ${response}/100. No ppm value is claimed.`; alertTime.textContent=time;
  } else {
    exposureTitle.textContent='Normal Sensor Response'; responseText.textContent='NORMAL'; responseText.style.color=''; responseDesc.textContent=`Normalized sensor response ${response}/100 from raw ADC signal ${sample.sensor_raw}/4095. The score is for prototype comparison; it is not distance or ppm.`;
    systemStatus.textContent='SAFE'; systemStatus.className='good'; statusNote.textContent='No active sensor-response alert'; statusNote.style.color=''; alertCard.classList.remove('active'); alertTitle.textContent='All Clear'; alertMessage.textContent='The monitoring system received a sample in the demo safe state.'; alertTime.textContent=time;
  }
  events.unshift(sample); events=events.slice(0,100); saveEvents(); eventCount.textContent=String(events.filter(e=>e.status==='ALERT').length).padStart(2,'0'); renderHistory();
}
function renderHistory(){
  if(!events.length){history.innerHTML='<tr class="empty"><td colspan="6">No samples recorded yet.</td></tr>';return;}
  history.innerHTML=events.slice(0,20).map(e=>`<tr><td>${formatTime(e.timestamp)}</td><td>${e.event_id}</td><td>${e.worker_id}</td><td>${e.response_index} / 100</td><td><span class="status-pill ${e.status.toLowerCase()}">${e.status}</span></td><td>${e.source}</td></tr>`).join('');
}
function renderAttendanceHistory(){
  if(!attendanceRecords.length){attendanceHistory.innerHTML='<tr class="empty"><td colspan="6">No completed attendance records yet.</td></tr>';return;}
  attendanceHistory.innerHTML=attendanceRecords.slice(0,20).map(r=>`<tr><td>${r.worker_id}</td><td>${r.wristband_id}</td><td>${formatDateTime(r.entry)}</td><td>${formatDateTime(r.exit)}</td><td>${r.duration}</td><td><span class="status-pill safe">${r.source||'RECORDED'}</span></td></tr>`).join('');
}
function clearAlert(){ applySample({event_id:'AS-CLEAR',worker_id:workerId.textContent,wristband_id:wristbandId.textContent,response_index:12,sensor_raw:491,status:'SAFE',source:'MANUAL CLEAR',timestamp:new Date().toISOString()}); }
simulateBtn.addEventListener('click',()=>applySample(randomSample())); clearBtn.addEventListener('click',clearAlert);

async function connectWristband(){
  if(!navigator.bluetooth){connectionText.textContent='Web Bluetooth is not available in this browser. Use Chrome or Edge on HTTPS, or use simulation mode.';return;}
  try{
    connectionText.textContent='Select your AIR SENTINAL wristband from the Bluetooth picker.';
    const device=await navigator.bluetooth.requestDevice({filters:[{services:[SERVICE_UUID]},{namePrefix:'AIR-SENTINEL'}],optionalServices:[SERVICE_UUID]});
    device.addEventListener('gattserverdisconnected',()=>{modeLabel.textContent='DEMO MODE';deviceBadge.textContent='DISCONNECTED';deviceBadge.className='badge demo';connectionText.textContent='Wristband disconnected. Simulation remains available.';});
    const server=await device.gatt.connect(); const service=await server.getPrimaryService(SERVICE_UUID); characteristic=await service.getCharacteristic(CHARACTERISTIC_UUID); await characteristic.startNotifications(); characteristic.addEventListener('characteristicvaluechanged',handleBluetoothData);
    modeLabel.textContent='BLUETOOTH LIVE'; deviceBadge.textContent='CONNECTED'; deviceBadge.className='badge connected'; connectionText.textContent=`${device.name||'AIR SENTINAL wristband'} connected. Waiting for sensor samples.`;
  }catch(error){connectionText.textContent=`Connection cancelled or failed: ${error.message}`;}
}
function handleBluetoothData(event){
  try{const data=JSON.parse(new TextDecoder().decode(event.target.value)); if(data.event_type==='ENTRY'){recordEntry('WRISTBAND');return;} if(data.event_type==='EXIT'){recordExit('WRISTBAND');return;} applySample(data);}catch(error){connectionText.textContent='Received data was not valid JSON. Check the wristband firmware format.';}
}
connectBtn.addEventListener('click',connectWristband);
renderHistory(); renderAttendanceHistory(); updateShiftUI(); eventCount.textContent=String(events.filter(e=>e.status==='ALERT').length).padStart(2,'0');
