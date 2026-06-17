const WHATSAPP = '5562999999999'; // troque pelo seu WhatsApp com DDI + DDD. Exemplo: 5562999999999

const productImageByCategory = {
  'Steam': 'img/categories/steam.webp',
  'PlayStation': 'img/categories/playstation.webp',
  'Xbox': 'img/categories/xbox.webp',
  'Google Play': 'img/categories/google-play.webp',
  'Jogos': 'img/categories/jogos.webp',
  'Assinaturas': 'img/categories/assinaturas.webp',
  'Free Fire': 'img/categories/jogos.webp',
  'Robux': 'img/categories/google-play.webp',
  'Nintendo': 'img/categories/jogos.webp',
  'Netflix': 'img/categories/assinaturas.webp',
  'Spotify': 'img/categories/assinaturas.webp',
  'Crunchyroll': 'img/categories/assinaturas.webp'
};


const products = [
  { name: 'Gift Card Steam R$ 20', cat: 'Steam', price: 20, tag: 'Promoção' },
  { name: 'Gift Card Steam R$ 50', cat: 'Steam', price: 50, tag: 'Destaque' },
  { name: 'Gift Card Steam R$ 100', cat: 'Steam', price: 100, tag: 'Mais vendido' },
  { name: 'Gift Card Steam R$ 200', cat: 'Steam', price: 200, tag: 'Top vendas' },
  { name: 'PlayStation R$ 35', cat: 'PlayStation', price: 35, tag: 'PSN' },
  { name: 'PlayStation R$ 60', cat: 'PlayStation', price: 60, tag: 'PSN' },
  { name: 'PlayStation R$ 100', cat: 'PlayStation', price: 100, tag: 'Top vendas' },
  { name: 'Xbox Gift Card R$ 50', cat: 'Xbox', price: 50, tag: 'Xbox' },
  { name: 'Xbox Gift Card R$ 100', cat: 'Xbox', price: 100, tag: 'Xbox' },
  { name: 'Google Play R$ 30', cat: 'Google Play', price: 30, tag: 'Apps' },
  { name: 'Google Play R$ 50', cat: 'Google Play', price: 50, tag: 'Apps' },
  { name: 'Google Play R$ 100', cat: 'Google Play', price: 100, tag: 'Apps' },
  { name: 'Nintendo eShop', cat: 'Nintendo', price: 100, tag: 'Nintendo' },
  { name: 'Robux 400', cat: 'Robux', price: 19.90, tag: 'Roblox', image: 'img/products/robux.webp' },
  { name: 'Robux 800', cat: 'Robux', price: 34.90, tag: 'Roblox', image: 'img/products/robux.webp' },
  { name: 'Robux 1700', cat: 'Robux', price: 69.90, tag: 'Roblox', image: 'img/products/robux.webp' },
  { name: 'Free Fire Diamantes', cat: 'Free Fire', price: 19.90, tag: 'Diamantes', image: 'img/products/freefire.webp' },
  { name: 'V-Bucks', cat: 'Jogos', price: 39.90, tag: 'Fortnite' },
  { name: 'FC Points', cat: 'Jogos', price: 49.90, tag: 'EA FC' },
  { name: 'Game Pass Ultimate', cat: 'Assinaturas', price: 49.90, tag: 'Top vendas', image: 'img/products/gamepass.webp' },
  { name: 'PlayStation Plus Essential', cat: 'Assinaturas', price: 39.90, tag: 'PS Plus', image: 'img/products/psplus-essential.webp' },
  { name: 'PlayStation Plus Extra', cat: 'Assinaturas', price: 59.90, tag: 'PS Plus', image: 'img/products/psplus-extra.webp' },
  { name: 'Netflix', cat: 'Netflix', price: 25.90, tag: 'Streaming', image: 'img/products/netflix.webp' },
  { name: 'Spotify Premium', cat: 'Spotify', price: 19.90, tag: 'Streaming', image: 'img/products/spotify.webp' },
  { name: 'Crunchyroll Premium', cat: 'Crunchyroll', price: 14.90, tag: 'Anime', image: 'img/products/crunchyroll.webp' },
  { name: 'Disney+', cat: 'Assinaturas', price: 27.90, tag: 'Streaming', image: 'img/products/disney.webp' }
];


