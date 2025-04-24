/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConfigurationEventtype2restypeDataService } from '../services/configuration-eventtype2restype-data.service';
import { ConfigurationEventtype2restypeBehavior } from '../behaviors/configuration-eventtype2restype-behavior.service';
import { IEventType2ResTypeEntity } from './entities/event-type-2res-type-entity.interface';
import { createLookup, FieldType, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { PlatformTranslateService, prefixAllTranslationKeys } from '@libs/platform/common';


export const CONFIGURATION_EVENTTYPE2RESTYPE_ENTITY_INFO: EntityInfo = EntityInfo.create<IEventType2ResTypeEntity>({
	grid: {
		title: {key: 'productionplanning.configuration' + '.eventtype2restypeListTitle'},
		behavior: ctx => ctx.injector.get(ConfigurationEventtype2restypeBehavior),
	},
	form: {
		title: {key: 'productionplanning.configuration' + '.eventtype2restypeDetailTitle'},
		containerUuid: 'ac4a4d7a57cd47f0a6f03e3c30de60fe',
	},
	dataService: ctx => ctx.injector.get(ConfigurationEventtype2restypeDataService),
	dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Configuration', typeName: 'EventType2ResTypeDto'},
	permissionUuid: '1c25ab6bb66947b5b1303df7b608971b',
	layoutConfiguration: context => {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['BasResourceContextFk', 'CommentText', 'DateshiftModeResRequisition', 'IsDriver', 'IsLinkedFixToReservation', 'IsTruck', 'ResResourceFk', 'ResTypeFk',]
				}
			],
			overloads: {
				DateshiftModeResRequisition: {
					type: FieldType.Select,
					itemsSource: {
						items: [
							{id: 0, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.disabled')},
							{id: 1, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.interlocked')},
						],
					}
				},
				BasResourceContextFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: context.injector.get(UiCommonLookupDataFactoryService).fromSimpleDataProvider('basics.company.resourcecontext', {
							uuid: '32518f022da649d5895ff0484b99815c',
							valueMember: 'Id',
							displayMember: 'Description',
							showClearButton: true
						})
					})
				},
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: {key: 'entityComment', text: 'Comment'},
				}),
				...prefixAllTranslationKeys('productionplanning.configuration.', {
					DateshiftModeResRequisition: {key: 'entityDateshiftModeResRequisition', text: '*Dateshift Mode Res-Requisition'},
					IsDriver: {key: 'entityIsDriver', text: '*IsDriver'},
					IsLinkedFixToReservation: {key: 'entityIsLinkedFixToReservation', text: '*Is Linked Fix To Reservation'},
					IsTruck: {key: 'entityIsTruck', text: '*IsTruck'},
				}),
				BasResourceContextFk: {key: 'basics.company.entityResourceContextFk', text: '*Resource Context'},
				EventTypeFk: {key: 'productionplanning.common.event.eventTypeFk', text: 'Event Type'},
				ResResourceFk: {key: 'resource.master.entityResource', text: 'Resource'},
				ResTypeFk: {key: 'resource.type.entityResourceType', text: 'Resource Type'},
			}
		};
	}
});