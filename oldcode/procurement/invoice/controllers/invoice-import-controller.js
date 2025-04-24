(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('procurementInvoiceImportGridController',
		['$scope', '$timeout', 'platformGridControllerService', 'procurementInvoiceImportResultService',
			'procurementInvoiceImportResultUIStandardService', 'platformToolbarService',
			function ($scope, $timeout, gridControllerService, dataService, gridColumns, platformToolbarService) {
				var gridConfig = {
					initCalled: false,
					columns: []
				};
				// todo:change gridColumns and dataService
				gridControllerService.initListController($scope, gridColumns, dataService, {}, gridConfig);

				var containeruuid = $scope.getContainerUUID();

				var toolItems = _.filter(platformToolbarService.getTools(containeruuid), function (item) {
					return item && item.id !== 'create' && item.id !== 'delete' && item.id !== 'createChild';
				});
				platformToolbarService.removeTools(containeruuid);
				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: toolItems
				});
			}
		]);
})(angular);