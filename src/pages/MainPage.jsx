import React, { useState } from 'react';

import TopBar from '../components/TopBar/TopBar';
import RequestTabs from '../components/RequestTabs/RequestTabs';
import ParamSection from '../components/ParamSection/ParamSection';
import BodySection from '../components/BodySection/BodySection';
import ResponseSection from '../components/ResponseSection/ResponseSection';

import styles from './MainPage.module.css';

function MainPage() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');

  const [queryParams, setQueryParams] = useState([{ key: '', value: '' }]);
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [jsonBody, setJsonBody] = useState('');

  const [activeRequestTab, setActiveRequestTab] = useState('query');
  const [activeResponseTab, setActiveResponseTab] = useState('response');

  const [responseStatus, setResponseStatus] = useState('');
  const [responseSize, setResponseSize] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [responseBody, setResponseBody] = useState('');
  const [responseHeadersContent, setResponseHeadersContent] = useState('');

  const handleAddQueryParam = () => {
    setQueryParams([...queryParams, { key: '', value: '' }]);
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const updateQueryParam = (index, key, value) => {
    const newParams = [...queryParams];
    newParams[index][key] = value;
    setQueryParams(newParams);
  };

  const removeQueryParam = (index) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const updateHeader = (index, key, value) => {
    const newHeaders = [...headers];
    newHeaders[index][key] = value;
    setHeaders(newHeaders);
  };

  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    let finalUrl = url.trim();
    const qParams = queryParams.filter(p => p.key.trim() !== '');
    if (qParams.length > 0) {
      const queryStrings = qParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`);
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryStrings.join('&');
    }

    const hObj = {};
    headers.filter(h => h.key.trim() !== '').forEach(h => {
      hObj[h.key] = h.value;
    });

    const requestOptions = {
      method,
      headers: { ...hObj }
    };

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const bodyText = jsonBody.trim();
      if (bodyText) {
        try {
          const json = JSON.parse(bodyText);
          requestOptions.body = JSON.stringify(json);
          if (!requestOptions.headers['Content-Type']) {
            requestOptions.headers['Content-Type'] = 'application/json';
          }
        } catch {
          requestOptions.body = bodyText;
        }
      }
    }

    const startTime = Date.now();
    try {
      const response = await fetch(finalUrl, requestOptions);
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      const arrayBuf = await response.arrayBuffer();
      const decoder = new TextDecoder();
      const responseText = decoder.decode(arrayBuf);

      setResponseStatus(response.status);
      setResponseTime(`${timeTaken} ms`);
      setResponseSize(`${arrayBuf.byteLength} bytes`);

      let formattedBody = responseText;
      try {
        const jsonData = JSON.parse(responseText);
        formattedBody = JSON.stringify(jsonData, null, 2);
      } catch {
        // not JSON
      }

      setResponseBody(formattedBody);

      let headersStr = '';
      for (const [hKey, hValue] of response.headers) {
        headersStr += `${hKey}: ${hValue}\n`;
      }
      setResponseHeadersContent(headersStr || 'No Headers Available');
    } catch (error) {
      setResponseStatus('Error');
      setResponseTime('');
      setResponseSize('');
      setResponseBody(`Error: ${error.message}`);
      setResponseHeadersContent('');
    }
  };

  return (
    <div className={styles.mainPageContainer}>
      <TopBar
        method={method}
        setMethod={setMethod}
        url={url}
        setUrl={setUrl}
        onSend={handleSend}
      />
      <div className={styles.mainContent}>
        <div className={styles.requestSide}>
          <RequestTabs activeTab={activeRequestTab} setActiveTab={setActiveRequestTab} />
          <div className={styles.requestContent}>
            {activeRequestTab === 'query' && (
              <ParamSection
                title="Query Parameters"
                params={queryParams}
                onAddParam={handleAddQueryParam}
                onChangeParam={updateQueryParam}
                onRemoveParam={removeQueryParam}
                addButtonLabel="+ Add Query Param"
              />
            )}
            {activeRequestTab === 'headers' && (
              <ParamSection
                title="Headers"
                params={headers}
                onAddParam={handleAddHeader}
                onChangeParam={updateHeader}
                onRemoveParam={removeHeader}
                addButtonLabel="+ Add Header"
              />
            )}
            {activeRequestTab === 'body' && (
              <BodySection jsonBody={jsonBody} setJsonBody={setJsonBody} />
            )}
          </div>
        </div>
        <ResponseSection
          status={responseStatus}
          size={responseSize}
          time={responseTime}
          activeTab={activeResponseTab}
          setActiveTab={setActiveResponseTab}
          body={responseBody}
          headers={responseHeadersContent}
        />
      </div>
    </div>
  );
}

export default MainPage;
