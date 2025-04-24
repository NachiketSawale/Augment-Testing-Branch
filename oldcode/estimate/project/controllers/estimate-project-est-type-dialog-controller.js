/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.project';
	/**
	 * @ngdoc controller
	 * @name estimateProjectEstTypeDialogController
	 * @function
	 *
	 * @description
	 * estimateProjectEstTypeDialogController for EstimateType selection dialog during Estimate Deep Copy.
	 **/

	angular.module(moduleName).controller('estimateProjectEstTypeDialogController',[
		'$scope', '$translate', '$modalInstance', '$injector', 'platformCreateUuid', 'platformFormConfigService', 'estimateProjectEstTypeDialogConfigService',
		'platformTranslateService','estimateProjectEstTypeDialogService', 'platformRuntimeDataService', 'estimateProjectEstTypeDialogService', 'basicsLookupdataLookupFilterService',

		function ($scope, $translate, $modalInstance, $injector, platformCreateUuid, platformFormConfigService, estPrjEstTypeDialogConfigService,
			platformTranslateService, estPrjEstTypeDialogService, platformRuntimeDataService, estimateProjectEstTypeDialogService, basicsLookupdataLookupFilterService) {

			let uniqId = platformCreateUuid();

			let estTypeFilter = {
				key: 'estimate-project-est-type-filter',
				serverSide: false,
				fn: function (item) {
					return item.IsLive && !item.Isgc;
				}
			};
			basicsLookupdataLookupFilterService.registerFilter(estTypeFilter);

			function getFormConfig(){
				return estPrjEstTypeDialogConfigService.getFormConfig(estimateProjectEstTypeDialogService.inExecutionPhase($scope.currentItem));
			}

			$scope.getContainerUUID = function () {
				return uniqId;
			};

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: $translate.instant('estimate.project.estimate'),
				ok : function (result) {
					let item = $scope.currentItem;
					estPrjEstTypeDialogService.deepCopy(item);
					$modalInstance.close(result);
				},
				close : function () {
					$modalInstance.dismiss('cancel');
				},
				cancel : function () {
					$scope.$close(false);
				},
			};

			$scope.change = function change(item, model) {
				if(model === 'IsCopyBudget') {
					if(item.IsCopyBudget){
						$scope.currentItem.IsCopyCostTotalToBudget = false;
					}
				}
				if(model === 'IsCopyCostTotalToBudget') {
					if(item.IsCopyCostTotalToBudget){
						$scope.currentItem.IsCopyBudget = false;
					}
				}
				if(model === 'newEstType'){
					if(!estimateProjectEstTypeDialogService.inExecutionPhase(item)){
						$scope.currentItem.clearAqQuantityOfOptionalWithIT = false;
						$scope.currentItem.clearAqQuantityOfOptionalWithoutIT = false;
					}else{
						$scope.currentItem.clearAqQuantityOfOptionalWithIT = true;
						$scope.currentItem.clearAqQuantityOfOptionalWithoutIT = true;
					}
					$scope.refreshForm();
				}
			};

			$scope.currentItem = estPrjEstTypeDialogService.getCurrentItem();

			if(estimateProjectEstTypeDialogService.inExecutionPhase($scope.currentItem)){
				$scope.currentItem.clearAqQuantityOfOptionalWithIT = true;
				$scope.currentItem.clearAqQuantityOfOptionalWithoutIT = true;
			}

			$scope.formContainerOptions = {
				formOptions: {
					configure: getFormConfig(),
					validationMethod: function(){return true;}
				},
			};

			$scope.refreshForm = function(){
				$scope.formContainerOptions.formOptions.configure = getFormConfig();
				platformFormConfigService.initialize($scope.formContainerOptions.formOptions, $scope.formContainerOptions.formOptions.configure);
				$scope.$broadcast('form-config-updated', {});
			};

			platformTranslateService.registerModule('cloud.desktop');
			// loads or updates translated strings
			let loadTranslations = function () {
				// load translation ids and convert result to object
				platformTranslateService.translateObject($scope.formContainerOptions, ['text','header','label']);
			};

			// register a module - translation table will be reloaded if module isn't available yet
			if (!platformTranslateService.registerModule('cloud.desktop')) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
			}

			platformRuntimeDataService.readonly($scope.currentItem, [{field: 'actualEstType', readonly: true}]);

			$scope.$on('$destroy', function () {
				$scope.currentItem = {};
				basicsLookupdataLookupFilterService.unregisterFilter(estTypeFilter);
			});
		}
	]);
})(angular);
