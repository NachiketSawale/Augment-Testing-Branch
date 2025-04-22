/*
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesWipWipsDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of wip (header) entities.
	 **/
	angular.module(moduleName).controller('salesWipWipsDetailController',
		['_', '$scope','$injector', 'platformContainerControllerService', 'modelViewerStandardFilterService', 'salesWipCharacteristicColumnService', 'basicsCharacteristicDataServiceFactory', 'platformFormConfigService', '$timeout', 'salesWipService',
			function (_, $scope,$injector, platformContainerControllerService, modelViewerStandardFilterService, salesWipCharacteristicColumnService, basicsCharacteristicDataServiceFactory, platformFormConfigService, $timeout, salesWipService) {
				/* $scope.change = function(entity, field/!*, column*!/){
					var leadingService = $injector.get('salesWipService');
					if (field === 'VatGroupFk' || field === 'TaxCodeFk') {
						leadingService.cellChange(entity, field);
					}
				}; */

				// functionality for characteristics dynamic configuration
				$scope.change = function(entity, field, column){
					salesWipCharacteristicColumnService.fieldChange(entity, field, column);
				};
				var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(salesWipService, 40);

				platformContainerControllerService.initController($scope, moduleName, 'D7BFA7174FC14AB49ACEF0C6F6B6678B', 'salesWipTranslations');

				// functionality for characteristics dynamic configuration
				salesWipCharacteristicColumnService.registerSetConfigLayout(changeCharacRows);
				characteristicDataService.registerItemValueUpdate(onItemUpdate);
				characteristicDataService.registerItemDelete(onItemDelete);

				function changeCharacRows() {
					$scope.formOptions.configure = salesWipCharacteristicColumnService.getStandardConfigForDetailView();
					if (_.isNil($scope.formOptions.configure.uuid)){
						$scope.formOptions.configure.uuid = 'd7bfa7174fc14ab49acef0c6f6b6678b';
					}
					platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);

					$timeout(function () {
						$scope.$broadcast('form-config-updated');
					});
				}
				function onItemUpdate(e, item) {
					characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function () {
						salesWipCharacteristicColumnService.checkRow(item);
						$scope.formOptions.configure  = salesWipCharacteristicColumnService.getStandardConfigForDetailView();
						if (_.isNil($scope.formOptions.configure.uuid)){
							$scope.formOptions.configure.uuid = 'd7bfa7174fc14ab49acef0c6f6b6678b';
						}
						platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
						$timeout(function () {
							$scope.$broadcast('form-config-updated');
						});
					});
				}
				function onItemDelete(e, items) {
					salesWipCharacteristicColumnService.deleteRows(items);
					$scope.formOptions.configure  = salesWipCharacteristicColumnService.getStandardConfigForDetailView();
					platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
					$timeout(function () {
						$scope.$broadcast('form-config-updated');
					});
				}

				$scope.formOptions.onPropertyChanged =  function onPropertyChanged(entity,field){
					var leadingService = $injector.get('salesWipService');
					leadingService.cellChange(entity, field);
				};

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesWipService');

				$scope.$on('$destroy', function () {
					characteristicDataService.unregisterItemDelete(onItemDelete);
					characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
					salesWipCharacteristicColumnService.unregisterSetConfigLayout(changeCharacRows);
				});
			}]);
})(angular);
