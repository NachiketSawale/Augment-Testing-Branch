/**
 * Created by zos on 8/31/2015.
 */
/* globals _ */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';
	var module = angular.module(moduleName);
	/**
	 * @ngdoc controller
	 * @name procurementPackageEstimateHeaderGridController
	 * @require $scope, platformGridControllerBase, $filter,  procurementPackageDataService, procurementPackageUIStandardService, slickGridEditors, lookupDataService, reqHeaderElementValidationService
	 * @description controller for requisition header
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	module.controller('procurementPackageEstimateHeaderGridController',
		['$scope', '$translate', 'platformGridControllerService', 'procurementPackageEstimateHeaderDataService', 'procurementPackageEstHeaderUIStandardService',
			'procurementPackageEstimateLineItemDataService', '$injector',
			function ($scope, $translate, gridControllerService, dataService, uiStandard,packageEstimateLineItemDataService, $injector) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, uiStandard, dataService, {}, gridConfig);
				let parentService = $injector.get('procurementPackageDataService');
				$injector.get('procurementCommonFilterJobVersionToolService').registerToolEvent($scope, dataService, parentService);

				if (_.isFunction(packageEstimateLineItemDataService.getDataByHeaderId)) {
					dataService.registerSelectionChanged(packageEstimateLineItemDataService.getDataByHeaderId);
				}
				if (_.isFunction(packageEstimateLineItemDataService.estimateHeaderContainerIfIsOpen)) {
					packageEstimateLineItemDataService.estimateHeaderContainerIfIsOpen(true);
				}

				$scope.$on('$destroy', function () {
					dataService.unregisterSelectionChanged(packageEstimateLineItemDataService.getDataByHeaderId);
					if (_.isFunction(packageEstimateLineItemDataService.estimateHeaderContainerIfIsOpen)) {
						packageEstimateLineItemDataService.estimateHeaderContainerIfIsOpen(false);
					}
				});
			}
		]);
})(angular);