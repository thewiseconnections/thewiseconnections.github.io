(function () {
    const mapElement = document.getElementById("advisory-map");
    if (!mapElement) return;

    const filterSelect = document.getElementById("map-year-filter");
    const summary = document.getElementById("map-summary");
    const contentBase = window.location.pathname.includes("/pages/") ? "../content/" : "content/";

    const map = L.map("advisory-map").setView([39.5, -98.35], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let activeLayer = L.layerGroup().addTo(map);
    let advisoryData = null;

    function aggregateByUniversity(markers) {
        const grouped = new Map();
        markers.forEach((marker) => {
            const key = marker.university;
            if (!grouped.has(key)) {
                grouped.set(key, {
                    university: marker.university,
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                    memberCount: 0,
                });
            }
            grouped.get(key).memberCount += 1;
        });
        return Array.from(grouped.values());
    }

    function fitToMarkers(markers) {
        if (!markers.length) {
            map.setView([39.5, -98.35], 4);
            return;
        }
        const bounds = L.latLngBounds(markers.map((m) => [m.latitude, m.longitude]));
        map.fitBounds(bounds.pad(0.2));
    }

    function renderMarkers(year) {
        const all = advisoryData.allMarkers || [];
        const memberMarkers = year === "all" ? all : advisoryData.markersByYear[year] || [];
        const universities = aggregateByUniversity(memberMarkers);

        activeLayer.clearLayers();
        universities.forEach((location) => {
            const radius = Math.min(12, 6 + location.memberCount);
            L.circleMarker([location.latitude, location.longitude], {
                radius,
                color: "#9E2438",
                fillColor: "#2C5162",
                fillOpacity: 0.8,
                weight: 1,
            })
                .bindTooltip(location.university, {
                    direction: "top",
                    sticky: true,
                    opacity: 0.95,
                })
                .addTo(activeLayer);
        });

        const label = year === "all" ? "all years" : year;
        summary.textContent = `Showing ${universities.length} universities (${memberMarkers.length} members) for ${label}.`;
        fitToMarkers(universities);
    }

    async function loadMapData() {
        try {
            const response = await fetch(contentBase + "advisory-map.json");
            if (!response.ok) throw new Error("Could not load advisory-map.json");
            advisoryData = await response.json();

            advisoryData.years.forEach((year) => {
                const option = document.createElement("option");
                const count = advisoryData.countsByYear[year] || 0;
                option.value = year;
                option.textContent = `${year} (${count})`;
                filterSelect.appendChild(option);
            });

            filterSelect.addEventListener("change", (event) => {
                renderMarkers(event.target.value);
            });

            renderMarkers("all");
            setTimeout(() => map.invalidateSize(), 150);
        } catch (error) {
            summary.textContent = "Could not load map data. Run scripts/build-advisory-map.py first.";
            console.error(error);
        }
    }

    document.addEventListener("DOMContentLoaded", loadMapData);
})();
