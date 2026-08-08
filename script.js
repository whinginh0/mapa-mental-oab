/**
 * +200 MAPAS MENTAIS PARA O 47º EXAME DA OAB
 * JavaScript de Interatividade, Duplo Carrossel Infinito e Modal Lightbox
 */

const CONFIG = {
  CHECKOUT_BASICO: "https://ggcheckout.app/checkout/v5/oOVAXfpfJD93KEhEJthO",
  CHECKOUT_COMPLETO: "https://ggcheckout.app/checkout/v5/Ncn5umuWnEHdamcy6CfT",
  COUNTDOWN_MINUTES: 15
};

// ==========================================================================
// DADOS DOS 10 MAPAS MENTAIS DEMONSTRATIVOS (CARREGAMENTO LEVE E RÁPIDO)
// ==========================================================================
const MAPAS_ROW_1 = [
  { img: "https://i.ibb.co/Hp4KbMzR/000-capa.png", title: "Capa do Material — 47º Exame OAB" },
  { img: "https://i.ibb.co/FkFnMRP4/001-prerrogativas-do-advogado.png", title: "001 — Prerrogativas do Advogado" },
  { img: "https://i.ibb.co/whZgLBj9/004-inscricoes-transferencia-cancelamento.png", title: "004 — Inscrições e Cancelamento" },
  { img: "https://i.ibb.co/xq6BMmJf/006-honorarios-advocaticios.png", title: "006 — Honorários Advocatícios" },
  { img: "https://i.ibb.co/gZJpxCTW/016-direitos-garantias-fundamentais.png", title: "016 — Direitos e Garantias Fundamentais" }
];

const MAPAS_ROW_2 = [
  { img: "https://i.ibb.co/fGzBL6ty/018-remedios-constitucionais.png", title: "018 — Remédios Constitucionais" },
  { img: "https://i.ibb.co/200Zyj62/077-fato-tipico-e-relacao-de-causalidade.png", title: "077 — Fato Típico e Causalidade" },
  { img: "https://i.ibb.co/sdgLt5yT/079-ilicitude-e-excludentes.png", title: "079 — Ilicitude e Excludentes" },
  { img: "https://i.ibb.co/9mF534y1/107-jornada-de-trabalho.png", title: "107 — Jornada de Trabalho" },
  { img: "https://i.ibb.co/DHk2RNdD/097-prisao-preventiva-e-temporaria.png", title: "097 — Prisão Preventiva e Temporária" }
];

// ==========================================================================
// 1. CONTADOR REGRESSIVO SINCRONIZADO E PERSISTENTE
// ==========================================================================
function initCountdown() {
  const STORAGE_KEY = "oab_offer_expire_time_v1";
  let targetTime = localStorage.getItem(STORAGE_KEY);
  const now = new Date().getTime();

  if (!targetTime || parseInt(targetTime, 10) < now) {
    targetTime = now + CONFIG.COUNTDOWN_MINUTES * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, targetTime.toString());
  } else {
    targetTime = parseInt(targetTime, 10);
  }

  function update() {
    const current = new Date().getTime();
    let distance = targetTime - current;

    if (distance <= 0) {
      targetTime = new Date().getTime() + CONFIG.COUNTDOWN_MINUTES * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, targetTime.toString());
      distance = targetTime - current;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const fHours = String(hours).padStart(2, "0");
    const fMinutes = String(minutes).padStart(2, "0");
    const fSeconds = String(seconds).padStart(2, "0");

    document.querySelectorAll('[data-unit="hours"]').forEach(el => el.textContent = fHours);
    document.querySelectorAll('[data-unit="minutes"]').forEach(el => el.textContent = fMinutes);
    document.querySelectorAll('[data-unit="seconds"]').forEach(el => el.textContent = fSeconds);
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// 2. DUPLO CARROSSEL INFINITO (HORIZONTAL ESQUERDA & DIREITA)
// ==========================================================================
function initDoubleMarquee() {
  const trackTop = document.getElementById("marquee-track-top");
  const trackBottom = document.getElementById("marquee-track-bottom");

  function createCard(mapa) {
    const card = document.createElement("div");
    card.className = "map-card-slide";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("title", `Clique para ampliar: ${mapa.title}`);

    card.innerHTML = `
      <div class="map-card-slide__inner">
        <img src="${mapa.img}" alt="${mapa.title}" class="map-card-slide__img" loading="lazy" decoding="async" width="380" height="260">
        <div class="map-card-slide__overlay">
          <span class="map-card-slide__zoom-icon">🔍 Ampliar Mapa</span>
        </div>
      </div>
      <div class="map-card-slide__caption">${mapa.title}</div>
    `;

    card.addEventListener("click", () => openMapModal(mapa.img, mapa.title));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openMapModal(mapa.img, mapa.title);
      }
    });

    return card;
  }

  // Preenche a Carreira 1 (Movimentação para a Esquerda) duplicando para loop contínuo
  if (trackTop) {
    trackTop.innerHTML = "";
    // Conjunto original
    MAPAS_ROW_1.forEach(mapa => trackTop.appendChild(createCard(mapa)));
    // Conjunto duplicado para loop perfeito sem cortes
    MAPAS_ROW_1.forEach(mapa => trackTop.appendChild(createCard(mapa)));
  }

  // Preenche a Carreira 2 (Movimentação para a Direita) duplicando para loop contínuo
  if (trackBottom) {
    trackBottom.innerHTML = "";
    // Conjunto original
    MAPAS_ROW_2.forEach(mapa => trackBottom.appendChild(createCard(mapa)));
    // Conjunto duplicado para loop perfeito sem cortes
    MAPAS_ROW_2.forEach(mapa => trackBottom.appendChild(createCard(mapa)));
  }
}

