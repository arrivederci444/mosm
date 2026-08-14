let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0;
let isPlaying = false;
let updateTimer;

// Create new audio element
let curr_track = document.createElement('audio');

// Define the tracks that have to be played
let track_list = [
  {
    name: "monig",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/monig.mp3"
  },
  {
    name: "sunpunk",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/sunpunk.mp3"
  },
  {
    name: "白日梦",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/白日梦.mp3"
  },
  {
    name: "晨曦demo",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/晨曦demo.mp3"
  },
  {
    name: "嵇康2.0",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/嵇康2.0.mp3"
  },
  {
    name: "六一（人声） (1)",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/六一（人声） (1).mp3"
  },
  {
    name: "乱码demo",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/乱码demo.mp3"
  },
  {
    name: "乱码w (1)",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/乱码w (1).mp3"
  },
  {
    name: "陌鸣 废案",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/陌鸣 废案.mp3"
  },
  {
    name: "嗯",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/嗯.mp3"
  },
  {
    name: "晚安",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/晚安.mp3"
  },
  {
    name: "小孩",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/小孩.mp3"
  },
  {
    name: "夜之城25启辰版",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/夜之城25启辰版.mp3"
  },
  {
    name: "坐着睡-01",
    artist: "胡国强",
    image: "audio/mmexport1786656435263.jpg",
    path: "audio/坐着睡-01.mp3"
  },
];

function paintBackground(colors) {
  let c1 = "rgb(" + colors.r + "," + colors.g + "," + colors.b + ")";
  let c2 = "rgb(" + Math.min(255, colors.r + 90) + "," + Math.min(255, colors.g + 90) + "," + Math.min(255, colors.b + 90) + ")";
  let grad = "linear-gradient(160deg, " + c1 + " 0%, " + c2 + " 100%)";
  bg_layer.style.opacity = 0;
  bg_layer.style.background = grad;
  void bg_layer.offsetWidth;
  bg_layer.style.opacity = 1;
}

function random_bg_color() {

  // Get a number between 64 to 256 (for getting lighter colors)
  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;

  // Paint a soft two-tone background with the given color
  paintBackground({ r: red, g: green, b: blue });
}

// Sample the dominant color of the cover art and fade the page to it
function extractColor(url, cb) {
  let img = new Image();
  img.onload = function () {
    try {
      let canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 32, 32);
      let data = ctx.getImageData(0, 0, 32, 32).data;
      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        n++;
      }
      cb({ r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) });
    } catch (e) {
      cb(null);
    }
  };
  img.onerror = function () { cb(null); };
  img.src = url;
}

function loadBgFromCover(url) {
  extractColor(url, function (colors) {
    if (colors) paintBackground(colors);
    else random_bg_color();
  });
}

// Paint the filled portion of a range slider (no gradients in markup, only here)
function paintSlider(el, pct) {
  pct = Math.max(0, Math.min(100, pct));
  el.style.background = "linear-gradient(to right, #2e7d32 0%, #43a047 " + pct + "%, #d8d8d8 " + pct + "%, #d8d8d8 100%)";
}

let playlist_items = [];

function buildPlaylist() {
  let list_el = document.querySelector(".pl-list");
  list_el.innerHTML = "";
  playlist_items = [];
  track_list.forEach(function (track, i) {
    let item = document.createElement("div");
    item.className = "pl-item";

    let num = document.createElement("span");
    num.className = "pl-num";
    num.textContent = (i + 1 < 10 ? "0" : "") + (i + 1);

    let meta = document.createElement("div");
    meta.className = "pl-meta";
    let name = document.createElement("div");
    name.className = "pl-name";
    name.textContent = track.name;
    let artist = document.createElement("div");
    artist.className = "pl-artist";
    artist.textContent = track.artist;
    meta.appendChild(name);
    meta.appendChild(artist);

    let state = document.createElement("span");
    state.className = "pl-state";
    state.innerHTML = '<i class="fa fa-play"></i>';

    let fav = document.createElement("span");
    fav.className = "pl-fav";
    fav.innerHTML = '<i class="fa fa-heart"></i>';
    fav.title = "收藏";
    fav.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleFav(i);
    });

    item.appendChild(num);
    item.appendChild(meta);
    item.appendChild(fav);
    item.appendChild(state);

    item.addEventListener("click", function () {
      playFromPlaylist(i);
    });

    list_el.appendChild(item);
    playlist_items.push(item);
  });

  let foot_el = document.querySelector(".card-foot");
  foot_el.textContent = track_list.length + " 首作品";
}

