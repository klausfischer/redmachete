import VinylController from './VinylController';

document.addEventListener('DOMContentLoaded', () => {
  // Bright Lights Vinyl Code Handler
  const vinylform = document.querySelector('#form-vinyl');
  if (vinylform) {
    vinylform.addEventListener('submit', VinylController.submitVinylCode, false);
  }
});
