/*
* Copyright(c) RIB Software GmbH
*/
import { EntityInfo } from '@libs/ui/business-base';
import {
	PpsCommonBizPartnerEntityInfoFactory,
} from '@libs/productionplanning/common';
import { PpsHeaderDataService } from '../../services/pps-header-data.service';
import { IPpsHeaderEntity } from '@libs/productionplanning/shared';

export const PPS_HEADER2BP_ENTITY_INFO: EntityInfo = PpsCommonBizPartnerEntityInfoFactory.create<IPpsHeaderEntity>({
	containerUuid: '8ad87c147d1040d4956966a37c7e749c',
	permissionUuid: 'c3edae3d673443b7badc9eee399ae880',
	gridTitle: { text: '*PPS Header Partners', key: 'productionplanning.header.header2bpListTitle' },
	formTitle: {
		text: 'PPS Header Partner Details',
		key: 'productionplanning.header.header2bpDetailTitle'
	},
	formContainerUuid: '4eeb4ce922fe42bb8542faf2d9247d3d',
	projectFkField: 'PrjProjectFk',
	ppsHeaderFkField: 'Id',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsHeaderDataService);
	},
});
/*
export const PPS_HEADER2BP_ENTITY_INFO = EntityInfo.create<IPpsCommonBizPartnerEntity>({
	grid: {
		title: { text: '*PPS Header Partners', key: 'productionplanning.header.header2bpListTitle' },
		behavior: ctx => ctx.injector.get(PpsCommonBizPartnerGridBehavior)
	},
	form: {
		title: {
			text: 'PPS Header Partner Details',
			key: 'productionplanning.header.header2bpDetailTitle'
		},
		containerUuid: '4eeb4ce922fe42bb8542faf2d9247d3d'
	},
	dataService: (ctx) => ctx.injector.get(PpsHeader2BpDataService),
	validationService: (ctx) => ctx.injector.get(PpsHeader2BpValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'CommonBizPartnerDto' },
	permissionUuid: '722fc93ae069474182680c6453b74225',
	layoutConfiguration: context => {
		return context.injector.get(PpsCommonBusinessPartnerLayoutConfiguration).generateLayout();
	}
});
*/
