// src/components/RequestTabs/RequestTabs.jsx
import React from 'react';
import styles from './RequestTabs.module.css';

function RequestTabs({ activeTab, setActiveTab }) {
  return (
    <div className={styles.requestTabsContainer}>
      <div className={styles.innerTabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'query' ? styles.active : ''}`}
          onClick={() => setActiveTab('query')}
        >
          Query
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'headers' ? styles.active : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'auth' ? styles.active : ''}`}
          onClick={() => setActiveTab('auth')}
        >
          Auth
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'body' ? styles.active : ''}`}
          onClick={() => setActiveTab('body')}
        >
          Body
        </button>
      </div>
    </div>
  );
}

export default RequestTabs;
