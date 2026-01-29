// Wedding Invitation Configuration
const CONFIG = {
  groom: "Thinh Nguyễn",
  bride: "Nhung Suzy",
  weddingDate: "2026-03-08T10:30:00+07:00",
  weddingDateText: "Chủ Nhật 08 Tháng 03 2026",

  groomInfo: {
    description:
      "Chú rể là người cởi mở, thân thiện, giao tiếp tốt và thuộc tuýp người hướng ngoại."
  },

  brideInfo: {
    description:
      "Cô dâu thuộc tuýp người hướng nội. Sở thích nấu nướng và đi du lịch cùng gia đình."
  },

  loveStory: [
    {
      date: "07.2025",
      title: "Lần đầu gặp",
      text:
        "Ngày ấy vu vơ đăng một dòng status trên facebook than thở, vu vơ đùa giỡn nói chuyện với một người xa lạ chưa từng quen.",
      image: "assets/story-1.jpg"
    },
    {
      date: "12.2025",
      title: "Ngõ lời yêu",
      text:
        "Mỗi chiều cuối tuần thường chạy xe vòng quanh qua những con phố, len lỏi trong từng dòng người tấp nập.",
      image: "assets/story-2.jpg"
    },
    {
      date: "20.10.2025",
      title: "Cầu hôn",
      text:
        "Chúng ta từ 2 con người xa lạ mà bước vào cuộc đời nhau. Và giờ đây chúng ta tiếp tục cùng nhau sang trang mới.",
      image: "assets/story-3.jpg"
    },
    {
      date: "22.12.2025",
      title: "Ngày trọng đại",
      text:
        "Em và anh không chỉ là người yêu mà chúng ta còn là tri kỷ. Ngày hôm nay, em sẽ là cô dâu của anh.",
      image: "assets/story-4.jpg"
    }
  ],

  events: [
    {
      title: "Nhà Trai",
      place: "Bùi Hạ Yết Kiêu Hải Phòng",
      time: "Vào lúc 10:30 Sáng",
      weekday: "Chủ Nhật",
      date: "08/03",
      year: "2026",
      lunar: "Nhằm ngày 20 Tháng 1 Năm Qúy Mão Âm lịch",
      mapUrl:
        "https://maps.app.goo.gl/m33UufF9hbvbb3816",
      image: "assets/cover.jpg"
    },
    {
      title: "Nhà Gái",
      place: "Phường Minh Đức Bắc Ninh",
      time: "Vào lúc 10:30 Sáng",
      weekday: "Chủ Nhật",
      date: "08/03",
      year: "2026",
      lunar: "Nhằm ngày 20 Tháng 1 Năm Qúy Mão Âm lịch",
      mapUrl:
        "https://maps.app.goo.gl/5Q396rhUVdUQGrSj6",
      image: "assets/cover.jpg"
    }
  ],

  gallery: {
    total: 39,
    firstLoad: 12,
    loadMore: 12,
    imagePath: (index) => `assets/album/${index}.jpg`
  }
};

// Utility
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const pad2 = (n) => String(n).padStart(2, "0");

const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
};

document.addEventListener("DOMContentLoaded", () => {
  document.title = `${CONFIG.groom} ♡ ${CONFIG.bride} • Mẫu Thiệp Lãng Mạn`;

  initSnow();       // snow first (canvas)
  initTimeline();   // love story
  initEvents();
  initGallery();
  initCountdown();
  initWishes();
  initMusic();
  initLightbox();
  initShare();
  initSmoothScroll();
});

/* =========================
   Snow (tiny)
   ========================= */
