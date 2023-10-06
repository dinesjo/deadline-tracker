class Settings {
  constructor({ showCalendar, darkMode, region }) {
    this.showCalendar = showCalendar || true;
    this.darkMode = darkMode || true;
    this.region = region || "en-US";
  }
}

export default Settings;