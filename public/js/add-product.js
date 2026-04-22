const API = window.location.origin;

const form = document.getElementById('addProductForm');

let user = null;

try {
    user = JSON.parse(localStorage.getItem('user'));
} catch (e) {
    localStorage.removeItem('user');
}


if (!user || !user.id) {
    window.location.href = "login.html";
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('title', document.getElementById('title').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('seller_id', user.id);

    // IMAGE FILE
    const file = document.getElementById('image').files[0];
    if (file) {
        formData.append('image', file);
    }

    try {
        const res = await fetch(`${API}/api/products/add`, {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            alert("Product Added!");
            window.location.href = "seller-dashboard.html";
        } else {
            alert(data.message || "Upload failed");
        }

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
});