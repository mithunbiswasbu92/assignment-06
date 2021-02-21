const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

// api key
const KEY = '20264298-e5a8b4fc5ab34701366ef6e15&q';
// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  const loadMore = document.getElementById('load-more');
  loadMore.style.display = 'block';
  if (images.length === 0) {
    gallery.innerHTML = `<h2 class='text-danger mx-auto mt-5'> Sorry! No matches found.</h2>`;
    loadMore.style.display = 'none';
  }
  if (images.length < 9) {
    loadMore.style.display = 'none';
  }
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  toggleLoader();
}

const getImages = (query) => {
  toggleLoader();
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  let item = sliders.indexOf(img);
  // add and remove selection by toggle
  if (item >= 0)
    sliders.splice(item, 1);
  else {
    sliders.push(img);
  }
  // call toggle image function
  toggleImage(element);
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  const duration = document.getElementById('duration').value || 1000;
  if (duration <= 0) {
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})
// Enter button event handler for search
document.getElementById('search').addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
})

sliderBtn.addEventListener('click', function () {
  createSlider();
})

// Enter button event handler for slider
document.getElementById('duration').addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    sliderBtn.click();
  }
})

// image toggler for slide
const toggleImage = image => {
  image.classList.toggle('added');
}

// loading toggler 
const toggleLoader = () => {
  document.getElementById('loading').classList.toggle('d-flex');
  document.getElementById('gallery').classList.toggle('d-none');
}

// load more button feature
const loadMore = document.querySelector('#load-more');
let currentItems = 8;
loadMore.addEventListener('click', (event) => {
  const elementList = [...document.querySelectorAll('.gallery .img-item')];
  for (let i = currentItems; i < currentItems + 8; i++) {
    if (elementList[i]) {
      elementList[i].style.display = 'block';
    }
  }
  currentItems += 8;
  // Load more button will be hidden after list fully loaded
  if (currentItems >= elementList.length) {
    event.target.style.display = 'none';
  }
})