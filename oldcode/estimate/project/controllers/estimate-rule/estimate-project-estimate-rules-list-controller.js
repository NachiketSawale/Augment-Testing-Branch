/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _, $ */
	'use strict';

	let moduleName = 'estimate.project';

	/**
	 * @ngdoc controller
	 * @name estimateProjectEstimateRulesListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of project estimate rule entities for Project main module.
	 **/
	angular.module(moduleName).controller('estimateProjectEstimateRulesListController', estimateProjectEstimateRulesListController);

	estimateProjectEstimateRulesListController.$inject = ['$scope','$translate','$http','$injector','basicsLookupdataLookupDescriptorService','platformModalService','platformGridAPI',
		'platformGridControllerService','estimateProjectEstRuleScriptService','estimateProjectEstimateRulesService','platformModuleStateService', 'estimateProjectEstimateRulesConfigurationService',
		'estimateProjectEstRuleValidationService'];
	function estimateProjectEstimateRulesListController(
		$scope,$translate,$http,$injector,basicsLookupdataLookupDescriptorService,platformModalService,platformGridAPI,
		platformGridControllerService,estimateProjectEstRuleScriptService,estimateProjectEstimateRulesService,platformModuleStateService, estimateProjectEstimateRulesConfigurationService,
		estimateProjectEstRuleValidationService) {

		let gridConfig = {
			parentProp: 'PrjEstRuleFk',
			childProp: 'PrjEstRules',
			childSort: true,
			grouping: true,
			type: 'rule',
			dragDropService: $injector.get('estimateProjectRuleClipboardService')
		};

		platformGridControllerService.initListController($scope, estimateProjectEstimateRulesConfigurationService, estimateProjectEstimateRulesService, estimateProjectEstRuleValidationService, gridConfig);

		function onFocused(cmState) {
			if(cmState && !cmState.focused){
				$('div.selected.indicator').addClass('edit');
			}
			else{
				$('div > .edit').removeClass('edit');
			}
		}

		function onRowsChanged() {
			let selectedField = estimateProjectEstimateRulesService.getSelected();  // get the selected item.
			if (selectedField) {
				platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, selectedField); // expand the tree if item is a node in tree.
			}
		}

		function cellChangeCallBack(e,args) {
			let estRueCodeInCache = basicsLookupdataLookupDescriptorService.getData('estRuleCodeItems');
			// let estimateProjectEstRuleValidationService = $injector.get('estimateProjectEstRuleValidationService');
			let col = args.grid.getColumns()[args.cell].field;
			let entity = args.item;
			if (col === 'Code') {
				if (entity.Code) {
					entity.Code = entity.Code.toUpperCase();
					estimateProjectEstimateRulesService.gridRefresh();
				}
				if (entity.isUniq) {

					let estRule = _.filter(estRueCodeInCache, {'Code': args.item.Code});
					let strContent = $translate.instant('project.main.copyRuleMsg');
					let strTitle = $translate.instant('project.main.copyRuleMsg');

					if (estRule && estRule.length > 0 && estRule[0].Code !== entity.oldCode) {
						let responseData = [];
						let postData = {
							ProjectEstRuleIds: [entity.Id],
							ProjectFk: entity.ProjectFk,
							MdcLineItemContextFk: estRule[0].MdcLineItemContextFk
						};
						$http.post(globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/candelete', postData).then(function (response) {
							responseData = response.data;
							let isAllRulesAssigned = false;
							if (angular.isArray(responseData) && responseData.length > 0) {
								if (responseData.length === [entity].length) {
									isAllRulesAssigned = true;
								}
							}
							if (isAllRulesAssigned) {
								let modalOptions = {
									headerTextKey: 'cloud.common.errorMessage',
									bodyTextKey: 'estimate.rule.dialog.allRulesAssignedMessage',
									iconClass: 'ico-error',
									height: '185px',
									width: '700px'
								};
								return platformModalService.showDialog(modalOptions);
							} else {
								return platformModalService.showYesNoDialog(strContent, strTitle, 'no');
							}
						}).then(function (result) {
							if (result.yes) {
								entity.DescriptionInfo = estRule[0].DescriptionInfo;
								entity.EstEvaluationSequenceFk = estRule[0].EstEvaluationSequenceFk;
								entity.EstRuleExecutionTypeFk = estRule[0].EstRuleExecutionTypeFk;
								entity.Icon = estRule[0].Icon;
								entity.IsForBoq = estRule[0].IsForBoq;
								entity.IsForEstimate = estRule[0].IsForEstimate;
								entity.IsPrjRule = true;
								entity.Remark = estRule[0].Remark;
								entity.Operand = estRule[0].Operand;
								entity.Comment = estRule[0].Comment;
								entity.FormFk = estRule[0].FormFk;

								let param = {
									estRuleId: estRule[0].Id,
									lineItemContextId: estRule[0].MdcLineItemContextFk,
									prjEstRule: entity
								};

								$http.post(globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/CopyMasterRuleReferece2PrjEstRule', param).then(function (response) {
									if (response && response.data) {
										let prjEstRuleEntity = response.data.prjEstRule ? response.data.prjEstRule : null;

										let estimateProjectEstRuleParameterValueService = $injector.get('estimateProjectEstRuleParameterValueService');
										estimateProjectEstRuleParameterValueService.gridRefresh();

										if (prjEstRuleEntity) {
											estimateProjectEstimateRulesService.load().then(function () {
												let gridLineItem = platformGridAPI.grids.element('id', 'f0930caddf2c4043b08b24661a683bc4');
												if (gridLineItem && gridLineItem.instance) {
													let rows = gridLineItem.dataView.mapIdsToRows([prjEstRuleEntity.Id]);
													gridLineItem.instance.setSelectedRows(rows);

													let projectMainService = $injector.get('projectMainService');
													let modState = platformModuleStateService.state(projectMainService.getModule());
													if (modState) {
														if (modState.modifications && modState.modifications.PrjEstRuleToSave && modState.modifications.PrjEstRuleToSave.length > 0) {
															_.remove(modState.modifications.PrjEstRuleToSave, {'MainItemId': prjEstRuleEntity.Id});
														}
													}
												}
											});
										}
									}
								});

								estimateProjectEstRuleValidationService.validateEstRuleExecutionTypeFk(entity, entity.EstRuleExecutionTypeFk, 'EstRuleExecutionTypeFk');
								estimateProjectEstimateRulesService.gridRefresh();
							}

							if (result.no) {
								entity.Code = entity.oldCode;
								estimateProjectEstRuleValidationService.validateCode(entity, entity.Code, 'Code');
								estimateProjectEstimateRulesService.gridRefresh();
							}

							if (result.ok) {
								entity.Code = entity.oldCode;
								estimateProjectEstimateRulesService.gridRefresh();
							}
						});
					}
				}
			}
		}

		platformGridAPI.events.register($scope.gridId, 'onRowsChanged', onRowsChanged); // Event to get the row change
		estimateProjectEstRuleScriptService.onFocused.register(onFocused);

		platformGridAPI.events.register($scope.gridId, 'onCellChange', cellChangeCallBack);

		$scope.$on('$destroy', function(){
			estimateProjectEstRuleScriptService.onFocused.unregister(onFocused);
			platformGridAPI.events.unregister($scope.gridId, 'onRowsChanged', onRowsChanged);
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', cellChangeCallBack);
		});
	}
})();
