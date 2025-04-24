(function (angular) {
	'use strict';
	var moduleName = 'resource.type';

	/**
	 * @ngdoc service
	 * @name resourceTypePlanningBoardFilterValidationService
	 * @description provides validation methods for resource type planning board filter entities
	 */
	angular.module(moduleName).service('resourceTypePlanningBoardFilterValidationService', ResourceTypePlanningBoardFilterValidationService);

	ResourceTypePlanningBoardFilterValidationService.$inject = ['platformValidationServiceFactory', 'resourceTypeConstantValues', 'resourceTypePlanningBoardFilterDataService'];

	function ResourceTypePlanningBoardFilterValidationService(platformValidationServiceFactory, resourceTypeConstantValues, resourceTypePlanningBoardFilterDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceTypeConstantValues.schemes.planningBoardFilter, {
					mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceTypeConstantValues.schemes.planningBoardFilter)
				},
				self,
				resourceTypePlanningBoardFilterDataService);
	}
})(angular);
