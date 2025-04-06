maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.BRIGHT,
  center: hotspot.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

new maptilersdk.Marker()
  .setLngLat(hotspot.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h3>${hotspot.title}</h3><p>${hotspot.location}</p>`
    )
  )
  .addTo(map);
