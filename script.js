class Yousign {
  #eventCallbacks = {};

  /*
  * @param {string} signatureLink
  * @param {string} iframeContainerId
  */
  constructor(params) {
    const urlParams = new Proxy(new URLSearchParams(params.signatureLink), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    let iFrame = document.getElementById('yousign-iframe');

    if (!iFrame) {
      iFrame = document.createElement('iframe');
      iFrame.id = 'yousign-iframe';
      document.getElementById(params.iframeContainerId).appendChild(iFrame);
    }

    iFrame.src = params.signatureLink;

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
    const { data } = event;

    console.log(event);

    if(data.type === 'yousign'
      && this.#eventCallbacks[data.event]
      && typeof this.#eventCallbacks[data.event] === 'function'
    ) {
      this.#eventCallbacks[data.event](data);
    }

    if (data.type === '__ubble' && data.payload.redirectUrl) {
      document.getElementById('yousign-iframe').src = `${e.data.payload.redirectUrl}&k=${urlParams.k}`;
    }
  }
}