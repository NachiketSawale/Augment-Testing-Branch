/**
 * Created by lcn on 11/16/2021.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').controller('procurementPackage2ExtBidderGridController',
		['$scope', 'platformGridControllerService','procurementPackage2ExtBidderService',
			'procurementPackage2ExtBidderUIStandardService',
			function ($scope, gridControllerService, service, gridColumns) {
				var gridConfig = {
					initCalled: false,
					columns: []
				};
				var loadRes =  service.loadControllerInitData();
				gridControllerService.initListController($scope, gridColumns, loadRes.dataService, loadRes.validationService, gridConfig);
			}
		]);
})(angular);