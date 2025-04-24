/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { EntityInfo } from '@libs/ui/business-base';
import { IPrcItemEntity, IPrcItemScopeDetailEntity, IPrcItemScopeEntity } from '../model/entities';
import { PrcCommonItemComplete } from '../model/procurement-common-item-complete.class';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { PrcItemScopeEntitySeriesService } from './prc-item-scope-entity-series.service';
import { BasicsSharedPriceConditionEntityInfo } from '@libs/basics/shared';


/**
 * A class which helps to create a series of scope entity containers
 */
export class PrcItemScopeEntityInfoSeries<
	PT extends IPrcItemEntity,
	PU extends PrcCommonItemComplete,
	HT extends IEntityIdentification,
	HU extends CompleteIdentification<HT>
> {
	public constructor(private config: {
		services: ProviderToken<PrcItemScopeEntitySeriesService<PT, PU, HT, HU>>
	}) {

	}

	public create() {
		return [
			this.createScopeEntityInfo(),
			this.createScopeDetailEntityInfo(),
			...this.createScopeDetailPriceConditionEntityInfo()
		];
	}

	private createScopeEntityInfo() {
		return EntityInfo.create<IPrcItemScopeEntity>({
			grid: {
				title: {
					key: 'basics.material.scope.listTitle',
					text: 'Variants'
				}
			},
			form: {
				containerUuid: '0d1766fa375e251caae7d2fd3e13058c',
				title: {
					key: 'basics.material.scope.formTitle',
					text: 'Variant Detail'
				}
			},
			permissionUuid: '4e3ca36d3ef04a4984ba33fcccb8b4c6',
			dtoSchemeId: {moduleSubModule: 'Basics.Material', typeName: 'MaterialScopeDto'},
			dataService: context => context.injector.get(this.config.services).scopeDataService,
			validationService: async context => {
				return await context.injector.get(this.config.services).generateScopeValidationService();
			},
			layoutConfiguration: async context => {
				return await context.injector.get(this.config.services).generateScopeLayout();
			}
		});
	}

	private createScopeDetailEntityInfo() {
		return EntityInfo.create<IPrcItemScopeDetailEntity>({
			grid: {
				title: {key: 'basics.material.scopeDetail.listTitle'}
			},
			form: {
				containerUuid: 'cf86b67e70e1b83cac761a106f4fa68b',
				title: {
					key: 'basics.material.scopeDetail.formTitle'
				}
			},
			permissionUuid: '1b0a9a4ed62a4d3c8951a76ec336eaaf',
			dtoSchemeId: {moduleSubModule: 'Basics.Material', typeName: 'MaterialScopeDetailDto'},
			dataService: context => {
				return context.injector.get(this.config.services).scopeDetailDataService;
			},
			validationService: async context => {
				return await context.injector.get(this.config.services).generateScopeDetailValidationService();
			},
			layoutConfiguration: async context => {
				return await context.injector.get(this.config.services).generateScopeDetailLayout();
			}
		});
	}

	private createScopeDetailPriceConditionEntityInfo() {
		return BasicsSharedPriceConditionEntityInfo.create({
			gridContainerUuid: 'a85ddb8363189b7eb48ad7e09b01885e',
			permissionUuid: 'b05a32047bd84d92847e294b0598e452',
			gridTitle: {text: 'Scope Price Condition', key: 'basics.material.scopeDetail.priceConditionTitle'},
			dataService: context => {
				return context.injector.get(this.config.services).scopeDetailPriceConditionDataService;
			},
			validationService: async context => {
				return await context.injector.get(this.config.services).generateScopeDetailPriceConditionValidationService();
			},
			dtoSchemeConfig: {moduleSubModule: 'Procurement.Common', typeName: 'PrcItemScopeDetailPcDto'}
		});
	}
}