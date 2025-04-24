/**
 * Created by anl on 2/2/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).factory('productionpalnningActivityActivityValidationService', ActivityValidationService);

	ActivityValidationService.$inject = ['productionpalnningActivityActivityValidationFactory',
		'productionplanningActivityActivityDataService'];

	function ActivityValidationService(activityValidationFactory, activityDataService) {
		return activityValidationFactory.createActivityValidationService(activityDataService);
	}

})(angular);
