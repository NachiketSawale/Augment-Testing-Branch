/*
* Copyright(c) RIB Software GmbH
*/

import { IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { IPpsCommonBizPartnerEntity, PpsCommonBizPartnerContactEntityInfoFactory, PpsCommonBizPartnerDataServiceManager } from '@libs/productionplanning/common';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsItemDataService } from '../services/pps-item-data.service';

export const PPS_ITEM_BP_CONTACT_ENTITY_INFO: EntityInfo = PpsCommonBizPartnerContactEntityInfoFactory.create({
	containerUuid: '5f2ff1ee49ec4959b16a1ee6466b3b9b',
	permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
	gridTitle: { text: '*Business Partner Contacts', key: 'productionplanning.item.listBizpPartnerContactTitle' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: '9dc39ef566304eda9cf33463fbbe828a',
			permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
			projectFkField: 'ProjectFk',
			ppsHeaderFkField: 'PPSHeaderFk',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(PpsItemDataService)
		};
		return PpsCommonBizPartnerDataServiceManager.getDataService(parentOptions, ctx) as IEntitySelection<IPpsCommonBizPartnerEntity>;
	},

});
