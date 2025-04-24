/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ExternalConfigurationDataService } from '../services/external-configuration-data.service';
import { ExternalConfigurationBehavior } from '../behaviors/external-configuration-behavior.service';
import { IPpsExternalconfigEntity } from './entities/pps-externalconfig-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedSiteLookupService } from '@libs/basics/shared';
import { ConcreteFieldOverload, createLookup, FieldType } from '@libs/ui/common';
import { PpsBasExternalResourceTypes } from '@libs/productionplanning/shared';
import { BasicsSiteStockLookupService } from '@libs/basics/site';
import { of } from 'rxjs';

export const EXTERNAL_CONFIGURATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsExternalconfigEntity>({
	grid: {
		title: { key: 'productionplanning.configuration' + '.ppsExternalConfigListTitle' },
		behavior: (ctx) => ctx.injector.get(ExternalConfigurationBehavior),
		containerUuid: '2586f77873bc4b04a0f72e04aa9c9842',
	},
	form: {
		title: { key: 'productionplanning.configuration' + '.ppsExternalConfigDetailsTitle' },
		containerUuid: '9feb6f94d59841328ab9a929d90469d6',
	},
	dataService: (ctx) => ctx.injector.get(ExternalConfigurationDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Configuration', typeName: 'PpsExternalconfigDto' },
	permissionUuid: '2ad95d69c3b546428e425cb5f2d1a48a',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['BasExternalSourceFk', 'BasExternalSourceTypeFk', 'Description', 'IsLive', 'PKey1', 'PKey2', 'Remark', 'Sorting', 'UserFlag1', 'UserFlag2'],
			},
			{
				gid: 'userDefTextGroup',
				attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
			},
		],
		overloads: {
			BasExternalSourceTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideExternalSourceTypeLookupOverload(false), //TODO:onEditValueChanged
			BasExternalSourceFk: BasicsSharedCustomizeLookupOverloadProvider.provideExternalSourceLookupOverload(true), //TODO:filterKey: 'ppsconfig-bas-external-resource-filter'
			PKey2: { readonly: true },
			PKey1: {
				type: FieldType.Dynamic,
				overload: (ctx) => {
					let finalLookup = {
						type: FieldType.Description,
					} as ConcreteFieldOverload<IPpsExternalconfigEntity>;

					if (ctx.entity && ctx.entity.BasExternalSourceTypeFk) {
						switch (ctx.entity.BasExternalSourceTypeFk) {
							case PpsBasExternalResourceTypes.ITwoMes:
							case PpsBasExternalResourceTypes.UnitechnikMes:
								finalLookup = {
									type: FieldType.Lookup,
									lookupOptions: createLookup({
										dataServiceToken: BasicsSharedSiteLookupService,
									}),
								};
								break;
							case PpsBasExternalResourceTypes.ITwoSce:
								finalLookup = {
									type: FieldType.Lookup,
									lookupOptions: createLookup({
										dataServiceToken: BasicsSiteStockLookupService,
									}),
								};
								break;
						}
					}
					return of(finalLookup);
				},
			},
		},
		labels: {
			...prefixAllTranslationKeys('productionplanning.configuration.', {
				BasClobsFk: { key: 'basClobs', text: '*Configuration' },
				BasExternalSourceFk: { key: 'basExternalSource', text: '*External Source' },
				BasExternalSourceTypeFk: { key: 'basExternalSourceType', text: '*External Source Type' },
				PKey1: { key: 'pKey1', text: '*PKey1' },
				PKey2: { key: 'pKey2', text: '*PKey2' },
				Remark: { key: 'remark', text: '*Remark' },
				UserFlag1: { key: 'userFlag1', text: '*User Flag 1' },
				UserFlag2: { key: 'userFlag2', text: '*User Flag 2' },
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Description: { key: 'entityDescription', text: '*Description' },
				IsLive: { key: 'entityIsLive', text: 'Active' },
				Sorting: { key: 'entitySorting', text: 'Sorting' },
				userDefTextGroup: { key: 'UserdefTexts' },
				Userdefined1: { key: 'entityUserDefined', params: { p_0: '1' } },
				Userdefined2: { key: 'entityUserDefined', params: { p_0: '2' } },
				Userdefined3: { key: 'entityUserDefined', params: { p_0: '3' } },
				Userdefined4: { key: 'entityUserDefined', params: { p_0: '4' } },
				Userdefined5: { key: 'entityUserDefined', params: { p_0: '5' } },
			}),
		},
	},
});
