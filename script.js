const webhookURL = "https://discord.com/api/webhooks/1494134920409518262/0psSsZZvFwlDqy64gKNeU14SVXy9kZbRVxjIhHmCGdAad-VDG-kHFOhYTSHJm2b6SQTY";

// Prices
const prices = {
  "Dozen": 4,
  "Half Dozen": 2.5
};

// Inventory (resets daily)
let inventory = JSON.parse(localStorage.getItem("inventory")) || {
  "Dozen": 20,
  "Half Dozen": 30,
  date: new Date().toDateString()
};

if(inventory.date !== new Date().toDateString()){
  inventory = {
    "Dozen": 20,
    "Half Dozen": 30,
    date: new Date().toDateString()
  };
}

function saveInventory(){
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Select product
function selectProduct(type){
  localStorage.setItem("selectedEggType", type);
  window.location.href = "order.html";
}

// Autofill
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("selectedEggType");
  if(type && saved) type.value = saved;

  updateTotal();
  loadHistory();
  initMap();
});

// Quantity
function changeQty(n){
  let val = parseInt(quantity.value) || 1;
  val += n;
  if(val < 1) val = 1;
  quantity.value = val;
  updateTotal();
}

// Total price
function updateTotal(){
  if(!type || !quantity) return;
  const total = prices[type.value] * quantity.value;
  document.getElementById("total").textContent = "Total: $" + total.toFixed(2);
}

// Save order history
function saveHistory(order){
  let history = JSON.parse(localStorage.getItem("orders")) || [];
  history.push(order);
  localStorage.setItem("orders", JSON.stringify(history));
}

// Load history
function loadHistory(){
  const el = document.getElementById("history");
  if(!el) return;

  let history = JSON.parse(localStorage.getItem("orders")) || [];
  el.innerHTML = "<b>Past Orders:</b><br>";
  history.slice(-3).forEach(o => {
    el.innerHTML += `${o.type} x${o.qty} (${o.date})<br>`;
  });
}

// Map
function initMap(){
  if(!document.getElementById("map")) return;

  const map = L.map('map').setView([42.443, -76.501], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  const marker = L.marker([42.443, -76.501]).addTo(map)
    .bindPopup("Pickup Here");

  map.on("click", function(e){
    notes.value = "Pickup spot set via map";
  });
}

// Submit
function submitOrder(e){
  e.preventDefault();

  if(quantity.value > inventory[type.value]){
    alert("Not enough stock!");
    return;
  }

  inventory[type.value] -= quantity.value;
  saveInventory();

  const order = {
    name: name.value,
    type: type.value,
    qty: quantity.value,
    date: date.value
  };

  saveHistory(order);

  const data = {
    embeds: [{
      title: "🥚 New Order",
      color: 5814783,
      fields: [
        { name: "Name", value: name.value, inline: true },
        { name: "Contact", value: contact.value, inline: true },
        { name: "Type", value: type.value, inline: true },
        { name: "Qty", value: quantity.value, inline: true },
        { name: "Pickup", value: date.value + " " + time.value },
        { name: "Total", value: "$" + (prices[type.value]*quantity.value).toFixed(2) },
        { name: "Notes", value: notes.value || "None" }
      ],
      footer: { text: "Eli's Eggs System" },
      timestamp: new Date()
    }]
  };

  fetch(webhookURL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(() => {
    alert("Order sent!");
    orderForm.reset();
    updateTotal();
    loadHistory();
  });
}
