/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */
(function (angular) {
	'use strict';
	let moduleName = 'estimate.assemblies';
	/**
	 * @ngdoc controller
	 * @name estimateAssembliesDetailsParamDialogController
	 * @function
	 *
	 * @description
	 * estimateMainDetailsParamDialogController for detail formula parameters items display dialog.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateAssembliesDetailsParamDialogController',[
		'$scope', '$translate', '$modalInstance', '$injector', 'platformCreateUuid', 'estimateAssembliesDetailsParamDialogConfigService', 'estimateAssembliesDetailsParamDialogService', 'estimateAssembliesService',
		'estimateAssembliesDetailsParamListDataService','estimateAssembliesRuleUpdateService','estimateAssembliesDetailsParamListValidationService', 'platformTranslateService','estimateRuleParameterConstant', 'estimateMainCommonFeaturesService',
		function ($scope, $translate, $modalInstance, $injector, platformCreateUuid, detailsParamDialogConfigService, detailsParamDialogService, estimateAssembliesService,
			detailsParamListDataService,estimateAssembliesRuleUpdateService,estimateAssembliesDetailsParamListValidationService, platformTranslateService,estimateRuleParameterConstant, estimateMainCommonFeaturesService) {

			let uniqId = platformCreateUuid();

			$scope.getContainerUUID = function () {
				return uniqId;
			};

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: $translate.instant('estimate.main.estimate'),
				ok : function (result) {
					let item = $scope.currentItem;
					estimateAssembliesService.setDetailsParamReminder(item.doRememberSelect ? item.selectedLevel : '');
					let estimateAssembliesCopyParameterService = $injector.get('estimateAssembliesCopyParameterService');
					let paramsToSave = detailsParamListDataService.getList();

					if(paramsToSave && paramsToSave.length>0){
						item.detailsParamItems = paramsToSave;
						detailsParamDialogService.updateData(item).then(function(){ // todo: new service
							detailsParamListDataService.clear();
							estimateAssembliesCopyParameterService.copyParametersAndRefresh();
						});
					}else{
						estimateAssembliesCopyParameterService.copyParametersAndRefresh();
					}
					$modalInstance.close(result);
				},
				close : function () {
					detailsParamListDataService.clear();
					estimateAssembliesRuleUpdateService.clear();
					$modalInstance.dismiss('cancel');
				}
			};

			$scope.change = function change(item, model,row) {
				if(row.rid === 'assignedTo'){
					let assignedStructureId = item.selectedLevel;
					let itemsCache = detailsParamListDataService.getItemsTOCache();
					let paramsList = detailsParamListDataService.getList();
					_.forEach(paramsList,function(item){
						item.AssignedStructureId = assignedStructureId;
						item.SameCodeButNoConlict = false;
						estimateMainCommonFeaturesService.changeAssignedStructureId(item, itemsCache);
					});

					detailsParamListDataService.onUpdateList.fire(paramsList);
				}
			};

			$scope.formContainerOptions = {
				formOptions: {
					configure: detailsParamDialogConfigService.getFormConfig(),
					validationMethod: function(){return true;}
				}
			};

			$scope.currentItem = detailsParamDialogService.getCurrentItem();

			platformTranslateService.translateFormContainerOptions($scope.formContainerOptions);

			function changeUpdateStatus(isValid){
				$scope.okBtnDisabled = isValid;
			}


			function updateItem(item){
				angular.extend($scope.currentItem , item);
			}

			function updateData(data){
				detailsParamListDataService.setDataList(data.detailsParamItems);
				calculateParamValueFristLoad(data.detailsParamItems);
				updateItem(data);
			}

			function calculateParamValueFristLoad(paramItems){
				angular.forEach(paramItems, function(patamItem){

					if(patamItem.ValueType === estimateRuleParameterConstant.Text){
						patamItem.ParameterText = patamItem.ValueDetail;
					}if(patamItem.ValueType === estimateRuleParameterConstant.TextFormula){
						patamItem.ParameterText = patamItem.ValueText;
					}
				});
			}

			detailsParamDialogService.onCurrentItemChanged.register(updateData);
			detailsParamListDataService.onUpdateList.register(updateItem);
			detailsParamListDataService.onItemChange.register(updateItem);
			estimateAssembliesDetailsParamListValidationService.onCodeChange.register(changeUpdateStatus);

			$scope.$on('$destroy', function () {
				detailsParamDialogService.onCurrentItemChanged.unregister(updateData);
				detailsParamListDataService.onItemChange.unregister(updateItem);
				detailsParamListDataService.onUpdateList.unregister(updateItem);
				estimateAssembliesDetailsParamListValidationService.onCodeChange.unregister(changeUpdateStatus);
				$scope.currentItem = {};
			});
		}
	]);
})(angular);
