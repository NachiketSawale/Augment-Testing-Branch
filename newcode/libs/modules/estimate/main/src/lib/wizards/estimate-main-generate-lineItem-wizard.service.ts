/*
 * Copyright(c) RIB Software GmbH
 */


import { createLookup, FieldType, FieldValidationInfo, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { ValidationResult } from '@libs/platform/data-access';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainContextService, EstimateShareLeadingStructureLookupService } from '@libs/estimate/shared';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';

@Injectable({ providedIn: 'root' })
/**
 *  EstimateMainGenerateLineItemWizardService
 *  This services for provides functionality for generating lineItem
 */
export class EstimateMainGenerateLineItemWizardService{
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly leadingStructureService = inject(EstimateShareLeadingStructureLookupService);
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly estimateMaincontextService = inject(EstimateMainContextService);
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);


	private generateLineItemForm: IFormConfig<IGenerateLineItem> = {
		formId: 'estimate.main.generateLineItemDialog',
		showGrouping: true,
		groups: [
			{
				groupId: 'baseGroup',
				header: { key: 'estimate.main.generateLineByStructure.baseSetting' },
				open: true
			}, {
				groupId: 'assignmentCopying',
				header: { key: 'estimate.main.generateLineByStructure.assignmentCopying' },
				open: false
			}, {
				groupId: 'copyDescAndUserDefined',
				header: { key: 'estimate.main.generateLineByStructure.copyDescAndUserDefined' },
				open: false
			}, {
				groupId: 'additionalSetting',
				header: { key: 'estimate.main.generateLineByStructure.additionalSetting' },
				open: false
			}
		],
		rows: [
			{
				groupId: 'baseGroup',
				id: 'StructureId',
				label: {key: 'estimate.main.StructureId'},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: EstimateShareLeadingStructureLookupService,
					showDialog: false,
					showGrid: false
				}),
				model: 'StructureId',
				required: true,
				validator: info => this.validateStructureId(info),
				sortOrder: 1
			},
			{
				groupId: 'baseGroup',
				id: 'CreateNew',
				label: {key: 'estimate.main.createNew'},
				type: FieldType.Boolean,
				model: 'CreateNew',
				sortOrder: 2
			},
			{
				groupId: 'baseGroup',
				id: 'UpdateExistedItem',
				label: 'Update Exist',
				type: FieldType.Boolean,
				model: 'UpdateExistedItem',
				sortOrder: 3
			},
			{
				groupId: 'assignmentCopying',
				id: 'copyWic',
				label: {key: 'estimate.main.generateLineByStructure.copyWic'},
				type: FieldType.Boolean,
				model: 'CopyWic',
				sortOrder: 6
			},
			{
				groupId: 'assignmentCopying',
				id: 'copyCostGroup',
				label: {key: 'estimate.main.generateLineByStructure.copyCostGroup'},
				type: FieldType.Boolean,
				model: 'CopyCostGroup',
				sortOrder: 7
			},
			{
				groupId: 'assignmentCopying',
				id: 'copyPrjCostGroup',
				label: {key: 'estimate.main.generateLineByStructure.copyPrjCostGroup'},
				type: FieldType.Boolean,
				model: 'CopyPrjCostGroup',
				sortOrder: 8
			},
			{
				groupId: 'assignmentCopying',
				id: 'copyControllingUnit',
				label: {key: 'estimate.main.generateLineByStructure.copyControllingUnit'},
				type: FieldType.Boolean,
				model: 'CopyControllingUnit',
				sortOrder: 9
			},
			{
				groupId: 'assignmentCopying',
				id: 'copyLocation',
				label: {key: 'estimate.main.generateLineByStructure.copyLocation'},
				type: FieldType.Boolean,
				model: 'CopyLocation',
				sortOrder: 10
			},
			{
				groupId: 'assignmentCopying',
				id: 'copyProcStructure',
				label: {key: 'estimate.main.generateLineByStructure.copyProcStructure'},
				type: FieldType.Boolean,
				model: 'CopyProcStructure',
				sortOrder: 11
			},
			{
				groupId: 'copyDescAndUserDefined',
				id: 'CopyLeadingStructrueDesc',
				label: {key: 'estimate.main.generateLineByStructure.copyLeadingStructureDesc'},
				type: FieldType.Boolean,
				model: 'CopyLeadingStructrueDesc',
				visible: true,
				sortOrder: 3
			},
			{
				groupId: 'copyDescAndUserDefined',
				id: 'UpdateLeadStrucDescToExistingItem',
				label: {key: 'estimate.main.generateLineByStructure.updateLeadStructureDescToExistingItem'},
				type: FieldType.Boolean,
				model: 'UpdateLeadStrucDescToExistingItem',
				visible: true,
				sortOrder: 4
			},
			{
				groupId: 'copyDescAndUserDefined',
				id: 'CopyUserDefined1',
				label: {key: 'estimate.main.generateLineByStructure.copyUserDefined1'},
				type: FieldType.Boolean,
				model: 'CopyUserDefined1',
				sortOrder: 13
			},
			{
				groupId: 'copyDescAndUserDefined',
				id: 'CopyUserDefined2',
				label: {key: 'estimate.main.generateLineByStructure.copyUserDefined2'},
				type: FieldType.Boolean,
				model: 'CopyUserDefined2',
				sortOrder: 14
			},
			{
				groupId: 'copyDescAndUserDefined',
				id: 'CopyUserDefined3',
				label: {key: 'estimate.main.generateLineByStructure.copyUserDefined3'},
				type: FieldType.Boolean,
				model: 'CopyUserDefined3',
				sortOrder: 15
			},
			{
				groupId: 'copyDescAndUserDefined',
				id: 'CopyUserDefined4',
				label: {key: 'estimate.main.generateLineByStructure.copyUserDefined4'},
				type: FieldType.Boolean,
				model: 'CopyUserDefined4',
				sortOrder: 16
			},
			{
				groupId: 'copyDescAndUserDefined',
				id: 'CopyUserDefined5',
				label: {key: 'estimate.main.generateLineByStructure.copyUserDefined5'},
				type: FieldType.Boolean,
				model: 'CopyUserDefined5',
				sortOrder: 17
			},
			{
				groupId: 'additionalSetting',
				id: 'isBySplitQuantity',
				label: {key: 'estimate.main.generateLineByStructure.isBySplitQuantity'},
				type: FieldType.Boolean,
				model: 'IsBySplitQuantity',
				validator: info => this.validateIsBySplitQuantity(info),
				sortOrder: 1
			},
			{
				groupId: 'additionalSetting',
				id: 'isGenerateAsReferenceLineItems',
				label: {key: 'estimate.main.generateLineByStructure.isGenerateAsReferenceLineItems'},
				type: FieldType.Boolean,
				model: 'IsGenerateAsReferenceLineItems',
				visible: true,
				sortOrder: 2
			},
			{
				groupId: 'additionalSetting',
				id: 'copyBoqFinalPrice',
				label: {key: 'estimate.main.generateLineByStructure.copyBoqFinalPrice'},
				type: FieldType.Boolean,
				model: 'CopyBoqFinalPrice',
				sortOrder: 12
			},
			{
				groupId: 'additionalSetting',
				id: 'copyRelatedAssemblyWic',
				label: {key: 'estimate.main.generateLineByStructure.copyRelatedAssemblyWic'},
				type: FieldType.Boolean,
				model: 'CopyRelatedWicAssembly',
				sortOrder: 12
			}
		]
	};

	private validateStructureId(info: FieldValidationInfo<IGenerateLineItem>) : ValidationResult{
		const value = info.value;
		const entity = info.entity;

		// TODO: this logic is used to set OK button to IsDisable or not.
		// if (value !== undefined) {
		// 	IsDisable = !(entity.CreateNew || entity.UpdateExistedItem);
		// } else {
		// 	IsDisable = true;
		// }

		if (value) {
			const structureType = this.leadingStructureService.getItemById(value as number);
			if (!structureType) {
				return new ValidationResult();
			}

			if(structureType.StructureName ==='Schedule'){
				entity.CopyCostGroup = false;
				entity.CopyPrjCostGroup = false;
				entity.CopyWic = false;
				entity.CopyBoqFinalPrice = false;
				entity.CopyRelatedWicAssembly = false;

				entity.IsBySplitQuantity = false;
				entity.IsGenerateAsReferenceLineItems = false;
				entity.CopyUserDefined1 = false;
				entity.CopyUserDefined2 = false;
				entity.CopyUserDefined3 = false;
				entity.CopyUserDefined4 = false;
				entity.CopyUserDefined5 = false;
			}else if(structureType.StructureName !=='Boq') {

				entity.CopyCostGroup = false;
				entity.CopyPrjCostGroup = false;
				entity.CopyWic = false;
				entity.CopyControllingUnit = false;
				entity.CopyLocation = false;
				entity.CopyProcStructure = false;
				entity.CopyBoqFinalPrice = false;
				entity.CopyRelatedWicAssembly = false;

				entity.IsBySplitQuantity = false;
				entity.IsGenerateAsReferenceLineItems = false;
				entity.CopyUserDefined1 = false;
				entity.CopyUserDefined2 = false;
				entity.CopyUserDefined3 = false;
				entity.CopyUserDefined4 = false;
				entity.CopyUserDefined5 = false;
			}

			entity.StructureName = structureType.StructureName;
			entity.EstStructureId = structureType.EstStructureId;

			// let notByBoq = structureType.StructureName !== 'Boq';
			// let notByAct = structureType.StructureName !== 'Schedule';

			// TODO: set form item readonly
			// $injector.get('platformRuntimeDataService').readonly(entity, [
			// 	{field: 'CopyCostGroup', readonly: notByBoq},
			// 	{field: 'CopyPrjCostGroup', readonly: notByBoq},
			// 	{field: 'CopyWic', readonly: notByBoq},
			// 	{field: 'CopyControllingUnit', readonly: notByBoq && notByAct},
			// 	{field: 'CopyLocation', readonly: notByBoq && notByAct},
			// 	{field: 'CopyProcStructure', readonly: notByBoq && notByAct},
			// 	{field: 'CopyBoqFinalPrice', readonly: notByBoq},
			// 	{field: 'CopyRelatedWicAssembly', readonly: notByBoq || !entity.CreateNew},
			//
			// 	{field: 'IsBySplitQuantity', readonly: notByBoq},
			// 	{field: 'IsGenerateAsReferenceLineItems', readonly: !entity.IsBySplitQuantity},
			// 	{field: 'CopyUserDefined1', readonly: notByBoq},
			// 	{field: 'CopyUserDefined2', readonly: notByBoq},
			// 	{field: 'CopyUserDefined3', readonly: notByBoq},
			// 	{field: 'CopyUserDefined4', readonly: notByBoq},
			// 	{field: 'CopyUserDefined5', readonly: notByBoq}
			// ]);
		}

		return new ValidationResult();
	}
	private validateIsBySplitQuantity(info: FieldValidationInfo<IGenerateLineItem>) : ValidationResult {
		// $injector.get('platformRuntimeDataService').readonly(entity, [
		// 	{field: 'IsGenerateAsReferenceLineItems', readonly: !value},
		// ]);
		// if (!value) {
		// 	entity.IsGenerateAsReferenceLineItems = false;
		// }

		return new ValidationResult();
	}

	private entity: IGenerateLineItem = {
		StructureId: 1,
		StructureName: '',
		EstStructureId:-1,
		IsBySplitQuantity: false,
		CopyUserDefined1: false,
		CopyUserDefined2: false,
		CopyUserDefined3: false,
		CopyUserDefined4: false,
		CopyUserDefined5: false,
		CreateNew: true,
		UpdateExistedItem: false,
		CopyCostGroup: false,
		CopyPrjCostGroup: false,
		CopyWic: false,
		CopyControllingUnit: false,
		CopyLocation: false,
		CopyProcStructure: false,
		CopyBoqFinalPrice: false,
		CopyRelatedWicAssembly: false,
		IsGenerateAsReferenceLineItems: false,
		CopyLeadingStructrueDesc: true,
		UpdateLeadStrucDescToExistingItem: false
	};

	public  async openGenerateLineForm(){
		await this.leadingStructureService.loadList().then(() => {
			this.formDialogService.showDialog<IGenerateLineItem>({
				id: 'GenerateLineForm',
				headerText: {key: 'estimate.main.generateItemFromLeadingStructure'},
				formConfiguration: this.generateLineItemForm,
				entity: this.entity,
				width: '800px',

			})?.then((res) => {
				if(!res || !res.value || res.closingButtonId !== StandardDialogButtonId.Ok) {
					return;
				}

				const sourceLookupDetail = this.leadingStructureService.getItemById(res.value.StructureId);
				if(sourceLookupDetail) {

					// TODO: this logic of get project/estimate need to change to get from Pin info, rather then from lineItem.
					let selectedLineItem = this.estimateMainService.getSelectedEntity();
					let estHeaderFk = -1;
					if(!selectedLineItem) {
						const lineItems = this.estimateMainService.getList();
						estHeaderFk = lineItems.length > 0 ? lineItems[0].EstHeaderFk : estHeaderFk;
						selectedLineItem = lineItems.length > 0 ? lineItems[0] : selectedLineItem;
					}
					const selectedPrjId = this.estimateMaincontextService.getProjectId() || (selectedLineItem ? selectedLineItem?.ProjectFk : 0);
					const projectId = selectedPrjId ?? -1;

					const postData = {
						'StructureId': res.value.StructureId,
						'StructureName': sourceLookupDetail.StructureName,
						'RootItemId': sourceLookupDetail.RootItemId,
						// Create only new line items
						'CreateOnlyNewLineItem': res.value.CreateNew,
						// Create new line items (from new BoQ items) and update the existing items
						'UpdateExistedItem': res.value.UpdateExistedItem,
						'EstHeaderFk': estHeaderFk,
						'ProjectFk': projectId,
						'EstStructureId': sourceLookupDetail.EstStructureId,
						'CopyCostGroup': res.value.CopyCostGroup,
						'CopyPrjCostGroup': res.value.CopyPrjCostGroup,
						'CopyWic': res.value.CopyWic,
						'CopyControllingUnit': res.value.CopyControllingUnit,
						'CopyLocation': res.value.CopyLocation,
						'CopyProcStructure': res.value.CopyProcStructure,
						'CopyBoqFinalPrice': res.value.CopyBoqFinalPrice,
						'CopyRelatedWicAssembly': res.value.CopyRelatedWicAssembly,
						'IsBySplitQuantity': res.value.IsBySplitQuantity,
						'IsGenerateAsReferenceLineItems': res.value.IsGenerateAsReferenceLineItems,
						'CopyLeadingStructrueDesc': res.value.CopyLeadingStructrueDesc,
						'UpdateLeadStrucDescToExistingItem': res.value.UpdateLeadStrucDescToExistingItem,
						'CopyUserDefined1': res.value.CopyUserDefined1,
						'CopyUserDefined2': res.value.CopyUserDefined2,
						'CopyUserDefined3': res.value.CopyUserDefined3,
						'CopyUserDefined4': res.value.CopyUserDefined4,
						'CopyUserDefined5': res.value.CopyUserDefined5
					};
					// TODO: wait estimateMainService be enhanced this function
					// estimateMainService.setAoTQuantityRelationForWizard(postData);
					if(postData.ProjectFk > 0 && postData.EstHeaderFk >0){
						this.http.post(this.configService.webApiBaseUrl + 'estimate/main/lineitem/generatefromleadingstructure', postData).subscribe(info => {
							if(info){
								const promise = new Promise(resolve => {
									if(postData.StructureName === 'Boq'){
										// TODO: wait this function is enhanced
										// refresh boq look up date cache
										// $injector.get('estimateMainBoqLookupService').loadDataByBoqHeaderId([postData.RootItemId]);
									}

									resolve(true);
								});

								promise.then(()=>{
									// TODO: wait this function is enhanced
									// $injector.get('basicsBoqSplitQuantityLookupDataService').resetCache({lookupType: 'basicsBoqSplitQuantityLookupDataService'});
									// let estimateProjectService = $injector.get('estimateProjectService');
									const projectCompositeItems: object[] = []; // estimateProjectService.getList();
									if (projectCompositeItems && projectCompositeItems.length > 0) {
										// let a = null;
										// _.forEach(projectCompositeItems, function (item) {
										// 	if (item.EstHeader.Id === estHeaderFk) {
										// 		a = item;
										// 	}
										// });
										//
										// if (a) {
										// 	// this.estimateMainService.setEstimateHeader(a, 'EstHeader.Code');
										// }
									} else {
										this.estimateMainService.refreshAll();
									}
								});

							}
						});
					}
				}
			});
		});
	}
}

export interface IGenerateLineItem{
	StructureId: number;
	StructureName: string;
	EstStructureId?:number;
	IsBySplitQuantity: boolean;
	CopyUserDefined1: boolean;
	CopyUserDefined2: boolean;
	CopyUserDefined3: boolean;
	CopyUserDefined4: boolean;
	CopyUserDefined5: boolean;
	CreateNew: boolean;
	UpdateExistedItem: boolean;
	CopyCostGroup: boolean;
	CopyPrjCostGroup: boolean;
	CopyWic: boolean;
	CopyControllingUnit: boolean;
	CopyLocation: boolean;
	CopyProcStructure: boolean;
	CopyBoqFinalPrice: boolean;
	CopyRelatedWicAssembly: boolean;
	IsGenerateAsReferenceLineItems: boolean;
	CopyLeadingStructrueDesc: boolean;
	UpdateLeadStrucDescToExistingItem: boolean;
}