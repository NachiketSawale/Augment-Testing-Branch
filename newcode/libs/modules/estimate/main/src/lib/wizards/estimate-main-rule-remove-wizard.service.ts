/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType, FormRow, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstimateMainRemoveRuleGenerateGridComponent } from '../components/estimate-remove-rules/estimate-main-remove-rule-generate-grid/estimate-main-remove-rule-generate-grid.component';
import { EstimateMainParamRemoveGridComponent } from '../components/estimate-remove-rules/estimate-main-param-remove-grid/estimate-main-param-remove-grid.component';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { IEstimateRuleRemove } from '../model/interfaces/estimate-main-rule-remove.interface';
import { EstimateMainScopeSelectionWizardService } from './estimate-main-scope-selection.service';


@Injectable({
	providedIn: 'root'
})

/**
 * EstimateMainRuleRemoveWizardService this service used for Estimate Remove Rule Wizard
 */
export class EstimateMainRuleRemoveWizardService {

	private scopeSelectionService = inject(EstimateMainScopeSelectionWizardService);
	private formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private fb: FormBuilder = inject(FormBuilder);
	private rows = this.scopeSelectionService.prepareFormConfig().rows;
	private groups = this.scopeSelectionService.prepareFormConfig().groups;
	private readonly configService = inject(PlatformConfigurationService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private http = inject(HttpClient);
	private parentService = inject(EstimateMainService);
	private form: FormGroup;

	private constructor() {
		this.form = this.fb.group({
			removeParamsWithRules: [false, Validators.required]
		 });

		 this.form.get('removeParamsWithRules')?.valueChanges.subscribe((value) => {
			if (value) {
			  this.onRemoveParamsWithRulesChecked();
			}
		 });
	 }

	 /**
	  * This methos shows Rule Paramters grid
	  */
	 private onRemoveParamsWithRulesChecked(): void {
		const groupDetails = this.formConfiguration?.groups?.find(group => group.groupId === 'paramStructure');
		this.rows.forEach((row) => {
		  if (groupDetails && groupDetails.groupId != row.groupId) {
			 row.groupId = groupDetails?.groupId;
			 row.type = FieldType.Boolean;
			 row.label = { key: 'key', text: 'text' };
			 this.formConfiguration.rows.push(row as unknown as FormRow<IEstimateRuleRemove>);
		  }
		});
	}

	/**
	 * Default values for IEstimateRuleRemove
	 */
	private entity: IEstimateRuleRemove = {
		estimateScope: 0,
		structureOrRoot: {root: true, leadingStructure: false, removeParamsWithRules: false},
		searchRule: '',
		selectParameter: ''
	};

	/**
	 * This method stores form dialog information
	 */
	public removeEstimateRuleAssignments() {
		const groupDetails = this.formConfiguration?.groups?.find(group => group.groupId === 'assignedLevel');
		this.rows.forEach((row) => {
			if (groupDetails && groupDetails.groupId != row.groupId) {
				row.sortOrder = 1;
				row.groupId = groupDetails?.groupId;

				this.formConfiguration.rows.push(row as unknown as FormRow<IEstimateRuleRemove>);
			}
		});
		const result = this.formDialogService
			.showDialog<IEstimateRuleRemove>({
				id: '',
				headerText: '',
				formConfiguration: this.formConfiguration,
				entity: this.entity,
				runtime: undefined,
				customButtons: [],
				topDescription: ''
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleOk(result);
				}
			});

			return result;
	}

	/**
	 * The form configuration object applied in the form.
	 */
	private formConfiguration: IFormConfig<IEstimateRuleRemove> = {
		formId: 'estimate.main.removeEstimateRuleAssignments',
		showGrouping: true,
		groups: [
			{
				groupId: 'assignedLevel',
				header: 'Assigned Level',
				visible: true,
				open: true
			},
			{
				groupId: 'leadStructure',
				header: 'Additional Options',
				visible: true,
				open: true
			},
			{
				groupId: 'searchRules',
				header: 'Search Rules',
				visible: true,
				open: false
			},
			{
				groupId: 'paramStructure',
				header: 'Select Parameters',
				visible: true,
				open: false
			}
		],
		rows: [
			{
				groupId: 'leadStructure',
				id: 'leadingStructure',
				type: FieldType.Boolean,
				label: {
					text: 'Remove Rules from Leading Structure',
					key: 'estimate.main.leadingStructureTitle2'
				},
				required: true,
				sortOrder: 2
			},
			{
				groupId: 'leadStructure',
				id: 'root',
				type: FieldType.Boolean,
				label: {
					text: 'Remove Rules from Root Assignment',
					key: 'estimate.main.rootTitle2'
				},
				required: true,
				sortOrder: 3
			},
			{
				groupId: 'leadStructure',
				id: 'removeParamsWithRules',
				type: FieldType.Boolean,
				label: {
					text: 'Remove Parameters with Rules',
					key: 'estimate.main.removeRuleParamTitle'
				},
				required: true,
				sortOrder: 4,
				change: e => {
					console.log('e.val', e.newValue);
					if(e.newValue){
					this.onRemoveParamsWithRulesChecked();
}
				}
			},
			{
				groupId: 'searchRules',
				id: 'searchRule',
				type: FieldType.CustomComponent,
				componentType: EstimateMainRemoveRuleGenerateGridComponent,
				required: true,
				sortOrder: 5
			},
			{
				groupId: 'paramStructure',
				id: 'selectParams',
				type: FieldType.CustomComponent,
				componentType: EstimateMainParamRemoveGridComponent,
				required: false,
				sortOrder: 6,
				visible: false
			}
		]
	};

	/**
	 * This method calls the deleteruleassignments
	 * @param payload
	 * @returns
	 */
	private handleOk(payload: IEditorDialogResult<IEstimateRuleRemove>) {
		// Check if payload and payload.value are defined
		if (!payload?.value) {
			console.error('Value or value.value is undefined');
			return;
		}

		const postData = {
			ProjectId: this.estimateMainContextService.getProjectId(),
			EstHeaderFk: 0,//this.parentService.getSelection()[0].EstHeaderFk,
			LineItemsSelectedLevel: payload.value.EstimateScope,
			SelectedEstLineItemIds: this.parentService.getSelection().map(item => item.Id),
			PrjEstRules: null,
			IsLeadingStructure: payload.value.structureOrRoot.leadingStructure,
			SelectedParams: [],
			IsRoot: payload.value.structureOrRoot.root,
			IsRemoveRuleParam: payload.value.structureOrRoot.removeParamsWithRules,
			StructureId: 0
		};

		const url = `${this.configService.webApiBaseUrl}estimate/main/lineitem/deleteruleassignments`;
		return this.http.post(url, postData).subscribe((response) => {});
	}
}
