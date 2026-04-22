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


// LOAD SAVED 
function loadSaved() {

    fetch(`${API}/api/products/saved/${user_id}`)
        .then(res => res.json())
        .then(data => {

            const container = document.getElementById('savedContainer');
            container.innerHTML = '';

            if (!data || data.length === 0) {
                container.innerHTML = "<p>No saved items</p>";
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
                                <a href="product-details.html?id=${p.id}"
                                   class="btn btn-outline-success btn-sm">
                                   View
                                </a>

                                <button class="btn btn-outline-danger btn-sm"
                                    onclick="unsave(${p.id})">
                                    Remove
                                </button>
                            </div>
                        </div>

                    </div>
                </div>`;

                container.innerHTML += card;
            });
        })
        .catch(err => console.error("Saved load error:", err));
}


//  UNSAVE 
function unsave(product_id) {

    fetch(`${API}/api/products/unsave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, product_id })
    })
    .then(res => res.json())
    .then(() => loadSaved())
    .catch(err => console.error("Unsave error:", err));
}


// INIT
loadSaved();