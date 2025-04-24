/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { IPropertyChangedEvent } from './property-changed-event.interface';

/**
 * Entity proxy class
 */
export interface IEntityProxy<T> {
	/**
	 * Entity property changed event
	 */
	readonly propertyChanged$: Observable<IPropertyChangedEvent<T>>;

	/**
	 * Apply a proxy to entity which will intercept property getter and setter
	 * @param entity
	 */
	apply(entity: T): T;

	/**
	 * Restore proxy to entity
	 * @param entity
	 */
	restore(entity: T): T;

	/**
	 * Is a proxy object
	 * @param entity
	 */
	isProxy(entity: T): boolean;
}
