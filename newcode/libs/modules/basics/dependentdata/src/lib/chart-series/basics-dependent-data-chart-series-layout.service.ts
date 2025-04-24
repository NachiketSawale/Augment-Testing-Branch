/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsDependentDataColumnLookupService } from '../services/lookup-service/basics-dependent-data-column-lookup.service';
import { IUserChartSeriesEntity } from '../model/entities/user-chart-series-entity.interface';
import { BasicsDependentDataChartTypeLookupService } from '../services/lookup-service/basics-dependent-data-chart-type-lookup.service';

/**
 * Dependent Data Chart Series layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsDependentDataChartSeriesLayoutService {

	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IUserChartSeriesEntity>> {

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
						'LabelInfo',
						'Filter',
						'Sorting',
						'DependentdatacolumnXFk',
						'DependentdatacolumnYFk',
						'DependentdatacolumnRFk'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.dependentdata.', {
					'ChartTypeFk': {
						text: 'Chart Type',
						key: 'entityChartType'
					},
					'LabelInfo': {
						text: 'Label',
						key: 'entityLabelInfo'
					},
					'Filter': {
						text: 'Filter',
						key: 'entityFilter'
					},
					'Sorting': {
						text: 'Sorting',
						key: 'entitySorting'
					},
					'DependentdatacolumnXFk': {
						text: 'X DependentData Column',
						key: 'entityXDependentdatacolumn'
					},
					'DependentdatacolumnYFk': {
						text: 'Y DependentData Column',
						key: 'entityYDependentdatacolumn'
					},
					'DependentdatacolumnRFk': {
						text: 'R DependentData Column',
						key: 'entityRDependentdatacolumn'
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
				DependentdatacolumnRFk: {
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