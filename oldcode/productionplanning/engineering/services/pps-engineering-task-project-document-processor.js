(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var packageModule = angular.module(moduleName);

	packageModule.factory('ppsEngineeringProjectDocumentProcessor', DocumentProcessor);
	DocumentProcessor.$inject = ['$translate', 'platformRuntimeDataService'];

	function DocumentProcessor($translate, platformRuntimeDataService) {
		var service = {};

		service.processItem = function (item) {
			if (item) {
				platformRuntimeDataService.readonly(item, true);
				item.IsReadonly = true;
				item.CanDeleteStatus = false;
			}
		};

		return service;
	}
})(angular);