/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration, LookupSimpleEntity } from '@libs/ui/common';
import { IDependentDataEntity } from '../model/entities/dependent-data-entity.interface';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { BasicsSharedModuleLookupEnum } from '../model/enums/basics-dependent-data-module-lookup.enum';
import { BasicsDependentDataTypeLookupService } from '../services/lookup-service/basic-dependent-data-type-lookup.service';
import { get } from 'lodash';

/**
 * Dependent Data layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsDependentDataLayoutService {

	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IDependentDataEntity>> {

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'Id',
						'ModuleFk',
						'SourceObject',
						'DescriptionInfo',
						'BoundColumn',
						'SortBy',
						'DependentDataTypeFk',
						'IsCompanyContext',
						'IsUserContext',
						'IsProjectContext',
						'IsEstimateContext',
						'IsModelContext',
						//'BoundContainerUuid',
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.dependentdata.', {
					'ModuleFk': {
						text: 'Link to module',
						key: 'entityModuleFk'
					},
					'SourceObject': {
						text: 'Select',
						key: 'entitySourceObject'
					},
					'BoundColumn': {
						text: 'Where',
						key: 'entityBoundColumn'
					},
					'SortBy': {
						text: 'Order by',
						key: 'entitySortBy'
					},
					'DependentDataTypeFk': {
						text: 'Type',
						key: 'entityType'
					},
					'IsCompanyContext': {
						text: 'Company filter [BAS_COMPANY_FK]',
						key: 'entityIsCompanyContext'
					},
					'IsUserContext': {
						text: 'User filter [FRM_USER_FK]',
						key: 'entityIsUserContext'
					},
					'IsProjectContext': {
						text: 'Project filter [PRJ_PROJECT_FK]',
						key: 'entityIsProjectContext'
					},
					'IsEstimateContext': {
						text: 'Estimate filter [EST_HEADER_FK]',
						key: 'entityIsEstimateContext'
					},
					'IsModelContext': {
						text: 'Model filter [MDL_MODEL_FK]',
						key: 'entityIsModelContext'
					},
					'BoundContainerUuid': {
						text: 'Sub container',
						key: 'entityBoundContainer'
					}
				}),
			},
			overloads: {
				Id: {
					readonly: true
				},
				ModuleFk: BasicsSharedLookupOverloadProvider.provideModuleLookupOverload(true, {
					execute(item: LookupSimpleEntity): boolean {
						const id = get(item, 'Id') as unknown as number;
						return id != BasicsSharedModuleLookupEnum.DynamicLinkProxyModule;
					}
				}),
				DependentDataTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsDependentDataTypeLookupService,
						showClearButton: true
					})
				},
				BoundContainerUuid: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						//todo DEV-31842
						//dataServiceToken: BasicsSharedDependentDataContainerLookupService,
						showClearButton: true
					})
				}
			}
		};
	}
}