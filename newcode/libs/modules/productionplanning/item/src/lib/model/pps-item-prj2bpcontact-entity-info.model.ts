import { IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { PpsCommonPrj2bpcontactEntityInfoFactory, PpsCommonPrj2bpDataServiceManager } from '@libs/productionplanning/common';
import { IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsItemDataService } from '../services/pps-item-data.service';

export const PPS_ITEM_PRJ2BPCONTACT_ENTITY_INFO: EntityInfo = PpsCommonPrj2bpcontactEntityInfoFactory.create({
	containerUuid: '09b000cdd4bf4vvfb4bc7D28ff8bf1c9',
	permissionUuid: '09B099CDD4BF4AAFB4BC7D28DD8BF1C9',
	gridTitle: { text: '*Project Partner Contacts', key: 'project.main.listPrj2BpContactTitle' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: '2c8866b319f74459994d1595a56fcc3e',
			permissionUuid: 'B15A05E067094D3988F4626281C88E24',
			projectFkField: 'ProjectFk',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(PpsItemDataService)
		};
		return PpsCommonPrj2bpDataServiceManager.getDataService(parentOptions, ctx) as IEntitySelection<IProjectMainPrj2BusinessPartnerEntity>;
	},
});
