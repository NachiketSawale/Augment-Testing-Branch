import {
	ContactConditionKeyEnum,
	IBusinessPartnerEntity,
	IContactEntity,
	IContactResponse,
	IDuplicateBusinessPartnerResponse,
	IDuplicateSimpleRequest,
	IDuplicateTelephoneRequest,
	IValidateVatNoOrTaxNoHttpResponse,
	IValidateVatNoOrTaxNoRequest,
} from '@libs/businesspartner/interfaces';
import { PlatformHttpService, PlatformTranslateService, PropertyType, ServiceLocator } from '@libs/platform/common';
import { IBusinessPartnerValidateRequest } from '../../model/requests/businesspartner-validate-request.interface';
import { get, sortBy } from 'lodash';
import { IEntityRuntimeDataRegistry, IEntitySelection, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService, TelephoneEntity } from '@libs/basics/shared';
import { DiscardDuplicateDialogExecutionType, IDiscardDuplicateDialogCustomOptions } from '../../model/discard-duplicate-dialog/discard-duplicate-dialog-data.model';
import { DiscardDuplicateDialogService } from '../discard-duplicate-dialog/discard-duplicate-dialog.service';

export type UpdateRelatedDataHandler = (entity: IBusinessPartnerEntity, value: PropertyType | TelephoneEntity | undefined, model: string, validationResult: ValidationResult) => void;

export class BusinessPartnerHelperService {
	private readonly httpService: PlatformHttpService = ServiceLocator.injector.get(PlatformHttpService);
	private readonly translationService: PlatformTranslateService = ServiceLocator.injector.get(PlatformTranslateService);
	private readonly validationService: BasicsSharedDataValidationService = ServiceLocator.injector.get(BasicsSharedDataValidationService);

	public async asyncValidationColumnsUnique(entity: IBusinessPartnerEntity, value: PropertyType | undefined, field: string, uniqueFields: string[], dataService: IEntityRuntimeDataRegistry<IBusinessPartnerEntity>): Promise<ValidationResult> {
		const httpRoute = 'businesspartner/main/businesspartner/validate';
		const result: ValidationResult = this.validationService.createSuccessObject();
		const postList: IBusinessPartnerValidateRequest[] = [];
		let messages = field;

		uniqueFields.forEach((column) => {
			const postData: IBusinessPartnerValidateRequest = {
				Id: entity.Id,
				Value: column === field ? value : get(entity, field),
				Model: column,
			};

			if (column !== field) {
				messages += ' and ' + column;
			}
			postList.push(postData);
		});

		const errorMessages = this.translationService.instant('businesspartner.main.configUniqueMessage', { fieldName: messages }).text;
		const checkMessages = this.translationService.instant('businesspartner.main.configUniqueMessage', { fieldName: '' }).text;

		const response = await this.httpService.post<boolean>(httpRoute, postList);
		if (dataService.hasValidationErrors()) {
			let hasOtherError = false;
			uniqueFields.forEach((column) => {
				const errors = dataService.getValidationErrors(entity);
				let hasError = false;
				let errorText: string | undefined;
				errors.forEach((error) => {
					if (!hasError && error.field === column && !error.result.valid) {
						hasError = true;
						errorText = error.result.error;
					}
				});
				if (hasError) {
					if (!(errorText?.includes(column) && errorText?.includes(checkMessages))) {
						hasOtherError = true;
					}
				}
			});
			if (hasOtherError) {
				// todo chi: check what is other error, what does it use for?
				return result; // todo chi: right?
			}
		}
		if (!response) {
			result.valid = false;
			result.error = errorMessages;
		} else {
			result.valid = true;
		}
		uniqueFields.forEach((column) => {
			if (result.valid) {
				dataService.removeInvalid(entity, { field: column, result: result });
			} else {
				dataService.addInvalid(entity, { field: column, result: result });
			}
		});
		if (result.valid) {
			dataService.removeInvalid(entity, { field: field, result: result });
		} else {
			dataService.addInvalid(entity, { field: field, result: result });
		}
		return result;
	}

