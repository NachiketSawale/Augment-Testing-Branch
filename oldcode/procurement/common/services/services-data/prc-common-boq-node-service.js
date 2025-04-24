(function () {

	'use strict';
	var moduleName = 'procurement.common';

	/**
	 * @ngdoc service
	 * @name prcCommonBoqNodeService
	 * @description
	 * supports functions to get boq structure data
	 */
	angular.module(moduleName).factory('prcCommonBoqNodeService', ['procurementContextService', 'prcBoqMainService',
		function (moduleContext, prcBoqMainService) {
			var service = {};
		
			service.getService = function getService() {
				return prcBoqMainService.getService(moduleContext.getMainService());
			};
			
			return service;
		}
	]);
})(angular);
