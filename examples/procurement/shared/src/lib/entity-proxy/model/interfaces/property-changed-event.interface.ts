/*
 * Copyright(c) RIB Software GmbH
 */

import { Nullable } from '../types';
import { FieldKind } from '../enums/field-kind.enum';
import { AllKeys } from '@libs/platform/common';

/**
 * Entity property changed event interface
 */
export interface IPropertyChangedEvent<TEntity> {
	/**
	 * The entity whose property is changed
	 */
	entity: TEntity;
	/**
	 * Property field
	 */
	field?: AllKeys<TEntity>;
	/**
	 * Value after changed
	 */
	newValue?: Nullable<unknown>;
	/**
	 * Value before changed
	 */
	oldValue?: Nullable<unknown>;
	/**
	 * Sometimes some property will have different name in different entity, Use it in the common business logic to identity same property
	 */
	fieldKind?: FieldKind;
}
