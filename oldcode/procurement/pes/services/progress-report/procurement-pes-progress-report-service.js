
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	var procurementPesModule = angular.module(moduleName);
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementPesProgressReportService
	 * @function
	 *
	 * @description
	 * procurementPesProgressReportService is the data service for all PES progress report related functionality.
	 */
	procurementPesModule.factory('procurementPesProgressReportService',
		['_', 'globals','platformDataServiceFactory', 'procurementContextService', 'prcBoqMainService',
			function (_, globals, platformDataServiceFactory, procurementContextService, prcBoqMainService) {

				prcBoqMainService = prcBoqMainService.getService(procurementContextService.getMainService());

				var factoryOptions = {
					flatLeafItem: {
						module: procurementPesModule,
						serviceName: 'procurementPesProgressReportService',
						httpRead: { route: globals.webApiBaseUrl + 'procurement/common/prcitemassignment/',
							endRead : 'getprogressreport',
							initReadData: function initReadData(readData) {
								var item = prcBoqMainService.getSelected();
								if(item && (item.BoqLineTypeFk === 0 || item.BoqLineTypeFk === 200 || item.BoqLineTypeFk === 201 || item.BoqLineTypeFk === 202 || item.BoqLineTypeFk === 203)){
									readData.BoqItemId = item.Id;
									readData.BoqHeaderId = item.BoqHeaderFk;
								}
							},
							usePostForRead: true
						},
						actions: {},
						presenter: {list: {incorporateDataRead: incorporateDataRead}},
						entityRole: {leaf: {itemName: 'PesProgressReport', parentService: prcBoqMainService}}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
				serviceContainer.service.data = serviceContainer.data;

				function incorporateDataRead(responseData, data) {
					return serviceContainer.data.handleReadSucceeded(responseData, data, true);
				}

				return serviceContainer.service;
			}
		]);
})(angular);
