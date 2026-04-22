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


// LOAD LISTINGS
function loadListings() {

    fetch(`${API}/api/products?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => {

            const container = document.getElementById('listingContainer');
            container.innerHTML = '';

            if (!data || data.length === 0) {
                container.innerHTML = "<p>No products yet</p>";
                return;
            }

            data.forEach(p => {

                const card = `
                <div class="col-md-4 mb-3">
                    <div class="card shadow-sm h-100">

                        <img src="${API}/uploads/${p.image}" class="card-img-top">

                        <div class="card-body d-flex flex-column">
                            <h6>${p.title}</h6>
                            <small class="text-muted">${p.category}</small>
                            <h6 class="text-success mt-2">৳ ${p.price}</h6>

                            <div class="d-flex justify-content-between mt-auto">
                                <button class="btn btn-sm btn-danger"
                                    onclick="deleteProduct(${p.id})">
                                    <i class="bi bi-trash"></i>
                                </button>

                                <a href="product-details.html?id=${p.id}"
                                   class="btn btn-sm btn-outline-success">
                                   View
                                </a>
                            </div>
                        </div>

                    </div>
                </div>`;

                container.innerHTML += card;
            });
        })
        .catch(err => console.error("Listings error:", err));
}


// DELETE 
function deleteProduct(id) {

    if (!confirm("Delete this product?")) return;

    fetch(`${API}/api/products/${id}`, {
        method: "DELETE"
    })
    .then(() => loadListings())
    .catch(err => console.error("Delete error:", err));
}


// INIT
loadListings();