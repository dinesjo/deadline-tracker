class Settings {
  constructor({ view = "list calendar", region = "en-US", calendarFirstDay = 0 }) {
    this.view = view;
    this.region = region;
    this.calendarFirstDay = calendarFirstDay;
  }
}

export default Settings;
