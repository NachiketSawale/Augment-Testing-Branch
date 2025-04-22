/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {
	ProcurementCommonSuggestBiddersDataService,
	ProcurementCommonSuggestBiddersLayoutService
} from '../../services';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';

/**
 * Procurement common suggest bidder entity info helper
 */
export class ProcurementCommonSuggestBidderEntityInfo {
	/**
	 * Create a real procurement suggest bidder entity info configuration for different modules
	 * @param config configuration of create suggest bidder entity info
	 */
	public static create<T extends IPrcSuggestedBidderEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		/**
		 * Permission uuid in lower case
		 */
		permissionUuid: string,
		/**
		 * Form uuid in lower case
		 */
		formUuid: string;
		/**
		 * Data service
		 */
		dataServiceToken: ProviderToken<ProcurementCommonSuggestBiddersDataService<T, PT, PU>>,
		/**
		 * Container behavior
		 */
		behavior: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,

	}) {
		return EntityInfo.create<T>({
			grid: {
				title: { text: 'Suggested Bidders', key: 'procurement.common.suggestedBidder.suggestedBidderContainerGridTitle' },
				behavior: context => context.injector.get(config.behavior)
			},
			form: {
				containerUuid: config.formUuid,
				title: { text: 'Suggested Bidder Detail', key: 'procurement.common.suggestedBidder.suggestedBidderContainerFormTitle' }
			},
			//prepareEntityContainer: ProcurementCommonItemEntityInfo.prepareItemContainer,
			dataService: context => context.injector.get(config.dataServiceToken),
			dtoSchemeId: { moduleSubModule: 'Procurement.Common', typeName: 'PrcSuggestedBidderDto' },
			permissionUuid: config.permissionUuid,
			layoutConfiguration: context => {
				return context.injector.get(ProcurementCommonSuggestBiddersLayoutService).generateLayout({
					dataServiceToken: config.dataServiceToken
				});
			}
		});
	}
}