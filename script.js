/**
 * RICHARD TOLL — script.js
 * Interactions : navbar, couleurs t-shirt, hover casquettes,
 * scroll animations, menu mobile, smooth scroll, panier.
 */

/* ============================================================
   1. NAVBAR — scroll effect & menu mobile
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ============================================================
   2. T-SHIRT — changement dynamique de couleur
   ============================================================ */
const tshirtImages = {
  blanc: 'images/blanc.jpg',
  bleu:  'images/bleu.jpg',
  rouge: 'images/rouge.jpg',
  noir:  'images/noir.jpg',
};

const tshirtImg   = document.getElementById('tshirt-img');
const colorRadios = document.querySelectorAll('input[name="tshirt-color"]');
const colorOpts   = document.querySelectorAll('.color-opt');

colorRadios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    const color = e.target.value;

    tshirtImg.style.opacity = '0';
    tshirtImg.style.transform = 'scale(0.97)';

    setTimeout(() => {
      tshirtImg.src = tshirtImages[color];
      tshirtImg.alt = `T-shirt Richard Toll — ${color}`;
      tshirtImg.onload = () => {
        tshirtImg.style.opacity = '1';
        tshirtImg.style.transform = 'scale(1)';
      };
      if (tshirtImg.complete) {
        tshirtImg.style.opacity = '1';
        tshirtImg.style.transform = 'scale(1)';
      }
    }, 200);

    colorOpts.forEach(opt => opt.classList.remove('active'));
    e.target.closest('.color-opt').classList.add('active');
  });
});

if (tshirtImg) {
  tshirtImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
}

/* ============================================================
   3. SCROLL ANIMATIONS — Intersection Observer
   ============================================================ */
const revealElements = document.querySelectorAll(
  '.reveal-up, .reveal-fade, .reveal-left, .reveal-right'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ============================================================
   4. HERO — animation au chargement
   ============================================================ */
window.addEventListener('load', () => {
  const heroRevealEls = document.querySelectorAll('.hero-content .reveal-up');
  heroRevealEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, 200 + i * 160);
  });
});

/* ============================================================
   5. SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  });
});

/* ============================================================
   6. ACTIVE NAV LINK
   ============================================================ */
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = '#FAFAF7';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

/* ============================================================
   7. CASQUETTES — hover touch support (mobile)
   ============================================================ */
const capCards = document.querySelectorAll('.cap-hover-wrap');

capCards.forEach(card => {
  card.addEventListener('touchstart', (e) => {
    e.preventDefault();
    card.classList.toggle('force-hover');
  }, { passive: false });
});

const styleTag = document.createElement('style');
styleTag.textContent = `
  .cap-hover-wrap.force-hover .cap-default { opacity: 0; transform: scale(1.05); }
  .cap-hover-wrap.force-hover .cap-model   { opacity: 1; }
  .cap-hover-wrap.force-hover .hover-label { opacity: 1; }
`;
document.head.appendChild(styleTag);

/* ============================================================
   8. PANIER — logique complète
   ============================================================ */

// Catalogue produits
const PRODUCTS = {
  'tshirt':    { name: 'T-Shirt Richard Toll',  price: 6000, image: 'images/blanc.jpg' },
  'totebag':   { name: 'Tote Bag Richard Toll', price: 3000, image: 'images/tod1.jpg'  },

  'cap-noir':  { name: 'Casquette — Noir',  price: 5000, image: 'images/capnoir.jpg'  },
  'cap-blanc': { name: 'Casquette — Blanc', price: 5000, image: 'images/capblanc.jpg' },
  'cap-rouge': { name: 'Casquette — Rouge', price: 5000, image: 'images/caprouge.jpg' },

  'bracelet':  { name: 'Bracelet Richard Toll', price: 2000, image: 'images/bracelet.png' },

  'haut-blanc': {
    name: 'Haut Femme — Blanc',
    price: 6000,
    image: 'images/fwhite.jpg'
  },

  'haut-noir': {
    name: 'Haut Femme — Noir',
    price: 6000,
    image: 'images/fblack.jpg'
  },

  'haut-rouge': {
    name: 'Haut Femme — Rouge',
    price: 6000,
    image: 'images/fred.jpg'
  }
};

let cart = [];

// Éléments DOM du panier
const cartDrawer   = document.getElementById('cartDrawer');
const cartOverlay  = document.getElementById('cartOverlay');
const cartItemsEl  = document.getElementById('cartItems');
const cartFooter   = document.getElementById('cartFooter');
const cartBadgeEl  = document.getElementById('cartBadge');
const cartBtn      = document.getElementById('cartBtn');
const cartClose    = document.getElementById('cartClose');
const cartTotalEl  = document.getElementById('cartTotalAmount');
const cartCheckout = document.getElementById('cartCheckout');

// Ouvrir / fermer
function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Rendu du panier
function renderCart() {
  const total      = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  cartBadgeEl.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Votre panier est vide.</p>
      </div>`;
    cartFooter.style.display = 'none';
    return;
  }

  cartItemsEl.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        ${item.color ? `<div class="cart-item-color">${item.color}</div>` : ''}
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="changeQty(${i}, -1)">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-price">${(item.price * item.qty).toLocaleString('fr-FR')} F</div>
    </div>
  `).join('');

  cartTotalEl.textContent = total.toLocaleString('fr-FR') + ' FCFA';
  cartFooter.style.display = 'block';

  // Message WhatsApp récapitulatif
  const msg = encodeURIComponent(
    'Bonjour Richard Toll 👋\n\nJe souhaite commander :\n' +
    cart.map(i =>
      `• ${i.name}${i.color ? ' (' + i.color + ')' : ''} x${i.qty} — ${(i.price * i.qty).toLocaleString('fr-FR')} FCFA`
    ).join('\n') +
    `\n\nTotal : ${total.toLocaleString('fr-FR')} FCFA`
  );
  cartCheckout.href = `https://wa.me/221761794236?text=${msg}`;
}

// Modifier la quantité
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
}

// Ajouter au panier
function addToCart(productId, color) {
  const p = PRODUCTS[productId];
  if (!p) return;

  // Clé unique : produit + couleur
  const key = productId + (color || '');
  const existing = cart.find(i => i.id === key);

  if (existing) {
    existing.qty++;
  } else {
    // Pour le t-shirt, adapte l'image selon la couleur choisie
    let img = p.image;
    if (productId === 'tshirt' && color && color !== 'blanc') {
      img = `images/${color}.jpg`;
    }
    cart.push({
      id:    key,
      name:  p.name,
      price: p.price,
      image: img,
      color: color || null,
      qty:   1,
    });
  }

  // Animation badge
  cartBadgeEl.classList.remove('bump');
  void cartBadgeEl.offsetWidth; // reflow
  cartBadgeEl.classList.add('bump');
  setTimeout(() => cartBadgeEl.classList.remove('bump'), 400);

  renderCart();
  openCart();
}

// Branche les boutons "Ajouter au panier" de chaque card
document.querySelectorAll('.product-card').forEach(card => {
  const productId = card.dataset.product;
  const addBtn    = card.querySelector('.btn-add-cart');
  if (!addBtn || !productId) return;

  addBtn.addEventListener('click', () => {
    let color = null;
    if (productId === 'tshirt') {
      const checked = card.querySelector('input[name="tshirt-color"]:checked');
      color = checked ? checked.value : 'blanc';
    }
    addToCart(productId, color);
  });
});

// Initialise l'affichage du panier vide
renderCart();