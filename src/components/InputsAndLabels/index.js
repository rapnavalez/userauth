import React from 'react';

export default function InputsAndLabels({
  labelClassName,
  labelValue,
  inputClassName,
  inputType,
  inputPlaceholder,
  inputName,
  inputId,
  inputOnChangeHandler,
}) {
  return (
    <>
      <label className={`signup--label ${labelClassName}`}>{labelValue}</label>
      <input
        className={`signup--input ${inputClassName}`}
        type={inputType}
        placeholder={inputPlaceholder}
        name={inputName}
        id={inputId}
        onChange={inputOnChangeHandler}
      />
    </>
  );
}
