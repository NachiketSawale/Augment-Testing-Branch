/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompositeGridConfigurationToken, CompositeGridContainerComponent, EntityInfo, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IBasicsSharedHistoricalPriceForItemEntity } from '../entities/historical-price-for-item-entity.interface';
import { BasicsSharedHistoricalPriceForItemDataService } from '../../services/historical-price-for-item-data.service';
import { HistoricalPriceForItemComponent } from '../../components/historical-price-for-item/historical-price-for-item.component';
import { BasicsSharedHistoricalPriceForItemLayoutService } from '../../services/historical-price-for-item-layout.service';
import { BasicsSharedHistoricalPriceForItemDataServiceToken } from '../interfaces/Historical-price-for-item-info-token.interface';
import { EntityDomainType } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { BasicsSharedHistoricalPriceForBoqBehavior } from '../../behaviors/historical-price-for-boq-behavior.service';

/**
 * Procurement common historical price for item entity info helper
 */
export abstract class BasicsSharedHistoricalPriceForItemEntityInfo {
	/**
	 * Create a real procurement historical price for item entity info configuration for different modules
	 */
	public static create<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		/**
		 * Permission uuid in lower case
		 */
		permissionUuid: string;
		/**
		 * Data service
		 */
		dataServiceToken: ProviderToken<BasicsSharedHistoricalPriceForItemDataService<PT, PU>>;
		/**
		 * Customize layout service by extending historical price for item
		 */
		layoutServiceToken?: ProviderToken<BasicsSharedHistoricalPriceForItemLayoutService>;

		behaviorGrid?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<IBasicsSharedHistoricalPriceForItemEntity>, IBasicsSharedHistoricalPriceForItemEntity>>;
	}) {
		return EntityInfo.create<IBasicsSharedHistoricalPriceForItemEntity>({
			grid: {
				title: { text: 'Historical Price for Item', key: 'basics.common.historicalPrice.historicalPriceForItemContainerTitle' },
				behavior: (context) => context.injector.get(config.behaviorGrid ?? BasicsSharedHistoricalPriceForBoqBehavior),
				treeConfiguration: true,
				containerType: CompositeGridContainerComponent,
				providers: (ctx) => [
					{
						provide: CompositeGridConfigurationToken,
						useValue: {
							maxTopLeftLength: 150,
							topLeftContainerType: HistoricalPriceForItemComponent,
							providers: [
								{
									provide: BasicsSharedHistoricalPriceForItemDataServiceToken,
									useValue: ctx.injector.get(config.dataServiceToken),
								},
							],
						},
					},
				],
			},
			dataService: (context) => context.injector.get(config.dataServiceToken),
			entitySchema: {
				schema: 'HistoricalPriceForItemDto',
				properties: {
					Index: { domain: EntityDomainType.Description, mandatory: true },
					PId: { domain: EntityDomainType.Integer, mandatory: false },
					MaterialId: { domain: EntityDomainType.Integer, mandatory: false },
					Selected: { domain: EntityDomainType.Boolean, mandatory: true },
					ItemCodeAndDesc: { domain: EntityDomainType.Description, mandatory: false },
					SourceType: { domain: EntityDomainType.Description, mandatory: false },
					CalatlogType: { domain: EntityDomainType.Description, mandatory: false },
					CatalogId: { domain: EntityDomainType.Integer, mandatory: false },
					Type: { domain: EntityDomainType.Integer, mandatory: false },
					SourceCodeAndDesc: { domain: EntityDomainType.Description, mandatory: false },
					UnitRate: { domain: EntityDomainType.Decimal, mandatory: false },
					CurrencyId: { domain: EntityDomainType.Integer, mandatory: false },
					ProjectId: { domain: EntityDomainType.Integer, mandatory: false },
					ConvertedUnitRate: { domain: EntityDomainType.Integer, mandatory: false },
					Variance: { domain: EntityDomainType.Integer, mandatory: false },
					VarianceFormatter: { domain: EntityDomainType.Integer, mandatory: false },
					PriceUnit: { domain: EntityDomainType.Integer, mandatory: false },
					MaterialPriceListId: { domain: EntityDomainType.Integer, mandatory: false },
					UomId: { domain: EntityDomainType.Decimal, mandatory: false },
					Weighting: { domain: EntityDomainType.Integer, mandatory: false },
					BusinessPartnerId: { domain: EntityDomainType.Integer, mandatory: false },
					DateTime: { domain: EntityDomainType.Date, mandatory: false },
					Co2Project: { domain: EntityDomainType.Integer, mandatory: false },
					Co2Source: { domain: EntityDomainType.Integer, mandatory: false },
					Date: { domain: EntityDomainType.Integer, mandatory: false },
					UpdateDate: { domain: EntityDomainType.Integer, mandatory: false },
				},
			},
			permissionUuid: config.permissionUuid,
			layoutConfiguration: (context) => {
				return context.injector.get(BasicsSharedHistoricalPriceForItemLayoutService).generateConfig();
			},
		});
	}
}
