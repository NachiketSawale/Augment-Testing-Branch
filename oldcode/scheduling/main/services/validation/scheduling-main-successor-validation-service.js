/**
 * Created by baf on 25.01.2018.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingMainSuccessorValidationService
	 * @description provides validation methods for event instances
	 */
	angular.module('scheduling.main').service('schedulingMainSuccessorValidationService', SchedulingMainSuccessorValidationService);

	SchedulingMainSuccessorValidationService.$inject = ['schedulingMainRelationshipValidationServiceFactory', 'schedulingMainSuccessorRelationshipDataService'];

	function SchedulingMainSuccessorValidationService(schedulingMainRelationshipValidationServiceFactory, schedulingMainSuccessorRelationshipDataService) {
		schedulingMainRelationshipValidationServiceFactory.initializeRelationshipValidation(this, false, true, schedulingMainSuccessorRelationshipDataService);
	}

})(angular);
