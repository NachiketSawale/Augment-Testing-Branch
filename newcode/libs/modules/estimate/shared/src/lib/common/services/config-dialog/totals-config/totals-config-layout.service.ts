/*
 * Copyright(c) RIB Software GmbH
 */

import { ITotalsConfigComplete } from '@libs/estimate/interfaces';
import { createLookup, FieldType, FieldValidationInfo, IFormConfig } from '@libs/ui/common';
import { remove } from 'lodash';
import { TotalsConfigTypeLookupDataService } from '../../../../lookups/totals-config/totals-config-type-lookup-data.service';
import { TotalsConfigStructureTypeLookupDataService } from '../../../../lookups/totals-config/totals-config-structure-type-lookup-data.service';
import { TotalsConfigPrjCostGroupLookupDataService } from '../../../../lookups/totals-config/totals-config-prj-cost-group-lookup-data.service';
import { TotalsConfigEstCostGroupLookupDataService } from '../../../../lookups/totals-config/totals-config-est-cost-group-lookup-data.service';
import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { TotalsConfigDetailComponent } from '../../../../components/totals-config/totals-config-detail/totals-config-detail.component';
import { CostCodeAssignmentDetailComponent } from '../../../../components/totals-config/cost-code-assignment-detail/cost-code-assignment-detail.component';
import { ValidationResult } from '@libs/platform/data-access';
import { TotalsConfigDetailDataService } from '../totals-config-detail/totals-config-detail-data.service';
import { TotalsConfigDataService } from './totals-config-data.service';

/**
 * Service for totals config layout.
 */
@Injectable({
	providedIn: 'root',
})
export class TotalsConfigLayoutService<T extends ITotalsConfigComplete> {
	private injector = inject(Injector);
	private readonly totalsConfigDataService = inject(TotalsConfigDataService);
	private readonly totalsConfigDetailDataService = inject(TotalsConfigDetailDataService);

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
			// Remove the first row that holds the checkbox to make the structure a specific one different form estimate.
			remove(formConfiguration.rows, function (row) {
				return row.id === 'editTolConfigType';
			});

			// Change project cost group to text box in customize module
			remove(formConfiguration.rows, function (row) {
				return row.id === 'estTolConfigStrTypeProjectCostGroup';
			});

