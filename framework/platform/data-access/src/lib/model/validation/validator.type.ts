/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {ValidationInfo} from './validation-info.class';
import { ValidationResult } from './validation-result.class';


/**
 * The function type for validators.
 */
export type Validator<T> = (info: ValidationInfo<T>) => Promise<ValidationResult> | ValidationResult;