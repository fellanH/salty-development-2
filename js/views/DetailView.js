import { AppState } from "../appState.js";
import { MockAPI } from "../mockAPI.js";

export const DetailView = {
  init() {
    // This view doesn't need a specific init at the moment,
    // but it's here for consistency and future use.
  },

  /**
   * Update detail sidebar with current selection using a declarative rendering pattern.
   */
  async updateDetailSidebar() {
    console.log(
      "[DetailView] updateDetailSidebar",
      AppState.getCurrentSelection()
    );
    const { id, feature } = AppState.getCurrentSelection();
    const viewContainer = AppState.getUICachedElement("SIDEBAR_BEACH");

    if (!id || !feature || !viewContainer) {
      // Note: The parent controller should handle the fallback logic.
      // This view is only responsible for rendering.
      return;
    }

    const details = feature.properties;
    let weatherData = null;
    try {
      weatherData = await this.fetchWeatherData(id);
      console.log("[DetailView] Fetched weather data:", weatherData);
    } catch (error) {
      console.error("[DetailView] Error fetching weather data:", error);
    }

    const viewData = {
      imageUrl: details["Main Image"] || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300",
      name: details.Name || "Beach Name",
      googleMapsUrl: details["Google Maps Link"] || "#",
      address: details["Formatted Address"] || details["Formatted Adress"] || "Google Maps Link",
      websiteUrl: details["Beach website"],
      websiteHost: details["Beach website"] && details["Beach website"].startsWith("http") ? new URL(details["Beach website"]).hostname : "",
      phone: details.Phone || "N/A",
      restrooms: details.Restrooms || "N/A",
      showers: details.Showers || "N/A",
      pets: details["Pets allowed"] || "N/A",
      parking: details["Parking lot nearby"] || "N/A",
      parkingHours: details["Parking hours"] || "N/A",
      camping: details["Camping offered"] || "N/A",
      bonfire: details["Bonfire availabiliity"] || "N/A",
      fishing: details.Fishing || "N/A",
      pier: details.Pier || "N/A",
      picnic: details["Picnic area/rentals"] || "N/A",
      surfing: details["Surfing beach"] || "N/A",
      recreation: details["Recreation activities"] || "N/A",
      airTemp: weatherData ? `${Math.round(weatherData.temperature)}` : "",
      feelsLike: weatherData ? `${Math.round(weatherData.feels_like)}°F` : "N/A",
      humidity: weatherData ? `${weatherData.humidity}%` : "N/A",
      wind: weatherData ? `${weatherData.windSpeed} mph` : "N/A",
      windDirection: weatherData ? `${weatherData.windDirection}°` : "N/A",
      aqi: weatherData?.aqi ?? "N/A",
      rainfall: weatherData ? `${weatherData.rainfall} in` : "N/A",
      pressure: weatherData ? `${weatherData.pressure} inHg` : "N/A",
      pm25: weatherData ? `${weatherData.pm25} µg/m³` : "N/A",
      pm10: weatherData ? `${weatherData.pm10} µg/m³` : "N/A",
      waterTemp: weatherData ? `${Math.round(weatherData.water_temp)}°F` : "N/A",
      waveHeight: weatherData ? `${weatherData.wave_height} ft` : "N/A",
      oceanCurrent: weatherData?.ocean_current ?? "N/A",
      uvIndex: weatherData?.uv_index ?? "N/A",
      cloudCover: weatherData ? `${weatherData.cloud_cover}%` : "N/A",
      sunset: weatherData ? new Date(weatherData.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A",
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
    console.log("[DetailView] fetchWeatherData", locationId);
    const cachedData = AppState.getState().cache.weatherData.get(locationId);
    if (cachedData) {
      console.log("[DetailView] fetchWeatherData cache hit", locationId);
      return cachedData;
    }

    const data = await MockAPI.fetchWeather(locationId);
    console.log("[DetailView] fetchWeatherData fetched", data);
    AppState.dispatch({ type: "SET_WEATHER_DATA", payload: { id: locationId, data } });
    setTimeout(() => {
      AppState.dispatch({ type: "DELETE_WEATHER_DATA", payload: { id: locationId } });
    }, 5 * 60 * 1000);

    return data;
  },
}; 