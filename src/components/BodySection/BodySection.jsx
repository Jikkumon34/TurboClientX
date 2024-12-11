import React, { useState } from 'react';
import styles from './BodySection.module.css';

function BodySection({ 
  jsonBody, 
  setJsonBody,
  setActiveBodyType, // New prop to inform parent which type of body is being edited
  formFields, 
  setFormFields 
}) {
  const [activeTab, setActiveTab] = useState('JSON');
  const [xmlBody, setXmlBody] = useState('');
  const [textBody, setTextBody] = useState('');

  // Handle changes in the active tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveBodyType(tab.toLowerCase());
  };

  const handleFormFieldChange = (index, type, value) => {
    const newFields = [...formFields];
    newFields[index][type] = value;
    setFormFields(newFields);
  };

  const addFormField = () => {
    setFormFields([...formFields, { key: '', value: '', type: 'text' }]);
  };

  const removeFormField = (index) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const handleFileChange = (index, files) => {
    const newFields = [...formFields];
    newFields[index].files = files;
    setFormFields(newFields);
  };

  const renderJSONTab = () => (
    <textarea
      className={styles.bodyInput}
      value={jsonBody}
      onChange={e => setJsonBody(e.target.value)}
      placeholder='{"key":"value"}'
    />
  );

  const renderXMLTab = () => (
    <textarea
      className={styles.bodyInput}
      value={xmlBody}
      onChange={e => setXmlBody(e.target.value)}
      placeholder='<key>value</key>'
    />
  );

  const renderTextTab = () => (
    <textarea
      className={styles.bodyInput}
      value={textBody}
      onChange={e => setTextBody(e.target.value)}
      placeholder='Plain text content'
    />
  );

  const renderFormTab = () => (
    <div className={styles.formBodyContainer}>
      <button className={styles.addFormFieldButton} onClick={addFormField}>
        + Add Form Field
      </button>
      {formFields.map((field, index) => (
        <div key={index} className={styles.formFieldRow}>
          <input
            className={styles.formKeyInput}
            type="text"
            placeholder="Key"
            value={field.key}
            onChange={e => handleFormFieldChange(index, 'key', e.target.value)}
          />

          {/* Switch between text field and file input based on a user selection, for simplicity let's have a dropdown */}
          <select
            className={styles.formFieldType}
            value={field.type}
            onChange={e => handleFormFieldChange(index, 'type', e.target.value)}
          >
            <option value="text">Text</option>
            <option value="file">File</option>
          </select>

          {field.type === 'text' ? (
            <input
              className={styles.formValueInput}
              type="text"
              placeholder="Value"
              value={field.value}
              onChange={e => handleFormFieldChange(index, 'value', e.target.value)}
            />
          ) : (
            <input
              className={styles.formFileInput}
              type="file"
              onChange={e => handleFileChange(index, e.target.files)}
            />
          )}

          <button className={styles.removeFormFieldButton} onClick={() => removeFormField(index)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'JSON':
        return renderJSONTab();
      case 'XML':
        return renderXMLTab();
      case 'Text':
        return renderTextTab();
      case 'Form':
        return renderFormTab();
      default:
        return null;
    }
  };

  return (
    <div className={styles.bodySectionContainer}>
      <div className={styles.subTabs}>
        <button
          className={`${styles.subTabButton} ${activeTab === 'JSON' ? styles.active : ''}`}
          onClick={() => handleTabChange('JSON')}
        >
          JSON
        </button>
        <button
          className={`${styles.subTabButton} ${activeTab === 'XML' ? styles.active : ''}`}
          onClick={() => handleTabChange('XML')}
        >
          XML
        </button>
        <button
          className={`${styles.subTabButton} ${activeTab === 'Text' ? styles.active : ''}`}
          onClick={() => handleTabChange('Text')}
        >
          Text
        </button>
        <button
          className={`${styles.subTabButton} ${activeTab === 'Form' ? styles.active : ''}`}
          onClick={() => handleTabChange('Form')}
        >
          Form
        </button>
      </div>
      <h2 className={styles.bodyTitle}>{activeTab} Content</h2>
      {renderContent()}
    </div>
  );
}

export default BodySection;
