import { EntityInfo } from '@libs/ui/business-base';
import {
	PpsCommonBizPartnerEntityInfoFactory,
} from '@libs/productionplanning/common';
import { PpsItemDataService } from '../services/pps-item-data.service';
import { IPPSItemEntity } from './models';

export const PPS_ITEM_BUSINESS_PARTNER_ENTITY_INFO: EntityInfo = PpsCommonBizPartnerEntityInfoFactory.create<IPPSItemEntity>({
	containerUuid: '9dc39ef566304eda9cf33463fbbe828a',
	permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
	gridTitle: { text: '*Business Partners', key: 'productionplanning.item.listBizPartnerTitle' },
	projectFkField: 'ProjectFk',
	ppsHeaderFkField: 'PPSHeaderFk',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},
});

/*
export const PPS_ITEM_BUSINESS_PARTNER_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: 'productionplanning.item.listBizPartnerTitle',
		containerUuid: '9dc39ef566304eda9cf33463fbbe828a',
	},
	dataService: ctx => ctx.injector.get(PpsItemBusinessPartnerDataService),
	dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Common', typeName: 'CommonBizPartnerDto'},
	permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
	layoutConfiguration: context => {
		return context.injector.get(PpsCommonBusinessPartnerLayoutConfiguration).generateLayout();
	}
}  as IEntityInfo<IPpsCommonBizPartnerEntity>);
  */