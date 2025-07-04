import { AppState } from "../appState.js";
import { apiConfig } from "../config/api.js";

export const DetailView = {
  init() {
    // This view doesn't need a specific init at the moment,
    // but it's here for consistency and future use.
  },

  /**
   * Update detail sidebar with current selection using a declarative rendering pattern.
   */
  async updateDetailSidebar() {
    const { id } = AppState.getCurrentSelection();
    const viewContainer = AppState.getUICachedElement("SIDEBAR_BEACH");

    console.log(`[DEBUG-DetailView] Updating sidebar for ID: ${id}`);
    const cache = AppState.getState().cache.beachData;
    console.log(`[DEBUG-DetailView] Cache has ${cache.size} items. Cache keys:`, Array.from(cache.keys()));

    if (!id || !viewContainer) {
      return;
    }

    const details = AppState.getBeachById(id);
    if (!details) {
      console.error(`[DetailView] Could not find beach with ID ${id} in cache.`);
      return;
    }

    console.log('[DEBUG-DetailView] Details object from cache:', details);

    const viewData = {
      imageUrl: details["main-image"]?.url || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300",
      name: details.name || "Beach Name",
      googleMapsUrl: details["google-maps-link"] || "#",
      address: details["formatted-address"] || details["formatted-adress"] || "Google Maps Link",
      websiteUrl: details["beach-website"],
      websiteHost: details["beach-website"] && details["beach-website"].startsWith("http") ? new URL(details["beach-website"]).hostname : "",
      phone: details.phone || "N/A",
      restrooms: details.restrooms || "N/A",
      showers: details.showers || "N/A",
      pets: details["pets-allowed"] || "N/A",
      parking: details["parking-lot-nearby"] || "N/A",
      parkingHours: details["parking-hours"] || "N/A",
      camping: details["camping-offered"] || "N/A",
      bonfire: details["bonfire-availabiliity"] || "N/A",
      fishing: details.fishing || "N/A",
      pier: details.pier || "N/A",
      picnic: details["picnic-area-rentals"] || "N/A",
      surfing: details["surfing-beach"] || "N/A",
      recreation: details["recreation-activities"] || "N/A",
      airTemp: details.temperature ? `${Math.round(details.temperature)}` : "",
      feelsLike: details.feels_like ? `${Math.round(details.feels_like)}°F` : "N/A",
      humidity: details.humidity ? `${details.humidity}%` : "N/A",
      wind: details.windSpeed ? `${details.windSpeed} mph` : "N/A",
      windDirection: details.windDirection ? `${details.windDirection}°` : "N/A",
      aqi: details.aqi ?? "N/A",
      rainfall: details.rainfall ? `${details.rainfall} in` : "N/A",
      pressure: details.pressure ? `${details.pressure} inHg` : "N/A",
      pm25: details.pm25 ? `${details.pm25} µg/m³` : "N/A",
      pm10: details.pm10 ? `${details.pm10} µg/m³` : "N/A",
      waterTemp: details.water_temp ? `${Math.round(details.water_temp)}°F` : "N/A",
      waveHeight: details.wave_height ? `${details.wave_height} ft` : "N/A",
      oceanCurrent: details.ocean_current ?? "N/A",
      uvIndex: details.uv_index ?? "N/A",
      cloudCover: details.cloud_cover ? `${details.cloud_cover}%` : "N/A",
      sunset: details.sunset ? new Date(details.sunset).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A",
    };

    const dataToAttributeMap = {
      imageUrl: "image",
      name: "title",
      googleMapsUrl: "address-link",
      address: "address-text",
      websiteUrl: "website-link",
      websiteHost: "website-text",
      phone: "phone",
      restrooms: "restrooms",
      showers: "showers",
      pets: "pets",
      parking: "parking",
      parkingHours: "parking-hours",
      camping: "camping",
      bonfire: "bonfire",
      fishing: "fishing",
      pier: "pier",
      picnic: "picnic",
      surfing: "surfing",
      recreation: "recreation",
      airTemp: "air-temp",
      feelsLike: "feels-like",
      humidity: "humidity",
      wind: "wind",
      windDirection: "wind-direction",
      aqi: "aqi",
      rainfall: "rainfall",
      pressure: "pressure",
      pm25: "pm25",
      pm10: "pm10",
      waterTemp: "water-temp",
      waveHeight: "wave-height",
      oceanCurrent: "ocean-current",
      uvIndex: "uv-index",
      cloudCover: "cloud-cover",
      sunset: "sunset",
    };

    for (const key in dataToAttributeMap) {
      if (Object.prototype.hasOwnProperty.call(viewData, key)) {
        const attributeValue = dataToAttributeMap[key];
        const element = viewContainer.querySelector(`[beach-data="${attributeValue}"]`);
        const value = viewData[key];

        if (element) {
          if (element.tagName === "A") {
            element.href = value;
          } else if (element.tagName === "IMG") {
            element.src = value;
            element.alt = viewData.name;
          } else {
            element.textContent = value;
          }
        }
      }
    }

    const websiteLinkWrapper = viewContainer.querySelector('[data-bind-parent="websiteUrl"]');
    if (websiteLinkWrapper) {
      websiteLinkWrapper.style.display = viewData.websiteUrl ? "flex" : "none";
    }
  },

  /**
   * Fetch weather data with caching
   * @param {string} locationId - Location ID
   * @returns {Promise} Weather data
   */
  async fetchWeatherData(locationId) {
    const cachedData = AppState.getState().cache.weatherData.get(locationId);
    if (cachedData) {
      console.log("[DetailView] fetchWeatherData cache hit", locationId);
      return cachedData;
    }

    try {
      const response = await fetch(`${apiConfig.BASE_URL}/api/weather/${locationId}`);
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      const data = await response.json();
      console.log("[DetailView] fetchWeatherData fetched", data);
      AppState.dispatch({ type: "SET_WEATHER_DATA", payload: { id: locationId, data } });
      setTimeout(() => {
        AppState.dispatch({ type: "DELETE_WEATHER_DATA", payload: { id: locationId } });
      }, 5 * 60 * 1000); // 5 minute cache

      return data;
    } catch (error) {
      console.error('[DetailView] Error fetching weather data:', error);
      return null;
    }
  },
}; 