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
  },

  // Player Loadout API methods
  async getPlayer(playerId) {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/`);
    return response.json();
  },

  async getPlayerDrifters(playerId) {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/drifters/`);
    return response.json();
  },

  async getGearItems() {
    const response = await fetch(`${API_BASE_URL}/gear/`);
    const data = await response.json();
    return data.gear_items || [];
  },

  async getPlayerEquippedGear(playerId) {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/equipped-gear/`);
    return response.json();
  },

  async equipGear(playerId, gearId, drifterNum, slotType) {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/equip-gear/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gear_id: gearId,
        drifter_num: drifterNum,
        slot_type: slotType,
      }),
    });
    return response.json();
  },

  async unequipGear(playerId, gearId) {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/unequip-gear/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gear_id: gearId,
      }),
    });
    return response.json();
  }
};
