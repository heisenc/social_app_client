const checkFieldValidity = (value, rules) => {
  let valid = true;
  let errorMessage = null;
  if (
    (Object.keys(rules).length === 0 && rules.constructor === Object) ||
    !rules
  ) {
    return [true, null];
  }
  for (const rule of Object.entries(rules)) {
    const [ruleName, ruleValue] = rule;
    switch (ruleName) {
      case "required":
        valid = value.trim() !== "";
        errorMessage = "please enter some value";
        break;
      case "minLength":
        valid = value.trim().length >= ruleValue;
        errorMessage = `please enter value with length >= ${ruleValue}`;
        break;
      case "maxLength":
        valid = value.trim().length <= ruleValue;
        errorMessage = `please enter value with length <= ${ruleValue}`;
        break;
      case "isEmail":
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        valid = pattern.test(value.trim());
        errorMessage = "please enter valid email";
        break;
      default:
        break;
    }
    if (!valid) {
      return [valid, errorMessage];
    }
  }
  return [valid, null];
};

export const inputChangeUpdateForm = (form, fieldName, inputValue) => {
  const updatedForm = { ...form };
  const [feildValid, errorMessage] = checkFieldValidity(
    inputValue,
    updatedForm[fieldName].validation
  );
  updatedForm[fieldName] = {
    ...updatedForm[fieldName],
    value: inputValue,
    touched: true,
    valid: feildValid,
    errorMessage,
  };
  return updatedForm;
};

export const checkFormValidity = (form) => {
  let formVaild = true;
  for (const key in form) {
    formVaild = form[key].valid;
    if (!formVaild) {
      return false;
    }
  }
  return true;
};
