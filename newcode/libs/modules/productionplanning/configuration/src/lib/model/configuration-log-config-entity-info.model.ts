/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConfigurationLogConfigDataService } from '../services/configuration-log-config-data.service';
import { ConfigurationLogConfigBehavior } from '../behaviors/configuration-log-config-behavior.service';
import { IPpsLogConfigEntity } from './entities/pps-log-config-entity.interface';
import { ConcreteFieldOverload, createLookup, FieldType, ILookupClientSideFilter, ILookupContext, ILookupFieldOverload, UiCommonLookupDataFactoryService, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { PlatformTranslateService, prefixAllTranslationKeys } from '@libs/platform/common';
import { from, of } from 'rxjs';
import { PpsEntity } from '@libs/productionplanning/shared';

export const CONFIGURATION_LOG_CONFIG_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsLogConfigEntity>({
	grid: {
		title: { key: 'productionplanning.configuration' + '.logConfigListTitle' },
		behavior: (ctx) => ctx.injector.get(ConfigurationLogConfigBehavior),
		containerUuid: '5e71417abff44ebea124741d1dc53c2d',
	},
	dataService: (ctx) => ctx.injector.get(ConfigurationLogConfigDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Configuration', typeName: 'PpsLogConfigDto' },
	permissionUuid: 'a100e4aec51046658c4aebf4a49a593e',
	layoutConfiguration: (context) => {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['CommentText', 'Description', 'EntityId', 'EntityType', 'LogConfigType', 'PpsLogReasonGroupFk', 'PropertyId'],
				},
			],
			overloads: {
				EntityId: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: context.injector.get(UiCommonLookupDataFactoryService).fromLookupType('PpsDDTable', {
							uuid: 'a810baa62eb14be6bb8c37831466d178',
							valueMember: 'Id',
							displayMember: 'TableName',
						}),
					}),
				},
				EntityType: {
					type: FieldType.Dynamic,
					overload: (ctx) => {
						let finalLookup = {
							type: FieldType.Description,
						} as ConcreteFieldOverload<IPpsLogConfigEntity>;

						if (ctx.entity && ctx.entity.EntityId) {
							const provideEventTypeObject = (uuid: string, clientFilter?: ILookupClientSideFilter<object, IPpsLogConfigEntity>): ILookupFieldOverload<IPpsLogConfigEntity> => {
								return {
									type: FieldType.Lookup,
									lookupOptions: createLookup({
										showClearButton: true,
										dataService: context.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EventType', {
											uuid: uuid,
											valueMember: 'Id',
											displayMember: 'DescriptionInfo.Translated',
											...(clientFilter && { clientSideFilter: clientFilter }),
										}),
									}),
								};
							};

							//uuid is the lookup above, actually should not return an object type lookup, but the cloud module is not ready.
							const entityIdLookup = context.injector.get(UiCommonLookupDataFactoryService).getInstance('a810baa62eb14be6bb8c37831466d178') as UiCommonLookupTypeDataService<object, IPpsLogConfigEntity>;
							return from(
								entityIdLookup.getItemByKeyAsync({ id: ctx.entity!.EntityId! }).then((resolve) => {
									//due to the lookup returns object, a workaround
									const tableName = (resolve as never)['TableName'];
									switch (tableName) {
										case 'PPS_EVENT':
											finalLookup = provideEventTypeObject('7c77fcc1e5fc4794aa8e3ad56b88c469');
											break;
										case 'PPS_ITEM':
											//showIcon: true
											finalLookup = BasicsSharedLookupOverloadProvider.providePpsItemTypeLookupOverload(true);
											break;
										case 'TRS_REQUISITION':
											finalLookup = provideEventTypeObject('dfbba1f7275243ca86096df71b0a0ee1', {
												execute(item: object, context: ILookupContext<object, IPpsLogConfigEntity>) {
													if (item) {
														const eventType = item as never;
														return eventType['PpsEntityFk'] !== null && eventType['PpsEntityFk'] === PpsEntity.TransportRequisition && eventType['IsLive'];
														// "PpsEntityFK === 6" maps "Transport Requisition"
													}
													return false;
												},
											});
											break;
										case 'ENG_TASK':
											finalLookup = provideEventTypeObject('d1ecfd0398984771b0c3d14efe7b3d84', {
												execute(item: object, context: ILookupContext<object, IPpsLogConfigEntity>) {
													if (item) {
														const eventType = item as never;
														return eventType['PpsEntityFk'] !== null && eventType['PpsEntityFk'] === PpsEntity.EngineeringTask;
													}
													return false;
												},
											});
											break;
										case 'PPS_PRODUCTION_SET':
											finalLookup = provideEventTypeObject('457019a4d2b741ca8001c688e6f289e8', {
												execute(item: object, context: ILookupContext<object, IPpsLogConfigEntity>) {
													if (item) {
														const eventType = item as never;
														return eventType['PpsEntityFk'] !== null && eventType['PpsEntityFk'] === PpsEntity.PPSProductionSet;
													}
													return false;
												},
											});
											break;
										case 'TRS_ROUTE':
											finalLookup = provideEventTypeObject('566d0c003cb9442f84a9a61f2519e7db', {
												execute(item: object, context: ILookupContext<object, IPpsLogConfigEntity>) {
													if (item) {
														const eventType = item as never;
														return eventType['PpsEntityFk'] !== null && eventType['PpsEntityFk'] === PpsEntity.TransportRoute;
													}
													return false;
												},
											});
											break;
										case 'ENG_TASK2BAS_CLERK':
											finalLookup = BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true);
											break;
									}
									return finalLookup;
								}),
							);
						}

						return of(finalLookup);
					},
				},
				PropertyId: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: context.injector.get(UiCommonLookupDataFactoryService).fromLookupType('PpsDDColumn', {
							uuid: '287b43ca1d384a2d891e59526716ca91',
							valueMember: 'Id',
							displayMember: 'ColumnName',
						}),
					}),
				},
				LogConfigType: {
					type: FieldType.Select,
					itemsSource: {
						items: [
							{ id: 0, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.logCfgType_Required') },
							{ id: 1, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.logCfgType_Optional') },
							{ id: 2, displayName: context.injector.get(PlatformTranslateService).instant('productionplanning.configuration.logCfgType_Silent') },
						],
					},
				},
				PpsLogReasonGroupFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsLogReasonGroupLookupOverload(true),
			},
			labels: {
				...prefixAllTranslationKeys('productionplanning.configuration.', {
					EntityId: { key: 'tableName', text: '*Table Name' },
					EntityType: { key: 'entityType', text: '*Entity Type' },
					LogConfigType: { key: 'logConfigType', text: '*Type' },
					PpsLogReasonGroupFk: { key: 'logReasonGroup', text: '*Log Reason Group' },
					PropertyId: { key: 'columnName', text: '*Column Name' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: { key: 'entityComment', text: 'Comment' },
					Description: { key: 'entityDescription', text: '*Description' },
				}),
			},
		};
	},
});
