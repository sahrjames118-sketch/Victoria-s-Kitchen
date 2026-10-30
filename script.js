
document.addEventListener("DOMContentLoaded", function () {

    // MENU SEARCH AND CATEGORY FILTERING

    const searchInput = document.getElementById("menuSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const menuItems = document.querySelectorAll(".menu-item");
    const noResults = document.getElementById("noResults");

    let selectedCategory = "all";

    function filterMenu() {
        const searchText = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        let visibleItems = 0;

        menuItems.forEach(function (item) {
            const itemName = item.textContent.toLowerCase();
            const category = item.dataset.category;

            const matchesSearch = itemName.includes(searchText);
            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            if (matchesSearch && matchesCategory) {
                item.hidden = false;
                visibleItems++;
            } else {
                item.hidden = true;
            }
        });

        if (noResults) {
            noResults.hidden = visibleItems !== 0;
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterMenu);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectedCategory = button.dataset.category;

            filterButtons.forEach(function (otherButton) {
                otherButton.classList.remove("active");
            });

            button.classList.add("active");
            filterMenu();
        });
    });

    // ADD MENU ITEM TO ORDER FORM

    const orderItems = document.getElementById("orderItems");
    const addOrderButtons = document.querySelectorAll(".add-order");

    addOrderButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const itemName = button.dataset.name;

            if (orderItems) {
                const currentOrder = orderItems.value.trim();

                if (currentOrder) {
                    orderItems.value =
                        currentOrder + "\n1 x " + itemName;
                } else {
                    orderItems.value = "1 x " + itemName;
                }

                window.location.href = "order.html";
            } else {
                window.location.href =
                    "order.html?item=" +
                    encodeURIComponent(itemName);
            }
        });
    });

    // READ ITEM SELECTED FROM MENU

    const selectedOrderItems = document.getElementById("orderItems");

    if (selectedOrderItems) {
        const parameters = new URLSearchParams(window.location.search);
        const selectedItem = parameters.get("item");

        if (selectedItem && !selectedOrderItems.value) {
            selectedOrderItems.value = "1 x " + selectedItem;
        }
    }

    // SEND CUSTOMER ORDER TO WHATSAPP

    const orderForm = document.getElementById("orderForm");

    if (orderForm) {
        orderForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name =
                document.getElementById("customerName").value.trim();

            const phone =
                document.getElementById("customerPhone").value.trim();

            const address =
                document.getElementById("customerAddress").value.trim();

            const items =
                document.getElementById("orderItems").value.trim();

            const notes =
                document.getElementById("orderNotes").value.trim();

            const message =
                "NEW ORDER - VICTORIA'S KITCHEN\n\n" +
                "Customer: " + name + "\n" +
                "Phone: " + phone + "\n" +
                "Delivery Address: " + address + "\n\n" +
                "Order Details:\n" + items + "\n\n" +
                "Additional Instructions: " +
                (notes || "None");

            // Sierra Leone country code: 232.
            // Confirm the business number before publishing.
            const whatsappNumber = "23278555189";

            const whatsappURL =
                "https://wa.me/" + whatsappNumber +
                "?text=" + encodeURIComponent(message);

            window.open(whatsappURL, "_blank");
        });
    }

});