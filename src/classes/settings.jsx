class Settings {
  constructor({ showCalendar, showList, region }) {
    this.showCalendar = showCalendar || true;
    this.showList = showList || true;
    this.region = region || "en-US";
  }
}

export default Settings;
