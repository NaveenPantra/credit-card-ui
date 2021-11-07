import React from "react";

import "./App.css";
import { CARD_NUMBER_CONFIG, CARD_VALIDITY_CONFIG } from "./config";

function App() {
  const [turnCard, setTurnCard] = React.useState(false);

  const handleTurnCard = React.useCallback(() => {
    setTurnCard((prevState) => !prevState);
  }, [setTurnCard]);

  return (
    <>
      <div className={`card_wrapper ${turnCard ? "turn_card" : ""}`}>
        <div className="card_container">
          <div className="card_back">
            <div className="card_back_content">
              <CardBack />
            </div>
          </div>
          <div className="card_front">
            <div className="card_front_header">
              <img
                src={
                  "https://d16pnh712pyiwa.cloudfront.net/wp-content/uploads/2020/05/Zest-Logo_300-98-02-1.png"
                }
                alt="ZestMoney"
                className={"zest-logo"}
              />
            </div>
            <CardNumber />
            <div className="card_validity">
              <label className="card_validity_label">
                <span className="card_validity_text">VALID</span>
                <span className="card_validity_text">UP TO</span>
              </label>
              <CardValidity />
            </div>
            <CardName />
          </div>
        </div>
      </div>
      <button onClick={handleTurnCard}>
        {!turnCard ? "Enter CVV" : "Enter card details"}
      </button>
    </>
  );
}

function CardNumber() {
  const [value, setValue] = React.useState(CARD_NUMBER_CONFIG.state);

  const updateValue = React.useCallback(
    (inputIndex, inputValue) => {
      setValue((prevState) => {
        const newState = [...prevState];
        newState[inputIndex] = inputValue;
        return newState;
      });
    },
    [setValue]
  );

  const focusOnNextInput = React.useCallback((currentInputIndex) => {
    CARD_NUMBER_CONFIG.inputRefs[currentInputIndex + 1]?.current?.focus();
    CARD_NUMBER_CONFIG.inputRefs[currentInputIndex + 1]?.current?.select();
  }, []);

  const focusOnPrevInput = React.useCallback((currentInputIndex) => {
    CARD_NUMBER_CONFIG.inputRefs[currentInputIndex - 1]?.current?.focus();
    CARD_NUMBER_CONFIG.inputRefs[currentInputIndex - 1]?.current?.select();
  }, []);

  const UI = React.useMemo(() => {
    let inputIndex = -1;
    return CARD_NUMBER_CONFIG.sequence.map((char) => {
      switch (char) {
        case "separator":
          return <div key={`separator-${inputIndex}`}>&nbsp;&nbsp;</div>;
        default:
          inputIndex += 1;
          return (
            <Input
              key={inputIndex}
              ref={CARD_NUMBER_CONFIG.inputRefs[inputIndex]}
              inputIndex={inputIndex}
              value={value[inputIndex]}
              setValue={updateValue}
              minLength={CARD_NUMBER_CONFIG.minLength}
              maxLength={CARD_NUMBER_CONFIG.maxLength}
              regexTester={CARD_NUMBER_CONFIG.regexTester}
              goToNext={focusOnNextInput}
              goToPrev={focusOnPrevInput}
              placeholder={CARD_NUMBER_CONFIG.placeholder}
            />
          );
      }
    });
  }, [updateValue, value, focusOnNextInput, focusOnPrevInput]);

  return <div className="card_number">{UI}</div>;
}

const Input = React.forwardRef(function Input(
  {
    value,
    inputIndex,
    setValue,
    goToNext,
    goToPrev,
    maxLength,
    minLength = 0,
    error,
    regexTester,
    className = "",
    placeholder,
  },
  ref
) {
  const handleOnInputChange = React.useCallback(
    (event) => {
      const updatedValue = event.target.value.trim();
      if (!regexTester?.(updatedValue)) return;
      setValue?.(inputIndex, updatedValue);
      if (updatedValue.length === maxLength) {
        goToNext?.(inputIndex);
      }
    },
    [inputIndex, setValue, goToNext, maxLength, regexTester]
  );

  const handleOnKeyDown = React.useCallback(
    (event) => {
      if (event.key === "Backspace" && value.length === 0) {
        goToPrev?.(inputIndex);
      }
    },
    [inputIndex, goToPrev, value]
  );

  const handleOnFocus = React.useCallback(() => {
    ref?.current?.select();
  }, [ref]);

  return (
    <input
      ref={ref}
      className={`number-input ${className}`}
      value={value}
      onKeyDown={handleOnKeyDown}
      onChange={handleOnInputChange}
      onFocus={handleOnFocus}
      placeholder={placeholder}
    />
  );
});

