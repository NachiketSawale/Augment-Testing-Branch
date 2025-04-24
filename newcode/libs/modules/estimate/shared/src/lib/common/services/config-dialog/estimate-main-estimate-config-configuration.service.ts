/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, FormRow, IFormConfig } from '@libs/ui/common';
import { IEstimateMainConfigEntity } from '@libs/estimate/interfaces';
import { Injectable } from '@angular/core';
import { MainConfigTypeLookupDataService } from '../../../lookups/column-config/customize-config-type-lookup-data.service';

/**
 * use for estimate config form configuration
 */
@Injectable({ providedIn: 'root' })
export class EstimateMainEstimateConfigConfigurationService<T extends IEstimateMainConfigEntity>{

	/**
	 * create base from configuration
	 * @protected
	 */
	protected createFormConfiguration(isAssemblies: boolean): IFormConfig<T>{
		return {
			formId: 'estimate.main.config',
			showGrouping: false,
			addValidationAutomatically: false,
			groups:[
				{
					groupId: 'estConfig',
					header: {
						text: 'Estimate Config',
						key: isAssemblies ? 'estimate.assemblies.estConfig' : 'estimate.main.estConfig',
					},
					open: true,
					visible: true,
					sortOrder: 1
				}
			],
			rows: [
				{
					id: 'estConfigDesc',
					groupId: 'estConfig',
					label: {
						key: 'cloud.common.entityDescription',
						text: 'Description'
					},
					model: 'estConfigDesc',
					type: FieldType.Description,
					visible: true,
					sortOrder: 3
				}
			]
		};
	}

	private createEditEstTypeRow(isAssemblies: boolean):FormRow<T>{
		return {
			id: 'editEstType',
			groupId: 'estConfig',
			label: {
				key: isAssemblies ? 'estimate.assemblies.editEstType' : 'estimate.main.editEstType',
				text: 'Edit Type'
			},
			model: 'isEditEstType',
			type: FieldType.Boolean,
			visible: true,
			sortOrder: 2
		};
	}

	private createEstConfigTypeRow(customizeOnly: boolean, isAssemblies: boolean):FormRow<T>{
		return {
			id: 'estConfigType',
			groupId: 'estConfig',
			label: {
				key: isAssemblies ? 'estimate.assemblies.estConfigType' : 'estimate.main.estConfigType',
				text: 'Est Type'
			},
			model: 'estConfigTypeFk',
			readonly: false,
			visible: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: customizeOnly ? MainConfigTypeLookupDataService : MainConfigTypeLookupDataService,
				showClearButton: true,
			}),
			sortOrder: 1
		};
	}

	private createIsColumnConfigRow():FormRow<T>{
		return {
			id: 'isColumnConfig',
			groupId: 'estConfig',
			label: {
				key: 'estimate.main.isColumnConfigureActivated',
				text: 'Is Column Config'
			},
			model: 'isColumnConfig',
			type: FieldType.Boolean,
			visible: true,
			sortOrder: 4
		};
	}

	private createBoqWicGroupRow():FormRow<T>{
		return {
			id: 'boqWicGroup',
			groupId: 'estConfig',
			label: {
				key: 'estimate.main.boqWicGroup',
				text: 'Default WIC-Group'
			},
			model: 'boqWicCatFk',
			type: FieldType.Integer,
			//TODO-Walt: <estimate-main-est-wic-group-lookup> missing
			visible: true,
			sortOrder: 6
		};
	}

	/**
	 * @ngdoc function
	 * @name getFormConfig
	 * @function
	 * @methodOf EstimateMainEstimateConfigConfigurationService
	 * @description Builds and returns the form configuration for the estimate configuration dialog
	 */
	public getFormConfig(customizeOnly: boolean, isAssemblies: boolean) {
		const formConfiguration =  this.createFormConfiguration(isAssemblies);
		if(customizeOnly) {
			formConfiguration.rows.push(this.createEstConfigTypeRow(true, false));
			formConfiguration.rows.push(this.createIsColumnConfigRow());
			formConfiguration.rows.push(this.createBoqWicGroupRow());
		}else if(isAssemblies){
			formConfiguration.rows.push(this.createEstConfigTypeRow(false, true));
			formConfiguration.rows.push(this.createEditEstTypeRow(true));
		}else{
			formConfiguration.rows.push(this.createEstConfigTypeRow(false, false));
			formConfiguration.rows.push(this.createEditEstTypeRow(false));
			formConfiguration.rows.push(this.createIsColumnConfigRow());
			//formConfiguration.rows.push(this.createBoqWicGroupRow());
		}
		return formConfiguration;
	}

	/**
	 * add column config row to form configuration
	 * @param formConfiguration
	 * @param customizeOnly
	 * @param isAssemblies
	 */
	public addColumnConfigRow(formConfiguration: IFormConfig<T>,customizeOnly: boolean, isAssemblies: boolean) {
		const columnFormConfig = this.getFormConfig(customizeOnly, isAssemblies);
		if(formConfiguration.groups){
			formConfiguration.groups.push(...columnFormConfig.groups!);
		}else{
			formConfiguration.groups = columnFormConfig.groups;
		}
		formConfiguration.rows.push(...columnFormConfig.rows);
	}
}