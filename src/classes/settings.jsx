class Settings {
  constructor({ view, region, calendarFirstDay }) {
    this.view = view || "list calendar";
    this.region = region || "en-US";
    this.calendarFirstDay = calendarFirstDay || 0;
  }
}

export default Settings;
