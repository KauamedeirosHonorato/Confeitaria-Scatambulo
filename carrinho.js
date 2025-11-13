function initMobileMenu() {
  // --- Lógica do Menu Mobile ---
  const menuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuButton) {
    menuButton.addEventListener("click", () => {
      if (mobileMenu) mobileMenu.classList.toggle("hidden");
    });
  }
  document
    .querySelectorAll("#mobile-menu a, #mobile-menu button")
    .forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileMenu) mobileMenu.classList.add("hidden");
      });
    });
}
function initModals() {
  // --- Lógica para os Modais ---
  const infoModal = document.getElementById("info-modal");
  const policyModal = document.getElementById("policy-modal");

  // Funções para abrir modais
  const infoTab = document.getElementById("info-tab");
  if (infoTab) {
    infoTab.addEventListener("click", () =>
      infoModal.classList.remove("hidden")
    );
  }
  const policyTab = document.getElementById("policy-tab");
  if (policyTab) {
    policyTab.addEventListener("click", () =>
      policyModal.classList.remove("hidden")
    );
  }

  // Funções para fechar modais
  const closeInfoModal = document.getElementById("close-info-modal");
  if (closeInfoModal) {
    closeInfoModal.addEventListener("click", () =>
      infoModal.classList.add("hidden")
    );
  }
  const closePolicyModal = document.getElementById("close-policy-modal");
  if (closePolicyModal) {
    closePolicyModal.addEventListener("click", () =>
      policyModal.classList.add("hidden")
    );
  }
}
function initPackagingModal() {
  // --- Lógica para o modal de Embalagens ---
  const embalagensModal = document.getElementById("embalagens-modal");
  const videoEmbalagens = document.getElementById("video-embalagens");

  // Only proceed if the modal element exists
  if (embalagensModal) {
    const closeButton = embalagensModal.querySelector(".close-button");

    window.openEmbalagensModal = () => {
      embalagensModal.classList.remove("hidden");
      if (videoEmbalagens) videoEmbalagens.play();
    };

    const openButtons = [
      document.getElementById("embalagens-button"),
      document.getElementById("mobile-embalagens-button"),
    ];

    openButtons.forEach((button) => {
      if (button) {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          openEmbalagensModal();
        });
      }
    });

    const closeEmbalagensModal = () => {
      embalagensModal.classList.add("hidden");
      if (videoEmbalagens) {
        videoEmbalagens.pause();
        videoEmbalagens.currentTime = 0; // Reset video to start
      }
    };

    if (closeButton) {
      closeButton.addEventListener("click", closeEmbalagensModal);
    }

    // Optional: Close modal by clicking the overlay
    embalagensModal.addEventListener("click", (event) => {
      if (event.target === embalagensModal) {
        closeEmbalagensModal();
      }
    });
  } else {
    console.warn(
      "Elemento 'embalagens-modal' não encontrado. O modal de embalagens pode não funcionar."
    );
  }
}

function initSaberMaisModal() {
  // --- Lógica para o modal Saber Mais ---
  const saberMaisModal = document.getElementById("saber-mais-modal");
  const closeSaberMaisModalButton = document.getElementById(
    "close-saber-mais-modal"
  );

  window.openSaberMaisModal = () => {
    if (saberMaisModal) saberMaisModal.classList.remove("hidden");
  };

  if (closeSaberMaisModalButton) {
    closeSaberMaisModalButton.addEventListener("click", () => {
      if (saberMaisModal) saberMaisModal.classList.add("hidden");
    });
  }

  if (saberMaisModal) {
    saberMaisModal.addEventListener("click", (event) => {
      if (event.target === saberMaisModal) {
        saberMaisModal.classList.add("hidden");
      }
    });
  }

  const saberMaisEmbalagensButton = document.getElementById(
    "saber-mais-embalagens"
  );
  if (saberMaisEmbalagensButton) {
    saberMaisEmbalagensButton.addEventListener("click", () => {
      window.openSaberMaisModal();
    });
  }
}

function initCartPanel() {
  const cartPanel = document.getElementById("cart-panel");
  const cartOverlay = document.getElementById("cart-panel-overlay");
  const floatingCartButton = document.getElementById("floating-cart");
  const closeCartButton = document.getElementById("close-cart-panel");

  const openCartPanel = () => {
    cartPanel.classList.remove("translate-x-full");
    cartOverlay.classList.remove("hidden");
  };

  const closeCartPanel = () => {
    cartPanel.classList.add("translate-x-full");
    cartOverlay.classList.add("hidden");
  };

  if (floatingCartButton)
    floatingCartButton.addEventListener("click", openCartPanel);
  if (closeCartButton)
    closeCartButton.addEventListener("click", closeCartPanel);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCartPanel);
}

