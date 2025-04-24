/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {
	EntityInfo,
	IEntityContainerBehavior, IGridContainerLink
} from '@libs/ui/business-base';
import { IPrcCommonExtBidder2contactEntity } from '../entities/prc-common-extbidder2contact-entity.interface';
import { PrcCommonExtBidder2contactDataService } from '../../services/prc-common-extbidder2contact-data.service';
import { PrcCommonExtBidder2contactLayout } from '../../services/prc-common-extbidder2contact-layout.service';

/**
 * Procurement common ext bidder 2 contact entity info
 */
export class PrcCommonExtBidder2contactEntityInfo {
	/**
	 * Create a real procurement common ext bidder 2 contact entity info configuration for different modules
	 */
	public static create<T extends IPrcCommonExtBidder2contactEntity,PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
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
		dataServiceToken: ProviderToken<PrcCommonExtBidder2contactDataService<T,PT, PU>>,
		/**
		 * Customize layout service by extending ext bidder 2 contact
		 */
		layoutServiceToken?: ProviderToken<PrcCommonExtBidder2contactLayout>
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: { text: 'Contact of Further External BPs', key: 'procurement.package.extBidder2ContactGridTitle' },
			},
			form: {
				containerUuid:config.formUuid,
				title: { text: 'Contact of Further External BPs Detail', key: 'procurement.package.extBidder2ContactFormTitle' },
			},
			dataService: context => context.injector.get(config.dataServiceToken),
			dtoSchemeId: { moduleSubModule: 'Procurement.Common', typeName: 'PrcPackage2ExtBpContactDto' },
			permissionUuid: config.permissionUuid,
			layoutConfiguration: context => {
				return context.injector.get(config.layoutServiceToken ?? PrcCommonExtBidder2contactLayout).generateConfig();
			}
		});
	}
}