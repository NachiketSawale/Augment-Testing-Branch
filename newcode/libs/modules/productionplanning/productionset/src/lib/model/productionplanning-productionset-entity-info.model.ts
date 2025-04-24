/* eslint-disable @nrwl/nx/enforce-module-boundaries */

/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningProductionsetDataService } from '../services/productionplanning-productionset-data.service';
import { ProductionplanningProductionsetBehavior } from '../behaviors/productionplanning-productionset-behavior.service';
import { IProductionsetEntity } from './models';
import { BasicsSharedLookupOverloadProvider, BasicsSharedPpsProductionSetStatusLookupService, BasicsSharedSiteLookupService } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, IAdditionalLookupOptions, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { ProductionSetParentLookupService } from '../services/lookups/productionplanning-productionset-parent-lookup.service';
import { ProductionPlanningProductionSetEventtypeLookupService } from '../services/lookups/productionplanning-productionset-eventtype-lookup.service';
import { BASICS_SITE_LOOKUP_PROVIDER_TOKEN, IBasicsCustomizePpsProductionSetStatusEntity, IBasicsUomEntity } from '@libs/basics/interfaces';
import { DATESHIFT_MODES_TOKEN } from '@libs/productionplanning/shared';
import { IEventTypeEntity } from '../../../../../productionplanning/configuration/src/lib/model/entities/event-type-entity.interface';
import { ProjectLocationLookupService } from '@libs/project/shared';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { ControllingSharedControllingUnitLookupProviderService } from '@libs/controlling/shared';
import { IControllingUnitLookupEntity } from '@libs/controlling/interfaces';