	public async asyncValidationDuplicate(
		entity: IBusinessPartnerEntity,
		value: PropertyType | TelephoneEntity | undefined,
		model: string,
		request: string,
		checkData: IDuplicateTelephoneRequest | IDuplicateSimpleRequest,
		dataService: IEntitySelection<IBusinessPartnerEntity>,
		parentService: IEntitySelection<IBusinessPartnerEntity> | null,
		validationService: object,
		updateRelatedDataFunc: UpdateRelatedDataHandler,
	): Promise<ValidationResult> {
		const validationResult: ValidationResult = this.validationService.createSuccessObject();
		if (!value || value === '') {
			updateRelatedDataFunc(entity, value, model, validationResult);
			return Promise.resolve(validationResult);
		}

		const list = await this.httpService.post<IBusinessPartnerEntity[]>('businesspartner/main/businesspartner/' + request, checkData);

		if (!list || list.length === 0) {
			updateRelatedDataFunc(entity, value, model, validationResult);
			return Promise.resolve(validationResult);
		}

		const oldCurrentItem = parentService ? parentService.getSelectedEntity() : entity;
		if (!oldCurrentItem) {
			return Promise.resolve(validationResult);
		}

		await this.showDiscardDuplicateBusinessPartnerDialog(list, entity, value, model, dataService, parentService, validationService, updateRelatedDataFunc, validationResult, oldCurrentItem);

		return Promise.resolve(validationResult);
	}

	public async asyncValidateVatNoOrTaxNo(
		entity: IBusinessPartnerEntity,
		value: PropertyType | undefined,
		model: string,
		checkData: IValidateVatNoOrTaxNoRequest,
		dataService: IEntitySelection<IBusinessPartnerEntity> & IEntityRuntimeDataRegistry<IBusinessPartnerEntity>,
		validationService: object,
		parentDataService: IEntitySelection<IBusinessPartnerEntity> | null,
	): Promise<ValidationResult> {
		const validationResult = this.validationService.createSuccessObject();

		const result = await this.httpService.post<IValidateVatNoOrTaxNoHttpResponse>('businesspartner/main/businesspartner/validatevatnoortaxno', checkData);

		if (result) {
			if (checkData.IsFromBp && result.checkRegex) {
				if (result.duplicateBPs && result.duplicateBPs.length > 0 && !checkData.IsEu) {
					const oldCurrentItem = parentDataService ? parentDataService.getSelectedEntity() : entity;
					if (!oldCurrentItem) {
						return validationResult;
					}

					// todo chi: why need these properties
					// validationResult.IsBpDuplicate = true;
					// validationResult.duplicateBPs = result.duplicateBPs;

					// showDiscarDuplicateBusinessPartnerDialog will return defer.resolve.
					await this.showDiscardDuplicateBusinessPartnerDialog(result.duplicateBPs, entity, value, model, dataService, parentDataService, validationService, null, validationResult, oldCurrentItem);
					return validationResult;
				}
			}
			if (!result.checkRegex) {
				let errorField: string;
				if (checkData.IsEu) {
					errorField = this.translationService.instant('businesspartner.main.vatNoEu').text;
				} else {
					errorField = checkData.IsVatNoField ? this.translationService.instant('businesspartner.main.vatNo').text : this.translationService.instant('businesspartner.main.taxNo').text;
				}
				validationResult.valid = false;
				validationResult.error = result.validExample
					? this.translationService.instant('businesspartner.main.invalidTaxNoOrVatNoWithExample', {
							field: errorField,
							example: result.validExample,
						}).text
					: this.translationService.instant('businesspartner.main.invalidTaxNoOrVatNo', { field: errorField }).text;
			}
		}

		if (validationResult.valid) {
			dataService.removeInvalid(entity, { field: model, result: validationResult });
		} else {
			dataService.addInvalid(entity, { field: model, result: validationResult });
		}

		return validationResult;
	}

	public async asyncValidateEmail(
		info: ValidationInfo<IBusinessPartnerEntity>,
		checkData: IDuplicateSimpleRequest | null,
		dataService: IEntitySelection<IBusinessPartnerEntity>,
		validationService: object,
		parentDataService: IEntitySelection<IBusinessPartnerEntity> | null,
		checkMode: number,
	): Promise<ValidationResult> {
		const validationResult = {
			apply: true,
			valid: true,
		};
		const entity = info.entity;
		const value = info.value;
		const model = info.field;
		checkData = checkData || ({ MainItemId: entity.Id, Value: value } as IDuplicateSimpleRequest);
		checkData.PageSize = 100;
		checkData.PageIndex = 0;
		if (checkMode === 2) {
			checkData.CheckMode = checkMode;
		}
		const url = 'businesspartner/main/businesspartner/getduplicatebpbyemail';
		const duplicateResult = await this.httpService.post<IDuplicateBusinessPartnerResponse>(url, checkData);
		let bps = null;
		const page = {
			totalLength: 0,
			currentLength: 0,
		};
		if (duplicateResult) {
			if (duplicateResult.Items) {
				bps = duplicateResult.Items;
			}
			page.totalLength = duplicateResult.RecordsFound;
			page.currentLength = duplicateResult.RecordsRetrieved;
		}
		if (bps && bps.length > 0) {
			const customOptions: IDiscardDuplicateDialogCustomOptions = {
				showPage: true,
				url: url,
				checkData: checkData,
				page: page,
			};
			await this.showDiscardDuplicateBusinessPartnerDialog(bps, entity, value, model, dataService, parentDataService, validationService, null, validationResult, entity, customOptions);
			return validationResult;
		}
		return validationResult;
	}

