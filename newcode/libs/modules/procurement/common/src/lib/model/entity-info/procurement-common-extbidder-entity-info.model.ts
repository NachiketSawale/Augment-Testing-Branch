/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {
	EntityInfo,
	IEntityContainerBehavior, IGridContainerLink
} from '@libs/ui/business-base';
import { IProcurementCommonExtBidderEntity } from '../entities/procurement-common-extbidder-entity.interface';
import { ProcurementCommonExtBidderDataService } from '../../services/procurement-common-extbidder-data.service';
import { ProcurementCommonExtBidderLayoutService } from '../../services/procurement-common-extbidder-layout.service';

/**
 * Procurement common extbidder price for boq entity info helper
 */
export class ProcurementCommonExtBidderEntityInfo {
	/**
	 * Create a real procurement common extbidder  entity info configuration for different modules
	 */
	public static create<T extends IProcurementCommonExtBidderEntity,PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		/**
		 * Permission uuid in lower case
		 */
		permissionUuid: string,
		/**
		 * Form uuid in lower case
		 */
		formUuid: string;
		/**
		 * Behavior Service
		 */
		behaviorToken?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>
		/**
		 * Data service
		 */
		dataServiceToken: ProviderToken<ProcurementCommonExtBidderDataService<T,PT, PU>>,
		/**
		 * Customize layout service by extending extbidder
		 */
		layoutServiceToken?: ProviderToken<ProcurementCommonExtBidderLayoutService>
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: { text: 'Further external BPs', key: 'procurement.common.extBidderGridTitle' },
			},
			form: {
				containerUuid:config.formUuid,
				title: { text: 'Further external BPs Detail', key: 'procurement.common.extBidderFormTitle' },
			},
			dataService: context => context.injector.get(config.dataServiceToken),
			dtoSchemeId: { moduleSubModule: 'Procurement.Common', typeName: 'PrcPackage2ExtBidderDto' },
			permissionUuid: config.permissionUuid,
			layoutConfiguration: context => {
				return context.injector.get(config.layoutServiceToken ?? ProcurementCommonExtBidderLayoutService).generateConfig();
			}
		});
	}
}