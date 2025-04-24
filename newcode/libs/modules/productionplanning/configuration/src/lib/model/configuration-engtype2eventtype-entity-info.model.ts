/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConfigurationEngtype2eventtypeDataService } from '../services/configuration-engtype2eventtype-data.service';
import { ConfigurationEngtype2eventtypeBehavior } from '../behaviors/configuration-engtype2eventtype-behavior.service';
import { IEngType2PpsEventTypeEntity } from './entities/eng-type-2pps-event-type-entity.interface';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';


export const CONFIGURATION_ENGTYPE2EVENTTYPE_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngType2PpsEventTypeEntity>({
	grid: {
		title: {key: 'productionplanning.configuration' + '.engtype2eventtypeListTitle'},
		behavior: ctx => ctx.injector.get(ConfigurationEngtype2eventtypeBehavior),
	},
	dataService: ctx => ctx.injector.get(ConfigurationEngtype2eventtypeDataService),
	dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Configuration', typeName: 'EngType2PpsEventTypeDto'},
	permissionUuid: '3c86eab96195490dae758aded1f0525b',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['EngTypeFk',]
			}
		],
		overloads: {
			EngTypeFk: {
				label: {key: 'productionplanning.common.event.eventTypeFk', text: '*Event Type'},
				...BasicsSharedCustomizeLookupOverloadProvider.provideEngineeringTypeLookupOverload(false)
			}
		}
	}
});