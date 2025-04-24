/**
 * Created by xia on 4/16/2018.
 */
(function () {

	'use strict';
	/* global _,globals */
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainUpdateItemsService', ['$injector', '$q', '$http', 'platformSchemaService', '$translate', 'platformTranslateService',
		'platformModalService', 'platformRuntimeDataService', 'platformDataValidationService', 'cloudDesktopSidebarService', 'qtoHeaderReadOnlyProcessor',
		'platformUserInfoService', 'basicsClerkUtilitiesService', 'platformContextService', 'estimateMainService', 'estimateMainOutputDataService',
		'estimateParameterFormatterService', 'cloudDesktopPinningContextService','platformGridAPI','platformSidebarWizardConfigService','cloudCommonFeedbackType',
		function ($injector, $q, $http, platformSchemaService, $translate, platformTranslateService,
			platformModalService, runtimeDataService, platformDataValidationService, cloudDesktopSidebarService, readOnlyProcessor,
			platformUserInfoService, basicsClerkUtilitiesService, platformContextService, estimateMainService,estimateMainOutputDataService,
			estimateParameterFormatterService, cloudDesktopPinningContextService,platformGridAPI,platformSidebarWizardConfigService,cloudCommonFeedbackType) {

			let service = {};
			let updateLineItemList;
			let self = service;
			let dialogId = $injector.get('estimateMainEstUppDataService').getDialogId(); //Estimate BoQ Configuration Dialog ID
			let dialogUserSettingService = $injector.get('dialogUserSettingService');
			let noteText = $translate.instant('estimate.main.estBoqConfigNote');
			let feedback;
			let canHide;
			service.dataItem = {
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
				updDissolvedAssembly: false,
				updTemplateAssembly: true,
				updAssemblyParam: false,
				updateDurationFrmActivity: false,
				noteText: noteText,
				HighlightAssignments:0,
				BoqHeaderFk:estimateMainService.getSelected()?.BoqHeaderFk,
				UpdateFpBoqUnitRate: false
			};

			function createFormConfiguration(scope){
				let formConfiguration = {
					fid: 'estimate.main.updateItemsFromProject',
					version: '0.1.1',
					showGrouping: true,
					change : function(){},
					groups: [
						{
							gid: 'baseGroup',
							header$tr$:'estimate.main.updateSetting',
							header: 'Update Setting',
							isOpen: true,
							attributes: ['updPrjCC', 'updPrjMat', 'updPrjAssembly','updPrjPlantAssembly','calcRuleParam', 'updBoq', 'updFromBoq','updCur', 'reCalEsc','updRisk','isUpdateAllowance','updateDurationFrmActivity']
						}
					],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'updPrjCC',
							label$tr$: 'estimate.main.updateProjectCostCodes',
							type: 'boolean',
							model: 'updPrjCC',
							sortOrder: 1
						},
						{
							gid: 'baseGroup',
							rid: 'updPrjMat',
							label$tr$: 'estimate.main.updateProjectMaterials',
							type: 'boolean',
							model: 'updPrjMat',
							sortOrder: 2
						},
						{
							gid: 'baseGroup',
							rid: 'updPrjAssembly',
							label$tr$: 'estimate.main.updateProjectAssemblies',
							type: 'boolean',
							model: 'updPrjAssembly',
							sortOrder: 3,
							change: function(entity){
								if(entity && entity.updPrjAssembly){
									entity.updPrjCC = true;
									entity.updPrjMat = true;
								}
								if(scope){
									scope.refreshForm();
								}
							}
						},
						{
							gid: 'baseGroup',
							rid: 'updPrjPlantAssembly',
							label$tr$: 'estimate.main.updateProjectPlantAssemblies',
							type: 'boolean',
							model: 'updPrjPlantAssembly',
							sortOrder: 3,
							change: function(entity){
								if(entity && entity.updPrjPlantAssembly){
									entity.updPrjCC = true;
									entity.updPrjMat = true;
								}
								if(scope){
									scope.refreshForm();
								}
							}
						},
						{
							gid: 'baseGroup',
							rid: 'calcRuleParam',
							label$tr$: 'estimate.main.calculateRuleParam',
							type: 'boolean',
							model: 'calcRuleParam',
							change: function(){
								if(scope){
									scope.refreshForm();
								}
							},
							sortOrder: 4
						},
						{
							gid: 'baseGroup',
							rid: 'updBoq',
							label$tr$: 'estimate.main.updateToBoq',
							type: 'boolean',
							model: 'updBoq',
							change: function(){
								if(scope){
									scope.refreshForm();
								}
							},
							sortOrder: 5
						},
						{

							gid: 'baseGroup',
							rid: 'updCur',
							label$tr$: 'estimate.main.updateCurrencies',
							type: 'boolean',
							model: 'updCur',
							sortOrder: 6

						},
						{

							gid: 'baseGroup',
							rid: 'reCalEsc',
							label$tr$: 'estimate.main.calculateEscalation',
							type: 'boolean',
							model: 'reCalEsc',
							sortOrder: 7

						},
						{
							gid:'baseGroup',
							rid: 'updRisk',
							label: 'Update Risk',
							label$tr$: 'estimate.main.updateRisk',
							type: 'boolean',
							model: 'updRisk',
							sortOrder: 8
						},
						{
							gid: 'baseGroup',
							rid: 'updFromBoq',
							label$tr$: 'estimate.main.updateFromBoq',
							type: 'boolean',
							model: 'updFromBoq',
							change: function(){
								if(scope){
									scope.refreshForm();
								}
							},
							sortOrder: 9
						},
						{
							gid: 'baseGroup',
							rid: 'updateDurationFrmActivity',
							label$tr$: 'estimate.main.updateDurationFrmActivity',
							type: 'boolean',
							model: 'updateDurationFrmActivity',
							sortOrder: 10
						}
						// {
						//  gid:'baseGroup',
						//  rid: 'isUpdateAllowance',
						//  label: 'Update Allowance',
						//  label$tr$: 'estimate.main.isUpdateAllowance',
						//  type: 'boolean',
						//  model: 'isUpdateAllowance',
						//  sortOrder: 10
						// },

					]
				};

				if(service.dataItem.calcRuleParam){
					formConfiguration.groups.push(
						{
							gid: 'selectScope',
							header$tr$:'estimate.main.selectUpdateScope',
							header: 'Select Scope',
							isOpen: true,
							attributes: ['selectUpdatePolicy', 'selectUpdateScope']
						});

					formConfiguration.rows.push(
						{
							gid: 'selectScope',
							rid: 'selectUpdatePolicy',
							model: 'selectUpdatePolicy',
							type: 'radio',
							label: 'Calculate Criteria',
							label$tr$: 'estimate.main.selectUpdatePolicy',
							change: function(){
								if(scope){
									scope.refreshForm();
								}
							},
							options: {
								valueMember: 'value',
								labelMember: 'label',
								items: [
									{
										value: 2,
										label: 'All Rules',
										label$tr$: 'estimate.main.allRule'
									},
									{
										value: 1,
										label: 'Adjustment Rules only',
										label$tr$: 'estimate.main.qnaRule',
									}
								]
							}
						}
					);

					if(service.dataItem.selectUpdatePolicy === 1){
						formConfiguration.rows.push(
							{
								gid: 'selectScope',
								rid: 'selectUpdateScope',
								model: 'selectUpdateScope',
								type: 'radio',
								label: 'Select Estimate scope',
								label$tr$: 'estimate.main.selectUpdateScope',
								options: {
									valueMember: 'value',
									labelMember: 'label',
									items: [
										{
											value: 1,
											label: 'Highlighted LineItem',
											label$tr$: 'estimate.main.highlightedLineItem'
										},
										{
											value: 2,
											label: 'Current Result Set',
											label$tr$: 'estimate.main.currentResultSet'
										},
										{
											value: 3,
											label: 'Entire Estimate',
											label$tr$: 'estimate.main.entireEstimate'
										}]
								}
							}
						);
					}
				}

				if(service.dataItem.updBoq){
					formConfiguration.groups.push({
						gid: 'selectUnitRate',
						header: 'Select BoQ Unit Rate Generate Criteria',
						header$tr$: 'estimate.main.selectUnitRate',
						isOpen: true,
						attributes: ['BidBoqUintRateGen']
					},
					{
						gid: 'selectScopeBoQ',
						header: 'Select BoQ Update Scope',
						header$tr$:'estimate.main.updateBoqHeaderOption',
						isOpen: true,
						attributes: []
					}
					);

					formConfiguration.rows.push({
						gid: 'selectUnitRate',
						rid: 'BidBoqUintRateGen',
						label: 'Project BoQ Unit Rate Generate Criteria',
						label$tr$: 'estimate.main.prjBoqUnitRateCri',
						type: 'directive',
						directive: 'estimate-main-create-bid-boq-unit-assign',
						model: 'BidBoqUintRateGen',
						sortOrder: 3
					},
					{
						gid: 'selectUnitRate',
						rid: 'updateFpBoqUnitRate',
						label: 'Project BoQ Unit Rate Generate Criteria',
						label$tr$: 'estimate.main.updateFpBoqUnitRate',
						type: 'boolean',
						model: 'UpdateFpBoqUnitRate',
						sortOrder: 4
					},
					{
						gid: 'selectScopeBoQ',
						rid: 'HighlightAssignments',
						model: 'HighlightAssignments',
						type: 'radio',
						label: 'BoQ Update Scope',
						label$tr$: 'estimate.main.updateBoqFromEstimate',
						change: function(){
							if(scope){
								scope.refreshForm();
							}
						},
						options: {
							valueMember: 'value',
							labelMember: 'label',
							items: [
								{
									value: 1,
									label: 'All BoQs',
									label$tr$: 'estimate.main.allBoQs'
								},
								{
									value: 2,
									label: 'Highlighted/Selected BoQs',
									label$tr$: 'estimate.main.highlightedBoQs',
								}
							],
							default: 1
						},
						sortOrder: 0
					},
					{
						gid: 'selectScopeBoQ',
						rid: 'BoqHeaderFk',
						label: 'BoQ Filter',
						label$tr$: 'estimate.main.boQFilter',
						type: 'select',
						model: 'BoqHeaderFk',
						readonly: service.dataItem.HighlightAssignments ===1,
						options: {
							serviceName: 'estimateMainBoQFilterService',
							displayMember: 'Reference',
							valueMember: 'BoqHeaderFk',
							inputDomain: 'Reference',
							select: 1
						},
						sortOrder: 1,

					}
					);
				}

				if(service.dataItem.updFromBoq){
					formConfiguration.groups.push({
						gid: 'estFromBoq',
						header: 'Estimate BoQ Configuration',
						header$tr$: 'estimate.main.estConfigEstBoqUppTitle',
						isOpen: true,
						attributes: ['EstimateBoqConfiguration']
					});

					formConfiguration.rows.push({
						rid: 'isDisabled',
						gid: 'estFromBoq',
						label: 'Update Flag Disabled',
						label$tr$: 'estimate.main.updateFlagDisabled',
						type: 'boolean',
						model: 'IsDisabled',
						sortOrder: 1
					});

					formConfiguration.rows.push({
						rid: 'isFixedPrice',
						gid: 'estFromBoq',
						label: 'Update Flag Fixed Price',
						label$tr$: 'estimate.main.updateFlagFixedPrice',
						type: 'boolean',
						model: 'IsFixedPrice',
						sortOrder: 2
					});

					formConfiguration.rows.push({
						rid: 'isAQOptionalItems',
						gid: 'estFromBoq',
						label: 'Update AQ for all Optional Items',
						label$tr$: 'estimate.main.updateAQforOptionalItems',
						type: 'boolean',
						model: 'IsAQOptionalItems',
						sortOrder: 3
					});

					formConfiguration.rows.push({
						rid: 'isDayWork',
						gid: 'estFromBoq',
						label: 'Update Flag Day Work',
						label$tr$: 'estimate.main.updateFlatDayWork',
						type: 'boolean',
						model: 'IsDayWork',
						sortOrder: 4,
					});

					formConfiguration.rows.push({
						rid: 'estBoqConfigNote',
						gid: 'estFromBoq',
						label: 'Note',
						label$tr$: 'estimate.main.note',
						type: 'text',
						model: 'noteText',
						sortOrder: 5,
						readonly: true
					});

					loadDialogSettings();

					function loadDialogSettings() {
						service.dataItem.IsDisabled= dialogUserSettingService.getCustomConfig(dialogId, 'IsDisabled') ?? false;
						service.dataItem.IsFixedPrice= dialogUserSettingService.getCustomConfig(dialogId, 'IsFixedPrice') ?? false;
						service.dataItem.IsAQOptionalItems= dialogUserSettingService.getCustomConfig (dialogId, 'IsAQOptionalItems') ?? false;
						service.dataItem.IsDayWork = dialogUserSettingService.getCustomConfig (dialogId, 'IsDayWork') || false;
					}
				}

				if(service.dataItem.updPrjAssembly){
					formConfiguration.groups.push({
						gid: 'assemblyScopeGroup',
						header$tr$:'estimate.main.assemblyScope',
						header: 'Select Assembly Scope',
						isOpen: true,
						attributes: ['updProtectedAssembly', 'updCompositeAssembly', 'updDissolvedAssembly', 'updTemplateAssembly']
					});

					formConfiguration.rows.push({
						gid:'assemblyScopeGroup',
						rid: 'updProtectedAssembly',
						label: 'Protected Assembly',
						label$tr$: 'estimate.main.protectedAssembly',
						type: 'boolean',
						readonly: true,
						model: 'updProtectedAssembly',
						sortOrder: 11
					});
					formConfiguration.rows.push({
						gid:'assemblyScopeGroup',
						rid: 'updCompositeAssembly',
						label: 'Composite Assembly',
						label$tr$: 'estimate.main.compositeAssembly',
						type: 'boolean',
						readonly: true,
						model: 'updCompositeAssembly',
						sortOrder: 12
					});
					formConfiguration.rows.push({
						gid:'assemblyScopeGroup',
						rid: 'updDissolvedAssembly',
						label: 'Dissolved Assembly',
						label$tr$: 'estimate.main.dissolvedAssembly',
						type: 'boolean',
						model: 'updDissolvedAssembly',
						sortOrder: 13
					});
					formConfiguration.rows.push({
						gid:'assemblyScopeGroup',
						rid: 'updTemplateAssembly',
						label: 'Assembly Template',
						label$tr$: 'estimate.main.templateAssembly',
						type: 'boolean',
						readonly: true,
						model: 'updTemplateAssembly',
						sortOrder: 14
					});

					formConfiguration.groups.push({
						gid: 'updAssemblyOptionsGroup',
						header$tr$:'estimate.main.updAssemblyOptions',
						header: 'Additional Update options',
						isOpen: true,
						attributes: ['updAssemblyParam']
					});

					formConfiguration.rows.push({
						gid:'updAssemblyOptionsGroup',
						rid: 'updAssemblyParam',
						label: 'Update Parameters',
						label$tr$: 'estimate.main.updateAssemblyParams',
						type: 'boolean',
						model: 'updAssemblyParam',
						sortOrder: 14
					});
				}

				platformTranslateService.translateFormConfig(formConfiguration);

				return formConfiguration;
			}

			let showDialog = function showDialog() {
				let modalOptions = {
					headerTextKey: 'estimate.main.infoCalculateDialogHeader',
					bodyTextKey: 'estimate.main.infoCalculateDialogBody',
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			};


			let getDataForUpdateFromSourceBoq = function getDataForUpdateFromSourceBoq(data) {
				return {
					'StructureId': 15,// result.data.StructureId,
					'StructureName': 'Boq',
					'RootItemId': 0,// sourceLookupDetail.RootItemId,
					// Create only new line items
					'CreateOnlyNewLineItem': false,
					// Create new line items (from new BoQ items) and update the existing items
					'UpdateExistedItem': true,

					'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
					'ProjectFk': estimateMainService.getSelectedProjectId(),
					'EstStructureId': null,
					'CopyCostGroup': false,
					'CopyPrjCostGroup': false,
					'CopyWic': false,
					'CopyControllingUnit': false,
					'CopyLocation': false,
					'CopyProcStructure': false,
					'CopyBoqFinalPrice': false,
					'IsBySplitQuantity': false,
					'IsGenerateAsReferenceLineItems': false,
					'CopyLeadingStructrueDesc': false,
					'UpdateLeadStrucDescToExistingItem': false,
					'CopyUserDefined1': false,
					'CopyUserDefined2':false,
					'CopyUserDefined3': false,
					'CopyUserDefined4': false,
					'CopyUserDefined5': false,
					'IsUpdateEstimateWizard': true,
					'IsDisabled':data.IsDisabled,
					'IsFixedPrice':data.IsFixedPrice,
					'IsAQOptionalItems':data.IsAQOptionalItems,
					'IsDayWork' : data.IsDayWork,
				};
			};

			service.updateEstimateFromProject = function updateEstimateFromProject(result) {
				if(result.data.updFromBoq){
					saveDialogSettings();
					function saveDialogSettings() {
						dialogUserSettingService.setCustomConfig(dialogId, 'IsDisabled', result.data.IsDisabled);
						dialogUserSettingService.setCustomConfig(dialogId, 'IsFixedPrice',result.data.IsFixedPrice);
						dialogUserSettingService.setCustomConfig (dialogId, 'IsAQOptionalItems',result.data.IsAQOptionalItems);
						dialogUserSettingService.setCustomConfig (dialogId, 'IsDayWork',result.data.IsDayWork);
					}
				}

				let postData = {
					'EstHeaderFk': parseInt(estimateMainService.getSelectedEstHeaderId()),
					'SelectedLineItems' : estimateMainService.getSelectedEntities(),
					'SelectUpdateScope': result.data.selectUpdateScope,
					'SelectUpdatePolicy': result.data.selectUpdatePolicy,
					'UpdateFrmPrjCostCodes': result.data.updPrjCC,
					'UpdateFrmPrjMaterial': result.data.updPrjMat,
					'UpdateFrmPrjAssembly': result.data.updPrjAssembly,
					'UpdateFrmPrjPlantAssembly': result.data.updPrjPlantAssembly,
					'CalculateRuleParam': result.data.calcRuleParam,
					'UpdateBoq': result.data.updBoq,
					'UpdateFromBoq': result.data.updFromBoq,
					'CalculateEscalation': result.data.reCalEsc,
					'UpdateDurationFromActivity': result.data.updateDurationFrmActivity,
					'ProjectId': estimateMainService.getSelectedProjectId(),
					'SelectedItemId': estimateMainService.getIfSelectedIdElse(0),
					'UpdateMultiCurrencies':result.data.updCur,
					'LgmJobFk': result.lgmjobfk || 0,
					'UpdateRisk': result.data.updRisk,
					'IsUpdateAllowance': result.data.isUpdateAllowance,
					'filterRequest' : $injector.get('estimateMainService').getLastFilter(),
					'CopyPriceIndex' : result.data.PriceColumns && result.data.PriceColumns.length > 0 ? (_.filter(result.data.PriceColumns, {'checked': true})).map(function (item){return item.Id;}) : [],
					'leadingStructureParaData': getDataForUpdateFromSourceBoq(result.data),
					'UpdProtectedAssembly': result.data.updProtectedAssembly,
					'UpdCompositeAssembly': result.data.updCompositeAssembly,
					'UpdDissolvedAssembly': result.data.updDissolvedAssembly,
					'UpdTemplateAssembly': result.data.updTemplateAssembly,
					'IsUpdateResourceCostUnit': result.data.IsUpdateResourceCostUnit,
					'MdcCostCodeFk': result.data.MdcCostCodeFk,
					'ProjectCostCodeFk': result.data.ProjectCostCodeFk,
					'MdcMaterialFk': result.data.MdcMaterialFk,
					'UpdAssemblyParam':result.data.updAssemblyParam,
					'UpdateFpBoqUnitRate': result.data.UpdateFpBoqUnitRate
				};
				if(result.data.CopyLineItemRete){
					postData.CopyPriceIndex.push(0);
				}

				if(postData.ProjectId <= 0){
					postData.ProjectId = estimateMainService.getProjectId();
				}
				if (postData.EstHeaderFk <= 0 || postData.ProjectId <= 0) {
					showDialog();
				}else {
					estimateMainOutputDataService.ruleResultProgress.fire({
						EstRuleResultHeader:{
							Finished : 0,
							Total : 0,
							ExecutionState : 0,
							CurrentSequence :0,
							Message : ''
						}
					});

					let refreshEstimate = function refreshEstimate(response){
						let lastSelected = angular.copy(estimateMainService.getSelected());
						estimateMainService.load().then(function () {
							if(lastSelected){
								lastSelected = _.find(estimateMainService.getList(), { Id : lastSelected.Id}) || lastSelected;
								estimateMainService.updateItemSelection(lastSelected).then(function () {
									// notify the grand total container to recalculate if necessary
									$injector.get('estimateMainSidebarWizardService').onCalculationDone.fire();
								});
							}
						});
					};

					let refreshBoq = function refreshBoq(){
						if (postData.UpdateBoq) {
							estimateMainService.onBoqItesmUpdated.fire();
						}
					};

					return estimateMainService.update().then(function (response) {
						if(!response || response.status === 409) { return; }

						var $scope = platformSidebarWizardConfigService.getCurrentScope();
						if ($scope != null && $scope.getUiAddOns()) {
							let uiMgr = $scope.getUiAddOns();
							feedback = uiMgr.getFeedbackComponent();
							feedback.setOptions({
								loadingText: $translate.instant('platform.processing'),
								info: $translate.instant('estimate.main.updateEstimateInfoMessage'),
								title: $translate.instant('estimate.main.updateEstimateInProgress'),
								type: cloudCommonFeedbackType.long
							})
							feedback.show();
							canHide = true;
						}

						if (postData.ProjectId > 0) {

							//If rules are running in background, disable bulk editor in LineItems and Resources container
							if(postData.CalculateRuleParam) {
								disableBulkEditor();
							}
							if(result.data.HighlightAssignments === 2 && result.data.BoqHeaderFk){
								postData.boqHeaderFks = [result.data.BoqHeaderFk];
								result.data.HighlightAssignments = 0;
							}
							result.data.HighlightAssignments = 0;
							$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/updateestimate', postData)
								.then(function (response) {

									if (response.status === 200) {

										if(postData.CalculateRuleParam) {

											// reset the estimateParameterFormatterService cache
											estimateParameterFormatterService.clear();
											$injector.get('estimateRuleFormatterService').refresh();

											estimateMainOutputDataService.startGetResultList(true);
											refreshEstimate(response);

											refreshBoq();
											showUpdateMessage(false);

											if (canHide) {
												feedback.hide(); // Hide feedback here after all updates are done
											}

										}else{
											if(postData.UpdAssemblyParam) {
												estimateParameterFormatterService.clear();
												$injector.get('estimateRuleFormatterService').refresh();
											}
											if (response.data && response.data.LineItems) {
												estimateMainService.clear();

												refreshEstimate(response);
											}
											refreshBoq();

											if (canHide) {
												feedback.hide();
											}
											showUpdateMessage(true);
										}
									}
									// changeLineItemsFromOptionalGrid(response.data && response.data.LineItems ? response.data.LineItems : null);
								},function(){
									if(postData.CalculateRuleParam) {
										estimateMainOutputDataService.startGetResultList();
									}
								});
						}
					});
				}
			};

			function disableBulkEditor(){

				let estLineItemGridId = '681223e37d524ce0b9bfa2294e18d650';
				if (platformGridAPI.grids.exist(estLineItemGridId)) {
					let lineItemGrid = platformGridAPI.grids.element('id', estLineItemGridId);
					if(lineItemGrid) {
						let lineItemTools = $injector.get('platformToolbarService').getTools(estLineItemGridId);
						_.forEach(lineItemTools, function (btn) {
							if (btn.id === 't14') {
								btn.disabled = true;
							}
						});
						lineItemGrid.scope.$parent.addTools(lineItemTools);
					}
				}

				let estResourceGridId = 'bedd392f0e2a44c8a294df34b1f9ce44';
				if (platformGridAPI.grids.exist(estResourceGridId)) {
					let estResourceGrid = platformGridAPI.grids.element('id', estResourceGridId);
					if(estResourceGrid) {
						let resourceTools = $injector.get('platformToolbarService').getTools(estResourceGridId);
						_.forEach(resourceTools, function (btn) {
							if (btn.id === 't14') {
								btn.disabled = true;
							}
						});
						estResourceGrid.scope.$parent.addTools(resourceTools);
					}
				}
			}

			// move this function to here from estimateMainUpdateItemsController
			service.changeLineItemsFromOptionalGrid = function (){
				estimateMainService.unregisterListLoaded(service.changeLineItemsFromOptionalGrid);

				let lineItems = estimateMainService.getList();
				if (!updateLineItemList || !lineItems)
				{
					return;
				}

				let postData = {
					LineItemCreationData: {
						// SelectedItem: service.getSelected(),
						SelectedItems: [],
						ProjectId: estimateMainService.getSelectedProjectId(),
						EstHeaderFk: estimateMainService.getSelectedEstHeaderId(),
						ChangedField: 'IsOptional'
					}
				};
				updateLineItemList.forEach(optional=>{
					lineItems.forEach(item=>{
						if (item.BoqItemFk=== optional.Id)
						{
							let anyColChanged = false;
							if(optional.OriginOptional !== optional.IsOptional){
								item.IsOptional=optional.IsOptional;
								anyColChanged = true;
							}

							if(optional.OriginOptionalIt !== optional.IsOptionalIt){
								item.IsOptionalIT = optional.IsOptionalIt;
								anyColChanged = true;
							}

							if(optional.IsFixedPriceLineItem !== optional.IsFixedPrice){
								item.IsFixedPrice = optional.IsFixedPrice;
								anyColChanged = true;
							}

							if(anyColChanged){
								postData.LineItemCreationData.SelectedItems.push(item);
							}

						}
					});
				});
				if (postData.LineItemCreationData.SelectedItems.length>0) {
					estimateMainService.calculateLineItemAndResource(postData, true);
				}
			};


			service.setUpdateLineItemList = function (list){
				updateLineItemList = list;
			};

			self.showCreateDialog = function showCreateDialog() {
				let project = cloudDesktopPinningContextService.getPinningItem('project.main');
				let estHeader = cloudDesktopPinningContextService.getPinningItem('estimate.main');
				if(!project || project.id <=0 || !estHeader || estHeader.id < 0){
					platformModalService.showMsgBox($translate.instant('estimate.main.pinPrjOrEst'), $translate.instant('estimate.main.noProjectOrEstimatePinned'));
					return;
				}

				$http.get(globals.webApiBaseUrl + 'estimate/main/header/getlineitemqtytotaltostruct?estHeaderId='+estHeader.id)
					.then(function (response) {
						platformModalService.showDialog({
							// scope: (dialogConfig.scope) ? dialogConfig.scope.$new(true) : null,
							templateUrl: globals.appBaseUrl + 'estimate.main/templates/estimate-main-update-items-dialog.html',
							backdrop: false,
							windowClass: 'form-modal-dialog',
							width: 600,
							options: {isGetLineItemQtyTotalToStr: response && response.data}

						}).then(function (result) {
							if (result && result.ok && result.data) {
								service.updateEstimateFromProject(result);
							}
						}
						);
					});
			};

			service.showDialog = function showDialog() {
				// platformTranslateService.translateFormConfig(self.formConfiguration);
				self.showCreateDialog();
			};

			service.getDialogTitle = function getDialogTitle() {
				return $translate.instant('estimate.main.updateEstimate');
			};

			Object.defineProperties(service, {
				'dialogTitle': {
					get: function () {
						return '';
					}, enumerable: true
				}
			}
			);

			service.getDataItem = function getDataItem() {
				return service.dataItem;
			};

			service.getFormConfiguration = function getFormConfiguration(scope) {
				service.dataItem.BoqHeaderFk = estimateMainService.getSelected()?.BoqHeaderFk;
				if ((service.dataItem.HighlightAssignments === 0) ||
					(service.dataItem.HighlightAssignments === 1 && !service.dataItem.BoqHeaderFk)) {
					service.dataItem.HighlightAssignments = service.dataItem.BoqHeaderFk ? 2 : 1;
				}
				return createFormConfiguration(scope);
			};

			function showUpdateMessage(isEstimateUpdate) {
				let headerTextKey = $translate.instant('estimate.main.updateItemsFromProject');
				let bodyTextKey = isEstimateUpdate ? $translate.instant('estimate.main.estUpdateSuccess') : $translate.instant('estimate.main.estUpdateRuleSuccess');
				let modalOptions = {
					headerTextKey: headerTextKey,
					bodyTextKey: bodyTextKey,
					showOkButton: true,
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}

			return service;
		}]);

})(angular);
