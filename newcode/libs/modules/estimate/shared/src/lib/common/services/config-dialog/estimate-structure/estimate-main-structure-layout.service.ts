/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, IFormConfig } from '@libs/ui/common';
import { IEstimateMainConfigComplete} from '@libs/estimate/interfaces';
import { EstimateStructureGridComponent } from '../../../../components/estimate-structure/estimate-structure-grid.component';
import { Injectable } from '@angular/core';
import {
	EstimateMainConfigStructureTypeLookupService
} from '../../../../lookups/estimate-structure/estimate-main-config-structure-type-lookup.service';
@Injectable({ providedIn: 'root' })
export class EstimateMainStructureLayoutService<T extends IEstimateMainConfigComplete> {

	/**
	 * @ngdoc function
	 * @name getFormConfig
	 * @function
	 * @methodOf EstimateMainEstimateConfigConfigurationService
	 * @description Builds and returns the form configuration for the estimate configuration dialog
	 */
	public getFormConfig() {
		const formConfiguration = this.createFormConfiguration();
		return formConfiguration;
	}

	/**
	 * add column config row to form configuration
	 * @param formConfiguration
	 * @param customizeOnly
	 */
	public addColumnConfigRow(formConfiguration: IFormConfig<T>, customizeOnly: boolean) {
		const columnFormConfig = this.getFormConfig();
		if(formConfiguration.groups){
			formConfiguration.groups.push(...columnFormConfig.groups!);
		}else{
			formConfiguration.groups = columnFormConfig.groups;
		}
		formConfiguration.rows.push(...columnFormConfig.rows);
	}
	protected createFormConfiguration(): IFormConfig<T> {
		return {
			formId: 'estimate.main.estStructure',
			showGrouping: false,
			addValidationAutomatically: false,
			groups: [
				{
					groupId: 'estStruct',
					header: {
						text: 'Estimate Structure',
						key: 'estimate.main.estStructure',
					},
					open: true,
					visible: true,
					sortOrder: 2,
				},
			],
			rows:[
				{
					id: 'estStructType',
					groupId: 'estStruct',
					label: {
						key: 'estimate.main.estStructType',
						text: 'Est struct Type',
					},
					model: 'estStructTypeFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateMainConfigStructureTypeLookupService,
						showClearButton: true,
					}),
					visible: true,
					readonly: false,
					sortOrder: 1,
				},
				{
					id: 'editEstStructType',
					groupId: 'estStruct',
					label: {
						key: 'estimate.main.editEstStructType',
						text: 'Edit Type',
					},
					model: 'isEditStructType',
					type: FieldType.Boolean,
					visible: true,
					readonly: false,
					sortOrder: 2,
				},
				{
					id: 'estStructConfigDesc',
					groupId: 'estStruct',
					label: {
						key: 'cloud.common.entityDescription',
						text: 'Description',
					},
					model: 'estStructConfigDesc',
					type: FieldType.Description,
					visible: true,
					readonly: false,
					sortOrder: 3,
				},
				{
					id: 'getQuantityTotalToStructure',
					groupId: 'estStruct',
					label: {
						key: 'basics.customize.getQuantityTotalToStructure',
						text: 'getQuantityTotalToStructure',
					},
					model: 'getQuantityTotalToStructure',
					type: FieldType.Boolean,
					visible: true,
					readonly: false,
					sortOrder: 4,
				},
				{
					id: 'estStructDetail',
					groupId: 'estStruct',
					label: {
						key: 'estimate.main.structConfigDetails',
						text: 'Estimate Structure Config Details',
					},
					model: 'estStructureConfigDetails',
					type: FieldType.CustomComponent,
					componentType:EstimateStructureGridComponent,
					visible: true,
					readonly: false,
					sortOrder: 5,
				},
			]
		};
	}
}