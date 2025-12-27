document.addEventListener('DOMContentLoaded', () => {
  // Seleciona todos os containers de modal (suporta múltiplos modais na página)
  const modalWrappers = document.querySelectorAll('.pote-modal-wrapper');
  
  if (modalWrappers.length === 0) return;

  // --- OTIMIZAÇÃO CRÍTICA PARA MOBILE ---
  // Usa um ÚNICO Observer para todas as imagens, em vez de criar um por modal.
  // Isso previne vazamento de memória e travamentos em celulares.
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.onload = () => img.classList.add('loaded');
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, {
    root: null, // Usa a viewport global (mais leve e compatível)
    rootMargin: '50px',
    threshold: 0.1
  });

  // Itera sobre cada modal encontrado para aplicar a lógica
  modalWrappers.forEach(modalWrapper => {
    
    // 1. Ativa o Lazy Load para as imagens DENTRO deste modal
    const lazyImages = modalWrapper.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.classList.add('lazy-load-image');
      imageObserver.observe(img);
    });

    // 2. Lógica de Quantidade e Preço (Escopo Local por Modal)
    const displayQty = modalWrapper.querySelector('.qty-display-pote');
    const displayTotal = modalWrapper.querySelector('.pote-total-value');
    const buttons = modalWrapper.querySelectorAll('.qty-btn-pote');
    
    // Se não houver botões de controle, pula a lógica de preço
    if (buttons.length < 2) return;

    const btnDecrease = buttons[0];
    const btnIncrease = buttons[1];

    let quantity = 1;
    let unitPrice = 0;

    function getInitialPrice() {
      if (!displayTotal) return 15.00;
      const priceText = displayTotal.innerText
        .replace(/[^\d,]/g, '')
        .replace(',', '.');
      const parsed = parseFloat(priceText);
      return isNaN(parsed) ? 15.00 : parsed;
    }

    unitPrice = getInitialPrice();

    function updateUI() {
      if (displayQty) displayQty.textContent = quantity;
      if (displayTotal) {
        const total = quantity * unitPrice;
        
        // Usa o formatador otimizado do main.js se disponível, senão usa fallback
        displayTotal.textContent = window.formatCurrency ? window.formatCurrency(total) : total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        displayTotal.classList.remove('price-anim');
        void displayTotal.offsetWidth;
        displayTotal.classList.add('price-anim');
      }
    }

    btnDecrease.addEventListener('click', (e) => {
      e.preventDefault();
      if (quantity > 1) {
        quantity--;
        updateUI();
      }
    });

    btnIncrease.addEventListener('click', (e) => {
      e.preventDefault();
      quantity++;
      updateUI();
    });
  });
});