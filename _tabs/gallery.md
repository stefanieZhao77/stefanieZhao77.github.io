---
title: Gallery
icon: fas fa-images
order: 5
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
    <img id="lightboxImage" src="/" alt="">
  </div>
</div>

<script src="{{ '/assets/js/gallery.js' | relative_url }}"></script>

