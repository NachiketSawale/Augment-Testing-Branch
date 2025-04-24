/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ISearchResult, PlatformConfigurationService, PlatformDateService, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { extend, forEach, get, isArray, isEmpty, isNil, isObject } from 'lodash';
import { AddressEntity, BasicsSharedNumberGenerationService, BasicsSharedPackageStatusLookupService, IFilterResponse } from '@libs/basics/shared';
import { ProcurementPackageHeaderReadonlyProcessorService } from './processors/package-header-readonly-processor.service';
import {
	IExchangeRateChangedEvent,
	IHasItemsOrBoqsContext,
	IModifyExchangeRate,
	IPrcCommonMainDataService,
	IPaymentTermChangedEvent,
	IPrcCommonReadonlyService,
	IPrcHeaderContext,
	IPrcHeaderDataService,
	ProcurementCommonCascadeDeleteConfirmService,
	ProcurementCommonSystemOptionBudgetEditingService,
	ProcurementOverviewSearchlevel,
	IPrcModuleValidatorService,
} from '@libs/procurement/common';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';
import { EntityProxy, FieldKind, IPropertyChangedEvent, ProcurementInternalModule } from '@libs/procurement/shared';
import { lastValueFrom, Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IProjectEntity } from '@libs/project/interfaces';
import { ProcurementPackageHeaderValidationService } from './validations/package-header-validation.service';
import { IBasicsAssetMasterEntity } from '@libs/basics/interfaces';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementPackageChangeDateDialogService } from './dialogs/change-date-dialog.service';
import { ProcurementPackageSystemOptionShowPackageAutoUpdateDialogService } from './system-option-show-package-auto-update-dialog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ICheckChangeResult } from '../model/entities/check-change-result.interface';
import { IUpdateResult } from '../model/entities/update-result.interface';
import { ProcurementPackageSystemOptionIsProtectContractedPackageItemAssignmentService } from './system-option-is-protect-contracted-pkg-item-assign.service';
import { ProcurementPackageOverallDiscountService } from './procurement-package-overall-discount.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageHeaderDataService
	extends DataServiceFlatRoot<IPrcPackageEntity, PrcPackageCompleteEntity>
	implements IPrcCommonReadonlyService<IPrcPackageEntity>, IModifyExchangeRate<IPrcPackageEntity>, IPrcHeaderDataService<IPrcPackageEntity, PrcPackageCompleteEntity>, IPrcCommonMainDataService<IPrcPackageEntity, PrcPackageCompleteEntity>,
	IPrcModuleValidatorService<IPrcPackageEntity, PrcPackageCompleteEntity> {
	private readonly configService = inject(PlatformConfigurationService);
	private readonly packageStatusService = inject(BasicsSharedPackageStatusLookupService);
	private readonly http = inject(HttpClient);
	private readonly httpService = inject(PlatformHttpService);
	private readonly cascadeDeleteHelperService = inject(ProcurementCommonCascadeDeleteConfirmService);
	private readonly budgetEditingService = inject(ProcurementCommonSystemOptionBudgetEditingService);
	private readonly dateService = inject(PlatformDateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly sanitizer = inject(DomSanitizer);
	public readonly readonlyChanged$ = new Subject<boolean>();
	public readonly paymentTermChanged$ = new Subject<IPaymentTermChangedEvent>();

	// private currentViewItems: IPrcPackageEntity[] = [];
	public readonly readonlyProcessor: ProcurementPackageHeaderReadonlyProcessorService;
	public readonly numberGenerator = inject(BasicsSharedNumberGenerationService);
	public readonly entityProxy = new EntityProxy(this, [
		['StructureFk', FieldKind.StructureFk],
		['ConfigurationFk', FieldKind.PrcConfigurationFk],
		['TaxCodeFk', FieldKind.MdcTaxCodeFk],
		['ProjectFk', FieldKind.ProjectFk],
		['BpdVatGroupFk', FieldKind.MdcVatGroupFk],
		['AllConfigurationFk', FieldKind.AllConfigurationFk],
		['MdcControllingUnitFk', FieldKind.MdcControllingUnitFk],
	]);

	public readonly exchangeRateChanged$ = new Subject<IExchangeRateChangedEvent>();
	public readonly rootDataCreated$ = new ReplaySubject<IPrcPackageEntity>(1);
	public readonly onHeaderUpdated$ = new Subject<PrcPackageCompleteEntity>();
	protected readonly controllingUnitChangedToItemBoq$ = new ReplaySubject<void>(1);

	private hasItemsOrBoqsContext: IHasItemsOrBoqsContext = {
		items: false,
		prcboqs: false,
		boqitems: false,
	};
	private needUpdateUcToItemsBoqs: boolean = false;
	private checkingPackages: number[] = [];
	private refreshPackages: number[] = [];
	private updateCodeEnum = {
		NotChange: 1,
		// todo-stone: add the hardcode to translation token.
		NotChangeMsg: 'No update. It\'s already latest version.', // $translate.instant('procurement.package.updatePackageFromBaseline.notChanged'),

		GetDataFromBaseLineSuccess: 2,
		GetDataFromBaseLineSuccessMsg: this.translationService.instant('procurement.package.updatePackageFromBaseline.getFromBaselineSuccessed').text,

		GetDataFromBaseLineFailed: 3,
		GetDataFromBaseLineFailedMsg: this.translationService.instant('procurement.package.updatePackageFromBaseline.getFromBaselineFailed').text,

		UpdateSuccess: 4,
		UpdateSuccessMsg: this.translationService.instant('procurement.package.updatePackageFromBaseline.updateSuccessed').text,

		UpdateFailed: 5,
		UpdateFailedMsg: this.translationService.instant('procurement.package.updatePackageFromBaseline.updateFailed').text,
	};

	public constructor() {
		const options: IDataServiceOptions<IPrcPackageEntity> = {
			apiUrl: 'procurement/package/package',
			readInfo: {
				endPoint: 'listpackage',
				usePost: true,
			},
			createInfo: {
				endPoint: 'create/createpackage',
			},
			deleteInfo: {
				endPoint: 'deletepackages',
			},
			updateInfo: {
				endPoint: 'updatepackage',
			},
			roleInfo: {
				role: ServiceRole.Root,
				itemName: 'PrcPackage',
			},
		};
		super(options);

		this.readonlyProcessor = new ProcurementPackageHeaderReadonlyProcessorService(this);
		this.processor.addProcessor([this.readonlyProcessor]);

		this.init();

		// todo chi: prepare update: doPrepareUpdateCall -> logic move to createUpdateEntity
		// todo chi: handle update done: handleUpdateDone, mergeUpdatedBoqRootItemIntoBoqList, onUpdateSucceeded
		// todo chi: deep copy: createDeepCopy
		// todo chi: show project header: showProjectHeader -> {getProject: getProject}
		// todo chi: sidebarInquiry: getSelectedItems, getResultsSet, createInquiryResultSet
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

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IPrcPackageEntity> {
		// todo chi: add columns from characteristic
		// todo chi: pin context setPrcPackageToPinningContext
		// todo chi: set lookup cache (need?)

		const filterResult = get(loaded, 'FilterResult')! as IFilterResponse;
		const list = get(loaded, 'Main', []) as IPrcPackageEntity[];
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

	// todo chi: creation dialog,showEditDialog
	protected override provideCreatePayload(): object {
		// creationData.PrjProjectFk = createParam.ProjectFk;
		// creationData.ConfigurationFk = createParam.ConfigurationFk;
		// creationData.Description = createParam.Description;
		// creationData.StructureFk = createParam.StructureFk;
		// creationData.ClerkPrcFk = createParam.ClerkPrcFk;
		// creationData.ClerkReqFk = createParam.ClerkReqFk;
		// creationData.AssetMasterFk = createParam.AssetMasterFk;
		// creationData.Code = createParam.Code;
		// creationData.IsAutoSave = true;// by defect#143849
		// createParam = {};
		return { PrjProjectFk: 277, ConfigurationFk: 25 };
	}

	protected override onCreateSucceeded(created: object): IPrcPackageEntity {
		// todo chi: create characteristic add columns from characteristic
		// todo chi: generate code
		// todo chi: set Total and Clerk data
		// newData.totalItems = newData.PrcTotalsDto; // for total default create.
		// newData.clerkItems = newData.Package2ClerkDto;
		// todo chi: send message to total
		// validate required: 'TaxCodeFk', 'Code', 'ProjectFk', 'CurrencyFk'
		const newData = created as IPrcPackageEntity;
		this.rootDataCreated$.next(newData);
		return newData;
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
	public override takeOverUpdatedChildEntities(updated: PrcPackageCompleteEntity): void {
		super.takeOverUpdatedChildEntities(updated);
		this.onHeaderUpdated$.next(updated);
	}

	public getHeaderContext():IPrcHeaderContext {
		const item = this.getSelectedEntity();
		let prcHeaderContext:IPrcHeaderContext={
			prcHeaderFk: 0,
			projectFk: 0,
			controllingUnitFk: 0,
			currencyFk: 0,
			exchangeRate: 1,
			prcConfigFk: 0,
			structureFk: 0,
			businessPartnerFk: 0,
			readonly: true};
		if (!item) {
			return prcHeaderContext;
		}
		let readonly = !this.checkIfCurrentLoginCompany(item);
		const statuses = this.packageStatusService.syncService?.getListSync();
		const status = statuses?.find((e) => e.Id === item.PackageStatusFk);
		if (status) {
			readonly = readonly && status.IsReadOnly;
		}
		prcHeaderContext={
			prcHeaderFk: 0,
			projectFk: item.ProjectFk,
			controllingUnitFk: item.MdcControllingUnitFk,
			currencyFk: item.CurrencyFk,
			exchangeRate: item.ExchangeRate,
			prcConfigFk: item.ConfigurationFk,
			structureFk: item.StructureFk,
			businessPartnerFk: item.BusinessPartnerFk,
			readonly: readonly
		};
		return prcHeaderContext;
	}

	public checkIfCurrentLoginCompany(item?: IPrcPackageEntity | null) {
		item = item || this.getSelectedEntity();
		return !!(item && item.CompanyFk === this.configService.clientId);
	}

	public override createUpdateEntity(modified: IPrcPackageEntity | null): PrcPackageCompleteEntity {
		const complete = new PrcPackageCompleteEntity();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PrcPackage = modified;
			// complete.PrcPackages = [modified];
			// adding PrcPackages for batch disable record
			// if (complete.PrcPackages.length > 1) {
			// 	complete.PrcPackage = null;
			// } else if (complete.PrcPackages.length === 1) {
			// 	complete.PrcPackage = complete.PrcPackage[0];
			// 	complete.PrcPackages = null;
			// }

			if (this.needUpdateUcToItemsBoqs) {
				// need to update controllingUnit of prcItems and boqItems
				complete.PrcPackage.NeedUpdateCUToItemsBoq = true;
				this.needUpdateUcToItemsBoqs = false;
			}
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PrcPackageCompleteEntity): IPrcPackageEntity[] {
		if (!complete.PrcPackage) {
			complete.PrcPackages = [];
		} else {
			complete.PrcPackages = [complete.PrcPackage];
		}

		return complete.PrcPackages;
		// todo chi: do it later
		// the cost group to save
		// if (updateData.PrcPackage2HeaderToSave && updateData.PrcPackage2HeaderToSave.length > 0) {
		// 	_.each(updateData.PrcPackage2HeaderToSave, function (PrcPackage2Header) {
		// 		if (PrcPackage2Header.PrcBoqCompleteToSave && PrcPackage2Header.PrcBoqCompleteToSave.BoqItemCompleteToSave && PrcPackage2Header.PrcBoqCompleteToSave.BoqItemCompleteToSave.length > 0) {
		// 			var qtoDetailsToSave = _.map(PrcPackage2Header.PrcBoqCompleteToSave.BoqItemCompleteToSave, 'QtoDetailToSave');
		// 			_.each(qtoDetailsToSave, function (qtoDetailToSave) {
		// 				_.each(qtoDetailToSave, function (item) {
		// 					if (item.QtoDetail) {
		// 						if (item.QtoDetail.CostGroupsToCopy && item.QtoDetail.IsCopy) {
		// 							item.CostGroupToSave = item.QtoDetail.CostGroupsToCopy;
		// 						}
		// 					}
		// 				});
		// 			});
		// 		}
		// 	});
		// }
	}

	public override async delete(entities: IPrcPackageEntity[] | IPrcPackageEntity) {
		const selectedItem = this.getSelectedEntity()!;

		await this.cascadeDeleteHelperService
			.openDialog({
				filter: '',
				mainItemId: selectedItem.Id,
				moduleIdentifier: ProcurementInternalModule.Package,
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

	public init() {
		this.selectionChanged$.subscribe(async (selection) => {
			if (selection.length === 0) {
				return;
			}

			const selected = selection[0];
			this.getHeaderContext().exchangeRate = selected.ExchangeRate;
			this.readonlyProcessor.process(selected);

			// service.selectedPackageStatusChanged.fire(moduleContext.getModuleStatus()); // todo chi: seems obsolete
			this.hasItemsOrBoqs({});

			await this.asyncPackageDataFromBaseLine(selected);
		});

		this.entityProxy.propertyChanged$.subscribe(async (e) => {
			switch (e.fieldKind) {
				case FieldKind.ProjectFk:
					await this.onProjectChanged(e);
					break;
			}
		});
	}

	public getBudgetEditingInProcurement() {
		return this.budgetEditingService.getBudgetEditableInPrc();
	}

	public async updateAddress(entity: IPrcPackageEntity, addressFk: number) {
		const address = await this.httpService.get<AddressEntity>('basics/common/address/clone?id=' + addressFk);

		if (address) {
			entity.AddressFk = address.Id;
			entity.AddressEntity = address;
		}
	}

	public async showDateDecisionDialog(headerEntity: IPrcPackageEntity, activityId: number) {
		// todo chi: SchedulingActivityLookupService is not exported
		// $injector.get('basicsLookupdataLookupDataService').getItemByKey('SchedulingActivity', activityId).then(function (res) {

		const validateActivity: {
			PlannedStart?: Date;
			PlannedFinish?: Date;
			ActualStart?: Date;
			ActualFinish?: Date;
		} | null = null; // await lastValueFrom(this.); // todo chi: do it later
		if (!validateActivity) {
			return;
		}
		if (this.needUpdateDateFromActivity(validateActivity, headerEntity)) {
			const changeDateDialogService = ServiceLocator.injector.get(ProcurementPackageChangeDateDialogService);
			const result = await changeDateDialogService.show({
				activity: validateActivity,
				headerEntity: headerEntity,
			});

			if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
				this.setPackageDateFromActivity(headerEntity, validateActivity);
			}
		}
	}

	public wantToUpdateCUToItemsAndBoq(entity: IPrcPackageEntity, isProjectFkChange?: boolean) {
		if (this.hasItemsOrBoqsContext.items || this.hasItemsOrBoqsContext.prcboqs || this.hasItemsOrBoqsContext.boqitems) {
			const validationService = ServiceLocator.injector.get(ProcurementPackageHeaderValidationService);
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
							entity.NeedUpdateCUToItemsBoq = true;
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
						await validationService.validateCurrencyFk({
							entity: entity,
							value: entity.CurrencyFk,
							field: 'BasCurrencyFk',
						});
					}
				});
		}
	}

	public hasItemsOrBoqs(o: IHasItemsOrBoqsContext) {
		if (isObject(o)) {
			this.hasItemsOrBoqsContext.items = !!o.items;
			this.hasItemsOrBoqsContext.prcboqs = !!o.prcboqs;
			this.hasItemsOrBoqsContext.boqitems = !!o.boqitems;
		}
	}

	public getItemsOrBoqs() {
		// todo chi: need?
		return this.hasItemsOrBoqsContext;
	}

	public get controllingUnitToItemBoq$(): Observable<void> {
		return this.controllingUnitChangedToItemBoq$;
	}

	public get RootDataCreated$() {
		return this.rootDataCreated$;
	}

	public mergeMainEvent(entities: IPrcPackageEntity[]) {
		const itemList = this.getList();
		forEach(entities, (entity) => {
			const mergeItem = itemList.find((e) => e.Id === entity.Id);
			if (mergeItem) {
				extend(mergeItem, entity);
				const processors = this.processor.getProcessors();
				forEach(processors, (processor) => {
					processor.process(mergeItem);
				});
			}
		});
	}

	public async wizardIsActivate() {
		const parentItem = this.getSelectedEntity();
		let isActivate = true;
		let bodyText = '';
		if (parentItem) {
			const oneStatus = this.packageStatusService.syncService?.getListSync().find((e) => e.Id === parentItem.PackageStatusFk);
			const isReadonly = oneStatus?.IsReadOnly || true;
			const IsLive = oneStatus?.IsLive || false;
			isActivate = !isReadonly;
			if (isReadonly) {
				bodyText = this.translationService.instant('procurement.package.wizard.isReadOnlyMessage').text;
			}
			if (!IsLive) {
				bodyText = this.translationService.instant('procurement.package.wizard.isNoActivateMessage').text;
			}
			if (isReadonly && !IsLive) {
				bodyText = this.translationService.instant('procurement.package.wizard.isReadOnlyAndNoActivateMessage').text;
			}
			if (isActivate) {
				isActivate = IsLive;
			}
		}
		if (!isActivate) {
			await this.messageBoxService.showMsgBox({
				headerText: 'procurement.package.wizard.isActivateCaption',
				bodyText: bodyText,
				buttons: [
					{
						id: StandardDialogButtonId.Ok,
					},
				],
				defaultButtonId: StandardDialogButtonId.Ok,
				iconClass: 'ico-warning',
			});
		}
		return isActivate;
	}

	public isProtectContractedPackageItemAssignment() {
		const isProtectedService = ServiceLocator.injector.get(ProcurementPackageSystemOptionIsProtectContractedPackageItemAssignmentService);
		return isProtectedService.getIsProtected();
	}

	// public getPrcPacMasterRestrictionInfo() { // todo chi: move to package master restriction
	// 	const packageHeader = this.getSelectedEntity();
	//
	// 	if (packageHeader) {
	// 		const result = {
	// 			prcConfigurationId: packageHeader.ConfigurationFk,
	// 			prcCopyMode: packageHeader.PrcCopyModeFk,
	// 			packageId: packageHeader.Id,
	// 			includeCatalogIds: [],
	// 			excludeCatalogIds: []
	// 		};
	//
	// 		const modifications = this.getModified();
	// 		result.includeCatalogIds = modifications.filter(function (item) {
	// 			return item.Version === 0 && item.MdcMaterialCatalogFk !== null;
	// 		}).map(function (item) {
	// 			return item.MdcMaterialCatalogFk;
	// 		});
	// 		const deleted = this.getDeleted();
	// 		result.excludeCatalogIds = deleted.filter(function (item) {
	// 			return item.MdcMaterialCatalogFk !== null;
	// 		}).map(function (item) {
	// 			return item.MdcMaterialCatalogFk;
	// 		});
	//
	// 		return result;
	// 	}
	// 	return null;
	// }

	private updateHeaderCUtoItemBoq(entity: IPrcPackageEntity) {
		// todo chi: common logic is not available
		// let procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService').getService();
		// let itemList = itemService.getService().getList();
		// let prcBoqList = procurementCommonPrcBoqService.getList();
		// let boqService = $injector.get('prcBoqMainService').getService();
		// let boqItemList = boqService.getList();
		// for (let i = 0; i < itemList.length; i++) {
		// 	itemList[i].MdcControllingunitFk = entity.MdcControllingUnitFk;
		// 	itemService.getService().markItemAsModified(itemList[i]);
		// }
		// for (let i = 0; i < prcBoqList.length; i++) {
		// 	prcBoqList[i].PrcBoq.MdcControllingunitFk = entity.MdcControllingUnitFk;
		// 	procurementCommonPrcBoqService.markItemAsModified(prcBoqList[i]);
		// }
		// for (let i = 0; i < boqItemList.length; i++) {
		// 	boqItemList[i].MdcControllingunitFk = entity.MdcControllingUnitFk;
		// 	boqService.markItemAsModified(boqItemList[i]);
		// }
	}

	private needUpdateDateFromActivity(
		entityActivity: {
			// todo chi: use activity if available
			PlannedStart?: Date;
			PlannedFinish?: Date;
			ActualStart?: Date;
			ActualFinish?: Date;
		},
		entityPackage: IPrcPackageEntity,
	) {
		if (entityActivity && entityPackage) {
			const activityPlannedStart = entityActivity.PlannedStart ? this.dateService.formatUTC(entityActivity.PlannedStart, 'yyyy-MM-dd') : null; // todo chi: right?
			const activityPlannedEnd = entityActivity.PlannedFinish ? this.dateService.formatUTC(entityActivity.PlannedFinish, 'yyyy-MM-dd') : null;
			const activityActualStart = entityActivity.ActualStart ? this.dateService.formatUTC(entityActivity.ActualStart, 'yyyy-MM-dd') : null;
			const activityActualEnd = entityActivity.ActualFinish ? this.dateService.formatUTC(entityActivity.ActualFinish, 'yyyy-MM-dd') : null;

			const packagePlannedStart = entityPackage.PlannedStart ? this.dateService.formatLocal(entityPackage.PlannedStart, 'yyyy-MM-dd') : null; // todo chi: right?
			const packagePlannedEnd = entityPackage.PlannedEnd ? this.dateService.formatLocal(entityPackage.PlannedEnd, 'yyyy-MM-dd') : null;
			const packageActualStart = entityPackage.ActualStart ? this.dateService.formatLocal(entityPackage.ActualStart, 'yyyy-MM-dd') : null;
			const packageActualEnd = entityPackage.ActualEnd ? this.dateService.formatLocal(entityPackage.ActualEnd, 'yyyy-MM-dd') : null;

			if (packagePlannedStart !== activityPlannedStart || packagePlannedEnd !== activityPlannedEnd || packageActualStart !== activityActualStart || packageActualEnd !== activityActualEnd) {
				return true;
			}
		}
		return false;
	}

	private setPackageDateFromActivity(
		entity: IPrcPackageEntity,
		activityItem: {
			// todo chi: use activity if available
			PlannedStart?: Date;
			PlannedFinish?: Date;
			ActualStart?: Date;
			ActualFinish?: Date;
		},
	) {
		if (entity && activityItem && this.needUpdateDateFromActivity(activityItem, entity)) {
			entity.PlannedStart = activityItem.PlannedStart ? this.dateService.getUTC(activityItem.PlannedStart) : undefined;
			entity.PlannedEnd = activityItem.PlannedFinish ? this.dateService.getUTC(activityItem.PlannedFinish) : undefined;
			entity.ActualStart = activityItem.ActualStart ? this.dateService.getUTC(activityItem.ActualStart) : undefined;
			entity.ActualEnd = activityItem.ActualFinish ? this.dateService.getUTC(activityItem.ActualFinish) : undefined;
			this.setModified(entity);
			return true;
		}
		return false;
	}

	private async onProjectChanged(args: IPropertyChangedEvent<IPrcPackageEntity>) {
		const result = await lastValueFrom(this.http.get<IProjectEntity[]>(this.configService.webApiBaseUrl + 'project/main/byid?id=' + args.newValue));
		if (isArray(result) && result.length === 1) {
			const oldAssetMaster = args.entity.AssetMasterFk;

			args.entity.AssetMasterFk = result[0].AssetMasterFk?result[0].AssetMasterFk:undefined;
			const validateService = ServiceLocator.injector.get(ProcurementPackageHeaderValidationService);
			await validateService.validateAssetMasterFk({
				entity: args.entity,
				value: result[0].AssetMasterFk || undefined,
				field: 'AssetMasterFk',
			});

			if (!args.entity.AddressEntity) {
				let addressFk: number | null | undefined = null;

				// 1.get address from asset master
				if (result[0].AssetMasterFk) {
					const assetMaster = await lastValueFrom(this.http.get<IBasicsAssetMasterEntity>(this.configService.webApiBaseUrl + 'basics/assetmaster/get?id=' + result[0].AssetMasterFk));
					addressFk = assetMaster ? assetMaster.AddressFk : null;
				}

				// 2. if asset master have no address ,then get from project
				addressFk = addressFk || result[0].AddressFk;

				// 3.if have fk,then load remote data
				if (addressFk) {
					await this.updateAddress(args.entity, addressFk);
				}
			} else {
				if (result[0].AssetMasterFk && result[0].AssetMasterFk !== oldAssetMaster) {
					const assetMaster = await lastValueFrom(this.http.get<IBasicsAssetMasterEntity>(this.configService.webApiBaseUrl + 'basics/assetmaster/get?id=' + result[0].AssetMasterFk));

					if (assetMaster && assetMaster.AddressFk) {
						await this.updateAddress(args.entity, assetMaster.AddressFk);
					}
				}
			}
		}
	}

	private existsCheckingPackageId(id: number) {
		return this.checkingPackages.indexOf(id) > -1;
	}

	private setCheckingPackageId(id: number) {
		this.checkingPackages.push(id);
	}

	private removeCheckingPackageId(id: number) {
		const idx = this.checkingPackages.indexOf(id);

		if (idx !== -1) {
			this.checkingPackages.splice(idx, 1);
		}
	}

	private existsRefreshPackageId(id: number) {
		return this.refreshPackages.indexOf(id) > -1;
	}

	private setRefreshPackageId(id: number) {
		return this.refreshPackages.push(id);
	}

	private removeRefreshPackageId(id: number) {
		const idx = this.refreshPackages.indexOf(id);
		if (idx !== -1) {
			this.refreshPackages.splice(idx, 1);
		}
	}

	private async showDialog(msg: string, title: string, iconCss: string, allowShowDialog?: boolean) {
		if (allowShowDialog === undefined) {
			allowShowDialog = true;
		}
		if (allowShowDialog) {
			await this.messageBoxService.showMsgBox({
				headerText: title,
				bodyText: this.sanitizer.bypassSecurityTrustHtml(msg),
				iconClass: iconCss,
			});
		}
	}

	private async hasContracts(packageId: number) {
		return await this.httpService.get<boolean>('procurement/contract/header/packagehascontract?packageId=' + packageId);
	}

	private checkPackageIsChangedInBaseline(entity: IPrcPackageEntity) {
		return this.http.post<ICheckChangeResult>(this.configService.webApiBaseUrl + 'procurement/package/baseline/checkpackageischanged', entity);
	}

	private checkAndUpdatePakcageFromBaseLine(entity: { Package: IPrcPackageEntity; ChangeResult: ICheckChangeResult }) {
		return this.http.post<IUpdateResult>(this.configService.webApiBaseUrl + 'procurement/package/baseline/checkandupdatepackage', entity);
	}

	private async showBlockDialog() {
		await this.showDialog(this.translationService.instant('procurement.package.updatePackageFromBaseline.checking').text, this.translationService.instant('procurement.package.updatePackageFromBaseline.title').text, 'ico-info', true);
	}

	private async asyncPackageDataFromBaseLine(entity: IPrcPackageEntity) {
		if (!entity || !entity.BaselinePath || !entity.BaselineUpdate) {
			return;
		}

		const testMaterialPackage = /\\[^\\]+?\s*V\d+\s*P\d+\\PAs\\[\d\w]+?\\\w+\d+-[\d\w]+\\([\d\w]+\\)*\w+\d+-[\d\w]+/gi;
		const currentIsMaterialPackage = !!testMaterialPackage.exec(entity.BaselinePath);

		const currentPackageId = entity.Id;
		console.log(currentPackageId);

		if (this.existsCheckingPackageId(currentPackageId) || this.existsRefreshPackageId(currentPackageId)) {
			return;
		} else {
			this.setCheckingPackageId(currentPackageId);
		}

		const isShowService = ServiceLocator.injector.get(ProcurementPackageSystemOptionShowPackageAutoUpdateDialogService);
		const packageStatusLookupService = ServiceLocator.injector.get(BasicsSharedPackageStatusLookupService);

		const showBlockDialog = isShowService.getIsShow();
		const status = await lastValueFrom(packageStatusLookupService.getItemByKey({ id: entity.PackageStatusFk }));

		if (!status.IsUpdateImport) {
			const strTitle = this.translationService.instant('procurement.package.updatePackageFromBaseline.title').text;
			const strBody = this.translationService.instant('procurement.common.errorTip.recordIsReadOnlyBody').text;
			await this.showDialog(strBody, strTitle, 'ico-info', showBlockDialog);
			this.removeCheckingPackageId(currentPackageId);
			return;
		}

		const hasContracts = await this.hasContracts(entity.Id);
		if (hasContracts && currentIsMaterialPackage) {
			const strTitle = this.translationService.instant('procurement.package.updatePackageFromBaseline.title').text;
			const strBody = this.translationService.instant('procurement.package.updatePackageFromBaseline.notUpdate').text;
			await this.showDialog(strBody, strTitle, 'ico-info', showBlockDialog);
			this.removeCheckingPackageId(currentPackageId);
			return;
		} else {
			const deadlineTime = entity.DeadlineTime;
			const subscription1 = this.checkPackageIsChangedInBaseline(entity).subscribe({
				next: (packageIsChangedInBaseline) => {
					subscription1.unsubscribe();
					const title = this.translationService.instant('procurement.package.updatePackageFromBaseline.title').text;
					if (packageIsChangedInBaseline && packageIsChangedInBaseline.IsChanged && packageIsChangedInBaseline.Id === entity.Id) {
						if (showBlockDialog) {
							this.showBlockDialog();
						}

						const subscription2 = this.checkAndUpdatePakcageFromBaseLine({
							Package: entity,
							ChangeResult: packageIsChangedInBaseline,
						}).subscribe({
							next: (data) => {
								subscription2.unsubscribe();
								if (data) {
									let msg = '';
									if (data.ResultCode === this.updateCodeEnum.NotChange) {
										this.removeCheckingPackageId(currentPackageId);
									} else if (data.ResultCode === this.updateCodeEnum.GetDataFromBaseLineSuccess) {
										this.removeCheckingPackageId(currentPackageId);
									} else if (data.ResultCode === this.updateCodeEnum.GetDataFromBaseLineFailed) {
										msg = data.Message || this.updateCodeEnum.GetDataFromBaseLineFailedMsg;

										this.showDialog(msg, title, 'ico-error');
										this.removeCheckingPackageId(currentPackageId);
									} else if (data.ResultCode === this.updateCodeEnum.UpdateSuccess) {
										this.setRefreshPackageId(currentPackageId);
										this.refreshAllLoaded();
										msg = data.Message || this.updateCodeEnum.UpdateSuccessMsg;
										this.showDialog(msg, title, 'ico-info', showBlockDialog).then(() => {
											this.removeCheckingPackageId(currentPackageId);
											this.removeRefreshPackageId(currentPackageId);
										});
									} else if (data.ResultCode === this.updateCodeEnum.UpdateFailed) {
										msg = data.Message || this.updateCodeEnum.UpdateFailedMsg;
										this.showDialog(msg, title, 'ico-error');
										this.removeCheckingPackageId(currentPackageId);
									}
								}
								this.removeCheckingPackageId(currentPackageId);
								entity.DeadlineTime = deadlineTime;
							},
							error: () => {
								subscription2.unsubscribe();
								this.removeCheckingPackageId(currentPackageId);
								entity.DeadlineTime = deadlineTime;
							},
						});
					} else {
						const msg = packageIsChangedInBaseline.ErrorMsg;
						if (msg && !isEmpty(msg)) {
							this.showDialog(msg, title, 'ico-error');
							this.removeCheckingPackageId(currentPackageId);
						} else {
							this.removeCheckingPackageId(currentPackageId);
						}
						entity.DeadlineTime = deadlineTime;
					}
				},
				error: () => {
					subscription1.unsubscribe();
					this.removeCheckingPackageId(currentPackageId);
					entity.DeadlineTime = deadlineTime;
				},
			});
		}
	}

	public isEntityReadonly(entity?: IPrcPackageEntity): boolean {
		const selected = entity ?? this.getSelectedEntity();
		if (selected) {
			const status = this.packageStatusService.syncService?.getListSync().find(e => e.Id === selected.PackageStatusFk);
			return status?.IsReadOnly ?? false;
		}
		return true;
	}

	/**
	 * Handle on exchange rate changed
	 * @param entity
	 * @param exchangeRate
	 * @param isUpdateByCurrency
	 * @param isRemainHomeCurrency
	 */
	public onExchangeRateChanged(entity: IPrcPackageEntity, exchangeRate: number, isUpdateByCurrency: boolean, isRemainHomeCurrency: boolean = false): void {
		ServiceLocator.injector.get(ProcurementPackageOverallDiscountService).updateOverallDiscountAfterExchangeRateChanged(entity, exchangeRate, isRemainHomeCurrency);
		if (isUpdateByCurrency) {
			this.readonlyProcessor.process(entity);
		}
	}
	public getHeaderEntity(): IPrcHeaderEntity {
		const dataPackage = this.getSelectedEntity();
		const dataPrcHeader: IPrcHeaderEntity = {
			Id: 0,
			BpdEvaluationFk: 0,
			ConfigurationFk: 0,
			StrategyFk: 0,
			StructureFk: 0,
			TaxCodeFk: 0,
		};
		if (dataPackage && dataPackage.ConfigurationFk) {
			dataPrcHeader.ConfigurationFk = dataPackage.ConfigurationFk;
			return dataPrcHeader;
		}
		return dataPrcHeader;
	}



	public updateTotalLeadTime(value: number) {
		const entity = this.getSelectedEntity()!;
		entity.TotalLeadTime = value;
	}

	public getInternalModuleName(): string {
		return ProcurementInternalModule.Package;
	}

	public isValidForSubModule(): boolean {
		const packageEntity = this.getSelectedEntity()!;
		return packageEntity !== null && packageEntity.Id !== undefined;
	}

	// todo chi: getDefaultListForCreated -> used for characteristic, getConfigurationFk
	// todo chi: cell changed: selectedPackageStatus
	// todo chi: messages: onParentUpdated, onRecalculationItemsAndBoQ(common logic is not available)
	//  onFilterLoaded, onFilterUnLoaded
	// todo chi: navigation
	// todo chi: module header info: updateModuleHeaderInfo
	// todo chi: related to boq: before wizard exec: updateAndExecute, formatDateValueObjectToString, setFormatValue
	// todo chi: use in Contract's behavior: getPackageById (move to contract data service)
	// todo chi: setCharacteristicColumn, characteristicColumn, getCharacteristicColumn

	// done: vatGroupChanged(replace by entityProxy), getItemsOrBoqs(it seems obsolete), completeItemCreated(use rootDataCreated$ instead),
	//  totalFactorsChangedEvent(obsolete), taxCodeFkChanged(replace by entityProxy, subpackage), projectFkChanged(replace by entityProxy, subpackage),
	//  assetMasterFkChanged(removed), onStructureFkChanged(replace by entityProxy), onBusinessPartnerFkChanged(replace by entityProxy),
	//  controllingUnitChanged(replace by entityProxy), getChangedRootEntitiesAsArray(done in getmodificationsfromupdate),
	//  controllingUnitToItemBoq(check common one later), PackageStatusChangedByWizard(no need in new framework), onPropertyChanged(replace by entityProxy),
	//  onPrcEventProperChanged(obsolete), getHeaderEditAble(replace by header context, subpackage), getPrcPacMasterRestrictionInfo(move to master restriction)
}