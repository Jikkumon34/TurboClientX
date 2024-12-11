// src/components/ResponseSection/ResponseSection.jsx
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ResponseTabs from '../ResponseTabs/ResponseTabs';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
import { default as ReactJson } from 'react-json-view';
import styles from './ResponseSection.module.css';

// Register the JSON language for SyntaxHighlighter
SyntaxHighlighter.registerLanguage('json', json);

/**
 * Helper function to determine the status category.
 * Returns a string representing the category.
 */
const getStatusCategory = (status) => {
  const statusCode = parseInt(status, 10);
  if (isNaN(statusCode)) {
    return 'unknown';
  } else if (statusCode >= 100 && statusCode < 200) {
    return 'informational';
  } else if (statusCode >= 200 && statusCode < 300) {
    return 'success';
  } else if (statusCode >= 300 && statusCode < 400) {
    return 'redirection';
  } else if (statusCode >= 400 && statusCode < 500) {
    return 'client-error';
  } else if (statusCode >= 500) {
    return 'server-error';
  } else {
    return 'unknown';
  }
};

/**
 * Parse the raw headers string into key-value pairs.
 */
const parseHeaders = (headersStr) => {
  if (!headersStr) return [];
  return headersStr
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => {
      const idx = line.indexOf(':');
      const key = line.substring(0, idx).trim();
      const value = line.substring(idx + 1).trim();
      return { key, value };
    });
};

/**
 * Extract cookies from headers by looking at 'Set-Cookie' keys.
 */
const extractCookies = (headersArr) => {
  return headersArr
    .filter(h => h.key.toLowerCase() === 'set-cookie')
    .map(h => h.value);
};

function ResponseSection({ status, size, time, activeTab, setActiveTab, body, headers }) {
  const statusCategory = getStatusCategory(status);

  // Parse headers into a structured array
  const headersArr = parseHeaders(headers);
  const cookies = extractCookies(headersArr);
  const hasCookies = cookies.length > 0;

  // Check if response body is JSON
  let parsedJson = null;
  try {
    parsedJson = JSON.parse(body);
  } catch (e) {
    parsedJson = null;
  }

  return (
    <div className={styles.responseSide}>
      <div className={styles.responseMeta}>
        <div className={styles.metaItem}>
          <span>Status:</span> 
          <span className={`${styles.status} ${styles[statusCategory]}`}>
            {status}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span>Size:</span> {size}
        </div>
        <div className={styles.metaItem}>
          <span>Time:</span> {time}
        </div>
      </div>
      <ResponseTabs activeTab={activeTab} setActiveTab={setActiveTab} hasCookies={hasCookies} />
      <div className={styles.responseContentArea}>
        {activeTab === 'response' && (
          <>
            {parsedJson ? (
              <div className={styles.jsonViewer}>
                <ReactJson src={parsedJson} theme="monokai" name={false} collapsed={2} />
              </div>
            ) : (
              <SyntaxHighlighter
                language="json"
                style={docco}
                className={styles.responseContent}
                wrapLongLines={true}
              >
                {body || 'No response body available.'}
              </SyntaxHighlighter>
            )}
          </>
        )}
        {activeTab === 'headers' && (
          headersArr.length > 0 ? (
            <table className={styles.headersTable}>
              <thead>
                <tr>
                  <th>Header</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {headersArr.map((h, i) => (
                  <tr key={i}>
                    <td>{h.key}</td>
                    <td>{h.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No headers available.</div>
          )
        )}
        {activeTab === 'cookies' && hasCookies && (
          <table className={styles.headersTable}>
            <thead>
              <tr>
                <th>Cookie</th>
              </tr>
            </thead>
            <tbody>
              {cookies.map((c, i) => (
                <tr key={i}>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

ResponseSection.propTypes = {
  status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  size: PropTypes.string,
  time: PropTypes.string,
  activeTab: PropTypes.oneOf(['response', 'headers', 'cookies']).isRequired,
  setActiveTab: PropTypes.func.isRequired,
  body: PropTypes.string,
  headers: PropTypes.string,
};

ResponseSection.defaultProps = {
  size: '0 B',
  time: '0 ms',
  body: '',
  headers: '',
};

export default memo(ResponseSection);
