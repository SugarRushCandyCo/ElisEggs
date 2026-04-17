const webhookURL = "https://discord.com/api/webhooks/1494134920409518262/0psSsZZvFwlDqy64gKNeU14SVXy9kZbRVxjIhHmCGdAad-VDG-kHFOhYTSHJm2b6SQTY";

// Prices
const prices = {
  "Dozen": 4,
  "Half Dozen": 2.5
};

// Update total
function updateTotal(){
  const type = document.getElementById("type").value;
  const qty = document.getElementById("quantity").value || 1;
  const total = prices[type] * qty;
  document.getElementById("total").textContent = "$" + total.toFixed(2);
}

// Map
function initMap(){
  if(!document.getElementById("map")) return;

  const map = L.map('map').setView([42.443, -76.501], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  L.marker([42.443, -76.501]).addTo(map).bindPopup("Pickup Here");

  map.on("click", () => {
    document.getElementById("notes").value = "Pickup location confirmed on map";
  });
}

// Submit
async function submitOrder(e){
  e.preventDefault();

  const status = document.getElementById("status");

  status.textContent = "Sending order...";
  status.classList.add("show");

  const data = {
    embeds: [{
      title: "🥚 New Order",
      color: 5814783,
      fields: [
        { name: "Name", value: name.value, inline: true },
        { name: "Contact", value: contact.value, inline: true },
        { name: "Type", value: type.value, inline: true },
        { name: "Quantity", value: quantity.value, inline: true },
        { name: "Pickup", value: date.value + " " + time.value },
        { name: "Total", value: "$" + (prices[type.value]*quantity.value).toFixed(2) },
        { name: "Notes", value: notes.value || "None" }
      ],
      timestamp: new Date()
    }]
  };

  try {
    const res = await fetch(webhookURL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    if(!res.ok) throw new Error();

    status.textContent = "✅ Order sent successfully!";
    orderForm.reset();
    updateTotal();

  } catch {
    status.textContent = "❌ Failed to send. Try again later.";
  }
}

// Init
window.onload = () => {
  updateTotal();
  initMap();
};
