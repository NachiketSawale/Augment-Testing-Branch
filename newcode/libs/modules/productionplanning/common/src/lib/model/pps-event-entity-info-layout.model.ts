/*
 * Copyright(c) RIB Software GmbH
 */
import { DATESHIFT_MODES_TOKEN, IPPSEventEntity, IPpsEventEntityInfoParameter, PpsEntity } from '@libs/productionplanning/shared';
import { createLookup, FieldType, ILayoutConfiguration, ILayoutGroup, ILookupContext, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { CALENDAR_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { BasicsShareControllingUnitLookupService, BasicsSharedLookupOverloadProvider, IControllingUnitEntity } from '@libs/basics/shared';
import { IEventTypeEntity } from '@libs/productionplanning/configuration';
import { ProjectLocationLookupService } from '@libs/project/shared';
import { IProjectLocationEntity } from '@libs/project/interfaces';

export const GetPpsEventEntityLayout = (parameter?: IPpsEventEntityInfoParameter): ((ctx: IInitializationContext) => Promise<ILayoutConfiguration<IPPSEventEntity>>) => {
	return async (ctx: IInitializationContext): Promise<ILayoutConfiguration<IPPSEventEntity>> => {
		const allGroups: ILayoutGroup<IPPSEventEntity>[] = [
			{
				gid: 'event',
				attributes: [
					'EventCode',
					'EventTypeFk',
					'PlannedStart',
					'PlannedFinish',
					'EarliestStart',
					'LatestStart',
					'EarliestFinish',
					'LatestFinish',
					'CalCalendarFk',
					'PsdActivityFk',
					'ActualStart',
					'ActualFinish',
					'Quantity',
					'BasUomFk',
					'IsLocked',
					'IsLive',
					'Userflag1',
					'Userflag2',
					'DateshiftMode',
					...(parameter?.PpsEntity === PpsEntity.PPSProduct || parameter?.PpsEntity === PpsEntity.PPSItem ? ['SequenceOrder'] : []),
				],
			},
			{
				gid: 'Assignment',
				attributes: ['PrjLocationFk', 'MdcControllingunitFk', 'LgmJobFk'],
			},
		];

		// const groups: ILayoutGroup<IPPSEventEntity>[] = [];
		// if ((parameter?.ExcludedAttribute?.length || 0) > 0) {
		// 	allGroups.forEach((group) => {
		// 		group.attributes = group.attributes.filter((attr) => !parameter?.ExcludedAttribute?.includes(attr));
		// 		if (group.attributes.length > 0) {
		// 			groups.push(group);
		// 		}
		// 	});
		// }

		return {
			groups: allGroups,
			overloads: {
				EventCode: {
					readonly: true,
					// requiredInErrorHandling: true,
				},
				EventTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: ctx.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EventType', {
							uuid: '22c592d0bd734b7eaf0ae3640e206b20',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated',
							showClearButton: true,
							clientSideFilter: {
								execute(item: IEventTypeEntity, context: ILookupContext<IEventTypeEntity, IPPSEventEntity>) {
									if (parameter?.PpsEntity === PpsEntity.PPSProductionSet || parameter?.PpsEntity === PpsEntity.PPSProduct) {
										return item.PpsEntityFk === parameter?.PpsEntity;
									}
									return item.PpsEntityFk === PpsEntity.GenericEvent;
								},
							},
						}),
					}),
				},
				PsdActivityFk: {
					readonly: true,
					// navigator
					// lookup
				},
				CalCalendarFk: (await ctx.lazyInjector.inject(CALENDAR_LOOKUP_PROVIDER_TOKEN)).generateCalendarLookup(),
				PrjLocationFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectLocationLookupService,
						showClearButton: true,
						showDescription: true,
						readonly: true,
						serverSideFilter: {
							key: '',
							execute(context: ILookupContext<IProjectLocationEntity, IPPSEventEntity>) {
								return {
									ProjectId: context.entity ? context.entity.ProjectFk : -1,
								};
							},
						},
						showGrid: true,
						displayMember: 'Code',
						showDialog: false,
					}),
				},
				MdcControllingunitFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareControllingUnitLookupService,
						showClearButton: true,
						descriptionMember: 'DescriptionInfo.Translated',
						clientSideFilter: {
							execute(item: IControllingUnitEntity, context: ILookupContext<IControllingUnitEntity, IPPSEventEntity>) {
								return item.PrjProjectFk === context.entity?.ProjectFk;
							},
						},
					}),
				},
				LgmJobFk: {
					// lookup
				},
				BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				DateshiftMode: {
					type: FieldType.Select,
					itemsSource: {
						items: ctx.injector.get(DATESHIFT_MODES_TOKEN),
					},
				},
				SequenceOrder: {
					readonly: true,
					sortable: true,
				},
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Quantity: 'entityQuantity',
					BasUomFk: 'entityUoM',
					IsLive: 'entityIsLive',
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					PrjLocationFk: 'prjLocationFk',
					MdcControllingunitFk: 'mdcControllingUnitFk',
				}),
				...prefixAllTranslationKeys('productionplanning.common.event.', {
					EventCode: 'eventCode',
					EventTypeFk: 'eventTypeFk',
					PlannedStart: 'plannedStart',
					PlannedFinish: 'plannedFinish',
					EarliestStart: 'earliestStart',
					EarliestFinish: 'earliestFinish',
					LatestStart: 'latestStart',
					LatestFinish: 'latestFinish',
					CalCalendarFk: 'calCalendarFk',
					PsdActivityFk: 'psdActivityFk',
					ActualStart: 'actualStart',
					ActualFinish: 'actualFinish',
					IsLocked: 'isLocked',
					Userflag1: 'userflag1',
					Userflag2: 'userflag2',
					DateshiftMode: 'dateshiftMode',
					SequenceOrder: 'SequenceOrder',
				}),
				LgmJobFk: { key: 'project.costcodes.lgmJobFk', text: '*Logistic Job' },
			},
		};
	};
};
