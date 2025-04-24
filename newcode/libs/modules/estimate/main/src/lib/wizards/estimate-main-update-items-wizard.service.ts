/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType, IEditorDialogResult, IFormConfig, IFormDialog, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IEstimateUpdateItems } from '../model/interfaces/estimate-main-update-items.interface';

@Injectable({ providedIn: 'root' })
export class EstimateMainUpdateItemWizardservice {


	private http = inject(HttpClient);
	public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);

	/**
	 * Displays a dialog.
	 */
	public updateEstimate() {

		// TODO Project and EstimateHeader Pin 
		// let project = cloudDesktopPinningContextService.getPinningItem('project.main');
		// 		let estHeader = cloudDesktopPinningContextService.getPinningItem('estimate.main');
		// 		if(!project || project.id <=0 || !estHeader || estHeader.id < 0){
		// 			platformModalService.showMsgBox($translate.instant('estimate.main.pinPrjOrEst'), $translate.instant('estimate.main.noProjectOrEstimatePinned'));
		// 			return;
		// 		}

		const result = this.formDialogService
			.showDialog<IEstimateUpdateItems>({
				id: 'updateEstimate',
				headerText: 'estimate.main.updateItemsFromProject',
				formConfiguration:((dialog:IFormDialog<IEstimateUpdateItems>) => this.prepareFormConfig(dialog)),
				entity: this.defaultEntity<IEstimateUpdateItems>(),
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
	 * Prepares the form configuration for the specified entity.
	 */
	public prepareFormConfig(dlg:IFormDialog<IEstimateUpdateItems>): IFormConfig<IEstimateUpdateItems> {
		const formConfig: IFormConfig<IEstimateUpdateItems> = {
			formId: 'estimate.main.updateItemsFromProject',
			showGrouping: true,
			groups: [

				{
					groupId: 'baseGroup',
					header: { key : 'estimate.main.updateSetting'},
					open: true
				},
				
			],
			rows: [
				{
					groupId: 'baseGroup',
					id: 'updPrjCC',
					label: {
						key : 'estimate.main.updateProjectCostCodes',
					},
					type: FieldType.Boolean,
					model: 'updPrjCC',
				},
				{
					groupId: 'baseGroup',
					id: 'updPrjMat',
					label: {
						key : 'estimate.main.updateProjectMaterials',
					},
					type: FieldType.Boolean,
					model: 'updPrjMat',
				},
				{
					groupId: 'baseGroup',
					id: 'updPrjAssembly',
					label: {
						key : 'estimate.main.updateProjectAssemblies',
					},
					type: FieldType.Boolean,
					model: 'updPrjAssembly',
					change: e => {
						if(e.newValue){
                        this.defaultItem.updPrjCC = true;
                        this.defaultItem.updPrjMat = true;
						}
						dlg.refresh!();
						
						
                    }
				},
				{
					groupId: 'baseGroup',
					id: 'updPrjPlantAssembly',
					label: {
						key : 'estimate.main.updateProjectPlantAssemblies',
					},
					type: FieldType.Boolean,
					model: 'updPrjPlantAssembly',
					change: e => {
						if(e.newValue){
                        this.defaultItem.updPrjCC = true;
                        this.defaultItem.updPrjMat = true;
						}
						dlg.refresh!();
                    }
				},
				{
					groupId: 'baseGroup',
					id: 'calcRuleParam',
					label: {
						key : 'estimate.main.calculateRuleParam',
					},
					type: FieldType.Boolean,
					model: 'calcRuleParam',
					change: e => {
						dlg.refresh!();
                    }
				},
				{
					groupId: 'baseGroup',
					id: 'updBoq',
					label: {
						key : 'estimate.main.updateToBoq',
					},
					type: FieldType.Boolean,
					model: 'updBoq',
					change: e => {
						dlg.refresh!();
                    }
				},
				{
					groupId: 'baseGroup',
					id: 'updCur',
					label: {
						key : 'estimate.main.updateCurrencies',
					},
					type: FieldType.Boolean,
					model: 'updCur',
				},
				{
					groupId: 'baseGroup',
					id: 'reCalEsc',
					label: {
						key : 'estimate.main.calculateEscalation',
					},
					type: FieldType.Boolean,
					model: 'reCalEsc',
				},
				{
					groupId: 'baseGroup',
					id: 'updRisk',
					label: {
						key : 'estimate.main.updateRisk',
					},
					type: FieldType.Boolean,
					model: 'updRisk',
				},
				{
					groupId: 'baseGroup',
					id: 'updFromBoq',
					label: {
						key : 'estimate.main.updateFromBoq',
					},
					type: FieldType.Boolean,
					model: 'updFromBoq',
					change: e => {
						dlg.refresh!();
                    }
				},
				

			],
		};
		
		if(this.defaultItem.calcRuleParam){
			if (!formConfig.groups) {
				formConfig.groups = [];
			}
			formConfig.groups.push({
				groupId: 'selectScope',
				header: { key : 'estimate.main.selectUpdateScope'},
				open: true
			});
			formConfig.rows.push({
				groupId: 'selectScope',
				id: 'selectUpdatePolicy',
				label: { key: 'estimate.main.selectUpdatePolicy' },
				type: FieldType.Radio,
				model: 'selectUpdatePolicy',
				itemsSource: {
					items: [
						{
							id: 1,
							displayName: { key: 'estimate.main.qnaRule'},
						},
						{
							id: 2,
							displayName: { key: 'estimate.main.allRule' },
						},
					],
				},
				change: e => {
					dlg.refresh!();
				}
			});
			if(this.defaultItem.selectUpdatePolicy === 1){
				formConfig.rows.push({
					groupId: 'selectScope',
					id: 'selectUpdateScope',
					label: { key: 'estimate.main.selectUpdateScope' },
					type: FieldType.Radio,
					model: 'selectUpdateScope',
					itemsSource: {
						items: [
							{
								id: 1,
								displayName: { key: 'estimate.main.highlightedLineItem'},
							},
							{
								id: 2,
								displayName: { key: 'estimate.main.currentResultSet' },
							},
							{
								id: 3,
								displayName: { key: 'estimate.main.entireEstimate' },
							},
						],
					},
				});
			}
		}
		if(this.defaultItem.updBoq){
			if (!formConfig.groups) {
				formConfig.groups = [];
			}
			formConfig.groups.push({
				groupId: 'selectUnitRate',
				header: { key : 'estimate.main.selectUnitRate'},
				open: true
			});

			// TODO 
			// formConfig.rows.push({
			// 	gid: 'selectUnitRate',
			// 	rid: 'BidBoqUintRateGen',
			// 	label: 'Project BoQ Unit Rate Generate Criteria',
			// 	label$tr$: 'estimate.main.prjBoqUnitRateCri',
			// 	type: 'directive',
			// 	directive: 'estimate-main-create-bid-boq-unit-assign',
			// 	model: 'BidBoqUintRateGen',
			// 	sortOrder: 3
			// });
		}

		if(this.defaultItem.updPrjAssembly){
			if (!formConfig.groups) {
				formConfig.groups = [];
			}
			formConfig.groups.push({
				groupId: 'assemblyScopeGroup',
				header: { key : 'estimate.main.assemblyScope'},
				open: true
			});

			formConfig.rows.push({
				groupId: 'assemblyScopeGroup',
				id: 'updProtectedAssembly',
				label: {
					key : 'estimate.main.protectedAssembly',
				},
				type: FieldType.Boolean,
				model: 'updProtectedAssembly',
			},
			{
				groupId: 'assemblyScopeGroup',
				id: 'updCompositeAssembly',
				label: {
					key : 'estimate.main.compositeAssembly',
				},
				type: FieldType.Boolean,
				model: 'updCompositeAssembly',
			},
			{
				groupId: 'assemblyScopeGroup',
				id: 'updDissolvedAssembly',
				label: {
					key : 'estimate.main.dissolvedAssembly',
				},
				type: FieldType.Boolean,
				model: 'updDissolvedAssembly',
			});
		}
		return formConfig;
	}

	private defaultItem: IEstimateUpdateItems = {
		selectUpdateScope: 1,
		selectUpdatePolicy: 2,
		isReadonly: true,
		updPrjCC: false,
		updPrjMat: false,
		updPrjAssembly: false,
		updPrjPlantAssembly: false,
		calcRuleParam: true,
		updBoq: false,
		updFromBoq: false,
		updCur: false,
		reCalEsc: false,
		updRisk: false,
		isUpdateAllowance: false,
		CopyLineItemRete: true,
		updProtectedAssembly: true,
		updCompositeAssembly: true,
		updDissolvedAssembly: false
	};
	
	/**
	 * Returns the default entity for the specified type.
	 */
	public defaultEntity<IEstimateUpdateItems>(): IEstimateUpdateItems {
		return this.defaultItem as IEstimateUpdateItems;
	}

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<IEstimateUpdateItems>): void {

		type LeadingStructureData = {
			StructureId: number;
			StructureName: string;
			RootItemId: number;
			CreateOnlyNewLineItem: boolean;
			UpdateExistedItem: boolean;
			EstHeaderFk: number;
			ProjectFk: number;
			EstStructureId: number | null;
			CopyCostGroup: boolean;
			CopyPrjCostGroup: boolean;
			CopyWic: boolean;
			CopyControllingUnit: boolean;
			CopyLocation: boolean;
			CopyProcStructure: boolean;
			CopyBoqFinalPrice: boolean;
			IsBySplitQuantity: boolean;
			IsGenerateAsReferenceLineItems: boolean;
			CopyLeadingStructrueDesc: boolean;
			UpdateLeadStrucDescToExistingItem: boolean;
			CopyUserDefined1: boolean;
			CopyUserDefined2: boolean;
			CopyUserDefined3: boolean;
			CopyUserDefined4: boolean;
			CopyUserDefined5: boolean;
			IsUpdateEstimateWizard: boolean;
		  };
		  
		  type UpdateEstimatePostData = {
			EstHeaderFk: number;
			SelectedLineItems: unknown[];
			SelectUpdateScope: number;
			SelectUpdatePolicy: number;
			UpdateFrmPrjCostCodes: boolean;
			UpdateFrmPrjMaterial: boolean;
			UpdateFrmPrjAssembly: boolean;
			UpdateFrmPrjPlantAssembly: boolean;
			CalculateRuleParam: boolean;
			UpdateBoq: boolean;
			UpdateFromBoq: boolean;
			CalculateEscalation: boolean;
			ProjectId: number;
			SelectedItemId: number;
			UpdateMultiCurrencies: boolean;
			LgmJobFk: number;
			UpdateRisk: boolean;
			IsUpdateAllowance: boolean;
			filterRequest: unknown;
			CopyPriceIndex: number[];
			leadingStructureParaData: LeadingStructureData;
			UpdProtectedAssembly: boolean;
			UpdCompositeAssembly: boolean;
			UpdDissolvedAssembly: boolean;
		  };

		  const postData: UpdateEstimatePostData = {
			EstHeaderFk: 1, //TODO -parseInt(estimateMainService.getSelectedEstHeaderId()),
			SelectedLineItems: [], //TODO - estimateMainService.getSelectedEntities(),
			SelectUpdateScope: this.defaultItem.selectUpdateScope,
			SelectUpdatePolicy: this.defaultItem.selectUpdatePolicy,
			UpdateFrmPrjCostCodes: this.defaultItem.updPrjCC,
			UpdateFrmPrjMaterial: this.defaultItem.updPrjMat,
			UpdateFrmPrjAssembly: this.defaultItem.updPrjAssembly,
			UpdateFrmPrjPlantAssembly: this.defaultItem.updPrjPlantAssembly,
			CalculateRuleParam: this.defaultItem.calcRuleParam,
			UpdateBoq: this.defaultItem.updBoq,
			UpdateFromBoq: this.defaultItem.updFromBoq,
			CalculateEscalation: this.defaultItem.reCalEsc,
			ProjectId: 1, //TODO - estimateMainService.getSelectedProjectId(),
			SelectedItemId: 1, //TODO - estimateMainService.getIfSelectedIdElse(0),
			UpdateMultiCurrencies: this.defaultItem.updCur,
			LgmJobFk: 0, // TODO - result.lgmjobfk || 0,
			UpdateRisk: this.defaultItem.updRisk,
			IsUpdateAllowance: this.defaultItem.isUpdateAllowance,
			filterRequest: null, //TODO - $injector.get('estimateMainService').getLastFilter(),
			CopyPriceIndex: [], //TODO - this.defaultItem.PriceColumns && this.defaultItem.PriceColumns.length > 0 ?
			  //(_.filter(this.defaultItem.PriceColumns, {'checked': true})).map(function (item) { return item.Id; }) : [],
			leadingStructureParaData: ((): LeadingStructureData => ({
				StructureId: 15,
				StructureName: 'Boq',
				RootItemId: 0,
				CreateOnlyNewLineItem: false,
				UpdateExistedItem: true,
				EstHeaderFk: 0, //TODO - estimateMainService.getSelectedEstHeaderId(),
				ProjectFk:  0, //TODO - estimateMainService.getSelectedProjectId(),
				EstStructureId: null,
				CopyCostGroup: false,
				CopyPrjCostGroup: false,
				CopyWic: false,
				CopyControllingUnit: false,
				CopyLocation: false,
				CopyProcStructure: false,
				CopyBoqFinalPrice: false,
				IsBySplitQuantity: false,
				IsGenerateAsReferenceLineItems: false,
				CopyLeadingStructrueDesc: false,
				UpdateLeadStrucDescToExistingItem: false,
				CopyUserDefined1: false,
				CopyUserDefined2: false,
				CopyUserDefined3: false,
				CopyUserDefined4: false,
				CopyUserDefined5: false,
				IsUpdateEstimateWizard: true,
			}))(),
			UpdProtectedAssembly: this.defaultItem.updProtectedAssembly,
			UpdCompositeAssembly: this.defaultItem.updCompositeAssembly,
			UpdDissolvedAssembly: this.defaultItem.updDissolvedAssembly
		};
		if(this.defaultItem.CopyLineItemRete){
			postData.CopyPriceIndex.push(0);
		}

		// TODO - after required services are ready

		// if (postData.EstHeaderFk <= 0 || postData.ProjectId <= 0) {
		// 	showDialog();
		// }else {
		// 	estimateMainOutputDataService.ruleResultProgress.fire({
		// 		EstRuleResultHeader:{
		// 			Finished : 0,
		// 			Total : 0,
		// 			ExecutionState : 0,
		// 			CurrentSequence :0,
		// 			Message : ''
		// 		}
		// 	});

		// 	let refreshEstimate = function refreshEstimate(response){
		// 		estimateMainService.registerListLoaded(service.changeLineItemsFromOptionalGrid);
		// 		let lastSelected = angular.copy(estimateMainService.getSelected());

		// 		if (response.data && response.data.LineItemUDPs) {
		// 			// load user defined column and attach data into lineitems
		// 			let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
		// 			estimateMainDynamicUserDefinedColumnService.attachUpdatedValueToColumn(response.data.LineItems, response.data.LineItemUDPs, false);
		// 		}

		// 		estimateMainService.addList(response.data.LineItems);
		// 		estimateMainService.fireListLoaded();
		// 		lastSelected = response.data.LineItems && response.data.LineItems.length > 0 ? _.find(response.data.LineItems, {Id: lastSelected.Id}) || lastSelected : lastSelected;
		// 		estimateMainService.updateItemSelection(lastSelected).then(function(){
		// 			// // notify the grand total container to recalculate if necessary
		// 			let estimateMainSidebarWizardService = $injector.get('estimateMainSidebarWizardService');
		// 			estimateMainSidebarWizardService.onCalculationDone.fire();
		// 		});
		// 	};

		// 	let refreshBoq = function refreshBoq(){
		// 		if (postData.UpdateBoq) {
		// 			estimateMainService.onBoqItesmUpdated.fire();
		// 		}
		// 	};

		// 	return estimateMainService.update().then(function (response) {
		// 		if(!response || response.status === 409) { return; }

		// 		if (postData.ProjectId > 0) {

		// 			$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/updateestimate', postData)
		// 				.then(function (response) {

		// 					if(postData.CalculateRuleParam) {

		// 						// reset the estimateParameterFormatterService cache
		// 						estimateParameterFormatterService.clear();

		// 						estimateMainOutputDataService.startGetResultList(true);
		// 						refreshEstimate(response);

		// 						refreshBoq();
		// 					}else{
		// 						if (response.data && response.data.LineItems) {
		// 							estimateMainService.clear();

		// 							refreshEstimate(response);
		// 						}
		// 						refreshBoq();
		// 					}

		// 					// changeLineItemsFromOptionalGrid(response.data && response.data.LineItems ? response.data.LineItems : null);
		// 				},function(){
		// 					if(postData.CalculateRuleParam) {
		// 						estimateMainOutputDataService.startGetResultList();
		// 					}
		// 				});
		// 		}
		// 	});
		// }

		// TODO
		// changeLineItemsFromOptionalGrid() 
	}

}
