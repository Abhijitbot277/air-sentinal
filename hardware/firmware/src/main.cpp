#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// AIR SENTINAL — ESP32-C3 wristband reference firmware
// IMPORTANT: this is prototype firmware. The response thresholds below are
// DEMO thresholds only and are NOT validated H₂S concentration limits.

#define SENSOR_PIN 0          // Replace with the ADC pin used by the prototype
#define STATUS_LED_PIN 8      // Replace if your board uses another LED pin
#define SAMPLE_INTERVAL_MS 5000

// DEMO-ONLY response-index states. Replace only after controlled validation.
#define SAFE_RESPONSE_MAX 39
#define ALERT_RESPONSE_MIN 70

static const char* WORKER_ID = "AS-024";
static const char* WRISTBAND_ID = "WB-024";
static const char* DEVICE_NAME = "AIR-SENTINAL-WB024";

static const char* SERVICE_UUID = "7b2a0001-6c4a-4d3b-9c1f-4153454e544c";
static const char* CHARACTERISTIC_UUID = "7b2a0002-6c4a-4d3b-9c1f-4153454e544c";

BLECharacteristic* sampleCharacteristic = nullptr;
unsigned long lastSample = 0;
unsigned long eventCounter = 0;

String classifyResponse(int responseIndex) {
  if (responseIndex <= SAFE_RESPONSE_MAX) return "SAFE";
  if (responseIndex >= ALERT_RESPONSE_MIN) return "ALERT";
  return "UNKNOWN";
}

int convertRawToResponse(int raw) {
  // Prototype signal normalization only.
  // The mapping must be replaced by a calibration curve from real measurements.
  return constrain(map(raw, 0, 4095, 0, 100), 0, 100);
}

String makeEvent(int raw, int responseIndex, const String& status) {
  eventCounter++;
  String eventId = String("AS-") + String(eventCounter);
  String timestamp = String(millis());

  String json = "{";
  json += "\"event_id\":\"" + eventId + "\",";
  json += "\"worker_id\":\"" + String(WORKER_ID) + "\",";
  json += "\"wristband_id\":\"" + String(WRISTBAND_ID) + "\",";
  json += "\"response_index\":" + String(responseIndex) + ",";
  json += "\"sensor_raw\":" + String(raw) + ",";
  json += "\"status\":\"" + status + "\",";
  json += "\"source\":\"WRISTBAND\",";
  json += "\"device_uptime_ms\":" + timestamp;
  json += "}";
  return json;
}

void updateLed(const String& status) {
  if (status == "ALERT") {
    digitalWrite(STATUS_LED_PIN, HIGH);
  } else if (status == "SAFE") {
    digitalWrite(STATUS_LED_PIN, LOW);
  } else {
    // UNKNOWN: short pulse
    digitalWrite(STATUS_LED_PIN, HIGH);
    delay(80);
    digitalWrite(STATUS_LED_PIN, LOW);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(STATUS_LED_PIN, OUTPUT);
  digitalWrite(STATUS_LED_PIN, LOW);
  analogReadResolution(12);

  BLEDevice::init(DEVICE_NAME);
  BLEServer* server = BLEDevice::createServer();
  BLEService* service = server->createService(SERVICE_UUID);

  sampleCharacteristic = service->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  sampleCharacteristic->addDescriptor(new BLE2902());
  sampleCharacteristic->setValue("{\"status\":\"READY\"}");

  service->start();

  BLEAdvertising* advertising = BLEDevice::getAdvertising();
  advertising->addServiceUUID(SERVICE_UUID);
  advertising->setScanResponse(true);
  BLEDevice::startAdvertising();

  Serial.println("AIR SENTINAL wristband ready");
  Serial.println("BLE name: " + String(DEVICE_NAME));
  Serial.println("Worker: " + String(WORKER_ID));
}

void loop() {
  if (millis() - lastSample < SAMPLE_INTERVAL_MS) return;
  lastSample = millis();

  const int raw = analogRead(SENSOR_PIN);
  const int responseIndex = convertRawToResponse(raw);
  const String status = classifyResponse(responseIndex);
  const String eventJson = makeEvent(raw, responseIndex, status);

  sampleCharacteristic->setValue(eventJson.c_str());
  sampleCharacteristic->notify();
  updateLed(status);

  Serial.println(eventJson);
}
