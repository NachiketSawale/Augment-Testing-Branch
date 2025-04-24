(function (angular) {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainHeaderFormController',
		['$scope', 'platformDetailControllerService', 'platformTranslateService', 'businessPartnerMainBusinessPartnerUIStandardService', 'businesspartnerMainHeaderDataService', 'businesspartnerMainHeaderValidationService',
			'$injector', 'platformFormConfigService', '$timeout','_',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformDetailControllerService, platformTranslateService, businessPartnerMainBusinessPartnerUIStandardService, businesspartnerMainHeaderDataService, businesspartnerMainHeaderValidationService,
				$injector, platformFormConfigService, $timeout,_) {
				let validator = businesspartnerMainHeaderValidationService;
				if (!businesspartnerMainHeaderDataService.originalValidationService) {
					businesspartnerMainHeaderDataService.originalValidationService = angular.copy(businesspartnerMainHeaderValidationService);  // save the original validation service
				}
				let translateService = {
					translateFormConfig: function translateFormConfig(formConfig) {
						platformTranslateService.translateFormConfig(formConfig);
					}
				};
				let gridContainerGuid = '75dcd826c28746bf9b8bbbf80a1168e8';
				let containerInfoService = $injector.get('businesspartnerMainContainerInformationService');
				platformDetailControllerService.initDetailController(
					$scope,
					businesspartnerMainHeaderDataService,
					validator,
					businessPartnerMainBusinessPartnerUIStandardService,
					translateService
				);

				businesspartnerMainHeaderDataService.fillReadonlyModels($scope.formOptions.configure);

				let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(businesspartnerMainHeaderDataService, 56, gridContainerGuid, containerInfoService);
				let characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(businesspartnerMainHeaderDataService, 56);
				$scope.change = function (entity, field, column) {
					characterColumnService.fieldChange(entity, field, column);
				};

				function changeCharacRows() {
					$scope.formOptions.configure = characterColumnService.getStandardConfigForDetailView();
					if (_.isNil($scope.formOptions.configure.uuid)) {
						$scope.formOptions.configure.uuid = '411d27cfbb0b4643a368b19fa95d1b40';
					}
					platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);

					$timeout(function () {
						$scope.$broadcast('form-config-updated');
					});

				}

				characterColumnService.registerSetConfigLayout(changeCharacRows);
				characteristicDataService.registerItemValueUpdate(onItemUpdate);

				function onItemUpdate(e, item) {
					characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function () {
						characterColumnService.checkRow(item);
						$scope.formOptions.configure = characterColumnService.getStandardConfigForDetailView();
						if (_.isNil($scope.formOptions.configure.uuid)) {
							$scope.formOptions.configure.uuid = '411d27cfbb0b4643a368b19fa95d1b40';
						}
						platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
						$timeout(function () {
							$scope.$broadcast('form-config-updated');
						});
					});
				}

				characteristicDataService.registerItemDelete(onItemDelete);

				function onItemDelete(e, items) {
					characterColumnService.deleteRows(items);
					$scope.formOptions.configure = characterColumnService.getStandardConfigForDetailView();
					platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
					$timeout(function () {
						$scope.$broadcast('form-config-updated');
					});
				}

				let unregisterWatch = $scope.$watchCollection(function () {  // if the allUniqueColumns change, update the unique columns
					return businesspartnerMainHeaderDataService.allUniqueColumns;
				}, function (newConfig, oldConfig) {

					if (newConfig !== oldConfig || businesspartnerMainHeaderDataService.allOldUniqueColumns !== newConfig) {

						let formColumns = businessPartnerMainBusinessPartnerUIStandardService.getStandardConfigForDetailView().rows;
						let allOldUniqueColumns = newConfig !== oldConfig ? oldConfig : businesspartnerMainHeaderDataService.allOldUniqueColumns;
						if (allOldUniqueColumns?.length) {  // delete the old configuration
							let differenceColumns = _.difference(allOldUniqueColumns, newConfig);
							if (differenceColumns?.length) {
								businesspartnerMainHeaderValidationService = businesspartnerMainHeaderDataService.originalValidationService;
								businesspartnerMainHeaderDataService.setUniqueColumns(null, formColumns, differenceColumns, false, true, null);
								if (businesspartnerMainHeaderDataService.allOldUniqueColumns !== newConfig) {
									let gridColumns = businessPartnerMainBusinessPartnerUIStandardService.getStandardConfigForListView().columns;
									businesspartnerMainHeaderDataService.setUniqueColumns(gridColumns, null, differenceColumns, true, true, null);
								}
							}
						}
						businesspartnerMainHeaderDataService.allOldUniqueColumns = newConfig;
						if (newConfig?.length) {     // update the new configuration
							businesspartnerMainHeaderDataService.setUniqueColumns(null, formColumns, newConfig, false, null, null);
							$scope.$broadcast('form-config-updated');
						}
					}
				});

				$scope.$on('$destroy', function () {
					businesspartnerMainHeaderDataService.unregisterSelectionChanged(businesspartnerMainHeaderDataService.fillReadonlyModels);
					characteristicDataService.unregisterItemDelete(onItemDelete);
					characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
					characterColumnService.unregisterSetConfigLayout(changeCharacRows);
					unregisterWatch();
				});
			}]);
})(angular);