(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsDocumentForFieldOriginProcessor', DocumentProcessor);

	DocumentProcessor.$inject = ['$translate', 'platformRuntimeDataService'];

	function DocumentProcessor($translate, platformRuntimeDataService) {
		var service = {};

		service.processItem = function (item) {
			if (item) {
				let origin = '';

				//origin is assigned based on hierarchical structure
				if (_.isEmpty(origin) && !_.isNil(item.MntRequisitionFk)) {
					origin = $translate.instant('productionplanning.mounting.entityRequisition');
				}
				if (_.isEmpty(origin) && !_.isNil(item.PrcPackageFk)) {
					origin = $translate.instant('productionplanning.item.upstreamItem.prcPkg');
				}
				if (_.isEmpty(origin) && !_.isNil(item.PpsUpstreamItemFk)) {
					origin = $translate.instant('productionplanning.item.upstreamItem.entity');
				}
				if (_.isEmpty(origin) && !_.isNil(item.PpsItemFk)) {
					origin = $translate.instant('productionplanning.item.entityItem');
				}
				if (_.isEmpty(origin) && !_.isNil(item.LgmDispatchHeaderFk)) {
					origin = $translate.instant('logistic.dispatching.headerListTitle');
				}
				if (_.isEmpty(origin) && !_.isNil(item.PpsHeaderFk)) {
					origin = $translate.instant('productionplanning.common.header.headerTitle');
				}
				if (_.isEmpty(origin) && !_.isNil(item.LgmJobFk)) {
					origin = $translate.instant('logistic.job.entityJob');
				}
				if (_.isEmpty(origin) && !_.isNil(item.PrjProjectFk)) {
					origin = $translate.instant('project.main.sourceProject');
				}
				item.Origin = origin;

				platformRuntimeDataService.readonly(item, [{
					field: 'Origin',
					readonly: true
				}]);
			}
		};

		return service;
	}
})(angular);
