(function() {
	'use strict';
	/* global moment _ */

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsItemTransportableSlotReadonlyProcessor', ppsItemTransportableProcessor);
	ppsItemTransportableProcessor.$inject = ['platformRuntimeDataService'];

	function ppsItemTransportableProcessor(platformRuntimeDataService) {

		const service = {};

		service.processItem = function processItem(item) {
			setSlotReadonly(item);
		};

		function setSlotReadonly(item) {
			const propertyNames = Object.keys(item);

			platformRuntimeDataService.readonly(item, propertyNames.filter(field => field.indexOf('_slot') !== -1)
				.map(column => ({field: column, readonly: true})));
		}

		return service;
	}
})();
