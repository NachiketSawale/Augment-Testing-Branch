/**
 * Created by lav on 10/26/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc controller
	 * @name transportplanningTransportMaterialLookupController
	 * @requires $scope,$controller
	 * @description
	 * #
	 * Controller for the material search view
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('transportplanningTransportMaterialLookupController',
		['$scope', '$controller', 'PlatformMessenger', 'transportplanningTransportCreateTransportRouteDialogMaterialService',
			function ($scope, $controller, PlatformMessenger, transportplanningTransportCreateTransportRouteDialogMaterialService) {
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
					transportplanningTransportCreateTransportRouteDialogMaterialService.setSelection(args.selectedItems);
				});
				$controller('basicsMaterialLookupController', {
					$scope: $scope
				});
			}]);

})(angular, window);