const CardValidity = () => {
  const [value, setValue] = React.useState(["", ""]);

  const handleGoToNext = React.useCallback((currentInputIndex) => {
    CARD_VALIDITY_CONFIG.inputRefs[currentInputIndex + 1]?.current?.focus();
    CARD_VALIDITY_CONFIG.inputRefs[currentInputIndex + 1]?.current?.select();
  }, []);

  const handleGoToPrev = React.useCallback((currentInputIndex) => {
    CARD_VALIDITY_CONFIG.inputRefs[currentInputIndex - 1]?.current?.focus();
    CARD_VALIDITY_CONFIG.inputRefs[currentInputIndex - 1]?.current?.select();
  }, []);

  const handleUpdateValue = React.useCallback(
    (inputIndex, inputValue) => {
      setValue((prevState) => {
        const newState = [...prevState];
        newState[inputIndex] = inputValue;
        return newState;
      });
    },
    [setValue]
  );

  return (
    <div className="validity_input_wrapper">
      <CardValidityInput
        value={value[0]}
        updateValue={handleUpdateValue}
        inputIndex={0}
        ref={CARD_VALIDITY_CONFIG.inputRefs[0]}
        minValue={CARD_VALIDITY_CONFIG.month.minValue}
        maxValue={CARD_VALIDITY_CONFIG.month.maxValue}
        goToNext={handleGoToNext}
        goToPrev={handleGoToPrev}
        placeholder={CARD_VALIDITY_CONFIG.placeholder}
      />
      <div>/</div>
      <CardValidityInput
        value={value[1]}
        updateValue={handleUpdateValue}
        inputIndex={1}
        ref={CARD_VALIDITY_CONFIG.inputRefs[1]}
        minValue={CARD_VALIDITY_CONFIG.year.minValue}
        maxValue={CARD_VALIDITY_CONFIG.year.maxValue}
        goToNext={handleGoToNext}
        goToPrev={handleGoToPrev}
        placeholder={CARD_VALIDITY_CONFIG.placeholder}
      />
    </div>
  );
};

const CardValidityInput = React.forwardRef(function CardValidityInput(
  { value, updateValue, goToNext, maxValue, inputIndex, goToPrev, placeholder },
  ref
) {
  const handleOnChange = React.useCallback(
    (event) => {
      let updatedValue = event.target.value.trim();
      if (updatedValue.length > 2) {
        goToNext?.(inputIndex);
        return;
      }
      if (updatedValue > maxValue || isNaN(updatedValue)) return;
      updateValue?.(inputIndex, updatedValue);
      if (updatedValue.toString().length === 2) {
        goToNext?.(inputIndex);
      }
    },
    [maxValue, updateValue, inputIndex, goToNext]
  );

  const handleOnKeyDown = React.useCallback(
    (event) => {
      if (event.key === "Backspace" && value.length === 0) {
        goToPrev?.(inputIndex);
      }
    },
    [inputIndex, goToPrev, value]
  );

  const handleOnFocus = React.useCallback(() => {
    ref?.current?.select();
  }, [ref]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={handleOnChange}
      onFocus={handleOnFocus}
      onClick={handleOnFocus}
      onKeyDown={handleOnKeyDown}
      className={"validity_input"}
      placeholder={placeholder}
    />
  );
});

const CardName = React.forwardRef(function CardName() {
  return (
    <div className="card_name">
      <input className={"card_name_input"} placeholder={"Your Name..."} />
    </div>
  );
});

const CardBack = () => {
  return (
    <div className="card_back_wrapper">
      <div className="card_back_mag_strip"></div>
      <div className="cvv_strip_container">
        <div className="cvv_strip"></div>
        <CardCVV />
      </div>
      <div className="card_back_details">
        <div className="card_back_details"></div>
        <img
          className="card_holo_gram_img"
          src={"https://www.zestmoney.in/images/ZestLogo.png"}
          alt="ZEST LOGO"
        />
      </div>
    </div>
  );
};

const CardCVV = React.forwardRef(function CardCVV() {
  const [value, setValue] = React.useState("");

  const handleOnValueChange = React.useCallback((event) => {
    if (isNaN(event.target.value)) return;
    if (event.target.value.length > 3) return;
    setValue(event.target.value.trim());
  }, []);

  return (
    <input
      className={"input_card_cvv"}
      placeholder={"CVV"}
      value={value}
      onChange={handleOnValueChange}
    />
  );
});

export default App;
