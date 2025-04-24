/**
 * Created by anl on 6/5/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).factory('productionpalnningEventconfigurationTemplateValidationService', EventTemplateValidationService);

	EventTemplateValidationService.$inject = [];

	function EventTemplateValidationService() {
		return {};
	}

})(angular);