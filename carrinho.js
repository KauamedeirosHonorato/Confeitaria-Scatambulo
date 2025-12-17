(function () {
  if (window.carrinhoInitialized) {
    return;
  }

  // --- OTIMIZAÇÃO: Constantes Regex e Formatador para evitar recriação ---
  const WEIGHT_REGEX = /(\d+[.,]\d+|\d+)\s*(k?g)/i;
  const PRICE_REGEX = /\+\s*R\$\s*(\d+[.,]\d+)/;
  const BRL_FORMATTER = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // --- Função para resetar o botão de compra ao mudar opções (UX) ---
  function initSelectChangeReset() {
    document
      .querySelectorAll(".cake-size-select, .coco-select")
      .forEach((select) => {
        select.addEventListener("change", function () {
          const card = this.closest('.relative, [class*="bg-[#FAF8F0]"]');
          const button = card.querySelector(
            "a[onclick^='addToCart'], a[onclick^='addStrogonoffToCart']"
          );

          // Reseta o botão para o estado original se já tiver sido clicado
          if (button && button.textContent === "Adicionado") {
            button.textContent = "Encomendar agora";
            button.classList.remove("bg-green-500", "cursor-not-allowed");
            button.classList.add("btn-gold-metallic");
          }
        });
      });
  }

  // --- OTIMIZAÇÃO: Lazy Loading Automático para Imagens ---
  function initImageOptimization() {
    const images = document.querySelectorAll("img");
    images.forEach((img, index) => {
      if (img.hasAttribute("loading")) return;
      // Pula as 3 primeiras imagens (Logo/Banner) para não prejudicar o LCP (Largest Contentful Paint)
      // Aplica lazy loading em todas as outras para economizar dados e acelerar o carregamento inicial
      if (index > 2) img.setAttribute("loading", "lazy");
    });
  }

  // --- FUNÇÃO DE FILTRO PARA BOLOS NO POTE ---
  function initPotesFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const poteCards = document.querySelectorAll(".pote-card");

    if (filterButtons.length === 0) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        // Remove estilo ativo de todos
        filterButtons.forEach((b) => {
          b.classList.remove("bg-stone-900", "text-[#D4AF37]", "shadow-lg", "scale-105", "border-stone-900");
          b.classList.add("bg-white", "text-gray-600", "border-gray-200", "hover:bg-gray-50");
        });

        // Adiciona estilo ativo ao clicado
        btn.classList.remove("bg-white", "text-gray-600", "border-gray-200", "hover:bg-gray-50");
        btn.classList.add("bg-stone-900", "text-[#D4AF37]", "shadow-lg", "scale-105", "border-stone-900");

        const category = btn.getAttribute("data-filter");

        poteCards.forEach((card) => {
          const cardCategory = card.getAttribute("data-category");
          
          // Reset da animação para garantir que ela ocorra novamente
          card.classList.remove("animate-fade-in-up");
          void card.offsetWidth; // Força o reflow

          if (category === "all" || cardCategory === category) {
            card.classList.remove("hidden");
            card.classList.add("flex"); // Garante que o card volte a aparecer
            card.classList.add("animate-fade-in-up");
          } else {
            card.classList.add("hidden");
            card.classList.remove("flex");
          }
        });
      });
    });
  }

  // --- EFEITO DE BRILHO PERIÓDICO NOS CARDS ---
  function initShimmerEffect() {
    const SHIMMER_INTERVAL = 3500; // Intervalo em milissegundos

    setInterval(() => {
      if (document.hidden) return; // OTIMIZAÇÃO: Pausa animação se a aba estiver oculta

      // Pega todos os cards visíveis na tela
      const cards = Array.from(document.querySelectorAll('.pote-card:not(.hidden)'));
      if (cards.length === 0) return;

      // Filtra os cards que não estão atualmente animando
      const availableCards = cards.filter(c => !c.classList.contains('is-shimmering'));
      if (availableCards.length === 0) return;

      // Escolhe um card aleatório para aplicar o efeito
      const cardToShimmer = availableCards[Math.floor(Math.random() * availableCards.length)];

      cardToShimmer.classList.add('is-shimmering');

      // Remove a classe após a animação terminar para que possa ser re-aplicada
      cardToShimmer.addEventListener('animationend', () => {
        cardToShimmer.classList.remove('is-shimmering');
      }, { once: true });

    }, SHIMMER_INTERVAL);
  }

  function initMobileMenu() {
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
    const infoModal = document.getElementById("info-modal");
    const policyModal = document.getElementById("policy-modal");

    const infoTab = document.getElementById("info-tab");
    if (infoTab)
      infoTab.addEventListener("click", () =>
        infoModal.classList.remove("hidden")
      );

    const policyTab = document.getElementById("policy-tab");
    if (policyTab)
      policyTab.addEventListener("click", () =>
        policyModal.classList.remove("hidden")
      );

    const closeInfoModal = document.getElementById("close-info-modal");
    if (closeInfoModal)
      closeInfoModal.addEventListener("click", () =>
        infoModal.classList.add("hidden")
      );

    const closePolicyModal = document.getElementById("close-policy-modal");
    if (closePolicyModal)
      closePolicyModal.addEventListener("click", () =>
        policyModal.classList.add("hidden")
      );
  }

  function initPackagingModal() {
    const embalagensModal = document.getElementById("embalagens-modal");
    const videoEmbalagens = document.getElementById("video-embalagens");

    if (embalagensModal) {
      embalagensModal.classList.add(
        "transition-opacity",
        "duration-300",
        "ease-out",
        "opacity-0"
      );

      const closeButton = embalagensModal.querySelector(".close-button");
      let closeTimeout;

      window.openEmbalagensModal = () => {
        clearTimeout(closeTimeout);
        embalagensModal.classList.remove("hidden");
        requestAnimationFrame(() => {
          embalagensModal.classList.remove("opacity-0");
        });
        if (videoEmbalagens) {
          videoEmbalagens.src = "VideoEmbalagens/VideoAngela.mp4";
          videoEmbalagens.play();
        }
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
        embalagensModal.classList.add("opacity-0");
        if (videoEmbalagens) {
          videoEmbalagens.pause();
          videoEmbalagens.currentTime = 0;
        }
        closeTimeout = setTimeout(() => {
          embalagensModal.classList.add("hidden");
          if (videoEmbalagens) videoEmbalagens.src = "";
        }, 300);
      };

      if (closeButton)
        closeButton.addEventListener("click", closeEmbalagensModal);

      embalagensModal.addEventListener("click", (event) => {
        if (event.target === embalagensModal) closeEmbalagensModal();
      });
    } else {
      console.warn(
        "Elemento 'embalagens-modal' não encontrado. O modal de embalagens pode não funcionar."
      );
    }
  }

  function initSaberMaisModal() {
    const saberMaisModal = document.getElementById("saber-mais-modal");
    const closeSaberMaisModalButton = document.getElementById(
      "close-saber-mais-modal"
    );

    // Configuração inicial de classes para animação
    if (saberMaisModal) {
      saberMaisModal.classList.add(
        "transition-opacity",
        "duration-300",
        "ease-out",
        "opacity-0"
      );
    }

    let closeTimeout;

    const openModal = () => {
      if (saberMaisModal) {
        clearTimeout(closeTimeout);
        saberMaisModal.classList.remove("hidden");
        requestAnimationFrame(() => {
          saberMaisModal.classList.remove("opacity-0");
        });
        document.body.classList.add("overflow-hidden"); // Trava o scroll do body
      }
    };

    const closeModal = () => {
      if (saberMaisModal) {
        saberMaisModal.classList.add("opacity-0");
        closeTimeout = setTimeout(() => {
          saberMaisModal.classList.add("hidden");
          document.body.classList.remove("overflow-hidden"); // Libera o scroll do body
        }, 300);
      }
    };

    window.openSaberMaisModal = openModal;

    if (closeSaberMaisModalButton) {
      closeSaberMaisModalButton.addEventListener("click", closeModal);
    }

    if (saberMaisModal) {
      saberMaisModal.addEventListener("click", (event) => {
        if (event.target === saberMaisModal) closeModal();
      });
    }

    const saberMaisEmbalagensButton = document.getElementById(
      "saber-mais-embalagens"
    );
    if (saberMaisEmbalagensButton) {
      saberMaisEmbalagensButton.addEventListener("click", (e) => {
        e.preventDefault();
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

  let cart;
  try {
    cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  } catch (e) {
    console.warn("Could not access localStorage. Cart will not be saved.", e);
    cart = [];
  }

  function saveCartToStorage() {
    try {
      localStorage.setItem("shoppingCart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not access localStorage. Cart will not be saved.", e);
    }
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
    "Floresta Branca": 250.0,
  };

  function parseSizeAndPrice(optionText) {
    // Regex aprimorado para aceitar ponto ou vírgula nos decimais (ex: 1.5kg ou 1,5kg)
    const weightMatch = optionText.match(WEIGHT_REGEX);
    const priceMatch = optionText.match(PRICE_REGEX);

    let weightInKg = 0;
    if (weightMatch) {
      let weightStr = weightMatch[1].replace(",", ".");
      weightInKg = parseFloat(weightStr);
      const unit = weightMatch[2].toLowerCase();
      if (unit === "g") weightInKg /= 1000;
    }

    const packagingCost = priceMatch
      ? parseFloat(priceMatch[1].replace(",", "."))
      : 0;
    return { weightInKg, packagingCost };
  }

  function formatCurrency(value) {
    if (typeof value !== "number") value = 0;
    return BRL_FORMATTER.format(value);
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className =
      "fixed top-6 right-6 z-[9999] flex items-center gap-4 p-4 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 transform translate-y-[-20px] opacity-0 hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)]";
    toast.innerHTML = `
        <div class="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-[#D4AF37] rounded-full shadow-sm">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        <div class="flex flex-col">
            <span class="font-playfair font-bold text-gray-800 text-base">Adicionado</span>
            <span class="text-sm text-gray-600 font-medium leading-tight">${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-[-20px]", "opacity-0");
    });

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-[-20px]");
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  function addStrogonoffToCart(buttonElement) {
    const card = buttonElement.closest('.relative, [class*="bg-[#FAF8F0]"]');
    const cocoSelect = card.querySelector(".coco-select");
    const selectedCocoOption =
      cocoSelect.options[cocoSelect.selectedIndex].value;
    const cakeName = "Strogonoff de Nozes " + selectedCocoOption;
    addToCart(cakeName, buttonElement);
  }

  function addToCart(cakeName, buttonElement) {
    const card = buttonElement.closest('.carousel-slide') || buttonElement.closest('.group');
    const selectElement = card.querySelector(".cake-size-select");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const size = selectedOption.text;

    const uniqueId = `${cakeName}-${size}`.replace(/\s+/g, "-");
    
    // Se o item já existe, garante o feedback visual e retorna
    if (cart.some((item) => item.id === uniqueId)) {
        buttonElement.textContent = "Adicionado";
        buttonElement.classList.add("bg-green-500", "cursor-not-allowed");
        buttonElement.classList.remove("btn-gold-metallic");
        return;
    }

    const { weightInKg, packagingCost } = parseSizeAndPrice(size);
    
    let cakePricePerKg = cakePrices[cakeName];
    if (cakePricePerKg === undefined) {
        console.warn(`Preço base não encontrado para: "${cakeName}". Usando valor padrão de R$ 150.`);
        cakePricePerKg = 150;
    }
    
    // Arredonda para 2 casas decimais para evitar erros de ponto flutuante
    const itemPrice = Math.round((weightInKg * cakePricePerKg + packagingCost) * 100) / 100;

    cart.push({ id: uniqueId, name: cakeName, size, price: itemPrice });
    saveCartToStorage();

    updateCart();

    showToast(`${cakeName} adicionado ao carrinho!`);

    // Feedback visual do botão
    buttonElement.textContent = "Adicionado";
    buttonElement.classList.add("bg-green-500", "cursor-not-allowed");
    buttonElement.classList.remove("btn-gold-metallic");

    // Abrir o carrinho automaticamente se for o primeiro item (Melhoria UX)
    const cartPanel = document.getElementById("cart-panel");
    const cartOverlay = document.getElementById("cart-panel-overlay");
    if (
      cart.length === 1 &&
      cartPanel &&
      cartPanel.classList.contains("translate-x-full")
    ) {
      cartPanel.classList.remove("translate-x-full");
      cartOverlay.classList.remove("hidden");
    }
  }

  function removeFromCart(itemId) {
    cart = cart.filter((item) => item.id !== itemId);
    saveCartToStorage();
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

    if (!cartCount || !cartItemsPanel || !checkoutButton || !floatingCart)
      return;

    cartCount.textContent = cart.length;
    cartItemsPanel.innerHTML = "";

    let totalPrice = 0;
    if (cart.length > 0) {
      const fragment = document.createDocumentFragment(); // OTIMIZAÇÃO: Fragmento para reduzir reflows
      cart.forEach((item) => {
        totalPrice += item.price;
        const itemElement = document.createElement("div");
        itemElement.className =
          "flex justify-between items-center bg-white p-2 rounded-lg shadow-sm";
        itemElement.innerHTML = `
          <div>
            <p class="font-semibold text-gray-800">${item.name}</p>
            <p class="text-sm text-gray-600">${
              item.type === "packaging" ? item.size : item.size
            } - ${formatCurrency(item.price)}</p>
          </div>
          <button onclick="removeFromCart('${
            item.id
          }')" class="text-red-500 hover:text-red-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1
                1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>`;
        fragment.appendChild(itemElement);
      });
      cartItemsPanel.appendChild(fragment);
      checkoutButton.style.display = "block";
      if (cartTotalElement)
        cartTotalElement.textContent = formatCurrency(totalPrice);

      floatingCart.classList.remove("jump");
      void floatingCart.offsetWidth;
      floatingCart.classList.add("jump");
    } else {
      cartItemsPanel.innerHTML =
        '<p class="text-center text-gray-500">Seu carrinho está vazio.</p>';
      checkoutButton.style.display = "none";
      if (cartTotalElement) cartTotalElement.textContent = formatCurrency(0);
    }

    // Se o carrinho esvaziar, reseta todos os botões da tela
    if (cart.length === 0) {
      document
        .querySelectorAll(
          "a[onclick^='addToCart'], a[onclick^='addStrogonoffToCart']"
        )
        .forEach((button) => {
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

    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;

    if (cart.length > 0) {
      const fragment = document.createDocumentFragment(); // OTIMIZAÇÃO: Fragmento para reduzir reflows
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
              <p class="text-gray-600">${
                item.type === "packaging" ? item.size : item.size
              }</p>
              <p class="font-semibold text-gray-800 mt-2">${formatCurrency(
                item.price
              )}</p>
            </div>
            <button onclick="removeFromCart('${
              item.id
            }')" class="mt-4 text-red-500 hover:text-red-700 text-sm self-start">
              Remover
            </button>
          </div>`;
        fragment.appendChild(itemCard);
      });
      cartItemsContainer.appendChild(fragment);

      checkoutButton.style.display = "inline-block";
    } else {
      cartItemsContainer.innerHTML =
        '<div class="w-full text-center"><p class="text-gray-500">Seu carrinho está vazio.</p></div>';
      checkoutButton.style.display = "none";
    }

    cartTotalElement.textContent = formatCurrency(totalPrice);
  }

  function initCheckoutModal() {
    const checkoutModal = document.getElementById("checkout-modal");
    if (!checkoutModal) return;

    const openButtons = [
      document.getElementById("checkout-button-panel"),
      document.getElementById("checkout-button"),
    ];
    const closeButton = document.getElementById("close-checkout-modal");
    const form = document.getElementById("checkout-form");
    const retiradaRadios = document.querySelectorAll('input[name="retirada"]');

    const openModal = (e) => {
      e.preventDefault();
      checkoutModal.classList.remove("hidden");
      checkoutModal.classList.add("flex");
      updateCheckoutTotal(); // Atualiza os totais sempre que o modal é aberto
      handleRetiradaChange(); // Verifica o estado da opção de entrega
    };

    const closeModal = () => {
      checkoutModal.classList.add("hidden");
      checkoutModal.classList.remove("flex");
    };

    // --- LÓGICA PARA OPÇÃO DE RETIRADA ---
    const valorEntregaSelect = document.getElementById("valor_entrega");
    const addressFieldsToToggle = ["cep", "endereco", "num", "ap", "predio", "bairro", "cidade"];

    function toggleAddressFields(shouldDisable) {
      const fieldsToHandle = [...addressFieldsToToggle, "valor_entrega"];

      fieldsToHandle.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
          field.disabled = shouldDisable;
          if (['cep', 'endereco', 'num', 'bairro', 'cidade'].includes(id)) {
            field.required = !shouldDisable;
          }
          
          if (shouldDisable) {
            field.classList.add("bg-gray-100", "cursor-not-allowed");
            field.value = ''; // Limpa o valor ao desabilitar
          } else {
            field.classList.remove("bg-gray-100", "cursor-not-allowed");
          }
        }
      });
      // Limpa o aviso do CEP se os campos forem desabilitados
      if (shouldDisable) {
        const cepNotice = document.getElementById("cep-notice");
        if (cepNotice) {
            cepNotice.classList.add("hidden");
            cepNotice.textContent = "";
        }
      }
    }

    function handleRetiradaChange() {
      const isRetirada = document.querySelector('input[name="retirada"]:checked')?.value === 'sim';
      toggleAddressFields(isRetirada);
      if (isRetirada && valorEntregaSelect) {
        valorEntregaSelect.value = "0"; // Define valor 0 para cálculo
      }
      updateCheckoutTotal();
    }
    // --- FIM DA LÓGICA DE RETIRADA ---

    // --- LÓGICA PARA ATUALIZAR TOTAIS NO CHECKOUT ---
    const CIDADES_ATENDIDAS = {
      marialva: { id: "10", taxa: 10.0 },
      maringa: { id: "20", taxa: 25.0 },
      sarandi: { id: "30", taxa: 25.0 },
    };
    
    function updateCheckoutTotal() {
      // IMPORTANTE: Os IDs (10, 20, 30) devem estar sincronizados com os values do <select> no HTML
      const subtotalElement = document.getElementById("checkout-subtotal");
      const deliveryFeeElement = document.getElementById(
        "checkout-delivery-fee"
      );
      const totalElement = document.getElementById("checkout-total");
      const valorEntregaSelect = document.getElementById("valor_entrega");

      if (
        !subtotalElement ||
        !deliveryFeeElement ||
        !totalElement ||
        !valorEntregaSelect
      ) {
        return;
      }

      const itemsSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
      
      const isRetirada = document.querySelector('input[name="retirada"]:checked')?.value === 'sim';
      const selectedDeliveryId = isRetirada ? "0" : valorEntregaSelect.value;
      const deliveryCity = Object.values(CIDADES_ATENDIDAS).find(c => c.id === selectedDeliveryId);
      const deliveryCost = isRetirada ? 0 : (deliveryCity ? deliveryCity.taxa : 0);

      const finalTotal = itemsSubtotal + deliveryCost;

      subtotalElement.textContent = formatCurrency(itemsSubtotal);
      deliveryFeeElement.textContent = formatCurrency(deliveryCost); // Corrigido para usar a variável correta
      totalElement.textContent = formatCurrency(finalTotal);
    }

    // Expõe a função para ser chamada de outros lugares (como ao remover item)
    window.updateCheckoutTotal = updateCheckoutTotal;

    // Adiciona um listener para quando o usuário muda a taxa manualmente
    if (valorEntregaSelect) { // Listener para quando a cidade é escolhida
      valorEntregaSelect.addEventListener("change", updateCheckoutTotal);
    }
    // Listener para os botões de rádio de retirada
    retiradaRadios.forEach(radio => radio.addEventListener('change', handleRetiradaChange));
    // --- FIM DA LÓGICA DE TOTAIS ---

    // --- FUNÇÕES DE PERSISTÊNCIA DE ENDEREÇO (LocalStorage) ---
    function saveAddressToStorage(details) {
      try {
        const addressData = {
          nome: details.nome,
          cep: details.cep,
          endereco: details.endereco,
          num: details.num,
          ap: details.ap,
          predio: details.predio,
          bairro: details.bairro,
          cidade: details.cidade,
          valor_entrega: details.valor_entrega,
        };
        localStorage.setItem("userAddress", JSON.stringify(addressData));
      } catch (e) {
        console.warn("Não foi possível salvar o endereço.", e);
      }
    }

    function loadAddressFromStorage() {
      try {
        const saved = localStorage.getItem("userAddress");
        if (!saved) return;
        const data = JSON.parse(saved);

        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val || "";
        };

        setVal("nome", data.nome);
        setVal("cep", data.cep);
        setVal("endereco", data.endereco);
        setVal("num", data.num);
        setVal("ap", data.ap);
        setVal("predio", data.predio);
        setVal("bairro", data.bairro);
        setVal("cidade", data.cidade);

        const valorEntregaSelect = document.getElementById("valor_entrega");
        if (valorEntregaSelect && data.valor_entrega) {
          valorEntregaSelect.value = data.valor_entrega;
          updateCheckoutTotal();
        }
      } catch (e) {
        console.warn("Erro ao carregar endereço salvo.", e);
      }
    }

    // Carrega o endereço salvo assim que o modal é inicializado
    loadAddressFromStorage();

    handleRetiradaChange(); // Define o estado inicial dos campos de endereço

    openButtons.forEach((btn) => {
      if (btn) btn.addEventListener("click", openModal);
    });

    const dataInput = document.getElementById("data_entrega");
    const inicioInput = document.getElementById("horario_inicio");
    const fimInput = document.getElementById("horario_fim");
    const timeNotice = document.getElementById("time-validation-notice");
    const timeNoticeMsg = document.getElementById("time-validation-msg");

    // --- FUNÇÕES AUXILIARES DE DATA/HORA ---
    const isToday = () => {
      if (dataInput._flatpickr && dataInput._flatpickr.selectedDates.length > 0) {
        const sel = dataInput._flatpickr.selectedDates[0];
        const now = new Date();
        return sel.toDateString() === now.toDateString();
      }
      if (!dataInput.value) return false;
      const [y, m, d] = dataInput.value.split("-");
      const sel = new Date(y, m - 1, d);
      const now = new Date();
      return sel.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0);
    };

    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };
    
    const getClosingTime = () => {
      // Prioriza a data do objeto flatpickr para evitar erros de fuso/string
      if (dataInput._flatpickr && dataInput._flatpickr.selectedDates.length > 0) {
          const sel = dataInput._flatpickr.selectedDates[0];
          if (sel.getDay() === 0) return { minutes: 12 * 60, str: "12:00" };
      } else if (dataInput.value) {
          const [y, m, d] = dataInput.value.split("-");
          const sel = new Date(y, m - 1, d);
          if (sel.getDay() === 0) return { minutes: 12 * 60, str: "12:00" };
      }
      return { minutes: 18 * 60, str: "18:00" };
    };
    // ----------------------------------------

    const updateTimeInputsState = () => {
      // Limpa avisos de erro ao mudar a data
      if (timeNotice) timeNotice.classList.add("hidden");
      if (timeNoticeMsg) timeNoticeMsg.textContent = "";

      // --- Lógica de Feriado (25/12 e 01/01) ---
      const holidayNotice = document.getElementById("holiday-delivery-notice");
      if (holidayNotice) holidayNotice.classList.add("hidden");

      // Habilita campos por padrão (caso tenham sido desabilitados antes)
      inicioInput.disabled = false;
      fimInput.disabled = false;
      inicioInput.classList.remove("cursor-not-allowed", "bg-gray-100");
      fimInput.classList.remove("cursor-not-allowed", "bg-gray-100");

      // -----------------------------------------

      // Atualiza texto informativo sobre horário
      const deliveryInfo = document.getElementById("delivery-time-info");
      if (deliveryInfo) {
          const { str } = getClosingTime();
          deliveryInfo.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Nosso horário de entregas é das <strong>08:00 às ${str}</strong>.</span>
          `;
      }

      // Lógica para Domingo: Preencher 08:00 - 12:00
      const { minutes: closingMinutes } = getClosingTime();
      let isSunday = false;
      
      if (closingMinutes === 12 * 60) { // Se o fechamento for 12:00, é domingo
        isSunday = true;
        // Apenas define o padrão se os campos estiverem vazios ou fora do limite
        const currentStart = timeToMinutes(inicioInput.value);
        if (currentStart === 0 || currentStart > closingMinutes) {
           if (inicioInput._flatpickr) inicioInput._flatpickr.setDate("08:00", false);
           else inicioInput.value = "08:00";
           
           if (fimInput._flatpickr) fimInput._flatpickr.setDate("12:00", false);
           else fimInput.value = "12:00";
        }
      }

      // Dispara a validação do horário de início caso a data mude
      if (inicioInput.value) {
        // Se for domingo e NÃO for hoje, não dispara o change para manter o 08:00 - 12:00
        // Se for hoje, dispara para validar se 08:00 já passou
        if (!isSunday || isToday()) {
            inicioInput.dispatchEvent(new Event("change"));
        }
      }

      if (isToday()) {
        fimInput.setAttribute("readonly", true);
        // Desabilita o flatpickr se existir para evitar popup
        if (fimInput._flatpickr) fimInput._flatpickr._input.disabled = true;
        fimInput.classList.add("bg-gray-100", "cursor-not-allowed");
      } else {
        fimInput.removeAttribute("readonly");
        if (fimInput._flatpickr) fimInput._flatpickr._input.disabled = false;
        fimInput.classList.remove("bg-gray-100", "cursor-not-allowed");
      }
    };

    if (dataInput) {
      dataInput.addEventListener("change", updateTimeInputsState);
      // Garante que a validação rode ao carregar (caso haja data preenchida automaticamente)
      updateTimeInputsState();
    }

    if (inicioInput && fimInput) {
      inicioInput.addEventListener("change", function () {
        const timeValue = this.value;
        // Limpa aviso anterior
        if (timeNotice) {
          timeNotice.classList.add("hidden");
          if (timeNoticeMsg) timeNoticeMsg.textContent = "";
        }

        if (!timeValue) return;

        // Limpeza básica e conversão
        const [horaStr, minStr] = timeValue.split(":");
        let hora = parseInt(horaStr);
        let minuto = parseInt(minStr) || 0;

        // Limites da Loja (em minutos)
        const ABERTURA = 8 * 60; // 08:00
        const { minutes: FECHAMENTO, str: FECHAMENTO_STR } = getClosingTime();
        const currentMinutes = hora * 60 + minuto;

        let errorMsg = "";
        let adjustedTime = null;

        // 1. Validação de horário de funcionamento
        if (currentMinutes < ABERTURA) {
          errorMsg = "Nossas entregas começam apenas às 08:00.";
          adjustedTime = "08:00";
          hora = 8;
          minuto = 0;
        } else if (currentMinutes >= FECHAMENTO) { // Se for IGUAL ao fechamento (12:00), também não pode INICIAR
          errorMsg = `Fechamos às ${FECHAMENTO_STR}.`;
          adjustedTime = FECHAMENTO_STR;
          const [hClose, mClose] = FECHAMENTO_STR.split(":").map(Number);
          hora = hClose;
          minuto = mClose;
        }

        // 2. Validação de antecedência para hoje
        if (!errorMsg && isToday()) {
          const now = new Date();
          // Calcula o horário mínimo permitido (agora + 2 horas)
          const minDeliveryTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
          
          // Verifica se virou o dia (passou da meia-noite no cálculo) ou se passou do fechamento
          if (minDeliveryTime.getDate() !== now.getDate()) {
             errorMsg = "Infelizmente já encerramos os pedidos para entrega hoje.";
             adjustedTime = FECHAMENTO_STR;
             const [hClose, mClose] = FECHAMENTO_STR.split(":").map(Number);
             hora = hClose; minuto = mClose;
          } else {
              const minDeliveryMinutes = minDeliveryTime.getHours() * 60 + minDeliveryTime.getMinutes();
              
              if (minDeliveryMinutes > FECHAMENTO) {
                 errorMsg = `Infelizmente já encerramos os pedidos para entrega hoje (necessário 2h de antecedência até às ${FECHAMENTO_STR}).`;
                 adjustedTime = FECHAMENTO_STR;
                 const [hClose, mClose] = FECHAMENTO_STR.split(":").map(Number);
                 hora = hClose; minuto = mClose;
              } else if (currentMinutes < minDeliveryMinutes) {
                 errorMsg = `Para hoje, precisamos de no mínimo 2h de antecedência.`;
                 hora = minDeliveryTime.getHours();
                 minuto = minDeliveryTime.getMinutes();
                 adjustedTime = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
              }
          }
        }

        // Aplica ajustes se necessário
        if (adjustedTime) {
          if (this._flatpickr) this._flatpickr.setDate(adjustedTime, false);
          else this.value = adjustedTime;
        } else {
          // Formata bonitinho se estiver tudo certo
          const formatted = String(hora).padStart(2, "0") + ":" + String(minuto).padStart(2, "0");
          if (this._flatpickr) this._flatpickr.setDate(formatted, false);
          else this.value = formatted;
        }

        // Exibir erro se houver
        if (errorMsg) {
          if (timeNotice && timeNoticeMsg) {
            timeNoticeMsg.textContent = errorMsg;
            timeNotice.classList.remove("hidden");
          }
        }

        // Auto-preencher horário final (+ 2 horas)
        let horaFinal = hora + 2;
        let minutoFinal = minuto;
        
        // Verifica teto de FECHAMENTO
        if (horaFinal * 60 + minutoFinal > FECHAMENTO) {
            const [hClose, mClose] = FECHAMENTO_STR.split(":").map(Number);
            horaFinal = hClose;
            minutoFinal = mClose;
        }
        
        const finalStr = String(horaFinal).padStart(2, "0") + ":" + String(minutoFinal).padStart(2, "0");
        if (fimInput._flatpickr) fimInput._flatpickr.setDate(finalStr, false);
        else fimInput.value = finalStr;
      });

      // Validação do campo FIM (só permite se NÃO for hoje, pois hoje é auto-calc)
      fimInput.addEventListener("change", function () {
        if (isToday()) return;

        const horaFimEmMinutos = timeToMinutes(this.value);
        const horaInicioEmMinutos = timeToMinutes(inicioInput.value);
        const { minutes: FECHAMENTO, str: FECHAMENTO_STR } = getClosingTime();

        if (timeNotice) timeNotice.classList.add("hidden");

        if (horaFimEmMinutos === 0) return;

        if (horaFimEmMinutos > FECHAMENTO) {
          if (timeNotice && timeNoticeMsg) {
            timeNoticeMsg.textContent = `Nosso horário de entregas é das 08:00 às ${FECHAMENTO_STR}.`;
            timeNotice.classList.remove("hidden");
          }
          if (this._flatpickr) this._flatpickr.setDate(FECHAMENTO_STR, false);
          else this.value = FECHAMENTO_STR;
          return;
        }

        if (horaInicioEmMinutos > 0 && horaFimEmMinutos < horaInicioEmMinutos) {
          if (timeNotice && timeNoticeMsg) {
            timeNoticeMsg.textContent =
              "O horário final deve ser após o horário de início.";
            timeNotice.classList.remove("hidden");
          }
          if (this._flatpickr) this._flatpickr.clear();
          else this.value = ""; 
          return;
        }

        const hora = Math.floor(horaFimEmMinutos / 60);
        const formatted = String(hora).padStart(2, "0") + ":00";
        if (this._flatpickr) this._flatpickr.setDate(formatted, false);
        else this.value = formatted;
      });
    }

    const cepInput = document.getElementById("cep");
    const enderecoInput = document.getElementById("endereco");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const numInput = document.getElementById("num");
    const cepNotice = document.getElementById("cep-notice");
    const cepSpinner = document.getElementById("cep-spinner");
    const valorEntregaInput = document.getElementById("valor_entrega");

    function setNotice(message, type) {
      if (cepNotice) {
        cepNotice.textContent = message;
        cepNotice.classList.remove(
          "hidden",
          "text-red-800",
          "bg-red-100",
          "border-red-300",
          "text-green-800",
          "bg-green-100",
          "border-green-300"
        );
        if (type === "error") {
          cepNotice.classList.add(
            "text-red-800",
            "bg-red-100",
            "border-red-300"
          );
        } else if (type === "success") {
          cepNotice.classList.add(
            "text-green-800",
            "bg-green-100",
            "border-green-300"
          );
        }
        cepNotice.classList.remove("hidden");
      }
    }

    function clearNotice() {
      if (cepNotice) {
        cepNotice.classList.add("hidden");
        cepNotice.textContent = "";
      }
    }

    if (
      cepInput &&
      enderecoInput &&
      bairroInput &&
      cidadeInput &&
      numInput &&
      cepNotice &&
      cepSpinner &&
      valorEntregaInput
    ) {
      cepInput.addEventListener("input", async () => {

        if (cepInput.disabled || document.querySelector('input[name="retirada"]:checked')?.value === 'sim') return; // Ignora se o campo estiver desabilitado
        const cep = cepInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        clearNotice();

        if (cep.length < 8) {
          // Limpa campos se CEP incompleto
          enderecoInput.value = "";
          bairroInput.value = "";
          cidadeInput.value = "";
          valorEntregaInput.value = "";
          updateCheckoutTotal();
          return;
        }

        if (cep.length === 8) {
          cepSpinner.classList.remove("hidden"); // Show spinner
          try {
            const response = await fetch(
              `https://viacep.com.br/ws/${cep}/json/`
            );
            const data = await response.json();

            if (data.erro) {
              setNotice("CEP não encontrado.", "error");
              enderecoInput.value = "";
              bairroInput.value = "";
              cidadeInput.value = "";
              valorEntregaInput.value = "";
              updateCheckoutTotal();
            } else {
              // Normalização da cidade retornada pela API (remove acentos e põe minúsculo)
              const cidadeNormalizada = data.localidade
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

              // Verifica se a cidade normalizada existe no nosso mapa
              const cidadeAtendida = CIDADES_ATENDIDAS[cidadeNormalizada];
              if (cidadeAtendida) {
                enderecoInput.value = data.logradouro || "";
                bairroInput.value = data.bairro || "";
                cidadeInput.value = data.localidade || "";

                // Define o valor com base no mapa
                valorEntregaInput.value = cidadeAtendida.id;

                setNotice("Endereço preenchido e taxa calculada!", "success");
                numInput.focus();
              } else {
                setNotice(
                  "Desculpe, no momento só entregamos em Maringá, Sarandi e Marialva.",
                  "error"
                );
                enderecoInput.value = "";
                bairroInput.value = "";
                cidadeInput.value = "";
                valorEntregaInput.value = "";
              }
            }
          } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setNotice("Erro ao buscar CEP. Tente novamente.", "error");
            enderecoInput.value = "";
            bairroInput.value = "";
            cidadeInput.value = "";
            valorEntregaInput.value = "";
          } finally {
            cepSpinner.classList.add("hidden"); // Hide spinner
          }
          updateCheckoutTotal(); // Garante que o total seja atualizado após a busca
        }
      });
    }

    if (closeButton) closeButton.addEventListener("click", closeModal);

    checkoutModal.addEventListener("click", (e) => {
      if (e.target === checkoutModal) closeModal();
    });

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Check final de validação de horário antes de enviar
        if (timeNotice && !timeNotice.classList.contains("hidden")) {
          // Se o aviso de erro de horário está visível, não deixa enviar
          window.showCustomAlert(
            "Por favor, corrija o horário de entrega antes de continuar.",
            "Horário Inválido"
          );
          return;
        }

        // Check de feriado antes de enviar
        const holidayNotice = document.getElementById("holiday-delivery-notice");
        if (holidayNotice && !holidayNotice.classList.contains("hidden")) {
          window.showCustomAlert(
            "Não realizamos entregas nos dias 25/12/2025 e 01/01/2026. Por favor, escolha outra data.",
            "Data Indisponível"
          );
          return;
        }

        const formData = new FormData(form);
        const details = Object.fromEntries(formData.entries());

        saveAddressToStorage(details); // Salva o endereço para a próxima vez

        const now = new Date();
        const dataPedido = now.toLocaleDateString("pt-BR");
        const horaPedido = now.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

        const numeroWhatsApp = "554499024212";
        let message = "Olá, Angela! Gostaria de encomendar:\n";
        message += `📅 Pedido realizado em: ${dataPedido} às ${horaPedido}\n\n`;
        message += "--- ITENS DO PEDIDO ---\n\n";
        let itemsTotalPrice = 0;

        cart.forEach((item) => {
          message += `${item.name} (${item.size})\n`;
          itemsTotalPrice += item.price;
        });

        const deliveryCity = Object.values(CIDADES_ATENDIDAS).find(c => c.id === details.valor_entrega);
        const deliveryFee = deliveryCity ? deliveryCity.taxa : 0;

        const grandTotal = itemsTotalPrice + deliveryFee;

        message += `\nSubtotal dos Itens: ${formatCurrency(
          itemsTotalPrice
        )}\n`;

        if (deliveryFee > 0) {
          message += `Taxa de Entrega: ${formatCurrency(deliveryFee)}\n`;
        }

        message += `Total do Pedido: ${formatCurrency(grandTotal)}\n\n\n`;

        const isRetirada = details.retirada === 'sim';

        message += isRetirada ? "--- DADOS PARA RETIRADA ---\n" : "--- DADOS PARA ENTREGA ---\n";
        message += `Nome: ${details.nome}\n`;
        message += `Vela de brinde?: ${details.vela}\n`;
        
        const dateLabel = isRetirada ? "Data de retirada" : "Data de entrega";
        message += `${dateLabel}: ${details.data_entrega
          .split("-")
          .reverse()
          .join("/")}\n`;
        
        const timeLabel = isRetirada ? "Horário para retirada" : "Horário para entrega";
        message += `${timeLabel}: entre ${details.horario_inicio}h e ${details.horario_fim}h\n`;

        if (!isRetirada) {
          message += `CEP: ${details.cep}\n`;
          message += `Endereço: ${details.endereco}, Nº ${details.num}\n`;
          if (details.ap) message += `Ap: ${details.ap}\n`;
          if (details.predio) message += `Prédio: ${details.predio}\n`;
          message += `Bairro: ${details.bairro}\n`;
          message += `Cidade: ${details.cidade}\n\n\n`;
        } else {
          message += `Modalidade: Retirada no local\n\n\n`;
        }

        message += "📌\n";
        message += " Aviso Importante\n";
        message +=
          "Como nossos bolos são artesanais, o peso final pode variar entre 100 g e 300 g para mais.\n";
        message +=
          "O valor constatado no site corresponde ao peso base (1 kg).\n";

        message +=
          "Após a pesagem final, enviaremos pelo WhatsApp o ajuste de diferença, caso necessário.";

        const whatsappUrl = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
          message
        )}`;
        window.open(whatsappUrl, "_blank"); // limpa carrinho

        cart = [];
        saveCartToStorage();
        updateCart();

        closeModal();

        const successModal = document.getElementById("success-modal");
        const closeSuccessModalButton = document.getElementById(
          "close-success-modal"
        );

        if (successModal) {
          successModal.classList.remove("hidden");
          successModal.classList.add("flex");

          if (closeSuccessModalButton) {
            closeSuccessModalButton.addEventListener(
              "click",
              () => {
                successModal.classList.add("hidden");
                successModal.classList.remove("flex");
              },
              { once: true }
            );
          }

          successModal.addEventListener(
            "click",
            (e) => {
              if (e.target === successModal) {
                successModal.classList.add("hidden");
                successModal.classList.remove("flex");
              }
            },
            { once: true }
          );
        }
      });
    }
  }

  function initNovidadeModal() {
    const novidadeIsland = document.getElementById("novidade-island");
    const novidadeModal = document.getElementById("novidade-modal");
    const closeModalFooterButton = document.getElementById(
      "close-novidade-modal-footer"
    );
    const modalContent = document.getElementById("novidade-modal-content");
    const cardToClone = document.getElementById("card-floresta-branca");

    if (!novidadeIsland || !novidadeModal || !closeModalFooterButton) {
      return;
    }

    const openModal = () => {
      // Verifica se o card para clonar existe antes de tentar
      if (!cardToClone) {
        console.warn("Card 'Floresta Branca' não encontrado para clonagem.");
        return;
      }

      modalContent.innerHTML = "";
      const clonedCard = cardToClone.cloneNode(true);
      clonedCard.removeAttribute("id");

      // OTIMIZAÇÃO: Garante que a imagem dentro do modal carregue com lazy loading
      const clonedImg = clonedCard.querySelector("img");
      if (clonedImg) clonedImg.setAttribute("loading", "lazy");

      modalContent.appendChild(clonedCard);

      const newAddToCartButton = clonedCard.querySelector(
        "[onclick^='addToCart']"
      );
      if (newAddToCartButton) {
        newAddToCartButton.onclick = () => {
          addToCart("Floresta Branca", newAddToCartButton);
          closeModal();
        };
      }

      const newStrogonoffButton = clonedCard.querySelector(
        "[onclick^='addStrogonoffToCart']"
      );
      if (newStrogonoffButton) {
        newStrogonoffButton.onclick = () =>
          addStrogonoffToCart(newStrogonoffButton);
      }

      const newEmbalagensButton = clonedCard.querySelector(
        "[onclick^='openEmbalagensModal']"
      );
      if (newEmbalagensButton) {
        newEmbalagensButton.onclick = () => openEmbalagensModal();
      }

      novidadeModal.classList.remove("hidden");
      novidadeModal.classList.add("flex");
    };

    const closeModal = () => {
      novidadeModal.classList.add("hidden");
      novidadeModal.classList.remove("flex");
    };

    novidadeIsland.addEventListener("click", openModal);
    closeModalFooterButton.addEventListener("click", closeModal);
    novidadeModal.addEventListener("click", (e) => {
      if (e.target === novidadeModal) {
        closeModal();
      }
    });
  }

  window.showCustomAlert = (message, title = "Aviso") => {
    const modal = document.getElementById("custom-alert-modal");
    if (!modal) {
      alert(`${title}: ${message}`);
      return;
    }

    const titleEl = document.getElementById("custom-alert-title");
    const messageEl = document.getElementById("custom-alert-message");
    const modalContent = modal.querySelector('div'); // Get the content div

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;

    // Add/remove a class for styling based on the title
    if (modalContent) {
      if (title === 'Debug') {
          modalContent.classList.add('debug-alert');
      } else {
          modalContent.classList.remove('debug-alert');
      }
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  };

  const closeCustomAlert = () => {
    const modal = document.getElementById("custom-alert-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const customAlertModal = document.getElementById("custom-alert-modal");
    if (customAlertModal) {
      const closeBtn = document.getElementById("custom-alert-close");
      const xCloseBtn = document.getElementById("custom-alert-x-close");
      const closeModal = () => {
        closeCustomAlert();
      };
      if (closeBtn) closeBtn.addEventListener("click", closeModal);
      if (xCloseBtn) xCloseBtn.addEventListener("click", closeModal);
      customAlertModal.addEventListener("click", (e) => {
        if (e.target === customAlertModal) closeModal();
      });
    }

    initMobileMenu();
    initModals();
    initPackagingModal();
    initSaberMaisModal();
    initCartPanel();
    initCheckoutModal();
    initNovidadeModal();
    initSelectChangeReset(); // Inicializa o reset dos botões
    initImageOptimization(); // Inicializa otimização de imagens
    initPotesFilter(); // Inicializa o filtro de bolos no pote
    initShimmerEffect(); // Adiciona o efeito de brilho nos cards

    if (document.getElementById("cart-items")) displayCartItemsOnCartPage();

    updateCart();
  });

  function addPackagingToCart(
    packagingName,
    packagingDescription,
    packagingPrice
  ) {
    const uniqueId = `packaging-${packagingName}`.replace(/\s+/g, "-");
    if (cart.some((item) => item.id === uniqueId)) return;

    const itemPrice = parseFloat(
      packagingPrice.replace("R$", "").replace(",", ".").trim()
    );

    cart.push({
      id: uniqueId,
      name: packagingName,
      size: packagingDescription,
      price: itemPrice,
      type: "packaging",
    });
    saveCartToStorage();
    updateCart();

    // Abrir carrinho ao adicionar embalagem também
    const cartPanel = document.getElementById("cart-panel");
    const cartOverlay = document.getElementById("cart-panel-overlay");
    if (
      cart.length === 1 &&
      cartPanel &&
      cartPanel.classList.contains("translate-x-full")
    ) {
      cartPanel.classList.remove("translate-x-full");
      cartOverlay.classList.remove("hidden");
    }
  }

  window.addToCart = addToCart;
  window.addStrogonoffToCart = addStrogonoffToCart;
  window.removeFromCart = removeFromCart;
  window.addPackagingToCart = addPackagingToCart;

  window.carrinhoInitialized = true;
})();