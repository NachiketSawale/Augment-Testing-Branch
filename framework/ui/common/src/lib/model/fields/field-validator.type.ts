/*
 * Copyright(c) RIB Software GmbH
 */

import { ValidationResult } from '@libs/platform/data-access';
import { FieldValidationInfo } from './field-validation-info.class';

/**
 * A function type for field validators.
 *
 * @typeParam T The entity type whose properties are validated.
 */
export type FieldValidator<T> = (info: FieldValidationInfo<T>) => Promise<ValidationResult> | ValidationResult;
