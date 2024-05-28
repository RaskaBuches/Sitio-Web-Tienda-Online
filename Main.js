document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');
    const cart = document.getElementById('cart');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.getElementById('close-cart');
    const cartCount = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    let cartItems = [];

    // Recuperar elementos del carrito desde la cookie al cargar la página
    const savedCartItems = getCookie('cartItems');
    if (savedCartItems) {
        cartItems = JSON.parse(savedCartItems);
        updateCart();
    }

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    cart.addEventListener('click', () => {
        cartModal.classList.add('show');
    });

    closeModal.addEventListener('click', () => {
        cartModal.classList.remove('show');
    });

    window.addEventListener('click', (event) => {
        if (event.target == cartModal) {
            cartModal.classList.remove('show');
        }
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));
            const productImage = button.getAttribute('data-image');

            addItemToCart(productName, productPrice, productImage);
        });
    });

    function addItemToCart(name, price, image) {
        const existingItem = cartItems.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ name, price, image, quantity: 1 });
        }

        updateCart();

        // Guardar elementos del carrito en la cookie
        document.cookie = `cartItems=${JSON.stringify(cartItems)}; path=/`;
    }

    function updateCart() {
        cartCount.innerText = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartItemsList.innerHTML = '';

        let total = 0;

        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('li');

            const itemInfo = document.createElement('div');
            itemInfo.classList.add('item-info');

            const itemImage = document.createElement('img');
            itemImage.src = item.image;
            itemImage.alt = item.name;

            const itemName = document.createElement('span');
            itemName.innerText = item.name;

            itemInfo.appendChild(itemImage);
            itemInfo.appendChild(itemName);

            const itemDetails = document.createElement('div');
            itemDetails.classList.add('item-details');

            const itemQuantity = document.createElement('span');
            itemQuantity.classList.add('item-quantity');
            itemQuantity.innerText = `${item.quantity} x`;

            const itemPrice = document.createElement('span');
            itemPrice.classList.add('item-price');
            itemPrice.innerText = `$${(item.price * item.quantity).toFixed(2)}`;

            const removeButton = document.createElement('span');
            removeButton.classList.add('remove-item');
            removeButton.innerText = 'Eliminar';
            removeButton.addEventListener('click', () => {
                removeFromCart(index);
            });

            itemDetails.appendChild(itemQuantity);
            itemDetails.appendChild(itemPrice);
            itemDetails.appendChild(removeButton);

            cartItem.appendChild(itemInfo);
            cartItem.appendChild(itemDetails);

            cartItemsList.appendChild(cartItem);

            total += item.price * item.quantity;
        });

        cartTotal.innerText = total.toFixed(2);
    }

    function removeFromCart(index) {
        cartItems.splice(index, 1);
        updateCart();

        // Actualizar la cookie al eliminar un elemento del carrito
        document.cookie = `cartItems=${JSON.stringify(cartItems)}; path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName.trim() === name) {
                return cookieValue;
            }
        }
        return null;
    }
});
