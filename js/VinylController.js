
const CONFIG = {
  vinylApi: `${window.location.origin}/vinyldownload/api.php`,
  downloadPage: `${window.location.origin}/vinyldownload/download.php`,
};

const ALERT_SELECTOR = '.rm-alert';
const CODE_INPUT_SELECTOR = '#form-vinyl__vinylcode';
let httpRequest;

function showAlert(msg, type) {
  const alerts = document.querySelectorAll(ALERT_SELECTOR);
  for (let i = 0; i < alerts.length; i += 1) {
    alerts[i].classList.add('hidden');
  }

  const activeAlert = document.querySelector(`${ALERT_SELECTOR}--${type}`);
  activeAlert.innerHTML = msg;
  activeAlert.classList.remove('hidden');
}

function showResults() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    switch (httpRequest.status) {
      case 200: {
        showAlert('Thanks! Download starts immediately', 'success');
        const code = document.querySelector(CODE_INPUT_SELECTOR).value;
        // redirect to download.php
        window.location.replace(`${CONFIG.downloadPage}?${code}`);
        break;
      }
      case 400: {
        showAlert('Wrong code length.', 'danger');
        break;
      }
      case 404: {
        showAlert('Please try a correct code.', 'danger');
        break;
      }
      case 410: {
        showAlert('Your code was already redeemed, please contact us via <a class="link dim" href="mailto:band@redmachete.at">mailto:band@redmachete.at</a> and add your code to the email', 'danger');
        break;
      }
      default: {
        showAlert('Couldn\'t establish connection.', 'danger');
        break;
      }
    }
  }
}

function submitVinylCode(e) {
  e.preventDefault();
  httpRequest = new XMLHttpRequest();

  if (!httpRequest) {
    showAlert('Couldn\'t create Request', 'danger');
    return false;
  }
  const code = document.querySelector(CODE_INPUT_SELECTOR).value;

  if (code) {
    httpRequest.onreadystatechange = showResults;
    httpRequest.open('GET', `${CONFIG.vinylApi}?code=${code}`);
    httpRequest.send();
  }
  return true;
}

export default {
  submitVinylCode,
};
