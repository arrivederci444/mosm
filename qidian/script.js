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

  /* ---------- 报名表单 ---------- */
  var form = document.getElementById("joinForm");
  var hint = document.getElementById("formHint");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var line = [];
      data.forEach(function (v, k) {
        if (v) line.push(k + ": " + v);
      });
      if (hint) hint.textContent = "收到！我们会来找你玩的～";
      form.reset();
      setTimeout(function () { if (hint) hint.textContent = ""; }, 6000);
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
  /* ---------- 职位考核标准弹窗 ---------- */
  // 在这里填写每个职位的考核标准，保存后刷新即可生效
  var roleInfo = {
    "主唱": {
      title: "🎤 主唱",
      points: [
        "1. 考核标准待补充（示例：音准、节奏、气息）",
        "2. 考核标准待补充（示例：现场表现力）"
      ]
    },
    "吉他": {
      title: "🎸 吉他",
      points: [
        "1. 考核标准待补充",
        "2. 考核标准待补充"
      ]
    },
    "贝斯": {
      title: "🎼 贝斯",
      points: [
        "1. 考核标准待补充",
        "2. 考核标准待补充"
      ]
    },
    "鼓手": {
      title: "🥁 鼓手",
      points: [
        "1. 考核标准待补充",
        "2. 考核标准待补充"
      ]
    },
    "键盘": {
      title: "🎹 键盘",
      points: [
        "1. 考核标准待补充",
        "2. 考核标准待补充"
      ]
    },
    "写词写曲": {
      title: "✍️ 写词写曲",
      points: [
        "1. 考核标准待补充",
        "2. 考核标准待补充"
      ]
    },
    "摄影": {
      title: "📷 摄影",
      points: [
        "1. 考核标准待补充",
        "2. 考核标准待补充"
      ]
    },
    "其他乐器": {
      title: "🎷 其他乐器",
      points: [
        "1. 考核标准待补充",
        "2. 考核标准待补充"
      ]
    }
  };

  var roleModal = document.getElementById("roleModal");
  var roleTitle = document.getElementById("roleTitle");
  var roleBody = document.getElementById("roleBody");

  function showRole(key) {
    var info = roleInfo[key];
    if (!info || !roleModal) return;
    roleTitle.textContent = info.title;
    roleBody.innerHTML = "";
    info.points.forEach(function (pt) {
      var p = document.createElement("p");
      p.className = "role-point";
      p.textContent = pt;
      roleBody.appendChild(p);
    });
    roleModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function hideRole() {
    if (roleModal) {
      roleModal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  var chips = document.querySelectorAll(".chip[data-role]");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      showRole(c.getAttribute("data-role"));
    });
  });
  if (roleModal) {
    document.getElementById("roleClose").addEventListener("click", hideRole);
    roleModal.addEventListener("click", function (e) {
      if (e.target === roleModal) hideRole();
    });
  }
})();
