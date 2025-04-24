(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular ,_ */
	/**
	 * @ngdoc controller
	 * @name procurementInvoicePesGridController
	 * @require $scope
	 * @description controller for Invoice Pes grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('procurementInvoicePesGridController',
		['$scope', 'procurementInvoiceGridControllerService', 'procurementInvoicePESDataService', 'procurementInvoicePESValidationService', 'procurementInvoicePESUIStandardService',
			'modelViewerStandardFilterService', 'basicsWorkflowSidebarRegisterService', '$injector',

			function ($scope, gridControllerService, dataService, validationService, UIStandardService,
				modelViewerStandardFilterService, basicsWorkflowSidebarRegisterService, $injector) {

				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, UIStandardService, dataService, validationService, gridConfig);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService.getServiceName());

				// To Register PES EntityFacade For Invoice Module
				basicsWorkflowSidebarRegisterService.registerEntityForModule('AD5C111BC7EA45D0BF12A6F716275A1B', 'procurement.invoice', false,
					function getSelectedPESId() {
						let invoicePESDataService = $injector.get('procurementInvoicePESDataService');
						let selPESEntity = invoicePESDataService.getSelected();
						if (selPESEntity) {
							return selPESEntity.Id;
						}
						return undefined;
					}, function getPESIdList() {
						let invoicePESDataService = $injector.get('procurementInvoicePESDataService');
						let items = invoicePESDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (PESEntity) {
							return PESEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);
			}]);
})(angular);