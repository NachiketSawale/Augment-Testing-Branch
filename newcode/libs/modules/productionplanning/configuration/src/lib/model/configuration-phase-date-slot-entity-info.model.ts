/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConfigurationPhaseDateSlotDataService } from '../services/configuration-phase-date-slot-data.service';
import { ConfigurationPhaseDateSlotBehavior } from '../behaviors/configuration-phase-date-slot-behavior.service';
import { IPpsPhaseDateSlotEntity } from './entities/pps-phase-date-slot-entity.interface';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { FieldType } from '@libs/ui/common';
import { PlatformTranslateService, prefixAllTranslationKeys } from '@libs/platform/common';


export const CONFIGURATION_PHASE_DATE_SLOT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsPhaseDateSlotEntity>({
	grid: {
		title: {key: 'productionplanning.configuration' + '.phaseDateSlotListTitle'},
		behavior: ctx => ctx.injector.get(ConfigurationPhaseDateSlotBehavior),
	},
	dataService: ctx => ctx.injector.get(ConfigurationPhaseDateSlotDataService),
	dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Configuration', typeName: 'PpsPhaseDateSlotDto'},
	permissionUuid: '6122e4411ec94e8f8b306d9b03d15ed0',
	layoutConfiguration: context => {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['ColumnSelection', 'ColumnTitle', 'DatetimeFormat', 'PpsEntityFk', 'PpsPhaseTypeFk',]
				}
			],
			overloads: {
				PpsPhaseTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsPhaseTypeLookupOverload(false),
				PpsEntityFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsEntityLookupOverload(false),//TODO:filterKey: 'productionplanning-configuration-phasedateslot-ppsentityfk-filter'
				ColumnSelection: {
					type: FieldType.Select,
					itemsSource: {
						items: [
							{id: 0, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.plannedstart')},
							{id: 1, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.plannedfinish')},
							{id: 2, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.earlieststart')},
							{id: 3, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.earliestfinish')},
							{id: 4, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.lateststart')},
							{id: 5, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.latestfinish')}
						],
					}
				},
				DatetimeFormat: {
					type: FieldType.Select,
					itemsSource: {
						items: [
							{id: 0, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.datetime')},
							{id: 1, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.date')},
							{id: 2, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.time')}
						],
					}
				}
			},
			labels: {
				...prefixAllTranslationKeys('productionplanning.configuration.', {
					ColumnSelection: {key: 'entityColumnSelection', text: '*Column Selection'},
					ColumnTitle: {key: 'columnTitle', text: '*Column Title'},
					DatetimeFormat: {key: 'datetimeFormat', text: '*Datetime Format'},
					PpsEntityFk: {key: 'entityPpsEntityFk', text: 'Is Type For'},
					PpsPhaseTypeFk: {key: 'phaseType', text: '*Phase Type'},
				}),
			}
		};
	}
});