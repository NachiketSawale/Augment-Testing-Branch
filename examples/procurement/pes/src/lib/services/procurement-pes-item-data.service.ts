/*
 * Copyright(c) RIB Software GmbH
 */

import { difference, filter, isArray, maxBy, sumBy } from 'lodash';
import { DataServiceFlatNode, EntityDateProcessorFactory, IDataServiceChildRoleOptions, IEntityProcessor, ServiceRole } from '@libs/platform/data-access';
import { IItemReadonly, IItemsCopyResultEntity, IItemsResultEntity, IPesHeaderEntity, IPesItemEntity } from '../model/entities';
import { Injectable, inject } from '@angular/core';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import {
	BasicsSharedCompanyContextService,
	BasicsSharedMaterialLookupService,
	BasicsSharedNewEntityValidationProcessorFactory,
	BasicsSharedRoundingFactoryService,
	BasicsSharedRoundingModule as roundingModule, BasicsShareProcurementConfigurationToBillingSchemaLookupService,
	IMaterialSearchEntity,
	MainDataDto
} from '@libs/basics/shared';
import { IExchangeRateChangedEvent, IPrcItemEntity, IPrcStockDto, IPrcStructureDto } from '@libs/procurement/common';
import { ProcurementPesItemReadonlyProcessor } from './processors/procurement-pes-item-readonly-processor.class';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { EntityProxy, IPropertyChangedEvent, Nullable, PrcStockTransactionTypeLookupService, ProcurementShareContractLookupService, ProcurementSharedPrcItemLookupService, ProcurementSharedPrcItemMergedLookupService } from '@libs/procurement/shared';
import { Subject, firstValueFrom } from 'rxjs';
import { ProcurementPesItemCalculationProcessor } from './processors/procurement-pes-item-calculation-processor.class';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { ControllingSharedControllingUnitLookupService } from '@libs/controlling/shared';
import { IBasicsPriceConditionHeaderService } from '@libs/basics/interfaces';
import { IPrcItemLookupVEntity } from '@libs/procurement/interfaces';
import { bignumber } from 'mathjs';
import { ProcurementPesItemCalculationService } from './procurement-pes-item-calculation.service';
import { ProcurementPesItemValidationService } from './validations/procurement-pes-item-validation.service';
import { PROCUREMENT_PES_ENTITY_SCHEMA_ID } from '../model/procurement-pes-entity-schema-id.model';
import { ProcurementPesPriceConditionDataService } from './procurement-pes-price-condition-data.service';
import { PesItemComplete } from '../model/complete-class/pes-item-complete.class';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';

