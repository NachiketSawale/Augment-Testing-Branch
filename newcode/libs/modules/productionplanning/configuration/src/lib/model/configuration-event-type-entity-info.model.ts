/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConfigurationEventTypeDataService } from '../services/configuration-event-type-data.service';
import { ConfigurationEventTypeBehavior } from '../behaviors/configuration-event-type-behavior.service';
import { IEventTypeEntity } from './entities/event-type-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { createLookup, FieldType, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { DATESHIFT_MODES_TOKEN } from '@libs/productionplanning/shared';

export const CONFIGURATION_EVENT_TYPE_ENTITY_INFO: EntityInfo = EntityInfo.create<IEventTypeEntity>({
	grid: {
		title: {key: 'productionplanning.configuration' + '.listTitle'},
		behavior: ctx => ctx.injector.get(ConfigurationEventTypeBehavior),
	},
	form: {
		title: {key: 'productionplanning.configuration' + '.detailTitle'},
		containerUuid: 'ba21f131ad6942aca156f453793ce867',
	},
	dataService: ctx => ctx.injector.get(ConfigurationEventTypeDataService),
	dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Configuration', typeName: 'EventTypeDto'},
	permissionUuid: '2ad95d69c3b546428e425cb5f2d1a48a',
	layoutConfiguration: ctx => {
		return {
			groups: [
				{
					gid: 'basicConfiguration',
					attributes: ['Code', 'DescriptionInfo', 'IsDefault', 'IsHide', 'IsLive', 'Sorting',]
				},
				{
					gid: 'advancedConfiguration',
					attributes: ['IsForSequence', 'IsProductionDate', 'IsSystemEvent', 'PpsEntityFk', 'RubricCategoryFk', 'RubricFk',]
				},
				{
					gid: 'defaultValue',
					attributes: ['DateshiftMode', 'EarliestFinish', 'EarliestStart', 'LatestFinish', 'LatestStart', 'PlannedDuration', 'PlannedStart',]
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5']
				},
			],
			overloads: {
				DateshiftMode: {
					type: FieldType.Select,
					itemsSource: {
						items: ctx.injector.get(DATESHIFT_MODES_TOKEN),
					}
				},
				IsSystemEvent: {readonly: true},
				PpsEntityFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsEntityLookupOverload(false),//TODO:filterKey: 'productionplanning-configuration-eventtype-ppsentityfk-filter'
				RubricFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: ctx.injector.get(UiCommonLookupDataFactoryService).fromSimpleDataProvider('basics.lookup.rubric', {
							uuid: '6385bdd89602476a86cecb953dacdf85',
							valueMember: 'Id',
							displayMember: 'Description',
							showClearButton: true
						})
					})
				},
				RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideStocktransaction2RubricCategoryLookupOverload(true)//TODO:'productionplanning-configuration-eventtype-rubric-category-by-rubric-filter'
			},
			labels: {
				...prefixAllTranslationKeys('basics.company.', {
					RubricCategoryFk: {key: 'entityBasRubricCategoryFk', text: 'Category'},
					RubricFk: {key: 'entityBasRubricFk', text: 'Rubric'},
				}),
				...prefixAllTranslationKeys('productionplanning.configuration.', {
					basicConfiguration: {key: 'basicConfiguration', text: 'Basic Configuration',},
					advancedConfiguration: {key: 'advancedConfiguration', text: 'Advanced Configuration'},
					defaultValue: {key: 'defaultValue', text: 'Default Values'},
					IsForSequence: {key: 'entityIsForSequence', text: '*Is For Sequence'},
					IsHide: {key: 'isHide', text: '*Hide in Module'},
					IsProductionDate: {key: 'entityIsProductionDate', text: '*Is Production Date'},
					IsSystemEvent: {key: 'entityIsSystemEvent', text: 'System Event'},
					PlannedDuration: {key: 'plannedDuration', text: 'Planned Duration'},
					PlannedStart: {key: 'plannedstart', text: 'Planned Start Time'},
					PpsEntityFk: {key: 'entityPpsEntityFk', text: 'Is Type For'},
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					DateshiftMode: {key: 'event.dateshiftMode', text: '*DateShift Mode'},
					EarliestFinish: {key: 'event.earliestFinish', text: 'Earliest Finish Date'},
					EarliestStart: {key: 'event.earliestStart', text: 'Earliest Start Date'},
					LatestFinish: {key: 'event.latestFinish', text: 'Latest Finish Date'},
					LatestStart: {key: 'event.latestStart', text: 'Latest Start Date'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {key: 'entityCode', text: 'Code'},
					DescriptionInfo: {key: 'entityDescription', text: 'Description'},
					IsDefault: {key: 'entityIsDefault', text: 'Is Default'},
					IsLive: {key: 'entityIsLive', text: 'Active'},
					Sorting: {key: 'entitySorting', text: 'Sorting'},
					userDefTextGroup: {key: 'UserdefTexts'},
					Userdefined1: {key: 'entityUserDefined', params: {'p_0': '1'}},
					Userdefined2: {key: 'entityUserDefined', params: {'p_0': '2'}},
					Userdefined3: {key: 'entityUserDefined', params: {'p_0': '3'}},
					Userdefined4: {key: 'entityUserDefined', params: {'p_0': '4'}},
					Userdefined5: {key: 'entityUserDefined', params: {'p_0': '5'}}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {key: 'entityCode', text: 'Code'},
					DescriptionInfo: {key: 'entityDescription', text: 'Description'},
					IsDefault: {key: 'entityIsDefault', text: 'Is Default'},
					IsLive: {key: 'entityIsLive', text: 'Active'},
					Sorting: {key: 'entitySorting', text: 'Sorting'},
					userDefTextGroup: {key: 'UserdefTexts'},
					Userdefined1: {key: 'entityUserDefined', params: {'p_0': '1'}},
					Userdefined2: {key: 'entityUserDefined', params: {'p_0': '2'}},
					Userdefined3: {key: 'entityUserDefined', params: {'p_0': '3'}},
					Userdefined4: {key: 'entityUserDefined', params: {'p_0': '4'}},
					Userdefined5: {key: 'entityUserDefined', params: {'p_0': '5'}}
				}),
			}
		};
	}
});