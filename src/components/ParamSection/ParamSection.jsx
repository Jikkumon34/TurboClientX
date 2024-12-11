// src/components/ParamSection/ParamSection.jsx
import React from 'react';
import ParamRow from '../ParamRow/ParamRow';
import styles from './ParamSection.module.css';

function ParamSection({ title, params, onAddParam, onChangeParam, onRemoveParam, addButtonLabel }) {
  return (
    <div className={styles.paramSectionContainer}>
      <h2 className={styles.paramSectionTitle}>{title}</h2>
      <div className={styles.paramList}>
        {params.map((p, i) => (
          <ParamRow
            key={i}
            param={p}
            onChange={(k, v) => onChangeParam(i, k, v)}
            onRemove={() => onRemoveParam(i)}
          />
        ))}
      </div>
      <button className={styles.addParamBtn} onClick={onAddParam}>{addButtonLabel}</button>
    </div>
  );
}

export default ParamSection;
