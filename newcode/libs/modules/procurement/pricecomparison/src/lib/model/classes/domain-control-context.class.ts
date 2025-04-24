/*
 * Copyright(c) RIB Software GmbH
 */

import { IControlContext } from '@libs/ui/common';
import { IEntityContext, MinimalEntityContext, PropertyType } from '@libs/platform/common';
import { ValidationResult } from '@libs/platform/data-access';

export class DomainControlContext<P extends PropertyType = PropertyType, TEntity extends object = object> implements IControlContext {
	private readonly _valueAccessor?: {
		get value(): P | undefined;
		set value(v: P);
	};

	/**
	 *
	 * @param fieldId
	 * @param readonly
	 * @param valueAccessor
	 */
	public constructor(
		public fieldId: string,
		public readonly: boolean,
		valueAccessor?: {
			get value(): P | undefined;
			set value(v: P);
		}
	) {
		this._valueAccessor = valueAccessor;
	}

	public get value(): P | undefined {
		return this._valueAccessor?.value;
	}

	public set value(v: P) {
		if (this._valueAccessor) {
			this._valueAccessor.value = v;
		}
	}

	/**
	 * Returns the list of current validation results for the field.
	 */
	public validationResults: ValidationResult[] = [];

	/**
	 * Provides context information related to an entity object that is the source for the value.
	 */
	public entityContext: IEntityContext<TEntity> = new MinimalEntityContext();
}