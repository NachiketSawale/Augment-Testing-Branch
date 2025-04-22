/*
 * Copyright(c) RIB Software GmbH
 */

import { IControlContext } from '../../../domain-controls/model/control-context.interface';
import { PropertyType } from '@libs/platform/common';
import { FormRow } from '../form-config.interface';
import { FormDisplayMode, uiAutomationIdentifierClass } from '../../../../index';

/**
 * Provides information about a row in a form.
 */
export class FormRowInfo<T extends object, P extends PropertyType = PropertyType> {
	public constructor(
		public readonly row: FormRow<T>,
		public readonly context: IControlContext<P>
	) {
	}

	/**
	 * Indicates whether there is at least one validation error for the row.
	 */
	public get hasValidationErrors(): boolean {
		return this.context.validationResults.some(vr => !vr.valid);
	}

	/**
	 * Returns the current validation error message, if any.
	 */
	public get validationMessage(): string | undefined {
		return this.context.validationResults.filter(vr => !vr.valid).map(vr => vr.error ?? '').join(' ');
	}

	/**
	 * Returns the CSS class used as a UI identifier.
	 */
	public get uiIdentifierClass(): string {
		return uiAutomationIdentifierClass(this.row.id);
	}

	/**
	 * Returns a string with the CSS classes to apply to column 2.
	 *
	 * @param displayMode The form display mode to assume.
	 *
	 * @returns An array with the CSS class names.
	 */
	public getColumn2Classes(displayMode: FormDisplayMode): string[] {
		const result = [this.uiIdentifierClass];

		switch (displayMode) {
			case FormDisplayMode.Narrow:
				result.push('narrow');
				break;
			case FormDisplayMode.TwoColumns:
				if (!this.row.label) {
					result.push('extend-across-label');
				}
				break;
		}

		return result;
	}
}