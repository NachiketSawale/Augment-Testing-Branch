/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainDetailsParamDialogController
	 * @function
	 *
	 * @description
	 * estimateMainDetailsParamDialogController for detail formula parameters items display dialog.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainDetailsParamDialogController',[
		'_', '$scope','$timeout', '$translate', '$modalInstance', '$injector', 'platformCreateUuid', 'estimateMainDetailsParamDialogConfigService',
		'estimateMainDetailsParamDialogService', 'estimateMainService', 'estimateMainDetailsParamListDataService', 'platformTranslateService',
		'estimateMainDetailsParamListValidationService','estimateRuleParameterConstant','estimateMainCommonFeaturesService',
		'estimateMainParamStructureConstant',

		function (_, $scope,$timeout, $translate, $modalInstance, $injector, platformCreateUuid, detailsParamDialogConfigService, detailsParamDialogService,
			estimateMainService, detailsParamListDataService, platformTranslateService,estimateMainDetailsParamListValidationService,estimateRuleParameterConstant,estimateMainCommonFeaturesService,estimateMainParamStructureConstant) {

			let uniqId = platformCreateUuid();

			$scope.getContainerUUID = function () {
				return uniqId;
			};

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: $translate.instant('estimate.main.estimate'),
				ok : function (result) {
					$scope.okBtnDisabled = true;
					$scope.requirement = true;
					$scope.isLoading = true;
					detailsParamListDataService.syncParametersFromUserForm(function () {
						let item = $scope.currentItem;
						estimateMainService.setDetailsParamReminder(item.doRememberSelect ? item.selectedLevel : '');
						let paramsToSave = detailsParamListDataService.getList();
						if(paramsToSave && paramsToSave.length>0) {
							item.detailsParamItems = paramsToSave;
							// this $timeout function will occur a bug that two urls 'estimate/main/calculator/updatedetailsparameters' and
							// 'estimate/main/update' are invoked same time, and they all update lineItem and resource, then error will surely appear.
							// I remove this and test original bug, it works fine (#108944)
							// $timeout(function () {
							detailsParamDialogService.updateData(item).then(function () { // todo: new service
								detailsParamListDataService.clear();
								$scope.isLoading = false;
								$modalInstance.close(result);
								$injector.get('estimateMainLineitemParamertersService').refreshToLineItemParams(null,true);
							});
							// });
						}else{
							detailsParamListDataService.clear();
							$scope.isLoading = false;
							$modalInstance.close(result);
						}
					});
				},
				close : function () {
					detailsParamListDataService.clear();
					$modalInstance.dismiss('cancel');
				},
				cancel : function () {
					detailsParamListDataService.clear();
					$modalInstance.dismiss('cancel');
				}
			};


			$scope.change = function change(item, model,row) {
				if(row.rid === 'assignedTo'){
					let assignedStructureId = item.selectedLevel;
					$injector.get('estimateMainDetailsParamDialogService').setSelectedStructureId(item.selectedLevel);
					let currentParameterEntities = item.CurrentParameterEntities;
					let estLeadingStuctureContext = item.EstLeadingStuctureContext;
					let itemsCache = detailsParamListDataService.getItemsTOCache();
					let paramsList = detailsParamListDataService.getList();
					_.forEach(paramsList,function(subItem){
						subItem.AssignedStructureId = assignedStructureId;
						subItem.SameCodeButNoConlict = false;
						if (assignedStructureId === estimateMainParamStructureConstant.BoQs && estLeadingStuctureContext){
							let mapItem = _.find(currentParameterEntities, {'Code': subItem.Code, 'Id': subItem.Id});
							if (subItem.BoqItemFk !== estLeadingStuctureContext.BoqItemFk || currentParameterEntities.length === 0 || mapItem) {
								subItem.Version = -1;
								subItem.BoqItemFk = estLeadingStuctureContext.BoqItemFk;
								$injector.get('estimateMainDetailsParamImageProcessor').select(subItem);
							}
						}else if(assignedStructureId === estimateMainParamStructureConstant.EstHeader){
							let sameEstHeaderParam = _.find(item.EstHeaderParameterEntities, {Code: subItem.Code});
							if(sameEstHeaderParam){
								subItem.EstHeaderFk = sameEstHeaderParam.EstHeaderFk;
							}
						}else {
							let filterItemsCache = itemsCache;
							switch (assignedStructureId){
								case estimateMainParamStructureConstant.ActivitySchedule:
									if(subItem.PsdActivityFk){
										filterItemsCache = _.filter(itemsCache, {'PsdActivityFk': estLeadingStuctureContext.PsdActivityFk});
									}
									break;
								case estimateMainParamStructureConstant.Location:
									if(subItem.PrjLocationFk){
										filterItemsCache = _.filter(itemsCache, {'PrjLocationFk': estLeadingStuctureContext.PrjLocationFk});
									}
									break;
								case estimateMainParamStructureConstant.Controllingunits:
									if(subItem.MdcControllingUnitFk){
										filterItemsCache = _.filter(itemsCache, {'MdcControllingUnitFk': estLeadingStuctureContext.MdcControllingUnitFk});
									}
									break;
								case estimateMainParamStructureConstant.ProcurementStructure:
									if(subItem.PrcStructureFk){
										filterItemsCache = _.filter(itemsCache, {'PrcStructureFk': estLeadingStuctureContext.PrcStructureFk});
									}
									break;
								case estimateMainParamStructureConstant.BasCostGroup:
									if(subItem.CostGroupFk){
										filterItemsCache = _.filter(itemsCache, {'CostGroupFk': estLeadingStuctureContext.CostGroupFk});
									}
									break;
								case estimateMainParamStructureConstant.AssemblyCategoryStructure:
									if(subItem.EstAssemblyCatFk){
										filterItemsCache = _.filter(itemsCache, {'EstAssemblyCatFk': estLeadingStuctureContext.EstAssemblyCatFk});
									}
									break;
							}
							estimateMainCommonFeaturesService.changeAssignedStructureId(subItem, filterItemsCache);
							switch (assignedStructureId){
								case estimateMainParamStructureConstant.ActivitySchedule:
									if(subItem.Version === -1){ subItem.PsdActivityFk = estLeadingStuctureContext.PsdActivityFk; }
									break;
								case estimateMainParamStructureConstant.Location:
									if(subItem.Version === -1){ subItem.PrjLocationFk = estLeadingStuctureContext.PrjLocationFk; }
									break;
								case estimateMainParamStructureConstant.Controllingunits:
									if(subItem.Version === -1){ subItem.MdcControllingUnitFk = estLeadingStuctureContext.MdcControllingUnitFk; }
									break;
								case estimateMainParamStructureConstant.ProcurementStructure:
									if(subItem.Version === -1){ subItem.PrcStructureFk = estLeadingStuctureContext.PrcStructureFk; }
									break;
								case estimateMainParamStructureConstant.BasCostGroup:
									if(subItem.Version === -1){ subItem.CostGroupFk = estLeadingStuctureContext.CostGroupFk; }
									break;
								case estimateMainParamStructureConstant.AssemblyCategoryStructure:
									if(subItem.Version === -1){ subItem.EstAssemblyCatFk = estLeadingStuctureContext.EstAssemblyCatFk; }
									break;
							}
						}
					});

					let params = detailsParamListDataService.checkWithLevelParams(assignedStructureId);

					_.forEach(params,function(subItem){
						subItem.AssignedStructureId = assignedStructureId;
						subItem.SameCodeButNoConlict = false;
						estimateMainCommonFeaturesService.changeAssignedStructureId(subItem, params);
					});
					// detailsParamListDataService.setDataList(params);
					detailsParamListDataService.onUpdateList.fire(params);
					// detailsParamListDataService.gridRefresh();  // apply the validation result ,dont delete the code
					// $injector.get('platformGridAPI').grids.resize(uniqId);
				}
			};

			let currentStructureId = $injector.get('estimateMainDetailsParamDialogService').getLeadingStructureId();
			$scope.formContainerOptions = {
				formOptions: {
					configure: detailsParamDialogConfigService.getFormConfig(currentStructureId),
					validationMethod: function(){return true;}
				}
			};

			$scope.currentItem = detailsParamDialogService.getCurrentItem();

			// let includeUserForm = !!_.find($scope.currentItem.PrjEstRuleToSave, function (item) { return !!item.FormFk;});
			// $injector.get('estimateParamComplexLookupCommonService').setDefaultTebIndex(includeUserForm ? 2 : 1);

			platformTranslateService.translateFormContainerOptions($scope.formContainerOptions);

			function updateItem(item){
				angular.extend($scope.currentItem , item);
			}

			function updateData(data){
				calculateParamValueFristLoad(data.detailsParamItems);
				detailsParamListDataService.setDataList(data.detailsParamItems);
				updateItem(data);
			}

			function calculateParamValueFristLoad(paramItems){
				angular.forEach(paramItems, function(patamItem){
					if(patamItem.ValueType === estimateRuleParameterConstant.Text){
						patamItem.ParameterText = patamItem.ValueDetail;
					}if(patamItem.ValueType === estimateRuleParameterConstant.TextFormula){
						patamItem.ParameterText = patamItem.ValueText;
					}
					// else{
					// $injector.get('estimateRuleCommonService').calculateDetails(patamItem, 'ValueDetail', 'ParameterValue', detailsParamListDataService);
					// }

				});
			}

			function changeUpdateStatus(isValid){
				$scope.okBtnDisabled = isValid;
			}

			detailsParamDialogService.onCurrentItemChanged.register(updateData);
			detailsParamListDataService.onUpdateList.register(updateItem);
			detailsParamListDataService.onItemChange.register(updateItem);
			estimateMainDetailsParamListValidationService.onCodeChange.register(changeUpdateStatus);

			$scope.$on('$destroy', function () {
				detailsParamDialogService.onCurrentItemChanged.unregister(updateData);
				detailsParamListDataService.onItemChange.unregister(updateItem);
				detailsParamListDataService.onUpdateList.unregister(updateItem);
				estimateMainDetailsParamListValidationService.onCodeChange.unregister(changeUpdateStatus);
				$scope.currentItem = {};
				$injector.get('estimateMainDetailsParamDialogService').setSelectedStructureId(null);
				// $injector.get('estimateParamComplexLookupCommonService').setDefaultTebIndex(1);
				detailsParamListDataService.clearCallBackFun();
			});
		}
	]);
})(angular);
