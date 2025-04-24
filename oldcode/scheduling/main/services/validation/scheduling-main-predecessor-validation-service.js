/**
 * Created by baf on 25.01.2018.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingMainPredecessorValidationService
	 * @description provides validation methods for event instances
	 */
	angular.module('scheduling.main').service('schedulingMainPredecessorValidationService', SchedulingMainPredecessorValidationService);

	SchedulingMainPredecessorValidationService.$inject = ['schedulingMainRelationshipValidationServiceFactory', 'schedulingMainPredecessorRelationshipDataService'];

	function SchedulingMainPredecessorValidationService(schedulingMainRelationshipValidationServiceFactory, schedulingMainPredecessorRelationshipDataService) {
		schedulingMainRelationshipValidationServiceFactory.initializeRelationshipValidation(this, true, false, schedulingMainPredecessorRelationshipDataService);
	}

})(angular);
