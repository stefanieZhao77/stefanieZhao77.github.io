---
title: Gallery
icon: fas fa-images
order: 4
---

<style>
    #gallery {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .image-container {
        margin: 10px;
        text-align: center;
        width: 200px; /* Adjust as needed */
        flex-grow: 1; /* Allow containers to grow to fill available space */
        max-width: calc(50% - 20px); /* Limit to a maximum of 2 columns */
    }

    .image-container img {
        max-width: 100%;
        height: auto;
    }

    @media (min-width: 600px) {
      .image-container {
          max-width: calc(100% - 20px); /* 3 columns on larger screens */
      }
    }

    @media (min-width: 900px) {
      .image-container {
          max-width: calc(50% - 20px); /* 4 columns on even larger screens */
      }
    }

    @media (min-width: 1200px) {
      .image-container {
          max-width: calc(33% - 20px); /* 5 columns on very large screens */
      }
    }
    /* Lightbox Styles */
    .lightbox {
      display: none;
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      overflow: auto;
    }

    .lightbox-content {
      position: relative;
      margin: 5% auto;
      width: 80%;
      max-width: 1200px;
    }

    .lightbox-content img {
      width: 100%;
      height: auto;
    }
    .close {
      position: absolute;
      top: 15px;
      right: 25px;
      color: #f1f1f1;
      font-size: 30px;
      font-weight: bold;
      cursor: pointer;
    }
</style>



<div id="gallery"></div>
<div id="lightbox" class="lightbox">
  <span id="closeLightbox" class="close">&times;</span>
  <div class="lightbox-content">
    <img id="lightboxImage" src="#" alt="">
  </div>
</div>

<script>
    const imageFolder = '/assets/img/gallery/'; 
    const galleryContainer = document.getElementById('gallery');

    // List of image file extensions to include
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    fetch(imageFolder)
        .then(response => response.text())
        .then(text => {
            const parser = new DOMParser();
            const html = parser.parseFromString(text, 'text/html');
            const links = html.querySelectorAll('a');

            links.forEach(link => {
                const href = link.getAttribute('href');
                const fileName = href.split('/').pop(); // Get the filename
                
                // Check if the file has an image extension
                if (imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext))) {
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('image-container');

                    const imgLink = document.createElement('a');
                    imgLink.href = imageFolder + fileName; // Link to the original image

                    const img = document.createElement('img');
                    img.src = imageFolder + fileName;
                    img.alt = fileName;

                    // Open image in lightbox on click
                    img.addEventListener('click', function() {
                      lightboxImage.src = imgLink.href;
                      lightbox.style.display = 'block';
                    });

                    imgContainer.appendChild(img);
                    galleryContainer.appendChild(imgContainer);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching or parsing image folder:', error);
            galleryContainer.innerHTML = '<p>Error loading images.</p>';
        });

        // Close lightbox when close button is clicked
    closeLightbox.addEventListener('click', function() {
      lightbox.style.display = 'none';
    });

    // Close lightbox when clicking outside of the image
    window.onclick = function(event) {
      if (event.target == lightbox) {
        lightbox.style.display = 'none';
      }
    };
</script>