export const PRODUCTIONPLANNING_PRODUCTIONSET_ENTITY_INFO: EntityInfo = EntityInfo.create<IProductionsetEntity>({
	grid: {
		title: { key: 'productionplanning.productionset.listProductionsetTitle' },
		behavior: (ctx) => ctx.injector.get(ProductionplanningProductionsetBehavior),
		containerUuid: '2581963f63944bdca59bec07f539cafb',
	},
	form: {
		title: { key: 'productionplanning.productionset.detailsProductionsetTitle' },
		containerUuid: '9e6d0550dbc845abbba4c239fc4763e5',
	},
	dataService: (ctx) => ctx.injector.get(ProductionplanningProductionsetDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.ProductionSet', typeName: 'ProductionsetDto' },
	permissionUuid: '2581963f63944bdca59bec07f539cafb',
	layoutConfiguration: async (ctx) => {
		const uomLookupOverload = BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true);
		const controllingUnitLookupProvider = ctx.injector.get(ControllingSharedControllingUnitLookupProviderService);
		return <ILayoutConfiguration<IProductionsetEntity>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['PpsProdSetStatusFk', 'Code', 'DescriptionInfo', 'EventTypeFk', 'IsLive', 'ProductionSetParentFk', 'IsUserEditedValue', 'CommentText'],
				},
				{
					gid: 'productionGroup',
					attributes: ['SiteFk', 'ProductionSiteFk'],
				},
				{
					gid: 'Assignment',
					attributes: ['PrjLocationFk', 'MdcControllingunitFk'],
				},
				{
					gid: 'planningInfoGroup',
					attributes: ['DateshiftMode', 'Quantity', 'ActualQuantity', 'RemainingQuantity', 'BasUomFk', 'PlannedStart', 'PlannedFinish', 'EarliestStart', 'LatestStart', 'EarliestFinish', 'LatestFinish'],
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'],
				},
			],
			overloads: {
				PpsProdSetStatusFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedPpsProductionSetStatusLookupService,
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: {
							select(item: IBasicsCustomizePpsProductionSetStatusEntity): string {
								return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
							},
							getIconType() {
								return 'css';
							},
						},
					}),
					readonly: false,
				},
				ProductionSiteFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedSiteLookupService,
					}),
				},
				SiteFk: (await ctx.lazyInjector.inject(BASICS_SITE_LOOKUP_PROVIDER_TOKEN)).provideSiteLookupOverload(),
				PrjLocationFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectLocationLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: '',
							execute(context: ILookupContext<IProjectLocationEntity, IProductionsetEntity>) {
								return {
									ProjectId: context.entity ? context.entity.ProjectId : null,
								};
							},
						},
						// TODO: implement possibilty to expand/collapse tree without closing popup
						// events: [
						// 	{
						// 		name: 'onSelectedItemChanged',
						// 		handler: function (e: ILookupEvent<IProjectLocationEntity, IProductionsetEntity>) {
						// 			const selected = e.context.lookupInput?.selectedItem;
						// 			if (selected?.nodeInfo?.lastElement === false){
						// 				// e.context.lookupFacade.config.dialogOptions.relatedElement = e.selectedItem;
						// 				// e.instance.dataFacade.config.dialogOptions.relatedElement = e.selectedItem;
						// 			}
						// 		}

						// 	},
						// ],
						showGrid: true,
						displayMember: 'Code',
						showDialog: false,
					}),
					additionalFields: [
						{
							id: 'branchpath',
							displayMember: 'DescriptionInfo.Description',
							label: {
								text: '*Location Description',
								key: 'productionplanning.common.branchPath',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				// TODO: check if the provided results are correct - old version available in 'ppscommon-layout-helper-service -> line 119'
				MdcControllingunitFk: await controllingUnitLookupProvider.generateControllingUnitLookup(ctx, {
					checkIsAccountingElement: true,
					projectGetter: (e) => e.ProjectId,
					lookupOptions: {
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						serverSideFilter: {
							key: 'scheduling.main.controllingunit.project.context.filter',
							execute: (context: ILookupContext<IControllingUnitLookupEntity, IProductionsetEntity>) => {
								return {
									ByStructure: true,
									PrjProjectFk: context.entity?.ProjectId,
								};
							},
						},
					},
				}),
				BasUomFk: {
					type: FieldType.Lookup,
					lookupOptions: (uomLookupOverload as IAdditionalLookupOptions<IBasicsUomEntity>).lookupOptions,
					additionalFields: [
						{
							id: 'DescriptionInfo.Translated',
							displayMember: 'DescriptionInfo.Translated',
							label: {
								text: '*UOM-Description',
								key: 'cloud.common.entityUoM',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				DateshiftMode: {
					type: FieldType.Text,
					readonly: false,
					valueAccessor: {
						getValue(obj: IProductionsetEntity): object | string {
							const dsModes = ctx.injector.get(DATESHIFT_MODES_TOKEN);
							return dsModes.filter((modes) => modes.id === obj.DateshiftMode)[0].displayName;
						},
					},
				},
				ProductionSetParentFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProductionSetParentLookupService,
					}),
				},
				EventTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProductionPlanningProductionSetEventtypeLookupService,
						clientSideFilter: {
							execute(item: IEventTypeEntity, context: ILookupContext<IEventTypeEntity, IEventTypeEntity>): boolean {
								if (item) {
									return item.PpsEntityFk !== null && item.PpsEntityFk === 15;
								}
								return false;
							},
						},
					}),
				},
				UserDefined1: {
					label: {
						text: '*Text 1',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '1' },
					},
					type: FieldType.Description,
				},
				UserDefined2: {
					label: {
						text: '*Text 2',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '2' },
					},
					type: FieldType.Description,
				},
				UserDefined3: {
					label: {
						text: '*Text 3',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '3' },
					},
					type: FieldType.Description,
				},
				UserDefined4: {
					label: {
						text: '*Text 4',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '4' },
					},
					type: FieldType.Description,
				},
				UserDefined5: {
					label: {
						text: '*Text 5',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '5' },
					},
					type: FieldType.Description,
				},
			},
			labels: {
				// custom module
				...prefixAllTranslationKeys('productionplanning.productionset.', {
					productionGroup: { key: 'productionGroup', text: '*Production' },
					EventTypeFk: { key: 'entityEventTypeFk', text: '*Productionset Type' },
					ProductionSetParentFk: { key: 'productionSetParentFk', text: '*Parent Production Set' },
					IsUserEditedValue: { key: 'isUserEditedValue', text: '*User Edited Value' },
					Assignment: { key: 'assignment', text: '*Assignment' },
					PpsProductionSetFk: { key: 'product.productionSetFk', text: '*Production Set' },
					ProductionSiteFk: { key: 'productionSiteFk', text: '*Production Site' },
				}),
				// common module
				...prefixAllTranslationKeys('cloud.common.', {
					basicData: { key: 'entityProperties', text: 'Basic Data' },
					Quantity: { key: 'entityQuantity', text: '*Quantity' },
					BasUomFk: { key: 'entityUoM', text: '*UoM' },
					PpsProdSetStatusFk: { key: 'entityStatus', text: '*Status' },
					CommentText: { key: 'entityComment', text: '*Comments' },
					IsLive: { key: 'entityIsLive', text: '*Active' },
					userDefTextGroup: { key: 'UserdefTexts' },
					Userdefined1: { key: 'entityUserDefined', params: { p_0: '1' } },
					Userdefined2: { key: 'entityUserDefined', params: { p_0: '2' } },
					Userdefined3: { key: 'entityUserDefined', params: { p_0: '3' } },
					Userdefined4: { key: 'entityUserDefined', params: { p_0: '4' } },
					Userdefined5: { key: 'entityUserDefined', params: { p_0: '5' } },
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					SiteFk: { key: 'entitySite', text: '*Site' },
					Assignment: { key: 'assignment', text: '*Assignment' },
					PlannedStart: { key: 'event.plannedStart', text: '*Planned StartDate' },
					PlannedFinish: { key: 'event.plannedFinish', text: '*Planned FinishDate' },
					EarliestStart: { key: 'event.earliestStart', text: '*Earliest StartDate' },
					LatestStart: { key: 'event.latestStart', text: '*Latest StartDate' },
					EarliestFinish: { key: 'event.earliestFinish', text: '*Earliest FinishDate' },
					LatestFinish: { key: 'event.latestFinish', text: '*Latest FinishDate' },
					PrjLocationFk: { key: 'prjLocationFk', text: '*Location' },
					MdcControllingunitFk: { key: 'mdcControllingUnitFk', text: '*Controlling Unit' },
					ActualQuantity: { key: 'actualQuantity', text: '*Actual Quantity' },
					RemainingQuantity: { key: 'remainingQuantity', text: '*Remaining Quantity' },
					basicData: { key: 'entityProperties', text: 'Basic Data' },
					PpsProductionSetFk: { key: 'product.productionSetFk', text: '*Production Set' },
					DateshiftMode: { key: 'event.dateshiftMode', text: '*DateShift Mode' },
				}),
			},
		};
	},
});
