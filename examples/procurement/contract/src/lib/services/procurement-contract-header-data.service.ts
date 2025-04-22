/*
 * Copyright(c) RIB Software GmbH
 */
import { firstValueFrom, ReplaySubject, Subject } from 'rxjs';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceRoleOptions, IReadOnlyField, ServiceRole } from '@libs/platform/data-access';
import { IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import {
	IPrcCommonReadonlyService,
	IBasisContractChangeEvent,
	IExchangeRateChangedEvent,
	IFrameworkCatalogChangeEvent,
	IPaymentTermChangedEvent,
	IPrcHeaderContext,
	IPrcHeaderDataService,
	IPrcModuleValidatorService,
	ProcurementOverviewSearchlevel,
	ProcurementCommonCascadeDeleteConfirmService,
	IPrcCommonMainDataService,
	IModifyExchangeRate, IContractCreateCompleteResponse,
	ProcurementContractPurchaseOrderTypeService
} from '@libs/procurement/common';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';
import { IConHeaderEntity } from '../model/entities';
import { ProcurementCreateContractDialogService } from './procurement-create-contract-dialog.service';
import { EntityProxy, FieldKind, ProcurementInternalModule } from '@libs/procurement/shared';
import { IExceptionResponse, ISearchResult, PlatformConfigurationService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { get, union } from 'lodash';
import { BasicsSharedCompanyContextService, BasicsSharedConStatusLookupService, BasicsSharedNumberGenerationService, BasicsSharedTreeDataHelperService, RubricIndexEnum } from '@libs/basics/shared';
import { ProcurementContractHeaderProcessorService } from './processors/procurement-contract-header-processor.service';
import { IYesNoDialogOptions, StandardDialogButtonId, UiCommonGridDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementContractHeaderReadonlyProcessor } from './processors/procurement-contract-header-readonly-processor.class';
import { HttpClient } from '@angular/common/http';
import { ProcurementContractCallOffsDataService } from './procurement-contract-call-offs-data.service';
import { ProcurementContractOverallDiscountService } from './procurement-contract-overall-discount.service';
import { IBasicsCustomizeConStatusEntity } from '@libs/basics/interfaces';
import { ContractComplete } from '../model/contract-complete.class';

export const PROCUREMENT_CONTRACTHEADER_DATA_TOKEN = new InjectionToken<ProcurementContractHeaderDataService>('procurementContractDataToken');

/**
 * Contract data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractHeaderDataService
	extends DataServiceHierarchicalRoot<IConHeaderEntity, ContractComplete>
	implements
		IPrcHeaderDataService<IConHeaderEntity, ContractComplete>,
		IPrcModuleValidatorService<IConHeaderEntity, ContractComplete>,
		IPrcCommonReadonlyService<IConHeaderEntity>,
		IModifyExchangeRate<IConHeaderEntity>,
		IPrcCommonMainDataService<IConHeaderEntity, ContractComplete> {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);

	public readonly readonlyProcessor: ProcurementContractHeaderReadonlyProcessor;
	protected rootDataCreated$ = new ReplaySubject<IContractCreateCompleteResponse>(1);
	protected readonly companyContext = inject(BasicsSharedCompanyContextService);
	protected readonly numberGenerationService = inject(BasicsSharedNumberGenerationService);

	/**
	 * Dialog form config service.
	 */
	private createDialogService = inject(ProcurementCreateContractDialogService);
	public conStatusLookupService = inject(BasicsSharedConStatusLookupService);

	protected treeHelper = inject(BasicsSharedTreeDataHelperService);

	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);

	public readonly entityProxy = new EntityProxy(this, [
		['MaterialCatalogFk', FieldKind.MdcMaterialCatalogFk],
		['TaxCodeFk', FieldKind.MdcTaxCodeFk],
	]);

	public readonly paymentTermChanged$ = new Subject<IPaymentTermChangedEvent>();
	public readonly exchangeRateChanged$ = new Subject<IExchangeRateChangedEvent>();
	public readonly readonlyChanged$ = new Subject<boolean>();

	public readonly changeStructureSetTaxCodeToItemBoq$ = new Subject<null>();
	public readonly frameworkMdcCatalogChanged$ = new Subject<IFrameworkCatalogChangeEvent>();
	public readonly purchaseUpdatedMessage$ = new Subject<IConHeaderEntity>();
	public readonly projectFkChanged$ = new Subject<number>();
	public readonly controllingUnitChanged$ = new Subject<number>();
	public readonly basisChanged$ = new Subject<IBasisContractChangeEvent>();
	public readonly billingSchemaChanged$ = new Subject<number>();
	public readonly controllingUnitToItemBoq$ = new Subject<number>();
	public readonly onHeaderUpdated$ = new Subject<ContractComplete>();

	public readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly cascadeDeleteHelperService = inject(ProcurementCommonCascadeDeleteConfirmService);

	/**
	 * The constructor
	 */
	public constructor() {
		const options: IDataServiceOptions<IConHeaderEntity> = {
			apiUrl: 'procurement/contract/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listcontract',
				usePost: true,
			},
			createInfo: {
				endPoint: 'createcontract',
				usePost: true,
				// todo - creation dialog
				// preparePopupDialogData:() =>{
				// 	return  this.createDialogService.openCreateDialogForm();
				// }
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'updatecontract',
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletecontracts',
			},
			roleInfo: <IDataServiceRoleOptions<IConHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'ConHeader',
			},
		};

		super(options);

		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor([new ProcurementContractHeaderProcessorService(this), this.readonlyProcessor]);

		this.init();
	}

	private init() {
		this.selectionChanged$.subscribe((e) => {
			this.onSelectionChanged();
		});
	}

	private onSelectionChanged() {
		const currentItem = this.getSelectedEntity();
		if (!currentItem) {
			return;
		}

		if (currentItem.Id) {
			//todo:task(DEV-13988) wait the boqMainLookupFilterService ready in 'boq.main' module, not sure the boq still need this solution
			//service.maintainBoqMainLookupFilter(currentItem);
		}
		//todo: wait framework 'header-information-service.js' ready
		//procurementCommonOverrideHeaderInfoService.updateModuleHeaderInfo(service,'cloud.desktop.moduleDisplayNameContract');
	}

	protected createReadonlyProcessor() {
		return new ProcurementContractHeaderReadonlyProcessor(this);
	}

	/**
	 * Provide the load payload here
	 * @protected
	 */
	protected override provideLoadPayload(): object {
		return {};
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IConHeaderEntity> {
		// todo - use the general FilterResult interface?
		const fr = get(loaded, 'FilterResult')! as {
			ExecutionInfo: string;
			RecordsFound: number;
			RecordsRetrieved: number;
			ResultIds: number[];
		};

		let dtos = get(loaded, 'Main')! as IConHeaderEntity[];

		dtos = this.treeHelper.flatTreeArray(dtos, (e) => e.ChildItems);
		//todo: wait the dynamic Characteristic service ready
		// var exist = platformGridAPI.grids.exist('e5b91a61dbdd4276b3d92ddc84470162');
		// if (exist) {
		// 	var characterColumnService = service.characterColumnService();
		// 	var allList=getContractList(readData.dtos);
		// 	characterColumnService.appendCharacteristicCols(allList);
		// }

		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds,
			},
			dtos: dtos,
		};
	}

	protected override provideCreatePayload(): object {
		//TODO should get the create parameter from create dialog
		return {
			Code: 'new contract',
			ProjectFk: 1015293,
			ConfigurationFk: 11,
			BusinessPartnerFk: 1002150,
			SubsidiaryFk: 1000088,
		};
	}

	public override canDelete(): boolean {
		if (!super.canDelete() || !this.getSelectedEntity()) {
			return false;
		}

		const status = this.getStatus();
		return !status || !status.IsReadOnly;
	}

	/**
	 * equal to updateDone
	 * @param updated
	 */
	public override takeOverUpdatedChildEntities(updated: ContractComplete): void {
		super.takeOverUpdatedChildEntities(updated);
		//todo: wait the contract change container ready
		//updateChange(updateData);

		const currentItem = this.flatList().find((candidate) => candidate.Id === updated.MainItemId);
		if (currentItem) {
			// set basis contract as readOnly when it has items
			if (updated.ConHeader && updated.ConHeader.Id === currentItem.Id) {
				updated.ConHeader.HasItems = currentItem.HasItems;
			}
			this.readonlyProcessor.process(currentItem);
			//todo: lvy, task(DEV-13988)  relate to boq, the boq module
			//service.maintainBoqMainLookupFilter(currentItem);

			// for ALM(#92196),if user overwrites line no to a line no already used in the basis contract or a previous change order
			// then MDC_MATERIAL_FK, PRC_STRUCTURE_FK, DESCRIPTION1, DESCRIPTION2, BAS_UOM_FK must be taken from the previous line and set to read only10
			const selectedContract = this.getSelectedEntity();
			if (selectedContract) {
				const conHeaderFk = selectedContract.ContractHeaderFk;
				if (conHeaderFk) {
					//not sure this logic, if  the prcItem change will impact the contract header? so need to get the latest contract header?
					if (updated.PrcItemToSave || updated.PrcItemToDelete) {
						this.getHeaderContract();
					}
				}
			}
			if (selectedContract && currentItem.Id !== selectedContract.Id) {
				//todo: lvy, task(DEV-13988)  relate to boq, the boq module
				//service.maintainBoqMainLookupFilter(selectItem);
			} else {
				//service.maintainBoqMainLookupFilter(currentItem);
			}
		}
		//the sub container can subscribe this event: reload prcItems, update prcItem readonly, SubContractor container and so on.
		this.onHeaderUpdated$.next(updated);
	}

	protected override onCreateSucceeded(created: object): IConHeaderEntity {
		const resp = created as IContractCreateCompleteResponse;
		//the total service will subscribe rootDataCreated$ to set the new PrcTotalsDtos to  container
		this.rootDataCreated$.next(resp);
		//todo:  wait the dynamic Characteristic service ready
		// var exist = platformGridAPI.grids.exist('e5b91a61dbdd4276b3d92ddc84470162');
		// if (exist) {
		// 	var characterColumnService = service.characterColumnService();
		// 	var allList=getContractList(readData.dtos);
		// 	characterColumnService.appendCharacteristicCols(allList);
		// }
		const createdContract = resp.ConHeaderDto;
		//todo:t ask(DEV-14015) wait header text container ready
		// $timeout(function () {
		// 	reloadHeaderText(conHeaderCreated);
		// }, 500);

		if (createdContract) {
			this.setEntityReadOnlyFields(createdContract, this.getReadOnlyFields(createdContract));
			if (this.shouldGenerateNumber(createdContract)) {
				createdContract.Code = this.getNumberDefaultText(createdContract);
			}
		}

		return createdContract!;
	}

	public override createUpdateEntity(modified: IConHeaderEntity | null): ContractComplete {
		const complete = new ContractComplete();
		if (modified === null && this.hasSelection()) {
			const selected = this.getSelection()[0];
			//TODO: workaround to set the new created entity as modified, will remove in future, need framework support.
			if (selected && selected.Version === 0) {
				if (selected.BusinessPartnerFk === 0) {
					selected.BusinessPartnerFk = 1004548;
				}
				if (selected.SupplierFk === 0) {
					selected.SupplierFk = undefined;
				}
				if (selected.SubsidiaryFk === 0) {
					selected.SubsidiaryFk = undefined;
				}
				if (selected.ContactFk === 0) {
					selected.ContactFk = undefined;
				}
				modified = selected;
			}
		}
		if (modified !== null) {
			complete.ConHeader = modified;

			//TODO: workaround now cause framework can't support.
			complete.ConHeaders = [modified];
		}

		if (this.hasSelection()) {
			complete.MainItemId = this.getSelection()[0].Id;
		}

		return complete;
	}

	public override async delete(entities: IConHeaderEntity[] | IConHeaderEntity) {
		const selectedItem = this.getSelectedEntity();
		if (!selectedItem) {
			throw new Error('Please select a record first');
		}
		const result = await this.cascadeDeleteHelperService.openDialog({
			filter: '',
			mainItemId: selectedItem.Id,
			moduleIdentifier: ProcurementInternalModule.Contract,
			searchLevel: ProcurementOverviewSearchlevel.RootContainer,
		});
		if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
			try {
				await super.delete(entities);
			} catch (e) {
				await this.messageBoxService.showErrorDialog(e as IExceptionResponse);
			}
		}
	}

	public override getModificationsFromUpdate(complete: ContractComplete): IConHeaderEntity[] {
		if (complete.ConHeaders) {
			return complete.ConHeaders;
		}
		if (complete.ConHeader) {
			return [complete.ConHeader];
		}
		return [];
	}

	public get RootDataCreated$() {
		return this.rootDataCreated$;
	}

	/**
	 * check the contract whether is change order
	 * @param contractEntity
	 */
	public isChangeOrder(contractEntity: IConHeaderEntity): boolean {
		return ProcurementContractPurchaseOrderTypeService.isChangeOrder(contractEntity);
	}

	/**
	 * check the contract whether is call off
	 * @param contractEntity
	 */
	public isCallOff(contractEntity: IConHeaderEntity): boolean {
		return ProcurementContractPurchaseOrderTypeService.isCallOff(contractEntity);
	}

	public override childrenOf(element: IConHeaderEntity): IConHeaderEntity[] {
		return element.ChildItems ?? [];
	}

	public override parentOf(element: IConHeaderEntity): IConHeaderEntity | null {
		if (element.ConHeaderFk == null) {
			return null;
		}

		const parentId = element.ConHeaderFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public getHeaderContract(): void {
		const selectedEntity = this.getSelectedEntity();
		if (!selectedEntity || !selectedEntity.ConHeaderFk) {
			return;
		}

		const conHeaderId = selectedEntity.ConHeaderFk;
		this.getContractById(conHeaderId).subscribe((response) => {
			const conHeader = response as IConHeaderEntity;
			const contracts = this.getList();

			const updatedContracts = contracts.map((item) => {
				return item.Id === conHeaderId ? conHeader : item;
			});
			const result = this.getFlattenContracts(updatedContracts);
			this.setList(result);
		});
	}

	public getHeaderContext(entity?: IConHeaderEntity): IPrcHeaderContext {
		const contract = entity ?? this.getSelectedEntity();
		if (!contract) {
			throw new Error('please selected record first');
		}

		return {
			prcHeaderFk: contract.PrcHeaderFk,
			projectFk: contract.ProjectFk!,
			controllingUnitFk: contract.ControllingUnitFk,
			currencyFk: contract.BasCurrencyFk,
			exchangeRate: contract.ExchangeRate,
			taxCodeFk: contract.TaxCodeFk,
			prcConfigFk: contract.PrcHeaderEntity?.ConfigurationFk,
			structureFk: contract.PrcHeaderEntity?.StructureFk,
			businessPartnerFk: contract.BusinessPartnerFk,
			dateOrdered: contract.DateOrdered,
			readonly: contract.IsStatusReadonly,
		};
	}

	public getHeaderEntity(): IPrcHeaderEntity {
		const contract = this.getSelectedEntity()!;
		return contract.PrcHeaderEntity!;
	}

	public updateTotalLeadTime(value: number) {
		const entity = this.getSelectedEntity()!;
		entity.TotalLeadTime = value;
	}

	public isValidForSubModule(): boolean {
		const entity = this.getSelectedEntity()!;
		return entity !== null && entity.Id !== undefined && entity.ConHeaderFk !== undefined && entity.ProjectChangeFk !== null;
	}

	public getInternalModuleName(): string {
		return ProcurementInternalModule.Contract;
	}

	public isEntityReadonly(entity?: IConHeaderEntity): boolean {
		return this.getStatus(entity)?.IsReadOnly ?? false;
	}

	public get loginCompanyEntity() {
		return this.companyContext.loginCompanyEntity;
	}

	/**
	 * When generating code, it is necessary to rely on rubric index. Different rubric indexes represent different contract types, and different contract types can be configured with different number ranges
	 */
	public getRubricIndex(entity: IConHeaderEntity) {
		let rubricIndex: RubricIndexEnum = RubricIndexEnum.PurchaseOrder;
		if (entity.ConHeaderFk != null) {
			rubricIndex = entity.ProjectChangeFk != null ? RubricIndexEnum.ChangeOrder : RubricIndexEnum.CallOff;
		}
		return rubricIndex;
	}

	public async updateTaxCodeToItemsAndBoq() {
		const options: IYesNoDialogOptions = {
			headerText: '',
			bodyText: this.translateService.instant('procurement.common.deliverDateUpdateToItemInfo').text,
			defaultButtonId: 'yes',
			showCancelButton: true,
			id: 'deliverDateUpdateToItemInfoDialog',
			dontShowAgain: true,
		};
		const result = await this.messageBoxService.showYesNoDialog(options);
		if (result?.closingButtonId === StandardDialogButtonId.Yes) {
			const selected = this.getSelectedEntity();
			if (selected) {
				this.changeStructureSetTaxCodeToItemBoq$.next(null);
			}
		}
	}

	public getContractById(id: number) {
		return this.http.get(this.configService.webApiBaseUrl + 'procurement/contract/header/getitembyId', { params: { id: id } });
	}

	public async updateControllingUnitToItemsAndBoq(controllingUnitFk: number) {
		const options: IYesNoDialogOptions = {
			headerText: this.translateService.instant('procurement.package.updateControllingUnitDialogTitle').text,
			bodyText: this.translateService.instant('procurement.package.doUpdateControllingUnit').text,
			defaultButtonId: 'yes',
			showCancelButton: true,
			id: '2da028148a68461d89235bb31f56b979',
			dontShowAgain: true,
		};
		const result = await this.messageBoxService.showYesNoDialog(options);
		if (result?.closingButtonId === StandardDialogButtonId.Yes) {
			const selected = this.getSelectedEntity();
			if (selected) {
				this.controllingUnitToItemBoq$.next(controllingUnitFk);
			}
		}
	}

	public getStatus(entity?: IConHeaderEntity): IBasicsCustomizeConStatusEntity | undefined {
		const conHeader = entity ?? this.getSelectedEntity();
		if (!conHeader) {
			return undefined;
		}

		const status = this.conStatusLookupService.cache.getItem({ id: conHeader.ConStatusFk });
		return status || undefined;
	}

	// dto is a tree,need get list
	public getFlattenContracts(dtos: IConHeaderEntity[]) {
		return this.treeHelper.flatTreeArray(dtos, (e) => e.ChildItems);
	}

	public getSelectedProjectId(): number | undefined {
		return this.getSelectedEntity()?.ProjectFk ?? undefined;
	}

	public getConfigurationFk(): number | undefined {
		return this.getSelectedEntity()?.PrcHeaderEntity?.ConfigurationFk;
	}

	public isFrameworkContract(): boolean {
		const selectedEntity = this.getSelectedEntity();
		return selectedEntity !== null && ProcurementContractPurchaseOrderTypeService.isFramework(selectedEntity);
	}

	public isFrameworkContractCallOffByWic(): boolean {
		const selectedEntity = this.getSelectedEntity();
		return selectedEntity !== null && ProcurementContractPurchaseOrderTypeService.isFrameworkContractCallOffByWic(selectedEntity);
	}

	public isFrameworkContractCallOffByMdc(): boolean {
		const selectedEntity = this.getSelectedEntity();
		return selectedEntity !== null && ProcurementContractPurchaseOrderTypeService.isFrameworkContractCallOffByMdc(selectedEntity);
	}

	public async createDeepCopy() {
		const selectItem = this.getSelectedEntity();
		if (!selectItem) {
			return;
		}

		const contractComplete = (await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'procurement/contract/header/deepcopy', selectItem))) as ContractComplete;
		this.onCreateSucceeded(contractComplete);
		if (contractComplete.ConHeader !== undefined && contractComplete.ConHeader.ConHeaderFk !== null) {
			this.addToChildItems(contractComplete?.ConHeader);
			const created = contractComplete as IContractCreateCompleteResponse;
			this.RootDataCreated$.next(created);

			// load call offs
			const callOffService = inject(ProcurementContractCallOffsDataService);
			if (callOffService) {
				await callOffService.load({ id: contractComplete.ConHeader.Id });
			}
		}
		if (contractComplete.ConHeader !== undefined){
			this.setList(union(this.getList(), [contractComplete.ConHeader]));
			return this.goToLast();
		}
	}

	public async createChangeOrder() {
		const selectItem = this.getSelectedEntity();
		if (!selectItem) {
			return;
		}
		const conHeaderId = selectItem.ConHeaderFk ? selectItem.ConHeaderFk : selectItem.Id;
		const result = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'procurement/contract/change/getchangeid', { params: { mainItemId: conHeaderId } }));
		if (!result) {
			this.messageBoxService.showMsgBox('procurement.contract.createChangeNotFound', 'Issue', 'ico-info');
		} else {
			const created = (await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'procurement/contract/change/create', { mainItemId: conHeaderId }))) as IConHeaderEntity;
			if (created) {
				this.onCreateSucceeded(created);
				this.addToChildItems(created);
			}
		}
	}

	public async createCallOff() {
		const selectItem = this.getSelectedEntity();
		if (!selectItem) {
			return;
		}
		const conHeaderId = selectItem.ConHeaderFk ? selectItem.ConHeaderFk : selectItem.Id;
		const created = (await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'procurement/contract/callOffs/create', { mainItemId: conHeaderId }))) as IConHeaderEntity;
		if (created) {
			this.onCreateSucceeded(created);
			this.addToChildItems(created);
			const completeDto = { ConHeaderDto: created } as IContractCreateCompleteResponse;
			this.RootDataCreated$.next(completeDto);

			// load call offs
			const callOffService = inject(ProcurementContractCallOffsDataService);
			if (callOffService) {
				await callOffService.load({ id: created.Id });
			}
		}
	}

	public addToChildItems(newContract: IConHeaderEntity) {
		if (!newContract.ConHeaderFk) {
			return;
		}
		const contracts = this.getList();
		const parentItem = contracts.find((candidate) => candidate.Id === newContract.ConHeaderFk);
		if (parentItem) {
			parentItem.HasChildren = true;
			if (parentItem.ChildItems === null) {
				parentItem.ChildItems = [];
			}
			parentItem.ChildItems?.push(newContract);
		}
		this.setList(contracts);
	}

	public getBasisContractInfo() {
		const selectedEntity = this.getSelectedEntity();
		if (!selectedEntity || selectedEntity.ConHeaderFk === null || selectedEntity.ProjectChangeFk !== null) {
			return null;
		}
		return {
			basisContractId: selectedEntity.ConHeaderFk,
		};
	}

	public async getContractStatus(contractId: number) {
		let entity = this.getList().find((e) => e.Id === contractId);

		if (!entity) {
			// In case contract is not loaded
			entity = await firstValueFrom(
				this.http.get<IConHeaderEntity>(this.configService.webApiBaseUrl + 'procurement/contract/header/get', {
					params: {
						id: contractId,
					},
				}),
			);
		}

		const statusEntity = await firstValueFrom(
			this.conStatusLookupService.getItemByKey({
				id: entity.ConStatusFk,
			}),
		);

		return statusEntity;
	}

	//todo: lvy,task(DEV-14015) wait boq module function ready
	// service.parentBoqItems = [];
	// service.getParentBoqItems = function () {
	// 	if (service.getSelected() && service.getSelected().ConHeaderFk !== null && service.getSelected().ConHeaderFk > 0) {
	// 		$http.get(globals.webApiBaseUrl + 'procurement/common/boq/getboqitemsbymodule?module=3&headerId=' + service.getSelected().ConHeaderFk).then(function (result) {
	// 			service.parentBoqItems = result.data;
	// 		});
	// 	}
	// };

	private getReadOnlyFields(createdContract: IConHeaderEntity): IReadOnlyField<IConHeaderEntity>[] {
		const rubricIndex = this.getRubricIndex(createdContract);
		const hasToGenerate = this.numberGenerationService.hasNumberGenerateConfig(createdContract.RubricCategoryFk, rubricIndex);

		return [
			{ field: 'Code', readOnly: hasToGenerate },
			{ field: 'BankFk', readOnly: true },
		];
	}

	private shouldGenerateNumber(createdContract: IConHeaderEntity): boolean {
		const rubricIndex = this.getRubricIndex(createdContract);
		return this.numberGenerationService.hasNumberGenerateConfig(createdContract.RubricCategoryFk, rubricIndex);
	}

	private getNumberDefaultText(createdContract: IConHeaderEntity): string {
		const rubricIndex = this.getRubricIndex(createdContract);
		return this.numberGenerationService.provideNumberDefaultText(createdContract.RubricCategoryFk, rubricIndex);
	}

	/**
	 * Handle on exchange rate changed
	 * @param entity
	 * @param exchangeRate
	 * @param isUpdateByCurrency
	 * @param isRemainHomeCurrency
	 */
	public onExchangeRateChanged(entity: IConHeaderEntity, exchangeRate: number, isUpdateByCurrency: boolean, isRemainHomeCurrency: boolean = false): void {
		ServiceLocator.injector.get(ProcurementContractOverallDiscountService).updateOverallDiscountAfterExchangeRateChanged(entity, exchangeRate, isRemainHomeCurrency);
		if (isUpdateByCurrency) {
			this.readonlyProcessor.process(entity);
		}
	}

	//todo: Lincoin,task(DEV-14032) wait the contract change container ready, not sure the new angular solution still need to save the 'Change' separately, js: change-main-contract-change-data-service.js
	// function updateChange(updateData) {
	// 	if (updateData.ChangeToDelete && updateData.ChangeToDelete.length > 0) {
	// 		$http.post(globals.webApiBaseUrl + 'change/main/multidelete', updateData.ChangeToDelete);
	// 	}
	// 	if (updateData.ChangeToSave && updateData.ChangeToSave.length > 0) {
	// 		$http.post(globals.webApiBaseUrl + 'change/main/update', {Change: updateData.ChangeToSave}).then(function (response) {
	// 			if (response.data && response.data.Change && response.data.Change.length > 0) {
	// 				var changeDataService = $injector.get('changeMainContractChangeDataService');
	// 				var changes = changeDataService.getList();
	// 				var selectedEntity = changeDataService.getSelected();
	// 				var isExist = _.find(response.data.Change, function (item) {
	// 					return _.find(changes, {Id: item.Id});
	// 				});
	// 				if (isExist) {
	// 					var entity = _.find(response.data.Change, {Id: selectedEntity.Id});
	// 					if (entity) {
	// 						selectedEntity = entity;
	// 					}
	// 					changeDataService.load().then(function () {
	// 						changeDataService.setSelected(selectedEntity);
	// 					});
	// 				}
	// 			}
	// 		});
	// 	}
	// }

	//todo: task(DEV-14015) wait the procurement Common HeaderText container and service ready
	// public reloadHeaderText(item, options){
	// 	var headerTextDataService = procurementCommonHeaderTextNewDataService.getService(service);
	// 	headerTextDataService.reloadData({
	// 		prcHeaderId: item.PrcHeaderEntity.Id,
	// 		prcConfigurationId: item.PrcHeaderEntity.ConfigurationFk,
	// 		projectId: item.ProjectFk,
	// 		isOverride: options !== null && !angular.isUndefined(options) ? options.isOverride : false
	// 	});
	// }

	//todo: lvy, task(DEV-13988)  relate to boq, the boq module call this function, not sure the boq solution in new angular as the same as the old logic
	// service.isChangeHeader = function (boqItem) {
	// 	var baseBoqItem = _.indexOf(service.parentBoqItems, boqItem.BoqItemPrjItemFk);
	// 	// eslint-disable-next-line eqeqeq
	// 	return service.getSelected() && service.getSelected().ConHeaderFk !== null &&
	// 		service.getSelected().ConHeaderFk > 0 && baseBoqItem >= 0; // if is change order and the base req have this item, readonly
	// };
}
