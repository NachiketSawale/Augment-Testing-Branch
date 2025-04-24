(function (angular) {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainHeaderGridController',

		['$injector', '$scope', 'platformGridControllerService', 'businesspartnerMainHeaderDataService', 'businessPartnerMainBusinessPartnerUIStandardService',
			'businesspartnerMainHeaderValidationService', 'platformGridAPI', '$timeout','basicsLookupdataLookupDescriptorService', '_', 'basicsCommonInquiryHelperService',
			'businessPartnerMainClipboardService',
			/* jshint -W072 */ // many parameters because of dependency injection

			function ($injector, $scope, platformGridControllerService, businesspartnerMainHeaderDataService, businessPartnerMainBusinessPartnerUIStandardService,
				businesspartnerMainHeaderValidationService, platformGridAPI, $timeout,basicsLookupdataLookupDescriptorService, _, basicsCommonInquiryHelperService,
				businessPartnerMainClipboardService) {
				basicsLookupdataLookupDescriptorService.loadData('BusinessPartnerStatus');
				basicsLookupdataLookupDescriptorService.loadData('BusinessPartnerStatus2');
				let gridContainerGuid = '75dcd826c28746bf9b8bbbf80a1168e8';
				let containerInfoService = $injector.get('businesspartnerMainContainerInformationService');
				let myGridConfig =
					{
						initCalled: false,
						columns: [],
						cellChangeCallBack: function (arg) {
							let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(businesspartnerMainHeaderDataService, 56, gridContainerGuid, containerInfoService);
							if (characterColumnService) {
								let column = arg.grid.getColumns()[arg.cell];
								let field = arg.grid.getColumns()[arg.cell].field;
								characterColumnService.fieldChange(arg.item, field, column);
							}
						},
						type: 'businesspartner.main',
						dragDropService: businessPartnerMainClipboardService
					};

				let validator = businesspartnerMainHeaderValidationService;
				if (!businesspartnerMainHeaderDataService.originalValidationService) {
					businesspartnerMainHeaderDataService.originalValidationService = angular.copy(businesspartnerMainHeaderValidationService);
				}
				platformGridControllerService.initListController($scope, businessPartnerMainBusinessPartnerUIStandardService, businesspartnerMainHeaderDataService, validator, myGridConfig);

				businesspartnerMainHeaderDataService.fillReadonlyModels(businessPartnerMainBusinessPartnerUIStandardService.getStandardConfigForListView());

				basicsCommonInquiryHelperService.activateProvider($scope, true);

				let unregisterWatch = $scope.$watchCollection(function () {  // if the allUniqueColumns change, update the unique columns
					return businesspartnerMainHeaderDataService.allUniqueColumns;
				}, function (newConfig, oldConfig) {

					if (newConfig !== oldConfig || businesspartnerMainHeaderDataService.allOldUniqueColumns !== newConfig) {
						let allOldUniqueColumns = newConfig !== oldConfig ? oldConfig : businesspartnerMainHeaderDataService.allOldUniqueColumns;
						if (allOldUniqueColumns?.length) {  // delete the old configuration
							let differenceColumns = _.difference(allOldUniqueColumns, newConfig);
							if (differenceColumns?.length) {
								businesspartnerMainHeaderValidationService = businesspartnerMainHeaderDataService.originalValidationService;
								let gridColumns = businessPartnerMainBusinessPartnerUIStandardService.getStandardConfigForListView().columns;
								businesspartnerMainHeaderDataService.setUniqueColumns(gridColumns, null, differenceColumns, true, true, $scope.gridId);
								if (businesspartnerMainHeaderDataService.allOldUniqueColumns !== newConfig) {
									let formColumns = businessPartnerMainBusinessPartnerUIStandardService.getStandardConfigForDetailView().rows;
									businesspartnerMainHeaderDataService.setUniqueColumns(null, formColumns, differenceColumns, false, true, null);
								}
							}
						}
						businesspartnerMainHeaderDataService.allOldUniqueColumns = newConfig;
						if (newConfig?.length) {    // update the new configuration
							businesspartnerMainHeaderDataService.setUniqueColumns(null, null, newConfig, true, null, $scope.gridId);
						}
					}
				});

				// handle characterist
				let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(businesspartnerMainHeaderDataService, 56, gridContainerGuid, containerInfoService);

				let characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(businesspartnerMainHeaderDataService, 56);
				characteristicDataService.registerItemValueUpdate(onItemUpdate);

				function onItemUpdate(e, item) {
					characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function (data) {
						if (item.CharacteristicEntity === null) {
							item.CharacteristicEntity = data;
						}
						characterColumnService.checkColumn(item);
					});
				}

				characteristicDataService.registerItemDelete(onItemDelete);

				function onItemDelete(e, items) {
					characterColumnService.deleteColumns(items);
				}

				platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);

				function onActiveCellChanged(e, arg) {
					let column = arg.grid.getColumns()[arg.cell];
					if (column) {
						let characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
						let isCharacteristic = characterColumnService.isCharacteristicColumn(column);
						if (isCharacteristic) {
							let lineItem = businesspartnerMainHeaderDataService.getSelected();
							if (lineItem !== null) {
								let col = column.field;
								let colArray = _.split(col, '_');
								if (colArray && colArray.length > 1) {
									let characteristicType = colArray[_.lastIndexOf(colArray) - 2];
									let value = parseInt(characteristicType);
									let isLookup = characteristicTypeService.isLookupType(value);
									let updateColumn = isLookup ? col : undefined;
									businesspartnerMainHeaderDataService.setCharacteristicColumn(updateColumn);
								}
							}
						}
					}
				}

				$timeout(function () {
					characterColumnService.refresh();
				});
				businesspartnerMainHeaderDataService.registerSelectionChanged(businesspartnerMainHeaderDataService.fillReadonlyModels);
				$scope.$on('$destroy', function () {
					businesspartnerMainHeaderDataService.unregisterSelectionChanged(businesspartnerMainHeaderDataService.fillReadonlyModels);
					unregisterWatch();
					characteristicDataService.unregisterItemDelete(onItemDelete);
					characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
				});

			}]);
})(angular);