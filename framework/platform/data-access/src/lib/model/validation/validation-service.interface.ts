/*
 * Copyright(c) RIB Software GmbH
 */

import { Validator } from './validator.type';

/**
 * Interface for validation services. The interface just provides all existing property validations
 */
export interface IValidationService<T extends object> {
  getValidationFunc(fieldName: string): Validator<T>;
}