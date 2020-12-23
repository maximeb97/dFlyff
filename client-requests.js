class ClientRequests {
  constructor() {
    this.requests = {};
    this.timestamps = {};

    setInterval(() => {
      Object.entries(this.timestamps).map(([index, startedAt]) => {
        let now = new Date();
        let seconds = (now.getTime() - startedAt.getTime()) / 1000;
        if (seconds > 300) {
          this.deleteRequest(index);
        }
      });
    }, 1000);
  }

  getRequest(id) {
    return this.requests[id];
  }

  setRequest(id, data) {
    this.requests[id] = data;
    this.timestamps[id] = new Date();
  }

  deleteRequest(id) {
    if (this.getRequest(id)) {
      delete this.timestamps[id];
      delete this.requests[id];
    }
  }
}

export default new ClientRequests();
