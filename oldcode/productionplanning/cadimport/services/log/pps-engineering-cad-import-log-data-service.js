/**
 * Created by lav on 7/24/2020.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.cadimport';
	var angModule = angular.module(moduleName);

	angModule.factory('ppsEngineeringCadImportLogDataService', DataService);
	DataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor',
		'ppsCadimportDrawingDataService'];

	function DataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor,
						 parentService) {

		var serviceInfo = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'ppsEngineeringCadImportLogDataService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: function () {
						return parentService.getSelected().PersistObject.Messages;
					}
				},
				entityRole: {
					leaf: {
						itemName: 'ppsEngineeringCadImportLogs',
						parentService: parentService
					}
				},
				entitySelection: {supportsMultiSelection: true}
			}
		};

		/*jshint-W003*/
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		return container.service;
	}
})(angular);
