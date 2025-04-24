/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatRoot,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	ServiceRole,
} from '@libs/platform/data-access';
import { BusinessPartnerStatusEntity, IBusinessPartnerAddressEntity, IBusinessPartnerCreatedEntity, IBusinessPartnerEntity, IBusinessPartnerResponse } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';
import {
	ISearchResult,
	PlatformHttpService,
	PlatformTranslateService, PropertyType,
	ServiceLocator
} from '@libs/platform/common';
import { find, forEach, get, isUndefined, set } from 'lodash';
import { BusinesspartnerMainHeaderValidationService } from './validations/businesspartner-validation.service';
import { BusinesspartnerSharedStatusLookupService } from '@libs/businesspartner/shared';
import { BusinesspartnerCommonNumberGenerationService } from '@libs/businesspartner/common';
import { BusinessPartnerReadonlyProcessorService } from './processors/businesspartner-readonly-processor.service';
import { ReplaySubject } from 'rxjs';

/**
 * Business Partner data service
 */
@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainHeaderDataService extends DataServiceFlatRoot<IBusinessPartnerEntity, BusinessPartnerEntityComplete> {

	private readonly httpService = ServiceLocator.injector.get(PlatformHttpService);
	private readonly translationService = ServiceLocator.injector.get(PlatformTranslateService);
	private readonly numberGenerationService = ServiceLocator.injector.get(BusinesspartnerCommonNumberGenerationService);

	private doesBpDuplicateCheckEmail = 0;
	private readonly gridContainerGuid = '75dcd826c28746bf9b8bbbf80a1168e8';
	private characteristicColumn = '';

	public readonlyProcessor: BusinessPartnerReadonlyProcessorService;
	public allUniqueColumns: string[] = [];
	public statusWithEidtRight: BusinessPartnerStatusEntity[] = [];
	public statusWithEidtRightToSupplier: BusinessPartnerStatusEntity[] = [];
	public statusWithEidtRightToCustomer: BusinessPartnerStatusEntity[] = [];
	public statusWithCreateRight: BusinessPartnerStatusEntity[] = [];
	public statusWithDeleteRight: BusinessPartnerStatusEntity[] = [];
	private rubricCategoryIdNCompanyId2CanCodeGeneratedMap: { [key: string]: boolean } = {}; // key: RubricCategoryFk_CompanyFk, value: can code be generated or not
	public readonly bpCreated$ = new ReplaySubject<IBusinessPartnerEntity>(1);

	public constructor() {
		const options: IDataServiceOptions<IBusinessPartnerEntity> = {
			apiUrl: 'businesspartner/main/businesspartner',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbp',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletebp'
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'updatebp'
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createbp'
			},
			roleInfo: <IDataServiceRoleOptions<IBusinessPartnerEntity>>{
				role: ServiceRole.Root,
				itemName: 'BusinessPartners'
			}
		};
		super(options);

		this.readonlyProcessor = new BusinessPartnerReadonlyProcessorService(this);
		this.processor.addProcessor([this.readonlyProcessor]);

		ServiceLocator.injector.get(BusinesspartnerSharedStatusLookupService).getList();
	}

	public override createUpdateEntity(modified: IBusinessPartnerEntity | null): BusinessPartnerEntityComplete {
		const complete = new BusinessPartnerEntityComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.BusinessPartners = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: BusinessPartnerEntityComplete): IBusinessPartnerEntity[] {
		if (complete.BusinessPartners === null) {
			complete.BusinessPartners = [];
		}

		return complete.BusinessPartners;
	}

	protected override onLoadByFilterSucceeded(loaded: IBusinessPartnerResponse): ISearchResult<IBusinessPartnerEntity> {
		const filterResult = loaded.FilterResult;
		this.allUniqueColumns = loaded.AllUniqueColumns || [];

		if (loaded.BusinessPartnerStatusEditRightToSupplier) {
			this.statusWithEidtRightToSupplier = loaded.BusinessPartnerStatusEditRightToSupplier;
		}
		if (loaded.BusinessPartnerStatusEditRightToCustomer) {
			this.statusWithEidtRightToCustomer = loaded.BusinessPartnerStatusEditRightToCustomer;
		}
		if (loaded.BusinessPartnerStatusEditRight) {
			this.statusWithEidtRight = loaded.BusinessPartnerStatusEditRight;
		}
		if (loaded.BusinessPartnerStatusCreateRight) {
			this.statusWithCreateRight = loaded.BusinessPartnerStatusCreateRight;
		}
		if (loaded.BusinessPartnerStatusDeleteRight) {
			this.statusWithDeleteRight = loaded.BusinessPartnerStatusDeleteRight;
		}

		// todo chi: it is for unique column check. can remove?
		forEach(loaded.Main, (item) => {
			item.ClerkDescriptionFk = item.ClerkFk;
			this.defineValue(item);
			this.defineValueByConfiguration(item);
		});

		// todo chi: do it later. how to do sidebar search?
		// const filterParams = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(searchFilter);
		// cloudDesktopSidebarService.updateFilterResult({
		// 	isPending: false,
		// 	filterRequest: filterParams,
		// 	filterResult: responseData.FilterResult
		// });
		// searchFilter = null;

		// todo chi: need to update lookup to cache? example: lookupService.cache.setItem();
		// basicsLookupdataLookupDescriptorService.attachData(responseData);
		// basicsLookupdataLookupDescriptorService.updateData('businesspartner.evluation', responseData.Main);

		// todo chi: it is for characteristic. how to do?
		// const exist = platformGridAPI.grids.exist(gridContainerGuid);
		// if (exist) {
		// 	const containerInfoService = $injector.get('businesspartnerMainContainerInformationService');
		// 	const characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(container.service, 56, gridContainerGuid, containerInfoService);
		// 	characterColumnService.appendCharacteristicCols(responseData.Main);
		// }

		return {
			dtos: loaded.Main ?? [],
			FilterResult: {
				ExecutionInfo: filterResult?.ExecutionInfo ?? '',
				ResultIds: filterResult?.ResultIds || [],
				RecordsFound: filterResult?.RecordsFound ?? 0,
				RecordsRetrieved: filterResult?.RecordsRetrieved ?? 0
			}
		};
	}

	public override async create(): Promise<IBusinessPartnerEntity> {
		const created = await super.create();
		this.bpCreated$.next(created);
		return created;
	}

	protected override onCreateSucceeded(created: IBusinessPartnerCreatedEntity): IBusinessPartnerEntity {
		this.allUniqueColumns = created.allUniqueColumns;
		const validationService = ServiceLocator.injector.get(BusinesspartnerMainHeaderValidationService); // platformValidationByDataService.getValidationServiceByDataService(this);
		this.allUniqueColumns.forEach((items) => {
			const uniqueColumns = items.split('&');
			uniqueColumns.forEach(async (item) => {
				// const asyncValidateString = 'asyncValidate' + item;
				const validateResult = await validationService.asyncValidationColumnsUnique(created.main, get(created.main, item), item, uniqueColumns);

				if (validateResult.valid && item === 'BusinessPartnerName1') {
					const value = get(created.main, item);
					let tempValue: PropertyType | undefined;
					if (value) {
						tempValue = value as PropertyType; // todo chi: can work?
					} else {
						tempValue = undefined;
					}
					const bpValidateResult = await validationService.validateBusinessPartnerName1({entity: created.main, value: tempValue, field: item});
					if (bpValidateResult.valid) {
						this.removeInvalid(created.main, {
							field: item,
							result: bpValidateResult
						});
					} else {
						this.addInvalid(created.main, {
							field: item,
							result: bpValidateResult
						});
					}
				}
			});
		});

		created.main.Code = this.numberGenerationService.hasToGenerateForRubricCategory(created.main.RubricCategoryFk) ? this.translationService.instant({key: 'cloud.common.isGenerated'}).text : '';
		this.defineValue(created.main);
		this.defineValueByConfiguration(created.main);
		// todo chi: it is for characteristic. how to do it?
		// basicsCommonCharacteristicService.onEntityCreated(container.service, newItem, 2, 56);
		// const exist = platformGridAPI.grids.exist(gridContainerGuid);
		// if (exist) {
		// 	const containerInfoService = $injector.get('businesspartnerMainContainerInformationService');
		// 	const characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(container.service, 56, gridContainerGuid, containerInfoService);
		// 	characterColumnService.appendDefaultCharacteristicCols(newItem);
		// }

		return created.main;
	}

	public getDuplicateCheckEmail() {
		return this.doesBpDuplicateCheckEmail;
	}

	public async getBpDuplicateCheckEmail() {

		const result = await this.httpService.get<number>('basics/common/systemoption/getBpDuplicateCheckEmail');

		if (result) {
			this.doesBpDuplicateCheckEmail = result;
		}
	}

	public async canCodeGenerated(rubricCategoryFk: number, companyFk: number, forceFromApi: boolean = false) {
		const key = rubricCategoryFk.toString() + '_' + companyFk.toString();
		if (!forceFromApi && this.rubricCategoryIdNCompanyId2CanCodeGeneratedMap[key] !== undefined) {
			return this.rubricCategoryIdNCompanyId2CanCodeGeneratedMap[key];
		}

		const result = await this.httpService.get<boolean>('businesspartner/main/businesspartner/checkcodebycompany', {
			params: {
				rubricCategoryFk: rubricCategoryFk,
				companyFk: companyFk,
			},
		});

		this.rubricCategoryIdNCompanyId2CanCodeGeneratedMap[key] = result;
		return result;
	}

	public async setCodeByData(entity: IBusinessPartnerEntity, newRubricCategoryFk: number, newCompanyFk: number) {
		const canCodeGenerated = await this.canCodeGenerated(newRubricCategoryFk, newCompanyFk, true);

		if (entity.Version == 0) {
			if (canCodeGenerated) {
				entity.Code = null;
			} else {
				entity.Code = this.translationService.instant({key: 'cloud.common.isGenerated'}).text;
			}
		}
	}

	public isStatusReadonly(): boolean {
		let readonly = false;
		const status = this.getStatus();
		if (status) {
			readonly = status.IsReadonly;
		}
		return readonly;
	}

	public isStatusEditName(item?: IBusinessPartnerEntity | null): boolean {
		let isEdit = true;
		const status = this.getStatus(item);
		if (status) {
			isEdit = status.EditName;
		}
		return isEdit;
	}

	public isStatusWithEditRight(item: IBusinessPartnerEntity) {
		return this.statusWithEidtRight.find(e => e.Id === item.BusinessPartnerStatusFk);
	}

	private getStatus(item?: IBusinessPartnerEntity | null) {
		let selectedItem = item;
		if (!selectedItem && this.hasSelection()) {
			selectedItem = this.getSelection()[0];
		}
		if (selectedItem) {
			const statusService = ServiceLocator.injector.get(BusinesspartnerSharedStatusLookupService);
			const statusList = statusService.syncService?.getListSync();
			if (statusList?.length) {
				return statusList.find(s => s.Id === selectedItem?.BusinessPartnerStatusFk);
			}
		}
		return null;
	}

	public canEditDunsNo(item: IBusinessPartnerEntity) {
		if (!item) {
			return false;
		}
		const readonlyFields = this.getEntityReadOnlyFields(item);
		const dunsNo = readonlyFields.find(e => e.field === 'DunsNo');
		return dunsNo ? dunsNo.readOnly : true;
	}

	public async getAccessRights() {

		const response = await this.httpService.get<IBusinessPartnerResponse>('businesspartner/main/businesspartner/getkindsstatusrights');
		if (response) {
			this.statusWithEidtRight = response.BusinessPartnerStatusEditRight || [];
			this.statusWithEidtRightToSupplier = response.BusinessPartnerStatusEditRightToSupplier || [];
			this.statusWithEidtRightToCustomer = response.BusinessPartnerStatusEditRightToCustomer || [];
			this.statusWithCreateRight = response.BusinessPartnerStatusCreateRight || []; // clear
			this.statusWithDeleteRight = response.BusinessPartnerStatusDeleteRight || []; // clear
		}
	}

	public getItemStatus(item?: IBusinessPartnerEntity) {
		if (!item) {
			const selection = this.getSelection();
			if (selection && selection.length > 0) {
				item = selection[0];
			} else {
				return null;
			}
		}
		const statuses = ServiceLocator.injector.get(BusinesspartnerSharedStatusLookupService).syncService?.getListSync() || [];
		return statuses.find(status => status.Id === item?.BusinessPartnerStatusFk);
	}

	private defineValue(item: IBusinessPartnerEntity) {
		if (isUndefined(item.BusinessPartnerName1)) {
			item.BusinessPartnerName1 = '';
		}
		if (isUndefined(item.CrefoNo)) {
			item.CrefoNo = null;
		}
		if (isUndefined(item.BedirektNo)) {
			item.BedirektNo = null;
		}
		if (isUndefined(item.DunsNo)) {
			item.DunsNo = null;
		}
		if (isUndefined(item.TradeRegisterNo)) {
			item.TradeRegisterNo = null;
		}
		if (isUndefined(item.TradeRegister)) {
			item.TradeRegister = null;
		}
		if (isUndefined(item.TradeRegisterDate)) {
			item.TradeRegisterDate = null;
		}
	}

	public isBpStatusHasRight(item: IBusinessPartnerEntity, currentStatusField: string) {
		const statuses = ServiceLocator.injector.get(BusinesspartnerSharedStatusLookupService).syncService?.getListSync();
		const status = find(statuses, data => {
			return data.Id === item.BusinessPartnerStatusFk;
		});
		const hasRightStatuses = get(this, currentStatusField, []) as unknown as BusinessPartnerStatusEntity[];
		const statusHasRight = find(hasRightStatuses, data => {
			return data.Id === item.BusinessPartnerStatusFk;
		});

		return !!(status && statusHasRight) && !status.IsReadonly && !statusHasRight.IsReadonly;
	}

	public async getBusinessPartnerAddresses(bpIds: number[]) {
		const resp = await this.httpService.post('businesspartner/main/businesspartner/getbusinesspartneraddresses', bpIds);
		return resp as IBusinessPartnerAddressEntity[];
	}

	public async checkBusinessPartnerIsExists(businessPartners: string[]) {
		return await this.httpService.post<string[] | null>('businesspartner/main/businesspartnermain/checkbusinesspartner', businessPartners);
	}

	private defineValueByConfiguration(entity: IBusinessPartnerEntity) {
		const allUniqueColumns = this.allUniqueColumns;
		if (allUniqueColumns?.length) {
			allUniqueColumns.forEach((items) => {
				const uniqueColumns = items.split('&');
				uniqueColumns.forEach((item) => {
					const value = get(entity, item);
					if (value === undefined) {
						set(entity, item, null);
					}
				});
			});
		}
	}

	// todo chi: upload
	// const uploadOptions = {
	// 	uploadServiceKey: 'business-partner-partner',
	// 	uploadConfigs: {action: 'Import', SectionType: 'Partner'},
	// 	getExtension: getExtension
	// };
	//
	// basicsCommonServiceUploadExtension.extendForCustom(container.service, uploadOptions);

	// todo chi: it seems no use
	// searchFilter executeSearchFilterBase executeSearchFilter

	// todo chi: useless (done)
	// disableItem enableItem

	// todo chi: need? it is use for create bp configuration dialog logic
	// private _allUniqueColumns: string[] | null = null;

	// todo chi: it seems use it in grid/form for UniqueColumns, can it be refactored?
	// allOldUniqueColumns setUniqueColumns originalValidationService

	// todo chi: for inquiry
	// createInquiryResultSet getSelectedItems getResultsSet

	// todo chi: no need to get bp status (done)

	// todo chi: it seems import vcard is done in another way
	// testReadAsync clearFilesByExtension getExtensionByFileName
	// createReader getExtension getVCardInfo getCharSet getVCards

	// todo chi: all readonly set function should
	//  replace by the BusinessPartnerReadonlyProcessorService (done)
	// getCellEditable fillReadonlyModels setReadonly setCodeReadOnly setCodeReadOnlyByData

	// todo chi: use for subsidiary -> bp need to override update function
	// beforeDataUpdate registerBeforeDataUpdate unregisterBeforeDataUpdate

	// todo chi: use for subsidiary -> when delete bp issues,
	//  send message to delete subsidiary issues, too.
	// it is because SubsidiaryDescriptor is a part of BusinessPartnerEntity
	// onDeleteDoneInList clearUpValidationIssues(clean all, it seems this one is enough) (same with doClearValidationIssues(just clean delete one)?) validationIssuesRemove
	// registerValidationIssuesRemove unregisterValidationIssuesRemove

	// todo chi: use for subsidiary -> descriptor / email changed
	// registerDescriptorChanged unregisterDescriptorChanged
	// registerUpdateEmail updateEmail(set it to private)

	// todo chi: use for subsiairy -> clean up / remove validation issues
	// registerValidationIssuesClearUp validationIssuesClearUp unregisterValidationIssuesClearUp
	// registerValidationIssuesRemove unregisterValidationIssuesRemove validationIssuesRemove

	// todo chi: use for contact -> if bp selection changed, disable the filter button in contact
	// filterBranchBtnDisable

	// todo chi: use for garantee / procurement structure / relation -> after bp saved, update garantee
	//  can use framework function to solve?
	// onCallAfterSuccessfulUpdate updateDataTemp
	// updateSuccessedRegister -> can be replace?

	// todo chi: onEntityCreated (done)
	// replace by onCreatedSuccess

	// todo chi: need to public this function?
	// doClearModifications

	// todo chi: replace (done)
	// isEditName -> isStatusEditName

	// todo chi: need? use for characteristic? to update bp status right
	// setDataReadOnly -> need to create businesspartnerStatusRightService first

	// todo chi: for characteristic
	// setCharacteristicColumn getCharacteristicColumn basicsCommonCharacteristicService.unregisterCreateAll

	// todo chi: how to use this in new framework
	// wizardIsActivate

	// todo chi: use for clerk -> how to use?
	// adjustClerkLayout

	// todo chi: navigate -> how to use?
	// registerNavi
}