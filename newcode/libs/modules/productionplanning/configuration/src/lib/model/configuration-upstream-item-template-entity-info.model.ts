/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConfigurationUpstreamItemTemplateDataService } from '../services/configuration-upstream-item-template-data.service';
import { ConfigurationUpstreamItemTemplateBehavior } from '../behaviors/configuration-upstream-item-template-behavior.service';
import { IPpsUpstreamItemTemplateEntity } from './entities/pps-upstream-item-template-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { createLookup, FieldType, ILookupContext, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { IEventTypeEntity } from './entities/event-type-entity.interface';


export const CONFIGURATION_UPSTREAM_ITEM_TEMPLATE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsUpstreamItemTemplateEntity>({
	grid: {
		title: {key: 'productionplanning.configuration' + '.upstreamItemTemplate.listTitle'},
		behavior: ctx => ctx.injector.get(ConfigurationUpstreamItemTemplateBehavior),
		// containerUuid: '38d30f0611e34224ba6eafbe4367fa78'
	},
	form: {
		title: {key: 'productionplanning.configuration' + '.upstreamItemTemplate.detailTitle'},
		containerUuid: '86764a41d966479a97c161fb4823f100',
	},
	dataService: ctx => ctx.injector.get(ConfigurationUpstreamItemTemplateDataService),
	dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Configuration', typeName: 'PpsUpstreamItemTemplateDto'},
	permissionUuid: '23edab57edgb492d84r2gv47e734fh8u',
	layoutConfiguration: context => {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['BasUomFk', 'Code', 'CommentText', 'DescriptionInfo', 'IsForTransport', 'PpsEventReqforFk', 'PpsEventTypeReqforFk', 'PpsUpstreamGoodsTypeFk', 'PpsUpstreamTypeFk', 'Quantity', 'UpstreamGoods', 'UpstreamResult', 'UpstreamResultStatus',]
				},
				{
					gid: 'planningGroup',
					attributes: ['DueDate',]
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5']
				},
				{
					gid: 'userDefDateGroup',
					attributes: ['UserdefinedDate1', 'UserdefinedDate2', 'UserdefinedDate3', 'UserdefinedDate4', 'UserdefinedDate5']
				},
				{
					gid: 'userDefDateTimeGroup',
					attributes: ['UserdefinedDateTime1', 'UserdefinedDateTime2', 'UserdefinedDateTime3', 'UserdefinedDateTime4', 'UserdefinedDateTime5']
				},
			],
			overloads: {
				PpsUpstreamGoodsTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsUpstreamGoodsTypeLookupOverload(true),
				PpsUpstreamTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsUpstreamTypeLookupOverload(true),
				BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				PpsEventReqforFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						// TODO: Not yet finished, this function may fulfill the concrete needs in the future, that can create a lookup with paging, searchText,etc.
						dataService: context.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EventType', {
							uuid: '1f9f5c1debb249068b43712a3d8f3bbb',
							valueMember: 'Id',
							displayMember: 'DisplayTxt',
							showClearButton: true,
							canListAll: false,
						})
					})
				},
				PpsEventTypeReqforFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: context.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EventType', {
							uuid: '332fcd24b21941f0b95aede8876dbd74',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated',
							showClearButton: true,
							clientSideFilter: {
								execute(item: IEventTypeEntity, context: ILookupContext<IEventTypeEntity, IEventTypeEntity>): boolean {
									return !!item.IsForSequence;
								}
							}
						})
					})
				},
			},
			labels: {
				PpsItemFk: {key: 'productionplanning.common.event.itemFk', text: '*Production Unit'},
				ResResourceFk: {key: 'resource.master.entityResource', text: 'Resource'},
				...prefixAllTranslationKeys('productionplanning.item.', {
					DueDate: {key: 'upstreamItem.dueDate', text: '*Due Date'},
					IsForTransport: {key: 'upstreamItem.isForTransport', text: '*For Transport'},
					PpsEventReqforFk: {key: 'upstreamItem.ppseventreqfor', text: '*Required For'},
					PpsEventTypeReqforFk: {key: 'upstreamItem.ppsEventtypeReqforFk', text: 'Required For Type'},
					userDefDateTimeGroup: {key: 'userDefDateTimeGroup', text: '*User-Defined DateTime'},
					UserdefinedDateTime1: {key: 'entityUserDefinedDateTime', params: {p_0: '1'}, text: '*Date Time 1'},
					UserdefinedDateTime2: {key: 'entityUserDefinedDateTime', params: {p_0: '2'}, text: '*Date Time 2'},
					UserdefinedDateTime3: {key: 'entityUserDefinedDateTime', params: {p_0: '3'}, text: '*Date Time 3'},
					UserdefinedDateTime4: {key: 'entityUserDefinedDateTime', params: {p_0: '4'}, text: '*Date Time 4'},
					UserdefinedDateTime5: {key: 'entityUserDefinedDateTime', params: {p_0: '5'}, text: '*Date Time 5'},
					PpsUpstreamGoodsTypeFk: {key: 'upstreamItem.ppsupstreamgoodstype', text: '*Upstream Goods Type'},
					PpsUpstreamTypeFk: {key: 'upstreamItem.ppsUpstreamTypeFk', text: '*Upstream Type'},
					UpstreamGoods: {key: 'upstreamItem.upstreamgoods', text: '*Upstream Good'},
					UpstreamResult: {key: 'upstreamItem.upstreamresult', text: '*Upstream Result'},
					UpstreamResultStatus: {key: 'upstreamItem.upstreamresultstatus', text: '*Status Upstream'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					BasUomFk: {key: 'entityUoM', text: '*UoM'},
					Code: {key: 'entityCode', text: 'Code'},
					Quantity: {key: 'entityQuantity', text: '*Quantity'},
					CommentText: {key: 'entityComment', text: 'Comment'},
					DescriptionInfo: {key: 'entityDescription', text: 'Description'},
					userDefTextGroup: {key: 'UserdefTexts'},
					Userdefined1: {key: 'entityUserDefined', params: {p_0: '1'}},
					Userdefined2: {key: 'entityUserDefined', params: {p_0: '2'}},
					Userdefined3: {key: 'entityUserDefined', params: {p_0: '3'}},
					Userdefined4: {key: 'entityUserDefined', params: {p_0: '4'}},
					Userdefined5: {key: 'entityUserDefined', params: {p_0: '5'}},
					userDefDateGroup: {key: 'UserdefDates'},
					UserdefinedDate1: {key: 'entityUserDefinedDate', params: {p_0: '1'}},
					UserdefinedDate2: {key: 'entityUserDefinedDate', params: {p_0: '2'}},
					UserdefinedDate3: {key: 'entityUserDefinedDate', params: {p_0: '3'}},
					UserdefinedDate4: {key: 'entityUserDefinedDate', params: {p_0: '4'}},
					UserdefinedDate5: {key: 'entityUserDefinedDate', params: {p_0: '5'}}
				}),
			}
		};
	}
});