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

  fetch("members.json")
    .then((response) => response.json())
    .then((data) => populateMembers(data))
    .catch((error) => console.error("Error:", error));

  function populateMembers(members) {
    // Sort members so that the CEO is in the center
    const ceoIndex = members.findIndex((member) =>
      member.profession.includes("CEO")
    );
    const ceoMember = members[ceoIndex];
    members.splice(ceoIndex, 1);
    const centerIndex = Math.floor(members.length / 2);
    members.splice(centerIndex, 0, ceoMember);

    const membersDiv = document.getElementById("team-members");
    members.forEach((member, index) => {
      const memberDiv = document.createElement("div");
      membersDiv.style.display = "flex";
      membersDiv.style.flexWrap = "wrap";
      membersDiv.style.justifyContent = "space-around";
      memberDiv.className =
        "w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4 flex flex-col items-center text-center";
      memberDiv.style.boxShadow = "0 4px 8px 0 rgba(0,0,0,0.2)";
      memberDiv.style.transition = "0.3s";
      memberDiv.style.borderRadius = "5px"; // Rounded corners
      memberDiv.style.margin = "0 20px"; // Increase horizontal space between boxes

      const img = document.createElement("img");
      img.className = "w-32 h-32 rounded-full mb-4 object-cover"; // Same size for all images
      img.src = member.picture;
      img.alt = `${member.name}'s picture`;
      img.style.width = "150px"; // Set width
      img.style.height = "150px"; // Set height

      const name = document.createElement("h2");
      name.className = "text-xl font-bold mb-2";
      name.textContent = member.name;

      const profession = document.createElement("p");
      profession.className = "mb-2";
      profession.textContent = member.profession;

      const portfolio = document.createElement("a");
      portfolio.className = "block";
      portfolio.href = member.portfolio;
      portfolio.innerHTML = '<i class="fas fa-briefcase"></i> Portfolio';
      portfolio.style.color = "#ffffff"; // White color for links

      memberDiv.style.margin = "0 35px 0px 30px"; // Increase space between members
      memberDiv.appendChild(img);
      memberDiv.appendChild(name);
      memberDiv.appendChild(profession);

      memberDiv.appendChild(portfolio);

      membersDiv.appendChild(memberDiv);
    });
  }

  // Loader
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.getElementById("refreshLoader").classList.add("hide-loader");
    }, 750);
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
      const flag = option.querySelector(".flag-icon").className;

      // Update the selected language and flag
      document.getElementById("selected-language").innerHTML =
        language + " <span class='" + flag + " mr-2'></span>";

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

  const carousel = document.querySelector(".carousel-inner");
  const prevButton = document.querySelector(".carousel-prev");
  const nextButton = document.querySelector(".carousel-next");
  let currentIndex = 0;

  function updateCarousel() {
    const width = carousel.clientWidth;
    carousel.style.transform = `translateX(-${currentIndex * width}px)`;
  }

  prevButton.addEventListener("click", function () {
    currentIndex =
      currentIndex > 0 ? currentIndex - 1 : carousel.children.length - 1;
    updateCarousel();
  });

  nextButton.addEventListener("click", function () {
    currentIndex =
      currentIndex < carousel.children.length - 1 ? currentIndex + 1 : 0;
    updateCarousel();
  });

  window.addEventListener("resize", updateCarousel);
});
