const YS = {
  /*
  * @param {string} signatureLink
  * @param {string} iframeContainer
  */
  init: (params) => {

    const urlParams = new Proxy(new URLSearchParams(params.signatureLink), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    const iFrame = document.getElementById('yousign-iframe')
      ? document.getElementById('yousign-iframe')
      : document.createElement('iframe');

    iFrame.src = params.signatureLink;
    iFrame.id = 'yousign-iframe';

    document.getElementById(params.iframeContainer).appendChild(iFrame);

    window.addEventListener('message', (event) => {
      YS.receiveMessage(event, urlParams);
    }, false);

    return {
      onStart: function (fn) {
        YS.eventCallbacks.started = fn;
      },

      onSuccess: function (fn) {
        YS.eventCallbacks.success = fn;
      },

      onError: function (fn) {
        YS.eventCallbacks.error = fn;
      }
    }
  },

  eventCallbacks: {},

  /*
   * @param {MessageEvent} event
   * @param {object} urlParams
   */
  receiveMessage: (event, urlParams) => {
    const { origin, data } = event;
    console.log(event.data);
    console.log(urlParams.k);

    if (origin === 'https://mt-kalos-mt-iframe-app.yousign.tech') {
      if(data.type === 'yousign'
        && YS.eventCallbacks[data.event]
        && typeof YS.eventCallbacks[data.event] === 'function'
      ) {
        YS.eventCallbacks[data.event](data);
      }
    }

    if (data.type === '__ubble' && data.payload.redirectUrl) {
      // handle Ubble Callback
      document.getElementById('yousign-iframe').src = `${e.data.payload.redirectUrl}&k=${urlParams.k}`
    }
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