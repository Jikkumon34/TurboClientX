// src/components/AuthSection/AuthSection.jsx
import React, { useState } from 'react';
import styles from './AuthSection.module.css';

function AuthSection({ authMethod, setAuthMethod, authCredentials, setAuthCredentials }) {
  // authMethod: 'none', 'bearer', 'basic'
  // authCredentials: { token: '', username: '', password: '' }

  const handleMethodChange = (e) => {
    setAuthMethod(e.target.value);
  };

  const renderFields = () => {
    switch (authMethod) {
      case 'bearer':
        return (
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Token</label>
            <input
              className={styles.input}
              type="text"
              value={authCredentials.token || ''}
              onChange={(e) => setAuthCredentials(prev => ({ ...prev, token: e.target.value }))}
              placeholder="Enter your bearer token"
            />
          </div>
        );
      case 'basic':
        return (
          <>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Username</label>
              <input
                className={styles.input}
                type="text"
                value={authCredentials.username || ''}
                onChange={(e) => setAuthCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                value={authCredentials.password || ''}
                onChange={(e) => setAuthCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.authSectionContainer}>
      <h2 className={styles.title}>Authentication</h2>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Auth Type</label>
        <select className={styles.select} value={authMethod} onChange={handleMethodChange}>
          <option value="none">None</option>
          <option value="bearer">Bearer Token</option>
          <option value="basic">Basic Auth</option>
        </select>
      </div>
      {renderFields()}
    </div>
  );
}

export default AuthSection;
