/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ValidationResult } from '@libs/platform/data-access';
import { IField } from '../../../../model/fields/field.interface';
import { IControlContext } from '../../control-context.interface';
import { ICompositeControlOwner } from '../interfaces/composite-control-owner.interface';
import { IFieldValueChangeInfo } from '../../../../model/fields/field-value-change-info.interface';
import { IEntityContext, IReadOnlyPropertyAccessor, PropertyPathAccessor, PropertyType, isPropertyAccessor, isReadOnlyPropertyAccessor } from '@libs/platform/common';

export class CompositeControlContext<T extends object, P extends PropertyType = PropertyType> implements IControlContext<P, T> {
	/**
	 * Initializes a new instance and establishes access to the underlying field,
	 * depending on the {@link IField.model} property.
	 *
	 * @param owner The host in which this context object is used.
	 * @param controlField The control field definition.
	 * @param entityContext A context object that provides some information on the entity object.
	 */
	public constructor(
		private readonly owner: ICompositeControlOwner<T>,
		private readonly controlField: IField<T, P>,
		public readonly entityContext: IEntityContext<T>,
	) {
		if (isReadOnlyPropertyAccessor(controlField.model)) {
			this.valueAccessor = controlField.model;
			this.alwaysReadOnly = !isPropertyAccessor(this.valueAccessor);
		} else if (controlField.model) {
			this.valueAccessor = new PropertyPathAccessor(controlField.model);
			this.alwaysReadOnly = false;
		} else {
			this.valueAccessor = {
				getValue(): P | undefined {
					return undefined;
				},
			};
			this.alwaysReadOnly = true;
		}
	}

	/**
	 * Indicates whether the controlField is permanently read-only due to its value accessor.
	 */
	private readonly alwaysReadOnly: boolean;

	/**
	 * Wraps the access to the actual field. Depending on the controlField definition,
	 * this might also be an object that returns a constant value or that
	 * retrieves its data from another source.
	 */
	private readonly valueAccessor: IReadOnlyPropertyAccessor<T, P>;

	public get value(): P | undefined {
		if (this.owner.entity) {
			return this.valueAccessor.getValue(this.owner.entity);
		}
		return undefined;
	}

	public set value(v: P | undefined) {
		if (this.owner.entity) {
			if (isPropertyAccessor<T, P>(this.valueAccessor)) {
				const changeInfo: IFieldValueChangeInfo<T, P> = {
					oldValue: this.valueAccessor.getValue(this.owner.entity),
					newValue: v,
					field: this.controlField,
					entity: this.owner.entity,
				};

				if (this.controlField.changing && changeInfo) {
					this.controlField.changing(changeInfo);
				}

				this.valueAccessor.setValue(this.owner.entity, v);

				if (this.controlField.change && changeInfo) {
					this.controlField.change(changeInfo);
				}

				this.owner.valueChanged.emit({
					oldValue: changeInfo.oldValue,
					newValue: changeInfo.newValue,
					rowId: changeInfo.field.id,
					entity: changeInfo.entity
				});
			} 
		}
	}

	public get entity(): T | undefined {
		return this.owner.entity;
	}

	public get fieldId(): string {
		return this.controlField.id;
	}

	public get readonly(): boolean {
		if (this.alwaysReadOnly || this.controlField.readonly || this.owner.preventEditing) {
			return true;
		}

		if (this.owner.entityRuntimeData) {
			if (this.owner.entityRuntimeData.entityIsReadOnly) {
				return true;
			}

			if (typeof this.controlField.model === 'string') {
				const roRecord = this.owner.entityRuntimeData.readOnlyFields.find((ro) => ro.field === this.controlField.model);
				if (roRecord) {
					return roRecord.readOnly;
				}
			}
		}

		return !this.owner.entity;
	}

	public get validationResults(): ValidationResult[] {
		if (this.owner.entityRuntimeData) {
			if (typeof this.controlField.model === 'string') {
				const vrRecord = this.owner.entityRuntimeData.validationResults.find((vr) => vr.field === this.controlField.model);
				if (vrRecord) {
					return [vrRecord.result];
				}
			}
		}

		return [];
	}

	[key: string]: unknown | undefined;
}
