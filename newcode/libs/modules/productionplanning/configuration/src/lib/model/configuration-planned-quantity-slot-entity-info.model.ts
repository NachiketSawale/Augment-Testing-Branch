/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConfigurationPlannedQuantitySlotDataService } from '../services/configuration-planned-quantity-slot-data.service';
import { ConfigurationPlannedQuantitySlotBehavior } from '../behaviors/configuration-planned-quantity-slot-behavior.service';
import { IPpsPlannedQuantitySlotEntity } from './entities/pps-planned-quantity-slot-entity.interface';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const CONFIGURATION_PLANNED_QUANTITY_SLOT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsPlannedQuantitySlotEntity>({
	grid: {
		title: {key: 'productionplanning.configuration' + '.plannedQuantityslotListTitle'},
		behavior: ctx => ctx.injector.get(ConfigurationPlannedQuantitySlotBehavior),
	},
	dataService: ctx => ctx.injector.get(ConfigurationPlannedQuantitySlotDataService),
	dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Configuration', typeName: 'PpsPlannedQuantitySlotDto'},
	permissionUuid: '5f58a961d5934674975057bd908319d2',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['BasUomFk', 'ColumnNameInfo', 'DescriptionInfo', 'MdcProductDescriptionFk', 'PpsPlannedQuantityTypeFk', 'Result',]
			},
			{
				gid: 'userDefTextGroup',
				attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5']
			}
		],
		overloads: {
			BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			PpsPlannedQuantityTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsPlannedQuantityTypeLookupOverload(false),
		},
		labels: {
			MdcProductDescriptionFk: {key: 'productionplanning.formulaconfiguration.plannedQuantity.mdcProductDescriptionFk', text: '*Material Product Template'},
			...prefixAllTranslationKeys('productionplanning.configuration.', {
				ColumnNameInfo: {key: 'columnName', text: '*Column Name'},
				Result: {key: 'entityResult', text: '*Result'},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				BasUomFk: {key: 'entityUoM', text: '*UoM'},
				DescriptionInfo: {key: 'entityDescription', text: 'Description'},
				PpsPlannedQuantityTypeFk: {key: 'entityType', text: 'Type'},
				userDefTextGroup: {key: 'UserdefTexts'},
				Userdefined1: {key: 'entityUserDefined', params: {'p_0': '1'}},
				Userdefined2: {key: 'entityUserDefined', params: {'p_0': '2'}},
				Userdefined3: {key: 'entityUserDefined', params: {'p_0': '3'}},
				Userdefined4: {key: 'entityUserDefined', params: {'p_0': '4'}},
				Userdefined5: {key: 'entityUserDefined', params: {'p_0': '5'}}
			}),
		}
	}
});