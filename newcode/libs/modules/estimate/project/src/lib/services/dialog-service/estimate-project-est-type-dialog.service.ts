/*
 * Copyright(c) RIB Software GmbH
 */
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IPrjEstCreationData } from '../../model/models';

/**
 * DeepCopyData Interface
 */
export interface IDeepCopyData {
	NewEstType: number;
	actualEstType: number;
	IsCopyBudget: boolean;
	IsCopyCostTotalToBudget: boolean;
	IsCopyBaseCost: boolean;
	UpdateControllingStrBudget: boolean;
	DoCalculateRuleParam: boolean;
	IsDeleteItemAssignment: boolean;
	SetFixUnitPrice: boolean;
}

@Injectable({ providedIn: 'root' })

/**
 * Estimate Project EstType Dialog Service For Deepcopy Estimate Header
 */
export class EstimateProjectEstTypeDialogService {
	private readonly http = inject(HttpClient);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private configurationService = inject(PlatformConfigurationService);

	// todo - NewEstType, actualEstType
	private deepCopyData: IDeepCopyData = {
		NewEstType: 6,
		actualEstType: 6,
		IsCopyBudget: false,
		IsCopyCostTotalToBudget: false,
		IsCopyBaseCost: false,
		UpdateControllingStrBudget: false,
		DoCalculateRuleParam: false,
		IsDeleteItemAssignment: false,
		SetFixUnitPrice: false
	};

	private formConfig: IFormConfig<IDeepCopyData> = {
		formId: 'estimate.project.deepCopy',
		showGrouping: true,
		addValidationAutomatically: true,
		groups: [
			{
				groupId: 'estTypes',
				header: { key: 'estimate.project.typeDialogText' },
				open: true
			},
			{
				groupId: 'estUpdate',
				header: { key: 'estimate.project.updateEstimate' },
				open: true
			},
			{
				groupId: 'estBudget',
				header: { key: 'estimate.project.estBudgetDialogText' },
				open: true
			},
			{
				groupId: 'itemAssignment',
				header: { key: 'estimate.project.itemAssignment' },
				open: true
			},
		],
		rows: [
			{
				groupId: 'estTypes',
				id: 'actualType',
				label: {
					key: 'estimate.project.actualEstType',
				},
				type: FieldType.Integer,
				model: 'actualEstType'
				// TODO - lookup
				// type:'directive',
				// directive: 'estimate-project-est-type-combobox',
			},
			{
				groupId: 'estTypes',
				id: 'newType',
				label: {
					key: 'estimate.project.newEstType',
				},
				type: FieldType.Integer,
				model: 'newEstType'
				// TODO - lookup
				// type:'directive',
				// directive: 'estimate-project-est-type-combobox',
			},
			{
				groupId: 'estBudget',
				id: 'copyCostTotal2Budget',
				label: {
					key: 'estimate.project.copyCostTotalToBudget'
				},
				type: FieldType.Boolean,
				model: 'IsCopyCostTotalToBudget',
				change: (e) => {
					if (e.newValue && this.deepCopyData.IsCopyBudget) {
						this.deepCopyData.IsCopyBudget = false;
					}
				},
			},
			{
				groupId: 'estBudget',
				id: 'copyBudget',
				label: {
					key: 'estimate.project.copyBudget'
				},
				type: FieldType.Boolean,
				model: 'IsCopyBudget',
				change: (e) => {
					if (e.newValue && this.deepCopyData.IsCopyCostTotalToBudget) {
						this.deepCopyData.IsCopyCostTotalToBudget = false;
					}
				},
			},
			{
				groupId: 'estBudget',
				id: 'updStrBudget',
				label: {
					key: 'estimate.project.updateBudget'
				},
				type: FieldType.Boolean,
				model: 'IsUpdStrBudget'
			},
			{
				groupId: 'estBudget',
				id: 'copyBaseCost',
				label: {
					key: 'estimate.project.copyBaseCost'
				},
				type: FieldType.Boolean,
				model: 'IsCopyBaseCost'
			},
			{
				groupId: 'estUpdate',
				id: 'calcRuleParam',
				label: {
					key: 'estimate.project.calculateRuleParam'
				},
				type: FieldType.Boolean,
				model: 'calcRuleParam'
			},
			{
				groupId: 'estUpdate',
				id: 'setUnitPrice',
				label: {
					key: 'estimate.project.setFixUnitPrice'
				},
				type: FieldType.Boolean,
				model: 'SetFixUnitPrice'
			},
			{
				groupId: 'itemAssignment',
				id: 'deleteItemAssignment',
				label: {
					key: 'estimate.project.deleteItemAssignment'
				},
				type: FieldType.Boolean,
				model: 'IsDeleteItemAssignment'
			},
		],
	};

	/** show dialog for deep copy estimate.
	 *
	 * @param prjEstCreationData - IPrjEstCreationData
	 * @returns
	 */
	public showEstPrjDeepCopyDialog(prjEstCreationData: IPrjEstCreationData) {
		const result = this.formDialogService
			.showDialog<IDeepCopyData>({
				id: 'estimateProjectDeepCopyDialog',
				headerText: { key: 'estimate.project.estimate' },
				formConfiguration: this.formConfig,
				entity: this.deepCopyData,
				customButtons: [],
				topDescription: ''
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleOk(prjEstCreationData, result);
				}
			});
		return result;
	}

	private handleOk(prjEstCreationData: IPrjEstCreationData, result: IEditorDialogResult<IDeepCopyData>): void {
		if (result.value) {
			prjEstCreationData.NewEstType = result.value.NewEstType;
			prjEstCreationData.IsCopyBudget = result.value.IsCopyBudget;
			prjEstCreationData.IsCopyCostTotalToBudget = result.value.IsCopyCostTotalToBudget;
			prjEstCreationData.IsCopyBaseCost = result.value.IsCopyBaseCost;
			prjEstCreationData.UpdateControllingStrBudget = result.value.UpdateControllingStrBudget;
			(prjEstCreationData.DoCalculateRuleParam = result.value.DoCalculateRuleParam), (prjEstCreationData.IsDeleteItemAssignment = result.value.IsDeleteItemAssignment);
			prjEstCreationData.SetFixUnitPrice = result.value.SetFixUnitPrice;
			this.http.post(this.configurationService.webApiBaseUrl + 'estimate/project/createdeepcopy', prjEstCreationData).subscribe((response) => {
				//handleOnCreateSucceeded(response.data, copyData.containerData);
			});
		}
	}
}
