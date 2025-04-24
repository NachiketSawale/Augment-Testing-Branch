/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EventTemplateEntity } from '../entities/event-template-entity.class';
import { ProductionplanningEventconfigurationEventTemplateDataService } from '../../services/event-template-data.service';
import { PpsEventTemplateGridBehavior } from '../../behaviors/event-template-grid-behavior.service';

import { createLookup, FieldType, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { DATESHIFT_MODES_TOKEN } from '@libs/productionplanning/shared';

import {
	BasicsSharedLookupOverloadProvider
} from '@libs/basics/shared';

import { prefixAllTranslationKeys } from '@libs/platform/common';

export const EVENT_TEMPLATE_ENTITY_INFO = EntityInfo.create<EventTemplateEntity>({
	grid: {
		title: { text: '*Event Templates', key: 'productionplanning.eventconfiguration.eventTemplate.listTitle' },
		behavior: ctx => ctx.injector.get(PpsEventTemplateGridBehavior)
	},
	form: {
		title: {
			text: '*Event Template Detail',
			key: 'productionplanning.eventconfiguration.eventTemplate.detailTitle'
		},
		containerUuid: '768ac08d96d54bc0aefa6c3ef999b2c1'
	},
	dataService: (ctx) => ctx.injector.get(ProductionplanningEventconfigurationEventTemplateDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.EventConfiguration', typeName: 'EventTemplateDto' },
	permissionUuid: '8c63d8f33a0b4e4bad6883ca6416dfae',
	layoutConfiguration: (ctx) => {
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: ['EventTypeFk', 'SequenceOrder', 'Duration', 'LeadTime', 'RelationKindFk', 'MinTime', 'DateshiftMode']
				}
			],
			labels: {
				...prefixAllTranslationKeys('productionplanning.eventconfiguration.', {
					SequenceOrder: { key: 'eventTemplate.sequenceOrder' },
					Duration: { key: 'eventTemplate.duration' },
					LeadTime: { key: 'eventTemplate.leadTime' },
					RelationKindFk: { key: 'eventTemplate.relationKind' },
					MinTime: { key: 'eventTemplate.minTime' },

				}),
				...prefixAllTranslationKeys('cloud.common.', {
					basicData: { key: 'entityProperties' },

				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					EventTypeFk: { key: 'event.eventTypeFk' },
					DateshiftMode: { key: 'event.dateshiftMode' },
				}),
			},
			overloads: {
				RelationKindFk: BasicsSharedLookupOverloadProvider.provideRelationKindLookupOverload(true),
				EventTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: ctx.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EventType', {
							uuid: 'b0f6efc453bd45cfadb19531b6d2744e',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated',
							showClearButton: true
						})
					})
				},
				DateshiftMode: {
					type: FieldType.Select,
					itemsSource: {
						items: ctx.injector.get(DATESHIFT_MODES_TOKEN),
					}
				},
			}
		};
	}
});
