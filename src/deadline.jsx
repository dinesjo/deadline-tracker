class Deadline {
  constructor({ title, details, date, type, course, status, id }) {
    this.title = title || "";
    this.details = details || "";
    this.date = date || new Date().toISOString().slice(0, 10);
    this.type = type || null;
    this.course = course || null;
    this.status = status || "Not Started";
    this.id = id || crypto.randomUUID();
  }
}

export default Deadline;
