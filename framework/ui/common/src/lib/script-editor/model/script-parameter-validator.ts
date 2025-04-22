/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Validator for script parameter
 */
export class ScriptParameterValidator {
  /**
   * Validation results
   */
  public results: { Name: string, Error?: string, HasError?: boolean, IsHidden?: boolean, IsDisabled?: boolean }[] = [];

  /**
   * Check parameter
   * @param parameter
   * @param condition
   * @param error
   */
  public check(parameter: string, condition: boolean | (() => boolean), error: string) {
    let valid = false;

    if (typeof condition === 'boolean') {
      valid = condition;
    } else {
      valid = condition();
    }

    this.results.push({
      Name: parameter,
      HasError: !valid,
      Error: error
    });

    return this;
  }

  /**
   * Show parameter or not
   * @param parameter
   * @param condition
   */
  public show(parameter: string, condition: boolean | (() => boolean)) {
    let shown = false;

    if (typeof condition === 'boolean') {
      shown = condition;
    } else {
      shown = condition();
    }

    this.results.push({
      Name: parameter,
      IsHidden: !shown
    });

    return this;
  }

  /**
   * Hide parameter or not
   * @param parameter
   * @param condition
   */
  public hide(parameter: string, condition: boolean | (() => boolean)) {
    let hidden = false;

    if (typeof condition === 'boolean') {
      hidden = condition;
    } else {
      hidden = condition();
    }

    this.results.push({
      Name: parameter,
      IsHidden: hidden
    });

    return this;
  }

  /**
   * Enable parameter or not
   * @param parameter
   * @param condition
   */
  public enable(parameter: string, condition: boolean | (() => boolean)) {
    let enabled = false;

    if (typeof condition === 'boolean') {
      enabled = condition;
    } else {
      enabled = condition();
    }

    this.results.push({
      Name: parameter,
      IsDisabled: !enabled
    });

    return this;
  }

  /**
   * Disable parameter or not
   * @param parameter
   * @param condition
   */
  public disable(parameter: string, condition: boolean | (() => boolean)) {
    let disabled = false;

    if (typeof condition === 'boolean') {
      disabled = condition;
    } else {
      disabled = condition();
    }

    this.results.push({
      Name: parameter,
      IsDisabled: disabled
    });

    return this;
  }
}