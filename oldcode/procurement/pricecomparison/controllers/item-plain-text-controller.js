/**
 * Created by ada on 2018/3/20.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonItemPlainTextService
	 * @requires $scope, platformGridControllerService
	 * @description
	 * Controller for pricecomparison header grid container (leading grid container).
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementPriceComparisonItemPlainTextController', [
		'$scope', '$http', '$timeout', 'platformGridControllerService', 'procurementCommonItemTextUIStandardService',
		'procurementCommonHeaderTextValidationService', 'procurementPriceComparisonItemPlainTextService',
		function ($scope, $http, $timeout, platformGridControllerService, uiStandarService,
			validationService, dataService) {

			var gridConfig = {initCalled: false, columns: []};
			validationService = validationService(dataService);
			platformGridControllerService.initListController($scope, uiStandarService, dataService, validationService, gridConfig);

			$scope.currentItem = dataService.getSelected();
			var selectedChanged = function selectedChanged(e, item) {
				if (item === null || item === undefined) {
					$scope.currentItem = {ContentString: '', PlainText: ''};
					$scope.$root.safeApply();
					return;
				}
				$scope.currentItem = item;
				if (!item || !item.Id) {
					$scope.currentItem =
						{
							ContentString: '',
							PlainText: ''
						};
				}
				$scope.$root.safeApply();
			};
			selectedChanged(null, $scope.currentItem);
			$scope.onChange = function onPropertyChanged() {
				dataService.markCurrentItemAsModified();
			};
			dataService.registerLookupFilter();
			dataService.registerSelectionChanged(selectedChanged);
			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(selectedChanged);
				dataService.unregisterLookupFilter();
			});
		}
	]);
})(angular);