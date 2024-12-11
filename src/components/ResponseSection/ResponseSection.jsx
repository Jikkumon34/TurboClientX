import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ResponseTabs from '../ResponseTabs/ResponseTabs';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
import styles from './ResponseSection.module.css';

// Register the JSON language
SyntaxHighlighter.registerLanguage('json', json);

function ResponseSection({ status, size, time, activeTab, setActiveTab, body, headers }) {
  return (
    <div className={styles.responseSide}>
      <div className={styles.responseMeta}>
        <div className={styles.metaItem}>
          <span>Status:</span> {status}
        </div>
        <div className={styles.metaItem}>
          <span>Size:</span> {size}
        </div>
        <div className={styles.metaItem}>
          <span>Time:</span> {time}
        </div>
      </div>
      <ResponseTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={styles.responseContentArea}>
        {activeTab === 'response' && (
          <SyntaxHighlighter
            language="json"
            style={docco}
            className={styles.responseContent}
            wrapLongLines={true}
          >
            {body || 'No response body available.'}
          </SyntaxHighlighter>
        )}
        {activeTab === 'headers' && (
          <pre className={styles.responseContent}>
            {headers || 'No headers available.'}
          </pre>
        )}
      </div>
    </div>
  );
}

ResponseSection.propTypes = {
  status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  size: PropTypes.string,
  time: PropTypes.string,
  activeTab: PropTypes.oneOf(['response', 'headers']).isRequired,
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
