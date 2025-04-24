/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsDependentDataColumnLookupService } from '../services/lookup-service/basics-dependent-data-column-lookup.service';
import { IUserChartEntity } from '../model/entities/user-chart-entity.interface';
import { BasicsDependentDataChartTypeLookupService } from '../services/lookup-service/basics-dependent-data-chart-type-lookup.service';

/**
 * Dependent Data Chart layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsDependentDataChartLayoutService {

	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IUserChartEntity>> {

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'ChartTypeFk',
						'TitleInfo',
						'DependentdatacolumnXFk',
						'DependentdatacolumnYFk',
						'DependentdatacolumnGrp1Fk',
						'DependentdatacolumnGrp2Fk'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.dependentdata.', {
					'ChartTypeFk': {
						text: 'Chart Type',
						key: 'entityChartType'
					},
					'TitleInfo': {
						text: 'Title',
						key: 'entityTitleInfo'
					},
					'DependentdatacolumnXFk': {
						text: 'X Dependentdata column',
						key: 'entityXDependentdatacolumn'
					},
					'DependentdatacolumnYFk': {
						text: 'Y Dependentdata column',
						key: 'entityYDependentdatacolumn'
					},
					'DependentdatacolumnGrp1Fk': {
						text: 'Group1 Dependentdata column',
						key: 'entityGroup1Depdatacolumn'
					},
					'DependentdatacolumnGrp2Fk': {
						text: 'Group2 Dependentdata column',
						key: 'entityGroup2Depdatacolumn'
					}
				}),
			},
			overloads: {
				ChartTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsDependentDataChartTypeLookupService,
						showClearButton: true,
					})
				},
				DependentdatacolumnXFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsDependentDataColumnLookupService,
						showClearButton: true,
						displayMember: 'DatabaseColumn'
					})
				},
				DependentdatacolumnYFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsDependentDataColumnLookupService,
						showClearButton: true,
						displayMember: 'DatabaseColumn'
					})
				},
				DependentdatacolumnGrp1Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsDependentDataColumnLookupService,
						showClearButton: true,
						displayMember: 'DatabaseColumn'
					})
				},
				DependentdatacolumnGrp2Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsDependentDataColumnLookupService,
						showClearButton: true,
						displayMember: 'DatabaseColumn'
					})
				}
			}
		};
	}
}