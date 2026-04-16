const webhookURL = "YOUR_WEBHOOK_HERE";

// Store selected product
function selectProduct(type){
  localStorage.setItem("selectedEggType", type);
  window.location.href = "order.html";
}

// Autofill order page
window.addEventListener("DOMContentLoaded", () => {
  const typeField = document.getElementById("type");
  const saved = localStorage.getItem("selectedEggType");

  if(typeField && saved){
    typeField.value = saved;
  }
});

// Quantity buttons
function changeQty(amount){
  const qty = document.getElementById("quantity");
  let val = parseInt(qty.value) || 1;
  val += amount;
  if(val < 1) val = 1;
  qty.value = val;
}

// Submit order
function submitOrder(e){
  e.preventDefault();

  const data = {
    embeds: [{
      title: "🥚 New Egg Order",
      color: 5814783,
      fields: [
        { name: "Name", value: name.value, inline: true },
        { name: "Contact", value: contact.value, inline: true },
        { name: "Type", value: type.value, inline: true },
        { name: "Quantity", value: quantity.value, inline: true },
        { name: "Pickup", value: date.value + " " + time.value },
        { name: "Notes", value: notes.value || "None" }
      ],
      footer: { text: "Eli's Eggs" },
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
  })
  .catch(() => alert("Error sending order"));
}
