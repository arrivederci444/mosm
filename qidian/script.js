(function () {
  "use strict";

  var slides = document.querySelectorAll(".slide");
  var dotsBox = document.getElementById("dots");

  /* ---------- 进度点 ---------- */
  if (dotsBox) {
    slides.forEach(function (_, i) {
      var d = document.createElement("span");
      if (i === 0) d.classList.add("on");
      dotsBox.appendChild(d);
    });
  }
  var dots = dotsBox ? dotsBox.querySelectorAll("span") : [];

  /* ---------- 滚动进入动画 + 当前屏 ---------- */
  function activate(i) {
    slides.forEach(function (s, k) {
      s.classList.toggle("in", k <= i);
    });
    dots.forEach(function (d, k) {
      d.classList.toggle("on", k === i);
    });
  }

  var last = -1;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var i = Array.prototype.indexOf.call(slides, e.target);
        if (i > last) {
          last = i;
          activate(i);
        }
      }
    });
  }, { threshold: 0.6 });

  slides.forEach(function (s) { io.observe(s); });

  // 首屏直接显示
  activate(0);

  /* ---------- 报名表单（提交到 Supabase） ---------- */
  // ⬇️ 在这里填入你的 Supabase 项目地址和 anon 公钥
  var SUPABASE_URL = "https://gtatmoazcdmmcmaqqgsl.supabase.co";
  var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0YXRtb2F6Y2RtbWNtYXFxZ3NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NTYxMjYsImV4cCI6MjEwMjUzMjEyNn0.XXU91NSzZ1n_clJm87IyAQ2aix-KlZ3nf4xJXn9XE7I";

  var form = document.getElementById("joinForm");
  var hint = document.getElementById("formHint");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]').value.trim();
      var major = form.querySelector('[name="major"]').value.trim();
      var phone = form.querySelector('[name="phone"]').value.trim();
      var grp = form.querySelector('input[name="group"]:checked');
      var group = grp ? grp.value : "无";

      if (hint) {
        hint.textContent = "提交中…";
        hint.style.color = "var(--yellow)";
      }

      fetch(SUPABASE_URL + "/rest/v1/signups", {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({ name: name, major: major, phone: phone, group: group })
      })
      .then(function (res) {
        if (res.ok) {
          if (hint) {
            hint.textContent = "收到！我们会来找你玩的～";
            hint.style.color = "var(--green)";
          }
          form.reset();
        } else {
          throw new Error("HTTP " + res.status);
        }
      })
      .catch(function () {
        if (hint) {
          hint.textContent = "提交失败，麻烦直接进群或私聊我们～";
          hint.style.color = "var(--pink)";
        }
      })
      .then(function () {
        setTimeout(function () { if (hint) hint.textContent = ""; }, 6000);
      });
    });
  }

  /* ---------- 演出照片弹窗 ---------- */
  var photoDir = "picture/";
  var photos = [
    "DSC_8650.jpg",
    "DSC07350.JPG",
    "DSC07630.JPG",
    "mmexport1778030579649.jpg",
    "mmexport1778031188890.jpg",
    "微信图片_20260815200832_3234_25.jpg",
    "微信图片_20260815200833_3235_25.jpg",
    "微信图片_20260815200834_3236_25.jpg",
    "微信图片_20260815200835_3237_25.jpg",
    "微信图片_20260815200835_3238_25.jpg"
  ];

  var aboutLink = document.getElementById("aboutLink");
  var galleryModal = document.getElementById("galleryModal");
  var galleryGrid = document.getElementById("galleryGrid");
  var lb = document.getElementById("lb");
  var lbImg = document.getElementById("lbImg");
  var cur = 0;

  function showGallery() {
    if (aboutLink && galleryModal) {
      if (!galleryGrid.childElementCount) {
        photos.forEach(function (p) {
          var img = document.createElement("img");
          img.src = photoDir + encodeURI(p);
          img.alt = "演出照片";
          img.addEventListener("click", function () {
            cur = photos.indexOf(p);
            lbImg.src = photoDir + encodeURI(photos[cur]);
            lb.classList.add("open");
            document.body.style.overflow = "hidden";
          });
          galleryGrid.appendChild(img);
        });
      }
      galleryModal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }
  function hideGallery() {
    if (galleryModal) {
      galleryModal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  if (aboutLink) aboutLink.addEventListener("click", showGallery);
  if (galleryModal) {
    document.getElementById("galleryClose").addEventListener("click", hideGallery);
    galleryModal.addEventListener("click", function (e) {
      if (e.target === galleryModal) hideGallery();
    });
  }

  /* ---------- 大图灯箱 ---------- */
  function step(d) {
    cur = (cur + d + photos.length) % photos.length;
    lbImg.src = photoDir + encodeURI(photos[cur]);
  }
  if (lb) {
    document.getElementById("lbClose").addEventListener("click", function () {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    });
    document.getElementById("lbPrev").addEventListener("click", function () { step(-1); });
    document.getElementById("lbNext").addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (e) {
      if (e.target === lb) {
        lb.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") {
        lb.classList.remove("open");
        document.body.style.overflow = "";
      }
      if (e.key === "ArrowLeft") document.getElementById("lbPrev").click();
      if (e.key === "ArrowRight") document.getElementById("lbNext").click();
    });
  }
})();
