import axios from "axios";

const api = axios.create({
  baseURL: "https://ceejayx.app.n8n.cloud/webhook-test",
});

export default api;
