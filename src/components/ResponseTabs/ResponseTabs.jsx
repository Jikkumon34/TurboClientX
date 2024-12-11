// src/components/ResponseTabs/ResponseTabs.jsx
import React from 'react';
import styles from './ResponseTabs.module.css';

function ResponseTabs({ activeTab, setActiveTab, hasCookies }) {
  return (
    <div className={styles.responseTabsContainer}>
      <div className={styles.innerTabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'response' ? styles.active : ''}`}
          onClick={() => setActiveTab('response')}
        >
          Response
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'headers' ? styles.active : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
        </button>
        {hasCookies && (
          <button
            className={`${styles.tabButton} ${activeTab === 'cookies' ? styles.active : ''}`}
            onClick={() => setActiveTab('cookies')}
          >
            Cookies
          </button>
        )}
      </div>
    </div>
  );
}

export default ResponseTabs;
