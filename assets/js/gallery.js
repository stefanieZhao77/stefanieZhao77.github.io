const imageFolder = '/assets/img/gallery/';
const galleryContainer = document.getElementById('gallery');

// Fetch the list of images from the JSON file
fetch('/assets/data/images.json')
  .then((response) => response.json())
  .then((data) => {
    const images = data.images;

    // Generate the gallery
    images.forEach((fileName) => {
      const imgContainer = document.createElement('div');
      imgContainer.classList.add('image-container');

      const imgLink = document.createElement('a');
      imgLink.href = imageFolder + fileName; // Link to the original image

      const img = document.createElement('img');
      img.src = imageFolder + fileName;
      img.alt = fileName;

      // Open image in lightbox on click
      img.addEventListener('click', function () {
        lightboxImage.src = imgLink.href;
        lightbox.style.display = 'block';
      });

      imgContainer.appendChild(img);
      galleryContainer.appendChild(imgContainer);
    });
  })
  .catch((error) => {
    console.error('Error loading images:', error);
    galleryContainer.innerHTML = '<p>Error loading images.</p>';
  });

// Close lightbox when close button is clicked
closeLightbox.addEventListener('click', function () {
  lightbox.style.display = 'none';
});

// Close lightbox when clicking outside of the image
window.onclick = function (event) {
  if (event.target == lightbox) {
    lightbox.style.display = 'none';
  }
};