function updatePlaylistActive() {
  playlist_items.forEach(function (item, i) {
    if (i === track_index) item.classList.add("active");
    else item.classList.remove("active");
  });
}

let nav_stack = [];

function currentViewName() {
  let active = document.querySelector(".view.active");
  return active ? active.id.replace("view-", "") : "menu";
}

function showView(name) {
  document.querySelectorAll(".view").forEach(function (v) {
    v.classList.toggle("active", v.id === "view-" + name);
  });
  document.querySelectorAll(".sn-item").forEach(function (item) {
    item.classList.toggle("active", item.getAttribute("data-view") === name);
  });
  if (name === "playlist") {
    let active = playlist_items[track_index];
    if (active) {
      setTimeout(function () {
        active.scrollIntoView({ block: "nearest" });
      }, 240);
    }
  }
  if (name === "profile") renderProfile();
}

function navTo(name) {
  if (name === "profile" && !currentUser()) {
    showView("login");
    return;
  }
  if (name === "login" && currentUser()) {
    showView("profile");
    return;
  }
  showView(name);
}

/* ---- auth & personal system (localStorage) ---- */

const LS_USERS = "mm_users";
const LS_CUR = "mm_current";

function getUsers() {
  let raw = localStorage.getItem(LS_USERS);
  if (!raw) {
    let users = [{ username: "admin", password: "123456" }];
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    return users;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function currentUser() {
  let raw = localStorage.getItem(LS_CUR);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) localStorage.setItem(LS_CUR, JSON.stringify({ username: user.username }));
  else localStorage.removeItem(LS_CUR);
}

function getFavs(username) {
  let raw = localStorage.getItem("mm_favs_" + username);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveFavs(username, favs) {
  localStorage.setItem("mm_favs_" + username, JSON.stringify(favs));
}

function updateAuthUI() {
  let loginItem = document.getElementById("nav-login");
  let u = currentUser();
  if (u) {
    loginItem.style.display = "none";
  } else {
    loginItem.style.display = "";
  }
}

function updateFavUI() {
  let u = currentUser();
  let favs = u ? getFavs(u.username) : [];
  playlist_items.forEach(function (item, i) {
    let heart = item.querySelector(".pl-fav");
    if (heart) heart.classList.toggle("on", favs.indexOf(i) >= 0);
  });
}

function toggleFav(index) {
  let u = currentUser();
  if (!u) {
    showView("login");
    return;
  }
  let favs = getFavs(u.username);
  let i = favs.indexOf(index);
  if (i >= 0) favs.splice(i, 1);
  else favs.push(index);
  saveFavs(u.username, favs);
  updateFavUI();
}

function renderProfile() {
  let u = currentUser();
  if (!u) return;
  document.getElementById("profile-name").textContent = u.username;
  let favs = getFavs(u.username);
  document.getElementById("profile-sub").textContent = favs.length + " 首收藏";
  let box = document.getElementById("profile-favs");
  box.innerHTML = "";
  if (favs.length === 0) {
    let empty = document.createElement("div");
    empty.className = "pf-empty";
    empty.textContent = "暂无收藏，去唱片集点个赞吧";
    box.appendChild(empty);
    return;
  }
  favs.forEach(function (idx) {
    let track = track_list[idx];
    let item = document.createElement("div");
    item.className = "pf-item";
    let icon = document.createElement("i");
    icon.className = "fa fa-music";
    let name = document.createElement("span");
    name.className = "pf-name";
    name.textContent = track.name;
    item.appendChild(icon);
    item.appendChild(name);
    item.addEventListener("click", function () {
      playFromPlaylist(idx);
    });
    box.appendChild(item);
  });
}

function showRegister(show) {
  document.getElementById("login-form").style.display = show ? "none" : "block";
  document.getElementById("reg-form").style.display = show ? "block" : "none";
  document.getElementById("sw-reg").style.display = show ? "none" : "block";
  document.getElementById("sw-login").style.display = show ? "block" : "none";
  document.getElementById("auth-msg").textContent = "";
}

/* ---- 短信验证码（模拟）----
   当前为本地模拟：验证码固定为 CODE_MOCK，直接显示在页面提示里。
   接入真实短信时，只需改 sendSmsCode() 调用后端下发验证码，
   并在 doRegister() 里改用后端校验验证码即可（见下方 TODO）。 */
const CODE_MOCK = "123456";
let codeTimer = null;

function sendSmsCode() {
  let phone = document.getElementById("reg-phone").value.trim();
  let btn = document.getElementById("send-code-btn");
  let msg = document.getElementById("auth-msg");
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    msg.textContent = "请输入正确的手机号";
    return;
  }
  if (codeTimer) return;

  // TODO: 接入真实短信 —— 调用后端接口下发验证码并存储：
  // const res = await fetch("/api/send-code", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ phone })
  // });

  msg.textContent = "验证码已发送（模拟：请输入 " + CODE_MOCK + "）";
  let count = 60;
  btn.disabled = true;
  btn.textContent = count + "s";
  codeTimer = setInterval(function () {
    count--;
    btn.textContent = count + "s";
    if (count <= 0) {
      clearInterval(codeTimer);
      codeTimer = null;
      btn.disabled = false;
      btn.textContent = "发送验证码";
    }
  }, 1000);
}

function doLogin(e) {
  e.preventDefault();
  let u = document.getElementById("login-user").value.trim();
  let p = document.getElementById("login-pass").value;
  let msg = document.getElementById("auth-msg");
  if (!u || !p) {
    msg.textContent = "请输入手机号/用户名和密码";
    return false;
  }
  let user = getUsers().find(function (x) { return x.username === u && x.password === p; });
  if (!user) {
    msg.textContent = "手机号/用户名或密码错误";
    return false;
  }
  setCurrentUser(user);
  msg.textContent = "登录成功";
  updateAuthUI();
  updateFavUI();
  showView("profile");
  return false;
}

function doRegister(e) {
  e.preventDefault();
  let phone = document.getElementById("reg-phone").value.trim();
  let code = document.getElementById("reg-code").value.trim();
  let p1 = document.getElementById("reg-pass").value;
  let p2 = document.getElementById("reg-pass2").value;
  let msg = document.getElementById("auth-msg");

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    msg.textContent = "请输入正确的手机号";
    return false;
  }
  if (!code) {
    msg.textContent = "请输入验证码";
    return false;
  }

  // TODO: 接入真实短信 —— 校验后端下发的验证码，替换下面这行：
  if (code !== CODE_MOCK) {
    msg.textContent = "验证码错误";
    return false;
  }

  if (!p1 || !p2) {
    msg.textContent = "请设置密码";
    return false;
  }
  if (p1 !== p2) {
    msg.textContent = "两次密码不一致";
    return false;
  }

  let users = getUsers();
  if (users.some(function (x) { return x.username === phone; })) {
    msg.textContent = "该手机号已注册";
    return false;
  }

  users.push({ username: phone, password: p1, phone: phone });
  saveUsers(users);
  setCurrentUser({ username: phone });
  msg.textContent = "注册成功";
  updateAuthUI();
  updateFavUI();
  showView("profile");
  return false;
}

