(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.header';

	angular.module(moduleName).factory('ppsHeaderDocumentProcessor', DocumentProcessor);

	DocumentProcessor.$inject = ['$translate', 'platformRuntimeDataService'];

	function DocumentProcessor($translate, platformRuntimeDataService) {
		var service = {};

		service.processItem = function (item) {
			if (!_.isNil(item.From)) {
				if (item.From === 'PRJ') {
					item.From = $translate.instant('project.main.sourceProject');
				}
				if (item.From === 'PPSHEADER') {
					const editableFields = [{field: 'Description', readonly: false}, {field: 'Barcode', readonly: false}];
					platformRuntimeDataService.readonly(item, editableFields);
				}
			}
		};

		return service;
	}
})(angular);
