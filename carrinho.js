document.addEventListener("DOMContentLoaded", () => {
  // Elementos do Painel Lateral
  const cartPanel = document.getElementById("cart-panel");
  const cartPanelOverlay = document.getElementById("cart-panel-overlay");
  const cartItemsContainer = document.getElementById("cart-items-panel");
  const checkoutButton = document.getElementById("checkout-button-panel");
  const closeCartButton = document.getElementById("close-cart-panel");

  // Elementos do Carrinho Flutuante
  const floatingCart = document.getElementById("floating-cart");
  const cartCount = document.getElementById("cart-count");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartIcon();
    updateButtonStates();
  }

  function updateCartIcon() {
    if (cartCount) {
      cartCount.textContent = cart.length;
    }
  }

  function toggleCartPanel() {
    const isOpen = !cartPanel.classList.contains("translate-x-full");
    if (isOpen) {
      cartPanel.classList.add("translate-x-full");
      cartPanelOverlay.classList.add("hidden");
    } else {
      displayCart(); // Atualiza o conteúdo antes de mostrar
      cartPanel.classList.remove("translate-x-full");
      cartPanelOverlay.classList.remove("hidden");
    }
  }

  function displayCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="text-center text-gray-500">Seu carrinho está vazio.</p>';
      if (checkoutButton) checkoutButton.style.display = "none";
      return;
    }

    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.innerHTML = `
                <div class="flex justify-between items-center bg-white/80 p-3 rounded-lg shadow">
                    <span class="text-gray-800 font-medium">${item.name} <span class="text-sm text-gray-600">(${item.size})</span></span>
                    <button class="text-red-500 hover:text-red-700" onclick="window.removeFromCart('${item.id}')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            `;
      cartItemsContainer.appendChild(cartItem);
    });

    if (checkoutButton) checkoutButton.style.display = "inline-block";
  }

  window.addToCart = function (itemName, button) {
    event.preventDefault();
    const card = button.closest(".flex-col");
    const select = card.querySelector("select");
    const size = select.value;

    // Criamos um ID único para o item no carrinho, combinando nome e tamanho
    const itemId = `${itemName}-${size}-${Date.now()}`;

    const newItem = {
      id: itemId,
      name: itemName,
      size: size,
    };
    cart.push(newItem);
    saveCart();

    if (button) {
      button.textContent = "Adicionado!";
      button.disabled = true;
    }

    if (floatingCart) {
      floatingCart.classList.add("jump");
      setTimeout(() => {
        floatingCart.classList.remove("jump");
      }, 500);
    }
  };

  window.removeFromCart = function (itemId) {
    cart = cart.filter((item) => item.id !== itemId);
    saveCart();
    displayCart(); // Re-renderiza o painel do carrinho
  };

  function generateWhatsAppLink() {
    if (cart.length === 0) return "#";

    const phone = "554499024212";
    const intro = "Olá! Quero encomendar os seguintes bolos: ";
    // Formata cada item como "1- Nome do Bolo" e junta com ", "
    const itemsText = cart
      .map((item) => `${item.name} (${item.size})`)
      .join(", ");
    const message = intro + itemsText;
    return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(
      message
    )}`;
  }

  function updateButtonStates() {
    const buttons = document.querySelectorAll('a[onclick^="addToCart"]');
    buttons.forEach((button) => {
      const itemName = button.getAttribute("onclick").split("'")[1];
      // A lógica de desabilitar o botão se torna mais complexa com tamanhos.
      // Por simplicidade, vamos permitir adicionar o mesmo bolo com tamanhos diferentes.
      // A verificação abaixo não funcionará mais como antes, mas a mantemos para o estado inicial.
      if (cart.some((item) => item.name === itemName)) {
        button.textContent = "Adicionado!";
        button.disabled = true;
      } else {
        button.textContent = "Encomendar agora";
        button.disabled = false;
      }
    });
  }

  // --- Event Listeners ---

  // Abrir painel
  floatingCart.addEventListener("click", (e) => {
    e.preventDefault();
    toggleCartPanel();
  });

  // Fechar painel
  closeCartButton.addEventListener("click", toggleCartPanel);
  cartPanelOverlay.addEventListener("click", toggleCartPanel);

  // Checkout
  checkoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    const whatsappLink = generateWhatsAppLink();
    if (whatsappLink !== "#") window.open(whatsappLink, "_blank");
  });

  updateCartIcon();
  updateButtonStates();
});