function doLogout() {
  setCurrentUser(null);
  updateAuthUI();
  updateFavUI();
  showView("menu");
}

function enterPlayer() {
  let cur = currentViewName();
  if (cur !== "player") {
    if (nav_stack.length === 0 || nav_stack[nav_stack.length - 1] !== cur) {
      nav_stack.push(cur);
    }
  }
  showView("player");
}

function goBack() {
  if (nav_stack.length > 0) {
    showView(nav_stack.pop());
  }
}

function toggleExpand() {
  let vp = document.getElementById("view-player");
  vp.classList.toggle("expanded");
  let btn = vp.querySelector(".player-expand");
  let icon = btn.querySelector("i");
  if (vp.classList.contains("expanded")) {
    icon.className = "fa fa-compress";
    btn.title = "缩小";
  } else {
    icon.className = "fa fa-expand";
    btn.title = "放大";
  }
}

let fv_disc = document.querySelector(".fv-disc");
let float_vinyl = document.querySelector(".float-vinyl");
let bg_layer = document.getElementById("bg-layer");
let desktopMQ = window.matchMedia("(min-width: 1024px)");

function playFromPlaylist(index) {
  track_index = index;
  loadTrack(track_index);
  playTrack();
  if (!desktopMQ.matches) enterPlayer();
}

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  fv_disc.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;
  updatePlaylistActive();

  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);
  loadBgFromCover(track_list[track_index].image);
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
  paintSlider(seek_slider, 0);
}

