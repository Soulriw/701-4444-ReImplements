document.addEventListener('DOMContentLoaded', function () {
    const selectAllCheckbox = document.getElementById('select-all');
    const itemCheckboxes = document.querySelectorAll('.item-select');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const purchaseBtn = document.getElementById('purchase-btn'); // For reference only, handled in cart.ejs
    const totalAmountElement = document.getElementById('total-amount');
    const purchasePopup = document.getElementById('purchasePopup');
    const closePopupBtn = document.getElementById('closePopup');
    const returnHomeBtn = document.getElementById('returnHomeBtn');

    // Calculate and update total
    function updateTotal() {
        let total = 0;
        const selectedItems = document.querySelectorAll('.item-select:checked');

        selectedItems.forEach(checkbox => {
            const cartItem = checkbox.closest('.cart-item');

            // Determine the correct price to use
            let priceToUse;

            // Check if this is a promotion book with a discount
            const hasPromoPrice = cartItem.querySelector('.item-price .original-price');

            if (hasPromoPrice) {
                // This is a promotion book with discount, use the promo price
                const promoElement = cartItem.querySelector('.promo-price');
                if (promoElement) {
                    const priceText = promoElement.textContent;
                    priceToUse = parseFloat(priceText.replace(' Galleon', ''));
                }
            } else {
                // Regular book or promotion without discount, use the regular price
                const priceElement = cartItem.querySelector('.promo-price');
                if (priceElement) {
                    const priceText = priceElement.textContent;
                    priceToUse = parseFloat(priceText.replace(' Galleon', ''));
                }
            }

            // Get quantity
            const quantityElement = cartItem.querySelector('.item-quantity span');
            let quantity = 1;

            if (quantityElement) {
                const quantityText = quantityElement.textContent;
                quantity = parseInt(quantityText.replace('x ', ''));
            }

            // Add to total if we have valid price and quantity
            if (!isNaN(priceToUse) && !isNaN(quantity)) {
                const itemTotal = priceToUse * quantity;
                total += itemTotal;

                console.log(`Item: ${cartItem.querySelector('.item-name').textContent}, Price: ${priceToUse}, Quantity: ${quantity}, Subtotal: ${itemTotal}`);
            }
        });

        if (totalAmountElement) {
            totalAmountElement.textContent = `${total} Galleon`;
            console.log(`Total updated to: ${total} Galleon`);
        }
    }

    // Handle select all checkbox
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function () {
            const isChecked = this.checked;

            itemCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });

            updateTotal();
        });
    }

    // Handle individual checkboxes
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            // Check if all checkboxes are checked
            const allChecked = Array.from(itemCheckboxes).every(cb => cb.checked);

            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked;
            }

            updateTotal();
        });
    });

    // Handle delete buttons
    deleteButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const cartItem = this.closest('.cart-item');
            const cartId = cartItem.dataset.cartId;

            if (confirm('Are you sure you want to remove this item from your cart?')) {
                try {
                    const response = await fetch(`/api/cart/remove/${cartId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        // Remove the item from the DOM
                        const divider = cartItem.nextElementSibling;
                        cartItem.remove();
                        if (divider && divider.classList.contains('divider')) {
                            divider.remove();
                        }

                        // Check if cart is empty
                        const remainingItems = document.querySelectorAll('.cart-item');
                        if (remainingItems.length === 0) {
                            location.reload(); // Reload to show empty cart message
                        } else {
                            updateTotal();
                        }

                        // MODIFY HERE: Add this code to update the cart counter
                        // Notify about cart update
                        document.dispatchEvent(new Event('cartUpdated'));
                        localStorage.setItem('cartUpdated', Date.now());

                        // If window.refreshCartCount exists, call it
                        if (typeof window.refreshCartCount === 'function') {
                            window.refreshCartCount();
                        }
                    } else {
                        console.error('Failed to delete item');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });
    });

    // Add this to the cart.ejs inline script section where purchase is handled
    // After successful purchase:

    if (response.ok) {
        // Show the purchase confirmation popup
        purchasePopup.classList.add('show');

        // MODIFY HERE: Add this code to update the cart counter
        // Notify about cart update
        document.dispatchEvent(new Event('cartUpdated'));
        localStorage.setItem('cartUpdated', Date.now());

        // If window.refreshCartCount exists, call it
        if (typeof window.refreshCartCount === 'function') {
            window.refreshCartCount();
        }
    }

    // Handle continue shopping button
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function () {
            window.location.href = '/allProduct';
        });
    }

    // IMPORTANT: The purchase button click handler has been REMOVED
    // It is now handled by the inline script in cart.ejs

    // We still handle popup UI elements here
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function () {
            if (purchasePopup) {
                purchasePopup.classList.remove('show');
                location.reload(); // Reload to update cart
            }
        });
    }

    if (returnHomeBtn) {
        returnHomeBtn.addEventListener('click', function () {
            window.location.href = '/';
        });
    }

    // Initialize total on page load
    updateTotal();
});

document.addEventListener('DOMContentLoaded', function () {
    // Get the continue shopping button
    const continueShoppingBtn = document.getElementById('continue-shopping');

    // Add event listener if the button exists
    if (continueShoppingBtn) {
        console.log('Continue shopping button found, adding event listener');

        continueShoppingBtn.addEventListener('click', function () {
            console.log('Continue shopping button clicked');
            window.location.href = '/allProduct';
        });

        // Add hover effect to give visual feedback
        continueShoppingBtn.style.cursor = 'pointer';

        // Add visual feedback on hover
        continueShoppingBtn.addEventListener('mouseover', function () {
            this.style.backgroundColor = '#693467';
        });

        continueShoppingBtn.addEventListener('mouseout', function () {
            this.style.backgroundColor = '#432667';
        });
    } else {
        console.error('Continue shopping button not found');
    }
});