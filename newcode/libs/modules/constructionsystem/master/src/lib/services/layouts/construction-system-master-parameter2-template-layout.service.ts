/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { ICosParameter2TemplateEntity } from '../../model/models';
import { ConstructionSystemMasterParameterLookupService } from '@libs/constructionsystem/common';
import {
	ConstructionSystemMasterDefaultTypeLookupService
} from '../lookup/construction-system-master-default-type-lookup.service';
import { ConstructionSystemSharedParameterLayoutHelperService } from '@libs/constructionsystem/shared';

/**
 * The construction system master parameter layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameter2TemplateLayoutService {
	private readonly constructionSystemSharedParameterLayoutHelperService = ServiceLocator.injector.get(ConstructionSystemSharedParameterLayoutHelperService<ICosParameter2TemplateEntity>);

	public generateLayout(): ILayoutConfiguration<ICosParameter2TemplateEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['CosParameterFk', 'CosDefaultTypeFk', 'PropertyName', 'DefaultValue'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					CosTemplateFk: { key: 'entityTemplateFk', text: 'Template' },
					CosParameterTypeFk: { key: 'entityParameterTypeFk', text: 'ParameterType' },
					CosDefaultTypeFk: { key: 'entityDefaultTypeFk', text: 'DefaultType' },
					PropertyName: { key: 'entityPropertyName', text: 'Attribute Name' },
					DefaultValue: { key: 'entityDefaultValue', text: 'Value' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CosParameterFk: { key: 'entityDescription', text: 'Description' },
				}),
			},
			overloads: {
				CosParameterFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMasterParameterLookupService,
					}),
					additionalFields: [
						{
							displayMember: 'ParameterGroupDescription',
							label: {
								key: 'cloud.common.entityGroup',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'VariableName',
							label: {
								key: 'constructionsystem.master.entityVariableName',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'UoM',
							label: {
								key: 'cloud.common.entityUoM',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'ParameterTypeDescription',
							label: {
								key: 'constructionsystem.master.entityParameterTypeFk',
							},
							column: true,
							singleRow: true,
						}
					],
				},
				CosDefaultTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMasterDefaultTypeLookupService,
						showClearButton: false,
					}),
				},
				DefaultValue: {
					...this.constructionSystemSharedParameterLayoutHelperService.provideParameterValueOverload(), ///todo check
					...{ width: 150 },
				},
				// 	PropertyName: {}, // todo: Wait the constructionSystemCommonModelObjectPropertyCombobox to finish.
			},
		};
	}
}
