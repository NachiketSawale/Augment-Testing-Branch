(function (angular) {
	'use strict';
	/* globals _*/
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * transportplanningTransportProcessor is the service to process fields.
	 *
	 */
	angular.module(moduleName).factory('transportplanningTransportProcessor', transportplanningTransportProcessor);

	transportplanningTransportProcessor.$inject = [
		'basicsLookupdataLookupDescriptorService'
	];

	function transportplanningTransportProcessor(basicsLookupdataLookupDescriptorService) {

		var service = {};

		service.processItem = function processItem(route) {
			// update JobDeliveryAddressRemark when job changed
			var jobDefFk = route.JobDefFk;
			Object.defineProperty(route, 'JobDefFk', {
				get: function () {
					return jobDefFk;
				},
				set: function (value) {
					if (value !== jobDefFk) {
						jobDefFk = value;
						if (!_.isNil(value)) {
							var job = basicsLookupdataLookupDescriptorService.getLookupItem('logisticJobEx', value);
							if (job) {
								route.JobDeliveryAddressRemark = job.DeliveryAddressRemark;
							}
						} else {
							route.JobDeliveryAddressRemark = null;
						}
					}
				}
			});
		};

		return service;
	}
})(angular);
