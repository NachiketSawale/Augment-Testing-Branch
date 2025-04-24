/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IMaterialEventTypeEntity } from './models';
import { PpsMaterialEventtypeDataService } from '../services/eventtype/pps-material-eventtype-data.service';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEventTypeEntity } from '@libs/productionplanning/configuration';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';
import { BASICS_SITE_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';

export const PPS_MATERIAL_EVENTTYPE_ENTITY_INFO: EntityInfo = EntityInfo.create<IMaterialEventTypeEntity>({
	grid: {
		title: { key: 'productionplanning.ppsmaterial.materialEventType.listViewTitle' },
		containerUuid: '43d8655f5b7b4357a3b3a7839ce7243b',
	},
	form: {
		title: { key: 'productionplanning.ppsmaterial.materialEventType.detailViewTitle' },
		containerUuid: '0de5eadccc3f47d98ff39b2af6d6dd2c',
	},
	dataService: (ctx) => ctx.injector.get(PpsMaterialEventtypeDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.PpsMaterial', typeName: 'MaterialEventTypeDto' },
	permissionUuid: '43d8655f5b7b4357a3b3a7839ce7243b',
	layoutConfiguration: async (context) => {
		return <ILayoutConfiguration<IMaterialEventTypeEntity>>{
			groups: [
				{
					gid: 'eventDefinition',
					title: {
						key: 'productionplanning.ppsmaterial.eventDefinition',
						text: 'Event Definition',
					},
					attributes: ['PpsEventTypeFk', 'VarDuration', 'Sorting', 'SiteFk', 'ResTypeFk', 'IsLive'],
				},
				{
					gid: 'defaultCalculation',
					title: {
						key: 'productionplanning.ppsmaterial.defaultCalculation',
						text: 'Default Calculation',
					},
					attributes: ['LagTime', 'PpsEventTypeBaseFk'],
				},
				{
					gid: 'documentation',
					title: {
						key: 'productionplanning.ppsmaterial.documentation',
						text: 'Documentation',
					},
					attributes: ['CommentText'],
				},
			],
			overloads: {
				SiteFk: (await context.lazyInjector.inject(BASICS_SITE_LOOKUP_PROVIDER_TOKEN)).provideSiteLookupOverload(),
				PpsEventTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IMaterialEventTypeEntity, IEventTypeEntity>({
						dataService: context.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EventType', {
							uuid: '390a2e63f5274b9b91a0e7e7351eb98f',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated',
							showClearButton: false,
							serverSideFilter: {
								key: '',
								execute: (ctx: ILookupContext<IEventTypeEntity, IMaterialEventTypeEntity>) => ({ IsSystemEvent: false }),
							},
						}),
					}),
				},
				PpsEventTypeBaseFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IMaterialEventTypeEntity, IEventTypeEntity>({
						dataService: context.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EventType', {
							uuid: 'dc6bc773922d43839187758b9fd97dee',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated',
						}),
					}),
				},
				ResTypeFk: ResourceSharedLookupOverloadProvider.provideResourceTypeLookupOverload(false),
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Sorting: { key: 'entitySorting', text: 'Sorting' },
					IsLive: { key: 'entityIsLive', text: 'IsLive' },
					CommentText: { key: 'entityComment', text: 'Comment' },
				}),
				...prefixAllTranslationKeys('productionplanning.ppsmaterial.', {
					PpsEventTypeFk: { key: 'materialEventType.ppsEventTypeFk', text: 'PPS Event Type' },
					VarDuration: { key: 'materialEventType.varduration', text: 'Variable Duration' },
					LagTime: { key: 'materialEventType.lagTime', text: 'Lag Time' },
					PpsEventTypeBaseFk: { key: 'materialEventType.ppsEventTypeBaseFk', text: 'PPS Event Type Base' },
				}),
				...prefixAllTranslationKeys('resource.master.', {
					SiteFk: { key: 'SiteFk', text: 'Site' },
				}),
				ResTypeFk: { key: 'resource.type.entityResourceType', text: 'Resource Type' },
			},
		};
	},
});
