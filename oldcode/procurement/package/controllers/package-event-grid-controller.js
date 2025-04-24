/**
 * Created by wuj on 8/19/2015.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').controller('procurementPackageEventGridController',
		['$scope', 'platformGridControllerService','procurementPackageEventService',
			'procurementPackageEventUIStandardService',
			function ($scope, gridControllerService, procurementPackageEventService, gridColumns) {
				var gridConfig = {
					initCalled: false,
					columns: []
				};
				var loadRes =  procurementPackageEventService.loadControllerInitData();
				gridControllerService.initListController($scope, gridColumns, loadRes.dataService, loadRes.validationService, gridConfig);
				if(!loadRes.isPackageModule){
					_.remove($scope.tools.items, function (item) {
						return item.id === 'create' || item.id === 'delete';
					});
				}
			}
		]);
})(angular);