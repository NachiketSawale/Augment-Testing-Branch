/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IValidationService } from './validation-service.interface';
import { IValidationFunctions } from './validation-functions.interface';
import { Validator } from './validator.type';
import { ValidationResult } from './validation-result.class';
import { PendingAsyncValidationService } from './pending-async-validation.service';
import { inject } from '@angular/core';
import { ValidationInfo } from './validation-info.class';
import { IEntityRuntimeDataRegistry } from '../data-service/interface/entity-runtime-data-registry.interface';
import { CollectionHelper, PropertyPath } from '@libs/platform/common';
import { Dictionary, isNil } from 'lodash';


export abstract class BaseValidationService<T extends object> implements IValidationService<T> {

	protected abstract generateValidationFunctions(): IValidationFunctions<T>;

	protected abstract getEntityRuntimeData(): IEntityRuntimeDataRegistry<T>;

	protected noErrorResult = new ValidationResult();

	private functions?: IValidationFunctions<T>;

	private pendingValidationService: PendingAsyncValidationService = inject(PendingAsyncValidationService);

	protected getMissingTimeSpanInfo?: (info: ValidationInfo<T>) => ValidationInfo<T> | undefined;

	protected getLoadedEntitiesForUniqueComparison?: (info: ValidationInfo<T>) => T[];

	/**
	 * returns a validation function for a given field, this can function can have several functions wrapped
	 * @param fieldName
	 */
	public getValidationFunc(fieldName: string): Validator<T> {
		if (!this.functions) {
			this.functions = this.generateValidationFunctions();
		}

		let validatorFuncs = this.functions[fieldName];
		if (!validatorFuncs) {
			return () => new ValidationResult();
		}
		if (Array.isArray(validatorFuncs)) {
			const multiFuncs = validatorFuncs;
			validatorFuncs = async info => {
				let issue: ValidationResult | undefined;
				for (const validator of multiFuncs) {
					const boundFunc = validator.bind(this);
					const result = boundFunc(info);
					try {
						//TODO: Check if type of res2 is Promise with help of promise interface(i.e. existence of then function)
						const res2 = result as Promise<ValidationResult>;
						if (res2 !== null) {
							this.pendingValidationService.register(res2);
						}
					} catch (e) {
						// It's not a problem that the try block fails, because we do allow the validation result being returned.
					}
					issue = await result;
					if (issue && !issue.valid) {
						this.getEntityRuntimeData().addInvalid(info.entity, { result: issue, field: fieldName as PropertyPath<T> });
						return issue;
					}
				}
				if(issue){
					this.getEntityRuntimeData().removeInvalid(info.entity, { result: issue, field: fieldName as PropertyPath<T> });
				}
				return this.noErrorResult;
			};
		} else {
			const singleFunc = validatorFuncs.bind(this);
			validatorFuncs = async info => {
				const res = singleFunc(info);
				try {
					const res2 = res as Promise<ValidationResult>;
					if (res2 !== null) {
						this.pendingValidationService.register(res2);
					}
				} catch (e) {
					// It's not a problem that the try block fails, because we do allow the validation result being returned.
				}

				const issue = await res;
				if (issue && !issue.valid) {
					this.getEntityRuntimeData().addInvalid(info.entity, { result: issue, field: fieldName as PropertyPath<T> });
				} else {
					this.getEntityRuntimeData().removeInvalid(info.entity, { result: issue, field: fieldName as PropertyPath<T> });
				}

				return res;
			};
		}
		return validatorFuncs;
	}

	public validateIsMandatory(info: ValidationInfo<T>): ValidationResult {
		if (info.value) {
			return this.noErrorResult;
		}

		return new ValidationResult('cloud.common.emptyOrNullValueErrorMessage');
	}

	public validateIsUnique(info: ValidationInfo<T>): ValidationResult {
		if(this.getLoadedEntitiesForUniqueComparison === undefined) {
			throw new Error('Method getLoadedEntitesForUniqueComparison must be overwritten in case of dealing with uniqueness constraints');
		}

		const otherEntities = this.getLoadedEntitiesForUniqueComparison(info);
		if(otherEntities.length === 0) {
			return this.noErrorResult;
		}

		return this.noErrorResult;
	}

	public validateIsValidTimeSpanFrom(info: ValidationInfo<T>): ValidationResult {
		if(this.getMissingTimeSpanInfo === undefined) {
			throw new Error('Method getMissingTimeSpanInfo must be overwritten in case of dealing with time spans');
		}

		const endInfo = this.getMissingTimeSpanInfo(info);
		if(endInfo === undefined) {
			throw new Error('Method getMissingTimeSpanInfo must return a corresponding time span');
		}

		return this.validateIsValidTimeSpan(info, endInfo);
	}

	public validateIsValidTimeSpanTo(info: ValidationInfo<T>): ValidationResult {
		if(this.getMissingTimeSpanInfo === undefined) {
			throw new Error('Method getMissingTimeSpanInfo must be overwritten in case of dealing with time spans');
		}

		const fromInfo = this.getMissingTimeSpanInfo(info);
		if(fromInfo === undefined) {
			throw new Error('Method getMissingTimeSpanInfo must return a corresponding time span');
		}

		return this.validateIsValidTimeSpan(fromInfo, info);
	}

	/**
	 * Validate date period
	 * @param from
	 * @param to
	 */
	protected validateIsValidTimeSpan(from: ValidationInfo<T>, to: ValidationInfo<T>): ValidationResult {
		const fromValue = from.value as string;
		const toValue = to.value as string;

		if (!fromValue || !toValue || Date.parse(fromValue) <= Date.parse(toValue)) {
			const runtime = this.getEntityRuntimeData();
			this.ensureNoRelatedError(runtime, from, [from.field]);
			this.ensureNoRelatedError(runtime, to, [to.field]);
			return this.noErrorResult;
		}

		const res = new ValidationResult('cloud.common.Error_EndDateTooEarlier');
		this.getEntityRuntimeData().addInvalid(from.entity, {
			field: from.field as PropertyPath<T>,
			result: res
		});
		return res;
	}

	public ensureNoRelatedError(runtime: IEntityRuntimeDataRegistry<T>, info: ValidationInfo<T>, relFields: PropertyPath<T>[]) {
		relFields.forEach(relField => {
			runtime.removeInvalid(info.entity, {
				field: relField,
				result: new ValidationResult()
			});
		});
	}
	protected getValidators(validators: Dictionary<() => Validator<T> | Validator<T>[] | undefined> | null){
		return !isNil(validators) ? Object.fromEntries(
			Object.entries(validators as Dictionary<() => Validator<T> | Validator<T>[] | undefined>).map(([key,value]) => [key, value()] )
		) : {};
	}
	protected mergeValidators(
		containersSuperValidators: IValidationFunctions<T> | null,
		fieldsSuperValidatorsSelector : (v : IValidationFunctions<T>) => Validator<T> | Validator<T>[] | undefined,
		ownValidators : Validator<T> | Validator<T>[]
	) : Validator<T>[]{
		const fieldsSuperValidators = !isNil(containersSuperValidators) ?
			fieldsSuperValidatorsSelector(containersSuperValidators) :
			null;
		return [
			...CollectionHelper.AsArray(fieldsSuperValidators),
			...CollectionHelper.AsArray(ownValidators)
		];
	}
	/**
	 * Execute for a given field (info.field) all its validators
	 * @param info
	 */
	protected executeFieldValidation(info: ValidationInfo<T>): Promise<ValidationResult> | ValidationResult {
		return this.getValidationFunc(info.field)(info);
	}
}