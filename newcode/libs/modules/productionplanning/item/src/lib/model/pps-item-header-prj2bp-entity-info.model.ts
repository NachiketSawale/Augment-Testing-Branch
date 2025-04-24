import { PpsCommonPrj2bpEntityInfoFactory } from '@libs/productionplanning/common';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsItemDataService } from '../services/pps-item-data.service';
import { IPPSItemEntity } from './models';

export const PPS_ITEM_HEADER_PRJ2BP_ENTITY_INFO: EntityInfo = PpsCommonPrj2bpEntityInfoFactory.create<IPPSItemEntity>({
	containerUuid: '801b2d34b66f4c3bac0520ce4fea0cc2',
	permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
	gridTitle: { text: '*PPS Header Partners', key: 'productionplanning.item.listHeader2BpTitle' },
	projectFkField: 'ProjectFk',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},
});
