(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonListController
	 * @requires $scope, platformGridControllerService
	 * @description
	 * #
	 * Controller for pricecomparison header grid container (leading grid container).
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementPriceComparisonListController', [
		'$scope', '$injector', 'platformGridControllerService', 'procurementPriceComparisonMainService', 'procurementPriceComparisonHeaderUIStandardService','basicsLookupdataSimpleLookupService', 'procurementPriceComparisonCommonService', 'procurementCommonNavigationService', 'procurementCommonClipboardService',
		function ($scope, $injector, platformGridControllerService, dataService, uiStandarService, basicsLookupdataSimpleLookupService, commonService, procurementCommonNavigationService, procurementCommonClipboardService) {

			var gridConfig = {
				initCalled: false,
				columns: [],
				parentProp: '',
				childProp: 'Children',
				type: 'procurement.pricecomparison',
				dragDropService: procurementCommonClipboardService
			};

			platformGridControllerService.initListController($scope, uiStandarService, dataService, {}, gridConfig);

			var removeItems = ['create', 'delete', 'createChild'];
			$scope.tools.items = _.filter($scope.tools.items, function (item) {
				return item && removeItems.indexOf(item.id) === -1;
			});

			procurementCommonNavigationService.createNavigationItem($scope, dataService);
			updateNavigationButton ();

			function selectionChangeed(e, entity) {
				if(!entity){
					return;
				}

				commonService.clearData();
				commonService.clearExchangeRate();
				commonService.finalBillingSchemaCache = [];

				dataService.evaluationModificationKeeper.clear();
			}
			function updateNavigationButton () {
				procurementCommonNavigationService.updateNavigationItem($scope, dataService);
			}

			dataService.registerSelectionChanged(selectionChangeed);
			dataService.registerSelectionChanged(updateNavigationButton);

			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(selectionChangeed);
				dataService.unregisterSelectionChanged(updateNavigationButton);
			});
		}
	]);
})(angular);