import { inject, Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ISearchResult, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedMaterialCatalogTypeLookupService, BasicsSharedNumberGenerationService, BasicsSharedProcurementConfigurationLookupService, BasicsSharedReqStatusLookupService, IFilterResponse } from '@libs/basics/shared';
import { IBasicsCustomizeMaterialCatalogTypeEntity } from '@libs/basics/interfaces';
import {
	IExchangeRateChangedEvent,
	IHasItemsOrBoqsContext,
	IPaymentTermChangedEvent,
	IPrcCommonMainDataService,
	IPrcCommonReadonlyService,
	IPrcHeaderContext,
	IPrcHeaderDataService,
	IPrcModuleValidatorService,
	ProcurementCommonCascadeDeleteConfirmService,
	ProcurementCommonSystemOptionBudgetEditingService,
	ProcurementOverviewSearchlevel,
} from '@libs/procurement/common';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';
import { EntityProxy, FieldKind, ProcurementInternalModule } from '@libs/procurement/shared';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { find, get, isNil, isObject, orderBy } from 'lodash';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderReadonlyProcessorService } from './processors/requisition-header-readonly-processor.service';
import { IReqCreateCompleteEntity } from '../model/entities/req-create-complete-entity.interface';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementRequisitionHeaderValidationService } from './validations/requisition-header-validation.service';
import { IBoqItemEntity } from '@libs/boq/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionHeaderDataService
	extends DataServiceFlatRoot<IReqHeaderEntity, ReqHeaderCompleteEntity>
	implements
		IPrcHeaderDataService<IReqHeaderEntity, ReqHeaderCompleteEntity>,
		IPrcModuleValidatorService<IReqHeaderEntity, ReqHeaderCompleteEntity>,
		IPrcCommonReadonlyService<IReqHeaderEntity>,
		IPrcCommonMainDataService<IReqHeaderEntity, ReqHeaderCompleteEntity> {
	private readonly requisitionStatusService = inject(BasicsSharedReqStatusLookupService);
	private readonly configurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly cascadeDeleteHelperService = inject(ProcurementCommonCascadeDeleteConfirmService);
	private readonly budgetEditingService = inject(ProcurementCommonSystemOptionBudgetEditingService);
	private readonly httpService = inject(PlatformHttpService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translationService = inject(PlatformTranslateService);

	private readonly rawDataCreated: IReqCreateCompleteEntity | null = null;
	public readonly readonlyProcessor: ProcurementRequisitionHeaderReadonlyProcessorService;
	public readonly numberGenerator = inject(BasicsSharedNumberGenerationService);
	public readonly entityProxy = new EntityProxy(this, [
		['ControllingUnitFk', FieldKind.MdcControllingUnitFk],
		['MaterialCatalogFk', FieldKind.MdcMaterialCatalogFk],
		['TaxCodeFk', FieldKind.MdcTaxCodeFk],
		['BpdVatGroupFk', FieldKind.MdcVatGroupFk],
	]);
	public readonly paymentTermChanged$ = new Subject<IPaymentTermChangedEvent>();
	public readonly exchangeRateChanged$ = new Subject<IExchangeRateChangedEvent>();
	public readonly readonlyChanged$ = new Subject<boolean>();
	public readonly onHeaderUpdated$ = new Subject<ReqHeaderCompleteEntity>();
	protected readonly rootDataCreated$ = new ReplaySubject<IReqCreateCompleteEntity>(1);
	protected readonly controllingUnitChangedToItemBoq$ = new ReplaySubject<void>(1);

	public isFrameworkCatalogTypes: IBasicsCustomizeMaterialCatalogTypeEntity[] = [];
	private readonly hasItemsOrBoqsContext: IHasItemsOrBoqsContext = {
		items: false,
		prcboqs: false,
		boqitems: false,
	};
	private needUpdateUcToItemsBoqs: boolean = false;
	private parentBoqItems: number[] = [];

	// todo chi: public members
	// service.isProcurementModule=true;
	// service.targetSectionId=6;

	public constructor() {
		const options: IDataServiceOptions<IReqHeaderEntity> = {
			apiUrl: 'procurement/requisition/requisition',
			readInfo: {
				endPoint: 'listrequisition',
				usePost: true,
			},
			createInfo: {
				endPoint: 'createrequisition',
			},
			deleteInfo: {
				endPoint: 'deleterequisitions',
			},
			updateInfo: {
				endPoint: 'updaterequisition',
			},
			roleInfo: {
				role: ServiceRole.Root,
				itemName: 'ReqHeader',
			},
		};
		super(options);

		this.readonlyProcessor = new ProcurementRequisitionHeaderReadonlyProcessorService(this);
		this.processor.addProcessor([this.readonlyProcessor]);
		this.selectionChanged$.subscribe((selection) => {
			if (selection.length === 0) {
				return;
			}

			const selected = selection[0];
			this.getHeaderContext().exchangeRate = selected.ExchangeRate;

			// todo chi: do it later
			// service.selectedRequisitionStatusChanged.fire(moduleContext.getModuleStatus());
			// service.hasItemsOrBoqs({});

			this.updateBoqSourceRelativeFilter(selected);
			// todo chi: common logic is not available
			// procurementCommonOverrideHeaderInfoService.updateModuleHeaderInfo(service,'cloud.desktop.moduleDisplayNameRequisition');
		});

		this.getIsFrameworkTypes();
		this.isEntityReadonly();
		// this.entityProxy.propertyChanged$.subscribe(e => {
		// 	switch (e.fieldKind) {
		// 		case FieldKind.ProjectFk:
		// 			this.onProjectChanged(e);
		// 			break;
		// 	}
		// });

		// todo chi: prepare update: doPrepareUpdateCall
		// todo chi: handle update done: handleUpdateDone, mergeUpdatedBoqRootItemIntoBoqList, onUpdateSucceeded
		// todo chi: deep copy: createDeepCopy
		// todo chi: show project header: showProjectHeader -> {getProject: getProject}
	}

	// protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
	// 	if (this.currentViewItems.length > 0) {
	// 		payload.pageNumber = null;
	// 		payload.pageSize = null;
	// 		payload.pattern = null;
	// 		payload.pinningContext = null;
	// 		payload.pKeys = this.currentViewItems.map(function (item) {
	// 			return item.Id;
	// 		});
	// 		this.currentViewItems = [];
	// 	}
	//
	// 	return payload;
	// }

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IReqHeaderEntity> {
		// todo chi: add columns from characteristic
		// todo chi: pin context setPrcPackageToPinningContext
		// todo chi: set lookup cache

		const filterResult = get(loaded, 'FilterResult')! as IFilterResponse;
		const list = get(loaded, 'Main', []) as IReqHeaderEntity[];
		return {
			dtos: list,
			FilterResult: {
				ExecutionInfo: filterResult.ExecutionInfo,
				ResultIds: filterResult.ResultIds,
				RecordsFound: filterResult.RecordsFound,
				RecordsRetrieved: filterResult.RecordsRetrieved,
			},
		};
	}

	// todo chi: creation dialog, showEditDialog
	protected override provideCreatePayload(): object {
		// creationData.ProjectFk = moduleContext.loginProject;
		// creationData.ConfigurationFk = createParam.ConfigurationFk;
		// creationData.Code = createParam.Code;
		// createParam = {};
		const configs = this.configurationLookupService.syncService?.getListSync();
		const config = configs?.find((e) => e.Id === 2);
		let code: string = '';
		if (config) {
			code = this.numberGenerator.provideNumberDefaultText(config.RubricCategoryFk);
		}
		return { ConfigurationFk: 2, Code: code };
	}

	// public async createFromDialog(): Promise<IReqHeaderEntity> {
	//
	// 	const createdData = await lastValueFrom(this.http.post<IReqCreateCompleteEntity>(this.configService.webApiBaseUrl + 'procurement/requisition/requisition/createsubentitiesaftercreationconfigured', this.rawDataCreated));
	// 	// const configs = await lastValueFrom(this.configurationLookupService.getList());
	// 	// const config = find(configs, (item) => {
	// 	// 	return item.Id === createdData.ReqHeaderDto.PrcHeaderEntity.ConfigurationFk;
	// 	// });
	// 	// todo chi: set readonly
	// 	// todo chi: completeItemCreated -> use rootDataCreated$ instead
	// 	// todo chi: reloadHeaderText
	// 	return createdData.ReqHeaderDto;
	// }

	protected override onCreateSucceeded(created: IReqCreateCompleteEntity): IReqHeaderEntity {
		// todo chi: get config
		// todo chi: completeItemCreated
		// todo chi: create characteristic add columns from characteristic
		// todo chi: reloadHeaderText
		const reqHeader = created.ReqHeaderDto!;
		this.readonlyProcessor.process(reqHeader);
		this.rootDataCreated$.next(created);
		return reqHeader;
	}

	public override canDelete(): boolean {
		const canDel = super.canDelete();
		if (!canDel) {
			const selected = this.getSelectedEntity();
			if (selected) {
				if (selected.Version === 0) {
					return true;
				} else {
					return !this.getHeaderContext().readonly;
				}
			}
		}
		return canDel;
	}

	/**
	 * equal to updateDone
	 * @param updated
	 */
	public override takeOverUpdatedChildEntities(updated: ReqHeaderCompleteEntity): void {
		super.takeOverUpdatedChildEntities(updated);
		this.onHeaderUpdated$.next(updated);
	}

	public getHeaderContext(): IPrcHeaderContext {
		const item = this.getSelectedEntity();
		if (!item) {
			return {
				prcHeaderFk: 0,
				projectFk: 0,
				controllingUnitFk: 0,
				currencyFk: 0,
				exchangeRate: 1,
				prcConfigFk: 0,
				structureFk: 0,
				businessPartnerFk: 0,
				readonly: true,
			};
		}
		return {
			prcHeaderFk: item.PrcHeaderFk,
			projectFk: item.ProjectFk!,
			controllingUnitFk: item.ControllingUnitFk ?? undefined,
			currencyFk: item.BasCurrencyFk,
			taxCodeFk: item.TaxCodeFk,
			exchangeRate: item.ExchangeRate,
			prcConfigFk: item.PrcHeaderEntity?.ConfigurationFk,
			structureFk: item.PrcHeaderEntity?.StructureFk,
			businessPartnerFk: item.BusinessPartnerFk ?? -1,
			readonly: this.isEntityReadonly(),
		};
	}

	public isValidForSubModule(): boolean {
		return true;
	}

	public getInternalModuleName(): string {
		return ProcurementInternalModule.Requisition;
	}

	public isEntityReadonly(entity?: IReqHeaderEntity): boolean {
		let isReadOnly = true;
		const item = entity ?? this.getSelectedEntity();
		if (!item) {
			return isReadOnly;
		}
		const statuses = this.requisitionStatusService.syncService?.getListSync();
		const status = find(statuses, { Id: item.ReqStatusFk });
		if (status) {
			isReadOnly = isReadOnly && status.IsReadOnly;
		}
		return isReadOnly;
	}

	public getHeaderEntity(): IPrcHeaderEntity {
		const selected = this.getSelectedEntity()!;
		return selected.PrcHeaderEntity!;
	}

	public updateTotalLeadTime(value: number) {
		//
	}

	public get RootDataCreated$() {
		return this.rootDataCreated$;
	}

	private updateBoqSourceRelativeFilter(currentItem: IReqHeaderEntity) {
		// let groupIds = [];
		let isSetMainItemId2BoqHeaderIds = false;
		if (currentItem?.BoqWicCatFk) {
			// groupIds = [currentItem.BoqWicCatFk]; // todo chi: uncomment it later
			if (currentItem.BoqWicCatBoqFk) {
				isSetMainItemId2BoqHeaderIds = true;
				this.asyncGetPrcWicCatBoq(currentItem.BoqWicCatBoqFk, currentItem.BoqWicCatFk).then((boqHeaderIds) => {
					// todo chi: common logic is not available
					// boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(boqHeaderIds);
				});
			}
		}
		// todo chi: common logic is not available
		// boqMainLookupFilterService.setSelectedWicGroupIds(groupIds);
		if (!isSetMainItemId2BoqHeaderIds) {
			// todo chi: common logic is not available
			// boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(null);
		}
	}

	private asyncGetPrcWicCatBoq(boqWicCatBoqFk: number, boqWicCatFk: number) {
		const boqHeaderIds = null;
		// todo chi: do it later
		// if (boqWicCatBoqFk && boqWicCatFk) {
			// var wicCatBoqs = basicsLookupdataLookupDescriptorService.getData('PrcWicCatBoqs');
			// if (wicCatBoqs) {
			// 	var wicCatBoq = _.find(wicCatBoqs, {Id: boqWicCatBoqFk});
			// 	if (wicCatBoq) {
			// 		boqHeaderIds = {};
			// 		boqHeaderIds[boqWicCatFk] = [wicCatBoq.BoqHeader.Id];
			// 	}
			// 	defer.resolve(boqHeaderIds);
			// 	return defer.promise;
		// } else {
			// return basicsLookupdataLookupDescriptorService.getItemByKey('PrcWicCatBoqs', {Id: boqWicCatBoqFk, PKey1: boqWicCatFk})
			// 	.then(function (data) {
			// 		if (data) {
			// 			boqHeaderIds = {};
			// 			boqHeaderIds[boqWicCatFk] = [data.BoqHeader.Id];
			// 		}
			// 		return boqHeaderIds;
			// 	});
		// }
		return Promise.resolve(boqHeaderIds);
	}

	// public get onStructureChanged$(): Observable<IPackageStructureChangedArgs> {
	// 	return this.structureFkChanged$;
	// }

	// public propertyChanged(args: object) {
	// 	const tempArgs = args as IPropertyChangedArgs;
	// 	switch (tempArgs.fieldKind) {
	// 		case 'structure': {
	// 			this.structureFkChanged$.next(args as IPackageStructureChangedArgs);
	// 			break;
	// 		}
	// 	}
	// }

	public override createUpdateEntity(modified: IReqHeaderEntity | null): ReqHeaderCompleteEntity {
		const complete = new ReqHeaderCompleteEntity();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.ReqHeader = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: ReqHeaderCompleteEntity): IReqHeaderEntity[] {
		if (!complete.ReqHeader) {
			complete.ReqHeaders = [];
		} else {
			complete.ReqHeaders = [complete.ReqHeader];
		}

		return complete.ReqHeaders;
	}

	public override async delete(entities: IReqHeaderEntity[] | IReqHeaderEntity) {
		const selectedItem = this.getSelectedEntity()!;

		await this.cascadeDeleteHelperService
			.openDialog({
				filter: '',
				mainItemId: selectedItem.Id,
				moduleIdentifier: ProcurementInternalModule.Requisition,
				searchLevel: ProcurementOverviewSearchlevel.RootContainer,
			})
			.then((res) => {
				if (res) {
					if (res.closingButtonId === StandardDialogButtonId.Yes) {
						super.delete(entities);
					}
				}
			});
	}

	public getIsFrameworkTypes() {
		const materialCatTypeLookupService = ServiceLocator.injector.get(BasicsSharedMaterialCatalogTypeLookupService);
		const materialCatTypes = materialCatTypeLookupService.syncService?.getListSync();
		this.isFrameworkCatalogTypes = [];
		if (materialCatTypes?.length) {
			let types = orderBy(materialCatTypes, ['Id']);
			types = types.filter((i) => i.Sorting && i.IsLive && i.IsFramework);
			if (types?.length) {
				this.isFrameworkCatalogTypes = types;
			}
		}
		materialCatTypeLookupService.setFrameworkCatlogTypes(this.isFrameworkCatalogTypes);
	}

	public wantToUpdateCUToItemsAndBoq(entity: IReqHeaderEntity, isProjectFkChange?: boolean, isFromConfigDialog?: boolean) {
		if (this.hasItemsOrBoqsContext.items || this.hasItemsOrBoqsContext.prcboqs || this.hasItemsOrBoqsContext.boqitems) {
			const validationService = ServiceLocator.injector.get(ProcurementRequisitionHeaderValidationService);
			this.messageBoxService
				.showYesNoDialog({
					headerText: this.translationService.instant('procurement.package.updateControllingUnitDialogTitle').text,
					bodyText: this.translationService.instant('procurement.package.doUpdateControllingUnit').text,
					dontShowAgain: true,
				})
				?.then(async (result) => {
					if (result.closingButtonId === StandardDialogButtonId.Ok) {
						if (!isNil(isProjectFkChange) && isProjectFkChange) {
							this.updateHeaderCUtoItemBoq(entity);
							entity.NeedUpdateUcToItemsBoqs = true;
						} else {
							const selected = this.getSelectedEntity();
							if (selected) {
								this.needUpdateUcToItemsBoqs = true;
								this.controllingUnitChangedToItemBoq$.next(); // todo chi: check common one if implemented later
							}
						}
					} else {
						this.needUpdateUcToItemsBoqs = false;
					}

					this.hasItemsOrBoqs({});
					if (!isNil(isProjectFkChange) && isProjectFkChange) {
						await validationService.validateBasCurrencyFk(
							{
								entity: entity,
								value: entity.BasCurrencyFk,
								field: 'BasCurrencyFk',
							},
							isFromConfigDialog,
						);
					}
				});
		}
	}

	public getBudgetEditingInProcurement() {
		return this.budgetEditingService.getBudgetEditableInPrc();
	}

	public get controllingUnitToItemBoq$(): Observable<void> {
		return this.controllingUnitChangedToItemBoq$;
	}

	public hasItemsOrBoqs(o: IHasItemsOrBoqsContext) {
		if (isObject(o)) {
			this.hasItemsOrBoqsContext.items = !!o.items;
			this.hasItemsOrBoqsContext.prcboqs = !!o.prcboqs;
			this.hasItemsOrBoqsContext.boqitems = !!o.boqitems;
		}
	}

	public getItemsOrBoqs() {
		return this.hasItemsOrBoqsContext;
	}

	public getDefaultListForCreated(targetSectionId: number, configrationSectionId: number, structureSectionId: number, newData: IReqHeaderEntity) {
		let sourceHeaderId = newData.Version === 0 ? newData.PrcHeaderEntity?.ConfigurationFk : this.getConfigurationFk();
		if (!sourceHeaderId) {
			sourceHeaderId = newData.PrcHeaderEntity!.ConfigurationFk;
		}
		// todo chi: common logic is not available
		// procurementCommonCharacteristicDataService.getDefaultListForCreated(
		// 	targetSectionId,
		// 	sourceHeaderId,
		// 	configrationSectionId,
		// 	structureSectionId,
		// 	newData)
		// 	.then(function (defaultItem) {
		// 	if (defaultItem) {
		// 		deferred.resolve(defaultItem);
		// 	}
		// });
		// return deferred.promise;
	}

	public getConfigurationFk() {
		const selected = this.getSelectedEntity();
		if (selected) {
			return selected.PrcHeaderEntity?.ConfigurationFk;
		}
		return null;
	}

	public reloadHeaderText(item: IReqHeaderEntity /*, options*/) {
		// todo chi: common logic is not available
		// var headerTextDataService = procurementCommonHeaderTextNewDataService.getService(service);
		// headerTextDataService.reloadData({
		// 	prcHeaderId: item.PrcHeaderEntity.Id,
		// 	prcConfigurationId: item.PrcHeaderEntity.ConfigurationFk,
		// 	projectId: item.ProjectFk,
		// 	isOverride: options !== null && !angular.isUndefined(options) ? options.isOverride: false
		// });
	}

	public updateBoqFilter() {
		const selected = this.getSelectedEntity();
		if (selected) {
			this.updateBoqSourceRelativeFilter(selected);
		}
	}

	public isChangeHeader(boqItem: IBoqItemEntity) {
		const baseBoqItem = boqItem.BoqItemPrjItemFk ? this.parentBoqItems.indexOf(boqItem.BoqItemPrjItemFk) : -1;
		const selected = this.getSelectedEntity();
		return selected?.ReqHeaderFk && baseBoqItem >= 0; // if is change order and the base req have this item, readonly
	}

	public async getParentBoqItems() {
		const selected = this.getSelectedEntity();
		if (selected?.ReqHeaderFk) {
			this.parentBoqItems = await this.httpService.get<number[]>('procurement/common/boq/getboqitemsbymodule?module=1&headerId=' + selected.ReqHeaderFk);
		}
	}

	public isFrameworkContractCallOffByWic() {
		const selected = this.getSelectedEntity();
		return selected ? !!selected.BoqWicCatFk : false;
	}

	public isFrameworkContractCallOffByMdc() {
		const selected = this.getSelectedEntity();
		return selected ? !!selected.MaterialCatalogFk : false;
	}

	public wizardIsActivate() {
		const statuses = this.requisitionStatusService.syncService?.getListSync();
		const selected = this.getSelectedEntity();
		let isActivate = true;
		if (selected) {
			const oneStatus = statuses?.find((e) => e.Id === selected.ReqStatusFk);
			if (oneStatus) {
				isActivate = !oneStatus.IsReadOnly && oneStatus.IsLive;
			}
		}
		if (!isActivate) {
			this.messageBoxService.showMsgBox({
				headerText: this.translationService.instant('procurement.requisition.wizard.isActivateCaption').text,
				bodyText: this.translationService.instant('procurement.requisition.wizard.isActiveMessage').text,
				buttons: [{ id: StandardDialogButtonId.Ok }],
				iconClass: 'ico-warning',
			});
		}
		return isActivate;
	}

	public hasWicBoqInReqHeader(item: IReqHeaderEntity) {
		return item?.BoqWicCatFk;
	}

	public getStatus() {
		const selectedEntity = this.getSelectedEntity();
		if (!selectedEntity) {
			return undefined;
		}

		const status = this.requisitionStatusService.cache.getItem({ id: selectedEntity.ReqStatusFk });
		return status || undefined;
	}

	private updateHeaderCUtoItemBoq(entity: IReqHeaderEntity) {
		// todo chi: common logic is not available
		// var prcBoqMainService = $injector.get('prcBoqMainService');
		// var boqMainService = prcBoqMainService.getService(service);
		// var procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService');
		// var prcCommonBoqService = procurementCommonPrcBoqService.getService(service, boqMainService);
		// let itemService = $injector.get(service.getItemServiceName());
		// let itemList = itemService.getList();
		// let prcBoqList = prcCommonBoqService.getList();
		// let boqService = $injector.get('prcBoqMainService').getService();
		// let boqItemList = boqService.getList();
		//
		// for (let i = 0; i < prcBoqList.length; i++) {
		// 	prcBoqList[i].PrcBoq.MdcControllingunitFk = entity.ControllingUnitFk;
		// 	prcCommonBoqService.markItemAsModified(prcBoqList[i]);
		// 	entity.NeedUpdateUcToItemsBoqs = true;
		// 	service.markItemAsModified(entity);
		// }
		// for (let i = 0; i < itemList.length; i++) {
		// 	itemList[i].MdcControllingunitFk = entity.ControllingUnitFk;
		// 	itemService.markItemAsModified(itemList[i]);
		// }
		// for (let i = 0; i < boqItemList.length; i++) {
		// 	boqItemList[i].MdcControllingUnitFk = entity.ControllingUnitFk;
		// 	boqService.markItemAsModified(boqItemList[i]);
		// }
	}

	// todo chi: messenger: onParentUpdated, onRecalculationItemsAndBoQ(common logic is not available), configurationChanged(use in change config dialog),
	// todo chi: navigate: navigationCompleted
	// todo chi: event: onFilterUnLoaded, onFilterLoaded, registerFilterLoad, registerFilterUnLoad
	// todo chi: update done: onUpdateSucceeded registerUpdateDone unregisterUpdateDone registerRefreshDone unregisterRefreshDone
	// todo chi: createDeepCopy
	// todo chi: setCharacteristicColumn, characteristicColumn, getCharacteristicColumn

	// done: taxCodeFkChanged(done: replace by entityProxy), projectFkChanged(not need), completeItemCreated(use rootDataCreated$ instead),
	// taxMaterialCatalogFkChanged(done: replace by entityProxy), selectedRequisitionStatusChanged(maybe obsolete),
	// vatGroupChanged(replace by entityProxy, use in change value dialog), controllingUnitChanged(replace by entityProxy),
	// controllingUnitToItemBoq(check common one later), updateDeliveryDateToItem(obsolete)
}
