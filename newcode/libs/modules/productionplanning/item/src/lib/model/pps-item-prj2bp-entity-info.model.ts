import { PpsCommonPrj2bpEntityInfoFactory } from '@libs/productionplanning/common';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsItemDataService } from '../services/pps-item-data.service';
import { IPPSItemEntity } from './models';

export const PPS_ITEM_PRJ2BP_ENTITY_INFO: EntityInfo = PpsCommonPrj2bpEntityInfoFactory.create<IPPSItemEntity>({
	containerUuid: '2c8866b319f74459994d1595a56fcc3e',
	permissionUuid: 'B15A05E067094D3988F4626281C88E24',
	gridTitle: { text: '*Project Partners', key: 'project.main.listPrj2BpTitle' },
	projectFkField: 'ProjectFk',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},
});
