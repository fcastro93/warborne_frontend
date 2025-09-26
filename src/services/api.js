const API_BASE_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : '/api';

// Helper function to get CSRF token from cookies
const getCSRFToken = () => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  return getCookie('csrftoken');
};

// Helper function to get authentication headers
const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCSRFToken()
  };
  
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  return headers;
};

export const apiService = {
  async getGuildStats() {
    const response = await fetch(`${API_BASE_URL}/stats/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return response.json();
  },

  async getGuildMembers() {
    const response = await fetch(`${API_BASE_URL}/members/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return response.json();
  },

  async getDiscordPresence(discordUserIds) {
    const response = await fetch(`${API_BASE_URL}/discord/presence/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ user_ids: discordUserIds }),
    });
    return response.json();
  },

  async getRecentEvents() {
    const response = await fetch(`${API_BASE_URL}/events/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return response.json();
  },

  async getGearOverview() {
    const response = await fetch(`${API_BASE_URL}/gear/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return response.json();
  },

  async getRecommendedBuilds() {
    const response = await fetch(`${API_BASE_URL}/builds/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return response.json();
  },

  // Player Loadout API methods
  async getPlayer(playerId) {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return response.json();
  },

  async getPlayerDrifters(playerId) {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/drifters/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return response.json();
  },

  async getGearItems() {
    const response = await fetch(`${API_BASE_URL}/gear-items/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    const data = await response.json();
    return data.gear_items || [];
  },

  async getAllDrifters() {
    const response = await fetch(`${API_BASE_URL}/drifters/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return response.json();
  },

  async getGearPowerAnalytics() {
    const response = await fetch(`${API_BASE_URL}/analytics/gear-power/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return response.json();
  },

  async getRoleAnalytics() {
    const response = await fetch(`${API_BASE_URL}/analytics/role-distribution/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return response.json();
  },

  async getEventParticipationAnalytics() {
    const response = await fetch(`${API_BASE_URL}/analytics/event-participation/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return response.json();
  },

  async updatePlayerDrifter(playerId, drifterId, drifterSlot) {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/update-drifter/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        drifter_id: drifterId,
        drifter_slot: drifterSlot,
      }),
    });
    return response.json();
  },

  async getPlayerEquippedGear(playerId) {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/equipped-gear/`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return response.json();
  },

  async equipGear(playerId, gearId, drifterNum, slotType, tier = 'II', itemLevel = 30) {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/equip-gear/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        gear_id: gearId,
        drifter_num: drifterNum,
        slot_type: slotType,
        tier: tier,
        item_level: itemLevel,
      }),
    });
    return response.json();
  },

  async unequipGear(playerId, gearId) {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/unequip-gear/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        gear_id: gearId,
      }),
    });
    return response.json();
  }
};
