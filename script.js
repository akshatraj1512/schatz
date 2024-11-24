// Selectors for DOM elements
const imageWrapper = document.querySelector(".images");
const searchInput = document.querySelector(".search input");
const loadMoreBtn = document.querySelector(".gallery .load-more");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector(".img");
const downloadImgBtn = lightbox.querySelector(".download-btn");
const closeImgBtn = lightbox.querySelector(".ui.uil-minus-square");

// API key, pagination, and search variables
const apiKey = "gtLNIM9PvCWqMp5YpVH1QQshHhguXwDiRFrVKGhnJaGlUD8N6fFlfMvh";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

// Download an image
const downloadImg = (imgUrl) => {
    fetch(imgUrl)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Failed to fetch the image. Status: ${res.status}`);
            }
            return res.blob();
        })
        .then((blob) => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = imgUrl.split('/').pop(); // Extract filename from URL
            a.click();
        })
};

// Show lightbox
const showLightbox = (name, img) => {
    lightboxImg.src = img; // Set lightbox image
    lightbox.querySelector("img").src = img;
    lightbox.querySelector("span").innerText = name; // Set photographer name
    downloadImgBtn.href = img; // Update download button link
    downloadImgBtn.setAttribute("download", img.split('/').pop()); // Set download filename
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden"; // Prevent scrolling
};

// Hide lightbox
const hideLightbox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto"; // Restore scrolling
};

// Attach lightbox functionality to manually uploaded images
const attachLightboxToStaticImages = () => {
    document.querySelectorAll(".card img").forEach((img) => {
        img.addEventListener("click", () => {
            const photographerName = img.parentNode.querySelector(".photographer span").innerText;
            const imgSrc = img.getAttribute("src");
            showLightbox(photographerName, imgSrc);
        });
    });
};

// Generate HTML for dynamically fetched images
const generateHTML = (images) => {
    imageWrapper.innerHTML += images
        .map(
            (img) => `
        <li class="card">
            <img data-img="${img.src.large2x}" src="${img.src.large2x}" alt="${img.photographer}">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button class="download-btn" data-img="${img.src.large2x}">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
        )
        .join("");

    // Add event listeners for dynamic download buttons
    document.querySelectorAll(".download-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            downloadImg(button.getAttribute("data-img"));
        });
    });

    // Add lightbox support for dynamic images
    document.querySelectorAll(".card img").forEach((img) => {
        img.addEventListener("click", () => {
            const photographerName = img.parentNode.querySelector(".photographer span").innerText;
            const imgSrc = img.getAttribute("data-img");
            showLightbox(photographerName, imgSrc);
        });
    });
};

// Fetch images from the API
const getImages = (apiURL) => {
    searchInput.blur();
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey },
    })
        .then((res) => res.json())
        .then((data) => {
            generateHTML(data.photos);
            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.remove("disabled");
        })
};

// Load more images
const loadMoreImages = () => {
    currentPage++;
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiUrl = searchTerm
        ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
        : apiUrl;
    getImages(apiUrl);
};

// Load search results
const loadSearchImages = (e) => {
    if (e.target.value === "") return (searchTerm = null);
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imageWrapper.innerHTML = ""; // Clear previous results
        getImages(
            `https://api.pexels.com/v1/search?query=${searchTerm}&page=1&per_page=${perPage}`
        );
    }
};

// Toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle("dark-mode");
}

// Initial API call to load curated images
getImages(
    `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

// Attach lightbox functionality to manually uploaded images
attachLightboxToStaticImages();

// Event listeners
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeImgBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => {
    e.preventDefault();
    downloadImg(downloadImgBtn.href);
});

// Function to scroll to the top smoothly
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Show the button when scrolled down
  window.addEventListener('scroll', () => {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
      backToTopBtn.style.display = 'flex'; // Show the icon
      backToTopBtn.style.opacity = '1';
    } else {
      backToTopBtn.style.opacity = '0';
      setTimeout(() => (backToTopBtn.style.display = 'none'), 300);
    }
  });

  
    // Show the lightbox and set image source and photographer name
    lightbox.querySelector("img").src = img;
    lightbox.querySelector("span").innerText = name;

    // Update download link in the lightbox
    downloadImgBtn.href = img;

    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
