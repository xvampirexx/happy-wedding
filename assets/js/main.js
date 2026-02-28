(function(){
  // ===== config =====
  // Wedding date (Asia/Tokyo +09:00). Change time if needed.
  const WEDDING_ISO = "2026-03-08T00:00:00+09:00";
  const RSVP_DEADLINE_TEXT = "2026年03月08日 (日)";

  // Album config (your current structure is 1.webp..)
  // If you convert to webp: folder='assets/album_webp', ext='webp'
  const ALBUM = { total: 39, initial: 9, addEach: 12, folder: "assets/album", ext: "webp" };

  // ===== nav =====
  const navBtn = document.getElementById("navBtn");
  const navPanel = document.getElementById("navPanel");
  const navBackdrop = document.getElementById("navBackdrop");

  function openNav(){
    navPanel.hidden = false;
    navBackdrop.hidden = false;
    navBtn.setAttribute("aria-expanded","true");
  }
  function closeNav(){
    navPanel.hidden = true;
    navBackdrop.hidden = true;
    navBtn.setAttribute("aria-expanded","false");
  }
  navBtn?.addEventListener("click", ()=>{
    const open = navBtn.getAttribute("aria-expanded")==="true";
    open ? closeNav() : openNav();
  });
  navBackdrop?.addEventListener("click", closeNav);
  navPanel?.addEventListener("click", (e)=>{
    if(e.target.closest("a")) closeNav();
  });

  // smooth scroll
  document.addEventListener("click", (e)=>{
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute("href");
    if(!id || id.length<=1) return;
    const el = document.querySelector(id);
    if(!el) return;
    e.preventDefault();
    el.scrollIntoView({behavior:"smooth", block:"start"});
  });

  // ===== countdown =====
  const $d = document.getElementById("cdDays");
  const $h = document.getElementById("cdHours");
  const $m = document.getElementById("cdMinutes");
  const $s = document.getElementById("cdSeconds");
  const $deadline = document.getElementById("rsvpDeadline");
  if($deadline) $deadline.textContent = RSVP_DEADLINE_TEXT;

  const target = new Date(WEDDING_ISO).getTime();

  function pad(n){ return String(n).padStart(2,"0"); }

  function tick(){
    const now = Date.now();
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days * (1000*60*60*24);
    const hours = Math.floor(diff / (1000*60*60));
    diff -= hours * (1000*60*60);
    const mins = Math.floor(diff / (1000*60));
    diff -= mins * (1000*60);
    const secs = Math.floor(diff / 1000);

    if($d) $d.textContent = String(days);
    if($h) $h.textContent = pad(hours);
    if($m) $m.textContent = pad(mins);
    if($s) $s.textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);

  // ===== album slider =====
  const slider = document.getElementById("albumSlider");
  const $prev = document.getElementById("albumPrev");
  const $cur = document.getElementById("albumCurrent");
  const $next = document.getElementById("albumNext");
  let prevBtn = document.getElementById("albumPrevBtn") || document.querySelector(".album-prev-btn");
  let nextBtn = document.getElementById("albumNextBtn") || document.querySelector(".album-next-btn");
  const thumbs = document.getElementById("albumThumbs");

  function path(i){ return `${ALBUM.folder}/${i}.${ALBUM.ext}`; }
  function clampIndex(i){
    const max = Math.max(1, ALBUM.total);
    const v = ((i % max) + max) % max;
    return v;
  }
  function toIdFromIndex(idx0){ return idx0 + 1; }
  function toIndexFromId(id1){ return id1 - 1; }

  let current = 0;
  let thumbButtons = [];

  function renderThumbs(){
    if(!thumbs) return;
    thumbs.innerHTML = "";
    thumbButtons = [];
    for(let i=1; i<=ALBUM.total; i++){
      const b = document.createElement("button");
      b.type = "button";
      b.className = "album-thumb";
      b.setAttribute("aria-label", `photo ${i}`);
      b.setAttribute("aria-current", "false");

      const img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.src = path(i);
      img.alt = `album-${i}`;
      b.appendChild(img);

      b.addEventListener("click", ()=>{
        setCurrent(toIndexFromId(i), { scrollThumb: true });
      });

      thumbs.appendChild(b);
      thumbButtons.push(b);
    }
  }

  function setCurrent(nextIndex0, opts){
    const options = opts || {};
    const idx = clampIndex(nextIndex0);
    current = idx;

    const idCur = toIdFromIndex(current);
    const idPrev = toIdFromIndex(clampIndex(current - 1));
    const idNext = toIdFromIndex(clampIndex(current + 1));

    // Simple image loading without opacity manipulation
    if($prev){
      $prev.src = path(idPrev);
      $prev.alt = `album-${idPrev}`;
      $prev.loading = "eager";
    }
    if($cur){
      $cur.src = path(idCur);
      $cur.alt = `album-${idCur}`;
      $cur.loading = "eager";
    }
    if($next){
      $next.src = path(idNext);
      $next.alt = `album-${idNext}`;
      $next.loading = "eager";
    }

    if(thumbButtons.length){
      for(let i=0; i<thumbButtons.length; i++){
        thumbButtons[i].setAttribute("aria-current", i === current ? "true" : "false");
      }
      const active = thumbButtons[current];
      if(options.scrollThumb && active?.scrollIntoView){
        active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }

  function prev(){ 
    setCurrent(current - 1, { scrollThumb: true }); 
  }
  function next(){ 
    setCurrent(current + 1, { scrollThumb: true }); 
  }

  if(slider && $cur && thumbs){
    renderThumbs();
    setCurrent(0, { scrollThumb: false });

    // Ensure elements exist
    if (!prevBtn || !nextBtn) {
      console.error('Album navigation buttons not found');
      return;
    }

    if(prevBtn){
      // iOS needs both touchstart and touchend for proper handling
      prevBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        e.stopPropagation();
        prev();
      }, { passive: false });
      
      prevBtn.addEventListener("touchend", (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
      
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        prev();
      });
      
      // Force style to ensure clickable
      prevBtn.style.pointerEvents = 'auto';
      prevBtn.style.zIndex = '20';
      prevBtn.style.touchAction = 'manipulation';
      prevBtn.style.webkitTapHighlightColor = 'transparent';
    }
    if(nextBtn){
      // iOS needs both touchstart and touchend for proper handling
      nextBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        e.stopPropagation();
        next();
      }, { passive: false });
      
      nextBtn.addEventListener("touchend", (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
      
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        next();
      });
      
      nextBtn.style.pointerEvents = 'auto';
      nextBtn.style.zIndex = '20';
      nextBtn.style.touchAction = 'manipulation';
      nextBtn.style.webkitTapHighlightColor = 'transparent';
    }

    // keyboard support when slider is visible
    document.addEventListener("keydown", (e)=>{
      if(e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const rect = slider.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if(!inView) return;
      if(e.key === "ArrowLeft") prev();
      else next();
    });
  }

  // ===== canvas snowfall =====
  const canvas = document.getElementById("snowCanvas");
  if(canvas){
    const ctx = canvas.getContext("2d");
    let snowflakes = [];
    const maxSnowflakes = 150;

    function resizeCanvas(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Snowflake{
      constructor(){
        this.reset();
        this.y = Math.random() * canvas.height;
      }
      reset(){
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 1.5 + 0.5; // 0.5-2px
        this.speed = Math.random() * 1 + 0.5; // 0.5-1.5px/frame
        this.wind = Math.random() * 0.5 - 0.25; // -0.25 to 0.25
        this.opacity = Math.random() * 0.6 + 0.4;
      }
      update(){
        this.y += this.speed;
        this.x += this.wind;
        if(this.y > canvas.height || this.x < -10 || this.x > canvas.width + 10){
          this.reset();
        }
      }
      draw(){
        ctx.save();
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // init snowflakes
    for(let i=0;i<maxSnowflakes;i++) snowflakes.push(new Snowflake());

    function animate(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      snowflakes.forEach(s => {
        s.update();
        s.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ===== wishes =====
  const wishForm = document.getElementById("wishForm");
  const wishesList = document.getElementById("wishesList");
  const wishesPlaceholder = document.getElementById("wishesPlaceholder");
  const senderNameInput = document.getElementById("senderName");
  const senderEmailInput = document.getElementById("senderEmail");
  const wishMessageInput = document.getElementById("wishMessage");
  const saveInfoCheckbox = document.getElementById("saveInfo");

  let wishes = [];

  // API base URL - use JSONBin.io for cloud storage
  const API_BASE = 'https://api.jsonbin.io/v3/b/69a2c8c2ae596e708f51fec1'; // Your bin ID
  const API_KEY = '$2a$10$hYP9N.A4MNRWbeQ.TqoRIO1kZlP.15IuoWYf1KlOMmn42NTjLJERa'; // Your API Key

  async function loadWishesFromServer() {
    try {
      const response = await fetch(API_BASE, {
        method: 'GET',
        headers: {
          'X-Master-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      wishes = result.record || [];
      renderWishes();
    } catch (error) {
      console.error('Failed to load wishes:', error);
      // Fallback to empty array if API fails
      wishes = [];
      renderWishes();
    }
  }

  async function saveWishToServer(wishData) {
    try {
      // First load current wishes
      const getResponse = await fetch(API_BASE, {
        method: 'GET',
        headers: {
          'X-Master-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (!getResponse.ok) {
        throw new Error(`HTTP error! status: ${getResponse.status}`);
      }
      
      const getResult = await getResponse.json();
      const currentWishes = getResult.record || [];
      
      // Add new wish
      const newWish = {
        id: Date.now().toString(),
        name: wishData.name,
        email: wishData.email || '',
        message: wishData.message,
        timestamp: Date.now()
      };
      
      const updatedWishes = [newWish, ...currentWishes].slice(0, 50); // Keep latest 50
      
      // Update the bin
      const updateResponse = await fetch(API_BASE, {
        method: 'PUT',
        headers: {
          'X-Master-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedWishes)
      });
      
      if (!updateResponse.ok) {
        throw new Error(`HTTP error! status: ${updateResponse.status}`);
      }
      
      // Reload wishes to display updated list
      await loadWishesFromServer();
      return true;
    } catch (error) {
      console.error('Failed to save wish:', error);
      return false;
    }
  }

  function formatDate(date){
    // Check if date is valid
    if (!date || isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("vi-VN", {
        hour:"2-digit", minute:"2-digit", day:"2-digit", month:"2-digit", year:"numeric"
      }).format(new Date());
    }
    return new Intl.DateTimeFormat("vi-VN", {
      hour:"2-digit", minute:"2-digit", day:"2-digit", month:"2-digit", year:"numeric"
    }).format(date);
  }

  function renderWishes(){
    if(!wishesList) return;
    if(wishes.length === 0){
      if(wishesPlaceholder) wishesPlaceholder.style.display = "block";
      wishesList.innerHTML = "";
      return;
    }
    if(wishesPlaceholder) wishesPlaceholder.style.display = "none";
    wishesList.innerHTML = wishes.map(w => {
      // Ensure timestamp exists and is valid
      const timestamp = w.timestamp || new Date().toISOString();
      const date = new Date(timestamp);
      return `
      <div class="wish-item">
        <div class="wish-author">${escapeHtml(w.name || 'Anonymous')}</div>
        <div class="wish-time">${formatDate(date)}</div>
        <div class="wish-text">${escapeHtml(w.message || '').replace(/\n/g, "<br>")}</div>
      </div>
    `;
    }).join("");
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function loadSavedInfo(){
    const saved = JSON.parse(localStorage.getItem("wishSavedInfo") || "{}");
    if(saved.name) senderNameInput.value = saved.name;
    if(saved.email) senderEmailInput.value = saved.email;
    if(saved.saveInfo !== undefined) saveInfoCheckbox.checked = saved.saveInfo;
  }

  function saveInfoIfNeeded(){
    if(saveInfoCheckbox.checked){
      localStorage.setItem("wishSavedInfo", JSON.stringify({
        name: senderNameInput.value,
        email: senderEmailInput.value,
        saveInfo: true
      }));
    } else {
      localStorage.removeItem("wishSavedInfo");
    }
  }

  if(wishForm){
    loadSavedInfo();

    wishForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = senderNameInput.value.trim();
      const email = senderEmailInput.value.trim();
      const message = wishMessageInput.value.trim();

      if(!name || !message) return;

      const wish = { name, email, message };
      
      // Show loading state
      const submitBtn = wishForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Đang gửi...<br>Sending...';
      submitBtn.disabled = true;

      const success = await saveWishToServer(wish);
      
      // Reset button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      if (success) {
        saveInfoIfNeeded();

        // Reset form except saved info
        wishMessageInput.value = "";
        if(!saveInfoCheckbox.checked){
          senderNameInput.value = "";
          senderEmailInput.value = "";
        }

        // Show success message
        const successMsg = document.createElement("div");
        successMsg.textContent = "Lời chúc của bạn đã được gửi thành công!";
        successMsg.style.cssText = "position:fixed;top:20%;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;padding:12px 20px;border-radius:8px;z-index:9999;animation:fadeOut 2s forwards";
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 2000);
      } else {
        // Show error message
        const errorMsg = document.createElement("div");
        errorMsg.textContent = "Có lỗi xảy ra, vui lòng thử lại!";
        errorMsg.style.cssText = "position:fixed;top:20%;left:50%;transform:translateX(-50%);background:#e74c3c;color:#fff;padding:12px 20px;border-radius:8px;z-index:9999;animation:fadeOut 2s forwards";
        document.body.appendChild(errorMsg);
        setTimeout(() => errorMsg.remove(), 2000);
      }
    });
  }

  // Initial load from server
  loadWishesFromServer();

  // ===== music =====
  const musicBtn = document.getElementById("musicBtn");
  const bgm = document.getElementById("bgm");
  let playing = false;

  function setState(on){
    playing = on;
    musicBtn?.setAttribute("aria-pressed", on ? "true" : "false");
  }

  // Auto-play on page load
  async function initMusic(){
    if(!bgm) return;
    try{
      // Set volume to 0.3 for better user experience
      bgm.volume = 0.3;
      await bgm.play();
      setState(true);
    }catch(_e){
      // Auto-play was blocked, wait for user interaction
      console.log('Auto-play blocked, waiting for user interaction');
    }
  }

  // Try to play music on page load
  initMusic();

  musicBtn?.addEventListener("click", async ()=>{
    if(!bgm) return;
    try{
      if(!playing){
        bgm.volume = 0.3;
        await bgm.play();
        setState(true);
      }else{
        bgm.pause();
        setState(false);
      }
    }catch(_e){}
  });
})();