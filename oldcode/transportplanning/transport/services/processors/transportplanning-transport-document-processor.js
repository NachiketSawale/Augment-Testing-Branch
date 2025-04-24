(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('transportplanningTransportDocumentProcessor', Processor);

	Processor.$inject = ['$translate', 'platformRuntimeDataService'];

	function Processor($translate, platformRuntimeDataService) {

		var service = {};

		service.processItem = function processItem(item) {
			if (item) {
				if (_.isNil(item.TrsRouteFk)) {
					platformRuntimeDataService.readonly(item, true);
					item.IsReadonly = true;
					item.CanDeleteStatus = false;
				}
				if (!_.isNil(item.PrjProjectFk)) {
					item.Origin = $translate.instant('project.main.sourceProject');
				}
				if (!_.isNil(item.PpsHeaderFk)) {
					item.Origin = $translate.instant('productionplanning.common.header.headerTitle');
				}
				if (!_.isNil(item.LgmJobFk)) {
					item.Origin = $translate.instant('logistic.job.entityJob');
				}
			}
		};

		return service;
	}
})(angular);