// ==========================================================================
// 3. MODAL LIGHTBOX PARA VISUALIZAÇÃO AMPLIADA
// ==========================================================================
function openMapModal(imgSrc, title) {
  const modal = document.getElementById("map-modal");
  const modalImg = document.getElementById("map-modal-img");
  const modalTitle = document.getElementById("map-modal-title");

  if (!modal || !modalImg) return;

  modalImg.src = imgSrc;
  modalImg.alt = title;
  if (modalTitle) modalTitle.textContent = title;

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeMapModal() {
  const modal = document.getElementById("map-modal");
  if (!modal) return;

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function initModalEvents() {
  const modal = document.getElementById("map-modal");
  const closeBtn = document.getElementById("map-modal-close");
  const backdrop = document.getElementById("map-modal-backdrop");

  if (closeBtn) closeBtn.addEventListener("click", closeMapModal);
  if (backdrop) backdrop.addEventListener("click", closeMapModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMapModal();
  });
}

// ==========================================================================
// 4. FAQ ACCORDION INTERATIVO
// ==========================================================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const trigger = item.querySelector(".faq-question") || item;
    const body = item.querySelector(".faq-item__body");

    // Garante que comece 100% fechado
    item.classList.remove("active");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    if (body) {
      body.style.display = "none";
      body.style.maxHeight = "0px";
    }

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const isActive = item.classList.contains("active");

      // Fecha todos os outros itens para manter limpo
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          const otherBtn = otherItem.querySelector(".faq-question");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          const otherBody = otherItem.querySelector(".faq-item__body");
          if (otherBody) {
            otherBody.style.display = "none";
            otherBody.style.maxHeight = "0px";
          }
        }
      });

      // Alterna o item atual
      if (!isActive) {
        item.classList.add("active");
        trigger.setAttribute("aria-expanded", "true");
        if (body) {
          body.style.display = "block";
          body.style.maxHeight = body.scrollHeight + 30 + "px";
        }
      } else {
        item.classList.remove("active");
        trigger.setAttribute("aria-expanded", "false");
        if (body) {
          body.style.display = "none";
          body.style.maxHeight = "0px";
        }
      }
    });
  });
}

// ==========================================================================
// 5. SMOOTH SCROLL PARA ANCHORS INTERNOS
// ==========================================================================
function initSmoothScrollAndLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 60;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });
}

// ==========================================================================
// 6. CAPTURA E INJEÇÃO AUTOMÁTICA E INSTANTÂNEA DE PARÂMETROS UTM (UTMIFY & META ADS)
// ==========================================================================
function getUtmParams() {
  const currentSearch = window.location.search;
  const storedParams = sessionStorage.getItem("oab_utm_params");

  if (currentSearch && currentSearch.length > 1) {
    sessionStorage.setItem("oab_utm_params", currentSearch);
    return currentSearch;
  }

  return storedParams || "";
}

function appendUtmsToUrl(baseUrl) {
  const utmString = getUtmParams();
  if (!utmString) return baseUrl;

  // Garante formato correto sem duplicar '?'
  const cleanUtms = utmString.startsWith("?") ? utmString.substring(1) : utmString;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}${cleanUtms}`;
}

function initUtmCheckoutLinks() {
  const checkoutLinks = document.querySelectorAll(".js-checkout-link, a[href*='ggcheckout.app']");

  checkoutLinks.forEach(link => {
    // Garante que o redirecionamento ocorra estritamente na mesma aba
    link.removeAttribute("target");
    link.setAttribute("target", "_self");

    // Injeta os parâmetros imediatamente ao carregar a página
    const currentHref = link.getAttribute("href") || "";
    if (currentHref && !currentHref.startsWith("#")) {
      link.href = appendUtmsToUrl(currentHref);
    }

    // Ao clicar ou tocar, atualiza instantaneamente para garantir 100% de precisão no tracking da Utmify
    const handleCheckoutClick = function () {
      const type = link.getAttribute("data-checkout");
      let baseCheckoutUrl = type === "basic" ? CONFIG.CHECKOUT_BASICO : CONFIG.CHECKOUT_COMPLETO;

      const finalUrl = appendUtmsToUrl(baseCheckoutUrl);
      link.href = finalUrl;

      // Dispara evento InitiateCheckout no Meta Pixel
      if (typeof window.fbq === "function") {
        try {
          window.fbq("track", "InitiateCheckout", {
            content_name: type === "basic" ? "Plano Básico OAB" : "Plano Completo OAB",
            value: type === "basic" ? 37.90 : 47.90,
            currency: "BRL"
          });
        } catch (err) {
          console.warn("Meta Pixel InitiateCheckout error:", err);
        }
      }
    };

    link.addEventListener("click", handleCheckoutClick);
    link.addEventListener("touchstart", handleCheckoutClick, { passive: true });
    link.addEventListener("mousedown", handleCheckoutClick);
  });
}

// ==========================================================================
// INICIALIZAÇÃO GERAL E DE ALTA PERFORMANCE
// ==========================================================================
function initApp() {
  initCountdown();
  initDoubleMarquee();
  initModalEvents();
  initFaqAccordion();
  initSmoothScrollAndLinks();
  initUtmCheckoutLinks();
}

// Inicia a captura de UTMs e configuração dos links o mais cedo possível
getUtmParams();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
