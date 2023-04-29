const apiKey = "puARts12unxbmISSBmsZ4LnwP7GZ7ulf5tFAhvs2TRbVJ6kJ5TnYBp5a";
const perPage = 15;
let currentPage = 1;
const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
let searchTerm;
const DEBOUNCE_DURATION = 1000; // in milliseconds
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");

function getImages(apiUrl) {
  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiUrl, { headers: { Authorization: apiKey } })
    .then((res) => res.json())
    .then((data) => {
      generateHTML(data.photos);
      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch(() => {
      Swal.fire({
        title: "Failed to load image",
        text: "Please check your internet connection",
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        location.reload();
      });
    });
}

function downloadImg(imgURL) {
  fetch(imgURL)
    .then((result) => {
      return result.blob();
    })
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = +new Date();
      a.click();
    })
    .catch((err) => {
      Swal.fire({
        title: "Failed to download image",
        text: "Please check your internet connection",
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        location.reload();
      });
    });
}

function showLightBox(name, img) {
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  // image link save in data-img for lightbox download button
  downloadImgBtn.setAttribute("data-img", img);
  lightBox.classList.add("show");
  document.body.style.overflow = "hidden";
}

function generateHTML(images) {
  images
    .map((img) => {
      imagesWrapper.innerHTML += `<li class="card" onclick="showLightBox('${img.photographer}','${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img" />
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`;
    })
    .join("");
}

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&perPage=${perPage}`
);

function loadMoreImages() {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&perPage=${perPage}`;
  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}?page=${currentPage}&perPage=${perPage}`
    : apiURL;
  getImages(apiURL);
}

const debounce = (fn, timeout = DEBOUNCE_DURATION) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, timeout);
  };
};

function loadSearchImages(e) {
  // when input text is empty then getImages function will not call
  if (e.target.value === "") return (searchTerm = null);
  currentPage = 1;
  searchTerm = e.target.value;
  imagesWrapper.innerHTML = ``;
  getImages(
    `https://api.pexels.com/v1/search?query=${searchTerm}?page=${currentPage}&perPage=${perPage}`
  );
}

function hideLightBox() {
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
}

loadMoreBtn.addEventListener("click", loadMoreImages);

// debouce use here
searchInput.addEventListener("keyup", debounce(loadSearchImages));
closeBtn.addEventListener("click", hideLightBox);
downloadImgBtn.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);

lightBox.addEventListener("click", (e) => {
  // hide lightbox when user click outside popup box
  if (e.target.className.includes("lightbox")) {
    hideLightBox();
  }
});

// for reload page
window.onload = function () {
  // empty textbox when reload page
  searchInput.value = "";
};

// Typewriter effect
const text1 = "Welcome, Image HUB";
const text2 = "Search, Download & View your favorite images.";

// Typewriter 1 animation
let i = 0;
let typewriter1 = setInterval(() => {
  document.querySelector(".content h1").innerHTML += text1.charAt(i);
  i++;
  if (i === text1.length) {
    clearInterval(typewriter1);
    // Call the function for typewriter 2 animation
    typewriter2();
  }
}, 100);

// Typewriter 2 animation
function typewriter2() {
  let j = 0;
  let typewriter2 = setInterval(() => {
    document.querySelector(".content p").innerHTML += text2.charAt(j);
    j++;
    if (j === text2.length) {
      clearInterval(typewriter2);
    }
  }, 100);
}
