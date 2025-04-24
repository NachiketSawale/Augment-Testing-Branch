/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom, Subject } from 'rxjs';
import { filter, find, forEach, get, isNil, max, sumBy } from 'lodash';
import { inject, ProviderToken } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, IValidationService, ServiceRole } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification, PlatformHttpService } from '@libs/platform/common';
import { IPrcItemEntity } from '../model/entities';
import { PrcCommonItemComplete } from '../model/procurement-common-item-complete.class';
import { ProcurementCommonItemDataProcessor, ProcurementCommonItemReadonlyProcessor } from './processors';
import { BasicsSharedCompanyContextService, BasicsSharedNewEntityValidationProcessorFactory, BasItemType2, MainDataDto } from '@libs/basics/shared';
import { ProcurementPrcItemCalculationService } from './helper';
import { IBasicsPriceConditionHeaderService } from '@libs/basics/interfaces';
import { IPaymentTermChangedEvent, IPrcHeaderDataService, IPrcTotalData, IPrjStockContext } from '../model/interfaces';
import { ServerSideFilterValueType } from '@libs/ui/common';
import { ICreatePrcItemDto, IPrcStockDto, IPrcStructureDto } from '../model/dtoes';
import { EntityProxy, FieldKind, IPropertyChangedEvent, PrcSharedPrcConfigLookupService } from '@libs/procurement/shared';
import { ProcurementCommonPriceConditionDataService } from './procurement-common-price-condition-data.service';
import { isArray } from 'lodash';
import { ProcurementCommonVatPercentageService } from './procurement-common-vat-percentage.service';
import * as math from 'mathjs';

/**
 * The basic data service for procurement item entity
 */
