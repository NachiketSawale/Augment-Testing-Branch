/*
* Copyright(c) RIB Software GmbH
*/

import { IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { IPpsCommonBizPartnerEntity, PpsCommonBizPartnerContactEntityInfoFactory, PpsCommonBizPartnerDataServiceManager } from '@libs/productionplanning/common';
import { EntityInfo } from '@libs/ui/business-base';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';

export const ENGINEERING_TASK_BP_CONTACT_ENTITY_INFO: EntityInfo = PpsCommonBizPartnerContactEntityInfoFactory.create({
	containerUuid: 'c2950440ad254e338ded260b788a8672',
	permissionUuid: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
	gridTitle: { text: '*Business Partner Contacts', key: 'productionplanning.item.listBizpPartnerContactTitle' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: 'ebc3f90b8cf04ddaac0b78fd95df0af0',
			permissionUuid: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
			projectFkField: 'PPSItem_ProjectFk',
			ppsHeaderFkField: 'PPSItem_PpsHeaderFk',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(EngineeringTaskDataService)
		};
		return PpsCommonBizPartnerDataServiceManager.getDataService(parentOptions, ctx) as IEntitySelection<IPpsCommonBizPartnerEntity>;
	},

});
