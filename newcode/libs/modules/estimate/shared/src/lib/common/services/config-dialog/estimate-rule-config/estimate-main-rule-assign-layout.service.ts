/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstimateMainConfigComplete } from '@libs/estimate/interfaces';
import { createLookup, FieldType, IFormConfig, IGridConfiguration } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import {
	EstimateMainRuleDetailComponent
} from '../../../../components/estimate-rule-config/estimate-main-rule-detail.component';
import {
	EstimateMainRuleAssignTypeLookupService
} from '../../../../lookups/estimate-rule-config/estimate-main-rule-assign-type-lookup.service';
import { EstimateMainRuleAssignmentParamsLayoutService } from './estimate-main-rule-assignment-params-layout.service';
@Injectable({ providedIn: 'root' })
export class EstimateMainRuleAssignLayoutService<T extends IEstimateMainConfigComplete>{

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
			formId: 'estimate.main.ruleAssignment',
			showGrouping: false,
			addValidationAutomatically: false,
			groups: [
				{
					groupId: 'estRule',
					header: {
						text: 'Root Assignment',
						key: 'estimate.main.ruleAssignment',
					},
					open: true,
					visible: true,
					sortOrder: 5,
				},
			],
			rows:[
				{
					id: 'estRuleAssignType',
					groupId: 'estRule',
					label: {
						key: 'estimate.main.estRuleAssignmentType',
						text: 'Rule Assignment Type',
					},
					model: 'estRuleAssignTypeFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateMainRuleAssignTypeLookupService,
						showClearButton: true,
					}),
					visible: true,
					readonly: false,
					sortOrder: 1,
				},
				{
					id: 'estRuleAssignConfigDesc',
					groupId: 'estRule',
					label: {
						key: 'cloud.common.entityDescription',
						text: 'Description',
					},
					model: 'estRuleAssignConfigDesc',
					type: FieldType.Description,
					visible: true,
					readonly: false,
					sortOrder: 2,
				},
				{
					id: 'estRootAssignmentDetail',
					groupId: 'estRule',
					label: {
						key: 'estimate.main.ruleAssignmentConfigDetails',
						text: 'Root Assignment Config Details',
					},
					model: 'estRootAssignmentDetails',
					type: FieldType.CustomComponent,
					componentType:EstimateMainRuleDetailComponent,
					visible: true,
					readonly: false,
					sortOrder: 3,
				},
				{
					id: 'estRootAssignmentParamsDetail',
					groupId: 'estRule',
					label: {
						key: 'estimate.main.ruleAssignmentParamDetails',
						text: 'Params Details',
					},
					model: 'estRootAssignmentParams',
					type: FieldType.Grid,
					configuration:EstimateMainRuleAssignmentParamsLayoutService.generateConfig() as IGridConfiguration<object>,
					visible: true,
					readonly: false,
					sortOrder: 4,
				},
			]
		};
	}
}