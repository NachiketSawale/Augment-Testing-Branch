/*
 * Copyright(c) RIB Software GmbH
 */

import { find, forEach, get, isUndefined, set, some } from 'lodash';
import { toDate } from 'date-fns-tz';
import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { IEntityIdentification, PlatformHttpService, PlatformTranslateService, PropertyPath, Translatable } from '@libs/platform/common';
import { IEntityList, IEntityModification, IEntityRuntimeDataRegistry, IValidationService, ValidationInfo, ValidationResult, Validator } from '@libs/platform/data-access';
import { IUniqueValidationOptions } from '../model';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { isNil, isEmpty } from 'lodash';

/**
 * Data validation utilities, replacement for PlatformDataValidationService
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedDataValidationService {
	private http = inject(PlatformHttpService);
	private translate = inject(PlatformTranslateService);
	private messageBoxService = inject(UiCommonMessageBoxService);

	public createErrorObject(error: Translatable): ValidationResult {
		const translated = this.translate.instant(error);
		const result = new ValidationResult(translated.text);
		// in case of error, apply the result by default, so the error will be shown with error value, it is common behavior of angularjs
		// if you want to disable applying the result, you can set apply to false outside in the validation function individually
		result.apply = true;
		return result;
	}

	public createSuccessObject(): ValidationResult {
		const result = new ValidationResult();
		result.apply = true;
		return result;
	}

	public isEmptyFk(value: number | null | undefined) {
		// -1 is a special value for empty foreign key
		return value == null || value === -1 || value === 0;
	}

	/**
	 * Is foreign key mandatory
	 * @param info
	 * @param fieldName
	 */
	public isFkMandatory<T>(info: ValidationInfo<T>, fieldName?: Translatable): ValidationResult {
		if (this.isEmptyFk(info.value as number)) {
			return this.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: {fieldName: fieldName ? this.translate.instant(fieldName).text : info.field.toLowerCase()},
			});
		}

		return this.createSuccessObject();
	}

	public isEmptyProp(value: unknown) {
		return isUndefined(value) || value === null || value === '';
	}

	/**
	 * Is model mandatory
	 * @param info
	 * @param fieldName
	 */
	public isMandatory<T>(info: ValidationInfo<T>, fieldName?: Translatable): ValidationResult {
		if (this.isEmptyProp(info.value)) {
			return this.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: { fieldName: fieldName ? this.translate.instant(fieldName).text : info.field.toLowerCase() },
			});
		}

		return this.createSuccessObject();
	}

	/**
	 * Is unique and mandatory
	 * @param info
	 * @param itemList
	 * @param fieldName
	 */
	public isUniqueAndMandatory<T extends IEntityIdentification>(info: ValidationInfo<T>, itemList: T[], fieldName?: Translatable): ValidationResult {
		const result = this.isMandatory(info, fieldName);

		if (!result.valid) {
			return result;
		}

		return this.isValueUnique(info, itemList, fieldName);
	}

	/**
	 * Is unique in frontend
	 * @param info
	 * @param itemList
	 * @param fieldName
	 */
	public isValueUnique<T extends IEntityIdentification>(info: ValidationInfo<T>, itemList: T[], fieldName?: Translatable): ValidationResult {
		const item = find(itemList, (item) => {
			return get(item, info.field) === info.value && item !== info.entity;
		});

		if (item) {
			return this.createErrorObject({
				key: 'cloud.common.uniqueValueErrorMessage',
				params: { object: fieldName ? this.translate.instant(fieldName).text : info.field.toLowerCase() },
			});
		}

		return this.createSuccessObject();
	}

	/**
	 * Is unique in frontend and backend
	 * @param info
	 * @param itemList
	 * @param httpRoute
	 * @param fieldName
	 */
	public async isSynAndAsyncUnique<T extends IEntityIdentification>(info: ValidationInfo<T>, itemList: T[], httpRoute: string, fieldName?: Translatable): Promise<ValidationResult> {
		const result = this.isUniqueAndMandatory(info, itemList, fieldName);

		if (!result.valid) {
			return result;
		}

		return this.isAsyncUnique(info, httpRoute, fieldName);
	}

	/**
	 * Improved isSynAndAsyncUnique
	 * @param info
	 * @param itemList
	 * @param httpRoute
	 * @param options
	 */
	public async checkSynAndAsyncUnique<T extends IEntityIdentification>(info: ValidationInfo<T>, itemList: T[], httpRoute: string, options?: IUniqueValidationOptions): Promise<ValidationResult> {
		const result = this.isUniqueAndMandatory(info, itemList, options?.fieldName);

		if (!result.valid) {
			return result;
		}

		return this.isAsyncUnique(info, httpRoute, options?.fieldName);
	}

	/**
	 * Improved isAsyncUnique
	 * @param info
	 * @param httpRoute
	 * @param options
	 */
	public async checkAsyncUnique<T extends IEntityIdentification>(info: ValidationInfo<T>, httpRoute: string, options?: IUniqueValidationOptions) {
		const id = info.entity.Id || 0;
		const params: HttpParams = new HttpParams();
		const additionalHttpParams = options?.additionalHttpParams;
		const fieldName = options?.fieldName;

		params.set('id', id);
		params.set(info.field, info.value as string);

		if (additionalHttpParams) {
			Object.keys(additionalHttpParams).forEach((key) => {
				if (additionalHttpParams[key] != null) {
					params.set(key, additionalHttpParams[key] as string | number | boolean);
				}
			});
		}

		const unique = await this.http.get(httpRoute, {
				params: params,
			});

		if (!unique) {
			return this.createErrorObject({
				key: 'cloud.common.uniqueValueErrorMessage',
				params: { object: fieldName ? this.translate.instant(fieldName).text : info.field.toLowerCase() },
			});
		}

		return this.createSuccessObject();
	}

	/**
	 * Is unique in backend
	 * @param info
	 * @param httpRoute
	 * @param fieldName
	 */
	public async isAsyncUnique<T extends IEntityIdentification>(info: ValidationInfo<T>, httpRoute: string, fieldName?: Translatable) {
		return this.checkAsyncUnique(info, httpRoute, {
			fieldName: fieldName,
		});
	}

	/**
	 * Validate date period
	 * @param runtime
	 * @param info
	 * @param startDate
	 * @param endDate
	 * @param relField
	 */
	public validatePeriod<T extends IEntityIdentification>(runtime: IEntityRuntimeDataRegistry<T>, info: ValidationInfo<T>, startDate: Date | string | number | undefined | null, endDate: Date | string | number | undefined | null, relField: PropertyPath<T>) {
		if (startDate && endDate) {
			if (toDate(endDate) < toDate(startDate)) {
				return this.createErrorObject({
					key: 'cloud.common.Error_EndDateTooEarlier',
				});
			}
		}

		this.ensureNoRelatedError(runtime, info, [relField]);

		return new ValidationResult();
	}

	private ensureNoRelatedError<T extends IEntityIdentification>(runtime: IEntityRuntimeDataRegistry<T>, info: ValidationInfo<T>, relFields: PropertyPath<T>[]) {
		relFields.forEach((relField) => {
			runtime.removeInvalid(info.entity, {
				field: relField,
				result: new ValidationResult(),
			});
		});
	}

	/**
	 * Is value unique in client end
	 * @param runtime
	 * @param info
	 * @param itemList
	 * @param allowNull
	 */
	public isUnique<T extends IEntityIdentification>(runtime: IEntityRuntimeDataRegistry<T>, info: ValidationInfo<T>, itemList: T[], allowNull?: boolean): ValidationResult {
		// TODO may be  should check in domainService
		if (!allowNull && !info.value) {
			return this.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: { fieldName: info.field.toLowerCase() },
			});
		}
		if (allowNull && !info.value) {
			return this.createSuccessObject();
		}

		if (
			some(itemList, (item) => {
				return get(item, info.field) === info.value && item !== info.entity;
			})
		) {
			return this.createErrorObject({
				key: 'cloud.common.uniqueValueErrorMessage',
				params: { object: info.field.toLowerCase() },
			});
		} else {
			// update other item
			const oldValue = get(find(itemList, { Id: info.entity.Id }), info.field);
			const filter = (item: T) => {
				return oldValue && oldValue === get(item, info.field);
			};
			forEach(itemList.filter(filter), (item) => {
				runtime.removeInvalid(item, {
					field: info.field,
					result: new ValidationResult(),
				});
			});
			return { apply: true, valid: true, error: '' };
		}
	}

	/**
	 * Checks if an entity in a given list is unique based on a specified group object.
	 *
	 * @param info - Validation information containing the entity being validated.
	 * @param itemList - The list of entities to check for uniqueness.
	 * @param groupObject - The group object with properties and values to match against the entities.
	 * @param error - Translatable error message in case the entity is not unique.
	 *
	 * @returns validation result object indicating success or failure.
	 */
	public isGroupUnique<T extends IEntityIdentification>(info: ValidationInfo<T>, itemList: T[], groupObject: Partial<T>, error: Translatable): ValidationResult {
		if (itemList.length <= 1) {
			return this.createSuccessObject();
		}
		const candidates = itemList.filter((item) => {
			return Object.entries(groupObject).every(([prop, value]) => {
				return prop in item && item[prop as keyof T] === value;
			});
		});
		const found = candidates.filter((candidate) => candidate.Id !== info.entity.Id);

		if (found.length >= 1) {
			return this.createErrorObject(error);
		}
		return this.createSuccessObject();
	}

	/**
	 * Asynchronously checks if a group of properties defined by the groupObject is unique for a given entity.
	 * This function constructs a URL based on the provided httpRoute and groupObject to query a remote API.
	 *
	 * @param info - Validation information including the entity to be checked for uniqueness.
	 * @param httpRoute - The API route to which the uniqueness request should be sent.
	 * @param groupObject - An object containing the properties and values to be checked for uniqueness.
	 *  @param error - Translatable error message in case the entity is not unique.
	 *
	 * @returns A Promise that resolves to a validation result object indicating success or failure.
	 */
	public async isAsyncGroupUnique<T extends IEntityIdentification>(info: ValidationInfo<T>, httpRoute: string, groupObject: Partial<T>, error: Translatable) {
		const params: HttpParams = new HttpParams();

		params.set('id', info.entity.Id || 0);
		Object.entries(groupObject).forEach(([prop, value]) => {
			params.set(prop, value);
		});

		const unique = await this.http.get(httpRoute, {
				params: params,
			});

		if (!unique) {
			return this.createErrorObject(error);
		}

		return this.createSuccessObject();
	}

	/**
	 * If there is another entity with the same default value and a different ID,
	 * the default status of the current entity will be changed to false.
	 * @param info - An object containing validation information, including the entity value (value) and the entity instance (entity)
	 * @param dataService - An interface that combines EntityModification and EntityList functionalities, providing methods to fetch the list (getList) and modify entities (setModified)
	 * @param extraFields - An optional Partial<T> object that allows filtering the entity list based on specific fields. If provided, only these fields will be considered in the check.
	 * If not provided or empty, the entire list is used.
	 * @returns - A ValidationResult object indicating success or failure of the operation, with a success object in case of validation success
	 */
	public validateIsDefault<T extends IEntityIdentification>(info: ValidationInfo<T>, dataService: IEntityModification<T> & IEntityList<T>, extraFields?: Partial<T>): ValidationResult {
		if (info.value === true) {
			let filteredItems = dataService.getList();
			if (extraFields) {
				filteredItems = dataService.getList().filter((item) => {
					return Object.entries(extraFields).every(([prop, value]) => get(item, prop) === value);
				});
			}
			const existItem = find(filteredItems, (item) => item.Id !== info.entity.Id && get(item, 'IsDefault') === true);
			if (existItem) {
				set(existItem, 'IsDefault', false);
				dataService.setModified(existItem);
			}
		}
		return this.createSuccessObject();
	}

	/**
	 * Apply validation result to runtime
	 * @param runtime
	 * @param entityFieldResult
	 */
	public applyValidationResult<T extends object>(
		runtime: IEntityRuntimeDataRegistry<T>,
		entityFieldResult: {
			entity: T;
			field: string;
			result: ValidationResult;
		},
	) {
		if (entityFieldResult.result.valid) {
			runtime.removeInvalid(entityFieldResult.entity, { result: entityFieldResult.result, field: entityFieldResult.field });
		} else {
			runtime.addInvalid(entityFieldResult.entity, { result: entityFieldResult.result, field: entityFieldResult.field });
		}
	}

	/**
	 * Execute the validator and apply the result
	 * @param service
	 * @param runtime
	 * @param validator
	 * @param info
	 */
	public executeValidator<T extends object>(service: IValidationService<T>, runtime: IEntityRuntimeDataRegistry<T>, validator: Validator<T>, info: ValidationInfo<T>) {
		const result = validator.call(service, info) as ValidationResult;
		this.applyValidationResult(runtime, {
			entity: info.entity,
			field: info.field,
			result: result,
		});
	}

	/**
	 * Execute the validator and apply the result in async mode
	 * @param service
	 * @param runtime
	 * @param validator
	 * @param info
	 */
	public async executeValidatorAsync<T extends object>(service: IValidationService<T>, runtime: IEntityRuntimeDataRegistry<T>, validator: Validator<T>, info: ValidationInfo<T>) {
		const result = (await validator.call(service, info)) as ValidationResult;
		this.applyValidationResult(runtime, {
			entity: info.entity,
			field: info.field,
			result: result,
		});
	}

	/**
	 * Asynchronously validates an entity by asking the user for confirmation before proceeding with the validation.
	 * Displays a Yes/No dialog with the provided message and title.
	 * If the user selects "Yes", the validation proceeds and returns a success result.
	 * If the user selects "No", the validation is not applied. The returned result with apply = false
	 *
	 * @param info - Validation information containing the entity being validated.
	 * @param message - The message to display in the confirmation dialog.
	 * @param title - The title of the confirmation dialog.
	 * @returns A Promise that resolves to a ValidationResult object indicating whether the validation should be applied.
	 */
	public async asyncValidateAskBeforeValidating<T extends object>(info: ValidationInfo<T>, message: Translatable, title: Translatable) {
		const dialogResult = await this.messageBoxService.showYesNoDialog(this.translate.instant(message).text, this.translate.instant(title).text);
		const validateResult = this.createSuccessObject();
		if (dialogResult?.closingButtonId !== StandardDialogButtonId.Yes){
			validateResult.apply = false;
		}
		return validateResult;
	}

	public validateUrl<T extends object>(info: ValidationInfo<T>) {
		let reg;
		const value = info.value ? info.value as string : undefined;
		if (value) {
			if (['http', 'https', 'ftp', 'ftps', 'file', 'www.'].some((word) => value.startsWith(word))) {
				if (value.startsWith('www.')) {
					reg = new RegExp('^(https?://)?[\\w-]+(\\.[\\w-]+)+(:\\d+)?(/\\S*)?$', 'i');
				} else {
					reg = new RegExp('^((http[s]?|ftp[s]?|file):\\/\\/)?[\\w-]+(\\.[\\w-]+)+(:\\d+)?(/\\S*)?$', 'i');
				}
			} else {
				if (value.startsWith('\\')) {
					reg = new RegExp('^\\\\[\\w-]+(\\\\[\\w-]+)*$', 'i');
				} else {
					if (value.length < 50) {
						reg = new RegExp('^[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$');
					}
				}
			}
		}

		const result = this.createSuccessObject();
		result.valid = (isNil(value) || isEmpty(value) || (reg && reg.test(value))) ?? true;
		if (!result.valid) {
			result.error = this.translate.instant('platform.errorMessage.url').text;
		}
		return result;
	}
}
