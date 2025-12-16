document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------
    // ELEMENTOS PRINCIPAIS
    // -----------------------------
    const modal = document.getElementById('christmas-modal');
    const openBtn = document.getElementById('open-modal-btn');
    const backdrop = modal.querySelector('.modal-backdrop');
    
    // -----------------------------
    // FUNÇÃO FECHAR PÁGINA PRINCIPAL
    // -----------------------------
    window.fecharPaginaPrincipal = () => {
        if (window.parent && window.parent !== window) {
            try {
                const overlayNoPai = window.parent.document.getElementById('natal-popup-overlay');
                if (overlayNoPai) {
                    overlayNoPai.classList.remove('active');
                    window.parent.document.body.style.overflow = '';
                    setTimeout(() => {
                        overlayNoPai.style.display = 'none';
                    }, 300);
                    return;
                }
            } catch (e) {
                console.log('Erro ao acessar o pai:', e);
            }
        }
        
        window.location.href = 'menu.html';
    };

    // -----------------------------
    // BLOQUEIO DE SCROLL (Fixado para funcionar com overflow-y: auto)
    // -----------------------------
    let scrollY = 0;

    const lockScroll = () => {
        // Guarda a posição atual
        scrollY = window.scrollY;
        // Trava o body como fixed na posição atual para não rolar
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
    };

    const unlockScroll = () => {
        // Restaura as propriedades
        document.body.style.overflow = 'auto'; // Importante: restaura o scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        // Volta para a posição que estava
        window.scrollTo(0, scrollY);
    };

    // -----------------------------
    // MODAL PRINCIPAL
    // -----------------------------
    window.closeModal = () => {
        modal.classList.remove('show');
        unlockScroll();
    };

    const openModal = () => {
        if (modal.classList.contains('show')) return;
        modal.classList.add('show');
        lockScroll();
        sessionStorage.setItem('natalModalShown', 'true');
    };

    openBtn?.addEventListener('click', openModal);
    backdrop?.addEventListener('click', window.closeModal);

    if (!sessionStorage.getItem('natalModalShown')) {
        setTimeout(() => {
            openModal();
        }, 1500);
    }

    // -----------------------------
    // SUB-MODAIS
    // -----------------------------
    window.openSubModal = (id) => {
        const sub = document.getElementById(id);
        if (!sub) return;
        sub.classList.add('show');
    };

    window.closeSubModal = (id) => {
        const sub = document.getElementById(id);
        if (!sub) return;
        sub.classList.remove('show');
    };

    // -----------------------------
    // NEVE ANIMADA
    // -----------------------------
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        const maxFlakes = 40;

        const spawnSnowflake = () => {
            if (document.hidden) return;

            const flakes = document.querySelectorAll('.snowflake');
            if (flakes.length >= maxFlakes) flakes[0].remove();

            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.textContent = Math.random() > 0.5 ? '❄' : '❅';

            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.fontSize = (8 + Math.random() * 12) + 'px';
            flake.style.animationDuration = (5 + Math.random() * 5) + 's';
            flake.style.opacity = (0.2 + Math.random() * 0.6);

            document.body.appendChild(flake);

            setTimeout(() => flake.remove(), 10000);
        };

        setInterval(spawnSnowflake, 350);
    }

    // -----------------------------
    // CONTAGEM REGRESSIVA NATAL
    // -----------------------------
    function startCountdown() {
        const ids = ['days', 'hours', 'minutes', 'seconds'];
        const els = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));

        const container = document.getElementById('countdown');
        if (!container) return;

        let target = new Date(new Date().getFullYear(), 11, 25);
        if (Date.now() > target) target.setFullYear(target.getFullYear() + 1);

        const update = () => {
            const diff = target - Date.now();

            if (diff <= 0) {
                if (document.getElementById('countdown')) {
                    container.innerHTML =
                        `<div class="glass-card p-4 rounded-xl text-white font-bold text-2xl animate-pulse">
                            🎄 Feliz Natal!
                        </div>`;
                }
                return;
            }

            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            els.days.textContent = String(d).padStart(2, '0');
            els.hours.textContent = String(h).padStart(2, '0');
            els.minutes.textContent = String(m).padStart(2, '0');
            els.seconds.textContent = String(s).padStart(2, '0');

            requestAnimationFrame(update);
        };

        update();
    }

    startCountdown();
});