			formConfiguration.rows.push({
				id: 'estTolConfigStrTypeProjectCostGroup',
				groupId: 'tolConfig',
				label: {
					key: 'basics.customize.projectcostgroup',
					text: 'Project CostGroup',
				},
				model: 'LeadingStrPrjCostgroup',
				type: FieldType.Description,
				visible: true,
				readonly: false,
				sortOrder: 6,
			});
		}

		if (isAssembly) {
			remove(formConfiguration.rows, function (row) {
				// Remove this two columns as assemblies do not have leading structure.
				return ['estTolConfigActiveUnitRateStrQty', 'estTolConfigStrType', 'estTolConfigStrTypeProjectCostGroup', 'estTolConfigStrTypeEnterpriseCostGroup'].indexOf(row.id) > -1;
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
			formId: 'estimate.main.config',
			showGrouping: false,
			addValidationAutomatically: false,
			groups: [
				{
					groupId: 'tolConfig',
					header: {
						text: 'Totals Config',
						key: 'estimate.main.totalsConfigurationDialogTitle',
					},
					open: true,
					visible: true,
					sortOrder: 3,
				},
			],
			rows: [
				{
					id: 'estTolConfigType',
					groupId: 'tolConfig',
					label: {
						key: 'estimate.main.estTolConfigType',
						text: 'Totals Config Type',
					},
					model: 'estTolConfigTypeFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: TotalsConfigTypeLookupDataService,
						showClearButton: true,
					}),
					visible: true,
					readonly: false,
					sortOrder: 1,
					validator: async (info: FieldValidationInfo<ITotalsConfigComplete>) => {
						this.totalsConfigDetailDataService.clear();
						if (info.value) {
							await this.totalsConfigDataService.load(info.value as number);
						}
						return new ValidationResult();
					},
				},
				{
					id: 'editTolConfigType',
					groupId: 'tolConfig',
					label: {
						key: 'estimate.main.editEstTolConfigType',
						text: 'Edit Type',
					},
					model: 'isEditTolConfigType',
					type: FieldType.Boolean,
					visible: true,
					readonly: false,
					sortOrder: 2,
					validator: async (info: FieldValidationInfo<ITotalsConfigComplete>) => {
						if (info.value) {
							info.entity.IsUpdTotals = false;
							info.entity.isEditTolConfigType = true;
							info.entity.estTolConfigTypeFk = 0;
							//TODO-walt
							//this.totalsConfigDataService.updateColumn(false);
							//processItem();
						}
						return new ValidationResult();
					},
				},
				{
					id: 'estTotalsConfigDesc',
					groupId: 'tolConfig',
					label: {
						key: 'cloud.common.entityDescription',
						text: 'Description',
					},
					model: 'estTotalsConfigDesc',
					type: FieldType.Description,
					visible: true,
					readonly: false,
					sortOrder: 3,
				},
				{
					id: 'estTolConfigActiveUnitRateStrQty',
					groupId: 'tolConfig',
					label: {
						key: 'basics.customize.activeUnitRateStrQty',
						text: 'Active Unit Rate/Str.Qty',
					},
					model: 'ActivateLeadingStr',
					type: FieldType.Boolean,
					visible: true,
					readonly: false,
					sortOrder: 4,
				},
				{
					id: 'estTolConfigStrType',
					groupId: 'tolConfig',
					label: {
						key: 'basics.customize.structuretype',
						text: 'Structure Type',
					},
					model: 'LeadingStr',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: TotalsConfigStructureTypeLookupDataService,
						showClearButton: true,
					}),
					visible: true,
					readonly: false,
					sortOrder: 5,
				},
				{
					id: 'estTolConfigStrTypeProjectCostGroup',
					groupId: 'tolConfig',
					label: {
						key: 'basics.customize.projectcostgroup',
						text: 'Project CostGroup',
					},
					model: 'LeadingStrPrjCostgroup',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: runInInjectionContext(this.injector, () => {
							return new TotalsConfigPrjCostGroupLookupDataService(customizeOnly);
						}),
						showClearButton: true,
					}),
					visible: true,
					readonly: false,
					sortOrder: 6,
				},
				{
					id: 'estTolConfigStrTypeEnterpriseCostGroup',
					groupId: 'tolConfig',
					label: {
						key: 'basics.customize.enterprisecostgroup',
						text: 'Enterprise CostGroup',
					},
					model: 'LeadingStrEntCostgroup',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: runInInjectionContext(this.injector, () => {
							return new TotalsConfigEstCostGroupLookupDataService(customizeOnly);
						}),
						showClearButton: true,
					}),
					visible: true,
					readonly: false,
					sortOrder: 7,
				},
				{
					id: 'estTotalsConfigDetail',
					groupId: 'tolConfig',
					label: {
						key: 'estimate.main.totalsConfigurationDialogForm.totalsConfigureDetails',
						text: 'Totals Configure Details',
					},
					model: 'EstTotalsConfigDetails',
					type: FieldType.CustomComponent,
					componentType: TotalsConfigDetailComponent,
					visible: true,
					readonly: false,
					sortOrder: 8,
				},
				{
					id: 'costCodeAssignmentDetail',
					groupId: 'tolConfig',
					label: {
						key: 'estimate.main.totalsConfigurationDialogForm.costCodeAssignmentDetials',
						text: 'Cost Code Assignment Details',
					},
					model: 'costCodeAssignmentDetails',
					type: FieldType.CustomComponent,
					componentType: CostCodeAssignmentDetailComponent,
					visible: true,
					readonly: false,
					sortOrder: 8,
				},
			],
		};
	}
}
