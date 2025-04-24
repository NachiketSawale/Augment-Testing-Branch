/*
 * Copyright(c) RIB Software GmbH
 */
import { BASICS_SITE_LOOKUP_PROVIDER_TOKEN, IBasicsCustomizeSiteEntity, IMaterialGroupLookupEntity } from '@libs/basics/interfaces';
import { BasicsSharedLookupOverloadProvider, BasicsSharedMaterialGroupLookupService, BasicsSharedMaterialLookupService, IMaterialSearchEntity } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { createLookup, FieldType, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { PpsEventSequenceConfigGridBehavior } from '../../behaviors/event-sequence-config-grid-behavior.service';
import { ProductionplanningEventconfigurationEventSequenceConfigDataService } from '../../services/event-sequence-config-data.service';
import { PpsEventSequenceConfigLookupService } from '../../services/event-sequence-config-lookup.service';
import { PpsEventSequenceConfigValidationService } from '../../services/event-sequence-config-validation.service';
import { PpsMaterialGroupHelperService } from '../../services/pps-material-group-helper.service';
import { SiteTypeHelperService } from '../../services/site-type-helper.service';
import { EventSequenceConfigEntity } from '../entities/event-sequence-config-entity.class';

export const EVENT_SEQUENCE_CONFIG_ENTITY_INFO = EntityInfo.create<EventSequenceConfigEntity>({
	grid: {
		title: { text: '*Event Sequence Configs', key: 'productionplanning.eventconfiguration.eventSequence.listTitle' },
		behavior: (ctx) => ctx.injector.get(PpsEventSequenceConfigGridBehavior),
	},
	form: {
		title: { text: '*Event Sequence Config Details', key: 'productionplanning.eventconfiguration.eventSequence.detailTitle' },
		containerUuid: '55bad685d9ea42e292d6b7521e3b4d3e',
	},
	dataService: (ctx) => ctx.injector.get(ProductionplanningEventconfigurationEventSequenceConfigDataService),
	validationService: (ctx) => ctx.injector.get(PpsEventSequenceConfigValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.EventConfiguration', typeName: 'EventSeqConfigDto' },
	permissionUuid: 'd92b42daf3f44472b6bce0b2d5369be9',
	layoutConfiguration: async (ctx) => {
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: ['Description', 'EventSeqConfigFk', 'IsTemplate', 'IsLive'],
				},
				{
					gid: 'queryGroup',
					attributes: ['MaterialFk', 'MaterialGroupFk', 'SiteFk', 'QuantityFrom', 'QuantityTo', 'IsDefault', 'Mounting', 'ReproductionEng', 'Reproduction', 'MatSiteGrpFk'],
				},
				{
					gid: 'ppsCreationGroup',
					attributes: ['ItemTypeFk'],
				},
				{
					gid: 'automaticGroup',
					attributes: ['SeqEventSplitFromFk', 'SeqEventSplitToFk', 'SplitAfterQuantity', 'SplitDayOffset'],
				},
				{
					gid: 'certificateGroup',
					attributes: ['CeActive', 'CeField1', 'CeField2', 'CeField3'],
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('productionplanning.eventconfiguration.', {
					EventSeqConfigFk: { key: 'eventSequence.eventSeqConfigFk' },
					IsTemplate: { key: 'eventSequence.isTemplate' },
					QuantityFrom: { key: 'eventSequence.quantityFrom' },
					QuantityTo: { key: 'eventSequence.quantityTo' },
					Mounting: { key: 'eventSequence.mounting' },
					ReproductionEng: { key: 'eventSequence.reproductionEng' },
					Reproduction: { key: 'eventSequence.reproduction' },

					queryGroup: { key: 'eventSequence.queryGroup' },
					ppsCreationGroup: { key: 'eventSequence.ppsCreationGroup' },
					automaticGroup: { key: 'eventSequence.automaticGroup' },
					SeqEventSplitFromFk: { key: 'eventSequence.seqEventSplitFromFk' },
					SeqEventSplitToFk: { key: 'eventSequence.seqEventSplitToFk' },
					SplitAfterQuantity: { key: 'eventSequence.splitAfterQuantity' },
					SplitDayOffset: { key: 'eventSequence.splitDayOffset' },

					certificateGroup: { key: 'eventSequence.certificateGroup' },
					CeActive: { key: 'eventSequence.ceActive' },
					CeField1: { key: 'eventSequence.ceField1' },
					CeField2: { key: 'eventSequence.ceField2' },
					CeField3: { key: 'eventSequence.ceField3' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					basicData: { key: 'entityProperties' },
					Description: { key: 'entityDescription' },
					IsLive: { key: 'entityIsLive' },
					IsDefault: { key: 'entityIsDefault' },

					userDefTextGroup: { key: 'UserdefTexts' },
					Userdefined1: { key: 'entityUserDefined', params: { p_0: '1' } },
					Userdefined2: { key: 'entityUserDefined', params: { p_0: '2' } },
					Userdefined3: { key: 'entityUserDefined', params: { p_0: '3' } },
					Userdefined4: { key: 'entityUserDefined', params: { p_0: '4' } },
					Userdefined5: { key: 'entityUserDefined', params: { p_0: '5' } },
				}),
				...prefixAllTranslationKeys('basics.material.', {
					MaterialFk: { key: 'record.material' },
					MaterialGroupFk: { key: 'record.materialGroup' },
				}),
				...prefixAllTranslationKeys('basics.site.', {
					//TODO: the relavant implementation of basics site module is not added. Used text instead of key for now
					SiteFk: { text: 'Site' /*key: 'entitySite'*/ },
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					MatSiteGrpFk: { key: 'matSiteGrpFk' },
				}),
				...prefixAllTranslationKeys('productionplanning.item.', {
					//TODO: the relavant implementation of productionplanning item module is not added. Used text instead of key for now
					ItemTypeFk: { text: 'Item Type' /*key: 'entityItemType'*/ },
				}),
			},
			overloads: {
				EventSeqConfigFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<EventSequenceConfigEntity, EventSequenceConfigEntity>({
						dataServiceToken: PpsEventSequenceConfigLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description',
						clientSideFilter: {
							execute(item: EventSequenceConfigEntity): boolean {
								return !!item?.IsTemplate;
							},
						},
					}),
				},
				SiteFk: (await ctx.lazyInjector.inject(BASICS_SITE_LOOKUP_PROVIDER_TOKEN)).provideSiteLookupOverload({
					clientSideFilter: {
						execute(item: IBasicsCustomizeSiteEntity): boolean {
							return ctx.injector.get(SiteTypeHelperService).isFactoryOrIncludeFactory(item);
						},
					},
				}),
				SeqEventSplitFromFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: ctx.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EventType', {
							uuid: '4875a78194c84c41a1312e506e83d893',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated',
							showClearButton: true,
						}),
					}),
				},
				SeqEventSplitToFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: ctx.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EventType', {
							uuid: '5de09b5d81974e8e95d2b91364b0d5ef',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated',
							showClearButton: true,
						}),
					}),
				},
				MaterialFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<EventSequenceConfigEntity, IMaterialSearchEntity>({
						dataServiceToken: BasicsSharedMaterialLookupService,
						showClearButton: true,
					}),
				},
				MaterialGroupFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<EventSequenceConfigEntity, IMaterialGroupLookupEntity>({
						dataServiceToken: BasicsSharedMaterialGroupLookupService,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						clientSideFilter: {
							execute(item: IMaterialGroupLookupEntity): boolean {
								const helper = ctx.injector.get(PpsMaterialGroupHelperService);
								const itemList: IMaterialGroupLookupEntity[] = [];
								helper.flatten([item], itemList);
								return helper.flatMdcGroups.some((e) => itemList.some((x) => x.Id === e.Id));
							},
						},
					}),
				},
				ItemTypeFk: BasicsSharedLookupOverloadProvider.providePpsItemTypeLookupOverload(true),
				MatSiteGrpFk: BasicsSharedLookupOverloadProvider.providePpsMaterialSiteGroupLookupOverload(true),
			},
		};
	},
});
