/*
* Copyright(c) RIB Software GmbH
*/

import { IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { IPpsCommonBizPartnerEntity, PpsCommonBizPartnerContactEntityInfoFactory, PpsCommonBizPartnerDataServiceManager } from '@libs/productionplanning/common';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsHeaderDataService } from '../../services/pps-header-data.service';

export const PPS_HEADER2BP_CONTACT_ENTITY_INFO: EntityInfo = PpsCommonBizPartnerContactEntityInfoFactory.create({
	containerUuid: 'ebe6aee8a1264b159d19d312ed087d0a',
	formContainerUuid: '60d6931951cd4f7e96dad63ef85e8674',
	permissionUuid: 'c3edae3d673443b7badc9eee399ae880',
	gridTitle: { text: '*PPS Header Partner Contacts', key: 'productionplanning.header.header2contactListTitle' },
	formTitle: { text: '*PPS Header Partner Contact Details', key: 'productionplanning.header.header2contactDetailTitle' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: '8ad87c147d1040d4956966a37c7e749c',
			permissionUuid: 'c3edae3d673443b7badc9eee399ae880',
			projectFkField: 'PrjProjectFk',
			ppsHeaderFkField: 'Id',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(PpsHeaderDataService)
		};
		return PpsCommonBizPartnerDataServiceManager.getDataService(parentOptions, ctx) as IEntitySelection<IPpsCommonBizPartnerEntity>;
	},

});
/*
export const PPS_HEADER2BP_CONTACT_ENTITY_INFO = EntityInfo.create<IPpsCommonBizPartnerContactEntity>({
	grid: {
		title: { text: '*PPS Header Partner Contacts', key: 'productionplanning.header.header2contactListTitle' },
		behavior: ctx => ctx.injector.get(PpsCommonBizPartnerContactGridBehavior)
	},
	form: {
		title: {
			text: 'PPS Header Partner Contact Details',
			key: 'productionplanning.header.header2contactDetailTitle'
		},
		containerUuid: '60d6931951cd4f7e96dad63ef85e8674'
	},
	dataService: (ctx) => ctx.injector.get(PpsHeader2BpContactDataService),
	validationService: (ctx) => ctx.injector.get(PpsHeader2BpContactValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'CommonBizPartnerContactDto' },
	permissionUuid: '8f82d96b1cff49aea461a6ae9e6572d1',
	layoutConfiguration: context => {
		return context.injector.get(PpsHeader2BpContactLayoutService).generateLayout();
	}
});
*/