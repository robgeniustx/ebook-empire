(function (global) {
  var DEFAULT_PRODUCTS = [
    { id: 1, title: 'From Locked Down to Leveled Up', category: 'ebook', categoryLabel: 'E-Book', price: 19.97, originalPrice: 34.99, emoji: '📗', bgClass: '', badge: 'bestseller', badgeLabel: 'Best Seller', desc: 'The complete re-entry roadmap: housing, income, credit, identity, and mindset — all in one guide.', longDesc: 'This is not a feel-good pamphlet. This is a step-by-step playbook for navigating life after incarceration with clarity and strategy.', features: ['87 pages of actionable content', 'Housing checklist & resource guide', 'Credit repair starter steps', 'Income-building roadmap', 'Mindset shift framework'], stripeLink: 'https://buy.stripe.com/YOUR_LINK_HERE', downloadUrl: '', rating: 4.9, reviews: 47 },
    { id: 2, title: 'The Discipline Code', category: 'ebook', categoryLabel: 'E-Book', price: 14.97, originalPrice: null, emoji: '🔒', bgClass: '', badge: 'new', badgeLabel: 'New', desc: 'Break bad habits, build new systems, and become the person you keep saying you\'re going to be.', longDesc: 'Discipline isn\'t motivation — it\'s infrastructure. This e-book teaches you how to build daily systems that run on autopilot.', features: ['72 pages', 'Daily discipline tracker (printable)', 'Habit stack builder', '30-day implementation plan'], stripeLink: 'https://buy.stripe.com/YOUR_LINK_HERE', downloadUrl: '', rating: 4.8, reviews: 19 },
    { id: 3, title: 'Debt Free Blueprint', category: 'ebook', categoryLabel: 'E-Book', price: 17.97, originalPrice: 29.99, emoji: '💸', bgClass: '', badge: null, badgeLabel: '', desc: 'Understand your debt, attack it strategically, and build the financial foundation you never had.', longDesc: 'Debt isn\'t a character flaw — it\'s a system problem. This guide shows you how to audit your debt and build financial freedom.', features: ['Debt snowball & avalanche explained', 'Dispute letter templates', 'Budget foundation framework', 'Negotiation scripts for collectors'], stripeLink: 'https://buy.stripe.com/YOUR_LINK_HERE', downloadUrl: '', rating: 4.9, reviews: 33 },
    { id: 4, title: 'From Employee to Entrepreneur', category: 'course', categoryLabel: 'Course', price: 47.0, originalPrice: 97.0, emoji: '🚀', bgClass: 'course-bg', badge: 'bestseller', badgeLabel: '🔥 Hot', desc: 'The complete mindset and mechanics shift from working for someone else to building something of your own.', longDesc: 'This isn\'t about quitting your job tomorrow. It\'s about developing the thinking, strategy, and skills to build income on your terms.', features: ['6 video modules', 'Business idea validation framework', 'LLC setup walkthrough', 'First $1,000 roadmap', 'Private community access'], stripeLink: 'https://buy.stripe.com/YOUR_LINK_HERE', downloadUrl: '', rating: 5.0, reviews: 28 },
    { id: 5, title: 'Business Launch Toolkit', category: 'template', categoryLabel: 'Templates', price: 27.0, originalPrice: 49.0, emoji: '🛠️', bgClass: 'template-bg', badge: 'new', badgeLabel: 'New', desc: 'Every template you need to launch a real business: plan, pitch deck, invoices, contracts, and more.', longDesc: 'Stop starting from scratch. 15 professionally designed templates covering every phase of launching a business.', features: ['Business plan template', '1-page pitch deck', 'Client invoice template', 'Service agreement template', '90-day launch checklist'], stripeLink: 'https://buy.stripe.com/YOUR_LINK_HERE', downloadUrl: '', rating: 4.8, reviews: 14 },
    { id: 6, title: 'BridgeP2P Inner Circle', category: 'membership', categoryLabel: 'Membership', price: 19.97, originalPrice: null, emoji: '👑', bgClass: 'member-bg', badge: null, badgeLabel: '', desc: 'Monthly access to all new releases, live coaching calls, and a private community of builders.', longDesc: 'Every month you get 1-2 new e-books, access to a live Q&A, and a private community of people building alongside you.', features: ['1–2 new e-books monthly', 'Live monthly coaching call', 'Private community access', 'Early product access', 'Cancel anytime'], stripeLink: 'https://buy.stripe.com/YOUR_LINK_HERE', downloadUrl: '', rating: 4.9, reviews: 22 }
  ];

  function loadLocal(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getDb() {
    return global.BP2PFirebase && global.BP2PFirebase.db;
  }

  function isConfigured() {
    return !!(global.BP2PFirebase && global.BP2PFirebase.configured && getDb());
  }

  function sortProducts(products) {
    return products.slice().sort(function (a, b) { return a.id - b.id; });
  }

  function normalizeProduct(product) {
    return Object.assign({}, product, { id: Number(product.id) });
  }

  async function signInAdmin(email, password) {
    if (!isConfigured() || !global.BP2PFirebase.auth) return false;
    try {
      await global.BP2PFirebase.auth.signInWithEmailAndPassword(email, password);
      return true;
    } catch (e) {
      console.warn('Firebase admin sign-in failed:', e.message);
      return false;
    }
  }

  async function getProducts() {
    if (isConfigured()) {
      try {
        var snap = await getDb().collection('products').get();
        if (!snap.empty) {
          var products = snap.docs.map(function (doc) { return normalizeProduct(doc.data()); });
          saveLocal('bp2p_products', products);
          return sortProducts(products);
        }
      } catch (e) {
        console.warn('Firestore products read failed, using local fallback:', e.message);
      }
    }

    var local = loadLocal('bp2p_products', null);
    if (local && local.length) return sortProducts(local);
    return DEFAULT_PRODUCTS.slice();
  }

  async function saveProducts(products) {
    saveLocal('bp2p_products', products);
    if (!isConfigured() || !global.BP2PFirebase.auth || !global.BP2PFirebase.auth.currentUser) return;

    var batch = getDb().batch();
    products.forEach(function (product) {
      var ref = getDb().collection('products').doc(String(product.id));
      batch.set(ref, product);
    });
    await batch.commit();
  }

  async function deleteProduct(id) {
    var products = loadLocal('bp2p_products', []);
    var next = products.filter(function (p) { return p.id !== id; });
    saveLocal('bp2p_products', next);
    if (isConfigured() && global.BP2PFirebase.auth && global.BP2PFirebase.auth.currentUser) {
      await getDb().collection('products').doc(String(id)).delete();
    }
    return next;
  }

  async function getOrders() {
    if (isConfigured()) {
      try {
        var snap = await getDb().collection('orders').get();
        if (!snap.empty) {
          var orders = snap.docs.map(function (doc) { return doc.data(); });
          orders.sort(function (a, b) {
            var aTime = a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : 0;
            var bTime = b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : 0;
            return bTime - aTime;
          });
          saveLocal('bp2p_orders', orders);
          return orders;
        }
      } catch (e) {
        console.warn('Firestore orders read failed, using local fallback:', e.message);
      }
    }
    return loadLocal('bp2p_orders', []);
  }

  async function saveOrder(order) {
    var orders = loadLocal('bp2p_orders', []);
    if (orders.find(function (o) { return o.id === order.id; })) return;

    orders.unshift(order);
    saveLocal('bp2p_orders', orders);

    if (isConfigured()) {
      var payload = Object.assign({}, order, {
        createdAt: global.firebase.firestore.FieldValue.serverTimestamp()
      });
      await getDb().collection('orders').doc(String(order.id)).set(payload, { merge: true });
    }
  }

  async function saveOrders(orders) {
    saveLocal('bp2p_orders', orders);
    if (!isConfigured() || !global.BP2PFirebase.auth || !global.BP2PFirebase.auth.currentUser) return;

    var batch = getDb().batch();
    orders.forEach(function (order) {
      var ref = getDb().collection('orders').doc(String(order.id));
      batch.set(ref, Object.assign({}, order, {
        createdAt: global.firebase.firestore.FieldValue.serverTimestamp()
      }), { merge: true });
    });
    await batch.commit();
  }

  async function deleteOrder(id) {
    var orders = loadLocal('bp2p_orders', []).filter(function (o) { return o.id !== id; });
    saveLocal('bp2p_orders', orders);
    if (isConfigured() && global.BP2PFirebase.auth && global.BP2PFirebase.auth.currentUser) {
      await getDb().collection('orders').doc(String(id)).delete();
    }
    return orders;
  }

  async function getSubscribers() {
    if (isConfigured()) {
      try {
        var snap = await getDb().collection('subscribers').get();
        if (!snap.empty) {
          var subs = snap.docs.map(function (doc) { return doc.data(); });
          saveLocal('bp2p_subscribers', subs);
          return subs;
        }
      } catch (e) {
        console.warn('Firestore subscribers read failed, using local fallback:', e.message);
      }
    }
    return loadLocal('bp2p_subscribers', []);
  }

  async function saveSubscribers(subscribers) {
    saveLocal('bp2p_subscribers', subscribers);
    if (!isConfigured() || !global.BP2PFirebase.auth || !global.BP2PFirebase.auth.currentUser) return;

    var batch = getDb().batch();
    subscribers.forEach(function (sub, index) {
      var ref = getDb().collection('subscribers').doc(sub.email || String(index));
      batch.set(ref, sub);
    });
    await batch.commit();
  }

  async function migrateFromLocalStorage() {
    if (!isConfigured() || !global.BP2PFirebase.auth || !global.BP2PFirebase.auth.currentUser) return;

    var remoteProducts = await getDb().collection('products').limit(1).get();
    if (remoteProducts.empty) {
      var localProducts = loadLocal('bp2p_products', DEFAULT_PRODUCTS);
      await saveProducts(localProducts.length ? localProducts : DEFAULT_PRODUCTS);
    }

    var localOrders = loadLocal('bp2p_orders', []);
    if (localOrders.length) {
      var remoteOrders = await getDb().collection('orders').limit(1).get();
      if (remoteOrders.empty) await saveOrders(localOrders);
    }

    var localSubs = loadLocal('bp2p_subscribers', []);
    if (localSubs.length) {
      var remoteSubs = await getDb().collection('subscribers').limit(1).get();
      if (remoteSubs.empty) await saveSubscribers(localSubs);
    }
  }

  global.BP2PStore = {
    DEFAULT_PRODUCTS: DEFAULT_PRODUCTS,
    isConfigured: isConfigured,
    signInAdmin: signInAdmin,
    getProducts: getProducts,
    saveProducts: saveProducts,
    deleteProduct: deleteProduct,
    getOrders: getOrders,
    saveOrder: saveOrder,
    saveOrders: saveOrders,
    deleteOrder: deleteOrder,
    getSubscribers: getSubscribers,
    saveSubscribers: saveSubscribers,
    migrateFromLocalStorage: migrateFromLocalStorage
  };
})(window);
