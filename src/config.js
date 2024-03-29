import React from "react";
import { numberRegex } from "./utils";

const CARD_NUMBER_CONFIG = {
  state: [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  defaultState: [
    "1",
    "2",
    "3",
    "4",
    "1",
    "2",
    "3",
    "4",
    "1",
    "2",
    "3",
    "4",
    "1",
    "2",
    "3",
    "4",
  ],
  sequence: [
    "",
    "",
    "",
    "",
    "separator",
    "",
    "",
    "",
    "",
    "separator",
    "",
    "",
    "",
    "",
    "separator",
    "",
    "",
    "",
    "",
  ],
  separator: "-",
  regexTester: numberRegex,
  minValue: 0,
  maxValue: 9,
  maxLength: 1,
  minLength: 1,
  inputRefs: [
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ],
  placeholder: 'X',
};

const CARD_VALIDITY_CONFIG = {
  month: {
    minValue: 1,
    maxValue: 12,
  },
  year: {
    minValue: 20,
    maxValue: 99,
  },
  placeholder: 'XX',
  inputRefs: [
    React.createRef(),
    React.createRef(),
  ],
};

export { CARD_NUMBER_CONFIG, CARD_VALIDITY_CONFIG };
