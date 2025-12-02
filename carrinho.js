(function () {
  if (window.carrinhoInitialized) {
    return;
  }

  // --- Função para resetar o botão de compra ao mudar opções (UX) ---
  function initSelectChangeReset() {
    document
      .querySelectorAll(".cake-size-select, .coco-select")
      .forEach((select) => {
        select.addEventListener("change", function () {
          const card = this.closest('.relative, [class*="bg-[#FAF8F0]"]');
          const button = card.querySelector(
            "button[onclick^='addToCart'], button[onclick^='addStrogonoffToCart']"
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

    const openModal = () => {
      if (saberMaisModal) {
        saberMaisModal.classList.remove("hidden");
        document.body.classList.add("overflow-hidden"); // Trava o scroll do body
      }
    };

    const closeModal = () => {
      if (saberMaisModal) {
        saberMaisModal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden"); // Libera o scroll do body
      }
    };

    window.openSaberMaisModal = () => {
      if (saberMaisModal) saberMaisModal.classList.remove("hidden");
      openModal();
    };

    if (closeSaberMaisModalButton) {
      closeSaberMaisModalButton.addEventListener("click", () => {
        if (saberMaisModal) saberMaisModal.classList.add("hidden");
      });
      closeSaberMaisModalButton.addEventListener("click", closeModal);
    }

    if (saberMaisModal) {
      saberMaisModal.addEventListener("click", (event) => {
        if (event.target === saberMaisModal)
          saberMaisModal.classList.add("hidden");
        if (event.target === saberMaisModal) closeModal();
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

    // Se o carrinho esvaziar, reseta todos os botões da tela
    if (cart.length === 0) {
      document
        .querySelectorAll(
          "button[onclick^='addToCart'], button[onclick^='addStrogonoffToCart']"
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
      updateCheckoutTotal(); // Atualiza os totais sempre que o modal é aberto
    };

    const closeModal = () => {
      checkoutModal.classList.add("hidden");
      checkoutModal.classList.remove("flex");
    };

    // --- LÓGICA PARA ATUALIZAR TOTAIS NO CHECKOUT ---
    const CIDADES_ATENDIDAS = {
      marialva: { id: "10", taxa: 10.0 },
      maringa: { id: "20", taxa: 25.0 },
      sarandi: { id: "30", taxa: 25.0 },
    };
    
    function updateCheckoutTotal() {
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
      const selectedDeliveryId = valorEntregaSelect.value;
      
      const deliveryCity = Object.values(CIDADES_ATENDIDAS).find(c => c.id === selectedDeliveryId);
      const deliveryCost = deliveryCity ? deliveryCity.taxa : 0;

      const finalTotal = itemsSubtotal + deliveryCost;

      subtotalElement.textContent = formatCurrency(itemsSubtotal);
      deliveryFeeElement.textContent = formatCurrency(deliveryCost); // Corrigido para usar a variável correta
      totalElement.textContent = formatCurrency(finalTotal);
    }

    // Expõe a função para ser chamada de outros lugares (como ao remover item)
    window.updateCheckoutTotal = updateCheckoutTotal;

    // Adiciona um listener para quando o usuário muda a taxa manualmente
    const valorEntregaSelect = document.getElementById("valor_entrega");
    if (valorEntregaSelect) {
      valorEntregaSelect.addEventListener("change", updateCheckoutTotal);
    }
    // --- FIM DA LÓGICA DE TOTAIS ---

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
    // ----------------------------------------

    const updateTimeInputsState = () => {
      // Dispara a validação do horário de início caso a data mude
      if (inicioInput.value) {
        inicioInput.dispatchEvent(new Event("change"));
      }

      if (isToday()) {
        fimInput.setAttribute("readonly", true);
        fimInput.classList.add("bg-gray-100", "cursor-not-allowed");
      } else {
        fimInput.removeAttribute("readonly");
        fimInput.classList.remove("bg-gray-100", "cursor-not-allowed");
      }
    };

    if (dataInput) {
      dataInput.addEventListener("change", updateTimeInputsState);
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
        const FECHAMENTO = 18 * 60; // 18:00
        const currentMinutes = hora * 60 + minuto;

        let errorMsg = "";
        let adjustedTime = null;

        // 1. Validação de horário de funcionamento
        if (currentMinutes < ABERTURA) {
          errorMsg = "Nossas entregas começam apenas às 08:00.";
          adjustedTime = "08:00";
          hora = 8;
          minuto = 0;
        } else if (currentMinutes > FECHAMENTO) {
          errorMsg = "Fechamos às 18:00.";
          adjustedTime = "18:00";
          hora = 18;
          minuto = 0;
        }

        // 2. Validação de antecedência para hoje
        if (!errorMsg && isToday()) {
          const now = new Date();
          const currentNowMinutes = now.getHours() * 60 + now.getMinutes();
          const antecedenciaMinima = 120; // 2 horas em minutos

          // Se escolheu um horário muito próximo (menos de 2h)
          if (currentMinutes < currentNowMinutes + antecedenciaMinima) {
            errorMsg = "Para hoje, precisamos de no mínimo 2h de antecedência.";
            // Sugere horário para daqui 2h (arredondando a hora seguinte)
            const novaHora = now.getHours() + 2;
            hora = novaHora;
            minuto = 0;
            adjustedTime = `${String(novaHora).padStart(2, "0")}:00`;
          }

          // Regra específica: Se for hoje e a sugestão passar das 18h ou já for tarde
          if (hora * 60 + minuto > FECHAMENTO) {
            errorMsg =
              "Infelizmente já encerramos os pedidos para entrega hoje.";
            adjustedTime = "18:00";
            hora = 18;
          } else if (now.getHours() >= 16) {
            // Se já são 16h, 16+2 = 18h (limite), então avisa
            errorMsg =
              "Pedidos para hoje encerram às 16:00 (para entregar até às 18:00).";
            adjustedTime = "18:00"; // Trava no limite
            hora = 18;
          }
        }

        // Aplica ajustes se necessário
        if (adjustedTime) {
          this.value = adjustedTime;
        } else {
          // Formata bonitinho se estiver tudo certo
          this.value =
            String(hora).padStart(2, "0") +
            ":" +
            String(minuto).padStart(2, "0");
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
        if (horaFinal > 18) horaFinal = 18; // Teto de 18h
        fimInput.value = String(horaFinal).padStart(2, "0") + ":00";
      });

      // Validação do campo FIM (só permite se NÃO for hoje, pois hoje é auto-calc)
      fimInput.addEventListener("change", function () {
        if (isToday()) return; // Ignora se for hoje

        let horaFim = parseInt(this.value.replace(/\D/g, ""));
        let horaInicio = parseInt(inicioInput.value.replace(/\D/g, ""));

        if (timeNotice) timeNotice.classList.add("hidden");

        if (isNaN(horaFim)) return;

        if (horaFim > 18) {
          if (timeNotice && timeNoticeMsg) {
            timeNoticeMsg.textContent = "Fechamos às 18:00.";
            timeNotice.classList.remove("hidden");
          }
          this.value = "18:00";
          horaFim = 18;
        }

        if (!isNaN(horaInicio) && horaFim <= horaInicio) {
          if (timeNotice && timeNoticeMsg) {
            timeNoticeMsg.textContent =
              "O horário final deve ser após o horário de início.";
            timeNotice.classList.remove("hidden");
          }
          this.value = ""; // Limpa para forçar correção
          return;
        }

        this.value = horaFim.toString().padStart(2, "0") + ":00";
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

        const cep = cepInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        clearNotice();

        if (cep.length < 8) {
          // Limpa campos se CEP incompleto
          enderecoInput.value = "";
          bairroInput.value = "";
          cidadeInput.value = "";
          valorEntregaInput.value = "Selecione uma Cidade";
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
              valorEntregaInput.value = "Selecione uma Cidade";
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
                valorEntregaInput.value = "Selecione uma Cidade";
              }
            }
          } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setNotice("Erro ao buscar CEP. Tente novamente.", "error");
            enderecoInput.value = "";
            bairroInput.value = "";
            cidadeInput.value = "";
            valorEntregaInput.value = "Selecione uma Cidade";
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

        const formData = new FormData(form);
        const details = Object.fromEntries(formData.entries());

        const numeroWhatsApp = "554499024212";
        let message = "Olá, Angela! Gostaria de encomendar:\n\n";
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

        message += "--- DADOS PARA ENTREGA ---\n";
        message += `Nome: ${details.nome}\n`;
        message += `Vela de brinde?: ${details.vela}\n`;
        message += `Data de entrega: ${details.data_entrega

          .split("-")
          .reverse()
          .join("/")}\n`;
        message += `Horário para entrega: entre ${details.horario_inicio}h e ${details.horario_fim}h\n`;
        message += `CEP: ${details.cep}\n`;
        message += `Endereço: ${details.endereco}, Nº ${details.num}\n`;
        if (details.ap) message += `Ap: ${details.ap}\n`;
        if (details.predio) message += `Prédio: ${details.predio}\n`;
        message += `Bairro: ${details.bairro}\n`;
        message += `Cidade: ${details.cidade}\n\n\n`;

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

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;

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