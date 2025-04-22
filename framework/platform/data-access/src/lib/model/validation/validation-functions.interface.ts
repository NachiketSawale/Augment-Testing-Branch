/*
 * Copyright(c) RIB Software GmbH
 */

import { Validator } from './validator.type';

export interface IValidationFunctions<T> {
	[key: string]: Validator<T> | Validator<T>[] | undefined;
}