let points = 0;
let ownedItems = [];
let equippedItems = []; // Track multiple equipped items

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

    if (equippedItems.includes(item)) return; // prevent duplicate

    const overlay = document.createElement('img');
    overlay.src = `/images/${item}.png`;
    overlay.classList.add('overlay-item', item);

    if (!friendImg.complete) {
        friendImg.onload = () => applyItem(item);
        return;
    }

    // Position overlays based on item
    if (item === 'plant') {
        overlay.style.width = '70px';
        overlay.style.bottom = '190px';
        overlay.style.left = '260px';
    } else if (item === 'desk') {
        overlay.style.width = '120px';
        overlay.style.bottom = '120px';
        overlay.style.left = '50px';
    } else if (item === 'hat') {
        overlay.style.width = '40px';
        overlay.style.bottom = '210px';
        overlay.style.left = '195px';
    }

    friendBox.appendChild(overlay);
    equippedItems.push(item);
    updateToggleButton(item);
}

// Unequip a specific item
function unequipItem(item) {
    const overlay = document.querySelector(`.overlay-item.${item}`);
    if (overlay) overlay.remove();

    equippedItems = equippedItems.filter(i => i !== item);
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
            if (equippedItems.includes(item)) {
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
        btn.textContent = (equippedItems.includes(item)) ? 'Unequip' : 'Equip';
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
