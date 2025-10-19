let points = 0;
let ownedItems = [];
let equippedItem = null;

async function loadPoints() {
  const res = await fetch("/api/points");
  const data = await res.json();
  points = data.points;
  document.getElementById("pointsDisplay").textContent = points;
}

async function saveFriendState() {
  await fetch("/api/friend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownedItems, equippedItem }),
  });
}

async function loadFriendState() {
  const res = await fetch("/api/friend");
  if (res.ok) {
    const data = await res.json();
    ownedItems = data.ownedItems || [];
    equippedItem = data.equippedItem || null;
    if (equippedItem) {
      document.getElementById("friendAccessory").src = equippedItem;
      document.getElementById("friendAccessory").style.display = "block";
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPoints();
  await loadFriendState();

  document.querySelectorAll(".buy-btn").forEach(button => {
    button.addEventListener("click", async (e) => {
      const itemDiv = e.target.closest(".item");
      const cost = parseInt(itemDiv.dataset.cost);
      const img = itemDiv.dataset.img;

      if (!ownedItems.includes(img)) {
        if (points >= cost) {
          points -= cost;
          ownedItems.push(img);
          document.getElementById("pointsDisplay").textContent = points;
          await fetch("/api/points", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ points }),
          });
        } else {
          alert("Not enough points!");
          return;
        }
      }

      // Equip
      equippedItem = img;
      document.getElementById("friendAccessory").src = img;
      document.getElementById("friendAccessory").style.display = "block";
      saveFriendState();
    });
  });
});
