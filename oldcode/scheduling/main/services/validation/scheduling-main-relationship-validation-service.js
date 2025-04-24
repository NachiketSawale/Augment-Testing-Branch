/**
 * Created by baf on 25.01.2018.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingMainRelationshipValidationService
	 * @description provides validation methods for relationship instances
	 */
	angular.module('scheduling.main').service('schedulingMainRelationshipValidationService', SchedulingMainRelationshipValidationService);

	SchedulingMainRelationshipValidationService.$inject = ['schedulingMainRelationshipValidationServiceFactory', 'schedulingMainRelationshipAllService'];

	function SchedulingMainRelationshipValidationService(schedulingMainRelationshipValidationServiceFactory, schedulingMainRelationshipAllService) {
		schedulingMainRelationshipValidationServiceFactory.initializeRelationshipValidation(this, true, true, schedulingMainRelationshipAllService);
	}

})(angular);
