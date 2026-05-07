document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  });
});

const openingPhoto = document.querySelector(".opening-photo");
const siteHeader = document.querySelector(".site-header");
const siteMenu = document.querySelector(".site-menu");
const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".menu-panel");
let menuFrame;
let menuMotion;
let menuCloseTimer;

function closeMenu() {
  if (!siteMenu || !menuToggle) {
    return;
  }

  clearMenuCloseTimer();
  setMenuOpen(false);
}

function menuUsesHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function clearMenuCloseTimer() {
  if (!menuCloseTimer) {
    return;
  }

  window.clearTimeout(menuCloseTimer);
  menuCloseTimer = null;
}

function scheduleMenuClose(delay = 120) {
  clearMenuCloseTimer();
  menuCloseTimer = window.setTimeout(closeMenu, delay);
}

function applyMenu(values) {
  if (!menuPanel) {
    return;
  }

  menuPanel.style.setProperty("--menu-opacity", values.opacity.toString());
  menuPanel.style.setProperty("--menu-y", `${values.y}px`);
  menuPanel.style.setProperty("--menu-scale", values.scale.toString());
}

function animateMenu() {
  if (!menuMotion) {
    menuFrame = null;
    return;
  }

  let keepAnimating = false;

  ["opacity", "y", "scale"].forEach((key) => {
    const next = springValue(
      menuMotion.current[key],
      menuMotion.velocity[key],
      menuMotion.target[key],
    );

    menuMotion.current[key] = next.value;
    menuMotion.velocity[key] = next.velocity;

    if (
      Math.abs(menuMotion.target[key] - menuMotion.current[key]) > 0.01 ||
      Math.abs(menuMotion.velocity[key]) > 0.01
    ) {
      keepAnimating = true;
    }
  });

  applyMenu(menuMotion.current);

  if (!keepAnimating && menuMotion.target.opacity === 0) {
    siteMenu?.classList.remove("is-open");
  }

  menuFrame = keepAnimating ? requestAnimationFrame(animateMenu) : null;
}

function requestMenuAnimation() {
  if (!menuFrame) {
    menuFrame = requestAnimationFrame(animateMenu);
  }
}

function setMenuOpen(isOpen) {
  if (!siteMenu || !menuToggle || !menuPanel) {
    return;
  }

  if (isOpen) {
    siteMenu.classList.add("is-open");
  }

  menuToggle.setAttribute("aria-expanded", isOpen.toString());

  const target = {
    opacity: isOpen ? 1 : 0,
    y: isOpen ? 0 : -16,
    scale: isOpen ? 1 : 0.96,
  };

  if (!menuMotion) {
    menuMotion = {
      current: {
        opacity: isOpen ? 0 : 1,
        y: isOpen ? -16 : 0,
        scale: isOpen ? 0.96 : 1,
      },
      target,
      velocity: { opacity: 0, y: 0, scale: 0 },
    };
  } else {
    menuMotion.target = target;
  }

  requestMenuAnimation();
}

