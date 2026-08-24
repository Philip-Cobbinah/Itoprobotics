const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const form = document.querySelector("[data-enquiry-form]");
const formStatus = document.querySelector("[data-form-status]");
const copyLocationButton = document.querySelector("[data-copy-location]");
const programButtons = document.querySelectorAll("[data-program]");
const slides = document.querySelectorAll("[data-slide]");
const previousSlideButton = document.querySelector("[data-carousel-prev]");
const nextSlideButton = document.querySelector("[data-carousel-next]");
const carouselDots = document.querySelector("[data-carousel-dots]");
const localVideos = document.querySelectorAll("[data-video-start][data-video-end]");
const scrollTopButton = document.querySelector("[data-scroll-top]");

let activeSlideIndex = 0;

const programs = {
  beginners: {
    title: "Arduino Robotics Starter",
    copy:
      "Learn electronics safety, Arduino programming, breadboard wiring, motor control, and sensor-based movement through guided practical sessions.",
    points: [
      "Arduino setup and basic C/C++ coding",
      "LEDs, buttons, sensors, motors, and servos",
      "Build a moving prototype learners can explain",
    ],
    service: "Arduino robotics or project training",
  },
  schools: {
    title: "School Robotics Club",
    copy:
      "A practical robotics program for schools that want learners to build, code, test, and present real STEM projects.",
    points: [
      "Age-appropriate robotics lessons",
      "Weekly club sessions or intensive bootcamps",
      "Teamwork, documentation, and demo-day support",
    ],
    service: "School robotics training",
  },
  projects: {
    title: "Final Year Project Build",
    copy:
      "Support for learners who need a working prototype, clean explanation, and confident project presentation.",
    points: [
      "Project idea selection and feasibility review",
      "Circuit design, code, assembly, and debugging",
      "Presentation preparation and demonstration practice",
    ],
    service: "Final year project build",
  },
  competitions: {
    title: "Robotics Competition Coaching",
    copy:
      "Training for teams preparing for local or international robotics competitions with practical drills and build reviews.",
    points: [
      "Competition rules analysis and strategy",
      "Robot reliability, speed, and troubleshooting",
      "Team roles, practice runs, and judging preparation",
    ],
    service: "Robotics competition coaching",
  },
};

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 12);
  scrollTopButton?.classList.toggle("visible", window.scrollY > 560);
}

function closeMenu() {
  mainNav.classList.remove("open");
  header.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function updateProgram(programKey) {
  const program = programs[programKey];
  if (!program) return;

  document.querySelector("[data-program-title]").textContent = program.title;
  document.querySelector("[data-program-copy]").textContent = program.copy;

  const pointList = document.querySelector("[data-program-points]");
  pointList.innerHTML = "";
  program.points.forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    pointList.appendChild(item);
  });

  programButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.program === programKey);
  });

  const serviceSelect = form?.elements.service;
  if (serviceSelect) {
    serviceSelect.value = program.service;
  }
}

function renderCarouselDots() {
  if (!carouselDots) return;

  carouselDots.innerHTML = "";
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show project ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    carouselDots.appendChild(dot);
  });
}

function showSlide(index) {
  if (!slides.length) return;

  activeSlideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlideIndex;
    slide.classList.toggle("active", isActive);
    if (!isActive) {
      slide.classList.remove("flipped");
    }
  });

  carouselDots?.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeSlideIndex);
    dot.setAttribute("aria-current", dotIndex === activeSlideIndex ? "true" : "false");
  });
}

window.addEventListener("scroll", setHeaderState);
setHeaderState();

scrollTopButton?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  header.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMenu();
  }
});

programButtons.forEach((button) => {
  button.addEventListener("click", () => updateProgram(button.dataset.program));
});

renderCarouselDots();
showSlide(0);

previousSlideButton?.addEventListener("click", () => showSlide(activeSlideIndex - 1));
nextSlideButton?.addEventListener("click", () => showSlide(activeSlideIndex + 1));

slides.forEach((slide) => {
  slide.querySelectorAll("[data-flip-card]").forEach((button) => {
    button.addEventListener("click", () => {
      slide.classList.toggle("flipped");
    });
  });
});

localVideos.forEach((video) => {
  const startTime = Number(video.dataset.videoStart);
  const endTime = Number(video.dataset.videoEnd);

  video.addEventListener("loadedmetadata", () => {
    if (Number.isFinite(startTime)) {
      video.currentTime = startTime;
    }
  });

  video.addEventListener("play", () => {
    if (Number.isFinite(startTime) && video.currentTime < startTime) {
      video.currentTime = startTime;
    }
  });

  video.addEventListener("timeupdate", () => {
    if (Number.isFinite(endTime) && video.currentTime >= endTime) {
      video.currentTime = Number.isFinite(startTime) ? startTime : 0;
      video.play();
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const message = [
    "Hello iTop Robotics, I would like to make an enquiry.",
    "",
    `Name: ${formData.get("name")}`,
    `Phone: ${formData.get("phone")}`,
    `Enquiring as: ${formData.get("audience")}`,
    `Service: ${formData.get("service")}`,
    "",
    `Message: ${formData.get("message")}`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/233249855269?text=${encodeURIComponent(message)}`;
  formStatus.textContent = "Opening WhatsApp with your enquiry...";
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

copyLocationButton.addEventListener("click", async () => {
  const address = "Dansoman Exhibition, Ojenma Street, 23rd Close House No. 7";
  try {
    await navigator.clipboard.writeText(address);
    copyLocationButton.textContent = "Address copied";
  } catch {
    copyLocationButton.textContent = address;
  }
});
