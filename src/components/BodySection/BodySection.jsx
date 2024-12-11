import React, { useState } from 'react';
import styles from './BodySection.module.css';

function BodySection({ jsonBody, setJsonBody }) {
  const [activeTab, setActiveTab] = useState('JSON');
  const [xmlBody, setXmlBody] = useState('');
  const [textBody, setTextBody] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'JSON':
        return (
          <textarea
            className={styles.bodyInput}
            value={jsonBody}
            onChange={e => setJsonBody(e.target.value)}
            placeholder='{"key":"value"}'
          />
        );
      case 'XML':
        return (
          <textarea
            className={styles.bodyInput}
            value={xmlBody}
            onChange={e => setXmlBody(e.target.value)}
            placeholder='<key>value</key>'
          />
        );
      case 'Text':
        return (
          <textarea
            className={styles.bodyInput}
            value={textBody}
            onChange={e => setTextBody(e.target.value)}
            placeholder='Plain text content'
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.bodySectionContainer}>
      <div className={styles.subTabs}>
        <button
          className={`${styles.subTabButton} ${activeTab === 'JSON' ? styles.active : ''}`}
          onClick={() => setActiveTab('JSON')}
        >
          JSON
        </button>
        <button
          className={`${styles.subTabButton} ${activeTab === 'XML' ? styles.active : ''}`}
          onClick={() => setActiveTab('XML')}
        >
          XML
        </button>
        <button
          className={`${styles.subTabButton} ${activeTab === 'Text' ? styles.active : ''}`}
          onClick={() => setActiveTab('Text')}
        >
          Text
        </button>
      </div>
      <h2 className={styles.bodyTitle}>{activeTab} Content</h2>
      {renderContent()}
    </div>
  );
}

export default BodySection;