/* ---- 图片 & 视频库 ---- */

let image_files = [
  "picture/Camera_1040g3k031ounu051h4505o9i9lk0khct2fcisvo (.jpg",
  "picture/DSC_8517.jpg",
  "picture/DSC_8650.jpg",
  "picture/DSC07350.JPG",
  "picture/DSC07510.JPG",
  "picture/DSC07630.JPG",
  "picture/mmexport1778030579649.jpg",
  "picture/mmexport1778031143378.jpg",
  "picture/mmexport1778031188890.jpg",
  "picture/mmexport1778032194331.jpg",
  "picture/mmexport1778032342210.jpg",
  "picture/mmexport1781067832250.jpg"
];

let video_files = [
  "video/034d00a5aa4e42bb126ba47676878206.mp4",
  "video/287e52dffd72d55420a1f739efb975df.mp4",
  "video/30c61c79e30c1c6c3e99060fcb01f5e9.mp4",
  "video/3579453c37a60faa2eaa27c8f79db22e.mp4",
  "video/56b183375f85e227aa44e17bee3a2853.mp4",
  "video/989c9fca6151182c279c488336cae7bf.mp4"
];

function thumbPath(src) {
  let slash = src.lastIndexOf("/");
  let dot = src.lastIndexOf(".");
  let name = src.slice(slash + 1, dot);
  return "picture/thumbs/" + name + "_thumb.jpg";
}

function buildGallery() {
  let grid = document.querySelector(".img-grid");
  if (!grid) return;
  grid.innerHTML = "";
  image_files.forEach(function (src, i) {
    let cell = document.createElement("div");
    cell.className = "img-cell";
    cell.title = "查看大图";
    cell.style.backgroundImage = "url('" + encodeURI(thumbPath(src)) + "')";
    cell.addEventListener("click", function () {
      openImageAt(i);
    });
    grid.appendChild(cell);
  });
}

function buildVideos() {
  let list = document.querySelector(".video-list");
  if (!list) return;
  list.innerHTML = "";
  video_files.forEach(function (src, i) {
    let item = document.createElement("div");
    item.className = "video-item";

    let thumb = document.createElement("div");
    thumb.className = "video-thumb";
    thumb.innerHTML = '<i class="fa fa-play"></i>';

    let name = document.createElement("div");
    name.className = "video-name";
    name.textContent = "现场视频 0" + (i + 1);

    item.appendChild(thumb);
    item.appendChild(name);
    item.addEventListener("click", function () {
      openVideoAt(i);
    });
    list.appendChild(item);
  });
}

let media_mode = "image";
let media_index = 0;

function openImageAt(index) {
  media_mode = "image";
  media_index = index;
  let lb = document.getElementById("lightbox");
  let img = document.getElementById("lb-img");
  let video = document.getElementById("lb-video");
  video.pause();
  video.removeAttribute("src");
  video.load();
  video.style.display = "none";
  img.src = encodeURI(image_files[index]);
  img.style.display = "block";
  lb.classList.add("open");
}

function openVideoAt(index) {
  media_mode = "video";
  media_index = index;
  let lb = document.getElementById("lightbox");
  let img = document.getElementById("lb-img");
  let video = document.getElementById("lb-video");
  img.removeAttribute("src");
  img.style.display = "none";
  video.src = encodeURI(video_files[index]);
  video.style.display = "block";
  lb.classList.add("open");
  video.play();
}

