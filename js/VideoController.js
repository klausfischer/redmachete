import util from './util';

const VideoController = (videoTrigger, opts) => {
  const defaults = {
    youtubeUrl: '',
    videoContainer: '#videoOverlay',
  };
  const options = { ...defaults, ...opts };
  options.template = `<div style="max-width: 80%;" class="mt3 center"><div class="aspect-ratio aspect-ratio--16x9"><iframe class="aspect-ratio--object" frameborder="0" src="${options.youtubeUrl}" allowfullscreen></iframe></div></div>`;

  const trigger = videoTrigger;
  const vcontainer = document.querySelector(options.videoContainer);
  console.log(options);

  const hideVideo = () => {
    vcontainer.classList.add('hidden');
    const iframe = vcontainer.querySelector('iframe');
    iframe.setAttribute('src', iframe.getAttribute('src'));
    vcontainer.removeEventListener('click', hideVideo);
  };

  const showVideo = () => {
    util.emptyNode(options.videoContainer);
    const iframe = util.htmlToElements(options.template);
    vcontainer.appendChild(iframe[0]);
    vcontainer.classList.remove('hidden');
    vcontainer.addEventListener('click', hideVideo);
  };

  const init = () => {
    trigger.addEventListener('click', showVideo);
  };

  return {
    init,
  };
};

export default VideoController;
