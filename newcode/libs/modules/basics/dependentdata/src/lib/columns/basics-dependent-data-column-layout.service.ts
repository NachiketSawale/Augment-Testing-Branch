/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IDependentDataColumnEntity } from '../model/entities/dependent-data-column-entity.interface';
import { BasicsDependentDataDomainLookupService } from '../services/lookup-service/basics-dependent-data-domain-lookup.service';
import { BasicsDependentDataColumnLookupService } from '../services/lookup-service/basics-dependent-data-column-lookup.service';

/**
 * Dependent Data Columns layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsDependentDataColumnLayoutService {

	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IDependentDataColumnEntity>> {

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
						'DescriptionInfo',
						'DatabaseColumn',
						'DisplayDomainFk',
						'IsVisible',
						'ModuleFk',
						'DependentDataColumnFk',
						'DependentcolParentFk'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.dependentdata.', {
					'ModuleFk': {
						text: 'Link to module',
						key: 'entityModuleFk'
					},
					'DatabaseColumn': {
						text: 'Mapped column',
						key: 'entityDatabaseColumn'
					},
					'DisplayDomainFk': {
						text: 'Domain type',
						key: 'entityDisplayDomainFk'
					},
					'IsVisible': {
						text: 'Visible',
						key: 'entityIsVisible'
					},
					'DependentDataColumnFk': {
						text: 'Link parameter source',
						key: 'entityDependentDataColumnFk'
					},
					'DependentcolParentFk': {
						text: 'Parent Column',
						key: 'entityDependentcolParentFk'
					}
				}),
			},
			overloads: {
				Id: {
					readonly: true
				},
				ModuleFk: BasicsSharedLookupOverloadProvider.provideModuleLookupOverload(true),
				DisplayDomainFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsDependentDataDomainLookupService,
						showClearButton: true
					})
				},
				DependentDataColumnFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsDependentDataColumnLookupService,
						showClearButton: true,
						displayMember: 'DatabaseColumn'
					})
				},
				DependentcolParentFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsDependentDataColumnLookupService,
						showClearButton: true
					})
				}
			}
		};
	}
}