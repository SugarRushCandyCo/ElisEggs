const webhookURL = "https://discord.com/api/webhooks/1494134920409518262/0psSsZZvFwlDqy64gKNeU14SVXy9kZbRVxjIhHmCGdAad-VDG-kHFOhYTSHJm2b6SQTY";

function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

function submitOrder(e){
  e.preventDefault();

  const data = {
    embeds: [{
      title: "🥚 New Egg Order",
      color: 5814783,
      fields: [
        { name: "Name", value: document.getElementById("name").value, inline: true },
        { name: "Contact", value: document.getElementById("contact").value, inline: true },
        { name: "Order Type", value: document.getElementById("type").value, inline: true },
        { name: "Quantity", value: document.getElementById("quantity").value, inline: true },
        { name: "Pickup Date", value: document.getElementById("date").value, inline: true },
        { name: "Pickup Time", value: document.getElementById("time").value, inline: true },
        { name: "Notes", value: document.getElementById("notes").value || "None" }
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
    document.getElementById("orderForm").reset();
  })
  .catch(() => alert("Error sending order"));
}
