/*
 * Copyright(c) RIB Software GmbH
 */

import { IRoundingConfigComplete } from '@libs/estimate/interfaces';
import { createLookup, FieldType, FieldValidationInfo, IFormConfig } from '@libs/ui/common';
import { remove } from 'lodash';
import { inject, Injectable } from '@angular/core';
import { RoundingConfigTypeLookupDataService } from '../../../../lookups/rounding-config/rounding-config-type-lookup-date.service';
import { RoundingConfigDetailComponent } from '../../../../components/rounding-config/rounding-config-detail/rounding-config-detail.component';
import { ValidationResult } from '@libs/platform/data-access';
import { RoundingConfigDetailDataService } from '../rounding-config-detail/rounding-config-detail-data.service';
import { RoundingConfigDataService } from './rounding-config-data.service';

/**
 * Service for rounding config layout.
 */
@Injectable({
	providedIn: 'root',
})
export class RoundingConfigLayoutService<T extends IRoundingConfigComplete> {
	private readonly roundingConfigDataService = inject(RoundingConfigDataService);
	private readonly roundingConfigDetailDataService = inject(RoundingConfigDetailDataService);

	/**
	 * @ngdoc function
	 * @name getFormConfig
	 * @function
	 * @methodOf EstimateMainEstimateConfigConfigurationService
	 * @description Builds and returns the form configuration for the estimate configuration dialog
	 */
	public getFormConfig(customizeOnly: boolean, isAssembly: boolean = false) {
		const formConfiguration = this.createFormConfiguration(customizeOnly);
		if (customizeOnly) {
			remove(formConfiguration.rows, function (row) {
				return row.id === 'editRoundingConfigType';
			});
		}

		if (isAssembly && formConfiguration.groups) {
			remove(formConfiguration.groups, function (group) {
				return group.header === 'Rounding Config';
			});
		}

		return formConfiguration;
	}

	/**
	 * add column config row to form configuration
	 * @param formConfiguration
	 * @param customizeOnly
	 * @param isAssembly
	 */
	public addColumnConfigRow(formConfiguration: IFormConfig<T>, customizeOnly: boolean, isAssembly: boolean = false) {
		const columnFormConfig = this.getFormConfig(customizeOnly, isAssembly);
		if (formConfiguration.groups) {
			formConfiguration.groups.push(...columnFormConfig.groups!);
		} else {
			formConfiguration.groups = columnFormConfig.groups;
		}
		formConfiguration.rows.push(...columnFormConfig.rows);
	}

	/**
	 * create base from configuration
	 * @protected
	 */
	protected createFormConfiguration(customizeOnly: boolean): IFormConfig<T> {
		return {
			formId: 'estimate.main.roundingConfig',
			showGrouping: false,
			addValidationAutomatically: false,
			groups: [
				{
					groupId: 'roundingConfig',
					header: {
						text: 'Rounding Configuration',
						key: 'estimate.main.roundingConfigDialogForm.dialogRoundingConfigHeaderText',
					},
					open: true,
					visible: true,
					sortOrder: 5,
				},
			],
			rows: [
				{
					id: 'estRoundingConfigType',
					groupId: 'roundingConfig',
					label: {
						key: 'estimate.main.roundingConfigDialogForm.roundingConfigType',
						text: 'Rounding Config Type',
					},
					model: 'estRoundingConfigTypeFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: RoundingConfigTypeLookupDataService,
						showClearButton: true,
					}),
					visible: true,
					readonly: false,
					sortOrder: 1,
					validator: async (info: FieldValidationInfo<IRoundingConfigComplete>) => {
						this.roundingConfigDetailDataService.clear();
						if (info.value) {
							await this.roundingConfigDataService.load(info.value as number);
						}
						return new ValidationResult();
					},
				},
				{
					id: 'editRoundingConfigType',
					groupId: 'roundingConfig',
					label: {
						key: 'estimate.main.columnConfigurationDialogForm.editType',
						text: 'Edit Type',
					},
					model: 'isEditRoundingConfigType',
					type: FieldType.Boolean,
					visible: true,
					readonly: false,
					sortOrder: 2,
					validator: async (info: FieldValidationInfo<IRoundingConfigComplete>) => {
						if (info.value) {
							this.roundingConfigDataService.setIsUpdRoundingConfig(false);
							info.entity.estRoundingConfigTypeFk = 0;
							//TODO-Walt
							//processItem();
						}
						return new ValidationResult();
					},
				},
				{
					id: 'estRoundingConfigDesc',
					groupId: 'roundingConfig',
					label: {
						key: 'cloud.common.entityDescription',
						text: 'Description',
					},
					model: 'estRoundingConfigDesc',
					type: FieldType.Description,
					visible: true,
					readonly: false,
					sortOrder: 3,
				},
				{
					id: 'estRoundingConfigDetail',
					groupId: 'roundingConfig',
					label: {
						key: 'estimate.main.roundingConfigDialogForm.roundingConfigDetail',
						text: 'Rounding Configure Detail',
					},
					model: 'estRoundingConfigDetail',
					type: FieldType.CustomComponent,
					componentType: RoundingConfigDetailComponent,
					visible: true,
					readonly: false,
					sortOrder: 4,
				},
			],
		};
	}
}
