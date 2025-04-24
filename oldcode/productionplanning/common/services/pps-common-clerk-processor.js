
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonClerkProcessor', ClerkProcessor);

	ClerkProcessor.$inject = ['$translate', 'platformRuntimeDataService'];

	function ClerkProcessor($translate, platformRuntimeDataService) {
		var service = {};

		service.processItem = function (item) {
			if (!_.isNil(item.From)) {
				platformRuntimeDataService.readonly(item, true);
				if (item.From === 'PRJ') {
					item.From = $translate.instant('project.main.sourceProject');
				} else if (item.From === 'HEADER') {
					item.From = $translate.instant('productionplanning.common.header.headerTitle');
				} else if (item.From === 'ORDHEADER') {
					item.From = $translate.instant('productionplanning.common.ordHeaderFk');
				} else if (item.From === 'ENGTASK') {
					item.From = $translate.instant('productionplanning.engineering.entityEngTask');
				} else if (item.From === 'PPSITEM') {
					item.From = $translate.instant('productionplanning.item.entityItem');
				}
			}
		};

		return service;
	}
})(angular);
