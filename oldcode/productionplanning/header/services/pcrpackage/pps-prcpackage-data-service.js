/**
 * Created by lav on 7/24/2020.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.header';
	var angModule = angular.module(moduleName);

	angModule.factory('ppsPrcPackageDataService', DataService);
	DataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor',
		'productionplanningHeaderDataService'];

	function DataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor,
						 parentService) {

		var serviceInfo = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'ppsProcurementPackageDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/header/',
					endRead: 'listprcpkgbyppsheader'
				},
				entityRole: {
					leaf: {
						parentService: parentService
					}
				},
				entitySelection: {supportsMultiSelection: true},
				actions: {
					create: {},
					delete: false
				}
			}
		};

		/*jshint-W003*/
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);
		return container.service;
	}
})(angular);
