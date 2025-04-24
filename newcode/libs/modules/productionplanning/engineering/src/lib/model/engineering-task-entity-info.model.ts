/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';
import { IEngTaskEntity } from './entities/eng-task-entity.interface';
import { createLookup, FieldType, ILookupContext, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { IBasicsClerkEntity } from '@libs/basics/interfaces';
import { BasicsShareControllingUnitLookupService, BasicsSharedClerkLookupService, BasicsSharedLookupOverloadProvider, BasicsSharedMaterialGroupLookupService, BasicsSharedMaterialLookupService, IControllingUnitEntity } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEventTypeEntity } from '@libs/productionplanning/configuration';
import { ProjectLocationLookupService, ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { DATESHIFT_MODES_TOKEN, PpsItemLookupService, PpsSharedDrawingDialogLookupService } from '@libs/productionplanning/shared';
import { IPPSItemEntity } from '@libs/productionplanning/item';
import { PpsEngineeringHeaderDialogLookupService } from '../services/lookups/pps-engineering-header-dialog-lookup.service';

export const ENGINEERING_TASK_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngTaskEntity>({
	grid: {
		title: { key: 'productionplanning.engineering.taskListTitle' },
		containerUuid: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
	},
	form: {
		title: { key: 'productionplanning.engineering' + '.taskDetailTitle' },
		containerUuid: 'eaf809020ac948a0b5cbb05f6bd4ed13',
	},
	dataService: (ctx) => ctx.injector.get(EngineeringTaskDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Engineering', typeName: 'EngTaskDto' },
	permissionUuid: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
	layoutConfiguration: (context) => {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: [
						'Code',
						'Description',
						'Remark',
						'EngTaskStatusFk',
						'ClerkFk',
						'EngDrawingFk',
						'EngHeaderFk',
						'EventTypeFk',
						'IsLive',
						'EngDrawingTypeFk',
						'LgmJobFk',
						'SiteInfo',
						'PpsItemMaterialCodes',
						'LoginClerkRoles',
						'IsUpstreamDefined',
					],
				},
				{
					gid: 'projectInfoGroup',
					attributes: ['ProjectId', 'BusinessPartnerFk'],
				},
				{
					gid: 'Assignment',
					attributes: ['PPSItemFk', 'PrjLocationFk', 'MdcControllingunitFk'],
				},
				{
					gid: 'planningInfoGroup',
					attributes: ['Quantity', 'BasUomFk', 'ActualQuantity', 'RemainingQuantity', 'PlannedStart', 'PlannedFinish', 'EarliestStart', 'LatestStart', 'EarliestFinish', 'LatestFinish', 'ActualStart', 'ActualFinish', 'DateshiftMode'],
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
				},
				{
					gid: 'contactsGroup',
					attributes: ['BusinessPartnerOrderFk', 'MaterialGroupFk', 'MdcMaterialFk'],
				},
			],
			overloads: {
				IsLive: {
					readonly: true,
				},
				LoginClerkRoles: {
					readonly: true,
				},
				EngHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: PpsEngineeringHeaderDialogLookupService,
					}),
				},
				EventTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IEngTaskEntity, IEventTypeEntity>({
						dataService: context.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EventType', {
							uuid: '5d89e7fd65e941dcb03b5ea7f8a89a78',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated',
							showClearButton: true,
							clientSideFilter: {
								execute(item: IEventTypeEntity, context: ILookupContext<IEventTypeEntity, IEngTaskEntity>): boolean {
									return item.PpsEntityFk === 5;
								},
							},
						}),
					}),
				},
				ClerkFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup<IEngTaskEntity, IBasicsClerkEntity>({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description',
					}),
				},
				MdcControllingunitFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareControllingUnitLookupService,
						showClearButton: true,
						descriptionMember: 'DescriptionInfo.Translated',
						serverSideFilter: {
							key: 'controlling.structure.prjcontrollingunit.filterkey',
							execute(context: ILookupContext<IControllingUnitEntity, IEngTaskEntity>) {
								return {
									ProjectFk: context.entity?.ProjectId,
								};
							},
						},
					}),
				},
				PrjLocationFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectLocationLookupService,
						showClearButton: true,
						showDescription: true,
						serverSideFilter: {
							key: '',
							execute(context: ILookupContext<IProjectLocationEntity, IEngTaskEntity>) {
								return {
									ProjectId: context.entity ? context.entity.ProjectId : null,
								};
							},
						},
						showGrid: true,
						displayMember: 'Code',
						showDialog: false,
					}),
				},
				PPSItemFk: {
					readonly: true,
					// navigator
					type: FieldType.Lookup,
					lookupOptions: createLookup<IEngTaskEntity, IPPSItemEntity>({
						dataServiceToken: PpsItemLookupService,
						showClearButton: true,
						showDescription: true,
					}),
				},
				EngTaskStatusFk: BasicsSharedLookupOverloadProvider.provideEngineeringTaskStatusReadonlyLookupOverload(),
				EngDrawingTypeFk: BasicsSharedLookupOverloadProvider.provideEngineeringDrawingTypeLookupOverload(true),
				EngDrawingFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: PpsSharedDrawingDialogLookupService,
					}),
				},
				ProjectId: ProjectSharedLookupOverloadProvider.provideProjectReadonlyLookupOverload(),
				SiteInfo: { readonly: true },
				BusinessPartnerFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BusinessPartnerLookupService,
						displayMember: 'BusinessPartnerName1',
					}),
				},
				BusinessPartnerOrderFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BusinessPartnerLookupService,
						displayMember: 'BusinessPartnerName1',
					}),
				},
				MaterialGroupFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialGroupLookupService,
						displayMember: 'Code',
					}),
				},
				MdcMaterialFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialLookupService,
						displayMember: 'Code',
					}),
				},
				DateshiftMode: {
					readonly: true,
					type: FieldType.Select,
					itemsSource: {
						items: context.injector.get(DATESHIFT_MODES_TOKEN),
					},
				},
				PpsItemMaterialCodes: { readonly: true },
				ActualQuantity: { readonly: true },
				RemainingQuantity: { readonly: true },
				//IsUpstreamDefined:{readonly:true},
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode', text: '*Code' },
					Description: { key: 'entityDescription', text: '*Description' },
					IsLive: { key: 'entityIsLive', text: '*Active' },
					EngTaskStatusFk: { key: 'entityStatus', text: '*Status' },
					Userdefined1: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: { p_0: '1' },
					},
					Userdefined2: {
						key: 'entityUserDefined',
						text: 'User-Defined 2',
						params: { p_0: '2' },
					},
					Userdefined3: {
						key: 'entityUserDefined',
						text: 'User-Defined 3',
						params: { p_0: '3' },
					},
					Userdefined4: {
						key: 'entityUserDefined',
						text: 'User-Defined 4',
						params: { p_0: '4' },
					},
					Userdefined5: {
						key: 'entityUserDefined',
						text: 'User-Defined 5',
						params: { p_0: '5' },
					},
					ProjectId: { key: 'entityProject', text: '*Project' },
					BusinessPartnerFk: { key: 'entityBusinessPartner', text: 'Business Partner' },
					Quantity: { key: 'entityQuantity', text: '*Quantity' },
					BasUomFk: { key: 'entityUoM', text: '*UoM' },
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					MdcControllingunitFk: { key: 'mdcControllingUnitFk', text: '*Controlling Unit' },
					PrjLocationFk: { key: 'prjLocationFk', text: '*Location' },
					PPSItemFk: { key: 'event.itemFk', text: '*Production Unit' },
					PlannedStart: { key: 'event.plannedStart', text: 'Planned StartDate' },
					PlannedFinish: { key: 'event.plannedFinish', text: 'Planned FinishDate' },
					EarliestStart: { key: 'event.earliestStart', text: 'Earliest StartDate' },
					LatestStart: { key: 'event.latestStart', text: 'Latest StartDate' },
					EarliestFinish: { key: 'event.earliestFinish', text: 'Earliest FinishDate' },
					LatestFinish: { key: 'event.latestFinish', text: 'Latest FinishDate' },
					ActualStart: { key: 'event.actualStart', text: '* Actual StartDate' },
					ActualFinish: { key: 'event.actualFinish', text: '* Actual FinishDate' },
					DateshiftMode: { key: 'event.dateshiftMode', text: '*DateShift Mode' },
					BusinessPartnerOrderFk: { key: 'businessPartnerOrderFk', text: '*Business Partner Contract' },
					MaterialGroupFk: { key: 'materialGroupFk', text: '*Material Group' },
					MdcMaterialFk: { key: 'mdcMaterialFk', text: '*Material' },
				}),
				...prefixAllTranslationKeys('productionplanning.engineering.', {
					ClerkFk: { key: 'entityClerkFk', text: '*Engineering Planner' },
					EngDrawingFk: { key: 'entityEngDrawingFk', text: '*Drawing' },
					EngHeaderFk: { key: 'entityEngHeader', text: '*Engineering Header' },
					EventTypeFk: { key: 'entityEventTypeFk', text: '*Task Type' },
					PpsItemMaterialCodes: { key: 'ppsItemMaterialCodes', text: '*Planning Unit Materials' },
					LoginClerkRoles: { key: 'loginClerkRoles', text: '*Login Clerk Roles' },
					IsUpstreamDefined: { key: 'isUpstreamDefined', text: '*Upstream State' },
					ActualQuantity: { key: 'entityActualQuantity', text: '*Actual Quantity' },
					RemainingQuantity: { key: 'entityRemainingQuantity', text: '*Remaining Quantity' },
				}),
				...prefixAllTranslationKeys('productionplanning.drawing.', {
					EngDrawingTypeFk: { key: 'engDrawingTypeFk', text: '*Drawing Type' },
					IsFullyAccounted: { key: 'isFullyAccounted', text: '*Is Fully Accounted' },
				}),
				...prefixAllTranslationKeys('basics.site.', {
					SiteInfo: { key: 'entitySite', text: 'Site' },
				}),
				LgmJobFk: { key: 'project.costcodes.lgmJobFk', text: '*Logistic Job' },
			},
		};
	},
});
