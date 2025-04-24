(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/**
	 * @ngdoc controller
	 * @name procurementQuoteHeaderGridController
	 * @requires $scope, platformGridControllerService, procurementQuoteHeaderDataService,procurementQuoteHeaderGridColumns,procurementQuoteHeaderValidationService
	 * @description Controller for the header grid container.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementQuoteHeaderGridController',
		['$scope', '$translate', '$injector', 'platformGridControllerService', 'procurementQuoteHeaderDataService',
			'procurementQuoteHeaderUIConfigurationService',
			'procurementQuoteHeaderValidationService',
			'procurementQuoteBillingSchemaDataService',
			'modelViewerStandardFilterService',
			'procurementCommonNavigationService',
			'platformGridAPI', '$timeout',
			'procurementCommonClipboardService',
			'procurementCommonCreateButtonBySystemOptionService',
			function ($scope, $translate, $injector, myInitService, dataService, columnsService, validationService, procurementQuoteBillingSchemaDataService,
				modelViewerStandardFilterService, procurementCommonNavigationService, platformGridAPI, $timeout, procurementCommonClipboardService,procurementCommonCreateButtonBySystemOptionService) {

				var gridContainerGuid = '338048ac80f748b3817ed1faea7c8aa5';
				var containerInfoService = $injector.get('procurementQuoteContainerInformationService');
				var gridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						var field = arg.grid.getColumns()[arg.cell].field;
						var item = arg.item;
						dataService.cellChange(item, field);
						// handel characterist
						var colService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 50, gridContainerGuid.toUpperCase(), containerInfoService);
						var column = arg.grid.getColumns()[arg.cell];
						colService.fieldChange(arg.item, field, column);
					},
					type: 'procurement.quote',
					dragDropService: procurementCommonClipboardService
				};

				myInitService.initListController($scope, columnsService, dataService, validationService(dataService), gridConfig);

				var toolItems = angular.copy($scope.tools.items);
				$scope.tools.items.splice(toolItems.length - 3, 0,
					{
						id: 'filterByRfQ',
						caption: $translate.instant('procurement.quote.toolbar.filterByRfQ'),
						disabled: function disabledFilterByRfQ() {
							var select = dataService.getSelected();
							return !select || angular.isUndefined(select.Id);
						},
						type: 'item',
						iconClass: 'tlb-icons ico-filter',
						// permission: {ebe726dbf2c5448f90b417bf2a30b4eb: 4},
						fn: dataService.filterByRfQ,
						permission: '#r'
					});

				procurementCommonNavigationService.createNavigationItem($scope, dataService);
				updateNavigationButton();

				procurementQuoteBillingSchemaDataService.registerBillingSchemaChangeEvent();
				procurementQuoteBillingSchemaDataService.registerParentEntityCreateEvent();

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'procurementQuoteHeaderDataService');

				// handle characterist
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 50, gridContainerGuid.toUpperCase(), containerInfoService);

				var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, 50);

				// dev-10043: fix general performance issue, should be after initListController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToGrid($scope, characterColumnService, characteristicDataService, dataService);

				function updateNavigationButton() {
					procurementCommonNavigationService.updateNavigationItem($scope, dataService);
				}

				dataService.registerSelectionChanged(updateNavigationButton);

				$scope.$on('$destroy', function () {

					dataService.unregisterSelectionChanged(updateNavigationButton);
				});
				procurementCommonCreateButtonBySystemOptionService.removeGridCreateButton($scope,['create']);
			}
		]);
})(angular);