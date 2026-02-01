document.addEventListener("DOMContentLoaded", () => {
  // Map installation
  const map = L.map("map").setView([9.082, 8.6753], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const locationIcon = L.icon({
    iconUrl: "/images/icon-location.svg",
    iconSize: [46, 56],
    iconAnchor: [23, 56],
  });

  let marker = L.marker([9.082, 8.6753], {
    icon: locationIcon,
  }).addTo(map);

  const ipEl = document.getElementById("ip");
  const locationEl = document.getElementById("location");
  const timezoneEl = document.getElementById("timezone");
  const ispEl = document.getElementById("isp");
  const inputEl = document.getElementById("ipInput");
  const searchBtn = document.getElementById("search");

  // API CONFIG
  const BASE_URL = "/api/ip";

  function isIPAddress(value) {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
  }

  function buildURL(query) {
    if (!query) return BASE_URL;

    if (isIPAddress(query)) {
      return `${BASE_URL}?ip=${query}`;
    }

    return `${BASE_URL}?domain=${query}`;
  }

  // FETCH + UPDATE UI
  async function fetchIPData(query = "") {
    try {
      const url = buildURL(query);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch IP data");
      }

      const data = await response.json();

      //Guard: ensure real user data exists
      if (!data || !data.location || !data.ip) return;

      ipEl.textContent = data.ip;
      locationEl.textContent = `${data.location.city}, ${data.location.region}, ${data.location.country}`;
      timezoneEl.textContent = `UTC ${data.location.timezone}`;
      ispEl.textContent = data.isp;

      const { lat, lng } = data.location;
      map.setView([lat, lng], 13);
      marker.setLatLng([lat, lng]);

      setTimeout(() => {
        map.invalidateSize();
      }, 200);

    } catch (error) {
      console.error(error);
      alert("Please enter a valid IP address or domain");
    }
  }

  // LOAD (USER IP)

  fetchIPData();

  searchBtn.addEventListener("click", () => {
    const value = inputEl.value.trim();
    if (value) fetchIPData(value);
  });

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = inputEl.value.trim();
      if (value) fetchIPData(value);
    }
  });
});

