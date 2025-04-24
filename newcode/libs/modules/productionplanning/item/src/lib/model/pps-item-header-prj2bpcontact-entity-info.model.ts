import { IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { PpsCommonPrj2bpcontactEntityInfoFactory, PpsCommonPrj2bpDataServiceManager } from '@libs/productionplanning/common';
import { IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsItemDataService } from '../services/pps-item-data.service';

export const PPS_ITEM_HEADER_PRJ2BPCONTACT_ENTITY_INFO: EntityInfo = PpsCommonPrj2bpcontactEntityInfoFactory.create({
	containerUuid: '362417e0fd18435ca56376ae393acb53',
	permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
	gridTitle: { text: '*PPS Header Partner Contacts', key: 'productionplanning.item.listHeader2BpContactTitle' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: '801b2d34b66f4c3bac0520ce4fea0cc2',
			permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
			projectFkField: 'ProjectFk',
			ppsHeaderFk: 'PPSHeaderFk',
			parentServiceFn: (context: IInitializationContext) => {
				return ctx.injector.get(PpsItemDataService);
			}
		};
		return PpsCommonPrj2bpDataServiceManager.getDataService(parentOptions, ctx) as IEntitySelection<IProjectMainPrj2BusinessPartnerEntity>;
	},
});
