/**
 * Created by shen on 31.01.2025
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.project';

	/**
	 * @ngdoc service
	 * @name resourceProjectExecPlannerItemValidationService
	 * @description provides validation methods for execution planner items
	 */
	angular.module(moduleName).service('resourceProjectExecPlannerItemValidationService', ResourceProjectExecPlannerItemValidationService);

	ResourceProjectExecPlannerItemValidationService.$inject = ['platformValidationServiceFactory', 'resourceProjectExePlannerItemDataService',
		'resourceProjectConstantValues'];

	function ResourceProjectExecPlannerItemValidationService(platformValidationServiceFactory, resourceProjectExePlannerItemDataService,
		resourceProjectConstantValues) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceProjectConstantValues.schemes.execPlannerItem, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceProjectConstantValues.schemes.execPlannerItem)
			},
			self,
			resourceProjectExePlannerItemDataService)

	}
})(angular);