if (siteMenu && menuToggle) {
  siteMenu.addEventListener("mouseenter", () => {
    if (menuUsesHover()) {
      clearMenuCloseTimer();
      setMenuOpen(true);
    }
  });

  siteMenu.addEventListener("mouseleave", () => {
    if (menuUsesHover()) {
      scheduleMenuClose();
    }
  });

  siteMenu.addEventListener("focusin", () => {
    clearMenuCloseTimer();
    setMenuOpen(true);
  });

  siteMenu.addEventListener("focusout", (event) => {
    if (!siteMenu.contains(event.relatedTarget)) {
      scheduleMenuClose(0);
    }
  });

  menuToggle.addEventListener("click", () => {
    if (menuUsesHover()) {
      setMenuOpen(true);
      return;
    }

    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("click", (event) => {
    if (!siteMenu.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const story = document.querySelector(".story");
const storyScrim = document.querySelector(".story-scrim");
const storyPreview = document.querySelector(".story-preview");
const storyPreviewImage = storyPreview?.querySelector("img");
const storyPreviewVideo = storyPreview?.querySelector("video");
const storyPreviewClose = storyPreview?.querySelector(".story-preview-close");
const storyImages = [
  'url("img/hero.JPG")',
  'url("img/venue.webp")',
  'url("img/island.png")',
  'url("img/island-route.png")',
  'url("img/One Hotel Room.jpg")',
];
const storyAssetMap = {
  "figured it out": { type: "image", src: "img/figured it out.jpeg", aspect: "4 / 3" },
  "deb's puppy": { type: "video", src: "img/figured it out.MOV", aspect: "3 / 4" },
  miles: { type: "video", src: "img/figured it out.MOV", aspect: "3 / 4" },
  camping: { type: "image", src: "img/camping.JPG", aspect: "4 / 3" },
  camped: { type: "image", src: "img/camping.JPG", aspect: "4 / 3" },
  dinners: { type: "image", src: "img/dinners.jpeg", aspect: "4 / 3" },
  "had dinners": { type: "image", src: "img/dinners.jpeg", aspect: "4 / 3" },
  trips: { type: "image", src: "img/trips.jpeg", aspect: "4 / 3" },
  "took trips": { type: "image", src: "img/trips.jpeg", aspect: "4 / 3" },
  "working out": { type: "image", src: "img/working out.JPG", aspect: "3 / 4" },
  trails: { type: "image", src: "img/trails.jpeg", aspect: "3 / 4" },
  beach: { type: "image", src: "img/beach.JPG", aspect: "3 / 4" },
  "met the carvalhos": { type: "image", src: "img/carvalhos.JPG", aspect: "3 / 2" },
  "new year's": { type: "image", src: "img/new years.JPG", aspect: "4 / 3" },
  together: { type: "image", src: "img/together.JPG", aspect: "4 / 3" },
  friends: { type: "image", src: "img/friends.jpeg", aspect: "3 / 4" },
  "crush souls": { type: "image", src: "img/crush souls.JPG", aspect: "3 / 4" },
  kauai: { type: "image", src: "img/kauai.JPG", aspect: "4 / 3" },
  house: { type: "image", src: "img/house.JPG", aspect: "4 / 3" },
  proposed: { type: "image", src: "img/proposed.JPG", aspect: "2 / 3" },
  "propose to deb": { type: "image", src: "img/proposed.JPG", aspect: "2 / 3" },
  "proposed to deb": { type: "image", src: "img/proposed.JPG", aspect: "2 / 3" },
  "best night": { type: "image", src: "img/best night.JPG", aspect: "2 / 3" },
};
let previewFrame;
let previewMotion;
let activeStoryHotspot;
let storyPreviewRequestId = 0;
const storyPreviewAssetCache = new Map();
const springSettings = {
  springTension: 0.055,
  springFriction: 0.6,
};

document.querySelectorAll(".spring-tuner input").forEach((input) => {
  const output = document.querySelector(`.spring-tuner output[data-for="${input.id}"]`);

  function updateSpringSetting() {
    springSettings[input.id] = Number(input.value);

    if (output) {
      output.value = Number(input.value).toFixed(3);
    }
  }

  input.addEventListener("input", updateSpringSetting);
  updateSpringSetting();
});

function randomSeeded(seed) {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function highlightStoryWords() {
  if (!story) {
    return;
  }

  const existingHotspots = story.querySelectorAll(".story-hotspot");

  if (existingHotspots.length) {
    existingHotspots.forEach((hotspot, index) => {
      const asset = getStoryAsset(hotspot, index);

      if (asset) {
        hotspot.dataset.previewType = asset.type;
        hotspot.dataset.previewSrc = asset.src;
        hotspot.dataset.previewAspect = asset.aspect;
      } else if (!hotspot.dataset.image) {
        hotspot.dataset.previewType = "image";
        hotspot.dataset.image = storyImages[index % storyImages.length];
      }
    });
    return;
  }

  const words = [];

  story.querySelectorAll("p").forEach((paragraph, paragraphIndex) => {
    const parts = paragraph.textContent.split(/(\s+)/);
    const candidates = parts
      .map((part, index) => ({ part, index }))
      .filter(({ part }) => /^[A-Za-z][A-Za-z'-]{5,}$/.test(part));

    words.push({ paragraph, paragraphIndex, parts, candidates });
  });

  const random = randomSeeded(20261114);

  words.forEach(({ paragraph, paragraphIndex, parts, candidates }) => {
    const count = Math.min(2, candidates.length);
    const picked = new Set();

    while (picked.size < count) {
      picked.add(candidates[Math.floor(random() * candidates.length)].index);
    }

    paragraph.innerHTML = parts
      .map((part, index) => {
        if (!picked.has(index)) {
          return part;
        }

        const image = storyImages[(paragraphIndex + picked.size + index) % storyImages.length];
        return `<span class="story-hotspot" tabindex="0" data-image='${image}'>${part}</span>`;
      })
      .join("");
  });
}

function normalizeStoryLabel(label) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ");
}

function getStoryAsset(hotspot, index = 0) {
  if (hotspot.dataset.previewSrc) {
    return {
      type: hotspot.dataset.previewType || "image",
      src: hotspot.dataset.previewSrc,
    };
  }

  const label = normalizeStoryLabel(hotspot.textContent);
  return storyAssetMap[label] || null;
}

function setStoryPreviewAspect(width, height) {
  if (!storyPreview || !width || !height) {
    return;
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const padding = 8;
  const isMobile = mobilePreviewMode();
  const ratio = width / height;
  const isLandscape = ratio > 1;
  const minOuterWidth = isMobile ? 260 : 170;
  const maxOuterWidth = isMobile ? viewportWidth - 56 : isLandscape ? 420 : 310;
  const idealOuterWidth = isMobile
    ? viewportWidth - 56
    : viewportWidth * (isLandscape ? 0.3 : 0.22);
  const maxCardHeight = isMobile ? viewportHeight * 0.78 : Math.max(220, viewportHeight - 96);
  let mediaWidth = clamp(idealOuterWidth, minOuterWidth, maxOuterWidth) - (padding * 2);
  let mediaHeight = mediaWidth / ratio;

  if (mediaHeight + (padding * 2) > maxCardHeight) {
    mediaHeight = maxCardHeight - (padding * 2);
    mediaWidth = mediaHeight * ratio;
  }

  storyPreview.style.setProperty("--preview-card-width", `${mediaWidth + (padding * 2)}px`);
  storyPreview.style.setProperty("--preview-card-height", `${mediaHeight + (padding * 2)}px`);
}

function parsePreviewAspect(aspect) {
  if (!aspect) {
    return null;
  }

  const [width, height] = aspect.split("/").map((value) => Number(value.trim()));

  if (!width || !height) {
    return null;
  }

  return { width, height };
}

function getStoryPreviewDescriptor(hotspot) {
  const type = hotspot.dataset.previewType || "image";
  const src = hotspot.dataset.previewSrc || hotspot.dataset.image?.replace(/^url\(["']?|["']?\)$/g, "");
  const aspect = parsePreviewAspect(hotspot.dataset.previewAspect);

  if (!src) {
    return null;
  }

  return {
    type,
    src,
    width: aspect?.width,
    height: aspect?.height,
  };
}

function loadStoryPreviewAsset(descriptor) {
  if (!descriptor) {
    return Promise.resolve(null);
  }

  const cacheKey = `${descriptor.type}:${descriptor.src}`;
  const cached = storyPreviewAssetCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  if (descriptor.type === "video") {
    const ready = new Promise((resolve) => {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve({
          ...descriptor,
          width: video.videoWidth || descriptor.width || 3,
          height: video.videoHeight || descriptor.height || 4,
        });
      };
      video.onerror = () => resolve(descriptor);
      video.src = descriptor.src;
    });
    storyPreviewAssetCache.set(cacheKey, ready);
    return ready;
  }

  const ready = new Promise((resolve) => {
    const image = new Image();
    image.onload = async () => {
      if (image.decode) {
        await image.decode().catch(() => {});
      }

      resolve({
        ...descriptor,
        width: image.naturalWidth || 4,
        height: image.naturalHeight || 3,
      });
    };
    image.onerror = () => resolve(descriptor);
    image.src = descriptor.src;
  });
  storyPreviewAssetCache.set(cacheKey, ready);
  return ready;
}

function preloadStoryPreviewAssets() {
  document.querySelectorAll(".story-hotspot").forEach((hotspot) => {
    const descriptor = getStoryPreviewDescriptor(hotspot);

    if (descriptor) {
      loadStoryPreviewAsset(descriptor);
    }
  });
}

function mobilePreviewMode() {
  return window.matchMedia("(max-width: 640px)").matches;
}

function requestPreviewReposition() {
  if (!previewMotion) {
    return;
  }

  const width = storyPreview?.offsetWidth || 0;
  const height = storyPreview?.offsetHeight || 0;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const margin = 28;

  if (mobilePreviewMode()) {
    previewMotion.target.x = (viewportWidth - width) / 2;
    previewMotion.target.y = (viewportHeight - height) / 2;
  } else {
    previewMotion.target.x = clamp(previewMotion.target.x, margin, Math.max(margin, viewportWidth - width - margin));
    previewMotion.target.y = clamp(previewMotion.target.y, margin, Math.max(margin, viewportHeight - height - margin));
  }

  requestStoryPreviewAnimation();
}

function setStoryPreviewAsset(descriptor) {
  if (!storyPreview) {
    return;
  }

  const type = descriptor.type || "image";
  const src = descriptor.src;

  storyPreview.classList.remove("is-video", "is-image");

  if (storyPreviewImage) {
    storyPreviewImage.onload = null;
    storyPreviewImage.removeAttribute("src");
  }

  if (storyPreviewVideo) {
    storyPreviewVideo.pause();
    storyPreviewVideo.onloadedmetadata = null;
    storyPreviewVideo.removeAttribute("src");
    storyPreviewVideo.load();
  }

  if (descriptor.width && descriptor.height) {
    setStoryPreviewAspect(descriptor.width, descriptor.height);
  }

  if (type === "video" && storyPreviewVideo && src) {
    storyPreviewVideo.muted = true;
    storyPreviewVideo.loop = true;
    storyPreviewVideo.playsInline = true;
    storyPreviewVideo.src = src;
    storyPreviewVideo.currentTime = 0;
    storyPreview.classList.add("is-video");
    storyPreviewVideo.play().catch(() => {});
    return;
  }

  if (storyPreviewImage && src) {
    storyPreviewImage.src = src;
    storyPreview.classList.add("is-image");
  }
}

function springValue(current, velocity, target) {
  const tension = springSettings.springTension;
  const friction = springSettings.springFriction;
  const nextVelocity = (velocity + ((target - current) * tension)) * friction;

  return {
    value: current + nextVelocity,
    velocity: nextVelocity,
  };
}

function applyStoryPreview(values) {
  storyPreview.style.setProperty("--preview-x", `${values.x}px`);
  storyPreview.style.setProperty("--preview-y", `${values.y}px`);
  storyPreview.style.setProperty("--preview-lift", `${values.lift}px`);
  storyPreview.style.setProperty("--preview-origin-y", values.originY);
  storyPreview.style.setProperty("--preview-scale", values.scale.toString());
  storyPreview.style.setProperty("--preview-rotation", `${values.rotation}deg`);
}

function animateStoryPreview() {
  if (!previewMotion) {
    previewFrame = null;
    return;
  }

  let keepAnimating = false;

  ["x", "y", "lift", "scale", "rotation"].forEach((key) => {
    const next = springValue(
      previewMotion.current[key],
      previewMotion.velocity[key],
      previewMotion.target[key],
    );

    previewMotion.current[key] = next.value;
    previewMotion.velocity[key] = next.velocity;

    if (
      Math.abs(previewMotion.target[key] - previewMotion.current[key]) > 0.01 ||
      Math.abs(previewMotion.velocity[key]) > 0.01
    ) {
      keepAnimating = true;
    }
  });

  previewMotion.current.originY = previewMotion.target.originY;
  applyStoryPreview(previewMotion.current);
  previewFrame = keepAnimating ? requestAnimationFrame(animateStoryPreview) : null;
}

function requestStoryPreviewAnimation() {
  if (!previewFrame) {
    previewFrame = requestAnimationFrame(animateStoryPreview);
  }
}

function getPreviewTarget(event, visible = true) {
  const rect = event.currentTarget.getBoundingClientRect();
  const localProgress = clamp((event.clientX - rect.left) / rect.width, 0, 1);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const margin = mobilePreviewMode() ? 16 : 28;
  const gap = 18;
  const previewWidth = storyPreview?.offsetWidth || 260;
  const previewHeight = storyPreview?.offsetHeight || 345;

  if (mobilePreviewMode()) {
    return {
      x: (viewportWidth - previewWidth) / 2,
      y: (viewportHeight - previewHeight) / 2,
      lift: visible ? 0 : 14,
      originY: "center",
      scale: visible ? 1 : 0.86,
      rotation: 0,
    };
  }

  const aboveTop = event.clientY - previewHeight - gap;
  const belowTop = event.clientY + gap;
  const aboveFits = aboveTop >= margin;
  const belowFits = belowTop + previewHeight <= viewportHeight - margin;
  const spaceAbove = event.clientY - gap - margin;
  const spaceBelow = viewportHeight - event.clientY - gap - margin;
  const placement = aboveFits || (!belowFits && spaceAbove >= spaceBelow) ? "above" : "below";
  const top = placement === "above" ? aboveTop : belowTop;
  const maxLeft = Math.max(margin, viewportWidth - previewWidth - margin);
  const maxTop = Math.max(margin, viewportHeight - previewHeight - margin);

  return {
    x: clamp(event.clientX - (previewWidth / 2), margin, maxLeft),
    y: clamp(top, margin, maxTop),
    lift: visible ? 0 : placement === "above" ? 10 : -10,
    originY: placement === "above" ? "bottom" : "top",
    scale: visible ? 1 : 0.72,
    rotation: visible ? lerp(-4, 4, localProgress) : 0,
  };
}

function positionStoryPreview(event) {
  if (!storyPreview) {
    return;
  }

  if (!previewMotion) {
    const target = getPreviewTarget(event);
    previewMotion = {
      current: { ...target },
      target,
      velocity: { x: 0, y: 0, lift: 0, scale: 0, rotation: 0 },
    };
    applyStoryPreview(previewMotion.current);
    return;
  }

  previewMotion.target = getPreviewTarget(event);
  requestStoryPreviewAnimation();
}

async function showStoryPreview(event) {
  if (!storyScrim || !storyPreview) {
    return;
  }

  const descriptor = getStoryPreviewDescriptor(event.currentTarget);

  if (!descriptor) {
    return;
  }

  const requestId = ++storyPreviewRequestId;
  activeStoryHotspot = event.currentTarget;
  storyPreview.classList.remove("is-visible");
  const readyDescriptor = await loadStoryPreviewAsset(descriptor);

  if (requestId !== storyPreviewRequestId || activeStoryHotspot !== event.currentTarget || !readyDescriptor) {
    return;
  }

  setStoryPreviewAsset(readyDescriptor);
  const target = getPreviewTarget(event);
  previewMotion = {
    current: {
      ...target,
      lift: -8,
      scale: 0.72,
      rotation: 0,
    },
    target,
    velocity: { x: 0, y: 0, lift: 0, scale: 0, rotation: 0 },
  };
  applyStoryPreview(previewMotion.current);
  storyScrim.classList.add("is-visible");
  storyPreview.classList.add("is-visible");
  requestStoryPreviewAnimation();
}

function hideStoryPreview() {
  storyPreviewRequestId += 1;
  storyScrim?.classList.remove("is-visible");
  storyPreview?.classList.remove("is-visible");
  storyPreviewVideo?.pause();
  activeStoryHotspot = null;

  if (previewMotion) {
    const originY = previewMotion.target.originY;
    previewMotion.target = {
      ...previewMotion.target,
      lift: originY === "bottom" ? 10 : -10,
      originY,
      scale: 0.72,
      rotation: 0,
    };
    requestStoryPreviewAnimation();
  }
}

highlightStoryWords();
preloadStoryPreviewAssets();

document.querySelectorAll(".story-hotspot").forEach((hotspot) => {
  hotspot.addEventListener("pointerenter", (event) => {
    if (!mobilePreviewMode()) {
      showStoryPreview(event);
    }
  });
  hotspot.addEventListener("pointermove", (event) => {
    if (!mobilePreviewMode()) {
      positionStoryPreview(event);
    }
  });
  hotspot.addEventListener("pointerleave", () => {
    if (!mobilePreviewMode()) {
      hideStoryPreview();
    }
  });
  hotspot.addEventListener("click", (event) => {
    if (!mobilePreviewMode()) {
      return;
    }

    event.preventDefault();
    showStoryPreview(event);
  });
  hotspot.addEventListener("focus", (event) => {
    if (mobilePreviewMode()) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    showStoryPreview({
      clientX: rect.left + rect.width / 2,
      clientY: rect.top,
      currentTarget: event.currentTarget,
    });
  });
  hotspot.addEventListener("blur", hideStoryPreview);
});

storyScrim?.addEventListener("click", hideStoryPreview);
storyPreviewClose?.addEventListener("click", hideStoryPreview);

window.addEventListener("resize", () => {
  if (!activeStoryHotspot || !storyPreview?.classList.contains("is-visible")) {
    return;
  }

  const rect = activeStoryHotspot.getBoundingClientRect();
  const target = getPreviewTarget({
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
    currentTarget: activeStoryHotspot,
  });
  previewMotion = {
    current: { ...target },
    target,
    velocity: { x: 0, y: 0, lift: 0, scale: 0, rotation: 0 },
  };
  applyStoryPreview(previewMotion.current);
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function getOpeningPhotoTarget() {
  const viewportWidth = window.innerWidth;
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const isMobile = viewportWidth <= 820 || isTouchDevice;
  const startTop = isMobile
    ? (viewportWidth <= 520 ? 104 : 92)
    : clamp((viewportWidth * 0.16) - 56, 34, 199);
  const startWidth = viewportWidth <= 520
    ? 164
    : clamp(viewportWidth * 0.15, 150, 260);
  const headerRect = siteHeader.getBoundingClientRect();
  const endTop = isMobile ? Math.max(26, headerRect.top + 2) : headerRect.top - 10;
  const endWidth = isMobile ? 39 : 55;
  const startLeft = headerRect.left + (headerRect.width / 2);
  const progress = clamp(window.scrollY / 360, 0, 1);

  return {
    left: startLeft,
    top: lerp(startTop, endTop, progress),
    width: startWidth,
    scale: lerp(1, endWidth / startWidth, progress),
    rotation: lerp(5, 0, progress),
  };
}

let photoFrame;
let photoMotion;

function applyOpeningPhoto(values) {
  openingPhoto.style.setProperty("--photo-left", `${values.left}px`);
  openingPhoto.style.setProperty("--photo-top", `${values.top}px`);
  openingPhoto.style.setProperty("--photo-width", `${values.width}px`);
  openingPhoto.style.setProperty("--photo-scale", values.scale.toString());
  openingPhoto.style.setProperty("--photo-rotation", `${values.rotation}deg`);
}

function updateOpeningPhotoTarget({ snap = false } = {}) {
  if (!openingPhoto || !siteHeader) {
    return;
  }

  const target = getOpeningPhotoTarget();

  if (!photoMotion || snap) {
    photoMotion = {
      current: { ...target },
      target,
      velocity: { left: 0, top: 0, width: 0, scale: 0, rotation: 0 },
    };
    applyOpeningPhoto(photoMotion.current);
    return;
  }

  photoMotion.target = target;
  requestOpeningPhotoUpdate();
}

function animateOpeningPhoto() {
  if (!photoMotion) {
    photoFrame = null;
    return;
  }

  let keepAnimating = false;

  ["left", "top", "width", "scale", "rotation"].forEach((key) => {
    const next = springValue(
      photoMotion.current[key],
      photoMotion.velocity[key],
      photoMotion.target[key],
    );

    photoMotion.current[key] = next.value;
    photoMotion.velocity[key] = next.velocity;

    if (
      Math.abs(photoMotion.target[key] - photoMotion.current[key]) > 0.05 ||
      Math.abs(photoMotion.velocity[key]) > 0.05
    ) {
      keepAnimating = true;
    }
  });

  applyOpeningPhoto(photoMotion.current);
  photoFrame = keepAnimating ? requestAnimationFrame(animateOpeningPhoto) : null;
}

function requestOpeningPhotoUpdate() {
  if (photoFrame) {
    return;
  }

  photoFrame = requestAnimationFrame(animateOpeningPhoto);
}

updateOpeningPhotoTarget({ snap: true });
window.addEventListener("scroll", () => updateOpeningPhotoTarget(), { passive: true });
window.addEventListener("resize", () => updateOpeningPhotoTarget({ snap: true }));

const footerFoliage = document.querySelector(".footer-foliage");
let footerFoliageFrame;

function smoothstep(progress) {
  return progress * progress * (3 - (2 * progress));
}

function updateFooterFoliage() {
  footerFoliageFrame = null;

  if (!footerFoliage) {
    return;
  }

  const scrollMax = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const range = Math.min(520, scrollMax);
  const progress = smoothstep(clamp((window.scrollY - (scrollMax - range)) / range, 0, 1));
  const remaining = 1 - progress;

  footerFoliage.style.setProperty("--footer-back-y", `${remaining * 64}px`);
  footerFoliage.style.setProperty("--footer-front-y", `${remaining * 112}px`);
}

function requestFooterFoliageUpdate() {
  if (footerFoliageFrame) {
    return;
  }

  footerFoliageFrame = requestAnimationFrame(updateFooterFoliage);
}

updateFooterFoliage();
window.addEventListener("scroll", requestFooterFoliageUpdate, { passive: true });
window.addEventListener("resize", requestFooterFoliageUpdate);