/**
 * Pes item container data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesItemDataService extends DataServiceFlatNode<IPesItemEntity, PesItemComplete, IPesHeaderEntity, PesCompleteNew> implements IBasicsPriceConditionHeaderService<IPesItemEntity, PesItemComplete> {
	private isPesHeaderReadonly = false;

	protected prcStockList: IPrcStockDto[] = [];
	protected prcStructureList: IPrcStructureDto[] = [];
	private readonly prcConfig2BSchemaLookupService = inject(BasicsShareProcurementConfigurationToBillingSchemaLookupService);
	public readonly http = inject(PlatformHttpService);
	public readonly companyContext = inject(BasicsSharedCompanyContextService);
	public readonly prcStockTransactionTypeLookupService = inject(PrcStockTransactionTypeLookupService);
	public readonly prcItemMergedLookupService = inject(ProcurementSharedPrcItemMergedLookupService);
	public readonly materialLookupService = inject(BasicsSharedMaterialLookupService);
	public readonly conHeaderLookupService = inject(ProcurementShareContractLookupService);
	public readonly roundingService = BasicsSharedRoundingFactoryService.getService(roundingModule.basicsMaterial);
	public readonly calculationService = inject(ProcurementPesItemCalculationService);
	public readonly roundingType = this.calculationService.roundingType;
	public readonly messageBoxService = inject(UiCommonMessageBoxService);
	public readonly controllingUnitLookupService = inject(ControllingSharedControllingUnitLookupService);
	public readonly prcItemLookupService = inject(ProcurementSharedPrcItemLookupService);

	public readonly entityProxy = new EntityProxy<IPesItemEntity>(this);
	public readonly entityDeleted$ = new Subject<IPesItemEntity[]>();
	/**
	 * Emitter for priceCondition change
	 */
	public priceConditionChanged$ = new Subject<number | null>();

	public get selectedPesHeader() {
		return this.getSelectedParent();
	}

	public get currentPesHeader() {
		if (!this.selectedPesHeader) {
			throw new Error('No pes header is selected');
		}
		return this.selectedPesHeader!;
	}

	public get loginCompanyEntity() {
		return this.companyContext.loginCompanyEntity;
	}

	public get isCalculateOverGross() {
		return this.loginCompanyEntity.IsCalculateOverGross;
	}

	public get pesPriceConditionService() {
		return ServiceLocator.injector.get(ProcurementPesPriceConditionDataService);
	}

	public readonly readonlyProcessor: ProcurementPesItemReadonlyProcessor;
	public readonly calculationProcessor: ProcurementPesItemCalculationProcessor;

	public constructor(public parentService: ProcurementPesHeaderDataService) {
		super({
			apiUrl: 'procurement/pes/item',
			readInfo: {
				endPoint: 'list',
			},
			createInfo: {
				endPoint: 'createnew',
			},
			roleInfo: <IDataServiceChildRoleOptions<IPesItemEntity, IPesHeaderEntity, PesCompleteNew>>{
				role: ServiceRole.Node,
				itemName: 'Item',
				parent: parentService,
			},
		});

		this.readonlyProcessor = new ProcurementPesItemReadonlyProcessor(this);
		this.calculationProcessor = new ProcurementPesItemCalculationProcessor(this);
		this.processor.addProcessor(this.readonlyProcessor);
		this.processor.addProcessor(this.calculationProcessor);
		this.processor.addProcessor(this.provideNewEntityValidationProcessor());
		this.processor.addProcessor(this.provideDateProcessor());
		this.subscribePesHeader();
	}

	private provideDateProcessor(): IEntityProcessor<IPesItemEntity> {
		const dateProcessorFactory = inject(EntityDateProcessorFactory);
		return dateProcessorFactory.createProcessorFromSchemaInfo<IPesItemEntity>(PROCUREMENT_PES_ENTITY_SCHEMA_ID.pesItem);
	}

	private provideNewEntityValidationProcessor() {
		const newEntityValidationProcessorFactory = inject(BasicsSharedNewEntityValidationProcessorFactory);
		return newEntityValidationProcessorFactory.createProcessor(ProcurementPesItemValidationService, PROCUREMENT_PES_ENTITY_SCHEMA_ID.pesItem);
	}

	private subscribePesHeader() {
		this.parentService.entityProxy.propertyChanged$.subscribe(async (e) => {
			switch (e.field) {
				case 'PesStatusFk':
				case 'PrcConfigurationFk':
					await this.readonlyProcessor.updateEntityListReadonly();
					break;
				case 'BpdVatGroupFk':
					await this.handlePesHeaderVatGroupChanged(e);
					break;
				case 'ConHeaderFk':
					await this.onParentConHeaderChanged(e);
					break;
				case 'ControllingUnitFk':
					this.onControllingUnitFkChanged(e);
					break;
			}
		});

		this.parentService.exchangeRateChanged$.subscribe((e) => {
			this.handlePesHeaderExchangeRateChanged(e);
		});

		this.parentService.selectionChanged$.subscribe((e) => {
			this.checkPesHeaderReadonly();
		});
	}

	private async handlePesHeaderVatGroupChanged(e: IPropertyChangedEvent<IPesHeaderEntity>) {
		const oldVatGroupFk = e.oldValue as number;
		const newVatGroupFk = e.newValue as number;
		for (const item of this.getList()) {
			if (item.MdcTaxCodeFk) {
				const oldVatPercent = this.getVatPercent(item, oldVatGroupFk);
				const newVatPercent = this.getVatPercent(item, newVatGroupFk);
				if (oldVatPercent !== newVatPercent) {
					//TODO DEV-21613 lookup service need to introduce a 'getItemsByKey' function
					await this.calculateAfterVatPercentChanged(item, newVatPercent);
				}
			}
		}
	}

	protected async calculateAfterVatPercentChanged(pesItem: IPesItemEntity, vatPercent?: number) {
		vatPercent = vatPercent ?? this.getVatPercent(pesItem);
		const exchangeRate = this.getParentExchangeRate();
		const priceUnitAndFactor = await this.getFactorAndPriceUnit(pesItem);
		const originTotal = pesItem.Total;
		const originTotalOc = pesItem.TotalOc;

		this.calculationService.calculateAfterVatPercentChanged(pesItem, vatPercent, exchangeRate, priceUnitAndFactor.PriceUnit, priceUnitAndFactor.FactorPriceUnit);

		if (this.isCalculateOverGross) {
			this.calculateRelatedFieldsAfterUpdateTotal(pesItem, originTotal, originTotalOc, vatPercent);
		}

		this.setModified(pesItem);
	}

	protected onControllingUnitFkChanged(e: IPropertyChangedEvent<IPesHeaderEntity>) {
		const newCtrUnitFk = e.newValue as number;
		this.getList()
			.filter((pesItem) => pesItem.ControllingUnitFk == null)
			.forEach((pesItem) => {
				pesItem.ControllingUnitFk = newCtrUnitFk;
				this.setModified(pesItem);
			});
	}

	/**
	 * If the con header changed and there are no items under this pes header
	 * Set the prc structure fk of pes header as the corresponding prc structure of the prc header.
	 * @param e
	 * @protected
	 */
	protected async onParentConHeaderChanged(e: IPropertyChangedEvent<IPesHeaderEntity>) {
		const newConHeaderFk = e.newValue as number;
		const pesItems = this.getList();
		if (pesItems && pesItems.length === 0 && newConHeaderFk) {
			const params = {
				conHeaderId: newConHeaderFk,
			};

			e.entity.PrcStructureFk =  await this.http.post<number>('procurement/pes/header/getstructureId', params);
			this.parentService.setModified(e.entity);
		}
	}

	private handlePesHeaderExchangeRateChanged(e: IExchangeRateChangedEvent) {
		this.getList().forEach((item: IPesItemEntity) => {
			item.Price = this.calculationService.getPriceByPriceOc(item, e.exchangeRate);
			item.PriceGross = this.calculationService.getPriceGrossByPriceGrossOc(item, e.exchangeRate);
			this.pesPriceConditionService.recalculate(item.PrcPriceConditionFk);
		});
	}

	protected override checkCreateIsAllowed(entities: IPesItemEntity[] | IPesItemEntity | null): boolean {
		return super.checkCreateIsAllowed(entities) && !this.isPesHeaderReadonly;
	}

	protected override checkDeleteIsAllowed(entities: IPesItemEntity[] | IPesItemEntity | null): boolean {
		return super.checkDeleteIsAllowed(entities) && !this.isPesHeaderReadonly;
	}

	protected override provideLoadPayload(): object {
		return {
			MainItemId: this.currentPesHeader.Id,
		};
	}

	protected override onLoadSucceeded(loaded: object): IPesItemEntity[] {
		const dto = new MainDataDto<IPesItemEntity>(loaded);
		const entities = dto.Main;

		this.prcStockList = dto.getValueAs<IPrcStockDto[]>('_Prcstock')!;
		this.prcStructureList = dto.getValueAs<IPrcStructureDto[]>('_Prcstructure')!;

		// todo - dynamic cost group columns

		return entities;
	}

	protected override provideCreatePayload(): object {
		const creationData = {
			MainItemId: this.currentPesHeader.Id,
			ProjectFk: this.currentPesHeader.ProjectFk,
			PrcStructureFk: this.currentPesHeader.PrcStructureFk,
			PackageFk: this.currentPesHeader.PackageFk,
			MaxItemNo: (maxBy(this.getList(), (e) => e.ItemNo))?.ItemNo ?? 0,
			ConHeaderFk: this.currentPesHeader.ConHeaderFk,
			ControllingUnitFk: this.currentPesHeader.ControllingUnitFk,
			PrcConfigurationFk: this.currentPesHeader.PrcConfigurationFk,
		};

		return creationData;
	}

	protected override onCreateSucceeded(created: object): IPesItemEntity {
		const entity = created as IPesItemEntity;

		entity.ItemNo = this.nextItemNo(this.maxItemNo());

		return entity;
	}

	public checkPesHeaderReadonly() {
		this.isPesHeaderReadonly = this.parentService.isEntityReadonly(this.currentPesHeader);
		return this.isPesHeaderReadonly;
	}

	private maxItemNo() {
		return maxBy(this.getList().map((e) => e.ItemNo));
	}

	private nextItemNo(maxItemNo?: number) {
		if (!maxItemNo) {
			maxItemNo = 0;
		}
		return maxItemNo + 1;
	}

	public override createUpdateEntity(modified: IPesItemEntity | null): PesItemComplete {
		const complete = new PesItemComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
		}
		return complete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PesCompleteNew, modified: PesItemComplete[], deleted: IPesItemEntity[]) {
		if (modified?.some(() => true)) {
			parentUpdate.ItemToSave = modified;
		}

		if (deleted?.some(() => true)) {
			parentUpdate.ItemToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PesCompleteNew): IPesItemEntity[] {
		if (parentUpdate?.ItemToSave) {
			return parentUpdate.ItemToSave.map((e) => e.Item!);
		}
		return [];
	}

	public override isParentFn(parentKey: IPesHeaderEntity, entity: IPesItemEntity): boolean {
		return entity.PesHeaderFk === parentKey.Id;
	}

	public async loadProjectStocks(entities: IPesItemEntity[]) {
		return await this.http.post<IItemsResultEntity[]>('procurement/pes/item/getmaterial2projectstocks', entities);
	}

	public async loadProvisionsAllowed(entities: IPesItemEntity[]) {
		return await this.http.post<IItemReadonly[]>('procurement/pes/item/getprovisionsallowed', entities);
	}

	public async loadPrcItem(entity: IPesItemEntity) {
		if (!entity.PrcItemFk) {
			return null;
		}

		return await this.http.get<IPrcItemEntity>('procurement/common/prcitem/getbyid', {
				params: {
					id: entity.PrcItemFk,
				},
			});
	}

	public async getPrjStockResult(entity: IPesItemEntity) {
		const cacheStructure = this.prcStructureList;
		const prcStructureFk = entity.PrcStructureFk;
		const mdcMaterialFk = entity.MdcMaterialFk;
		let defaultPrcStockTranTypeFk: number | null | undefined = (await this.prcStockTransactionTypeLookupService.getDefault())?.Id;
		const result: {
			PrjStockFk?: number | null;
			PrcStockTransactionTypeFk?: number | null;
		} = {
			PrjStockFk: null,
			PrcStockTransactionTypeFk: entity.PrcStockTransactionTypeFk,
		};

		if (!defaultPrcStockTranTypeFk && defaultPrcStockTranTypeFk !== 0) {
			defaultPrcStockTranTypeFk = entity.PrcStockTransactionTypeDefaultFk;
		}

		if (entity.PrcItemFk) {
			const prcItem = await firstValueFrom(this.prcItemMergedLookupService.getItemByKey({id: entity.PrcItemFk}));

			if (prcItem.PrjStockFk) {
				result.PrjStockFk = prcItem.PrjStockFk;
				result.PrcStockTransactionTypeFk = defaultPrcStockTranTypeFk;
				return result;
			}
		}

		// 1.PES_ITEM.MDC_MATERIAL_FK is not NULL
		if (mdcMaterialFk === null) {
			return result;
		}

		// 2.PES_ITEM.PRC_STRUCTURE_FK.ISSTOCKEXCLUDED = FALSE
		const PrcstructureItem = filter(cacheStructure, (item) => {
			/** @namespace item.PrcstructureId */
			return item.PrcstructureId === prcStructureFk;
		});
		/** @namespace PrcstructureItem.IsStockexcluded */
		if (PrcstructureItem.length === 0 || PrcstructureItem[0].IsStockexcluded) {
			return result;
		}

		// 3-1.PES_ITEM.MDC_CONTROLLINGUNIT is not null
		// 3-2.PES_ITEM.pes_header_fk.MDC_CONTROLLUNIT_FK instead if PES_ITEM.MDC_CONTROLLINGUNIT.ISSTOCKMANAGEMENT is null
		// 3-3.PES_ITEM.PRC_ITEM_FK.MDC_CONTROLLUNIT_FK(prc_item_fk is not null) instead if ES_ITEM.pes_header_fk.MDC_CONTROLLUNIT_FK is null
		// 3-4.PES_ITEM.CON_HEADER.MDC_CONTROLLUNIT instead if PES_ITEM.PRC_ITEM_FK.MDC_CONTROLLUNIT_FK is null
		// if pes_item.mdc_controllingunit.fk is not null, then check pes_item.mdc_controllingunit.fk.isstockmamgerment,
		// if true,columns about stock in item container should be enable,
		// if  false, then those columns should be read only.
		const ControllingUnitFk = await this.getConnectedControllingUnitFk(entity);
		if (ControllingUnitFk) {
			result.PrjStockFk = this.getPrjStockIdByControllingUnitFk(ControllingUnitFk);
			return result;
		}

		return result;
	}

	private async getConnectedControllingUnitFk(entity: IPesItemEntity) {
		let controllingUnitFk = entity.ControllingUnitFk || this.currentPesHeader.ControllingUnitFk;

		if (!controllingUnitFk) {
			const prcItem = await firstValueFrom(this.prcItemMergedLookupService.getItemByKey({id: entity.PrcItemFk!}));
			controllingUnitFk = prcItem?.ControllingUnitFk;
		}
		if (!controllingUnitFk && entity.ConHeaderFk != null) {
			const conHeader = await firstValueFrom(this.conHeaderLookupService.getItemByKey({id: entity.ConHeaderFk}));
			controllingUnitFk = conHeader?.ControllingUnitFk;
		}

		return controllingUnitFk;
	}

	private getPrjStockIdByControllingUnitFk(controllingUnitFk: number) {
		return this.prcStockList.find((e) => e.ControllingunitId === controllingUnitFk && e.PrcstockId != null && e.IsStockmanagement)?.PrcstockId;
	}

	public getVatPercent(entity: IPesItemEntity, vatGroupFk?: number) {
		if (!entity.MdcTaxCodeFk) {
			return 0;
		}

		return this.parentService.getVatPercentWithTaxCodeMatrix(entity.MdcTaxCodeFk, vatGroupFk);
	}

	/**
	 * Get parent exchange rate
	 * @protected
	 */
	public getParentExchangeRate(): number {
		const pesHeader = this.parentService.getSelectedEntity();
		return pesHeader?.ExchangeRate ?? 1;
	}

	public override delete(entities: IPesItemEntity[] | IPesItemEntity) {
		super.delete(entities);

		const list = isArray(entities) ? (entities as IPesItemEntity[]) : [entities as IPesItemEntity];
		this.updateQuantityDeliveredNRemaining(list);
		this.entityDeleted$.next(list);
	}

	public updateQuantityDeliveredNRemaining(entitiesToDelete: IPesItemEntity[]) {
		entitiesToDelete.forEach((entityToDelete) => {
			if (!entityToDelete.Quantity || !entityToDelete.PrcItemFk) {
				return;
			}

			this.getList()
				.filter((e) => e.PrcItemFk === entityToDelete.PrcItemFk)
				.forEach((e) => {
					e.QuantityDelivered -= this.roundingService.doRounding(this.roundingType.QuantityDelivered, entityToDelete.Quantity);
					e.QuantityRemaining += this.roundingService.doRounding(this.roundingType.QuantityRemaining, entityToDelete.Quantity);
					this.setModified(e);
				});
		});
	}

	public canDeepCopy() {
		const entity = this.getSelectedEntity();
		return entity != null && !this.isPesHeaderReadonly;
	}

	public async deepCopy() {
		const pesHeader = this.currentPesHeader;
		const entities = this.getSelection();

		if (!entities.length) {
			await this.messageBoxService.showMsgBox('cloud.common.noItemSelection', 'Info', 'ico-info');
			return;
		}

		const result = await this.http.post<IItemsCopyResultEntity>('procurement/pes/item/deepcopy', {
				// todo - https://rib-40.atlassian.net/browse/DEV-20890, not sure why it is needed to pass price condition ids, not a normal logic, should be avoided.
				CachedItemIds: [],
				PesItemDtos: entities,
				MaxItemNo: this.maxItemNo(),
			});

		await Promise.all(
			result.PesItems.map(async (complete) => {
				const pesItem = complete.Item!;

				if (pesItem.PrcPriceConditionFk) {
					await this.reloadPriceCondition(pesHeader, pesItem);
				}

				this.calculatePesItem(pesItem);

				if (pesItem.PrcItemFk) {
					await this.reloadCostGroup(pesHeader, pesItem);
					await this.reloadControllingGroupSet(pesHeader, pesItem);
				}

				this.setModified(pesItem);
				this.append(pesItem);
				await this.select(pesItem);
			}),
		);
	}

	public canCreateOtherItems() {
		return this.selectedPesHeader != null && !this.isPesHeaderReadonly;
	}

	public async createOtherItems(args: {
		conHeaderFk?: number | null;
		projectFk?: number | null;
		isIncludeNonContractedPesItems?: boolean | null;
		selectedItem?: IPesItemEntity | null;
		contractItems?: IPrcItemLookupVEntity[];
		callBackAfterCreate?: (entities: IPesItemEntity[]) => void;
	}) {
		const pesHeader = this.currentPesHeader;
		const conHeaderFk = args.conHeaderFk;
		const projectFk = args.projectFk;
		const currentItem = args.selectedItem;
		let contractItems = args.contractItems;

		if (this.currentPesHeader.PesHeaderFk) {
			args.isIncludeNonContractedPesItems = false;
		}

		if (!contractItems) {
			contractItems = await this.http.post<IPrcItemLookupVEntity[]>('procurement/common/prcitem/getitems4create', {
					IsCanceled: false,
					ContractId: conHeaderFk,
					PesHeaderId: pesHeader.Id,
					IncludeDeliveredCon: true,
				});
		}

		if (!contractItems?.length) {
			return;
		}

		const pesItemList = this.getList();
		const referencedPrcItemIds = pesItemList.filter((e) => e.PrcItemFk != null).map((e) => e.PrcItemFk);
		const contractPrcItemIds = contractItems.map((e) => e.Id);
		const remainingPrcItemIds = difference(contractPrcItemIds, referencedPrcItemIds);

		if (currentItem && currentItem.PrcItemFk == null && remainingPrcItemIds.length > 0) {
			const firstPrcItemId = remainingPrcItemIds.shift()!;
			await this.setPesItemByPrcItem(pesHeader, currentItem, contractItems.find((e) => e.Id === firstPrcItemId)!);
			await this.readonlyProcessor.updateEntityReadonly(currentItem);
		}

		if (!remainingPrcItemIds.length) {
			return;
		}

		const nonContractedItemInstanceIds = pesItemList.filter((e) => !e.PrcItemFk).map((e) => e.InstanceId);

		const creation = await this.http.post<MainDataDto<PesItemComplete>>('procurement/pes/item/createitems', {
				MainItemId: pesHeader.Id,
				ProjectFk: projectFk,
				ConHeaderFk: conHeaderFk,
				PackageFk: pesHeader.PackageFk,
				PrcItemIds: remainingPrcItemIds,
				MaxItemNo: this.maxItemNo(),
				ControllingUnitFk: pesHeader.ControllingUnitFk,
				IsIncludeNonContractedPesItems: args.isIncludeNonContractedPesItems,
				ExcludeInstanceIds: nonContractedItemInstanceIds,
			});

		const newPesItems = creation.Main.map((e) => e.Item!);

		if (!newPesItems.length) {
			return;
		}

		if (args.callBackAfterCreate) {
			args.callBackAfterCreate(newPesItems);
		}

		await Promise.all([
			newPesItems.map(async (item) => {
				this.calculationProcessor.process(item);
				if (item.PrcItemFk) {
					await this.setPesItemByPrcItem(pesHeader, item, contractItems!.find((e) => e.Id === item.PrcItemFk)!);
					this.append(item);
					await this.select(item);
				}
			}),
		]);
	}

	private async reloadControllingGroupSet(header: IPesHeaderEntity, entity: IPesItemEntity) {
		if (entity.PrcItemFk) {
			await this.http.get('procurement/common/prcitem/creategrpset', {
					params: {
						mainItemId: entity.Id,
						prcItem: entity.PrcItemFk,
					},
				});
		} else {
			// todo -clear data
		}
		// todo - reload controlling group set
	}

	private async reloadCostGroup(header: IPesHeaderEntity, entity: IPesItemEntity) {
		if (entity.PrcItemFk) {
			await this.http.get('procurement/pes/item/getcostgroupbyprcitem', {
					params: {
						prcItemFk: entity.PrcItemFk,
						pesHeaderId: entity.PesHeaderFk,
						pesItemFk: entity.Id,
					},
				});
		} else {
			// todo - clear data
		}

		// todo - basicsCostGroupAssignmentService, set pes item cost group
	}

	public async reloadSpecification(header: IPesHeaderEntity, entity: IPesItemEntity) {
		if (entity.PrcItemFk) {
			entity.BasBlobsSpecificationFk = await this.http.get('procurement/common/prcitem/copyprcitemblobid', {
				params: {
					prcItemFk: entity.PrcItemFk,
				},
			});
			// todo - load specification
		} else {
			// todo - clear data
		}
	}

	public async reloadPriceCondition(header: IPesHeaderEntity, entity: IPesItemEntity) {
		const priceConditionId = entity.PrcPriceConditionFk ?? null;
		this.pesPriceConditionService.reloadPriceConditions({priceConditionId, isCopyFromPrcItem: true});
	}

	public async setPesItemByPrcItemFk(pesHeader: IPesHeaderEntity, pesItem: IPesItemEntity, prcItemFk: number) {
		const prcItem = await firstValueFrom(this.prcItemLookupService.getItemByKey({id: prcItemFk}));
		await this.setPesItemByPrcItem(pesHeader, pesItem, prcItem);
		await this.calcDeliveredAndRemaining(pesItem);
		this.calculateQuantityConverted(pesItem);
	}

	public async setPesItemByPrcItem(header: IPesHeaderEntity, entity: IPesItemEntity, prcItem: IPrcItemLookupVEntity) {
		const proxy = this.entityProxy.apply(entity);
		const quantityContracted = await this.getQuantityContracted(header, prcItem.Id);

		if (!entity.PrjStockFk) {
			const result = await this.getPrjStockResult(entity);

			if (result.PrjStockFk) {
				proxy.PrjStockFk = result.PrjStockFk;
			}
			if (result.PrcStockTransactionTypeFk) {
				proxy.PrcStockTransactionTypeFk = result.PrcStockTransactionTypeFk;
			}
		}
		proxy.PrcItemFk = prcItem.Id;
		proxy.InstanceId = prcItem.InstanceId;
		proxy.QuantityContracted = quantityContracted;
		proxy.PrcItemFactorPriceUnit = prcItem.FactorPriceUnit;
		proxy.QuantityContractedAccepted = prcItem.QuantityContractedAccepted ?? 0;
		proxy.MdcTaxCodeFk = prcItem.TaxCodeFk;
		proxy.UomFk = prcItem.BasUomFk;
		proxy.PrcStructureFk = prcItem.PrcStructureFk;
		proxy.PrcItemStatusFk = prcItem.PrcItemStatusFk;
		proxy.MaterialCode = prcItem.MaterialCode;
		proxy.MdcMaterialFk = prcItem.MdcMaterialFk;
		proxy.PrcPriceConditionFk = prcItem.PrcPriceConditionFk ?? null;
		proxy.MaterialExternalCode = prcItem.ExternalCode;
		proxy.TotalPrice = prcItem.TotalPrice;
		proxy.TotalPriceOc = prcItem.TotalPriceOc;
		proxy.Discount = prcItem.Discount;
		proxy.PrjStockFk = prcItem.PrjStockFk;
		proxy.PrjStockLocationFk = prcItem.PrjStockLocationFk;
		proxy.Description1 = prcItem.Description1;
		proxy.Description2 = prcItem.Description2;
		proxy.UserDefined1 = prcItem.UserDefined1;
		proxy.UserDefined2 = prcItem.UserDefined2;
		proxy.UserDefined3 = prcItem.UserDefined3;
		proxy.UserDefined4 = prcItem.UserDefined4;
		proxy.UserDefined5 = prcItem.UserDefined5;
		proxy.ExternalCode = prcItem.ExternalCode;
		proxy.BudgetFixedTotal = prcItem.BudgetFixedTotal ?? false;
		proxy.BudgetFixedUnit = prcItem.BudgetFixedUnit ?? false;
		proxy.BudgetPerUnit = prcItem.BudgetPerUnit ?? 0;
		proxy.BudgetTotal = prcItem.BudgetTotal ?? 0;
		proxy.AlternativeUomFk = prcItem.AlternativeUomFk;
		proxy.AlternativeQuantity = prcItem.AlternativeQuantity;
		proxy.MaterialStockFk = prcItem.MaterialStockFk;
		proxy.ControllingUnitFk = prcItem.ControllingUnitFk ?? this.currentPesHeader.ControllingUnitFk;

		await this.setPesItemPriceByPrcItem(header, entity, prcItem);
		await this.reloadSubData(header, entity);
	}

	private async setPesItemPriceByPrcItem(header: IPesHeaderEntity, entity: IPesItemEntity, prcItem: IPrcItemLookupVEntity) {
		const vatPercent = this.getVatPercent(entity);
		const exchangeRate = header.ExchangeRate;
		const sameRate = prcItem.ConHeaderExchangeRate === exchangeRate;
		const sameVatPercent = prcItem.ConVatPercent === vatPercent;

		entity.PriceExtraOc = prcItem.PriceExtraOc;
		entity.PriceExtra = sameRate ? prcItem.PriceExtra : this.calculationService.getPriceExtraByExchangeRate(entity, exchangeRate);

		if (!this.isCalculateOverGross) {
			entity.PriceOc = prcItem.PriceOc;
			entity.Price = sameRate ? prcItem.Price : this.calculationService.getPriceByPriceOc(entity, exchangeRate);
			entity.PriceGrossOc = sameVatPercent ? prcItem.PriceGrossOc : this.calculationService.getPriceGrossOc(entity, vatPercent);
			entity.PriceGross = sameRate ? prcItem.PriceGross : this.calculationService.getPriceGrossByPriceGrossOc(entity, exchangeRate);

			entity.DiscountAbsoluteOc = prcItem.DiscountAbsoluteOc;
			entity.DiscountAbsolute = sameRate ? prcItem.DiscountAbsolute : this.calculationService.getDiscountAbsoluteByOc(entity, exchangeRate);
			entity.DiscountAbsoluteGrossOc = sameVatPercent ? prcItem.DiscountAbsoluteGrossOc : this.calculationService.getDiscountAbsoluteGrossOcByOc(entity, vatPercent);
			entity.DiscountAbsoluteGross = sameRate ? prcItem.DiscountAbsoluteGross : this.calculationService.getDiscountAbsoluteGrossByGrossOc(entity, exchangeRate);

			entity.TotalPriceOc = prcItem.TotalPriceOc;
			entity.TotalPrice = sameRate ? prcItem.TotalPrice : this.calculationService.getTotalPriceByTotalPriceOc(entity, exchangeRate);
			entity.TotalPriceGrossOc = sameVatPercent ? prcItem.TotalPriceGrossOc : this.calculationService.getTotalPriceOCGross(entity, vatPercent);
			entity.TotalPriceGross = sameRate ? prcItem.TotalPriceGross : this.calculationService.getTotalPriceGrossByTotalPriceGrossOc(entity, exchangeRate);
		} else {
			entity.PriceGrossOc = prcItem.PriceGrossOc;
			entity.PriceGross = sameRate ? prcItem.PriceGross : this.calculationService.getPriceGrossByPriceGrossOc(entity, exchangeRate);
			entity.PriceOc = sameVatPercent ? prcItem.PriceOc : this.calculationService.getPriceOc(entity, vatPercent);
			entity.Price = sameRate ? prcItem.Price : this.calculationService.getPriceByPriceOc(entity, exchangeRate);

			entity.DiscountAbsoluteGrossOc = prcItem.DiscountAbsoluteGrossOc;
			entity.DiscountAbsoluteGross = sameRate ? prcItem.DiscountAbsoluteGross : this.calculationService.getDiscountAbsoluteGrossByGrossOc(entity, exchangeRate);
			entity.DiscountAbsoluteOc = sameVatPercent ? prcItem.DiscountAbsoluteOc : this.calculationService.getDiscountAbsoluteOcByGrossOc(entity, vatPercent);
			entity.DiscountAbsolute = sameRate ? prcItem.DiscountAbsolute : this.calculationService.getDiscountAbsoluteByOc(entity, exchangeRate);

			entity.TotalPriceGrossOc = prcItem.TotalPriceGrossOc;
			entity.TotalPriceGross = sameRate ? prcItem.TotalPriceGross : this.calculationService.getTotalPriceGrossByTotalPriceGrossOc(entity, exchangeRate);
			entity.TotalPriceOc = sameVatPercent ? prcItem.TotalPriceOc : this.calculationService.getTotalPriceOc(entity, vatPercent);
			entity.TotalPrice = sameRate ? prcItem.TotalPrice : this.calculationService.getTotalPriceByTotalPriceOc(entity, exchangeRate);
		}
	}

	private async reloadSubData(header: IPesHeaderEntity, entity: IPesItemEntity) {
		await this.reloadPriceCondition(header, entity);
		this.calculatePesItem(entity);
		await this.reloadCostGroup(header, entity);
		await this.reloadControllingGroupSet(header, entity);
		await this.reloadSpecification(header, entity);
	}

	public async resetPesItem(pesHeader: IPesHeaderEntity, entity: IPesItemEntity) {
		const proxy = this.entityProxy.apply(entity);
		proxy.PrcItemFk = null;
		proxy.InstanceId = -1;
		proxy.QuantityContracted = 0;
		proxy.QuantityContractedAccepted = 0;
		proxy.QuantityDelivered = proxy.Quantity;
		proxy.QuantityRemaining = -proxy.Quantity;
		proxy.TotalDelivered = proxy.Total;
		proxy.TotalOcDelivered = proxy.TotalOc;
		proxy.PrcItemStatusFk = null;
		proxy.Vat = 0;
		proxy.PriceOc = 0;
		proxy.Price = 0;
		proxy.PriceExtraOc = 0;
		proxy.PriceExtraOc = 0;
		proxy.Total = 0;
		proxy.TotalOc = 0;
		proxy.VatOC = 0;
		proxy.PrcPriceConditionFk = null;
		proxy.MdcMaterialFk = null;
		proxy.MaterialCode = null;
		proxy.MaterialExternalCode = null;
		proxy.Discount = 0;
		proxy.DiscountAbsolute = 0;
		proxy.DiscountAbsoluteOc = 0;
		proxy.DiscountAbsoluteGross = 0;
		proxy.DiscountAbsoluteGrossOc = 0;
		proxy.TotalPrice = 0;
		proxy.TotalPriceOc = 0;
		await this.reloadSubData(pesHeader, entity);
	}

	public calculatePesItem(item: IPesItemEntity) {
		this.calculateVat(item);
		this.calculateQuantityConverted(item);
		this.calculateInvoiceQuantity(item);
		// todo - DEV-21332
		//serviceContainer.service.gridRefresh();
	}

	protected calculateDeliveredTotal(pesItem: IPesItemEntity, oldTotal: number, oldTotalOc: number, refreshGrid = true) {
		const totalDiff = bignumber(pesItem.Total).sub(oldTotal);
		const totalOcDiff = bignumber(pesItem.TotalOc).sub(oldTotalOc);

		this.getList().forEach((i) => {
			if (i.Id === pesItem.Id || (i.Id !== pesItem.Id && pesItem.PrcItemFk && i.PrcItemFk === pesItem.PrcItemFk && i.Version)) {
				i.TotalDelivered = i.QuantityDelivered === 0 ? 0 : this.calculationService.round(this.roundingType.TotalDelivered, bignumber(i.TotalDelivered).add(totalDiff));
				i.TotalOcDelivered = i.QuantityDelivered === 0 ? 0 : this.calculationService.round(this.roundingType.TotalOcDelivered, bignumber(i.TotalOcDelivered).add(totalOcDiff));
			}
		});

		// todo - DEV-21332
		/*if (refreshGrid) {
			serviceContainer.service.gridRefresh();
		}*/
	}

	public async updatePriceExtra(entity: IPesItemEntity): Promise<boolean> {
		const originalExtraOc = entity.PriceExtraOc;
		const originalExtra = entity.PriceExtra;
		const priceConditions = await this.pesPriceConditionService.recalculate(entity.PrcPriceConditionFk ?? null);
		if (priceConditions?.length) {
			const validPriceConditions = priceConditions.filter((item) => {
				return item.PriceConditionType && item.PriceConditionType.IsPriceComponent && item.IsActivated;
			});
			entity.PriceExtraOc = this.calculationService.round(this.roundingType.PriceExtraOc, sumBy(validPriceConditions, 'TotalOc'));
			entity.PriceExtra = this.calculationService.round(this.roundingType.PriceExtra, sumBy(validPriceConditions, 'Total'));
		}
		return (originalExtraOc !== entity.PriceExtraOc || originalExtra !== entity.PriceExtra);
	}

	public async calculateTotal(pesItem: IPesItemEntity) {
		return this.calculateTotalPriceNTotal(pesItem, true);
	}

	public async calculateTotalPriceNTotal(pesItem: IPesItemEntity, onlyCalculateTotal: boolean = false) {
		if (pesItem === null) {
			return;
		}

		const vatPercent = this.getVatPercent(pesItem);
		const exchangeRate = this.getParentExchangeRate();
		const priceUnitAndFactor = await this.getFactorAndPriceUnit(pesItem);
		const priceUnit = priceUnitAndFactor.PriceUnit;
		const factor = priceUnitAndFactor.FactorPriceUnit;
		const originTotal = pesItem.Total;
		const originTotalOc = pesItem.TotalOc;

		this.calculationService.calculateTotalPriceNTotal(pesItem, vatPercent, exchangeRate, priceUnit, factor, onlyCalculateTotal);

		this.calculateRelatedFieldsAfterUpdateTotal(pesItem, originTotal, originTotalOc, vatPercent);
	}

	public calculateRelatedFieldsAfterUpdateTotal(pesItem: IPesItemEntity, oldTotal: number, oldTotalOc: number, vatPercent?: number) {
		this.calculateVat(pesItem, vatPercent);
		this.calculateDeliveredTotal(pesItem, oldTotal, oldTotalOc);
	}

	private calculateVat(pesItem: IPesItemEntity, vatPercent?: number) {
		vatPercent = vatPercent ?? this.getVatPercent(pesItem);
		pesItem.Vat = this.calculationService.round(this.roundingType.Vat, bignumber(pesItem.Total).mul(vatPercent).div(100));
		pesItem.VatOC = this.calculationService.round(this.roundingType.VatOC, bignumber(pesItem.TotalOc).mul(vatPercent).div(100));
	}

	public convertQuantityToAlternativeQ(entity: IPesItemEntity, uomFk: Nullable<number>, quantity: number) {
		if (!quantity || !uomFk) {
			return 0;
		}

		return this.roundingService.doRounding(this.roundingType.AlternativeQuantity, bignumber(quantity).mul(this.getUomQuantity(entity, uomFk)).toNumber());
	}

	public convertAlternativeQToQuantity(entity: IPesItemEntity, uomFk: Nullable<number>, alternativeQ: number) {
		if (!alternativeQ || !uomFk) {
			return 0;
		}

		return this.roundingService.doRounding(this.roundingType.Quantity, bignumber(alternativeQ).div(this.getUomQuantity(entity, uomFk)).toNumber());
	}

	private getUomQuantity(entity: IPesItemEntity, uomFk: Nullable<number>) {
		let value = 1;

		if (uomFk && entity.Material2Uoms) {
			const item = entity.Material2Uoms.find((e) => e.UomFk == uomFk);
			if (item) {
				value = item.Quantity;
			}
		}

		return value;
	}

	private async needUpdateHeaderContract(newConHeaderFk: number) {
		if (this.currentPesHeader.ConHeaderFk !== newConHeaderFk) {
			return true;
		}

		let conHeaderLookupEntity = await firstValueFrom(this.conHeaderLookupService.getItemByKey({id: newConHeaderFk}));

		if (this.currentPesHeader.ConHeaderFk !== conHeaderLookupEntity.ConHeaderFk) {
			return true;
		}

		if (conHeaderLookupEntity.ConHeaderFk) {
			conHeaderLookupEntity = await firstValueFrom(this.conHeaderLookupService.getItemByKey({id: conHeaderLookupEntity.ConHeaderFk}));
		}

		if (conHeaderLookupEntity.ConHeaderFk !== newConHeaderFk) {
			return true;
		}

		return false;
	}

	public async updateHeaderContract(entity: IPesItemEntity, newConHeaderFk: number) {
		if (await this.needUpdateHeaderContract(newConHeaderFk)) {
			this.parentService.updateHeaderConHeader(newConHeaderFk);
			await this.parentService.updatePrcStructureByHeaderId(newConHeaderFk);
		}
	}

	public async getFactorAndPriceUnit(pesItem: IPesItemEntity): Promise<{ FactorPriceUnit: number; PriceUnit: number }> {
		const result = pesItem.PrcItemFk
			? ((await firstValueFrom(this.prcItemMergedLookupService.getItemByKey({id: pesItem.PrcItemFk}))) as { FactorPriceUnit: number; PriceUnit: number })
			: pesItem.MdcMaterialFk
				? ((await firstValueFrom(this.materialLookupService.getItemByKey({id: pesItem.MdcMaterialFk}))) as { FactorPriceUnit: number; PriceUnit: number })
				: {FactorPriceUnit: 1, PriceUnit: 1};

		return {
			FactorPriceUnit: result.FactorPriceUnit ?? 1,
			PriceUnit: result.PriceUnit ?? 1,
		};
	}

	/**
	 * rename from calcPesItemQty in old angularjs
	 * @param item
	 * @private
	 */
	public calculateQuantityConverted(item: IPesItemEntity) {
		item.QuantityConverted = this.calculationService.round(this.roundingType.QuantityConverted, bignumber(item.Quantity).mul(item.PrcItemFactorPriceUnit));
		item.QuantityContractedConverted = this.calculationService.round(this.roundingType.QuantityContractedConverted, bignumber(item.QuantityContracted).mul(item.PrcItemFactorPriceUnit));
		item.QuantityDeliveredConverted = this.calculationService.round(this.roundingType.QuantityDeliveredConverted, bignumber(item.QuantityDelivered).mul(item.PrcItemFactorPriceUnit));
		item.QuantityRemainingConverted = this.calculationService.round(this.roundingType.QuantityRemainingConverted, bignumber(item.QuantityRemaining).mul(item.PrcItemFactorPriceUnit));
	}

	public calculateInvoiceQuantity(item: IPesItemEntity) {
		item.InvoiceQuantity = item.Quantity;
	}

	public async getMaterialToPrjStock(entity: IPesItemEntity, params?: Partial<{ prcItemId?: number | null; projectStockId: number; quantity: number; materialId?: number | null }>) {
		return this.http.get<IItemsResultEntity>('procurement/pes/item/getmaterial2projectstock', {
			params: {
				prcItemId: params?.prcItemId ?? entity.PrcItemFk!,
				projectStockId: params?.projectStockId ?? entity.PrjStockFk!,
				quantity: params?.quantity ?? entity.Quantity!,
				materialId: params?.materialId ?? entity.MdcMaterialFk!,
			},
		});
	}

	public async resetPesItemFromMaterial(header: IPesHeaderEntity, entity: IPesItemEntity) {
		const proxy = this.entityProxy.apply(entity);

		proxy.Description1 = null;
		proxy.Description2 = null;
		proxy.MdcTaxCodeFk = null;
		proxy.UomFk = 0;
		proxy.AlternativeUomFk = null;
		proxy.Price = 0;
		proxy.PriceOc = 0;
		proxy.PrcPriceConditionFk = null;
		proxy.PrcStructureFk = null;
		proxy.MdcMaterialFk = null;
		proxy.Material2Uoms = null;
		proxy.MaterialStockFk = null;

		await this.reloadPriceCondition(header, proxy);
		this.calculatePesItem(proxy);
		await this.reloadSpecification(header, proxy);
	}

	public async setPesItemFromMaterialFk(header: IPesHeaderEntity, entity: IPesItemEntity, materialFk: number) {
		const material = await firstValueFrom(this.materialLookupService.getItemByKey({id: materialFk}));
		await this.setPesItemFromMaterial(header, entity, material);
	}

	public async setPesItemFromMaterial(header: IPesHeaderEntity, entity: IPesItemEntity, material: IMaterialSearchEntity) {
		const proxy = this.entityProxy.apply(entity);

		await this.setPesItemFromMaterialCurrency(header, entity, material);

		entity.MdcMaterialFk = material.Id;

		proxy.Description1 = material.DescriptionInfo.Translated;
		proxy.Description2 = material.DescriptionInfo2.Translated;
		proxy.MdcTaxCodeFk = material.MdcTaxCodeFk;
		proxy.UomFk = material.BasUomFk;
		proxy.UserDefined1 = material.UserDefined1;
		proxy.UserDefined2 = material.UserDefined2;
		proxy.UserDefined3 = material.UserDefined3;
		proxy.UserDefined4 = material.UserDefined4;
		proxy.UserDefined5 = material.UserDefined5;

		proxy.PrcPriceConditionFk = material.PrcPriceconditionFk;
		proxy.PrcStructureFk = material.PrcStructureFk;
		proxy.Material2Uoms = material.Material2Uoms;
		proxy.Co2Source = material.Co2Source ?? 0;
		proxy.Co2SourceTotal = Number.parseFloat((proxy.Co2Source * proxy.Quantity).toFixed(3));
		proxy.Co2Project = material.Co2Project ?? 0;
		proxy.Co2ProjectTotal = Number.parseFloat((proxy.Co2Project * proxy.Quantity).toFixed(3));

		proxy.MaterialStockFk = material.MaterialStockFk;
		proxy.AlternativeUomFk = material.MaterialStock2UomFk || material.BasUomFk;

		await this.reloadPriceCondition(header, entity);
		await this.reloadSpecification(header, entity);
	}

	public async setPesItemFromMaterialCurrency(header: IPesHeaderEntity, entity: IPesItemEntity, material: IMaterialSearchEntity) {
		const exchangeRate = header.ExchangeRate;
		const vatPercent = this.getVatPercent(entity);

		if (!material.BasCurrencyFk || material.BasCurrencyFk === this.loginCompanyEntity.CurrencyFk) {
			entity.Price = this.calculationService.round(this.roundingType.Price, bignumber(material.Cost).sub(material.PriceExtra));
			entity.PriceOc = this.calculationService.getPriceOcByExchangeRate(entity, exchangeRate);
		} else {
			const rate = await this.getForeignToDocExchangeRate(header.CurrencyFk, material.BasCurrencyFk!, header.ProjectFk!);
			entity.PriceOc = rate === 0 ? 0 : this.calculationService.round(this.roundingType.PriceOc, bignumber(material.Cost).sub(material.PriceExtra).div(rate));
			entity.Price = exchangeRate === 0 ? 0 : this.calculationService.getPriceByPriceOc(entity, exchangeRate);
		}

		entity.TotalPrice = this.calculationService.getTotalPriceNoDiscount(entity);
		entity.TotalPriceOc = this.calculationService.getTotalPriceOcNoDiscount(entity);
		entity.Total = material.PriceUnit === 0 ? 0 : this.calculationService.getTotal(entity, vatPercent, material.PriceUnit, material.FactorPriceUnit);
		entity.TotalOc = material.PriceUnit === 0 ? 0 : this.calculationService.getTotal(entity, vatPercent, material.PriceUnit, material.FactorPriceUnit);
	}

	public async getForeignToDocExchangeRate(documentCurrencyFk: number, currencyForeignFk: number, projectFk: number) {
		if (currencyForeignFk === documentCurrencyFk) {
			return 1;
		}

		return await this.http.get<number>('procurement/common/exchangerate/ocrate', {
			params: {
				CurrencyForeignFk: currencyForeignFk,
				DocumentCurrencyFk: documentCurrencyFk,
				ProjectFk: projectFk,
			},
		});
	}

	/**
	 * Calculate QuantityDelivered, TotalDelivered, TotalOcDelivered, QuantityRemaining after update prcItemFk
	 * @param entity
	 */
	public async calcDeliveredAndRemaining(entity: IPesItemEntity) {
		const deliveredData = await this.getDeliveredQuantityNTotal(entity);
		const relatedItems = this.getList().filter(item => {
			return item.Id !== entity.Id && item.PrcItemFk === entity.PrcItemFk && !item.Version;
		});
		const deliveredQuantities = sumBy(relatedItems, 'Quantity');
		const deliveredTotal = sumBy(relatedItems, 'Total');
		const deliveredTotalOc = sumBy(relatedItems, 'TotalOc');

		entity.QuantityDelivered = this.roundingService.doRounding(this.roundingType.QuantityDelivered, deliveredData.DeliveredQuantity + entity.Quantity + deliveredQuantities);
		entity.TotalDelivered = this.roundingService.doRounding(this.roundingType.TotalDelivered, deliveredData.DeliveredTotal + entity.Total + deliveredTotal);
		entity.TotalOcDelivered = this.roundingService.doRounding(this.roundingType.TotalOcDelivered, deliveredData.DeliveredTotalOc + entity.TotalOc + deliveredTotalOc);
		entity.QuantityRemaining = (entity.QuantityContracted !== null && entity.QuantityDelivered !== null) ?
			this.roundingService.doRounding(this.roundingType.QuantityRemaining, bignumber(entity.QuantityContracted).sub(entity.QuantityDelivered).toNumber()) :
			0;
	}

	/**
	 * Get DeliveredQuantity, DeliveredTotal, DeliveredTotalOc
	 * @param entity
	 * @private
	 */
	private async getDeliveredQuantityNTotal(entity: IPesItemEntity) {
		return await this.http.post<{
			DeliveredQuantity: number,
			DeliveredTotal: number,
			DeliveredTotalOc: number
		}>('procurement/pes/item/calculatedeliveredquantityandtotal', {
			PesHeaderId: entity.PesHeaderFk,
			PrcItemFk: entity.PrcItemFk!,
			InstanceId: entity.InstanceId
		});
	}

	/**
	 * Get QuantityContracted
	 * @param pesHeader
	 * @param prcItemFk
	 * @private
	 */
	private async getQuantityContracted(pesHeader: IPesHeaderEntity, prcItemFk: number) {
		return this.http.get<number>('procurement/pes/item/getQuantityContracted', {
			params: {
				prcConfigurationFk: pesHeader.PrcConfigurationFk,
				prcItemFkOfPes: prcItemFk
			}
		});
	}
}
