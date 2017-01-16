import http from 'http';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerRouter, createServerRenderContext } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Pages from './pages/index';

import layout from './layout.html';

import messages from './messages.json';

import store from './store';

// const domain = process.env.NODE_ENV === 'production'
//   ? 'https://platzi-react-sfs.now.sh'
//   : 'http://localhost:3001';
const domain = 'http://localhost:3001';

function requestHandler(request, response) {
  const locale = request.headers['accept-language'].indexOf('es') >= 0 ? 'es' : 'en';
  const context = createServerRenderContext();

  let html = renderToString(
    <Provider store={store}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <ServerRouter location={request.url} context={context}>
          <Pages />
        </ServerRouter>
      </IntlProvider>
    </Provider>,
  );

  const result = context.getResult();

  response.setHeader('Content-Type', 'text/html');

  if (result.redirect) {
    response.writeHead(301, {
      Location: result.redirect.pathname,
    });
    return response.end();
  }

  if (result.missed) {
    response.writeHead(404);

    html = renderToString(
      <Provider store={store}>
        <IntlProvider locale={locale} messages={messages[locale]}>
          <ServerRouter location={request.url} context={context}>
            <Pages />
          </ServerRouter>
        </IntlProvider>
      </Provider>,
    );
  }

  response.write(
    layout({ content: html, title: 'Aplicación', domain }),
  );

  return response.end();
}


const server = http.createServer(requestHandler);


server.listen(process.env.PORT || 3000);
