(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.transport';
	/**
     * @ngdoc service
     * @name transportplanningTransportPackageProcessor
     * @function
     * @requires
     *
     * @description
     * transportplanningTransportPackageProcessor is the service to process fields.
     *
     */
	angular.module(moduleName).factory('transportplanningTransportPackageProcessor', processor);

	processor.$inject = ['platformRuntimeDataService', '_'];

	function processor(platformRuntimeDataService, _) {

		var service = {};

		service.processItem = function processItem(item) {
			if (item) {
				//in Transport module , the field TrsRouteFk in Package List/Detail Container should be always readonly.
				service.setColumnsReadOnly(item, ['TrsRouteFk'], true);
			}
		};

		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			if(columns.length <= 0){
				return;
			}
			var fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}
})(angular);
