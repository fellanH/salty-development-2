import axios from 'axios';
import { BeachData, POIData } from '@/lib/types';
import { apiConfig } from '@/lib/config/api';

class DataService {
  private baseURL: string;

  constructor() {
    this.baseURL = typeof window !== 'undefined' ? '' : apiConfig.BASE_URL;
  }

  /**
   * Fetch all beaches from the API
   */
  async fetchBeaches(): Promise<BeachData[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/beaches`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to fetch beaches');
      }
    } catch (error) {
      console.error('Error fetching beaches:', error);
      throw error;
    }
  }

  /**
   * Fetch a single beach by ID
   */
  async fetchBeach(id: string): Promise<BeachData> {
    try {
      const response = await axios.get(`${this.baseURL}/api/beaches?id=${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(`Failed to fetch beach with ID: ${id}`);
      }
    } catch (error) {
      console.error(`Error fetching beach ${id}:`, error);
      throw error;
    }
  }

  /**
   * Fetch all POIs from the API
   */
  async fetchPOIs(): Promise<POIData[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/pois`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to fetch POIs');
      }
    } catch (error) {
      console.error('Error fetching POIs:', error);
      throw error;
    }
  }

  /**
   * Fetch a single POI by ID
   */
  async fetchPOI(id: string): Promise<POIData> {
    try {
      const response = await axios.get(`${this.baseURL}/api/pois?id=${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(`Failed to fetch POI with ID: ${id}`);
      }
    } catch (error) {
      console.error(`Error fetching POI ${id}:`, error);
      throw error;
    }
  }

  /**
   * Initialize data by fetching all beaches and POIs
   */
  async initializeData(): Promise<{ beaches: BeachData[]; pois: POIData[] }> {
    try {
      console.log('🔄 Initializing data...');
      
      const [beaches, pois] = await Promise.all([
        this.fetchBeaches(),
        this.fetchPOIs()
      ]);

      console.log(`✅ Data initialized: ${beaches.length} beaches, ${pois.length} POIs`);
      
      return { beaches, pois };
    } catch (error) {
      console.error('❌ Failed to initialize data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const dataService = new DataService();
export default dataService;