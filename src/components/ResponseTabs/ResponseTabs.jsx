// src/components/ResponseTabs/ResponseTabs.jsx
import React from 'react';
import styles from './ResponseTabs.module.css';

function ResponseTabs({ activeTab, setActiveTab }) {
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
      </div>
    </div>
  );
}

export default ResponseTabs;
