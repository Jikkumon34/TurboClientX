// src/components/ParamRow/ParamRow.jsx
import React from 'react';
import styles from './ParamRow.module.css';

function ParamRow({ param, onChange, onRemove }) {
  return (
    <div className={styles.paramRowContainer}>
      <input
        type="text"
        className={styles.paramInput}
        placeholder="Key"
        value={param.key}
        onChange={e => onChange('key', e.target.value)}
      />
      <input
        type="text"
        className={styles.paramInput}
        placeholder="Value"
        value={param.value}
        onChange={e => onChange('value', e.target.value)}
      />
      <button className={styles.removeParamBtn} onClick={onRemove}>×</button>
    </div>
  );
}

export default ParamRow;