	// todo chi: check whether need to return validation result
	private async showDiscardDuplicateBusinessPartnerDialog(
		list: IBusinessPartnerEntity[],
		entity: IBusinessPartnerEntity,
		value: PropertyType | TelephoneEntity | undefined,
		model: string,
		dataService: IEntitySelection<IBusinessPartnerEntity>,
		parentDataService: IEntitySelection<IBusinessPartnerEntity> | null,
		validationService: object, // todo chi: need ?
		updateRelatedDataFunc: UpdateRelatedDataHandler | null,
		validationResult: ValidationResult,
		oldCurrentItem: IBusinessPartnerEntity,
		customOptions?: IDiscardDuplicateDialogCustomOptions,
	) {
		const discardDuplicateDialogService = new DiscardDuplicateDialogService();
		const result = await discardDuplicateDialogService.showDialog(list, model, oldCurrentItem, customOptions);
		if (!result?.value) {
			return;
		}
		const executionType = result.value.executionType;

		switch (executionType) {
			case DiscardDuplicateDialogExecutionType.discardAndDisplay: {
				//const displayEntities = result.value.displayEntities;
				//discardDuplicateBusinessPartnerDialogDiscardAndDisplay(defer, entity, value, model, dataService, parentDataService, validationService, asyncMarker, validationResult, displayEntities);
				break;
			}
			case DiscardDuplicateDialogExecutionType.ignore: {
				//discardDuplicateBusinessPartnerDialogIgnore(defer, entity, value, model, dataService, validationResult, updateRelatedDataFunc, asyncMarker, validationService);
				break;
			}
		}
	}

	// todo chi: showDuplicateItem discardDuplicateBusinessPartnerDialogIgnore discardDuplicateBusinessPartnerDialogDiscardAndDisplay
	// getDefaultContactByByConditionKey fillReadonlyModels packValidation registerNavigation extendSpecialGrouping
	public async getDefaultContactByBranch(contactConditionKeyEnum: ContactConditionKeyEnum, businessPartnerFk?: number|null, branchFk?: number|null): Promise<IContactEntity | null> {
		if (!businessPartnerFk) {
			return null;
		}
		const postData = { Value: businessPartnerFk, filter: '' };
		const response = await this.httpService.post<IContactResponse>('businesspartner/contact/listbybusinesspartnerid', postData);

		const filterData = response?.Main;
		if (!filterData) {
			return null;
		}
		const branchContacts = branchFk ? filterData.filter((e) => e.SubsidiaryFk === branchFk && e.SubsidiaryFk !== null) : filterData;
		if (branchContacts.length > 0) {
			const fallbackContact = branchContacts[0];
			const defaultContact = branchFk ? this.findDefaultContactByRole(branchFk, branchContacts, contactConditionKeyEnum) || fallbackContact : fallbackContact;
			return defaultContact;
		}
		return null;
	}

	public findDefaultContactByRole(subsidiaryFk: number, contactDtos: IContactEntity[], contactConditionKeyEnum: ContactConditionKeyEnum) {
		let dataContact: IContactEntity | undefined = undefined;
		switch (contactConditionKeyEnum) {
			case ContactConditionKeyEnum.IsProcurement:
				dataContact = this.getDefaultContactByConditionKey(contactDtos, subsidiaryFk, ContactConditionKeyEnum.IsProcurement);
				return dataContact;
			case ContactConditionKeyEnum.IsSales:
				dataContact = this.getDefaultContactByConditionKey(contactDtos, subsidiaryFk, ContactConditionKeyEnum.IsSales);
				return dataContact;
		}
	}

	public getDefaultContactByConditionKey(dataContacts: IContactEntity[], subsidiaryFk: number, contactConditionKeyEnum: ContactConditionKeyEnum) {
		const sortedContacts = sortBy(dataContacts, 'Id');
		let contact: IContactEntity | undefined = undefined;
		if (contactConditionKeyEnum === ContactConditionKeyEnum.IsProcurement) {
			contact = sortedContacts.find((e) => e.ContactRoleEntity && e.ContactRoleEntity.IsProcurement && e.SubsidiaryFk === subsidiaryFk);
			if (!contact) {
				contact = sortedContacts.find((contact) => contact.SubsidiaryFk === subsidiaryFk);
			}
			if (!contact) {
				contact = sortedContacts.find((e) => e.ContactRoleEntity?.IsProcurement);
			}
		}
		return contact;
	}
}