function initSnow() {
  const canvas = document.getElementById("snow");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = new Image();
  img.src = "assets/snowflake.png";

  let W = 0, H = 0, DPR = 1;
  let flakes = [];
  const COUNT = 90;

  const rand = (min, max) => Math.random() * (max - min) + min;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function init() {
    flakes = Array.from({ length: COUNT }).map(() => ({
      x: rand(0, W),
      y: rand(-H, H),
      r: rand(3, 9),         // tiny
      s: rand(0.5, 1.6),
      a: rand(0, Math.PI * 2),
      w: rand(0.2, 0.9)
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const f of flakes) {
      const drift = Math.sin(f.a) * (f.w * 18);
      const x = f.x + drift;

      const alpha = 0.20 + (f.r / 20);
      ctx.globalAlpha = alpha;

      if (img.complete && img.naturalWidth) {
        ctx.drawImage(img, x, f.y, f.r, f.r);
      } else {
        ctx.beginPath();
        ctx.arc(x, f.y, f.r / 3, 0, Math.PI * 2);
        ctx.fill();
      }

      f.y += f.s;
      f.a += 0.01 + f.s * 0.002;

      if (f.y > H + 24) {
        f.y = -rand(10, 80);
        f.x = rand(0, W);
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    resize();
    init();
  });

  resize();
  init();
  draw();
}

/* =========================
   Love Story (full background)
   ========================= */
function initTimeline() {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  timeline.innerHTML = "";

  const list = Array.isArray(CONFIG.loveStory) ? CONFIG.loveStory : [];
  list.forEach((story, i) => {
    const item = document.createElement("div");
    item.className = "timeline-item";

    item.innerHTML = `
      <div class="timeline-bg" style="background-image:url('${story.image}')"></div>
      <div class="timeline-dim"></div>
      <div class="timeline-center">
        <div class="timeline-arch">
          <img src="${story.image}" alt="${escapeHtml(story.title)}" loading="lazy">
        </div>
        <div class="timeline-date">${escapeHtml(story.date)}</div>
        <div class="timeline-title">${escapeHtml(story.title)}</div>
        <div class="timeline-text">${escapeHtml(story.text)}</div>
        <div class="timeline-pin" aria-hidden="true"></div>
      </div>
    `;

    timeline.appendChild(item);

    if (i < list.length - 1) {
      const div = document.createElement("div");
      div.className = "timeline-divider";
      timeline.appendChild(div);
    }
  });
}

/* =========================
   Events
   ========================= */
function initEvents() {
  const eventsList = $("#eventsList");
  if (!eventsList) return;
  eventsList.innerHTML = "";

  CONFIG.events.forEach((event) => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-image" style="background-image: url('${event.image}')"></div>
      <div class="event-content">
        <div class="event-title">${escapeHtml(event.title)}</div>
        <div class="event-place">${escapeHtml(event.place)}</div>
        <div class="event-time">${escapeHtml(event.time)}</div>
        <div class="event-date-row">
          <span class="event-weekday">${escapeHtml(event.weekday)}</span>
          <span class="event-date">${escapeHtml(event.date)}</span>
          <span class="event-year">${escapeHtml(event.year)}</span>
        </div>
        ${event.lunar ? `<div class="event-lunar">${escapeHtml(event.lunar)}</div>` : ""}
        <div class="event-actions">
          <a href="${event.mapUrl}" class="event-map-link" target="_blank" rel="noreferrer" aria-label="Mở bản đồ">📍</a>
        </div>
      </div>
    `;
    eventsList.appendChild(card);
  });
}

/* =========================
   Gallery
   ========================= */
function initGallery() {
  const gallery = $("#photoGallery");
  const loadMoreBtn = $("#loadMoreBtn");
  if (!gallery) return;

  let showing = CONFIG.gallery.firstLoad;

  function render() {
    gallery.innerHTML = "";
    const max = Math.min(showing, CONFIG.gallery.total);

    for (let i = 1; i <= max; i++) {
      const item = document.createElement("div");
      item.className = "gallery-item";
      const src = CONFIG.gallery.imagePath(i);
      item.innerHTML = `<img src="${src}" alt="Wedding photo ${i}" loading="lazy">`;
      item.addEventListener("click", () => openLightbox(src));
      gallery.appendChild(item);
    }

    if (loadMoreBtn) {
      loadMoreBtn.style.display = showing >= CONFIG.gallery.total ? "none" : "inline-flex";
    }
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      showing = Math.min(CONFIG.gallery.total, showing + CONFIG.gallery.loadMore);
      render();
    });
  }

  render();
}

/* =========================
   Countdown
   ========================= */
function initCountdown() {
  const daysEl = $("#days");
  const hoursEl = $("#hours");
  const minutesEl = $("#minutes");
  const secondsEl = $("#seconds");
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const weddingTime = new Date(CONFIG.weddingDate).getTime();

  function update() {
    const now = Date.now();
    let diff = Math.max(0, weddingTime - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);

    daysEl.textContent = pad2(days);
    hoursEl.textContent = pad2(hours);
    minutesEl.textContent = pad2(minutes);
    secondsEl.textContent = pad2(seconds);
  }

  update();
  setInterval(update, 1000);
}

/* =========================
   Wishes (localStorage)
   ========================= */
function initWishes() {
  const wishForm = $("#wishForm");
  const wishesList = $("#wishesList");
  const rememberMe = $("#rememberMe");

  const STORAGE_KEY = "wedding_wishes";
  const PROFILE_KEY = "wedding_profile";

  const loadWishes = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { return []; }
  };
  const saveWishes = (w) => localStorage.setItem(STORAGE_KEY, JSON.stringify(w));

  const loadProfile = () => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"); }
    catch { return {}; }
  };
  const saveProfile = (p) => localStorage.setItem(PROFILE_KEY, JSON.stringify(p));

  const render = () => {
    if (!wishesList) return;
    const wishes = loadWishes().slice().reverse();
    wishesList.innerHTML = "";

    if (!wishes.length) {
      wishesList.innerHTML =
        '<div class="wish-item"><div class="wish-message">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc đến cặp đôi!</div></div>';
      return;
    }

    wishes.forEach((wish) => {
      const el = document.createElement("div");
      el.className = "wish-item";
      el.innerHTML = `
        <div class="wish-header">
          <div class="wish-name">${escapeHtml(wish.name)}</div>
          <div class="wish-time">${new Date(wish.timestamp).toLocaleString("vi-VN")}</div>
        </div>
        <div class="wish-message">${escapeHtml(wish.message)}</div>
      `;
      wishesList.appendChild(el);
    });
  };

  const profile = loadProfile();
  if (profile.name) {
    const nameInput = wishForm?.querySelector('input[name="name"]');
    if (nameInput) nameInput.value = profile.name;
  }
  if (profile.email) {
    const emailInput = wishForm?.querySelector('input[name="email"]');
    if (emailInput) emailInput.value = profile.email;
  }

  if (wishForm) {
    wishForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(wishForm);
      const name = (formData.get("name") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const message = (formData.get("message") || "").toString().trim();

      if (!name || !message) {
        showToast("Vui lòng điền tên và lời chúc!");
        return;
      }

      const wishes = loadWishes();
      wishes.push({ name, email, message, timestamp: Date.now() });
      saveWishes(wishes);

      if (rememberMe?.checked) saveProfile({ name, email });
      else localStorage.removeItem(PROFILE_KEY);

      wishForm.reset();
      render();
      showToast("Gửi lời chúc thành công! Cảm ơn bạn rất nhiều.");
    });
  }

  render();
}

/* =========================
   Music (requires gesture)
   ========================= */
function initMusic() {
  const musicBtn = $("#musicBtn");
  const bgMusic = $("#bgm");
  if (!musicBtn || !bgMusic) return;

  const setUI = (playing) => {
    musicBtn.classList.toggle("playing", playing);
    musicBtn.setAttribute("aria-pressed", playing ? "true" : "false");
  };

  async function tryPlay() {
    try {
      bgMusic.volume = 0.7;
      await bgMusic.play();
      setUI(true);
      return true;
    } catch {
      setUI(false);
      return false;
    }
  }

  // Try on first user gesture anywhere
  const unlock = async () => {
    await tryPlay();
    window.removeEventListener("pointerdown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });

  musicBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (bgMusic.paused) await tryPlay();
    else { bgMusic.pause(); setUI(false); }
  });

  bgMusic.addEventListener("play", () => setUI(true));
  bgMusic.addEventListener("pause", () => setUI(false));
}

/* =========================
   Lightbox
   ========================= */
function initLightbox() {
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxClose = $("#lightboxClose");
  if (!lightbox || !lightboxImg || !lightboxClose) return;

  window.openLightbox = function (src) {
    lightboxImg.src = src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  lightboxClose.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) close();
  });
}

/* =========================
   Share
   ========================= */
function initShare() {
  const shareBtn = $("#shareBtn");
  if (!shareBtn) return;

  shareBtn.addEventListener("click", async () => {
    const url = window.location.href;
    const title = document.title;
    const text = "Thiệp cưới online";

    if (navigator.share) {
      try { await navigator.share({ title, text, url }); } catch {}
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast("Đã sao chép link thiệp!");
    } catch {
      showToast("Không thể sao chép link. Vui lòng thử lại.");
    }
  });
}

/* =========================
   Smooth Scroll
   ========================= */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* =========================
   Toast
   ========================= */
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    left: 50%;
    bottom: 100px;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.82);
    color: white;
    padding: 12px 20px;
    border-radius: 50px;
    font-size: 14px;
    z-index: 3000;
    max-width: 90vw;
    text-align: center;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity .25s ease";
    setTimeout(() => toast.remove(), 260);
  }, 2500);
}
