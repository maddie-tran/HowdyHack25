let points = 0;
let ownedItems = [];
let equippedItem = null;

async function loadPoints() {
  const res = await fetch('/api/points');
  const data = await res.json();
  document.getElementById('pointsDisplay').textContent = data.points;
}

async function loadInventory() {
  const res = await fetch('/api/inventory');
  const data = await res.json();
  data.inventory.forEach(item => applyItem(item));
}

async function buyItem(cost, item) {
  const res = await fetch('/api/points/spend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: cost, item })
  });

  const data = await res.json();
  if (data.success) {
    document.getElementById('pointsDisplay').textContent = data.points;
    applyItem(item);
  } else {
    alert(data.message || 'Not enough points!');
  }
}

function applyItem(item) {
  const friend = document.getElementById('friendImg');
  const overlay = document.createElement('img');
  overlay.src = `/images/${item}.png`;
  overlay.classList.add('overlay-item');
  friend.parentElement.appendChild(overlay);
}

document.addEventListener('DOMContentLoaded', () => {
  loadPoints();
  loadInventory();

  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const itemDiv = e.target.closest('.item');
      const cost = parseInt(itemDiv.dataset.cost);
      const item = itemDiv.dataset.item;
      buyItem(cost, item);
    });
  });
});
