/**
 * Created by zwz on 6/30/2020.
 */
(function () {
	'use strict';

	var moduleName = 'productionplanning.item';
	var itemModule = angular.module(moduleName);

	itemModule.factory('ppsItemLogReportDataService', DataService);
	DataService.$inject = ['ppsCommonLogDataServiceFactory'];
	function DataService(ppsCommonLogDataServiceFactory) {
		var serviceOptions = {
			serviceName: 'ppsItemLogReportDataService',
			parentServiceName: 'productionplanningItemDataService',
			translationServiceName: 'productionplanningItemTranslationService',
			endRead: 'listbyfilter',
			usePostForRead: true
		};
		var service = ppsCommonLogDataServiceFactory.getOrCreateService(serviceOptions);
		return service;
	}
})();