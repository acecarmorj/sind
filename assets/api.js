(function () {
  'use strict';

  function getRuntime() {
    return window.ASSOC_RUNTIME_CONFIG || {};
  }

  function getApiUrl() {
    var url = String(getRuntime().API_URL || '').trim();

    if (!url || url.indexOf('COLE_AQUI') >= 0) {
      throw new Error('Serviço indisponível. Configure a URL do Web App em assets/runtime-config.js.');
    }

    return url;
  }

  function getSessionToken() {
    return localStorage.getItem('assoc_session_token') || '';
  }

  function setSessionToken(token) {
    localStorage.setItem('assoc_session_token', token || '');
  }

  function clearSessionToken() {
    localStorage.removeItem('assoc_session_token');
  }

  async function parseJsonResponse(response) {
    var text = await response.text();
    var data = {};

    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error('Não foi possível carregar as informações no momento.');
    }

    if (!data.ok) {
      throw new Error(data.message || 'Não foi possível concluir a solicitação.');
    }

    return data;
  }

  async function postApi(action, payload, useSession) {
    var response = await fetch(getApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: action,
        sessionToken: useSession === false ? '' : getSessionToken(),
        payload: payload || {}
      })
    });

    return parseJsonResponse(response);
  }

  async function getApi(action, query) {
    var url = new URL(getApiUrl());
    url.searchParams.set('action', action);

    Object.keys(query || {}).forEach(function (key) {
      if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
        url.searchParams.set(key, query[key]);
      }
    });

    if (getSessionToken()) {
      url.searchParams.set('sessionToken', getSessionToken());
    }

    var response = await fetch(url.toString(), { method: 'GET' });
    return parseJsonResponse(response);
  }

  window.ASSOC_API = {
    getRuntime: getRuntime,
    getSessionToken: getSessionToken,
    setSessionToken: setSessionToken,
    clearSessionToken: clearSessionToken,
    postApi: postApi,
    getApi: getApi
  };
}());
