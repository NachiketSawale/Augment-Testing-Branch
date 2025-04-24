/*
 * Copyright(c) RIB Software GmbH
 */

import { max } from 'lodash';
import { firstValueFrom, Subject } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPrcItemEntity, IPrcItemScopeDetailEntity, IPrcItemScopeEntity } from '../../model/entities';
import { PrcItemScopeComplete } from '../../model/prc-item-scope-complete.class';
import { PrcItemScopeDetailComplete } from '../../model/prc-item-scope-detail-complete.class';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService } from '@libs/platform/common';
import { PrcItemScopeDataService } from '../prc-item-scope.data.service';
import { PrcCommonItemComplete } from '../../model/procurement-common-item-complete.class';
import { PrcItemScopeDetailReadonlyProcessor } from './prc-item-scope-detail-readonly-processor.class';
import { ProcurementCommonCalculationService } from '../../services';
import { BasicScopeDetailCalculationService, BasicsSharedMaterialLookupService, MainDataDto } from '@libs/basics/shared';
import { IBasicsScopeDetailDataService } from '@libs/basics/interfaces';
import { IExchangeRateChangedEvent } from '../../model/interfaces/';
import { PrcItemScopeDetailTotalProcessor } from './prc-item-scope-detail-total-processor.class';

/**
 * Prc item scope detail data service
 */
export class PrcItemScopeDetailDataService<
	PT extends IPrcItemEntity,
	PU extends PrcCommonItemComplete,
	HT extends IEntityIdentification,
	HU extends CompleteIdentification<HT>
