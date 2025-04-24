/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { IInstanceHeaderParameterEntity } from '../../model/entities/instance-header-parameter-entity.interface';
import { ConstructionSystemMainGlobalParameterLookupService } from '../lookup/construction-system-main-global-parameter-lookup.service';
import { ConstructionSystemSharedParameterLayoutHelperService } from '@libs/constructionsystem/shared';

/**
 * The Construction System Main Header parameter layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainHeaderParameterListLayoutService {
	private readonly constructionSystemSharedParameterLayoutHelperService = ServiceLocator.injector.get(ConstructionSystemSharedParameterLayoutHelperService<IInstanceHeaderParameterEntity>);
	public async generateLayout(): Promise<ILayoutConfiguration<IInstanceHeaderParameterEntity>> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['ParameterValueVirtual', 'UomValue', 'CosMasterParameterType', 'CosGlobalParamFk', 'Description'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.main.', {
					CosGlobalParamFk: { key: 'instanceHeaderParameterGridContainerTitle', text: 'Global Parameter' },
					ParameterValueVirtual: { key: 'entityParameterValueVirtual', text: 'Parameter Value' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					UomValue: { key: 'entityUoM', text: 'UOM' },
				}),
				...prefixAllTranslationKeys('constructionsystem.master.', {
					CosMasterParameterType: { key: 'entityParameterTypeFk', text: 'Parameter Type' },
				}),
				...prefixAllTranslationKeys('constructionsystem.common.', {
					Description: { key: 'executionScriptOutput.description', text: 'Description' },
				}),
			},
			overloads: {
				ParameterValueVirtual: this.constructionSystemSharedParameterLayoutHelperService.provideParameterValueOverload(),
				UomValue: {
					readonly: true,
				},
				CosMasterParameterType: {
					readonly: true,
				},
				CosGlobalParamFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMainGlobalParameterLookupService,
						displayMember: 'VariableName',
					}),
					label: { key: 'constructionsystem.master.entityVariableName', text: 'Variable Name' },
				},
			},
			transientFields: [
				{
					/// todo do not show,why?
					id: 'description',
					model: 'Description',
					type: FieldType.Description,
					label: 'constructionsystem.common.executionScriptOutput.description',
					readonly: true,
				},
			],
		};
	}
}
