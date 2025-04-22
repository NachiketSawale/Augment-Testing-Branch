/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { EntityInfo, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { BasicsSharedCalculateOverGrossService } from '@libs/basics/shared';
import { IPrcItemEntity } from '../entities';
import { ProcurementCommonItemDataService, ProcurementCommonItemValidationService } from '../../services';
import { ProcurementCommonItemLayoutService } from '../../services/procurement-common-item-layout.service';
import { PrcCommonItemComplete } from '../procurement-common-item-complete.class';

/**
 * Procurement common item entity info helper
 */
export class ProcurementCommonItemEntityInfo {
	/**
	 * Create a real procurement item entity info configuration for different modules
	 */
	public static create<T extends IPrcItemEntity, U extends PrcCommonItemComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		/**
		 * Permission uuid in lower case
		 */
		permissionUuid: string;
		/**
		 * Form uuid in lower case
		 */
		formUuid: string;
		/**
		 * Data service
		 */
		dataServiceToken: ProviderToken<ProcurementCommonItemDataService<T, U, PT, PU>>;
		/**
		 * Validation service
		 */
		validationServiceToken: ProviderToken<ProcurementCommonItemValidationService<T, U, PT, PU>>;
		/**
		 * Container behavior
		 */
		behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>;
		/**
		 * Customize layout service by extending ProcurementCommonItemLayoutService
		 * Default is ProcurementCommonItemLayoutService
		 */
		layoutServiceToken?: ProviderToken<ProcurementCommonItemLayoutService>;
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: { text: 'Items', key: 'procurement.common.item.prcItemContainerGridTitle' },
				behavior: config.behavior ? (context) => context.injector.get(config.behavior!) : undefined,
			},
			form: {
				containerUuid: config.formUuid,
				title: { text: 'Item Detail', key: 'procurement.common.item.prcItemContainerFormTitle' },
			},
			prepareEntityContainer: ProcurementCommonItemEntityInfo.prepareItemContainer,
			dataService: (context) => context.injector.get(config.dataServiceToken),
			validationService: (context) => context.injector.get(config.validationServiceToken),
			dtoSchemeId: { moduleSubModule: 'Procurement.Common', typeName: 'PrcItemDto' },
			permissionUuid: config.permissionUuid,
			layoutConfiguration: (context) => {
				return context.injector.get(config.layoutServiceToken ?? ProcurementCommonItemLayoutService).generateLayout(context, {
					dataServiceToken: config.dataServiceToken,
				});
			},
		});
	}

	private static async prepareItemContainer(context: IInitializationContext): Promise<void> {
		const calculateOverGrossService = context.injector.get(BasicsSharedCalculateOverGrossService);
		await Promise.all([calculateOverGrossService.loadIsCalculateOverGross()]);
	}
}
