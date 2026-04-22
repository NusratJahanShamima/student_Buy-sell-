const API = window.location.origin;

let user = null;

try {
    user = JSON.parse(localStorage.getItem('user'));
} catch (e) {
    localStorage.removeItem('user');
}

if (!user || !user.id) {
    window.location.href = "login.html";
}

const user_id = user.id;

// SHOW NAME
document.querySelectorAll('.username').forEach(el => {
    el.innerText = user.name;
});


// LOAD PRODUCTS
async function loadProducts() {
    try {
        const res = await fetch(`${API}/api/products?user_id=${user_id}`);
        const data = await res.json();

        const container = document.getElementById('productList');
        container.innerHTML = '';

        if (!data || data.length === 0) {
            container.innerHTML = "<p>No products yet</p>";
            return;
        }

        data.forEach(product => {
            const item = `
                <div class="listing-item">

                    <div class="d-flex align-items-center">
                        <img src="${API}/uploads/${product.image}" class="list-img">

                        <div>
                            <h6>${product.title}</h6>
                            <small>${product.category}</small><br>

                            <small class="text-muted">
                                ${new Date(product.created_at).toLocaleString()}
                            </small>
                        </div>
                    </div>

                    <div class="text-success fw-bold">
                        ৳ ${product.price}
                    </div>

                    <div>
                        <button onclick="deleteProduct(${product.id})"
                            class="btn btn-sm btn-outline-danger">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>

                </div>
            `;

            container.innerHTML += item;
        });

        const totalEl = document.getElementById('totalProducts');
        if (totalEl) totalEl.innerText = data.length;

    } catch (err) {
        console.error("Products load error:", err);
    }
}


// LOAD MESSAGE COUNT 
async function loadMessages() {
    try {
        const res = await fetch(`${API}/api/messages/count/${user_id}`);
        const data = await res.json();

        const msgEl = document.getElementById('totalMessages');
        if (msgEl) {
            msgEl.innerText = data.total;
        }

    } catch (err) {
        console.error("Message count error:", err);
    }
}


// DELETE PRODUCT 
function deleteProduct(id) {

    if (!confirm("Delete this product?")) return;

    fetch(`${API}/api/products/${id}`, {
        method: 'DELETE'
    })
    .then(() => loadProducts())
    .catch(err => console.error(err));
}


// SAVED ITEMS 
async function loadSavedItems() {
    try {
        const res = await fetch(`${API}/api/products/saved/${user_id}`);
        const data = await res.json();

        const savedEl = document.getElementById('totalSaved');
        if (savedEl) savedEl.innerText = data.length;

    } catch (err) {
        console.error("Saved items error:", err);
    }
}



function loadNotificationCount() {

    if (!user) return;

    fetch(`${API}/api/messages/unread/${user.id}`)
        .then(res => res.json())
        .then(data => {

            const badge = document.querySelector('.badge-notify');
            if (!badge) return;

            if (data.total > 0) {
                badge.innerText = data.total;
                badge.style.display = "inline-block";
            } else {
                badge.style.display = "none";
            }
        })
        .catch(err => console.log(err));
}



loadProducts();
loadSavedItems();
loadMessages();
loadNotificationCount();


setInterval(loadNotificationCount, 5000);