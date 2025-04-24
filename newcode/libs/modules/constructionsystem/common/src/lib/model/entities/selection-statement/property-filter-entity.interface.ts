/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

/**
 * the Property Filter Entity interface
 */
export interface IPropertyFilterEntity extends IEntityBase {
	Id: number;
	PropertyId: number | null;
	ValueType?: string | number | boolean | Date | null;
	Operation: number;
	PropertyValue: number | string | boolean | Date;
	PropertyName?: string | null;
}
