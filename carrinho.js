(function () {
  if (window.carrinhoInitialized) {
    return;
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
          videoEmbalagens.currentTime = 0;
        }
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
        if (event.target === saberMaisModal)
          saberMaisModal.classList.add("hidden");
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
    const weightMatch = optionText.match(/(\d+,\d+|\d+)\s*(k?g)/i);
    const priceMatch = optionText.match(/\+\s*R\$\s*(\d+,\d+)/);

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
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
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
    const card = buttonElement.closest('.relative, [class*="bg-[#FAF8F0]"]');
    const selectElement = card.querySelector(".cake-size-select");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const size = selectedOption.text;

    const uniqueId = `${cakeName}-${size}`.replace(/\s+/g, "-");
    if (cart.some((item) => item.id === uniqueId)) return;

    const { weightInKg, packagingCost } = parseSizeAndPrice(size);
    const cakePricePerKg = cakePrices[cakeName] || 150;
    const itemPrice = weightInKg * cakePricePerKg + packagingCost;

    cart.push({ id: uniqueId, name: cakeName, size, price: itemPrice });
    saveCartToStorage();

    updateCart();
    buttonElement.textContent = "Adicionado";
    buttonElement.classList.add("bg-green-500", "cursor-not-allowed");
    buttonElement.classList.remove("btn-gold-metallic");
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
        cartItemsPanel.appendChild(itemElement);
      });
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

    cartItemsContainer.innerHTML = "";
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
        cartItemsContainer.appendChild(itemCard);
      });

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

    const openModal = (e) => {
      e.preventDefault();
      checkoutModal.classList.remove("hidden");
      checkoutModal.classList.add("flex");
    };

    const closeModal = () => {
      checkoutModal.classList.add("hidden");
      checkoutModal.classList.remove("flex");
    };

    openButtons.forEach((btn) => {
      if (btn) btn.addEventListener("click", openModal);
    });

    // Funcionalidade de Auto-preenchimento com ViaCEP
    const cepInput = document.getElementById("cep");
    const enderecoInput = document.getElementById("endereco");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const numInput = document.getElementById("num");
    const cepNotice = document.getElementById("cep-notice");
    const cepSpinner = document.getElementById("cep-spinner");

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
      cepSpinner
    ) {
      cepInput.addEventListener("input", async () => {
        const cidadesAtendidas = ["Maringá", "Sarandi", "Marialva"];

        const cep = cepInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        clearNotice(); // Clear any previous notices

        if (cep.length < 8) {
          // If CEP is incomplete, clear fields and return
          enderecoInput.value = "";
          bairroInput.value = "";
          cidadeInput.value = "";
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
            } else {
              // Verifica se a cidade do CEP está na lista de cidades atendidas
              if (cidadesAtendidas.includes(data.localidade)) {
                enderecoInput.value = data.logradouro || "";
                bairroInput.value = data.bairro || "";
                cidadeInput.value = data.localidade || "";
                setNotice("Endereço preenchido!", "success");
                numInput.focus(); // Move o foco para o campo de número
              } else {
                setNotice(
                  "Desculpe, no momento só entregamos em Maringá, Sarandi e Marialva.",
                  "error"
                );
                enderecoInput.value = "";
                bairroInput.value = "";
                cidadeInput.value = "";
              }
            }
          } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setNotice("Erro ao buscar CEP. Tente novamente.", "error");
            enderecoInput.value = "";
            bairroInput.value = "";
            cidadeInput.value = "";
          } finally {
            cepSpinner.classList.add("hidden"); // Hide spinner
          }
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
        const formData = new FormData(form);
        const details = Object.fromEntries(formData.entries());

        let message = "Olá, Angela! Gostaria de encomendar:\n\n";
        message += "*--- ITENS DO PEDIDO ---*\n";
        let totalPrice = 0;

        cart.forEach((item) => {
          message += `- ${item.name} (${item.size})\n`;
          totalPrice += item.price;
        });

        message += `\n*Total dos Itens: ${formatCurrency(totalPrice)}*\n\n`;
        message += "*--- DADOS PARA ENTREGA ---*\n";
        message += `*Nome:* ${details.nome}\n`;
        message += `*Vela de brinde?:* ${details.vela}\n`;
        message += `*Data de entrega:* ${details.data_entrega
          .split("-")
          .reverse()
          .join("/")}\n`;
        message += `*Horário para entrega:* entre ${details.horario_inicio}h e ${details.horario_fim}h\n`;
        message += `*CEP:* ${details.cep}\n`;
        message += `*Endereço:* ${details.endereco}, Nº ${details.num}\n`;
        if (details.ap) message += `*Ap:* ${details.ap}\n`;
        if (details.predio) message += `*Prédio:* ${details.predio}\n`;
        message += `*Bairro:* ${details.bairro}\n`;
        message += `*Cidade:* ${details.cidade}\n`;
        if (details.valor_entrega)
          message += `*Valor da entrega:* ${details.valor_entrega}\n`;

        message += "\n*📌 Aviso Importante*\n";
        message +=
          "Como nossos bolos são artesanais, o peso final pode variar entre 100 g e 300 g para mais.\n";
        message += "O valor pago no site corresponde ao peso base (1 kg).\n";
        message +=
          "Após a pesagem final, enviaremos pelo WhatsApp o ajuste de diferença, caso necessário.";

        const whatsappUrl = `https://wa.me/554499024212?text=${encodeURIComponent(
          message
        )}`;
        window.open(whatsappUrl, "_blank");

        // limpa carrinho
        cart = [];
        saveCartToStorage();
        // A função updateCart() já é chamada dentro de si mesma, mas vamos garantir que o painel seja atualizado.
        updateCart();

        closeModal(); // Close the checkout modal

        const successModal = document.getElementById("success-modal");
        const closeSuccessModalButton = document.getElementById(
          "close-success-modal"
        );

        if (successModal) {
          successModal.classList.remove("hidden");
          successModal.classList.add("flex"); // Use flex to center

          if (closeSuccessModalButton) {
            closeSuccessModalButton.addEventListener(
              "click",
              () => {
                successModal.classList.add("hidden");
                successModal.classList.remove("flex");
              },
              { once: true }
            ); // Ensure event listener is added only once
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
          ); // Ensure event listener is added only once
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

    if (
      !novidadeIsland ||
      !novidadeModal ||
      !closeModalFooterButton ||
      !cardToClone
    ) {
      return;
    }

    const openModal = () => {
      // Limpa o conteúdo anterior e clona o card atualizado
      modalContent.innerHTML = "";
      const clonedCard = cardToClone.cloneNode(true);
      clonedCard.removeAttribute("id"); // Evita IDs duplicados
      modalContent.appendChild(clonedCard);

      // Reatribui os eventos de clique para os botões dentro do modal clonado
      const newAddToCartButton = clonedCard.querySelector(
        "[onclick^='addToCart']"
      );
      if (newAddToCartButton) {
        newAddToCartButton.onclick = () => {
          addToCart("Floresta Branca", newAddToCartButton);
          closeModal(); // Fecha o modal ao adicionar ao carrinho
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

  // Expõe a função globalmente de forma imediata
  window.showCustomAlert = (message, title = "Aviso") => {
    const modal = document.getElementById("custom-alert-modal");
    if (!modal) {
      // Fallback para o alerta padrão caso o modal não seja encontrado
      alert(`${title}: ${message}`);
      return;
    }

    const titleEl = document.getElementById("custom-alert-title");
    const messageEl = document.getElementById("custom-alert-message");

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  };

  // Função para fechar o modal de alerta, definida em um escopo acessível
  const closeCustomAlert = () => {
    const modal = document.getElementById("custom-alert-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    // Apenas configura os eventos de fechamento do modal após o DOM carregar
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
  }

  window.addToCart = addToCart;
  window.addStrogonoffToCart = addStrogonoffToCart;
  window.removeFromCart = removeFromCart;
  window.addPackagingToCart = addPackagingToCart;

  window.carrinhoInitialized = true;
})();
