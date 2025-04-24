/**
 * Created by zwz on 01/06/2025.
 */
(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsBillingDataMaterialLookupController',
		['$scope', '$controller', 'PlatformMessenger', 'ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabMaterialService',
			function ($scope, $controller, PlatformMessenger, dialogTabMaterialService) {
				$scope.options = {dataView: {}};
				$scope.settings = {gridOptions: {multiSelect: true, disableCreateSimilarBtn: true}};

				Object.assign($scope.dialog.modalOptions, {
					scope: {options: {}},
					cancel: function () {
						$scope.$close({isOk: false});
					},
				});

				$scope.enableMultiSelection = true;
				$scope.onSelectedItemsChanged = new PlatformMessenger();
				$scope.onSelectedItemsChanged.register(function (e, args) {
					dialogTabMaterialService.setSelection(args.selectedItems);
				});
				$controller('basicsMaterialLookupController', {
					$scope: $scope
				});
			}]);

})(angular, window);