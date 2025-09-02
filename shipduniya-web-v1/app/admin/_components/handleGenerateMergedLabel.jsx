export const handleGenerateMergedLabel = async (selectedShipmentsId, shipments) => {
  const shipmentArray = Array.isArray(shipments) ? shipments : Object.values(shipments);

  const urls = selectedShipmentsId.selectedShipmentsId
    .map((id) => shipmentArray[0].find((s) => s._id === id)?.label)
    .filter(Boolean);

  let index = 0;

  const openNextUrl = () => {
    if (index < urls.length) {
      const url = urls[index];
      const win = window.open(url, "_blank");

      if (win) {
        // Automatically close the tab after 5 seconds
        setTimeout(() => {
          win.close();
        }, 5000);
      } else {
        console.warn(`⚠️ Popup blocked for URL: ${url}`);
      }

      index++;
      setTimeout(openNextUrl, 600); // Delay before opening the next tab
    }
  };

  openNextUrl();
};
