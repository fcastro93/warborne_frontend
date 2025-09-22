const API_BASE_URL = 'https://violenceguild.duckdns.org/api';

export const apiService = {
  async getGuildStats() {
    const response = await fetch(`${API_BASE_URL}/stats/`);
    return response.json();
  },

  async getGuildMembers() {
    const response = await fetch(`${API_BASE_URL}/members/`);
    return response.json();
  },

  async getRecentEvents() {
    const response = await fetch(`${API_BASE_URL}/events/`);
    return response.json();
  },

  async getGearOverview() {
    const response = await fetch(`${API_BASE_URL}/gear/`);
    return response.json();
  },

  async getRecommendedBuilds() {
    const response = await fetch(`${API_BASE_URL}/builds/`);
    return response.json();
  }
};
