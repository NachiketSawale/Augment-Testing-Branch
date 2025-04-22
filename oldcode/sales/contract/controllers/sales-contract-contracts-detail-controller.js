/*
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractContractsDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of contract (header) entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesContractContractsDetailController',
		['_', '$scope', '$injector', 'platformContainerControllerService', 'modelViewerStandardFilterService', 'salesContractCharacteristicColumnService', 'basicsCharacteristicDataServiceFactory', 'platformFormConfigService', '$timeout', 'salesContractService',
			function (_, $scope, $injector, platformContainerControllerService, modelViewerStandardFilterService, salesContractCharacteristicColumnService, basicsCharacteristicDataServiceFactory, platformFormConfigService, $timeout, salesContractService) {
				/* $scope.change = function (entity, field/!*, column*!/) {
					var leadingService = $injector.get('salesContractService');
					if (field === 'VatGroupFk' || field === 'TaxCodeFk' ){
						leadingService.cellChange(entity, field);
					}
				}; */

				// functionality for characteristics dynamic configuration
				$scope.change = function(entity, field, column){
					salesContractCharacteristicColumnService.fieldChange(entity, field, column);
				};
				var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(salesContractService, 40);

				platformContainerControllerService.initController($scope, moduleName, 'AC528547872E450584F6E1DD43922C64', 'salesContractTranslations');

				// functionality for characteristics dynamic configuration
				salesContractCharacteristicColumnService.registerSetConfigLayout(changeCharacRows);
				characteristicDataService.registerItemValueUpdate(onItemUpdate);
				characteristicDataService.registerItemDelete(onItemDelete);

				function changeCharacRows() {
					$scope.formOptions.configure = salesContractCharacteristicColumnService.getStandardConfigForDetailView();
					if (_.isNil($scope.formOptions.configure.uuid)){
						$scope.formOptions.configure.uuid = 'ac528547872e450584f6e1dd43922c64';
					}
					platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);

					$timeout(function () {
						$scope.$broadcast('form-config-updated');
					});
				}
				function onItemUpdate(e, item) {
					characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function () {
						salesContractCharacteristicColumnService.checkRow(item);
						$scope.formOptions.configure  = salesContractCharacteristicColumnService.getStandardConfigForDetailView();
						if (_.isNil($scope.formOptions.configure.uuid)){
							$scope.formOptions.configure.uuid = 'ac528547872e450584f6e1dd43922c64';
						}
						platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
						$timeout(function () {
							$scope.$broadcast('form-config-updated');
						});
					});
				}
				function onItemDelete(e, items) {
					salesContractCharacteristicColumnService.deleteRows(items);
					$scope.formOptions.configure  = salesContractCharacteristicColumnService.getStandardConfigForDetailView();
					platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
					$timeout(function () {
						$scope.$broadcast('form-config-updated');
					});
				}

				$scope.formOptions.onPropertyChanged =  function onPropertyChanged(entity,field){
					var leadingService = $injector.get('salesContractService');
					leadingService.markCurrentItemAsModified();
					leadingService.cellChange(entity, field);
				};

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesContractService');

				$scope.$on('$destroy', function () {
					characteristicDataService.unregisterItemDelete(onItemDelete);
					characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
					salesContractCharacteristicColumnService.unregisterSetConfigLayout(changeCharacRows);
				});
			}]);
})(angular);
