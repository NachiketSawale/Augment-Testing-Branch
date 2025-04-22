/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IEntityContext,
	PropertyType
} from '@libs/platform/common';
import { isValidationResultPromise, ValidationResult } from '@libs/platform/data-access';
import {
	FieldValidationInfo,
	FieldValidator
} from '../../model/fields';
import { IControlContext } from './control-context.interface';

/**
 * A base class for context objects of a domain control.
 *
 * Use this class for consistent behavior across domain control hosting components.
 * Override the {@link internalValue} property to actually access the internal value.
 */
export abstract class ControlContextBase<P extends PropertyType = PropertyType, TEntity extends object = object>
	implements IControlContext<P, TEntity> {

	/**
	 * Retrieves the value to edit in the control from its underlying source.
	 */
	protected abstract get internalValue(): P | undefined;

	/**
	 * Writes the value to edit in the control to its underlying source.
	 */
	protected abstract set internalValue(v: P | undefined);

	private previewValue?: P;

	/**
	 * Gets the value to edit in the control.
	 */
	public get value(): P | undefined {
		return this.previewValue ?? this.internalValue;
	}

	/**
	 * Sets the value to edit in the control.
	 */
	public set value(v: P | undefined) {
		if (this.entityContext.entity && this.canSetValue()) {
			const updateId = this.getNextUpdateId();

			// validate here: take validation func from IField;
			// deposited there by entity form service while constructing form rows based on
			// schema and layout config (analogously for grid)
			// check validationResult.apply
			// add validation errors to local list only if apply === false
			const validator = this.getValidator();
			if (validator) {
				const vInfo = new FieldValidationInfo(this.entityContext.entity, v);
				const vResult = validator(vInfo);
				if (isValidationResultPromise(vResult)) {
					// asynchronous validation: new value is temporarily stored
					this.previewValue = v;
					vResult.then(vr => {
						// Race condition prevention:
						// If the updateId (i.e. this.currentUpdateId at the time of launching the
						// async call) is still the same as the current value of this.currentUpdateId,
						// it means no-one has launched another async call here in the meantime, so
						// the value that was validated here is still the most recent one.
						if (updateId !== this.currentUpdateId) {
							return;
						}

						this.previewValue = undefined;

						this.saveValidatedValue(v, vr);
					});
					// update preliminary value
					// await
					// apply = true?
					//    yes -> continue with below
					//    no -> clear preliminary value
				} else {
					this.saveValidatedValue(v, vResult);
				}
			} else {
				this.saveValidatedValue(v, new ValidationResult());
			}
		}
	}

	private saveValidatedValue(v: P | undefined, vResult: ValidationResult) {
		if (vResult.valid) {
			if (vResult.apply !== false) {
				this.internalValue = v;
			}
			this.transientValidationResults = [];
		} else {
			if (vResult.apply) {
				this.internalValue = v;
				this.transientValidationResults = [];
			} else {
				this.transientValidationResults = [vResult];
			}
		}
	}

	/**
	 * Indicates whether the value can currently be set.
	 * If this method returns `false`, assignments to {@link value} will be ignored.
	 */
	protected canSetValue(): boolean {
		return true;
	}

	/**
	 * Returns a validator to apply to assigned values.
	 */
	protected getValidator(): FieldValidator<TEntity> | undefined {
		return undefined;
	}

	private currentUpdateId = 1;

	private getNextUpdateId(): number {
		this.currentUpdateId++;
		if (this.currentUpdateId > 10000) {
			this.currentUpdateId = 1;
		}
		return this.currentUpdateId;
	}

	/**
	 * A field ID unique within the control context (e.g.a form or a grid row).
	 */
	public abstract get fieldId(): string;

	/**
	 * Indicates whether the control is read-only (which can be the same as disabled, e.g. for buttons).
	 */
	public abstract get readonly(): boolean;

	/**
	 * Retrieves the internal validation results for the field.
	 */
	protected abstract get internalValidationResults(): ValidationResult[];

	private transientValidationResults: ValidationResult[] = [];

	/**
	 * Returns the list of current validation results for the field.
	 */
	public get validationResults(): ValidationResult[] {
		return this.transientValidationResults.concat(this.internalValidationResults);
	}

	/**
	 * Provides context information related to an entity object that is the source for the value.
	 */
	public abstract get entityContext(): IEntityContext<TEntity>;

	public refresh() {
		this.previewValue = undefined;
	}
}