document.addEventListener("DOMContentLoaded", () => {
  // Inicializa todos os módulos
  initMobileMenu();
  initModals();
  initPackagingModal();
  initSaberMaisModal();
  initCartPanel();

  // --- Lógica da Página do Carrinho ---
  // Verifica se estamos na página do carrinho e a renderiza
  if (document.getElementById("cart-items")) {
    displayCartItemsOnCartPage();
  }

  // Atualiza a UI do carrinho (contador, painel lateral) em qualquer página
  updateCart();
});

// --- Fim do DOMContentLoaded ---

let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

function saveCartToStorage() {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

const cakePrices = {
  "Uva Crocante": 230.0,
  "Nuvem de Morango": 240.0,
  "Morango com Suspiro": 240.0,
  Sensação: 255.0,
  "Doce de Leite Trufado": 215.0,
  "Strogonoff de Nozes (sem coco)": 245.0,
  "Strogonoff de Nozes (com coco)": 250.0,
  "Olho de Sogra": 230.0,
  Brigadeiro: 230.0,
  "Brigadeiro de Café": 240.0,
  "Trufa de Nutella": 240.0,
  Casadinho: 230.0,
  "Pistache com Frutas Vermelhas": 310.0,
  "Abacaxi com Coco": 245.0,
};

function parseSizeAndPrice(optionText) {
  // Regex to find weight like "1,5kg", "1kg", or "500g" and capture the unit
  const weightMatch = optionText.match(/(\d+,\d+|\d+)\s*(k?g)/i);
  // Regex to find additional cost like "+ R$ 20,00"
  const priceMatch = optionText.match(/\+\s*R\$\s*(\d+,\d+)/);

  let weightInKg = 0;
  if (weightMatch) {
    // Standardize decimal separator to a period
    let weightStr = weightMatch[1].replace(",", ".");
    weightInKg = parseFloat(weightStr);
    const unit = weightMatch[2].toLowerCase();

    // Convert grams to kilograms only if the unit is 'g'
    if (unit === "g") {
      weightInKg /= 1000;
    }
  }

  // Extract packaging cost, or default to 0
  const packagingCost = priceMatch
    ? parseFloat(priceMatch[1].replace(",", "."))
    : 0;

  return { weightInKg, packagingCost };
}

function formatCurrency(value) {
  if (typeof value !== "number") {
    value = 0;
  }
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function addStrogonoffToCart(buttonElement) {
  const card = buttonElement.closest(".relative, .bg-\\[#FAF8F0\\]");
  const cocoSelect = card.querySelector(".coco-select");
  const selectedCocoOption = cocoSelect.options[cocoSelect.selectedIndex].value;
  const cakeName = "Strogonoff de Nozes " + selectedCocoOption;
  addToCart(cakeName, buttonElement);
}

function addToCart(cakeName, buttonElement) {
  const card = buttonElement.closest(".relative, .bg-\\[#FAF8F0\\]");
  const selectElement = card.querySelector(".cake-size-select");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const size = selectedOption.text;

  const uniqueId = `${cakeName}-${size}`.replace(/\s+/g, "-");

  // Previne adicionar se já estiver no carrinho
  if (cart.some((item) => item.id === uniqueId)) {
    return;
  }

  const { weightInKg, packagingCost } = parseSizeAndPrice(size);
  const cakePricePerKg = cakePrices[cakeName] || 150; // Default to 150 if not found
  const itemPrice = weightInKg * cakePricePerKg + packagingCost;

  cart.push({ id: uniqueId, name: cakeName, size: size, price: itemPrice });
  saveCartToStorage();

  // Atualiza a UI
  updateCart();
  buttonElement.textContent = "Adicionado";
  buttonElement.classList.add("bg-green-500", "cursor-not-allowed");
  buttonElement.classList.remove("btn-gold-metallic");
}

function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  saveCartToStorage();
  // Se estiver na página do carrinho, renderiza novamente. Senão, atualiza o painel.
  if (document.getElementById("cart-items")) {
    displayCartItemsOnCartPage();
  } else {
    updateCart();
  }
}

function updateCart() {
  const cartCount = document.getElementById("cart-count");
  const cartItemsPanel = document.getElementById("cart-items-panel");
  const checkoutButton = document.getElementById("checkout-button-panel");
  const floatingCart = document.getElementById("floating-cart");
  const cartTotalElement = document.getElementById("cart-total-price");
  if (!cartCount || !cartItemsPanel || !checkoutButton || !floatingCart) return;

  cartCount.textContent = cart.length;
  cartItemsPanel.innerHTML = ""; // Limpa o painel antes de atualizar

  let totalPrice = 0;

  if (cart.length > 0) {
    cart.forEach((item) => {
      totalPrice += item.price;
      const itemElement = document.createElement("div");
      itemElement.className =
        "flex justify-between items-center bg-white/50 p-2 rounded-lg";
      itemElement.innerHTML = `
        <div>
          <p class="font-semibold text-gray-800">${item.name}</p>
          <p class="text-sm text-gray-600">${item.size} - ${formatCurrency(
        item.price
      )}</p>
        </div>
        <button onclick="removeFromCart('${
          item.id
        }')" class="text-red-500 hover:text-red-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      `;
      cartItemsPanel.appendChild(itemElement);
    });
    checkoutButton.style.display = "block";
    if (cartTotalElement) {
      cartTotalElement.textContent = formatCurrency(totalPrice);
    }
    floatingCart.classList.add("jump");

    // Monta a mensagem do WhatsApp para o painel lateral
    let message = "Olá, Angela! Gostaria de encomendar:\n\n**Itens:**\n";
    cart.forEach((item) => {
      message += `- ${item.name} (Tamanho: ${item.size})\n`;
    });

    message += `\n*Total: ${formatCurrency(totalPrice)}*`;

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=554499024212&text=${encodeURIComponent(
      message
    )}`;
    checkoutButton.href = whatsappUrl;
    checkoutButton.target = "_blank";

    setTimeout(() => floatingCart.classList.remove("jump"), 500);
  } else {
    cartItemsPanel.innerHTML =
      '<p class="text-center text-gray-500">Seu carrinho está vazio.</p>';
    checkoutButton.style.display = "none";
    if (cartTotalElement) {
      cartTotalElement.textContent = formatCurrency(0);
    }
  }

  // Update all "Encomendar agora" buttons
  // This part is now handled more efficiently.
  // When an item is removed, we need to find its corresponding button and reset it.
  // This is a bit more complex, so for now we will stick to a slightly less efficient but working model on removal.
  // A full robust implementation would map items back to their buttons.
  // For simplicity and avoiding over-engineering now, let's reset all buttons if cart becomes empty.
  if (cart.length === 0) {
    document.querySelectorAll("[onclick^='addToCart']").forEach((button) => {
      button.textContent = "Encomendar agora";
      button.classList.remove("bg-green-500", "cursor-not-allowed");
      button.classList.add("btn-gold-metallic");
    });
  }
}

function displayCartItemsOnCartPage() {
  const cartItemsContainer = document.getElementById("cart-items");
  const checkoutButton = document.getElementById("checkout-button");
  const cartTotalElement = document.getElementById("cart-page-total");

  if (!cartItemsContainer || !checkoutButton || !cartTotalElement) return;

  cartItemsContainer.innerHTML = ""; // Limpa a visualização atual
  let totalPrice = 0;

  if (cart.length > 0) {
    cart.forEach((item) => {
      totalPrice += item.price;
      const itemCard = document.createElement("div");
      itemCard.className = "w-full md:w-1/2 lg:w-1/3 px-2 mb-4";
      itemCard.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow-md h-full flex flex-col justify-between">
          <div>
            <h2 class="text-xl font-bold font-playfair text-gray-800">${
              item.name
            }</h2>
            <p class="text-gray-600">${item.size}</p>
            <p class="font-semibold text-gray-800 mt-2">${formatCurrency(
              item.price
            )}</p>
          </div>
          <button onclick="removeFromCart('${
            item.id
          }')" class="mt-4 text-red-500 hover:text-red-700 text-sm self-start">
            Remover
          </button>
        </div>
      `;
      cartItemsContainer.appendChild(itemCard);
    });

    // Monta a mensagem do WhatsApp
    let message = "Olá, Angela! Gostaria de encomendar:\n\n**Itens:**\n";
    cart.forEach((item) => {
      message += `- ${item.name} (Tamanho: ${item.size})\n`;
    });

    message += `\n*Total: ${formatCurrency(totalPrice)}*`;
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=554499024212&text=${encodeURIComponent(
      message
    )}`;
    checkoutButton.href = whatsappUrl;
    checkoutButton.target = "_blank"; // Abrir em nova aba
    checkoutButton.style.display = "inline-block";
  } else {
    cartItemsContainer.innerHTML =
      '<div class="w-full text-center"><p class="text-gray-500">Seu carrinho está vazio.</p></div>';
    checkoutButton.style.display = "none";
  }

  cartTotalElement.textContent = formatCurrency(totalPrice);
}
