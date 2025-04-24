/**
 * Created by zov on 7/17/2019.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('ppsItemCreationDialogController', ppsItemCreationDialogController);
	ppsItemCreationDialogController.$inject = ['$scope', 'params', 'ppsItemCreationDialogService', 'basicsLookupdataLookupFilterService',
	'$translate'];
	function ppsItemCreationDialogController($scope, params, ppsItemCreationDialogService, basicsLookupdataLookupFilterService,
											 $translate) {

		$scope.customBtn1 = $scope.customBtn2 = false;
		$scope.showOkButton = $scope.showCancelButton = true;

		$scope.modalOptions = {
			isDisabled: function (button) {
				return ppsItemCreationDialogService.isDisabled(button, $scope.dataItem);
			}
		};
		$scope.onOK = function () {
			ppsItemCreationDialogService.handleOK($scope.dataItem).then(function (result) {
				if (result && result !== false) {
					$scope.$close(result);
				}
			});
		};
		$scope.onCancel = function () {
			$scope.$close(false);
		};

		$scope.formContainerOptions = {
			formOptions: {
				configure: ppsItemCreationDialogService.getFromCfg4CreateItem()
			},
			setTools: function () {
			}
		};

		$scope.alerts = ppsItemCreationDialogService.getAlerts();

		ppsItemCreationDialogService.setBusyCallback = function (busy) {
			$scope.isBusy = busy;
		};

		ppsItemCreationDialogService.init(params.serviceContainer, params.isCreatingChild, params.isSimpleModel, $scope);
		ppsItemCreationDialogService.getNewPpsItem(params.creationData, params.itemInitializer).then(function (newItem) {
			newItem.parent = params.creationData.parent;
			$scope.dataItem = newItem;
		});

		var filters = [{
			key: ppsItemCreationDialogService.getStatusLookupFilterKey(),
			fn: function (item) {
				return ppsItemCreationDialogService.filterStatus(item);
			}
		}];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		//adjust latest template
		_.extend($scope.modalOptions, {
			headerText: $translate.instant(params.title) || $translate.instant('productionplanning.item.createItemTitle'),
			cancel: $scope.onCancel
		});

		$scope.$on('$destroy', function () {
			ppsItemCreationDialogService.removeValidationError($scope.dataItem);
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		});
	}
})();