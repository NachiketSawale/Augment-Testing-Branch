/*
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc controller
	 * @name salesBidBidsDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of bid (header) entities.
	 **/
	angular.module(moduleName).controller('salesBidBidsDetailController',
		['_', '$scope', '$injector', 'platformContainerControllerService', 'modelViewerStandardFilterService', 'salesBidCharacteristicColumnService', 'basicsCharacteristicDataServiceFactory', 'platformFormConfigService', '$timeout', 'salesBidService',
			function (_, $scope, $injector, platformContainerControllerService, modelViewerStandardFilterService, salesBidCharacteristicColumnService, basicsCharacteristicDataServiceFactory, platformFormConfigService, $timeout, salesBidService) {

				// functionality for characteristics dynamic configuration
				$scope.change = function(entity, field, column){
					salesBidCharacteristicColumnService.fieldChange(entity, field, column);
				};
				var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(salesBidService, 40);

				/* $scope.change = function (entity, field/!*, column*!/) {
					var leadingService = $injector.get('salesBidService');
					if (field === 'VatGroupFk' || field === 'TaxCodeFk') {
						leadingService.cellChange(entity, field);
					}
				}; */
				platformContainerControllerService.initController($scope, moduleName, '1918073BF2664785B1B9223C6E443D6D', 'salesBidTranslations');

				// functionality for characteristics dynamic configuration
				salesBidCharacteristicColumnService.registerSetConfigLayout(changeCharacRows);
				characteristicDataService.registerItemValueUpdate(onItemUpdate);
				characteristicDataService.registerItemDelete(onItemDelete);

				function changeCharacRows() {
					$scope.formOptions.configure = salesBidCharacteristicColumnService.getStandardConfigForDetailView();
					if (_.isNil($scope.formOptions.configure.uuid)){
						$scope.formOptions.configure.uuid = '1918073bf2664785b1b9223c6e443d6d';
					}
					platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);

					$timeout(function () {
						$scope.$broadcast('form-config-updated');
					});
				}
				function onItemUpdate(e, item) {
					characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function () {
						salesBidCharacteristicColumnService.checkRow(item);
						$scope.formOptions.configure  = salesBidCharacteristicColumnService.getStandardConfigForDetailView();
						if (_.isNil($scope.formOptions.configure.uuid)){
							$scope.formOptions.configure.uuid = '1918073bf2664785b1b9223c6e443d6d';
						}
						platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
						$timeout(function () {
							$scope.$broadcast('form-config-updated');
						});
					});
				}
				function onItemDelete(e, items) {
					salesBidCharacteristicColumnService.deleteRows(items);
					$scope.formOptions.configure  = salesBidCharacteristicColumnService.getStandardConfigForDetailView();
					platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
					$timeout(function () {
						$scope.$broadcast('form-config-updated');
					});
				}

				$scope.formOptions.onPropertyChanged =  function onPropertyChanged(entity,field){
					var leadingService = $injector.get('salesBidService');
					leadingService.cellChange(entity, field);
				};

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesBidService');

				$scope.$on('$destroy', function () {
					characteristicDataService.unregisterItemDelete(onItemDelete);
					characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
					salesBidCharacteristicColumnService.unregisterSetConfigLayout(changeCharacRows);
				});
			}]);
})(angular);
