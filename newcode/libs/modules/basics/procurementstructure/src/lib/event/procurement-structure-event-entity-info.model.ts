/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { BasicsProcurementStructureEventBehaviorService } from './basics-procurement-structure-event-behavior.service';
import { BasicsProcurementStructureEventDataService } from './basics-procurement-structure-event-data.service';
import { BasicsProcurementStructureEventLayoutService } from './basics-procurement-structure-event-layout.service';
import { IPrcStructureEventEntity } from '../model/entities/prc-structure-event-entity.interface';


export const PROCUREMENT_STRUCTURE_EVENT_ENTITY_INFO = EntityInfo.create<IPrcStructureEventEntity>({
	dtoSchemeId: {moduleSubModule: 'Basics.ProcurementStructure', typeName: 'PrcStructureEventDto'},
	permissionUuid: '32d5bdf548844b5581c0dd4dc69c6cdd',
	grid: {
		title: {text: 'Event', key: 'basics.procurementstructure.eventContainerTitle'},
	},
	form: {
		containerUuid: 'afa865416d3f4a1080300b78acbbd69c',
		title: {text: 'Event Detail', key: 'basics.procurementstructure.eventDetailContainerTitle'},
	},
	containerBehavior: ctx => ctx.injector.get(BasicsProcurementStructureEventBehaviorService),
	dataService: ctx => ctx.injector.get(BasicsProcurementStructureEventDataService),
	layoutConfiguration: context => {
		return context.injector.get(BasicsProcurementStructureEventLayoutService).generateLayout();
	}
});
