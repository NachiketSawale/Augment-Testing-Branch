/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { EventEmitter } from '@angular/core';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { IFormValueChangeInfo } from '../../../../form';

/**
 * Control Host data.
 */
export interface ICompositeControlOwner<T extends object> {
	/**
	 * Returns the current entity object.
	 */
	entity: T;

	/**
	 * No editing allowed.
	 */
	preventEditing?: boolean;

	/**
	 * Stores runtime data for an entity object.
	 */
	entityRuntimeData?: EntityRuntimeData<T>;

	/**
	 * Value to be emitted on control value change.
	 */
	valueChanged: EventEmitter<IFormValueChangeInfo<T>>;
}
