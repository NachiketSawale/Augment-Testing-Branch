/*
 * Copyright(c) RIB Software GmbH
 */

import { ConcreteField } from '../concrete-field.type';

/**
 * Defines additional options for composite fields.
 *
 * @group Fields API
 */
export interface IAdditionalCompositeOptions<T extends object> {

	/**
	 * The individual parts of the composite control.
	 */
	composite: ConcreteField<T>[];
}