export abstract class ProcurementCommonItemDataService<T extends IPrcItemEntity, U extends PrcCommonItemComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatNode<T, U, PT, PU>
	implements IBasicsPriceConditionHeaderService<T, U> {
	private readonly validationProcessor = inject(BasicsSharedNewEntityValidationProcessorFactory);
	protected readonly http = inject(PlatformHttpService);
	protected readonly getVatPercentService = inject(ProcurementCommonVatPercentageService);
	protected readonly itemCalculationService = inject(ProcurementPrcItemCalculationService);
	protected readonly roundingType = this.itemCalculationService.roundingType;
	protected readonly round = this.itemCalculationService.round.bind(this.itemCalculationService);
	protected readonly prcConfigLookup = inject(PrcSharedPrcConfigLookupService);
	protected readonly companyContext = inject(BasicsSharedCompanyContextService);
	public readonly readonlyProcessor: ProcurementCommonItemReadonlyProcessor<T, U, PT, PU>;
	public readonly dataProcessor: ProcurementCommonItemDataProcessor<T, U, PT, PU>;
	public readonly entityProxy: EntityProxy<T>;

	protected canCreateItem = true;
	protected canDeleteItem = true;
	protected prcStockList: IPrcStockDto[] = [];
	protected prcStructureList: IPrcStructureDto[] = [];
	/**
	 * Emitter for priceCondition change
	 */
	public priceConditionChanged$ = new Subject<number | null>();

	public get headerContext() {
		return this.parentService.getHeaderContext();
	}

	public get headerEntity() {
		return this.parentService.getHeaderEntity();
	}

	public get loginCompanyEntity() {
		return this.companyContext.loginCompanyEntity;
	}

	public get isCalculateOverGross() {
		return this.loginCompanyEntity.IsCalculateOverGross;
	}

	protected constructor(
		public parentService: IPrcHeaderDataService<PT, PU>,
		protected config: {
			readInfo: IDataServiceEndPointOptions;
			createInfo: IDataServiceEndPointOptions;
		},
		private validationToken: ProviderToken<IValidationService<T>>,
	) {
		const apiUrl = 'procurement/common/prcitem';

		const options: IDataServiceOptions<T> = {
			apiUrl: apiUrl,
			readInfo: config.readInfo,
			createInfo: config.createInfo,
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Node,
				itemName: 'PrcItem',
				parent: parentService,
			},
		};

		super(options);

		this.entityProxy = new EntityProxy<T>(this);
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.dataProcessor = this.createDataProcessor();

		this.processor.addProcessor([
			this.dataProcessor,
			this.readonlyProcessor,
			this.validationProcessor.createProcessor(
				this.validationToken,
				{
					moduleSubModule: 'Procurement.Common',
					typeName: 'PrcItemDto',
				},
				{
					excludeFields: ['NotSubmitted'],
				},
			),
		]);

		this.init();
	}

	protected init() {
		// reset payment term as header
		this.parentService.paymentTermChanged$.subscribe((e) => {
			this.onParentPaymentTermChanged(e);
		});

		this.parentService.entityProxy.propertyChanged$.subscribe((e) => {
			switch (e.fieldKind) {
				case FieldKind.MdcMaterialCatalogFk:
					this.onParentMaterialCatalogChanged(e);
					break;
				case FieldKind.MdcVatGroupFk:
					this.onParentVatGroupChanged(e);
					break;
				case FieldKind.MdcControllingUnitFk:
					this.onParentCUChanged(e);
					break;
				case FieldKind.MdcTaxCodeFk:
					this.onParentTaxCodeChanged(e);
					break;
				case FieldKind.DateDelivery:
					this.onParentDateDeliveryChanged(e);
					break;
			}
		});
		this.parentService.readonlyChanged$.subscribe((e) => {
			this.updateReadonlyForList();
		});
	}

	private updateReadonlyForList() {
		this.getList().forEach((item) => this.readonlyProcessor.process(item));
	}

	public async modifyPriceConditionFk(entity: T, value?: number | null, priceListFk?: number) {
		this.entityProxy.apply(entity).PrcPriceConditionFk = value;
		await this.getPriceConditionService().reloadPriceConditions({ priceConditionId: value ?? null });
	}

	/**
	 * refresh readonly state when material catalog changed
	 * @param e
	 * @protected
	 */
	protected onParentMaterialCatalogChanged(e: IPropertyChangedEvent<PT>) {
		this.getList().forEach((i) => {
			this.readonlyProcessor.process(i);
		});
	}

	protected onParentPaymentTermChanged(e: IPaymentTermChangedEvent) {
		this.getList().forEach((item) => {
			// Todo - There is a general potential issue here in case data is not loaded or container is even not shown, need to discuss with framework team on how to deal with it, leave a todo at the moment
			item.BasPaymentTermFiFk = e.paymentTermFiFk;
			item.BasPaymentTermPaFk = e.paymentTermPaFk;
		});
	}

	protected onParentVatGroupChanged(e: IPropertyChangedEvent<PT>) {
		this.getList().forEach((item) => {
			if (item.MdcTaxCodeFk) {
				this.calculateAfterVatPercentChanged(item);
			}
		});
	}

	protected onParentCUChanged(e: IPropertyChangedEvent<PT>) {
		this.getList().forEach((item) => {
			if (e.newValue) {
				item.MdcControllingunitFk = e.newValue as number;
				this.setModified(item);
			}
		});
	}

	protected onParentTaxCodeChanged(e: IPropertyChangedEvent<PT>) {
		this.getList().forEach((item) => {
			if (e.newValue) {
				item.MdcTaxCodeFk = e.newValue as number;
				this.setModified(item);
			}
		});
	}

	protected onParentDateDeliveryChanged(e: IPropertyChangedEvent<PT>) {
		this.getList().forEach((item) => {
			if (e.newValue) {
				item.DateRequired = e.newValue as string;
				this.setModified(item);
			}
		});
	}

	/**
	 * Get total quantity such as net total, gross and so on
	 * @protected
	 */
	protected getTotalData(): Partial<IPrcTotalData> {
		// Todo - prcTotalService.getNetTotalNoDiscountSplitItem()
		return {};
	}

	protected createReadonlyProcessor() {
		return new ProcurementCommonItemReadonlyProcessor(this);
	}

	protected createDataProcessor() {
		return new ProcurementCommonItemDataProcessor(this);
	}

	public async refreshEntityActionsByPrcConfig() {
		if (!this.headerEntity) {
			return;
		}

		const prcConfig = await firstValueFrom(
			this.prcConfigLookup.getItemByKey({
				id: this.headerEntity.ConfigurationFk,
			}),
		);

		this.canCreateItem = !!prcConfig.IsMaterial;
		this.canDeleteItem = !!prcConfig.IsMaterial;
	}

	protected override checkCreateIsAllowed(entities: T[] | T | null): boolean {
		return super.checkCreateIsAllowed(entities) && !this.headerContext.readonly && this.canCreateItem;
	}

	protected override checkDeleteIsAllowed(entities: T[] | T | null): boolean {
		return super.checkDeleteIsAllowed(entities) && !this.headerContext.readonly && this.canDeleteItem;
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const dto = new MainDataDto<T>(loaded);
		const entities = dto.Main;

		this.prcStockList = dto.getValueAs<IPrcStockDto[]>('_Prcstock')!;
		this.prcStructureList = dto.getValueAs<IPrcStructureDto[]>('_Prcstructure')!;

		// to-tester: seems currency.DecimalsRoundto is useless

		// todo - dynamic cost group columns

		return entities;
	}

	protected override provideCreatePayload(): object {
		const creationData: ICreatePrcItemDto = {
			PrcHeaderFk: this.headerContext.prcHeaderFk,
			ProjectFk: this.headerContext.projectFk,
			ConfigurationFk: this.headerEntity.ConfigurationFk,
			TaxCodeFk: this.headerEntity.TaxCodeFk,
			Itemnos: this.getList().map((e) => e.Itemno),
		};

		return creationData;
	}

	protected override onCreateSucceeded(created: object): T {
		const entity = created as T;

		if (entity.Itemno < this.getMaxItemNo()) {
			const step = get(created, 'PrcItemIncreaseStep')! as number;
			entity.Itemno = this.nextItemNo(step);
		}

		if (!entity.PrjStockFk) {
			const result = this.getPrjStockFk(entity);
			entity.PrjStockFk = result.PrjStockFk;
			this.readonlyProcessor.process(entity);
		}

		if (!entity.PrcStructureFk) {
			entity.PrcStructureFk = this.headerEntity.StructureFk;
		}

		return entity;
	}

	/**
	 * Todo - on delete succeeded callback, seems framework doesn't support it
	 * @param entities
	 * @protected
	 */
	protected onDeleteItemsSucceeded(entities: T[]) {
		this.resetBaseItemType2(entities);
	}

	public getPrjStockFk(entity: T) {
		const result = {
			PrjStockFk: undefined,
		};

		// 1.PRC_ITEM.MDC_MATERIAL_FK is not NULL
		if (entity.MdcMaterialFk === null) {
			return result;
		}

		// 2.PRC_ITEM.PRC_STRUCTURE_FK.ISSTOCKEXCLUDED = FALSE
		const PrcstructureItem = filter(this.prcStructureList, (item) => {
			/** @namespace item.PrcstructureId */
			return item.PrcstructureId === entity.PrcStructureFk;
		});
		/** @namespace PrcstructureItem.IsStockexcluded */
		if (PrcstructureItem.length === 0 || PrcstructureItem[0].IsStockexcluded) {
			return result;
		}

		// 3-1.PRC_ITEM.MDC_CONTROLLINGUNIT.ISSTOCKMANAGEMENT = TRUE
		const PrcstockItem = filter(this.prcStockList, (item) => {
			/** @namespace item.ControllingunitId */
			return item.ControllingunitId === entity.MdcControllingunitFk;
		});

		if (PrcstockItem.length > 0) {
			const _prcstockItem = filter(PrcstockItem, (item) => {
				/** @namespace item.PrcstockId */
				return item.PrcstockId !== null;
			});
			if (_prcstockItem.length > 0) {
				const PrjStockFk = _prcstockItem[0].PrcstockId;
				return {
					PrjStockFk: PrjStockFk,
				};
			}
		}
		return result;
	}

	protected getMaxItemNo() {
		if (this.getList().length > 0) {
			return max(this.getList().map((e) => e.Itemno)) as number;
		}
		return 0;
	}

	protected nextItemNo(step: number) {
		return this.getMaxItemNo() + step;
	}

	public calculateAfterVatPercentChanged(entity: T) {
		const vatPercent = this.getVatPercent(entity);
		const exchangeRate = this.getParentExchangeRate();

		this.itemCalculationService.calculateAfterVatPercentChanged(entity, vatPercent, exchangeRate);

		this.setModified(entity);
	}

	protected resetBaseItemType2(entitiesToDelete: T[]) {
		const entitiesRemaining = this.getList().filter((e) => !entitiesToDelete.includes(e));

		forEach(entitiesToDelete, (deleteItem) => {
			if (deleteItem.BasItemType2Fk === BasItemType2.AlternativeAwarded) {
				const findBase = find(entitiesRemaining, (item) => {
					return item.BasItemType2Fk === BasItemType2.BasePostponed && item.AGN === deleteItem.AGN;
				});
				const findAlternative = find(entitiesRemaining, (item) => {
					return item.BasItemType2Fk === BasItemType2.AlternativeAwarded && item.PrcItemAltFk === deleteItem.PrcItemAltFk;
				});
				if (findBase && !findAlternative) {
					const findBaseGroup = filter(entitiesRemaining, (item) => {
						return item.BasItemType2Fk === BasItemType2.BasePostponed && item.AGN === findBase.AGN && item.AAN === findBase.AAN;
					});
					forEach(findBaseGroup, (item) => {
						item.BasItemType2Fk = BasItemType2.Base;
						this.setModified(item);
					});
				}
			}
		});
	}

	/**
	 * Calculate total fields
	 * TotalOc, Total, TotalGrossOc, TotalGross, TotalCurrencyNoDiscount, TotalNoDiscount
	 * @param entity
	 * @param pointedVatPercent
	 * @param pointedExchangeRate
	 */
	public calculateTotal(entity: T, pointedVatPercent: number | null = null, pointedExchangeRate: number | null = null) {
		const vatPercent = pointedVatPercent ?? this.getVatPercent(entity);
		const exchangeRate = pointedExchangeRate ?? this.getParentExchangeRate();
		this.itemCalculationService.calculateTotal(entity, vatPercent, exchangeRate, entity.PriceUnit, entity.FactorPriceUnit);
	}

	/**
	 * Calculate totalPrice and total fields
	 * TotalPriceOc, TotalPrice, TotalPriceGrossOc, TotalPriceGross
	 * TotalOc, Total, TotalGrossOc, TotalGross, TotalCurrencyNoDiscount, TotalNoDiscount
	 * @param entity
	 * @param pointedVatPercent
	 * @param pointedExchangeRate
	 * @param onlyCalculateTotal
	 */
	public calculateTotalPriceNTotal(entity: T, pointedVatPercent: number | null = null, pointedExchangeRate: number | null = null, onlyCalculateTotal: boolean = false) {
		const vatPercent = pointedVatPercent ?? this.getVatPercent(entity);
		const exchangeRate = pointedExchangeRate ?? this.getParentExchangeRate();
		this.itemCalculationService.calculateTotalPriceNTotal(entity, vatPercent, exchangeRate, entity.PriceUnit, entity.FactorPriceUnit, onlyCalculateTotal);
	}

	/**
	 * Get parent exchange rate
	 * @protected
	 */
	public getParentExchangeRate(): number {
		const headerContext = this.parentService.getHeaderContext();
		return headerContext ? headerContext.exchangeRate : 1;
	}

	/**
	 * Get vat percent
	 * @param entity
	 * @protected
	 */
	public getVatPercent(entity: T): number {
		const headerContext = this.parentService.getHeaderContext();
		const vatGroupFk = headerContext ? headerContext.vatGroupFk : undefined;
		return this.getVatPercentService.getVatPercent(entity.MdcTaxCodeFk, vatGroupFk);
	}

	/**
	 * Recalculate price conditions and update Total/TotalOc to PriceExtra/PriceExtraOc
	 * Return true if PriceExtra/PriceExtraOc changes, false if not
	 * @param entity
	 */
	public async updatePriceExtra(entity: T): Promise<boolean> {
		const priceConditionService = this.getPriceConditionService();
		if (!priceConditionService) {
			return false;
		}
		const originalExtraOc = entity.PriceExtraOc;
		const originalExtra = entity.PriceExtra;
		const priceConditions = await priceConditionService.recalculate(entity.PrcPriceConditionFk ?? null);
		if (isArray(priceConditions)) {
			const validPriceConditions = priceConditions.filter((item) => {
				return item.PriceConditionType && item.PriceConditionType.IsPriceComponent && item.IsActivated;
			});
			entity.PriceExtraOc = this.round(this.roundingType.PriceExtraOc, sumBy(validPriceConditions, 'TotalOc'));
			entity.PriceExtra = this.round(this.roundingType.PriceExtra, sumBy(validPriceConditions, 'Total'));
		}
		return originalExtraOc !== entity.PriceExtraOc || originalExtra !== entity.PriceExtra;
	}

	/**
	 * Get project stock context
	 */
	public abstract getStockContext(): IPrjStockContext;

	/**
	 * Get filter object for agreement lookup
	 */
	public abstract getAgreementLookupFilter(): ServerSideFilterValueType;

	/**
	 * Get price condition service
	 */
	protected abstract getPriceConditionService(): ProcurementCommonPriceConditionDataService<T, U>;

	/**
	 * calculate QuantityRemaining
	 */
	public calculateQuantityRemaining(quantityContracted: number, quantityDelivered: number) {
		if (isNil(quantityContracted) || isNil(quantityDelivered)) {
			return 0;
		}
		return math.bignumber(quantityContracted).sub(quantityDelivered).toNumber();
	}
}
