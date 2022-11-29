class Yousign {
  #eventCallbacks = {};

  #origin = /^https:\/\/((((testing|qa)-kalos-app|mt-kalos-[a-zA-Z-0-9]*-app).yousign.tech)|yousign.app)/;

  /*
  * @param {string} signatureLink
  * @param {string} iframeContainerId
  * @param {boolean} isSandbox
  */
  constructor(params) {

    const signatureLink = new URL(params.signatureLink);

    if (params.isSandbox) {
      signatureLink.searchParams.append('disable_domain_validation', 'true');
    }

    const urlParams = new Proxy(signatureLink.searchParams, {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    let iFrame = document.getElementById('yousign-iframe');

    if (!iFrame) {
      iFrame = document.createElement('iframe');
      iFrame.id = 'yousign-iframe';
      document.getElementById(params.iframeContainerId).appendChild(iFrame);
    }

    iFrame.src = signatureLink.href;

    window.addEventListener('message', (event) => {
      this.#receiveMessage(event, urlParams);
    }, false);
  }

  /*
   * @param {function} fn
   */
  onStarted(fn) {
    this.#eventCallbacks.started = fn;
  }

  /*
   * @param {function} fn
   */
  onSuccess(fn) {
    this.#eventCallbacks.success = fn;
  }

  /*
   * @param {function} fn
   */
  onError(fn) {
    this.#eventCallbacks.error = fn;
  }

  /*
   * @param {MessageEvent} event
   * @param {object} urlParams
   */
  #receiveMessage(event, urlParams) {
    const { origin, data } = event;

    console.log(event);
    console.log(origin);

    if (origin.match(this.#origin)) {

      if (data.type === 'yousign'
        && this.#eventCallbacks[data.event]
        && typeof this.#eventCallbacks[data.event] === 'function'
      ) {
        this.#eventCallbacks[data.event](data);
      }
    }

    if (data.type === '__ubble' && data.payload.redirectUrl) {
      document.getElementById('yousign-iframe').src = `${e.data.payload.redirectUrl}&k=${urlParams.k}`;
    }
  }
}