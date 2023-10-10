class Settings {
  constructor({ showCalendar, region }) {
    this.showCalendar = showCalendar || true;
    this.region = region || "en-US";
  }
}

export default Settings;
