/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector, inject, runInInjectionContext } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, PlatformLazyInjectorService } from '@libs/platform/common';
import { IPrcItemEntity, IPrcItemScopeDetailEntity, IPrcItemScopeEntity } from '../model/entities';
import { PrcCommonItemComplete } from '../model/procurement-common-item-complete.class';
import { ProcurementCommonItemDataService } from '../services/procurement-common-item-data.service';
import { PrcItemScopeDataService } from './prc-item-scope.data.service';
import {
	BASICS_SCOPE_DETAIL_ENTITY_LAYOUT_GENERATOR,
	BASICS_SCOPE_DETAIL_VALIDATION_SERVICE_FACTORY,
	BASICS_SCOPE_ENTITY_LAYOUT_GENERATOR,
	BASICS_SCOPE_VALIDATION_SERVICE_FACTORY, IBasicsScopeDetailValidationServiceFactory,
	IBasicsScopeValidationServiceFactory,
	IEntityLayoutGenerator
} from '@libs/basics/interfaces';
import { PrcItemScopeValidationService } from './prc-item-scope-validation.service';
import { PrcItemScopeDetailDataService } from './detail/prc-item-scope-detail-data.service';
import { BasicsSharedRoundingFactoryService, BasicsSharedRoundingModule as roundingModule, MaterialScopeLookupService, mergeLayout } from '@libs/basics/shared';
import { createLookup, FieldType, ILayoutConfiguration, LookupFreeInputModelType } from '@libs/ui/common';
import { PrcItemScopeDetailValidationService } from './detail/prc-item-scope-detail-validation.service';
import { PrcItemScopeDetailPriceConditionDataService } from './price-condition/prc-item-scope-detail-price-condition-data.service';
import { PrcItemScopeDetailPriceConditionValidationService } from './price-condition/prc-item-scope-detail-price-condition-validation.service';

/**
 * Scope container services
 * Each module should extend this common service to implement a specific scope data service which allows to customize data service behavior and wrap scope related logic
 * This service is also used to generate data service instance on fly for sub containers of scope entity so that we don't need to define them  explicitly as almost all logic is reused.
 */
export class PrcItemScopeEntitySeriesService<
	PT extends IPrcItemEntity,
	PU extends PrcCommonItemComplete,
	HT extends IEntityIdentification,
	HU extends CompleteIdentification<HT>
