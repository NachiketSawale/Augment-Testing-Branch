/*
 * Copyright(c) RIB Software GmbH
 */

import { ContainerLayoutConfiguration, EntityInfo } from '@libs/ui/business-base';
import { ConfigurationEventTypeSlotDataService } from '../services/configuration-event-type-slot-data.service';
import { ConfigurationEventTypeSlotBehavior } from '../behaviors/configuration-event-type-slot-behavior.service';
import { IEventTypeSlotEntity } from './entities/event-type-slot-entity.interface';
import { createLookup, FieldType, ILookupContext, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { PlatformTranslateService, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IBasicsCustomizePpsEntityEntity } from '@libs/basics/interfaces';
import { PpsEntity } from '@libs/productionplanning/shared';

function isDateTimeColumn(column: number) {
	return column >= 0 && column <= 5;
}

export const CONFIGURATION_EVENT_TYPE_SLOT_LAYOUT: ContainerLayoutConfiguration<IEventTypeSlotEntity> = (context) => {
	return {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['ColumnSelection', 'ColumnTitle', 'DatetimeFormat', 'IsReadOnly', 'PpsEntityFk', 'PpsEntityRefFk', 'PpsEventTypeFk'],
			},
		],
		overloads: {
			PpsEventTypeFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataService: context.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EventType', {
						uuid: '332fcd24b21941f0b95aede8876dbd74',
						valueMember: 'Id',
						displayMember: 'DescriptionInfo.Translated',
						showClearButton: true,
					}),
				}),
			},
			ColumnSelection: {
				type: FieldType.Select,
				itemsSource: {
					items: [
						{ id: 0, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.plannedstart') },
						{ id: 1, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.plannedfinish') },
						{ id: 2, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.earlieststart') },
						{ id: 3, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.earliestfinish') },
						{ id: 4, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.lateststart') },
						{ id: 5, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.latestfinish') },
					],
				},
			},
			DatetimeFormat: {
				type: FieldType.Select,
				itemsSource: {
					items: [
						{ id: 0, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.datetime') },
						{ id: 1, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.date') },
						{ id: 2, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.time') },
					],
				},
			},
			PpsEntityFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsEntityLookupOverload(false, {
				execute(item: IBasicsCustomizePpsEntityEntity, context: ILookupContext<IBasicsCustomizePpsEntityEntity, IEventTypeSlotEntity>): boolean {
					if (item) {
						if (context.entity && isDateTimeColumn(context.entity.ColumnSelection) && (context.entity.PpsEntityRefFk === PpsEntity.PPSProduct || context.entity.PpsEntityRefFk === PpsEntity.FabricationUnit)) {
							// if Source of Date slots is PPS Product or FabricationUnit, then show only PPS Product in "Show On" column
							return item.Id === PpsEntity.PPSProduct;
						}
						// Engineering Task, Transport Bundle, PPS Item, PPS Product, PPSProductionSet, Transport Package
						return (
							item.Id === PpsEntity.EngineeringTask ||
							item.Id === PpsEntity.TransportBundle ||
							item.Id === PpsEntity.PPSItem ||
							item.Id === PpsEntity.PPSProduct ||
							item.Id === PpsEntity.PPSProductionSet ||
							item.Id === PpsEntity.TransportPackage
						);
					}
					return false;
				},
			}),
			PpsEntityRefFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsEntityLookupOverload(true, {
				execute(item: IBasicsCustomizePpsEntityEntity, context: ILookupContext<IBasicsCustomizePpsEntityEntity, IEventTypeSlotEntity>): boolean {
					if (item) {
						if (context.entity && isDateTimeColumn(context.entity.ColumnSelection)) {
							if (context.entity.PpsEntityFk === PpsEntity.PPSProduct) {
								return item.Id === PpsEntity.PPSItem || item.Id === PpsEntity.PPSProduct || item.Id === PpsEntity.FabricationUnit;
							}
							return item.Id === PpsEntity.PPSItem || item.Id === PpsEntity.PPSProduct;
						} else {
							return item.Id === PpsEntity.PPSItem;
						}
					}
					return false;
				},
			}),
		},
		labels: {
			...prefixAllTranslationKeys('productionplanning.configuration.', {
				ColumnSelection: { key: 'entityColumnSelection', text: '*Column Selection' },
				ColumnTitle: { key: 'columnTitle', text: '*Column Title' },
				DatetimeFormat: { key: 'datetimeFormat', text: '*Datetime Format' },
				IsReadOnly: { key: 'entityIsReadOnly', text: '*Read Only' },
				PpsEntityFk: { key: 'entityPpsEntityFk', text: 'Is Type For' },
				PpsEntityRefFk: { key: 'entityRefEntityFk', text: '*Ref. Type For' },
			}),

			PpsEventTypeFk: { key: 'productionplanning.common.event.eventTypeFk', text: '*Event Type' },
		},
	};
};
export const CONFIGURATION_EVENT_TYPE_SLOT_ENTITY_INFO: EntityInfo = EntityInfo.create<IEventTypeSlotEntity>({
	grid: {
		title: { key: 'productionplanning.configuration' + '.eventtypedateslotListTitle' },
		behavior: (ctx) => ctx.injector.get(ConfigurationEventTypeSlotBehavior),
		containerUuid: '645f9eef664f422b81ecfda68680d710',
	},
	dataService: (ctx) => ctx.injector.get(ConfigurationEventTypeSlotDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Configuration', typeName: 'EventTypeSlotDto' },
	permissionUuid: '40ad0cb374dd490f8abbceeccc89ac06',
	layoutConfiguration: CONFIGURATION_EVENT_TYPE_SLOT_LAYOUT,
});
