let points = 0;
let ownedItems = [];
let equippedItem = null;

// Load points from API
async function loadPoints() {
    try {
        const res = await fetch('/api/points');
        const data = await res.json();
        document.getElementById('pointsDisplay').textContent = data.points ?? 0;
    } catch (err) {
        console.error('Error loading points:', err);
    }
}

// Load inventory from API
async function loadInventory() {
    try {
        const res = await fetch('/api/inventory');
        const data = await res.json();

        data.inventory.forEach(item => {
            if (!ownedItems.includes(item)) ownedItems.push(item);

            const itemDiv = document.querySelector(`.item[data-item="${item}"]`);
            if (itemDiv) {
                const buyBtn = itemDiv.querySelector('.buy-btn');
                if (buyBtn) buyBtn.style.display = 'none';
                createToggleButton(item);
            }
        });
    } catch (err) {
        console.error('Error loading inventory:', err);
    }
}

// Buy an item
async function buyItem(cost, item) {
    try {
        const res = await fetch('/api/points/spend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: cost, item })
        });

        const data = await res.json();
        if (data.success) {
            document.getElementById('pointsDisplay').textContent = data.points;
            if (!ownedItems.includes(item)) ownedItems.push(item);

            const itemDiv = document.querySelector(`.item[data-item="${item}"]`);
            const buyBtn = itemDiv.querySelector('.buy-btn');
            if (buyBtn) buyBtn.style.display = 'none';

            createToggleButton(item);
        } else {
            alert(data.message || 'Not enough points!');
        }
    } catch (err) {
        console.error('Error buying item:', err);
    }
}

// Apply an overlay item
function applyItem(item) {
    const friendBox = document.querySelector('.friend-box');
    const friendImg = document.getElementById('friendImg');

    // Remove previous overlays
    document.querySelectorAll('.overlay-item').forEach(el => el.remove());

    // Create overlay
    const overlay = document.createElement('img');
    overlay.src = `/images/${item}.png`;
    overlay.classList.add('overlay-item', item);

    // Ensure image is loaded before placing overlay
    if (!friendImg.complete) {
        friendImg.onload = () => applyItem(item);
        return;
    }

    // Position overlays based on item
    if (item === 'plant') {
        overlay.style.width = '90px';
        overlay.style.bottom = '40px';
        overlay.style.left = '40px';
    } else if (item === 'desk') {
        overlay.style.width = '300px';
        overlay.style.bottom = '0px';
        overlay.style.left = '20px';
    }

    friendBox.appendChild(overlay);
    equippedItem = item;
    updateToggleButton(item);
}

// Unequip the item
function unequipItem(item) {
    document.querySelectorAll('.overlay-item').forEach(el => el.remove());
    equippedItem = null;
    updateToggleButton(item);
}

// Create or update the toggle button
function createToggleButton(item) {
    const itemDiv = document.querySelector(`.item[data-item="${item}"]`);
    if (!itemDiv) return;

    let btn = itemDiv.querySelector('.toggle-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.classList.add('toggle-btn', 'unequip-btn');
        btn.addEventListener('click', () => {
            if (equippedItem === item) {
                unequipItem(item);
            } else {
                applyItem(item);
            }
        });
        itemDiv.appendChild(btn);
    }

    updateToggleButton(item);
}

// Update toggle button
function updateToggleButton(item) {
    const itemDiv = document.querySelector(`.item[data-item="${item}"]`);
    if (!itemDiv) return;

    const btn = itemDiv.querySelector('.toggle-btn');
    const buyBtn = itemDiv.querySelector('.buy-btn');

    if (!btn) return;

    if (ownedItems.includes(item)) {
        if (buyBtn) buyBtn.style.display = 'none';
        btn.style.display = 'inline-block';
        btn.textContent = (equippedItem === item) ? 'Unequip' : 'Equip';
    } else {
        if (buyBtn) buyBtn.style.display = 'inline-block';
        btn.style.display = 'none';
    }
}

// Event listeners
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
