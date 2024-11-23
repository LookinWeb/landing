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
  let worksScrollTimer;
  let reviewsScrollTimer;
  const leftWorksCarouselButton = document.getElementById("left-works-button");
  const rightWorksCarouselButton =
    document.getElementById("right-works-button");
  const leftReviewsCarouselButton = document.getElementById(
    "left-reviews-button"
  );
  const rightReviewsCarouselButton = document.getElementById(
    "right-reviews-button"
  );
  const worksCarousel = document.getElementById("works-carousel");
  const reviewsCarousel = document.getElementById("reviews-carousel");

  // Event Listeners
  leftWorksCarouselButton.addEventListener("click", () =>
    scrollCarouselLeft(worksCarousel)
  );
  rightWorksCarouselButton.addEventListener("click", () =>
    scrollCarouselRight(worksCarousel)
  );
  leftReviewsCarouselButton.addEventListener("click", () =>
    scrollCarouselLeft(reviewsCarousel)
  );
  rightReviewsCarouselButton.addEventListener("click", () =>
    scrollCarouselRight(reviewsCarousel)
  );

  worksCarousel.addEventListener("mouseover", () =>
    stopCarouselScroll(worksScrollTimer)
  );
  reviewsCarousel.addEventListener("mouseover", () =>
    stopCarouselScroll(reviewsScrollTimer)
  );
  worksCarousel.addEventListener("mouseout", () =>
    startCarouselScroll(worksCarousel, "works")
  );
  reviewsCarousel.addEventListener("mouseout", () =>
    startCarouselScroll(reviewsCarousel, "reviews")
  );

  [leftWorksCarouselButton, rightWorksCarouselButton].forEach((button) => {
    button.addEventListener("mouseover", () =>
      stopCarouselScroll(worksScrollTimer)
    );
    button.addEventListener("mouseout", () =>
      startCarouselScroll(worksCarousel, "works")
    );
    button.addEventListener("click", () =>
      stopCarouselScroll(worksScrollTimer)
    );
  });

  [leftReviewsCarouselButton, rightReviewsCarouselButton].forEach((button) => {
    button.addEventListener("mouseover", () =>
      stopCarouselScroll(reviewsScrollTimer)
    );
    button.addEventListener("mouseout", () =>
      startCarouselScroll(reviewsCarousel, "reviews")
    );
    button.addEventListener("click", () =>
      stopCarouselScroll(reviewsScrollTimer)
    );
  });

  // Functions
  function scrollCarouselLeft(carousel) {
    carousel.scrollTo({
      left: carousel.scrollLeft - carousel.clientWidth,
      behavior: "smooth",
    });
  }

  function scrollCarouselRight(carousel) {
    carousel.scrollTo({
      left: carousel.scrollLeft + carousel.clientWidth,
      behavior: "smooth",
    });
  }

  function setCarouselScrollTimer(carousel, type) {
    const scrollSpeed = 15; // Adjust scroll speed here (higher value means slower scrolling)
    if (type === "works") {
      worksScrollTimer = setInterval(() => {
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
      }, scrollSpeed);
    } else if (type === "reviews") {
      reviewsScrollTimer = setInterval(() => {
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
      }, scrollSpeed);
    }
  }

  function stopCarouselScroll(timer) {
    clearInterval(timer);
  }

  function startCarouselScroll(carousel, type) {
    setCarouselScrollTimer(carousel, type);
  }

  // Fetch and populate carousel
  fetch("/js/projects.json")
    .then((response) => response.json())
    .then((data) => {
      populateProjectsCarousel(data);
      startCarouselScroll(worksCarousel, "works");
    })
    .catch((error) => console.error("Error:", error));

  function populateProjectsCarousel(data) {
    data.forEach((project) => {
      const carouselItem = createProjectCarouselItem(project);
      worksCarousel.appendChild(carouselItem);
    });

    // Duplicate the first image and append it to the end of the carousel
    const firstCarouselItem = createProjectCarouselItem(data[0]);
    worksCarousel.appendChild(firstCarouselItem);
  }

  function createProjectCarouselItem(project) {
    const carouselItem = document.createElement("div");
    carouselItem.className = "max-w-xs flex-shrink-0 mr-8 text-center";

    const link = document.createElement("a");
    link.className = "group block h-full";
    link.href = project.url;

    const imageContainer = document.createElement("div");
    imageContainer.className = "relative w-full h-72 mb-6";

    const hoverImageContainer = createProjectHoverImageContainer(project);
    imageContainer.appendChild(hoverImageContainer);

    const image = createProjectImage(project);
    imageContainer.appendChild(image);

    const projectName = document.createElement("span");
    projectName.className = "text-sm";
    projectName.textContent = project.name;

    link.appendChild(imageContainer);
    link.appendChild(projectName);

    carouselItem.appendChild(link);

    return carouselItem;
  }

  function createProjectHoverImageContainer(project) {
    const hoverImageContainer = document.createElement("div");
    hoverImageContainer.className =
      "hidden group-hover:flex items-center justify-center absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80";

    const hoverImage = createProjectImage(project);
    hoverImageContainer.appendChild(hoverImage);

    return hoverImageContainer;
  }

  function createProjectImage(project) {
    const image = document.createElement("img");
    image.className = "carousel-image block w-full h-full";
    image.src = project.picture;
    image.style.width = "300px";
    image.style.height = "290px";

    return image;
  }

  // Reviews Carousel
  // Fetch and populate carousel with review data from reviews.json
  fetch("/js/reviews.json")
    .then((response) => response.json())
    .then((data) => {
      populateReviewsCarousel(data);
      startCarouselScroll(reviewsCarousel, "reviews");
    })
    .catch((error) => console.error("Error loading reviews:", error));

  function populateReviewsCarousel(data) {
    const reviewsCarousel = document.getElementById("reviews-carousel");

    data.forEach((review) => {
      const carouselItem = createReviewsCarouselItem(review);
      reviewsCarousel.appendChild(carouselItem);
    });

    // Duplicate the first review item to loop smoothly
    const firstReviewItem = createReviewsCarouselItem(data[0]);
    reviewsCarousel.appendChild(firstReviewItem);
  }

  function createReviewsCarouselItem(review) {
    const carouselItem = document.createElement("div");
    carouselItem.className = "max-w-xs flex-shrink-0 mr-8 text-center";

    const reviewContainer = document.createElement("div");
    reviewContainer.className =
      "review-bg p-4 rounded-lg shadow-lg text-center";

    const image = document.createElement("img");
    image.className = "w-12 h-12 rounded-full mx-auto mb-2";
    image.src = review.picture;

    const reviewerName = document.createElement("h3");
    reviewerName.className = "font-semibold";
    reviewerName.textContent = review.name;

    const rating = document.createElement("div");
    rating.className = "flex justify-center my-2";
    rating.innerHTML =
      "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

    const comment = document.createElement("p");
    comment.className = "text-gray-600";
    comment.textContent = review.comment;

    reviewContainer.appendChild(image);
    reviewContainer.appendChild(reviewerName);
    reviewContainer.appendChild(rating);
    reviewContainer.appendChild(comment);

    carouselItem.appendChild(reviewContainer);

    return carouselItem;
  }
});
