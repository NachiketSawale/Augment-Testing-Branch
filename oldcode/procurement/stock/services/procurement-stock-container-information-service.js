// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.stock';

	/**
	 * @ngdoc service
	 * @name procurementStockContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('procurementStockContainerInformationService', ['$injector', 'procurementStockUIStandardService',
		'procurementStockReconciliation2GridColumns', 'procurementStockStockTotalReconciliation2GridColumns', 'procurementStockStockTotalUIStandardService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector, procurementStockUIStandardService, procurementStockReconciliation2GridColumns,
			procurementStockStockTotalReconciliation2GridColumns, procurementStockStockTotalUIStandardService) {

			var service = {};

			// noinspection JSUnusedLocalSymbols
			// eslint-disable-next-line no-unused-vars
			var leadingService = $injector.get('procurementStockHeaderDataService'); // jshint ignore:line
			/* jshint -W074 */
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '10119ef5d56d4591ba1f44a8b3c279b4':// procurementInvoiceHeaderGridController
						config.layout = procurementStockUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementStockUIStandardService';
						config.dataServiceName = 'procurementStockHeaderDataService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '27a6fd3705d84c6bb245b7a9ae80ffd8':// procurementInvoiceHeaderFormController
						config = procurementStockUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementStockUIStandardService';
						config.dataServiceName = 'procurementStockHeaderDataService';

						break;
					case 'ca2124f6e99e494591df3b5892a0a30a':// procurementInvoiceHeaderFormController
						config.layout = procurementStockReconciliation2GridColumns.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementStockReconciliation2GridColumns';
						config.dataServiceName = 'procurementStockReconciliation2DataService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '0780abf4d0174c8cb9827ebd6907ac83':// procurementInvoiceHeaderFormController
						config.layout = procurementStockStockTotalReconciliation2GridColumns.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementStockStockTotalReconciliation2GridColumns';
						config.dataServiceName = 'procurementStockStockTotalReconciliation2DataService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '18c130e2310242069db7e14c90f7469b':// procurementStockStockTotalGridController
						config.layout = procurementStockStockTotalUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementStockStockTotalUIStandardService';
						config.dataServiceName = 'procurementStockStockTotalDataService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false, columns: [], options: {
								editable: false,
								readonly: false
							}
						};
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);