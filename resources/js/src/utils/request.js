import config from "../config";

export const expand = (template, values) => {
    var sep = '{}';
    var len = sep.length;

    var whitespace = '\\s*';
    var left = escape(sep.substring(0, len / 2)) + whitespace;
    var right = whitespace + escape(sep.substring(len / 2, len));

    function escape (s) {
        return [].map.call(s, function (char) {
            return '\\' + char;
        }).join('');
    }

    function regExp (key) {
        return new RegExp(left + key + right, 'g');
    }

    Object.keys(values).forEach(function (key) {
        var value = String(values[key]).replace(/\$/g, '$$$$');
        template = template.replace(regExp(key), value);
    });

    return template;
}

export const url = (key, params = {}) => {
    if(config.urls && config.urls[key]) {
        return `${config.base_url}${expand(config.urls[key], params)}`;
    }
    return `${config.base_url}/${expand(key, params)}`;
};

export const urlWithQuery = (url, params) => {
    if(Object.keys(params).length === 0) return url;
    const uri = Object
    .keys(params)
    .map(k => {
        if(Array.isArray(params[k])) {
            return params[k]
            .map(val => `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`)
            .join('&');
        }
        return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
    })
    .join('&');

    return `${url}?${uri}`;
};

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON, status from the response
 */
function parseJSON(response) {
    return new Promise((resolve) => {
        if (response.status === 204) {
            return resolve({
                status: response.status,
                ok: response.ok,
            });
        }

        return response.json()
            .then((json) => resolve({
                status: response.status,
                ok: response.ok,
                json,
            }));
    });
}
  
/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {Promise}           The request promise
 */
export const request = (url, options = {}) => {
    const csrfToken = document.querySelector('[name="csrf-token"]');
    options.headers = Object.assign(options.headers || {}, csrfToken ? { "X-CSRF-Token": csrfToken.content } : {});
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(parseJSON)
        .then((response) => {
          if (response.ok) {
            return resolve(response.json);
          }
          // extract the error from the server's json
          return reject({  type: 'server', status:response.status, error: response.json.error || response.json });
        })
        .catch((error) => reject({
            type: 'network',
            message: error.message,
        }));
    });
};