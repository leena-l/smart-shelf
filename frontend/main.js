// State Management
let inventoryData = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Adding some sample data
    inventoryData = [
        { id: 1, name: "Greek Yogurt", category: "Dairy & Refrigerated", location: "Fridge A", qty: 24, mfg: "2024-02-01", expiry: "2024-03-25", batch: "BATCH-01" },
        { id: 2, name: "Whole Grain Bread", category: "Bakery", location: "Shelf 4", qty: 10, mfg: "2024-03-10", expiry: "2024-03-18", batch: "BATCH-02" }
    ];
    updateUI();
});

// UI Logic: Toggle Sliding Menu
function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('active');
}

// Logic: Calculate Days Remaining
function getDaysRemaining(expiry) {
    const today = new Date();
    const exp = new Date(expiry);
    const diffTime = exp - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Logic: Handle Form Submission
document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newItem = {
        id: Date.now(),
        name: document.getElementById('pName').value,
        category: document.getElementById('pCategory').value,
        location: document.getElementById('pLocation').value,
        qty: document.getElementById('pQty').value,
        mfg: document.getElementById('pMfgDate').value,
        expiry: document.getElementById('pExpiryDate').value,
        batch: document.getElementById('pBatch').value
    };

    inventoryData.push(newItem);
    updateUI();
    e.target.reset();
});

// Logic: Render Table and Summary Cards
function updateUI() {
    const tbody = document.getElementById('inventoryBody');
    tbody.innerHTML = '';
    
    let stats = { total: 0, warning: 0, expired: 0 };

    inventoryData.forEach(item => {
        const daysLeft = getDaysRemaining(item.expiry);
        let status = { text: "In Stock", class: "status-green" };

        if (daysLeft <= 0) {
            status = { text: "Expired", class: "status-red" };
            stats.expired++;
        } else if (daysLeft <= 30) {
            status = { text: "Expiring Soon", class: "status-yellow" };
            stats.warning++;
        }
        
        stats.total++;

        const row = `
            <tr>
                <td><strong>${item.name}</strong><br><small style="color:#999">${item.batch}</small></td>
                <td>${item.category}</td>
                <td>${item.qty}</td>
                <td>${item.mfg || 'N/A'}</td>
                <td>${item.expiry}</td>
                <td style="font-weight:700; color: ${daysLeft < 7 ? 'var(--danger)' : 'inherit'}">${daysLeft} days</td>
                <td><span class="badge ${status.class}">${status.text}</span></td>
                <td>
                    <button class="action-btn" onclick="deleteItem(${item.id})"><i class='bx bx-trash' style="color:var(--danger)"></i></button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    document.getElementById('totalCount').innerText = stats.total;
    document.getElementById('warningCount').innerText = stats.warning;
    document.getElementById('expiredCount').innerText = stats.expired;
}

function deleteItem(id) {
    inventoryData = inventoryData.filter(item => item.id !== id);
    updateUI();
}