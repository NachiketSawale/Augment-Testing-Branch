/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMasterParameterTypeLookupService } from '../lookup/construction-system-master-parameter-type-lookup.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ConstructionSystemSharedParameterLayoutHelperService, ICosGlobalParamEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterGlobalParameterGroupLookupService } from '../lookup/construction-system-master-global-parameter-group-lookup.service';

/**
 * The construction system master global parameter layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGlobalParameterLayoutService {
	private constructionSystemSharedParameterLayoutHelperService = ServiceLocator.injector.get(ConstructionSystemSharedParameterLayoutHelperService<ICosGlobalParamEntity>);
	public generateLayout(): ILayoutConfiguration<ICosGlobalParamEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['DescriptionInfo', 'VariableName', 'CosParameterTypeFk', 'UomFk', 'DefaultValue', 'Sorting', 'IsLookup', 'CosGlobalParamGroupFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					CosGlobalParamGroupFk: {
						key: 'entityCosGlobalParamGroupFk',
						text: 'Global Parameter Group Code',
					},
					CosParameterTypeFk: {
						key: 'entityParameterTypeFk',
						text: 'Type',
					},
					UomFk: {
						key: 'entityUomFk',
						text: 'UoM',
					},
					DefaultValue: {
						key: 'entityDefaultValue',
						text: 'Default Value',
					},
					Sorting: {
						key: 'entitySorting',
						text: 'Sorting',
					},
					VariableName: {
						key: 'entityVariableName',
						text: 'Variable Name',
					},
					IsLookup: {
						key: 'entityIsLookup',
						text: 'Is Lookup',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: {
						key: 'entityDescription',
						text: 'Description',
					},
				}),
			},
			overloads: {
				CosParameterTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMasterParameterTypeLookupService,
						showClearButton: false,
					}),
				},
				CosGlobalParamGroupFk: {
					type: FieldType.Lookup,
					width: 150,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMasterGlobalParameterGroupLookupService,
						showClearButton: false,
					}),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							label: 'constructionsystem.master.entityCosGlobalParamGroupDes',
							column: true,
							singleRow: true,
						},
					],
				},
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				DefaultValue: {
					...this.constructionSystemSharedParameterLayoutHelperService.provideParameterValueOverload(false),
					...{ width: 150 },
				},
			},
		};
	}
}