> {
	private readonly injector = inject(Injector);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly roundingService = BasicsSharedRoundingFactoryService.getService(roundingModule.basicsMaterial);
	private _scopeDataService?: PrcItemScopeDataService<PT, PU, HT, HU>;
	private _scopeDetailDataService?: PrcItemScopeDetailDataService<PT, PU, HT, HU>;
	private _scopeDetailPcDataService?: PrcItemScopeDetailPriceConditionDataService<PT, PU, HT, HU>;


	public constructor(private readonly config: {
		prcItemDataService: ProcurementCommonItemDataService<PT, PU, HT, HU>
	}) {

	}

	public get scopeDataService() {
		if (!this._scopeDataService) {
			this._scopeDataService = runInInjectionContext(this.injector, () => {
				return new PrcItemScopeDataService({
					parentService: this.config.prcItemDataService
				});
			});
		}
		return this._scopeDataService;
	}

	public get scopeDetailDataService() {
		if (!this._scopeDetailDataService) {
			this._scopeDetailDataService = runInInjectionContext(this.injector, () => {
				return new PrcItemScopeDetailDataService({
					parentService: this.scopeDataService
				});
			});
		}
		return this._scopeDetailDataService;
	}

	public get scopeDetailPriceConditionDataService() {
		if (!this._scopeDetailPcDataService) {
			this._scopeDetailPcDataService = runInInjectionContext(this.injector, () => {
				return new PrcItemScopeDetailPriceConditionDataService(this.scopeDetailDataService);
			});
		}
		return this._scopeDetailPcDataService;
	}


	public async generateScopeValidationService() {
		const factory = await this.lazyInjector.inject<IBasicsScopeValidationServiceFactory<IPrcItemScopeEntity>>(BASICS_SCOPE_VALIDATION_SERVICE_FACTORY);
		return runInInjectionContext(this.injector, () => {
			return new PrcItemScopeValidationService(this.scopeDataService, factory.create(this.scopeDataService), this.scopeDetailDataService);
		});
	}

	public async generateScopeLayout() {
		const generator = await this.lazyInjector.inject<IEntityLayoutGenerator<IPrcItemScopeEntity>>(BASICS_SCOPE_ENTITY_LAYOUT_GENERATOR);
		const layout = mergeLayout(generator.generateLayout(), <ILayoutConfiguration<IPrcItemScopeEntity>>{
			overloads: {
				MatScope: {
					type: FieldType.LookupInputSelect,
					lookupOptions: createLookup({
						dataServiceToken: MaterialScopeLookupService,
						freeInputType: LookupFreeInputModelType.Number,
						showClearButton: true,
						serverSideFilter: {
							key: 'material-scope-filter',
							execute: context => {
								const prcItem = this.scopeDataService?.selectedPrcItem;

								if (!prcItem || !prcItem.MdcMaterialFk) {
									return '1==0'; // always false which mean filer out all data
								}

								return `MaterialFk=${prcItem.MdcMaterialFk} and IsLive=true`;
							}
						}
					})
				}
			},
			transientFields: [
				{
					model: 'Price',
					type: FieldType.Money,
					label: {key: 'cloud.common.entityPrice'},
					readonly: true
				},
				{
					model: 'PriceExtra',
					type: FieldType.Money,
					label: {key: 'basics.material.record.priceExtras'},
					readonly: true
				},
				{
					model: 'Total',
					type: FieldType.Money,
					label: {key: 'cloud.common.entityTotal'},
					readonly: true
				},
				{
					model: 'PriceOc',
					type: FieldType.Money,
					label: {key: 'procurement.common.prcItemPriceCurrency'},
					readonly: true
				},
				{
					model: 'PriceExtraOc',
					type: FieldType.Money,
					label: {key: 'procurement.common.prcItemPriceExtrasCurrency'},
					readonly: true
				},
				{
					model: 'TotalCurrency',
					type: FieldType.Money,
					label: {key: 'procurement.common.prcItemTotalCurrency'},
					readonly: true
				}
			]
		});

		this.roundingService.uiRoundingConfig(layout);

		return layout;
	}

	public async generateScopeDetailLayout() {
		const generator = await this.lazyInjector.inject<IEntityLayoutGenerator<IPrcItemScopeDetailEntity>>(BASICS_SCOPE_DETAIL_ENTITY_LAYOUT_GENERATOR);
		const layout = mergeLayout(generator.generateLayout(), <ILayoutConfiguration<IPrcItemScopeDetailEntity>>{
			groups: [
				{
					gid: 'basicData',
					attributes: ['PriceOc', 'PriceExtraOc', 'TotalCurrency']
				}
			],
			transientFields: [
				{
					model: 'TotalQuantity',
					type: FieldType.Quantity,
					label: {key: 'procurement.common.deliveryScheduleTotalQuantity'},
					readonly: true,
				}
			]
		});

		this.roundingService.uiRoundingConfig(layout);

		return layout;
	}

	public async generateScopeDetailValidationService() {
		const factory = await this.lazyInjector.inject<IBasicsScopeDetailValidationServiceFactory<IPrcItemScopeDetailEntity>>(BASICS_SCOPE_DETAIL_VALIDATION_SERVICE_FACTORY);
		return runInInjectionContext(this.injector, () => {
			return new PrcItemScopeDetailValidationService(this.scopeDetailDataService, factory.create(this.scopeDetailDataService));
		});
	}


	public async generateScopeDetailPriceConditionValidationService() {
		return runInInjectionContext(this.injector, () => {
			return new PrcItemScopeDetailPriceConditionValidationService(this.scopeDetailPriceConditionDataService);
		});
	}
}