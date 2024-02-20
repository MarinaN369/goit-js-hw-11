import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('form');

const galleryList = document.querySelector(".gallery")
const loader = document.querySelector(".loader")

form.addEventListener('submit', (event) => {
    event.preventDefault();
    galleryList.innerHTML = '';
    const keyWord = event.target.elements.search.value;
    loader.classList.remove('is-hidden')
    fetchImages(keyWord)
        .then((images) => {
           test(images);
            renderImages(images);
            
            loader.classList.add('is-hidden');
        })
        .catch((error) => console.log(error));
    
    event.target.reset();
})

function test(images) {
    if (!images.total) {
        iziToast.error({
    title: '',
            message: 'Sorry, there are no images matching your search query. Please try again!',
    position: 'topRight',
});
    }
}

function fetchImages(keyWord) {
    return fetch(`https://pixabay.com/api/?key=42425146-5a6f6f85f31b19991ee4b7315&q=${keyWord}&image_type=photo&orientation=horizontal&safesearch=true`).then((response) => {
 
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    });
}

function renderImages(images){
    const markup = images.hits
        .map((image) => {
            return ` <a href="${image.largeImageURL}" class="image-card">
    <img src="${image.webformatURL}" alt="${image.tags}"/>
    <div class="caption">
    <ul class="caption-list"><li class="caption-text">Views <span>${image.views}</span></li>
    <li class="caption-text">Likes <span>${image.likes}</span></li>
    <li class="caption-text">Comments <span>${image.comments}</span></li>
    <li class="caption-text">Downloads <span>${image.downloads}</span></li>
    </ul>
    </div>
  </a>`;
        })
        .join("");
    galleryList.innerHTML = markup;
    let gallery = new SimpleLightbox('.gallery a', options);
    gallery.on('show.simplelightbox');
    gallery.refresh();
}


const options = {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
};