> extends DataServiceFlatNode<IPrcItemScopeDetailEntity, PrcItemScopeDetailComplete, IPrcItemScopeEntity, PrcItemScopeComplete> implements IBasicsScopeDetailDataService<IPrcItemScopeDetailEntity> {
	public readonly readonlyProcessor: PrcItemScopeDetailReadonlyProcessor<PT, PU, HT, HU>;
	public readonly totalProcessor: PrcItemScopeDetailTotalProcessor<PT, PU, HT, HU>;

	public get scopeService() {
		return this.config.parentService;
	}
	/**
	 * Emitter for priceCondition change
	 */
	public priceConditionChanged$ = new Subject<number | null>();
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	public readonly calculationService = inject(ProcurementCommonCalculationService);
	public readonly roundingType = this.calculationService.getRoundingType<IPrcItemScopeDetailEntity>();
	public readonly scopeDetailCalculator = inject(BasicScopeDetailCalculationService);
	private readonly materialLookupService = inject(BasicsSharedMaterialLookupService);

	public constructor(private readonly config: {
		parentService: PrcItemScopeDataService<PT, PU, HT, HU>
	}) {
		super({
			apiUrl: 'procurement/common/item/scope/detail',

			roleInfo: <IDataServiceChildRoleOptions<IPrcItemScopeDetailEntity, IPrcItemScopeEntity, PrcItemScopeComplete>>{
				role: ServiceRole.Node,
				itemName: 'PrcItemScopeDetail',
				parent: config.parentService
			},

			readInfo: {
				endPoint: 'list'
			},

			createInfo: {
				endPoint: 'createnew',
				prepareParam: ident => {
					const scopeEntity = this.getSelectedParent()!;
					return {
						Id: scopeEntity.Id,
						PKey1: scopeEntity.PrcItemFk,
						MaxNo: this.getMaxItemNo()
					};
				}
			}

			// Todo - translation

		});

		this.readonlyProcessor = new PrcItemScopeDetailReadonlyProcessor(this);
		this.totalProcessor = new PrcItemScopeDetailTotalProcessor(this);
		this.processor.addProcessor([
			this.readonlyProcessor,
			this.totalProcessor
		]);

		this.subscribePrcItemPropertyChanged();
		this.subscribePrcHeaderPropertyChanged();
	}

	protected override provideLoadPayload(): object {
		const scopeEntity = this.getSelectedParent()!;
		return {
			mainItemId: scopeEntity.Id,
			projectId: this.scopeService.prcHeaderContext.projectFk
		};
	}

	protected getMaxItemNo() {
		if (this.getList().length > 0) {
			return max(this.getList().map(e => e.ItemNo)) as number;
		}
		return 0;
	}

	protected override onLoadSucceeded(loaded: object): IPrcItemScopeDetailEntity[] {
		const dto = new MainDataDto(loaded);
		const entities = dto.getValueAs<IPrcItemScopeDetailEntity[]>('dtoes')!;

		// Todo - basicsCostGroupAssignmentService

		return entities;
	}

	public async reloadScopeDetails(prcItemScopeEntity: IPrcItemScopeEntity, newMatScope: number) {
		const prcHeaderContext = this.scopeService.prcHeaderContext;
		const prcItemEntity = this.scopeService.selectedPrcItem!;

		const completeDto = await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'procurement/common/item/scope/detail/reload', {
			MaterialId: prcItemEntity.MdcMaterialFk,
			MatScope: newMatScope,
			PrcItemScopeId: prcItemScopeEntity.Id,
			CurrencyId: prcHeaderContext.currencyFk,
			ExchangeRate: prcHeaderContext.exchangeRate,
			ProjectId: prcHeaderContext.projectFk
		})) as PrcItemScopeComplete;

		// reset some of scope properties
		if(completeDto.PrcItemScope) {
			this.scopeService.resetScopeEntity(prcItemScopeEntity, completeDto.PrcItemScope);
		}

		// Delete all existing scope detail entities first
		this.delete(this.getList());

		if (completeDto.PrcItemScopeDetailToSave) {
			// Append new scope detail entities
			const newEntities = completeDto.PrcItemScopeDetailToSave.map(e => e.PrcItemScopeDetail!);
			this.append(newEntities);
			this.setModified(newEntities);

			// block by https://rib-40.atlassian.net/browse/DEV-15942
			// Todo - reload price conditions
			// Todo - reload blob
		}

		if (prcItemScopeEntity.IsSelected) {
			await this.calculateScopeTotal(prcItemEntity, prcItemScopeEntity);
		}
	}

	public async calculateScopeTotal(prcItem: PT, prcItemScope: IPrcItemScopeEntity) {
		const result = await this.scopeDetailCalculator.calculateScopeTotal(this.getList());

		if (prcItemScope.IsSelected && prcItem.HasScope) {
			prcItem.OriginalPrice = prcItem.Price;
			prcItem.OriginalPriceOc = prcItem.PriceOc;
			prcItem.Price = this.calculationService.round(this.roundingType.Price, result.total);
			prcItem.PriceOc = this.calculationService.round(this.roundingType.PriceOc, result.totalOc);
			// Todo - waiting for prc item calculation logic which will be done by Ivy
			// this.scopeService.prcItemService.calculateTotal(prcItem, true);
		}

		prcItemScope.Price = result.price;
		prcItemScope.PriceOc = result.priceOc;
		prcItemScope.PriceExtra = result.priceExtra;
		prcItemScope.PriceExtraOc = result.priceExtraOc;
		prcItemScope.Total = result.total;
		prcItemScope.TotalCurrency = result.totalOc;
	}

	public resetScopeTotal(prcItem: PT) {
		if (prcItem.OriginalPrice) {
			prcItem.Price = prcItem.OriginalPrice;
			prcItem.OriginalPrice = undefined;
		}
		if (prcItem.OriginalPriceOc) {
			prcItem.PriceOc = prcItem.OriginalPriceOc;
			prcItem.OriginalPriceOc = undefined;
		}
		// Todo - waiting for prc item calculation logic which will be done by Ivy
		// this.scopeService.prcItemService.calculateTotal(prcItem, true);
	}

	private subscribePrcItemPropertyChanged() {
		this.scopeService.prcItemService.entityProxy.propertyChanged$.subscribe(e => {
			switch (<keyof PT>e.field) {
				case 'Quantity':
					this.getList().forEach(e => this.totalProcessor.calculateTotalQuantity(e));
					break;
			}
		});
	}

	private subscribePrcHeaderPropertyChanged() {
		this.scopeService.prcHeaderService.exchangeRateChanged$.subscribe(e => {
			this.onExchangeRateChanged(e);
		});
	}

	protected async onExchangeRateChanged(e: IExchangeRateChangedEvent) {
		this.updatePriceForList(e.isCurrencyChanged);
		this.setModified(this.getList());
		await this.updatePriceExtraNTotalForList();
	}

	private updatePriceForList(isCurrencyChanged: boolean) {
		const prcHeaderContext = this.scopeService.prcHeaderContext;
		const loginCompanyEntity = this.scopeService.prcItemService.loginCompanyEntity;
		const entities = this.getList();

		if (isCurrencyChanged) {
			if (prcHeaderContext.currencyFk === loginCompanyEntity.CurrencyFk) {
				entities.forEach(e => e.Price = e.PriceOc);
			} else {
				entities.forEach(e => e.Price = this.calculationService.round(this.roundingType.Price, this.calculationService.formula.homeCurrencyByOther(e.PriceOc, prcHeaderContext.exchangeRate)));
			}
		} else {
			const materialEntities = this.materialLookupService.cache.getList();

			entities.forEach(e => {

				if (e.MaterialFk) {
					const materialE = materialEntities.find(m => e.Id === e.MaterialFk);

					if (materialE) {
						if (materialE.BasCurrencyFk === loginCompanyEntity.CurrencyFk) {
							e.PriceOc = this.calculationService.round(this.roundingType.PriceOc, this.calculationService.formula.otherCurrencyByHome(e.Price, prcHeaderContext.exchangeRate));
							return;
						}
					} else {
						throw new Error(`Material entity whose Id=${e.MaterialFk} is not found!`);
					}
				}

				e.Price = this.calculationService.round(this.roundingType.Price, this.calculationService.formula.homeCurrencyByOther(e.PriceOc, prcHeaderContext.exchangeRate));
			});
		}
	}

	private async updatePriceExtraNTotalForList() {
		const entities = this.getList();

		// update price extra
		// Todo - maybe price condition framework could provide a web api which allows to update multiple price conditions once
		await Promise.all(entities.map(async e => {
			await this.recalculatePriceCondition(e);
		}));

		// update total
		entities.forEach((e => this.totalProcessor.process(e)));

		// apply total to scope item and prc item
		await this.applyScopeTotal();
	}

	public getExchangeRate(): number {
		const prcHeaderContext = this.scopeService.prcHeaderContext;
		return prcHeaderContext.exchangeRate;
	}

	public async applyScopeTotal() {
		const prcItemEntity = this.scopeService.selectedPrcItem!;
		const prcItemScopeEntity = this.getSelectedParent()!;
		await this.calculateScopeTotal(prcItemEntity, prcItemScopeEntity);
	}

	public async reloadPriceCondition(entity: IPrcItemScopeDetailEntity, priceConditionFk: number, priceListFk?: number): Promise<void> {
		// Todo - Reload price condition, will be handled in ticket https://rib-40.atlassian.net/browse/DEV-14463
	}

	public async recalculatePriceCondition(entity: IPrcItemScopeDetailEntity): Promise<void> {
		// Todo - Reload price condition, will be handled in ticket https://rib-40.atlassian.net/browse/DEV-14463
	}

	public override createUpdateEntity(modified: IPrcItemScopeDetailEntity | null): PrcItemScopeDetailComplete {
		return new PrcItemScopeDetailComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PrcItemScopeComplete, modified: PrcItemScopeDetailComplete[], deleted: IPrcItemScopeDetailEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.PrcItemScopeDetailToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.PrcItemScopeDetailToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PrcItemScopeComplete): IPrcItemScopeDetailEntity[] {
		if (parentUpdate && parentUpdate.PrcItemScopeDetailToSave) {
			return parentUpdate.PrcItemScopeDetailToSave.map(e => e.PrcItemScopeDetail!);
		}

		return [];
	}

	public override isParentFn(parentKey: PT, entity: IPrcItemScopeDetailEntity): boolean {
		return entity.PrcItemScopeFk === parentKey.Id;
	}
}