function prevMedia() {
  if (media_mode === "image") {
    openImageAt((media_index - 1 + image_files.length) % image_files.length);
  } else {
    openVideoAt((media_index - 1 + video_files.length) % video_files.length);
  }
}

function nextMedia() {
  if (media_mode === "image") {
    openImageAt((media_index + 1) % image_files.length);
  } else {
    openVideoAt((media_index + 1) % video_files.length);
  }
}

document.addEventListener("keydown", function (e) {
  let lb = document.getElementById("lightbox");
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") {
    closeLightbox();
  } else if (e.key === "ArrowLeft") {
    prevMedia();
  } else if (e.key === "ArrowRight") {
    nextMedia();
  }
});

document.getElementById("lightbox").addEventListener("wheel", function (e) {
  if (!this.classList.contains("open")) return;
  e.preventDefault();
  if (e.deltaY > 0) nextMedia();
  else prevMedia();
}, { passive: false });

function closeLightbox() {
  let lb = document.getElementById("lightbox");
  let video = document.getElementById("lb-video");
  let img = document.getElementById("lb-img");
  video.pause();
  video.removeAttribute("src");
  video.load();
  video.style.display = "none";
  img.removeAttribute("src");
  img.style.display = "none";
  lb.classList.remove("open");
}

/* ---- 同人文 ---- */

function buildFanfic() {
  let list = document.getElementById("fanfic-list");
  if (!list) return;
  list.innerHTML = '<p class="page-lead">长篇小说 · NOVEL</p>';
  fanfic_chapters.forEach(function (ch, i) {
    let item = document.createElement("div");
    item.className = "fanfic-item";

    let chEl = document.createElement("div");
    chEl.className = "fanfic-ch";
    chEl.textContent = ch.ch;

    let titleEl = document.createElement("div");
    titleEl.className = "fanfic-title";
    titleEl.textContent = ch.title;

    item.appendChild(chEl);
    item.appendChild(titleEl);
    item.addEventListener("click", function () {
      openChapter(i);
    });
    list.appendChild(item);
  });
}

let current_chapter = 0;

function openChapter(i) {
  current_chapter = i;
  let ch = fanfic_chapters[i];
  document.getElementById("fanfic-list").style.display = "none";
  document.getElementById("fanfic-read").style.display = "block";
  document.getElementById("fanfic-chapter-title").textContent = ch.ch + " · " + ch.title;
  let body = document.getElementById("fanfic-body");
  body.innerHTML = "";
  ch.paras.forEach(function (p) {
    let para = document.createElement("p");
    para.textContent = p;
    body.appendChild(para);
  });
  updateFanficNav();
  let v = document.getElementById("view-fanfic");
  v.scrollTop = 0;
  let pb = v.querySelector(".page-body");
  if (pb) pb.scrollTop = 0;
}

function updateFanficNav() {
  let prev = document.getElementById("fanfic-prev");
  let next = document.getElementById("fanfic-next");
  prev.classList.toggle("disabled", current_chapter <= 0);
  next.classList.toggle("disabled", current_chapter >= fanfic_chapters.length - 1);
}

function prevChapter() {
  if (current_chapter > 0) openChapter(current_chapter - 1);
}

function nextChapter() {
  if (current_chapter < fanfic_chapters.length - 1) openChapter(current_chapter + 1);
}

function closeChapter() {
  document.getElementById("fanfic-read").style.display = "none";
  document.getElementById("fanfic-list").style.display = "block";
  let body = document.getElementById("fanfic-body");
  body.innerHTML = "";
}

// Build the playlist, load the first track, open the main menu
buildPlaylist();
loadTrack(track_index);
paintSlider(volume_slider, volume_slider.value);
buildGallery();
buildVideos();
buildFanfic();
updateAuthUI();
updateFavUI();
showView("menu");

function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
  float_vinyl.classList.add("playing");
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
  float_vinyl.classList.remove("playing");
}

function nextTrack() {
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length - 1;
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
  paintSlider(volume_slider, volume_slider.value);
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    seek_slider.value = seekPosition;
    paintSlider(seek_slider, seekPosition);

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}
