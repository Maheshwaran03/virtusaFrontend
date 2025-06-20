// Offline storage utility for delivery data
const STORAGE_KEYS = {
  DELIVERIES: 'dlvery_deliveries',
  LAST_SYNC: 'dlvery_last_sync',
  PENDING_UPDATES: 'dlvery_pending_updates'
};

export const offlineStorage = {
  // Save deliveries to localStorage
  saveDeliveries: (deliveries) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(deliveries));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Error saving deliveries to localStorage:', error);
      return false;
    }
  },

  // Get deliveries from localStorage
  getDeliveries: () => {
    try {
      const deliveries = localStorage.getItem(STORAGE_KEYS.DELIVERIES);
      return deliveries ? JSON.parse(deliveries) : [];
    } catch (error) {
      console.error('Error reading deliveries from localStorage:', error);
      return [];
    }
  },

  // Save pending updates (for when offline)
  savePendingUpdate: (update) => {
    try {
      const pending = this.getPendingUpdates();
      pending.push({
        ...update,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.PENDING_UPDATES, JSON.stringify(pending));
      return true;
    } catch (error) {
      console.error('Error saving pending update:', error);
      return false;
    }
  },

  // Get pending updates
  getPendingUpdates: () => {
    try {
      const updates = localStorage.getItem(STORAGE_KEYS.PENDING_UPDATES);
      return updates ? JSON.parse(updates) : [];
    } catch (error) {
      console.error('Error reading pending updates:', error);
      return [];
    }
  },

  // Clear pending updates after successful sync
  clearPendingUpdates: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PENDING_UPDATES);
      return true;
    } catch (error) {
      console.error('Error clearing pending updates:', error);
      return false;
    }
  },

  // Check if data is stale (older than 1 hour)
  isDataStale: () => {
    try {
      const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      if (!lastSync) return true;
      
      const lastSyncDate = new Date(lastSync);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return lastSyncDate < oneHourAgo;
    } catch (error) {
      console.error('Error checking data staleness:', error);
      return true;
    }
  },

  // Check if offline storage is available
  isAvailable: () => {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
};

export default offlineStorage; 