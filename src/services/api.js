const API_BASE_URL = 'https://violenceguild.duckdns.org/api';

// Helper function to get CSRF token from cookies
const getCSRFToken = () => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  return getCookie('csrftoken');
};

export const apiService = {
  async getGuildStats() {
    const response = await fetch(`${API_BASE_URL}/stats/`);
    return response.json();
  },

  async getGuildMembers() {
    const response = await fetch(`${API_BASE_URL}/members/`);
    return response.json();
  },

  async getDiscordPresence(discordUserIds) {
    const response = await fetch(`${API_BASE_URL}/discord/presence/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_ids: discordUserIds }),
    });
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

  // Build management API methods
  async equipItemToBuild(buildId, itemId, slotType) {
    const response = await fetch(`${API_BASE_URL}/builds/${buildId}/equip-item/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      body: JSON.stringify({
        item_id: itemId,
        slot_type: slotType
      }),
    });
    return response.json();
  },

  async unequipItemFromBuild(buildId, slotType) {
    const response = await fetch(`${API_BASE_URL}/builds/${buildId}/unequip-item/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      body: JSON.stringify({
        slot_type: slotType
      }),
    });
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
    const response = await fetch(`${API_BASE_URL}/gear-items/`);
    const data = await response.json();
    return data.gear_items || [];
  },

  async getAllDrifters() {
    const response = await fetch(`${API_BASE_URL}/drifters/`);
    return response.json();
  },

  async updatePlayerDrifter(playerId, drifterId, drifterSlot) {
    const csrfToken = getCSRFToken();
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/update-drifter/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        drifter_id: drifterId,
        drifter_slot: drifterSlot,
      }),
    });
    return response.json();
  },

  async getPlayerEquippedGear(playerId) {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/equipped-gear/`);
    return response.json();
  },

  async equipGear(playerId, gearId, drifterNum, slotType) {
    const csrfToken = getCSRFToken();
    
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/equip-gear/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({
        gear_id: gearId,
        drifter_num: drifterNum,
        slot_type: slotType,
      }),
    });
    return response.json();
  },

  async unequipGear(playerId, gearId) {
    const csrfToken = getCSRFToken();
    
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/unequip-gear/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({
        gear_id: gearId,
      }),
    });
    return response.json();
  }
};
