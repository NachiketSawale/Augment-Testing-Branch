(function () {
	/* global */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainBoqLookupService
	 * @function
	 *
	 * @description
	 * service for boqMainLookupController
	 */
	angular.module(moduleName).factory('boqMainBoqLookupService', ['boqMainServiceFactory',

		function (boqMainServiceFactory) {
			// Avoid that the navigation endpoint is routed to this service and that it triggers the update of the header information.
			var option = {
				'isLookup': true,
				'includeCostGroups': true,
				'doUpdateHeaderInfo': false
			};

			var serviceContainer = boqMainServiceFactory.createNewBoqMainService(option);
			var service = serviceContainer.service;

			// This service is supposed to be readonly
			service.setReadOnly(true);
			serviceContainer.data.updateOnSelectionChanging = null; // Avoid triggering update for this service for it's meant to be readonly.
			serviceContainer.service.isCopySource = true; // In order to distinguish this instance of 'boqMainService' from other ones

			return service;
		}]);
})();

