// src/components/TopBar/TopBar.jsx
import React from 'react';
import { useTheme } from '../../theme/theme';
import styles from './TopBar.module.css';



function TopBar({ method, setMethod, url, setUrl, onSend }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={styles.topBarContainer}>
      <label htmlFor="method-select" className={styles['sr-only']}>
        HTTP Method
      </label>
      <select
        id="method-select"
        className={styles.methodSelect}
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>PATCH</option>
        <option>DELETE</option>
      </select>

      <label htmlFor="url-input" className={styles['sr-only']}>
        Request URL
      </label>
      <input
        id="url-input"
        type="text"
        className={styles.urlInput}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.thunderclient.com/welcome"
      />

      <button
        className={styles.sendBtn}
        onClick={onSend}
        disabled={!url} // Example condition
      >
        Send
      </button>
      <button className={styles.themeToggle} onClick={toggleTheme}>
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );
}

export default TopBar;
