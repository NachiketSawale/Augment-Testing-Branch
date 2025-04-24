/*
 * Copyright(c) RIB Software GmbH
 */

import {ValidationResult} from '@libs/platform/data-access';
import { IEntityContext, PropertyType } from '@libs/platform/common';
import { InjectionToken } from '@angular/core';

/**
 * The common interface for the context object of a domain control.
 */
export interface IControlContext<P extends PropertyType = PropertyType, TEntity extends object = object> {

	/**
	 * Gets or sets the value to edit in the control.
	 */
	value?: P;

	/**
	 * A field ID unique within the control context (e.g.a form or a grid row).
	 */
	get fieldId(): string;

	/**
	 * Indicates whether the control is read-only (which can be the same as disabled, e.g. for buttons).
	 */
	get readonly(): boolean;

	/**
	 * Returns the list of current validation results for the field.
	 */
	get validationResults(): ValidationResult[];

	/**
	 * Provides context information related to an entity object that is the source for the value.
	 */
	get entityContext(): IEntityContext<TEntity>;
}

/**
 * The injection token used to inject a control context into a domain control.
 */
export const ControlContextInjectionToken = new InjectionToken<IControlContext>('control-context');