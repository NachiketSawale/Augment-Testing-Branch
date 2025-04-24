(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemDocumentProcessor', DocumentProcessor);

	DocumentProcessor.$inject = ['$translate', 'platformRuntimeDataService'];

	function DocumentProcessor($translate, platformRuntimeDataService) {
		var service = {};

		service.processItem = function (item) {
			if (item) {
				if (_.isNil(item.PpsItemFk) && _.isNil(item.PpsUpstreamItemFk)) {
					platformRuntimeDataService.readonly(item, true);
					item.IsReadonly = true;
					item.CanDeleteStatus = false;
				}
			}
		};

		return service;
	}
})(angular);