let cart = JSON.parse(localStorage.getItem('vtGamesCart') || '[]');
let currentFilter = '';

function fmt(value) {
  return Number(value) > 0
    ? Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'Consultar';
}

function whatsUrl(text) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

function productImage(product) {
  return product.image || productImageByCategory[product.cat] || 'img/categories/jogos.webp';
}

function saveCart() {
  localStorage.setItem('vtGamesCart', JSON.stringify(cart));
}

function cartTotalItems() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotalPrice() {
  return cart.reduce((sum, item) => sum + ((item.product.price || 0) * item.qty), 0);
}

function renderProducts() {
  const searchInput = document.getElementById('searchInput');
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const query = (searchInput?.value || '').toLowerCase();
  const filtered = products.filter(product => {
    const matchCategory = !currentFilter || product.cat === currentFilter;
    const matchSearch = product.name.toLowerCase().includes(query) || product.cat.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  grid.innerHTML = '';

  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-products">Nenhum produto encontrado.</p>';
    return;
  }

  filtered.forEach(product => {
    const realIndex = products.indexOf(product);
    const card = document.createElement('article');
    card.className = 'product-card product-card-image';
    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${productImage(product)}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.tag || product.cat}</span>
        <strong>${product.name}</strong>
      </div>
      <div class="product-info">
        <small>${product.cat}</small>
        <p class="price">${fmt(product.price)}</p>
        <div class="card-actions">
          <button type="button" onclick="addCart(${realIndex})">Adicionar</button>
          <a target="_blank" rel="noopener" href="${whatsUrl('Olá VT GAMES! Quero comprar: ' + product.name + ' - ' + fmt(product.price))}">Comprar</a>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function addCart(index) {
  const product = products[index];
  const item = cart.find(i => i.product.name === product.name);
  if (item) item.qty += 1;
  else cart.push({ product, qty: 1 });
  saveCart();
  renderCart();
}

function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}

function removeCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function buildOrderMessage() {
  if (!cart.length) return 'Olá VT GAMES! Quero comprar na loja.';

  const lines = cart.map(item => {
    const unit = item.product.price || 0;
    const subtotal = unit * item.qty;
    return `• ${item.product.name}\n  Qtd: ${item.qty} | Unitário: ${fmt(unit)} | Subtotal: ${fmt(subtotal)}`;
  }).join('\n\n');

  return `Olá VT GAMES! Quero finalizar meu pedido:\n\n${lines}\n\nTotal do pedido: ${fmt(cartTotalPrice())}\n\nPode me enviar a chave PIX e confirmar a disponibilidade?`;
}

function renderCart() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutWhats = document.getElementById('checkoutWhats');

  if (cartCount) cartCount.textContent = cartTotalItems();

  if (cartItems) {
    if (!cart.length) {
      cartItems.innerHTML = '<p>Nenhum produto selecionado.</p>';
    } else {
      cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-line">
          <span>${item.product.name}<small>${fmt(item.product.price)} cada</small></span>
          <div class="qty-control">
            <button type="button" onclick="changeQty(${index}, -1)" aria-label="Diminuir quantidade">−</button>
            <b>${item.qty}</b>
            <button type="button" onclick="changeQty(${index}, 1)" aria-label="Aumentar quantidade">+</button>
          </div>
          <strong>${fmt((item.product.price || 0) * item.qty)}</strong>
          <button class="remove-item" type="button" onclick="removeCart(${index})" aria-label="Remover ${item.product.name}">×</button>
        </div>`).join('') + '<button class="clear-cart" type="button" onclick="clearCart()">Limpar carrinho</button>';
    }
  }

  if (cartTotal) cartTotal.textContent = `Total: ${fmt(cartTotalPrice())}`;
  if (checkoutWhats) checkoutWhats.href = whatsUrl(buildOrderMessage());
}

function setupEvents() {
  document.querySelectorAll('[data-cat]').forEach(button => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.cat;
      renderProducts();
      location.hash = 'produtos';
    });
  });

  document.getElementById('clearFilter')?.addEventListener('click', () => {
    currentFilter = '';
    renderProducts();
  });

  document.getElementById('searchInput')?.addEventListener('input', renderProducts);
}

setupEvents();
renderProducts();
renderCart();


/* ===== VT GAMES V10 - Ofertas, banner rotativo e contador ===== */
const vtDeals = [
  { name: 'Gift Card Steam R$ 100', old: 109.90, price: 100.00, badge: 'PROMOÇÃO' },
  { name: 'Game Pass Ultimate', old: 59.90, price: 49.90, badge: 'TOP VENDAS' },
  { name: 'Robux 800', old: 39.90, price: 34.90, badge: 'OFERTA' },
  { name: 'Free Fire Diamantes', old: 24.90, price: 19.90, badge: 'RELÂMPAGO' }
];

function vtMoney(value){
  return Number(value).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}

function renderV10Deals(){
  const grid = document.getElementById('dealGrid');
  if(!grid) return;
  grid.innerHTML = vtDeals.map((item, index) => `
    <article class="deal-card">
      <span class="deal-badge">${item.badge}</span>
      <div>
        <h3>${item.name}</h3>
        <div class="deal-price">
          <span class="deal-old">${vtMoney(item.old)}</span>
          <span class="deal-new">${vtMoney(item.price)}</span>
        </div>
      </div>
      <button class="btn btn-primary" onclick="addToCartByName('${item.name.replace(/'/g, "\\'")}')">Adicionar ao carrinho</button>
    </article>
  `).join('');
}

function addToCartByName(productName){
  const productIndex = products.findIndex(p => p.name === productName || p.nome === productName);
  if(productIndex >= 0){
    addCart(productIndex);
    return;
  }
  alert('Produto não encontrado: ' + productName);
}

function initPromoSlider(){
  const slides = Array.from(document.querySelectorAll('.promo-slide'));
  const dots = Array.from(document.querySelectorAll('.promo-dot'));
  if(!slides.length) return;
  let current = 0;
  function show(index){
    current = index;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }
  dots.forEach(dot => {
    dot.addEventListener('click', () => show(Number(dot.dataset.slide || 0)));
  });
  setInterval(() => show((current + 1) % slides.length), 4500);
}

function initDealCountdown(){
  const el = document.getElementById('dealCountdown');
  if(!el) return;
  function tick(){
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = Math.max(0, end - now);
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

function tagProductCards(){
  document.querySelectorAll('.product-card, .card-produto').forEach((card, i) => {
    const text = card.textContent.toLowerCase();
    let badge = '';
    if(text.includes('steam r$ 100') || text.includes('game pass')) badge = 'TOP VENDAS';
    else if(text.includes('robux') || text.includes('free fire')) badge = 'PROMOÇÃO';
    else if(i < 4) badge = 'DESTAQUE';
    card.setAttribute('data-badge', badge);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderV10Deals();
  initPromoSlider();
  initDealCountdown();
  setTimeout(tagProductCards, 300);
  setTimeout(tagProductCards, 900);
});



/* ===== VT GAMES V10 + PIX LIMPO MERCADO PAGO ===== */
function vtPixGetItems(){
  return cart.map(item => ({
    name: item.product.name,
    quantity: Number(item.qty || 1),
    unit_price: Number(item.product.price || 0)
  })).filter(item => item.quantity > 0 && item.unit_price > 0);
}

function vtPixTotal(items){
  return items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
}

function vtPixOpenCheckout(){
  const items = vtPixGetItems();
  const total = vtPixTotal(items);

  if(!items.length || total <= 0){
    alert('Carrinho vazio. Adicione um produto antes de pagar com PIX.');
    return;
  }

  const modal = document.getElementById('pixModal');
  const summary = document.getElementById('pixSummary');

  summary.innerHTML = items.map(item => `
    <div class="pix-summary-row">
      <span>${item.name} x${item.quantity}</span>
      <strong>${fmt(item.unit_price * item.quantity)}</strong>
    </div>
  `).join('') + `
    <div class="pix-summary-row pix-summary-total">
      <span>Total</span>
      <strong>${fmt(total)}</strong>
    </div>
  `;

  document.getElementById('pixResult').hidden = true;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function vtPixCloseCheckout(){
  const modal = document.getElementById('pixModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

async function vtPixSubmit(event){
  event.preventDefault();

  const items = vtPixGetItems();
  const total = vtPixTotal(items);

  if(!items.length || total <= 0){
    alert('Carrinho vazio ou inválido.');
    return;
  }

  const payerName = document.getElementById('payerName').value.trim();
  const payerEmail = document.getElementById('payerEmail').value.trim();

  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Gerando PIX...';

  try{
    const response = await fetch('/api/create-pix-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payer: { name: payerName, email: payerEmail },
        items
      })
    });

    const data = await response.json().catch(() => ({}));

    if(!response.ok){
      throw new Error(data.detail || data.error || 'Não foi possível gerar o PIX.');
    }

    document.getElementById('pixResult').hidden = false;

    const qr = document.getElementById('pixQr');
    if(data.qr_code_base64){
      qr.src = 'data:image/png;base64,' + data.qr_code_base64;
      qr.style.display = 'block';
    } else {
      qr.style.display = 'none';
    }

    document.getElementById('pixCode').value = data.qr_code || '';

    const openPayment = document.getElementById('openPayment');
    openPayment.href = data.ticket_url || '#';
    openPayment.style.display = data.ticket_url ? 'inline-flex' : 'none';

    document.getElementById('pixStatus').textContent = 'Aguardando pagamento';
  }catch(error){
    alert(error.message + '\n\nConfira se o arquivo .env está configurado com o Access Token do Mercado Pago.');
    console.error('VT GAMES PIX ERROR:', error);
  }finally{
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const pixBtn = document.getElementById('pixCheckoutBtn');
  if(pixBtn) pixBtn.addEventListener('click', vtPixOpenCheckout);

  const closeBtn = document.getElementById('pixClose');
  if(closeBtn) closeBtn.addEventListener('click', vtPixCloseCheckout);

  const modal = document.getElementById('pixModal');
  if(modal){
    modal.addEventListener('click', (event) => {
      if(event.target === modal) vtPixCloseCheckout();
    });
  }

  const form = document.getElementById('pixForm');
  if(form) form.addEventListener('submit', vtPixSubmit);

  const copyBtn = document.getElementById('copyPix');
  if(copyBtn){
    copyBtn.addEventListener('click', async () => {
      const code = document.getElementById('pixCode').value;
      await navigator.clipboard.writeText(code);
      copyBtn.textContent = 'PIX copiado!';
      setTimeout(() => copyBtn.textContent = 'Copiar código PIX', 1600);
    });
  }
});


/* ===== VT GAMES - minimizar carrinho ===== */
document.addEventListener('DOMContentLoaded', () => {
  const cartPanel = document.querySelector('.cart-panel');
  if (!cartPanel || document.getElementById('cartMinToggle')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'cartMinToggle';
  btn.className = 'cart-min-toggle';
  btn.textContent = 'Minimizar carrinho';
  cartPanel.insertBefore(btn, cartPanel.firstChild);

  btn.addEventListener('click', () => {
    cartPanel.classList.toggle('minimized');
    btn.textContent = cartPanel.classList.contains('minimized') ? '' : 'Minimizar carrinho';
  });
});


/* ===== VT GAMES - abrir carrinho só ao clicar ===== */
document.addEventListener('DOMContentLoaded', () => {
  const cartPanel = document.querySelector('.cart-panel');
  if (!cartPanel || document.getElementById('cartFloatingBtn')) return;

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  document.body.appendChild(overlay);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'cart-drawer-close';
  closeBtn.innerHTML = '×';
  cartPanel.insertBefore(closeBtn, cartPanel.firstChild);

  const floatingBtn = document.createElement('button');
  floatingBtn.type = 'button';
  floatingBtn.id = 'cartFloatingBtn';
  floatingBtn.className = 'cart-floating-btn';
  floatingBtn.innerHTML = '🛒<span class="cart-floating-count">0</span>';
  document.body.appendChild(floatingBtn);

  function syncFloatingCount(){
    const count = document.getElementById('cartCount')?.textContent || '0';
    const floatingCount = floatingBtn.querySelector('.cart-floating-count');
    if (floatingCount) floatingCount.textContent = count;
  }

  function openCart(){
    cartPanel.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    syncFloatingCount();
  }

  function closeCart(){
    cartPanel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  floatingBtn.addEventListener('click', openCart);
  closeBtn.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);

  document.querySelectorAll('a[href="#carrinho"], .cart-button, .mini-cart, .cart-mini').forEach(el => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      openCart();
    });
  });

  const originalRenderCart = window.renderCart;
  if (typeof originalRenderCart === 'function') {
    window.renderCart = function(){
      originalRenderCart.apply(this, arguments);
      syncFloatingCount();
    };
  }

  const observer = new MutationObserver(syncFloatingCount);
  const cartCount = document.getElementById('cartCount');
  if (cartCount) observer.observe(cartCount, { childList: true, characterData: true, subtree: true });

  syncFloatingCount();
});


/* ===== VT GAMES - abrir carrinho real só no clique ===== */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cartFloatingBtnFix')) return;

  const cartPanel =
    document.querySelector('.cart-panel') ||
    document.querySelector('.cart-box') ||
    document.querySelector('.cart-sidebar') ||
    document.querySelector('.cart-drawer') ||
    document.querySelector('#carrinho') ||
    document.querySelector('#cart') ||
    document.querySelector('aside');

  if (!cartPanel) return;

  document.body.classList.remove('cart-open');

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  document.body.appendChild(overlay);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'cart-drawer-close';
  closeBtn.innerHTML = '×';
  cartPanel.insertBefore(closeBtn, cartPanel.firstChild);

  const floatingBtn = document.createElement('button');
  floatingBtn.type = 'button';
  floatingBtn.id = 'cartFloatingBtnFix';
  floatingBtn.className = 'cart-floating-btn';
  floatingBtn.innerHTML = '🛒<span class="cart-floating-count">0</span>';
  document.body.appendChild(floatingBtn);

  function syncCount(){
    const count = document.getElementById('cartCount')?.textContent || '0';
    floatingBtn.querySelector('.cart-floating-count').textContent = count;
  }

  function openCart(){
    document.body.classList.add('cart-open');
    document.body.style.overflow = 'hidden';
    syncCount();
  }

  function closeCart(){
    document.body.classList.remove('cart-open');
    document.body.style.overflow = '';
  }

  floatingBtn.addEventListener('click', openCart);
  closeBtn.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);

  document.querySelectorAll('a[href="#carrinho"], a[href="#cart"], .cart-button, .mini-cart, .cart-mini, .cart-icon, [data-cart-open]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  });

  const countEl = document.getElementById('cartCount');
  if (countEl) new MutationObserver(syncCount).observe(countEl, { childList:true, subtree:true, characterData:true });
  syncCount();
});


/* ===== VT GAMES - Slider do banner funcionando ===== */
document.addEventListener('DOMContentLoaded', function () {
  const hero = document.querySelector('.hero');
  if (!hero || hero.dataset.vtSliderFixed === '1') return;
  hero.dataset.vtSliderFixed = '1';

  const slides = [
    {
      image: 'img/banner-vt-games.png',
      showText: true
    },
    {
      image: 'img/banners/banner-giftcards.png',
      showText: false
    },
    {
      image: 'img/banners/banner-assinaturas.png',
      showText: false
    }
  ];

  const heroContent = hero.querySelector('.hero-content');
  const dots = Array.from(hero.querySelectorAll('.hero-dots span'));
  const btnLeft = hero.querySelector('.hero-arrow.left');
  const btnRight = hero.querySelector('.hero-arrow.right');

  let current = 0;

  function setSlide(index) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];

    hero.style.background =
      'linear-gradient(90deg,rgba(3,4,11,.95) 0%,rgba(3,4,11,.78) 25%,rgba(3,4,11,.12) 58%,rgba(3,4,11,.08) 100%), url("' +
      slide.image +
      '") center center / cover no-repeat';

    if (heroContent) {
      heroContent.style.display = slide.showText ? '' : 'none';
    }

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  if (btnLeft) {
    btnLeft.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      setSlide(current - 1);
    });
  }

  if (btnRight) {
    btnRight.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      setSlide(current + 1);
    });
  }

  dots.forEach(function (dot, i) {
    dot.style.cursor = 'pointer';
    dot.addEventListener('click', function () {
      setSlide(i);
    });
  });

  setInterval(function () {
    setSlide(current + 1);
  }, 6000);

  setSlide(0);
});
