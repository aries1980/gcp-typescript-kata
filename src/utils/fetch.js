import fetch from 'node-fetch';

/**
 * Checks whether a REST endpoint is alive.
 *
 * @param {string} endpoint - The endpoint to connet to.
 * @param {object} opts - The http.IncomingMessage.prototype 's header opts.
 * @param {string} serviceName - The name of the service for logging purposes.
 *
 * @returns {Promise.<*>}
 */
export const restPing = async (endpoint, opts, serviceName) => {
  const fetchOptions = Object.assign({
    timeout: 5000
  }, opts);

  return await fetch(endpoint, fetchOptions).then((response) => {
    if (response.status === 200) {
      return true;
    }
    else {
      throw `${serviceName}: ${response.status} - ${response.statusText}`;
    }
  }).catch((err)=> {
    throw err;
  });
};

