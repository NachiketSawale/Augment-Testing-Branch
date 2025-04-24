/*
* Copyright(c) RIB Software GmbH
*/

import { EntityInfo } from '@libs/ui/business-base';
import { PpsHeader2ClerkDataService } from '../../services/pps-header2clerk-data.service';
import { PpsHeader2ClerkValidationService } from '../../services/pps-header2clerk-validation.service';
import { IPpsHeader2ClerkEntity } from '../../model/entities/pps-header2clerk-entity.interface';
import { PpsHeader2ClerkGridBehavior } from '../../behaviors/pps-header2clerk-grid-behavior.service';
import { PpsHeader2ClerkLayoutService } from '../../services/layouts/pps-header2clerk-layout.service';

export const PPS_HEADER2CLERK_ENTITY_INFO = EntityInfo.create<IPpsHeader2ClerkEntity>({
	grid: {
		title: { text: '*PPS Header Clerks', key: 'productionplanning.header.header2clerkListTitle' },
		behavior: ctx => ctx.injector.get(PpsHeader2ClerkGridBehavior)
	},
	form: {
		title: {
			text: 'PPS Header Clerk Details',
			key: 'productionplanning.header.header2clerkDetailTitle'
		},
		containerUuid: 'fbdf809c513f4690a35fc970ba9918f8'
	},
	dataService: (ctx) => ctx.injector.get(PpsHeader2ClerkDataService),
	validationService: (ctx) => ctx.injector.get(PpsHeader2ClerkValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Header', typeName: 'Header2ClerkDto' },
	permissionUuid: '4e4dd1f922d14bcb8fd831a8babb5cdb',
	layoutConfiguration: context => {
		return context.injector.get(PpsHeader2ClerkLayoutService).generateLayout();
	}
});
