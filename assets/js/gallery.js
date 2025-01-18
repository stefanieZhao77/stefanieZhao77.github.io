document.addEventListener('DOMContentLoaded', () => {
  const imageFolder = '/assets/img/gallery/';
  const galleryContainer = document.getElementById('gallery');

  // List of image file extensions to include
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  fetch(imageFolder)
    .then((response) => response.text())
    .then((text) => {
      const parser = new DOMParser();
      const html = parser.parseFromString(text, 'text/html');
      const links = html.querySelectorAll('a');

      links.forEach((link) => {
        const href = link.getAttribute('href');
        const fileName = href.split('/').pop(); // Get the filename

        // Check if the file has an image extension
        if (
          imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext))
        ) {
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
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching or parsing image folder:', error);
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
});
