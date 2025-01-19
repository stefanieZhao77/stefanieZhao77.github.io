document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeLightbox = document.getElementById('closeLightbox');

  // Use the imageList passed from Jekyll
  imageList.forEach((fileName) => {
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
});
