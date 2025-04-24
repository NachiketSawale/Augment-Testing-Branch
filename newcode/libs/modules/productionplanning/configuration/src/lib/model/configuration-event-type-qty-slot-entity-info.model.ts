/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConfigurationEventTypeQtySlotDataService } from '../services/configuration-event-type-qty-slot-data.service';
import { ConfigurationEventTypeQtySlotBehavior } from '../behaviors/configuration-event-type-qty-slot-behavior.service';
import { IEventTypeSlotEntity } from './entities/event-type-slot-entity.interface';
import { CONFIGURATION_EVENT_TYPE_SLOT_LAYOUT } from './configuration-event-type-slot-entity-info.model';


export const CONFIGURATION_EVENT_TYPE_QTY_SLOT_ENTITY_INFO: EntityInfo = EntityInfo.create<IEventTypeSlotEntity>({
	grid: {
		title: {key: 'productionplanning.configuration' + '.eventtypeqtyslotListTitle'},
		behavior: ctx => ctx.injector.get(ConfigurationEventTypeQtySlotBehavior),
		containerUuid: '772dbc472e3e401cabfbcd97a5bf4db4'
	},
	dataService: ctx => ctx.injector.get(ConfigurationEventTypeQtySlotDataService),
	dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Configuration', typeName: 'EventTypeSlotDto'},
	permissionUuid: '40ad0cb374dd490f8abbceeccc89ac06',
	layoutConfiguration: CONFIGURATION_EVENT_TYPE_SLOT_LAYOUT
});