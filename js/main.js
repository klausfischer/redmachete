import VinylController from './VinylController';
import VideoController from './VideoController';

document.addEventListener('DOMContentLoaded', () => {
  // Bright Lights Vinyl Code Handler
  const vinylform = document.querySelector('#form-vinyl');
  if (vinylform) {
    vinylform.addEventListener('submit', VinylController.submitVinylCode, false);
  }

  // Lazyload Youtube Videos
  const videoDivs = document.querySelectorAll('[data-rm-videocontroller]');
  for (let i = 0; i < videoDivs.length; i += 1) {
    const v = videoDivs[i];
    const videoControllerOptions = JSON.parse(v.getAttribute('data-rm-videocontroller'));
    const vc = VideoController(v, videoControllerOptions);
    vc.init();
  }
});
