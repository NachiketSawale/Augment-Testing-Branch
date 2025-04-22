/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { PropertyType } from '@libs/platform/common';

import { IControlContext } from '../../control-context.interface';
import { IField } from '../../../../model/fields/field.interface';

/**
 * Provides information about a control field.
 */
export class CompositeControlInfo<T extends object, P extends PropertyType = PropertyType> {
	public constructor(
		public readonly controlField: IField<T>,
		public readonly context: IControlContext<P>,
	) {}

	/**
	 * Indicates whether there is at least one validation error for the controlField.
	 */
	public get hasValidationErrors(): boolean {
		return this.context.validationResults.some((vr) => !vr.valid);
	}

	/**
	 * Returns the current validation error message, if any.
	 */
	public get validationMessage(): string | undefined {
		return this.context.validationResults
			.filter((vr) => !vr.valid)
			.map((vr) => vr.error ?? '')
			.join(' ');
	}
}
