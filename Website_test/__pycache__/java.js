const checkoutButton = document.getElementById('checkout-button');
const checkoutForm = document.getElementById('checkout-form');
const cart = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

function updateCartTotal() {
    const cartItems = cart.getElementsByTagName('li');
    let total = 0;
    for (const item of cartItems) {
        const priceText = item.textContent.split(' - ')[1];
        const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
        total += price;
    }
    cartTotal.textContent = `Итого: ${total.toFixed(2)}p`;
}

function addToCart(button) {
    const product = button.closest('.product');
    const productId = product.getAttribute('data-product-id');
    const productName = product.querySelector('h3').textContent;
    const productPrice = parseFloat(product.querySelector('.prce').textContent.replace(/[^\d.]/g, ''));

    const cartItem = document.createElement('li');
    cartItem.textContent = `${productName} - ${productPrice}p`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', () => {
        cart.removeChild(cartItem);
        updateCartTotal();
    });
    cartItem.appendChild(deleteButton);

    cart.appendChild(cartItem);

    updateCartTotal();
}

checkoutButton.addEventListener('click', () => {
    checkoutForm.style.display = 'block';
});

function submitOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    if (name.trim() === '' || phone.trim() === '') {
        alert('Пожалуйста, заполните все поля перед оформлением заказа.');
        return;
    }

    const orderData = {
        name: name,
        phone: phone,
        items: []
    };

    const cartItems = document.querySelectorAll('#cart-items li');
    cartItems.forEach((cartItem) => {
        orderData.items.push(cartItem.textContent);
    });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:5000', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(orderData));

    xhr.onload = function () {
        if (xhr.status === 200) {
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            checkoutForm.style.display = 'none';
            alert('Заказ успешно оформлен! Спасибо, ' + name + '!');
        } else {
            alert('Ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
        }
    };
}