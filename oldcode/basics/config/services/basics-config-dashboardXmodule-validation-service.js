/**
 * Created by aljami on 27.10.2020.
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';
	var configModule = new angular.module(moduleName);

	configModule.factory('basicsConfigDashboardXModuleValidationService', basicsConfigDashboardXModuleValidationService);

	function basicsConfigDashboardXModuleValidationService() {
		var service = {};
		return service;
	}
})(angular);