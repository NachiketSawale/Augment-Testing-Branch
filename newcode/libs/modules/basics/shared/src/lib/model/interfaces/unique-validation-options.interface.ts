/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

export interface IUniqueValidationOptions {
	fieldName?: Translatable;
	additionalHttpParams?: { [key: string]: string | number | boolean | undefined | null };
}