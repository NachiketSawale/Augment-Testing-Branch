/**
 * Created by zos on 8/31/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.package';
	var module = angular.module(moduleName);

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc service
	 * @name procurementPackageEstimateHeaderDataService
	 * @function
	 *
	 * @description
	 * procurementPackageEstimateHeaderDataService is the data service for all estimate related functionality in the module package.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementPackageEstimateHeaderDataService',
		['$q','$http','$injector','$log','platformDataServiceFactory','procurementPackageDataService',
			function ($q,$http,$injector,$log,platformDataServiceFactory,procurementPackageDataService) {
				var packageLineItemServiceOptions = {
					flatNodeItem: {
						module: module,
						serviceName: 'procurementPackageEstimateHeaderDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/header/',
							endRead: 'getlistbypackagefk',
							initReadData: initReadData,
							usePostForRead: true
						},
						entityRole: {
							node: {
								itemName: 'EstHeader',
								parentService : procurementPackageDataService
							}
						},
						presenter: {list: {incorporateDataRead: incorporateDataRead}},
						entitySelection: {},
						useItemFilter: true
					}
				};

				function initReadData(readData) {
					var select = procurementPackageDataService.getSelected()||{};
					readData.packageFk = (select.Id||-1);
					return readData;
				}

				var serviceContainer = platformDataServiceFactory.createNewComplete(packageLineItemServiceOptions);
				var service = serviceContainer.service;

				service.canCreate = service.canDelete = function(){
					return false;
				};


				const procurementCommonFilterJobVersionToolService = $injector.get('procurementCommonFilterJobVersionToolService');

				return service;

				// ///////////////////////////

				function incorporateDataRead(responseData, data) {
					let highlightJobIds = [];
					responseData = procurementCommonFilterJobVersionToolService.filterIncorporateDataRead(service, responseData, highlightJobIds);
					let result = data.handleReadSucceeded(responseData, data, true);
					service.goToFirst();
					procurementCommonFilterJobVersionToolService.initFilterDataMenu(service, procurementPackageDataService, highlightJobIds);
					return result;
				}
			}]);

})(angular);