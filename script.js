const YS = {
  /*
  * @param {string} signatureLink
  * @param {string} iframeContainer
  */
  init: (params) => {

    const urlParams = new Proxy(new URLSearchParams(params.signatureLink), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    const iFrame = () => {
      const existingIframe = document.getElementById('ys-iframe');
      if (!existingIframe) {
        const iFrame = document.createElement('iframe');
        iFrame.src = params.signatureLink;
        iFrame.id = 'ys-iframe';

        document.getElementById(params.iframeContainer).appendChild(iFrame);

        return iFrame;
      } else {
        return existingIframe;
      }
    };

    window.addEventListener('message', (event) => {
      this.receiveMessage(event, urlParams);
    }, false);

    return {

      onStart: function () {

      },

      onSuccess: function () {

      },

      onError: function () {

      }
    }
  },

  /*
   * @param {MessageEvent} event
   * @param {object} urlParams
   */
  receiveMessage: (event, urlParams) => {
    console.log(event.message);
  },

  /*windowListener: function (e, urlParams) {
      const data = e[e.message ? 'message' : 'data']

      if (
          data.type === 'yousign' &&
          yousign.callbacks[data.event] &&
          typeof yousign.callbacks[data.event === 'function']
      ) {
          yousign.callbacks[data.event](data)
      }

      if (data.type === '__ubble' && data.payload.redirectUrl) {
          // handle Ubble Callback
          document.getElementById('yousign-iframe').src = `${e.data.payload.redirectUrl}&k=${urlParams.k}`
      }
  },*/
}