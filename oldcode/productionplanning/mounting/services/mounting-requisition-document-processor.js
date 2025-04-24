(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.mounting';
	angular.module(moduleName).factory('productionplanningMountingRequisitionDocumentProcessor', Processor);

	Processor.$inject = ['$translate', 'platformRuntimeDataService', 'ppsDocumentForFieldOriginProcessor'];

	function Processor($translate, platformRuntimeDataService, ppsDocumentForFieldOriginProcessor) {

		var service = {};

		service.processItem = function processItem(item) {
			if (item) {
				if (_.isNil(item.MntRequisitionFk)) {
					platformRuntimeDataService.readonly(item, true);
					item.IsReadonly = true;
					item.CanDeleteStatus = false;
				}
				ppsDocumentForFieldOriginProcessor.processItem(item);
			}
		};

		return service;
	}
})(angular);
