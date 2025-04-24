/**
 * Created by chk on 4/5/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.invoice';
	// jshint -W072
	angular.module(moduleName).factory('procurementInvoiceImportResultService',
		['$http','platformDataServiceFactory','procurementInvoiceHeaderDataService',
			function ($http,platformDataServiceFactory,headerDataService) {

				var serviceOptions = {
					flatNodeItem: {
						module: angular.module(moduleName),
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/invoice/'
						},
						presenter: {
							list: {}
						},
						entityRole: {leaf: {itemName: 'InvInvoiceImport',parentService:headerDataService}}
					}
				};

				return  platformDataServiceFactory.createNewComplete(serviceOptions).service;
			}]);
})(angular);