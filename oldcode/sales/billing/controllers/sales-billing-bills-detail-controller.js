/*
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingBillsDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of billing (header) entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesBillingBillsDetailController',
		['_', '$scope', '$injector', 'platformContainerControllerService', 'modelViewerStandardFilterService', 'salesBillingCharacteristicColumnService', 'basicsCharacteristicDataServiceFactory', 'platformFormConfigService', '$timeout', 'salesBillingService',
			function (_, $scope, $injector, platformContainerControllerService, modelViewerStandardFilterService, salesBillingCharacteristicColumnService, basicsCharacteristicDataServiceFactory, platformFormConfigService, $timeout, salesBillingService) {

				// functionality for characteristics dynamic configuration
				$scope.change = function(entity, field, column){
					salesBillingCharacteristicColumnService.fieldChange(entity, field, column);
				};
				var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(salesBillingService, 40);

				platformContainerControllerService.initController($scope, moduleName, 'E66E01DCB9D94AA889F0A8DE3A16A65A', 'salesBillingTranslations');

				// functionality for characteristics dynamic configuration
				salesBillingCharacteristicColumnService.registerSetConfigLayout(changeCharacRows);
				characteristicDataService.registerItemValueUpdate(onItemUpdate);
				characteristicDataService.registerItemDelete(onItemDelete);

				function changeCharacRows() {
					$scope.formOptions.configure = salesBillingCharacteristicColumnService.getStandardConfigForDetailView();
					if (_.isNil($scope.formOptions.configure.uuid)){
						$scope.formOptions.configure.uuid = 'e66e01dcb9d94aa889f0a8de3a16a65a';
					}
					platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);

					$timeout(function () {
						$scope.$broadcast('form-config-updated');
					});
				}
				function onItemUpdate(e, item) {
					characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function () {
						salesBillingCharacteristicColumnService.checkRow(item);
						$scope.formOptions.configure  = salesBillingCharacteristicColumnService.getStandardConfigForDetailView();
						if (_.isNil($scope.formOptions.configure.uuid)){
							$scope.formOptions.configure.uuid = 'e66e01dcb9d94aa889f0a8de3a16a65a';
						}
						platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
						$timeout(function () {
							$scope.$broadcast('form-config-updated');
						});
					});
				}
				function onItemDelete(e, items) {
					salesBillingCharacteristicColumnService.deleteRows(items);
					$scope.formOptions.configure  = salesBillingCharacteristicColumnService.getStandardConfigForDetailView();
					platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
					$timeout(function () {
						$scope.$broadcast('form-config-updated');
					});
				}

				$scope.formOptions.onPropertyChanged =  function onPropertyChanged(entity,field){
					var leadingService = $injector.get('salesBillingService');
					leadingService.cellChange(entity, field);
				};

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesBillingService');

				$scope.$on('$destroy', function () {
					characteristicDataService.unregisterItemDelete(onItemDelete);
					characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
					salesBillingCharacteristicColumnService.unregisterSetConfigLayout(changeCharacRows);
				});
			}]);
})();
