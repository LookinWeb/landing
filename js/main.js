document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners to close buttons on banners
  document.querySelectorAll(".banner-close").forEach(function (button) {
    button.addEventListener("click", function () {
      const banner = this.closest("div");
      if (banner) {
        banner.classList.add("hidden");
        banner.classList.remove("flex");
      }
    });
  });

  document.querySelector("#navbar-toggler").addEventListener("click", () => {
    const navLinks = document.querySelector("#navbar-default");
    navLinks.classList.toggle("hidden");
  });

  // Get all navigation links
  const navItems = document.querySelectorAll("#navbar-default ul li a");

  // Add event listener to each navigation link
  // Scroll Animation
  navItems.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });

        // Hide the navbar after scrolling if in mobile or tablet view
        if (window.innerWidth < 768) {
          // 768px is the breakpoint for md in Tailwind CSS
          const navLinks = document.querySelector("#navbar-default");
          navLinks.classList.add("hidden");
        }
      } else {
        // If there's no element with the target ID, navigate to the URL in the href attribute
        window.location.href = link.getAttribute("href");
      }
    });
  });

  // Translations JSON
  const languageButton = document.getElementById("language-button");
  const languageOptions = document.getElementById("language-options");
  const languageOptionsChildren = Array.from(languageOptions.children);

  languageButton.addEventListener("click", function () {
    languageOptions.classList.toggle("hidden");
  });

  languageOptionsChildren.forEach(function (option) {
    option.addEventListener("click", function () {
      // Get the selected language and flag
      const language = option.dataset.value.toUpperCase();

      // Update the selected language and flag
      document.getElementById("selected-language").innerHTML = language;

      // Hide the language options and load the translations
      languageOptions.classList.add("hidden");
      loadTranslations(language);
    });
  });

  document.addEventListener("click", function (event) {
    let isClickInside = document
      .getElementById("language-changer")
      .contains(event.target);

    if (!isClickInside) {
      // The click was outside the #language-changer element, hide the dropdown
      document.getElementById("language-options").classList.add("hidden");
    }
  });

  function loadTranslations(language) {
    language = language.toLowerCase();
    document.documentElement.lang = language;

    fetch(`resources/translations/${language}.json`)
      .then((response) => response.json())
      .then((data) => {
        const translations = data;
        const elements = document.querySelectorAll("[data-translation-key]");

        elements.forEach((element) => {
          const key = element.getAttribute("data-translation-key");
          const keys = key.split(/[\[\]]/);
          let translation;
          if (keys.length > 1) {
            translation = translations[keys[0]][parseInt(keys[1])];
          } else {
            translation = translations[key];
          }

          if (element.hasAttribute("placeholder")) {
            element.setAttribute("placeholder", translation);
          } else {
            element.innerHTML = translation;
          }
        });
      });
  }

  // Load translations when the page loads
  loadTranslations("en"); // Default language

  // Carousel
  const leftCarouselButton = document.getElementById("left-carousel-button");
  const rightCarouselButton = document.getElementById("right-carousel-button");
  const carousel = document.getElementById("carousel");
  const buttons = [leftCarouselButton, rightCarouselButton];

  // Event Listeners
  leftCarouselButton.addEventListener("click", scrollCarouselLeft);
  rightCarouselButton.addEventListener("click", scrollCarouselRight);
  carousel.addEventListener("mouseover", stopCarouselScroll);
  carousel.addEventListener("mouseout", startCarouselScroll);
  buttons.forEach((button) => {
    button.addEventListener("mouseover", stopCarouselScroll);
    button.addEventListener("mouseout", startCarouselScroll);
    button.addEventListener("click", stopCarouselScroll);
  });

  // Functions
  function scrollCarouselLeft() {
    carousel.scrollTo({
      left: carousel.scrollLeft - carousel.clientWidth,
      behavior: "smooth",
    });
  }

  function scrollCarouselRight() {
    carousel.scrollTo({
      left: carousel.scrollLeft + carousel.clientWidth,
      behavior: "smooth",
    });
  }

  let scrollTimer;
  function setCarouselScrollTimer() {
    scrollTimer = setInterval(() => {
      carousel.scrollLeft += 1;
      if (
        carousel.scrollLeft >=
        carousel.scrollWidth - carousel.clientWidth - 1
      ) {
        carousel.classList.add("fade-out");
        setTimeout(() => {
          carousel.scrollLeft = 0;
          carousel.classList.remove("fade-out");
        }, 250);
      }
    }, 20);
  }
  function stopCarouselScroll() {
    clearInterval(scrollTimer);
  }

  function startCarouselScroll() {
    setCarouselScrollTimer();
  }

  function setCarouselGradient() {
    const style = document.createElement("style");
    style.innerHTML = `
    .carousel-container::before {
      position: absolute;
      width: 20%;
      background: linear-gradient(to right, rgba(0, 0, 0, 0.7), transparent);
      z-index: 2;
      pointer-events: none;
    }
    .carousel-container::after {
      position: absolute;
      width: 20%;
      background: linear-gradient(to left, rgba(0, 0, 0, 0.7), transparent);
      z-index: 2;
      pointer-events: none;
    }
  `;
    document.head.appendChild(style);
  }

  // Fetch and populate carousel
  fetch("/js/projects.json")
    .then((response) => response.json())
    .then((data) => populateCarousel(data))
    .catch((error) => console.error("Error:", error));

  function populateCarousel(data) {
    data.forEach((project) => {
      const carouselItem = createCarouselItem(project);
      carousel.appendChild(carouselItem);
    });

    // Duplicate the first image and append it to the end of the carousel
    const firstCarouselItem = createCarouselItem(data[0]);
    carousel.appendChild(firstCarouselItem);
  }

  function createCarouselItem(project) {
    const carouselItem = document.createElement("div");
    carouselItem.className = "max-w-xs flex-shrink-0 mr-8 text-center";

    const link = document.createElement("a");
    link.className = "group block h-full";
    link.href = project.url;

    const imageContainer = document.createElement("div");
    imageContainer.className = "relative w-full h-72 mb-6";

    const hoverImageContainer = createHoverImageContainer(project);
    imageContainer.appendChild(hoverImageContainer);

    const image = createImage(project);
    imageContainer.appendChild(image);

    const projectName = document.createElement("span");
    projectName.className = "text-sm";
    projectName.textContent = project.name;

    link.appendChild(imageContainer);
    link.appendChild(projectName);

    carouselItem.appendChild(link);

    return carouselItem;
  }

  function createHoverImageContainer(project) {
    const hoverImageContainer = document.createElement("div");
    hoverImageContainer.className =
      "hidden group-hover:flex items-center justify-center absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80";

    const hoverImage = createImage(project);
    hoverImageContainer.appendChild(hoverImage);

    return hoverImageContainer;
  }

  function createImage(project) {
    const image = document.createElement("img");
    image.className = "carousel-image block w-full h-full";
    image.src = project.picture;
    image.style.width = "300px";
    image.style.height = "290px";

    return image;
  }
});
