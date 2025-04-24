/**
 * Created by zos on 3/14/2018.
 */
(function (angular) {
	/* global _ */ 
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc controller
	 * @name boqMainDetailsParamDialogController
	 * @function
	 *
	 * @description
	 * boqMainDetailsParamDialogController for detail formula parameters items display dialog.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('boqMainDetailsParamDialogController', [
		'$scope', '$translate', '$modalInstance', '$injector', 'platformCreateUuid', 'boqMainDetailsParamDialogConfigService',
		'boqMainDetailsParamDialogService', 'boqMainService', 'boqMainDetailsParamListDataService', 'platformTranslateService',
		'boqMainDetailsParamListValidationService', 'boqRuleComplexLookupService', 'estimateParamUpdateService', 'estimateRuleParameterConstant', 'estimateMainCommonFeaturesService',

		function ($scope, $translate, $modalInstance, $injector, platformCreateUuid, detailsParamDialogConfigService, detailsParamDialogService,
			boqMainService, detailsParamListDataService, platformTranslateService, boqMainDetailsParamListValidationService,
			boqRuleComplexLookupService, estimateParamUpdateService, estimateRuleParameterConstant, estimateMainCommonFeaturesService) {

			var uniqId = platformCreateUuid();

			$scope.getContainerUUID = function () {
				return uniqId;
			};

			var isNavFromBoqWic = $injector.get('boqRuleComplexLookupService').isNavFromBoqWic();
			var estimateMainParamStructureConstant = $injector.get('estimateMainParamStructureConstant');

			$scope.currentItem = detailsParamDialogService.getCurrentItem();
			var isFormula = detailsParamDialogService.getIsFormula();

			// var isFormula = ($scope.currentItem && $scope.currentItem.detailsParamItems && $scope.currentItem.detailsParamItems.length>0)? $scope.currentItem.detailsParamItems[0].isFormulaFromBoq : false;
			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: boqRuleComplexLookupService.isNavFromBoqProject ? $translate.instant('boq.main.projectBoq') : $translate.instant('boq.main.wicBoq'),
				ok: function (result) {
					var item = $scope.currentItem;
					var sourceBoqItemService = detailsParamDialogService.getSourceBoqItemService();
					sourceBoqItemService.setDetailsParamReminder(item.doRememberSelect ? item.selectedLevel : '');

					/* ;var oldDetailsParamItems = detailsParamDialogService.getOldDetailsParam();
				 _.forEach(oldDetailsParamItems, function(param){
					  var newDetailsParamItem = _.find(item.detailsParamItems,{Id: param.Id});
					  newDetailsParamItem.Version = param.Version;

					  //this param is created from the rule or prjRule's parameter
					  if(newDetailsParamItem.Version === 0 || newDetailsParamItem.Version === -1 ){
							detailsParamListDataService.setItemTOSave(newDetailsParamItem);
					  }
					  //modified existed boqItemParam
					  else if(
							newDetailsParamItem.Code !== param.Code ||
							newDetailsParamItem.DescriptionInfo.Translated !== param.DescriptionInfo.Translated ||
							newDetailsParamItem.EstParameterGroupFk !== param.EstParameterGroupFk ||
							newDetailsParamItem.ValueDetail !== param.ValueDetail ||
							newDetailsParamItem.ParameterValue !== param.ParameterValue ||
							newDetailsParamItem.UomFk !== param.UomFk ||
							newDetailsParamItem.DefaultValue !== param.DefaultValue ||
							newDetailsParamItem.ValueType !== param.ValueType ||
							newDetailsParamItem.IsLookup !== param.IsLookup )
					  {
							if(newDetailsParamItem.DescriptionInfo.Translated !== param.DescriptionInfo.Translated){
								 //newDetailsParamItem.DescriptionInfo.DescriptionModified = true;
								 newDetailsParamItem.DescriptionInfo.Modified = true;
							}

							detailsParamListDataService.setItemTOSave(newDetailsParamItem);
					  }
				 }); */

					var paramsToSave = detailsParamListDataService.getList();
					if (paramsToSave && paramsToSave.length > 0) {
						item.detailsParamItems = paramsToSave;
						item.isFormula = isFormula;

						if (boqRuleComplexLookupService.isNavFromBoqWic() && isFormula) {
							_.forEach(item.detailsParamItems, function (param) {
								param.AssignedStructureId = estimateMainParamStructureConstant.BasicCusizmeParam;  // if from detail parameter ,the parameter need save into customzation parameter
							});
						}

						detailsParamDialogService.updateData(item).then(
							function () {
								var BoqParamToSave = {BoqParamToSave: item.detailsParamItems};
								$injector.get('estimateParameterFormatterService').handleUpdateDone(BoqParamToSave);
								sourceBoqItemService.gridRefresh();
								detailsParamListDataService.clear();
							}
						);
					}
					$modalInstance.close(result);
				},
				close: function () {
					detailsParamListDataService.clear();
					estimateParamUpdateService.clear();
					$modalInstance.dismiss('cancel');
				}
			};

			$scope.formContainerOptions = {
				formOptions: {
					configure: detailsParamDialogConfigService.getFormConfig(isNavFromBoqWic, isFormula),
					validationMethod: function () {
						return true;
					}
				}
			};

			$scope.change = function change(item, model, row) {
				if (row.rid === 'assignedTo') {
					var assignedStructureId = item.selectedLevel;

					var itemsCache = detailsParamListDataService.getItemsTOCache();

					var paramsList = detailsParamListDataService.getList();
					_.forEach(paramsList, function (item) {
						item.AssignedStructureId = assignedStructureId;
						item.SameCodeButNoConlict = false;
						estimateMainCommonFeaturesService.changeAssignedStructureId(item, itemsCache);
					});

					detailsParamListDataService.setDataList(paramsList);
					detailsParamListDataService.gridRefresh();  // apply the validation result ,dont delete the code
				}
			};

			platformTranslateService.translateFormContainerOptions($scope.formContainerOptions);

			function updateItem(item) {
				angular.extend($scope.currentItem, item);
			}

			function updateData(data) {
				calculateParamValueFristLoad(data.detailsParamItems);
				detailsParamListDataService.setDataList(data.detailsParamItems);
				updateItem(data);
			}

			function calculateParamValueFristLoad(paramItems) {
				angular.forEach(paramItems, function (patamItem) {
					if (patamItem.ValueType === estimateRuleParameterConstant.Text) {
						patamItem.ParameterText = patamItem.ValueDetail;
					} else if (patamItem.ValueType === estimateRuleParameterConstant.TextFormula) {
						patamItem.ParameterText = patamItem.ValueText;
					}
					// TO DO:
					// else{
					// $injector.get('estimateRuleCommonService').calculateDetails(patamItem, 'DefaultValue', 'ParameterValue', detailsParamListDataService);
					// }
				});
			}

			function changeUpdateStatus(isValid) {
				$scope.okBtnDisabled = isValid;
			}

			detailsParamDialogService.onCurrentItemChanged.register(updateData);
			detailsParamListDataService.onUpdateList.register(updateItem);
			detailsParamListDataService.onItemChange.register(updateItem);
			boqMainDetailsParamListValidationService.onCodeChange.register(changeUpdateStatus);

			$scope.$on('$destroy', function () {
				detailsParamDialogService.onCurrentItemChanged.unregister(updateData);
				detailsParamListDataService.onItemChange.unregister(updateItem);
				detailsParamListDataService.onUpdateList.unregister(updateItem);
				boqMainDetailsParamListValidationService.onCodeChange.unregister(changeUpdateStatus);
				$scope.currentItem = {};
			});
		}
	]);
})(angular);