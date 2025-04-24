/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstimateMainColumnConfigComplete } from '@libs/estimate/interfaces';
import { createLookup, FieldType, FieldValidationInfo, FormRow, IFormConfig } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { ColumnConfigTypeLookupDataService } from '../../../../lookups/column-config/column-config-type-lookup-data.service';
import { ColumnConfigDetailComponent } from '../../../../components/column-config/column-config-detail/column-config-detail.component';
import { ValidationResult } from '@libs/platform/data-access';
import { EstimateMainEstColumnConfigDataService } from './estimate-main-column-config-data.service';

/**
 * use for estimate column config form configuration
 */
@Injectable({ providedIn: 'root' })
export class EstimateMainColumnConfigLayoutService<T extends IEstimateMainColumnConfigComplete> {
	private readonly columnConfigDataService = inject(EstimateMainEstColumnConfigDataService);
	/**
	 * @ngdoc function
	 * @name getFormConfig
	 * @function
	 * @methodOf EstimateMainEstimateConfigConfigurationService
	 * @description Builds and returns the form configuration for the estimate configuration dialog
	 */
	public getFormConfig(customizeOnly: boolean) {
		const formConfiguration = this.createFormConfiguration();
		if (!customizeOnly) {
			formConfiguration.rows.push(this.createEditColConfigTypeRow());
		}
		return formConfiguration;
	}

	/**
	 * add column config row to form configuration
	 * @param formConfiguration
	 * @param customizeOnly
	 */
	public addColumnConfigRow(formConfiguration: IFormConfig<T>, customizeOnly: boolean) {
		const columnFormConfig = this.getFormConfig(customizeOnly);
		if(formConfiguration.groups){
			formConfiguration.groups.push(...columnFormConfig.groups!);
		}else{
			formConfiguration.groups = columnFormConfig.groups;
		}
		formConfiguration.rows.push(...columnFormConfig.rows);
	}

	/**
	 * create base from configuration
	 * @protected
	 */
	protected createFormConfiguration(): IFormConfig<T> {
		return {
			formId: 'estimate.main.config',
			showGrouping: false,
			addValidationAutomatically: false,
			groups: [
				{
					groupId: 'colConfig',
					header: {
						text: 'Column Config',
						key: 'estimate.main.columnConfigurationDialogTitle',
					},
					open: true,
					visible: true,
					sortOrder: 2,
				},
			],
			rows: [
				{
					id: 'estColConfigType',
					groupId: 'colConfig',
					label: {
						key: 'estimate.main.columnConfigurationDialogForm.colConfigType',
						text: 'Column Config Type',
					},
					model: 'estColConfigTypeFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ColumnConfigTypeLookupDataService,
						showClearButton: true,
					}),
					visible: true,
					readonly: false,
					sortOrder: 1,
					validator: async (info: FieldValidationInfo<IEstimateMainColumnConfigComplete>) => {
						this.columnConfigDataService.clear();
						if(info.value){
							await this.columnConfigDataService.load(info.value as number);
						}
						return new ValidationResult();
					},
				},
				{
					id: 'colConfigDetail',
					groupId: 'colConfig',
					label: {
						key: 'estimate.main.columnConfigurationDialogForm.columnConfigureDetails',
						text: 'Column Configure Details',
					},
					model: 'columnConfigDetails',
					type: FieldType.CustomComponent,
					componentType:ColumnConfigDetailComponent,//ColumnConfigDetailLookupComponent,
					visible: true,
					readonly: false,
					sortOrder: 4,
				},
			],
		};
	}

	private createEditColConfigTypeRow(): FormRow<T> {
		return {
			id: 'editColConfigType',
			groupId: 'colConfig',
			label: {
				key: 'estimate.main.columnConfigurationDialogForm.editType',
				text: 'Edit Type',
			},
			model: 'isEditColConfigType',
			type: FieldType.Boolean,
			visible: true,
			readonly: false,
			sortOrder: 2,
			validator: (info: FieldValidationInfo<IEstimateMainColumnConfigComplete>) => {
				if(info.value){
					info.entity.IsUpdColumnConfig = false;
					info.entity.estColConfigTypeFk = 0;
					//TODO-walt
					//processItem();
				}
				return new ValidationResult();
			},
		};
	}
}
