const API_URL = "http://localhost:8000/api/v1/inventory/";

// 1. Initialize: Load data from the actual Backend when the page opens
document.addEventListener('DOMContentLoaded', () => {
    fetchInventory();
});

// Logic: Fetch all items from the Backend
async function fetchInventory() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderTable(data); // Send the data to the UI renderer
    } catch (error) {
        console.error("Error fetching inventory:", error);
    }
}

// UI Logic: Toggle Sliding Menu
function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('active');
}

// Logic: Calculate Days Remaining (Same as before)
function getDaysRemaining(expiry) {
    const today = new Date();
    const exp = new Date(expiry);
    const diffTime = exp - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Logic: Handle Form Submission (Sending to Backend)
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Create the object to match our Pydantic Schema exactly
    const newItem = {
        name: document.getElementById('pName').value,
        category: document.getElementById('pCategory').value,
        location: document.getElementById('pLocation').value,
        quantity: parseInt(document.getElementById('pQty').value),
        mfg_date: document.getElementById('pMfgDate').value || null,
        expiry_date: document.getElementById('pExpiryDate').value,
        batch_number: document.getElementById('pBatch').value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItem)
        });

        if (response.ok) {
            e.target.reset(); // Clear the form
            fetchInventory(); // Refresh the table with new data from the DB
        }
    } catch (error) {
        console.error("Error adding product:", error);
    }
});

// Logic: Render Table and Summary Cards
function renderTable(inventoryData) {
    const tbody = document.getElementById('inventoryBody');
    tbody.innerHTML = '';
    
    let stats = { total: 0, warning: 0, expired: 0 };

    inventoryData.forEach(item => {
        // Use expiry_date as defined in our Backend Schema
        const daysLeft = getDaysRemaining(item.expiry_date);
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
                <td><strong>${item.name}</strong><br><small style="color:#999">${item.batch_number || 'No Batch'}</small></td>
                <td>${item.category}</td>
                <td>${item.quantity}</td>
                <td>${item.mfg_date || 'N/A'}</td>
                <td>${item.expiry_date}</td>
                <td style="font-weight:700; color: ${daysLeft < 7 ? 'red' : 'inherit'}">${daysLeft} days</td>
                <td><span class="badge ${status.class}">${status.text}</span></td>
                <td>
                    <button class="action-btn" onclick="deleteItem(${item.id})"><i class='bx bx-trash' style="color:red"></i></button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    document.getElementById('totalCount').innerText = stats.total;
    document.getElementById('warningCount').innerText = stats.warning;
    document.getElementById('expiredCount').innerText = stats.expired;
}

async function deleteItem(id) {
    if (confirm("Are you sure you want to remove this item?")) {
        try {
            await fetch(`${API_URL}${id}`, { method: "DELETE" });
            fetchInventory();
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }
}