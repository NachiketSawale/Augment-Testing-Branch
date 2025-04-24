/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { CompositeGridConfigurationToken, CompositeGridContainerComponent, EntityInfo } from '@libs/ui/business-base';
import { IBasicsSharedHistoricalPriceForBoqEntity } from '../entities/historical-price-for-boq-entity.interface';
import { BasicsSharedHistoricalPriceForBoqDataService } from '../../services/historical-price-for-boq-data.service';
import { HistoricalPriceForBoqComponent } from '../../components/historical-price-for-boq/historical-price-for-boq.component';
import { BasicsSharedHistoricalPriceForBoqLayoutService } from '../../services/historical-price-for-boq-layout.service';
import { BasicsSharedHistoricalPriceForBoqDataServiceToken } from '../interfaces/historical-price-for-boq-info-token.interface';
import { BasicsSharedHistoricalPriceForBoqBehavior } from '../../behaviors/historical-price-for-boq-behavior.service';

/**
 * Procurement common historical price for boq entity info helper
 */
export class BasicsSharedHistoricalPriceForBoqEntityInfo {
	/**
	 * Create a real procurement historical price for boq entity info configuration for different modules
	 */
	public static create<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		/**
		 * Permission uuid in lower case
		 */
		permissionUuid: string;
		/**
		 * Data service
		 */
		dataServiceToken: ProviderToken<BasicsSharedHistoricalPriceForBoqDataService<PT, PU>>;
		/**
		 * Customize layout service by extending historical price for item
		 */
		layoutServiceToken?: ProviderToken<BasicsSharedHistoricalPriceForBoqLayoutService>;
	}) {
		return EntityInfo.create<IBasicsSharedHistoricalPriceForBoqEntity>({
			grid: {
				title: { text: 'Historical Price for Boq', key: 'basics.common.historicalPrice.historicalPriceForBoqContainerTitle' },
				containerType: CompositeGridContainerComponent,
				providers: (ctx) => [
					{
						provide: CompositeGridConfigurationToken,
						useValue: {
							maxTopLeftLength: 150,
							topLeftContainerType: HistoricalPriceForBoqComponent,
							providers: [
								{
									provide: BasicsSharedHistoricalPriceForBoqDataServiceToken,
									useValue: {
										dataServiceToken: config.dataServiceToken,
									},
								},
							],
						},
					},
				],
				behavior: context => context.injector.get(BasicsSharedHistoricalPriceForBoqBehavior)
			},
			dataService: (context) => context.injector.get(config.dataServiceToken),
			//TODO: replace it with actual entitySchema
			entitySchema: {
				schema: 'HistoricalPriceForBoqDto', properties: {}
			},
			permissionUuid: config.permissionUuid,
			layoutConfiguration: (context) => {
				return context.injector.get(BasicsSharedHistoricalPriceForBoqLayoutService).generateConfig();
			},
		});
	}
}
