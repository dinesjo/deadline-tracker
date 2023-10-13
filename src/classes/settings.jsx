class Settings {
  constructor({ view, region }) {
    this.view = view || "list calendar";
    this.region = region || "en-US";
  }
}

export default Settings;
