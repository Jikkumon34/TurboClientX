// src/pages/MainPage.jsx
import React, { useState, useEffect } from 'react';

import TopBar from '../components/TopBar/TopBar';
import RequestTabs from '../components/RequestTabs/RequestTabs';
import ParamSection from '../components/ParamSection/ParamSection';
import BodySection from '../components/BodySection/BodySection';
import ResponseSection from '../components/ResponseSection/ResponseSection';
import AuthSection from '../components/AuthSection/AuthSection';

import styles from './MainPage.module.css';

function MainPage() {
  const [method, setMethod] = useState('GET');
  const [baseUrl, setBaseUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [url, setUrl] = useState(baseUrl);

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

  // Auth states
  const [authMethod, setAuthMethod] = useState('none');
  const [authCredentials, setAuthCredentials] = useState({
    token: '',
    username: '',
    password: ''
  });

  // New states for body type and form fields
  const [activeBodyType, setActiveBodyType] = useState('json');
  const [formFields, setFormFields] = useState([]);

  const handleAddQueryParam = () => {
    setQueryParams([...queryParams, { key: '', value: '' }]);
  };

  useEffect(() => {
    let updatedUrl = baseUrl.trim();
    const validParams = queryParams.filter(p => p.key.trim() !== '');

    if (validParams.length > 0) {
      const queryString = validParams
        .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join('&');
      updatedUrl += (updatedUrl.includes('?') ? '&' : '?') + queryString;
    }

    setUrl(updatedUrl);
  }, [baseUrl, queryParams]);

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
    const finalUrl = url.trim();
    const hObj = {};
    headers.filter(h => h.key.trim() !== '').forEach(h => {
      hObj[h.key] = h.value;
    });

    const requestOptions = {
      method,
      headers: { ...hObj }
    };

    // Apply auth
    if (authMethod === 'bearer' && authCredentials.token.trim() !== '') {
      requestOptions.headers['Authorization'] = `Bearer ${authCredentials.token.trim()}`;
    } else if (authMethod === 'basic' && authCredentials.username && authCredentials.password) {
      const basicToken = btoa(`${authCredentials.username}:${authCredentials.password}`);
      requestOptions.headers['Authorization'] = `Basic ${basicToken}`;
    }

    // Body for POST, PUT, PATCH
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (activeBodyType === 'json') {
        const bodyText = jsonBody.trim();
        if (bodyText) {
          try {
            const json = JSON.parse(bodyText);
            requestOptions.body = JSON.stringify(json);
            if (!requestOptions.headers['Content-Type']) {
              requestOptions.headers['Content-Type'] = 'application/json';
            }
          } catch {
            // Non-JSON body
            requestOptions.body = bodyText;
          }
        }
      } else if (activeBodyType === 'xml') {
        // Handle XML (assuming xmlBody is tracked within BodySection and passed similarly)
        // For simplicity, assuming xmlBody stored in jsonBody state for now.
        const xml = jsonBody.trim();
        if (xml) {
          requestOptions.body = xml;
          if (!requestOptions.headers['Content-Type']) {
            requestOptions.headers['Content-Type'] = 'application/xml';
          }
        }
      } else if (activeBodyType === 'text') {
        // Handle Text (assuming textBody is stored in jsonBody for simplicity)
        const textContent = jsonBody.trim();
        if (textContent) {
          requestOptions.body = textContent;
          if (!requestOptions.headers['Content-Type']) {
            requestOptions.headers['Content-Type'] = 'text/plain';
          }
        }
      } else if (activeBodyType === 'form') {
        // Handle FormData
        const formData = new FormData();
        formFields.forEach(field => {
          if (field.type === 'file' && field.files && field.files.length > 0) {
            // Append the first file
            formData.append(field.key, field.files[0]);
          } else {
            formData.append(field.key, field.value);
          }
        });
        requestOptions.body = formData;
        // Fetch will set the correct Content-Type with boundary, so remove if set
        if (requestOptions.headers['Content-Type']) {
          delete requestOptions.headers['Content-Type'];
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
        // Not JSON
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
        setUrl={setBaseUrl}
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
            {activeRequestTab === 'auth' && (
              <AuthSection
                authMethod={authMethod}
                setAuthMethod={setAuthMethod}
                authCredentials={authCredentials}
                setAuthCredentials={setAuthCredentials}
              />
            )}
            {activeRequestTab === 'body' && (
              <BodySection
                jsonBody={jsonBody}
                setJsonBody={setJsonBody}
                setActiveBodyType={setActiveBodyType}
                formFields={formFields}
                setFormFields={setFormFields}
              />
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
